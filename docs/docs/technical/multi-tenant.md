# Multi-Tenant Architecture

## Overview

AutoBlog is designed as a multi-tenant SaaS platform where multiple clients share infrastructure while maintaining complete data isolation. This architecture ensures scalability, cost-effectiveness, and security.

## Tenant Isolation Strategy

### Database-Level Isolation

#### Schema-per-Tenant Approach
```sql
-- Master tenant registry
CREATE SCHEMA autoblog_core;

CREATE TABLE autoblog_core.tenants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    domain VARCHAR(255) UNIQUE,
    schema_name VARCHAR(63) UNIQUE, -- PostgreSQL schema name limit
    status tenant_status DEFAULT 'active',
    subscription_tier subscription_tier_type,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Dynamic schema creation for each tenant
CREATE OR REPLACE FUNCTION create_tenant_schema(tenant_id UUID, tenant_name TEXT)
RETURNS TEXT AS $$
DECLARE
    schema_name TEXT;
BEGIN
    schema_name := 'tenant_' || replace(tenant_id::text, '-', '_');
    
    -- Create tenant schema
    EXECUTE 'CREATE SCHEMA ' || schema_name;
    
    -- Create tenant-specific tables
    EXECUTE format('
        CREATE TABLE %I.brand_configs (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            voice_tone JSONB NOT NULL,
            topics JSONB NOT NULL,
            visual_style JSONB,
            seo_strategy JSONB,
            publishing_config JSONB,
            created_at TIMESTAMP DEFAULT NOW(),
            updated_at TIMESTAMP DEFAULT NOW()
        )', schema_name);
    
    EXECUTE format('
        CREATE TABLE %I.content_pipelines (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            status content_status DEFAULT ''inspiration'',
            inspiration_data JSONB,
            content_brief JSONB,
            generated_content JSONB,
            visual_assets JSONB,
            quality_scores JSONB,
            published_at TIMESTAMP,
            created_at TIMESTAMP DEFAULT NOW(),
            updated_at TIMESTAMP DEFAULT NOW()
        )', schema_name);
    
    EXECUTE format('
        CREATE TABLE %I.content_performance (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            content_id UUID REFERENCES %I.content_pipelines(id),
            metrics JSONB,
            tracked_at TIMESTAMP DEFAULT NOW()
        )', schema_name, schema_name);
    
    -- Update tenant record with schema name
    UPDATE autoblog_core.tenants 
    SET schema_name = schema_name 
    WHERE id = tenant_id;
    
    RETURN schema_name;
END;
$$ LANGUAGE plpgsql;
```

### Application-Level Tenant Resolution

#### Tenant Context Management
```python
from contextvars import ContextVar
from typing import Optional

# Thread-safe tenant context
current_tenant: ContextVar[Optional[str]] = ContextVar('current_tenant', default=None)

class TenantContext:
    """Manages tenant context throughout request lifecycle."""
    
    @staticmethod
    def set_tenant(tenant_id: str) -> None:
        current_tenant.set(tenant_id)
    
    @staticmethod
    def get_tenant() -> Optional[str]:
        return current_tenant.get()
    
    @staticmethod
    def clear_tenant() -> None:
        current_tenant.set(None)
    
    @staticmethod
    def require_tenant() -> str:
        tenant_id = current_tenant.get()
        if not tenant_id:
            raise RuntimeError("No tenant context available")
        return tenant_id

# Decorator for tenant-aware functions
def require_tenant_context(func):
    def wrapper(*args, **kwargs):
        tenant_id = TenantContext.require_tenant()
        return func(*args, tenant_id=tenant_id, **kwargs)
    return wrapper
```

#### Database Connection Management
```python
import asyncio
from typing import Dict
import asyncpg
from asyncpg import Pool

class TenantDatabaseManager:
    """Manages database connections per tenant schema."""
    
    def __init__(self, database_url: str):
        self.database_url = database_url
        self.connection_pools: Dict[str, Pool] = {}
        
    async def get_tenant_pool(self, tenant_id: str) -> Pool:
        """Gets or creates connection pool for tenant schema."""
        if tenant_id not in self.connection_pools:
            # Get tenant schema name
            schema_name = await self._get_tenant_schema(tenant_id)
            
            # Create pool with schema-specific search path
            pool = await asyncpg.create_pool(
                self.database_url,
                server_settings={
                    'search_path': f'{schema_name},public'
                },
                min_size=2,
                max_size=10,
                command_timeout=60
            )
            
            self.connection_pools[tenant_id] = pool
            
        return self.connection_pools[tenant_id]
    
    async def _get_tenant_schema(self, tenant_id: str) -> str:
        """Retrieves schema name for tenant from core registry."""
        # Connect to core schema
        conn = await asyncpg.connect(self.database_url)
        try:
            schema_name = await conn.fetchval(
                "SELECT schema_name FROM autoblog_core.tenants WHERE id = $1",
                tenant_id
            )
            if not schema_name:
                raise ValueError(f"Tenant {tenant_id} not found")
            return schema_name
        finally:
            await conn.close()

# Global database manager instance
db_manager = TenantDatabaseManager(DATABASE_URL)

# Tenant-aware database operations
class TenantRepository:
    """Base repository class with automatic tenant isolation."""
    
    @require_tenant_context
    async def execute_query(self, query: str, *args, tenant_id: str):
        """Executes query in tenant's schema context."""
        pool = await db_manager.get_tenant_pool(tenant_id)
        async with pool.acquire() as conn:
            return await conn.fetch(query, *args)
    
    @require_tenant_context
    async def execute_command(self, command: str, *args, tenant_id: str):
        """Executes command in tenant's schema context."""
        pool = await db_manager.get_tenant_pool(tenant_id)
        async with pool.acquire() as conn:
            return await conn.execute(command, *args)
```

## API-Level Tenant Management

### Authentication & Tenant Resolution
```python
from fastapi import FastAPI, Depends, HTTPException, Header
from fastapi.security import HTTPBearer
import jwt
from typing import Optional

app = FastAPI()
security = HTTPBearer()

class TenantInfo:
    def __init__(self, tenant_id: str, name: str, tier: str):
        self.tenant_id = tenant_id
        self.name = name
        self.tier = tier

async def authenticate_and_resolve_tenant(
    authorization: str = Depends(security)
) -> TenantInfo:
    """
    Authenticates request and resolves tenant context from JWT token.
    """
    try:
        # Decode JWT token
        token = authorization.credentials
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        
        # Extract tenant information
        tenant_id = payload.get("tenant_id")
        if not tenant_id:
            raise HTTPException(status_code=401, detail="No tenant context in token")
        
        # Validate tenant exists and is active
        tenant_info = await validate_tenant(tenant_id)
        
        # Set tenant context for request
        TenantContext.set_tenant(tenant_id)
        
        return tenant_info
        
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

async def validate_tenant(tenant_id: str) -> TenantInfo:
    """Validates tenant exists and is in good standing."""
    # Query core tenant registry
    conn = await asyncpg.connect(DATABASE_URL)
    try:
        tenant = await conn.fetchrow(
            """
            SELECT id, name, subscription_tier, status
            FROM autoblog_core.tenants 
            WHERE id = $1 AND status = 'active'
            """,
            tenant_id
        )
        
        if not tenant:
            raise HTTPException(status_code=403, detail="Tenant not found or inactive")
        
        return TenantInfo(
            tenant_id=str(tenant['id']),
            name=tenant['name'],
            tier=tenant['subscription_tier']
        )
    finally:
        await conn.close()

# Middleware to ensure tenant context cleanup
@app.middleware("http")
async def tenant_context_middleware(request, call_next):
    """Ensures tenant context is cleaned up after request."""
    try:
        response = await call_next(request)
        return response
    finally:
        TenantContext.clear_tenant()
```

### Rate Limiting by Tenant
```python
from collections import defaultdict
import time
from typing import Dict

class TenantRateLimiter:
    """Per-tenant rate limiting with tier-based limits."""
    
    def __init__(self):
        self.request_counts: Dict[str, list] = defaultdict(list)
        self.tier_limits = {
            'starter': 500,    # requests per hour
            'growth': 2000,    # requests per hour 
            'enterprise': 10000  # requests per hour
        }
    
    def check_rate_limit(self, tenant_id: str, tier: str) -> bool:
        """Checks if tenant is within rate limits."""
        now = time.time()
        hour_ago = now - 3600  # 1 hour in seconds
        
        # Clean old requests
        self.request_counts[tenant_id] = [
            req_time for req_time in self.request_counts[tenant_id]
            if req_time > hour_ago
        ]
        
        # Check current count against limit
        current_count = len(self.request_counts[tenant_id])
        limit = self.tier_limits.get(tier, 500)
        
        if current_count >= limit:
            return False
        
        # Add current request
        self.request_counts[tenant_id].append(now)
        return True

rate_limiter = TenantRateLimiter()

@app.middleware("http")
async def rate_limit_middleware(request, call_next):
    """Applies per-tenant rate limiting."""
    # Skip rate limiting for health checks
    if request.url.path in ['/health', '/metrics']:
        return await call_next(request)
    
    # Get tenant info from request context
    # This assumes tenant authentication has already occurred
    tenant_id = TenantContext.get_tenant()
    if tenant_id:
        # Get tenant tier from database or cache
        tenant_info = await get_tenant_info(tenant_id)
        
        if not rate_limiter.check_rate_limit(tenant_id, tenant_info.tier):
            return JSONResponse(
                status_code=429,
                content={"error": "Rate limit exceeded"},
                headers={
                    "Retry-After": "3600",
                    "X-RateLimit-Remaining": "0"
                }
            )
    
    return await call_next(request)
```

## Resource Isolation

### Storage Isolation
```python
import boto3
from typing import AsyncGenerator
import aiofiles

class TenantStorageManager:
    """Manages S3 storage with tenant-specific prefixes."""
    
    def __init__(self, bucket_name: str):
        self.bucket_name = bucket_name
        self.s3_client = boto3.client('s3')
    
    @require_tenant_context
    def get_tenant_prefix(self, tenant_id: str) -> str:
        """Returns S3 prefix for tenant isolation."""
        return f"tenants/{tenant_id}/"
    
    @require_tenant_context
    async def upload_file(self, file_key: str, file_data: bytes, tenant_id: str) -> str:
        """Uploads file to tenant-specific S3 prefix."""
        tenant_prefix = self.get_tenant_prefix(tenant_id)
        full_key = f"{tenant_prefix}{file_key}"
        
        # Upload to S3
        self.s3_client.put_object(
            Bucket=self.bucket_name,
            Key=full_key,
            Body=file_data,
            ServerSideEncryption='AES256',
            Metadata={'tenant_id': tenant_id}
        )
        
        return f"https://{self.bucket_name}.s3.amazonaws.com/{full_key}"
    
    @require_tenant_context
    async def list_files(self, prefix: str = "", tenant_id: str = "") -> list:
        """Lists files in tenant's storage namespace."""
        tenant_prefix = self.get_tenant_prefix(tenant_id)
        full_prefix = f"{tenant_prefix}{prefix}"
        
        response = self.s3_client.list_objects_v2(
            Bucket=self.bucket_name,
            Prefix=full_prefix
        )
        
        return [obj['Key'] for obj in response.get('Contents', [])]

# Global storage manager
storage_manager = TenantStorageManager(S3_BUCKET_NAME)
```

### Cache Isolation
```python
import redis
import json
from typing import Any, Optional

class TenantCacheManager:
    """Redis-based caching with tenant namespace isolation."""
    
    def __init__(self, redis_url: str):
        self.redis_client = redis.from_url(redis_url)
    
    @require_tenant_context
    def _get_tenant_key(self, key: str, tenant_id: str) -> str:
        """Generates tenant-namespaced cache key."""
        return f"tenant:{tenant_id}:{key}"
    
    @require_tenant_context
    async def get(self, key: str, tenant_id: str) -> Optional[Any]:
        """Gets value from tenant's cache namespace."""
        tenant_key = self._get_tenant_key(key, tenant_id)
        value = self.redis_client.get(tenant_key)
        
        if value:
            return json.loads(value)
        return None
    
    @require_tenant_context
    async def set(self, key: str, value: Any, ttl: int = 3600, tenant_id: str = ""):
        """Sets value in tenant's cache namespace."""
        tenant_key = self._get_tenant_key(key, tenant_id)
        serialized_value = json.dumps(value)
        
        self.redis_client.setex(tenant_key, ttl, serialized_value)
    
    @require_tenant_context
    async def delete(self, key: str, tenant_id: str) -> bool:
        """Deletes value from tenant's cache namespace."""
        tenant_key = self._get_tenant_key(key, tenant_id)
        return bool(self.redis_client.delete(tenant_key))
    
    @require_tenant_context
    async def clear_tenant_cache(self, tenant_id: str):
        """Clears all cache entries for a tenant."""
        pattern = f"tenant:{tenant_id}:*"
        keys = self.redis_client.keys(pattern)
        
        if keys:
            self.redis_client.delete(*keys)

cache_manager = TenantCacheManager(REDIS_URL)
```

## AI Pipeline Tenant Isolation

### Queue Management
```python
from celery import Celery
from kombu import Queue

# Tenant-aware Celery configuration
def create_tenant_queues():
    """Creates tenant-specific queues for processing isolation."""
    return [
        Queue('tenant_high_priority', routing_key='tenant.high'),
        Queue('tenant_normal_priority', routing_key='tenant.normal'),
        Queue('tenant_low_priority', routing_key='tenant.low'),
    ]

app = Celery('autoblog')
app.conf.task_routes = {
    'autoblog.tasks.generate_content': {
        'queue': 'tenant_high_priority',
        'routing_key': 'tenant.high'
    },
    'autoblog.tasks.discover_trends': {
        'queue': 'tenant_normal_priority', 
        'routing_key': 'tenant.normal'
    }
}

@app.task(bind=True)
def generate_content_for_tenant(self, tenant_id: str, content_brief: dict):
    """Tenant-isolated content generation task."""
    # Set tenant context for task execution
    TenantContext.set_tenant(tenant_id)
    
    try:
        # Execute content generation with tenant isolation
        content_engine = ContentEngine()
        result = content_engine.generate_blog_post(content_brief)
        
        # Store result in tenant-specific storage
        return result
    finally:
        TenantContext.clear_tenant()
```

### Resource Allocation by Tier
```python
class TenantResourceManager:
    """Manages resource allocation based on subscription tier."""
    
    TIER_LIMITS = {
        'starter': {
            'max_concurrent_generations': 1,
            'max_daily_content': 10,
            'ai_model': 'gpt-4o-mini',
            'image_quality': 'standard'
        },
        'growth': {
            'max_concurrent_generations': 3,
            'max_daily_content': 50,
            'ai_model': 'gpt-4o',
            'image_quality': 'hd'
        },
        'enterprise': {
            'max_concurrent_generations': 10,
            'max_daily_content': -1,  # Unlimited
            'ai_model': 'gpt-4o',
            'image_quality': 'hd'
        }
    }
    
    @require_tenant_context
    async def can_generate_content(self, tenant_id: str) -> bool:
        """Checks if tenant can generate content based on tier limits."""
        tenant_info = await get_tenant_info(tenant_id)
        limits = self.TIER_LIMITS[tenant_info.tier]
        
        # Check concurrent generations
        current_generations = await self._get_active_generations(tenant_id)
        if current_generations >= limits['max_concurrent_generations']:
            return False
        
        # Check daily content limit
        if limits['max_daily_content'] != -1:
            daily_content = await self._get_daily_content_count(tenant_id)
            if daily_content >= limits['max_daily_content']:
                return False
        
        return True
    
    @require_tenant_context
    async def get_ai_model_for_tenant(self, tenant_id: str) -> str:
        """Returns appropriate AI model based on tenant tier."""
        tenant_info = await get_tenant_info(tenant_id)
        return self.TIER_LIMITS[tenant_info.tier]['ai_model']

resource_manager = TenantResourceManager()
```

## Monitoring & Observability

### Tenant-Specific Metrics
```python
from prometheus_client import Counter, Histogram, Gauge
import structlog

# Tenant-aware metrics
TENANT_REQUESTS = Counter(
    'autoblog_tenant_requests_total',
    'Total requests per tenant',
    ['tenant_id', 'endpoint', 'status']
)

TENANT_CONTENT_GENERATION = Histogram(
    'autoblog_content_generation_duration_seconds',
    'Content generation duration by tenant',
    ['tenant_id', 'tier']
)

TENANT_RESOURCE_USAGE = Gauge(
    'autoblog_tenant_resource_usage',
    'Current resource usage per tenant',
    ['tenant_id', 'resource_type']
)

# Structured logging with tenant context
logger = structlog.get_logger()

class TenantAwareLogger:
    """Logger that automatically includes tenant context."""
    
    @staticmethod
    def log(level: str, message: str, **kwargs):
        tenant_id = TenantContext.get_tenant()
        if tenant_id:
            kwargs['tenant_id'] = tenant_id
        
        getattr(logger, level)(message, **kwargs)
    
    @staticmethod
    def info(message: str, **kwargs):
        TenantAwareLogger.log('info', message, **kwargs)
    
    @staticmethod
    def error(message: str, **kwargs):
        TenantAwareLogger.log('error', message, **kwargs)
    
    @staticmethod
    def warning(message: str, **kwargs):
        TenantAwareLogger.log('warning', message, **kwargs)
```

### Health Checks & Tenant Status
```python
@app.get("/health/tenant/{tenant_id}")
async def tenant_health_check(
    tenant_id: str,
    tenant_info: TenantInfo = Depends(authenticate_and_resolve_tenant)
):
    """Checks health status for specific tenant."""
    checks = await asyncio.gather(
        check_tenant_database_connectivity(tenant_id),
        check_tenant_cache_connectivity(tenant_id),
        check_tenant_storage_access(tenant_id),
        check_tenant_ai_quota(tenant_id)
    )
    
    all_healthy = all(checks)
    
    return {
        "tenant_id": tenant_id,
        "status": "healthy" if all_healthy else "degraded",
        "checks": {
            "database": checks[0],
            "cache": checks[1], 
            "storage": checks[2],
            "ai_quota": checks[3]
        },
        "timestamp": datetime.utcnow().isoformat()
    }

async def check_tenant_database_connectivity(tenant_id: str) -> bool:
    """Verifies tenant can access their database schema."""
    try:
        pool = await db_manager.get_tenant_pool(tenant_id)
        async with pool.acquire() as conn:
            await conn.fetchval("SELECT 1")
        return True
    except Exception:
        return False
```

This multi-tenant architecture ensures complete isolation between clients while maintaining operational efficiency and scalability.
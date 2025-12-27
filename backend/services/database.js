import pg from 'pg';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const { Pool } = pg;

// Database configuration
const dbConfig = {
  user: process.env.DB_USER || 'automate_user',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'automate_my_blog',
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT || 5432,
  
  // Connection pool settings
  max: 20,          // Maximum number of clients in pool
  idleTimeoutMillis: 30000,  // How long a client is allowed to remain idle
  connectionTimeoutMillis: 2000, // How long to wait for a connection
};

// Create connection pool
const pool = new Pool(dbConfig);

// Handle pool connection events
pool.on('connect', () => {
  console.log('🔗 New client connected to PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('🚨 Unexpected error on idle client', err);
  process.exit(-1);
});

// Database utility class
class DatabaseService {
  constructor() {
    this.pool = pool;
  }

  /**
   * Execute a query with parameters
   * @param {string} text - SQL query
   * @param {Array} params - Query parameters
   * @returns {Promise<Object>} Query result
   */
  async query(text, params = []) {
    const start = Date.now();
    
    try {
      const result = await this.pool.query(text, params);
      const duration = Date.now() - start;
      
      // Log slow queries (> 1 second)
      if (duration > 1000) {
        console.warn(`🐌 Slow query detected (${duration}ms):`, text);
      }
      
      return result;
    } catch (error) {
      console.error('💥 Database query error:', error);
      console.error('Query:', text);
      console.error('Params:', params);
      throw error;
    }
  }

  /**
   * Get a client from the pool for transactions
   * @returns {Promise<Object>} Database client
   */
  async getClient() {
    try {
      const client = await this.pool.connect();
      return client;
    } catch (error) {
      console.error('Failed to get database client:', error);
      throw error;
    }
  }

  /**
   * Execute multiple queries in a transaction
   * @param {Function} callback - Function that receives client and executes queries
   * @returns {Promise<any>} Transaction result
   */
  async transaction(callback) {
    const client = await this.getClient();
    
    try {
      await client.query('BEGIN');
      const result = await callback(client);
      await client.query('COMMIT');
      return result;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Test database connection
   * @returns {Promise<boolean>} Connection status
   */
  async testConnection() {
    try {
      const result = await this.query('SELECT NOW() as current_time, version() as db_version');
      console.log('✅ Database connection successful');
      console.log('⏰ Server time:', result.rows[0].current_time);
      console.log('🗄️ Database version:', result.rows[0].db_version.split(' ')[0]);
      return true;
    } catch (error) {
      console.error('❌ Database connection failed:', error.message);
      return false;
    }
  }

  /**
   * Get database health information
   * @returns {Promise<Object>} Health stats
   */
  async getHealthStats() {
    try {
      const [
        connectionStats,
        databaseSize,
        activeQueries
      ] = await Promise.all([
        this.query('SELECT * FROM pg_stat_activity WHERE state = \'active\''),
        this.query('SELECT pg_size_pretty(pg_database_size(current_database())) as size'),
        this.query('SELECT COUNT(*) as active_queries FROM pg_stat_activity WHERE state = \'active\'')
      ]);

      return {
        activeConnections: connectionStats.rows.length,
        databaseSize: databaseSize.rows[0].size,
        activeQueries: parseInt(activeQueries.rows[0].active_queries),
        poolTotalCount: this.pool.totalCount,
        poolIdleCount: this.pool.idleCount,
        poolWaitingCount: this.pool.waitingCount
      };
    } catch (error) {
      console.error('Failed to get database health stats:', error);
      throw error;
    }
  }

  /**
   * Close all database connections
   */
  async close() {
    try {
      await this.pool.end();
      console.log('🔒 Database connection pool closed');
    } catch (error) {
      console.error('Error closing database pool:', error);
    }
  }
}

// Create singleton instance
const db = new DatabaseService();

// Export both the instance and the raw pool
export default db;
export { pool };

// Test connection on startup (only in development)
if (process.env.NODE_ENV !== 'production') {
  db.testConnection().catch(error => {
    console.error('Initial database connection test failed:', error);
  });
}
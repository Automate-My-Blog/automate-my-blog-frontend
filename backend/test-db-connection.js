import db from './services/database.js';

// Test database connection
async function testDatabaseConnection() {
  console.log('🧪 Testing database connection...');
  
  try {
    // Test basic connection
    const connectionResult = await db.testConnection();
    
    if (connectionResult) {
      console.log('✅ Basic connection test passed');
      
      // Test health stats
      console.log('🔍 Checking database health...');
      const healthStats = await db.getHealthStats();
      console.log('📊 Database Health Stats:');
      console.log(`   Active Connections: ${healthStats.activeConnections}`);
      console.log(`   Database Size: ${healthStats.databaseSize}`);
      console.log(`   Active Queries: ${healthStats.activeQueries}`);
      console.log(`   Pool Total: ${healthStats.poolTotalCount}`);
      console.log(`   Pool Idle: ${healthStats.poolIdleCount}`);
      
      // Test a simple query
      console.log('🔍 Testing simple query...');
      const result = await db.query('SELECT 1 as test_value, $1 as param_test', ['Hello Database!']);
      console.log('✅ Query test passed:', result.rows[0]);
      
    } else {
      console.log('❌ Database connection test failed');
      process.exit(1);
    }
    
  } catch (error) {
    console.error('💥 Database connection error:', error.message);
    
    // Check if it's a common connection error
    if (error.code === 'ECONNREFUSED') {
      console.log('\n🚨 Connection refused. Please check:');
      console.log('   1. PostgreSQL is running');
      console.log('   2. Database exists: automate_my_blog');
      console.log('   3. User exists: automate_user');
      console.log('   4. Credentials in .env are correct');
      console.log('   5. Host/Port are accessible');
    } else if (error.code === '3D000') {
      console.log('\n🚨 Database does not exist. Please create:');
      console.log('   createdb automate_my_blog');
    } else if (error.code === '28P01') {
      console.log('\n🚨 Authentication failed. Please check:');
      console.log('   1. Username and password in .env');
      console.log('   2. User permissions in PostgreSQL');
    }
    
    process.exit(1);
  } finally {
    // Close the connection
    await db.close();
  }
}

// Run the test
testDatabaseConnection();
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

/**
 * MySQL Connection Pool Configuration
 * 
 * Purpose:
 * Manages reusable database sockets using mysql2 Promise wrapper.
 */
const poolConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'railway_planner',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

// Create Promise-based Connection Pool
export const dbPool = mysql.createPool(poolConfig);

/**
 * Test Database Connection on Startup
 */
export async function testConnection() {
  try {
    const connection = await dbPool.getConnection();
    console.log('✅ Connected to MySQL Database (railway_planner)');
    connection.release(); // Release connection back to pool
    return true;
  } catch (error) {
    console.warn(`⚠️ MySQL Connection Warning: ${error.message}`);
    console.warn('ℹ️ Falling back to in-memory datasets if MySQL server is not locally running.');
    return false;
  }
}

export default dbPool;

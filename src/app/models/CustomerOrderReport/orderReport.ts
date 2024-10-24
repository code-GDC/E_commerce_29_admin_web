import pool from '../../lib/dbConfig';  // Import the connection pool

export async function getOrderReport() {
  try {
    const [rows, fields]: [any, any] = await pool.execute('CALL GetOrderReport()');
    return rows[0];  // Return the actual data
  } catch (error: any) {
    console.error('Database error:', error);
    throw new Error('Database query failed: ' + error.message);
  }
}
// models/CustomerOrderReport/orderReport.ts
import pool from '../../lib/dbConfig';  // Import the connection pool

export async function getOrderReport() {
  try {
    const [rows, fields]: [any[], any] = await pool.execute('CALL GetOrderReport()');
    
    // Check if rows are returned correctly and return the first array only
    return rows[0] || [];  // Return the actual order data or an empty array if not available
  } catch (error: any) {
    console.error('Database error:', error);
    throw new Error('Database query failed: ' + error.message);
  }
}

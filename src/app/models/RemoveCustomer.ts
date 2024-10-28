import pool from '../lib/dbConfig';  // Import the connection pool

export async function unregisterCustomer(userId: number) {
  try {
    await pool.execute('DELETE from user where UserID = ?', [userId]);
  } catch (error: any) {
    console.error('Database error:', error);
    throw new Error('Database query failed: ' + error.message);
  }
}
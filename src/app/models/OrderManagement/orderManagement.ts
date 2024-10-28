import pool from '../../lib/dbConfig';  // Import the connection pool

export async function getOrders() {
  try {
    const [rows]: [any, any] = await pool.execute('CALL GetOrdersForRemove()');
    return rows[0];  // Return only the relevant data
  } catch (error: any) {
    console.error('Database error:', error);
    throw new Error('Database query failed: ' + error.message);
  }
}

export async function removeOrder(orderId: number) {
  try {
    await pool.execute('CALL RemoveOrder(?)', [orderId]);
  } catch (error: any) {
    console.error('Database error:', error);
    throw new Error('Database query failed: ' + error.message);
  }
}
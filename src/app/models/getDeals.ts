import pool from '../lib/dbConfig';  // Import the connection pool

// Function to get the total deals (order count)
export async function getDeals() {
  const query = `SELECT COUNT(OrderID) AS totalDeals FROM ecommerce4.order`;  // SQL query to count orders

  try {
    const [rows] = await pool.execute(query);
    const totalDeals = (rows as any[])[0]?.totalDeals;  // Extract totalDeals
    console.log('Extracted totalDeals:', totalDeals);  // Log for debugging
    return totalDeals;
  } catch (error: any) {
    console.error('Database error:', error);
    throw new Error('Database query failed: ' + error.message);
  }
}

import pool from '../lib/dbConfig';  // Import the connection pool

// Function to get the user count
export async function getUserCount() {
  const query = `
    SELECT COUNT(*) AS userCount
    FROM ecommercedb.user
  `;

  try {
    const [rows] = await pool.execute(query);
    const userCount = (rows as any[])[0]?.userCount;  // Extract the userCount from the first row
    return userCount;
  } catch (error: any) {
    console.error('Database error:', error);
    throw new Error('Database query failed: ' + error.message);
  }
}

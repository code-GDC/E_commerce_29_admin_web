import pool from '../lib/dbConfig';  // Import the connection pool

// Function to get the total revenue
export async function getRevenue() {
  const query = `CALL GetTotalRevenue()`;  // Stored procedure call

  try {
    const [rows] = await pool.execute(query);
    console.log('Raw revenue rows:', rows);  // Log for debugging
    const totalRevenue = (rows as any[])[0][0].totalRevenue;  // Extract totalRevenue
    console.log('Extracted totalRevenue:', totalRevenue);  // Log the extracted value
    return totalRevenue;
  } catch (error: any) {
    console.error('Database error:', error);
    throw new Error('Database query failed: ' + error.message);
  }
}

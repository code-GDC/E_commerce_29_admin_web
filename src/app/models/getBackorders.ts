import pool from '../lib/dbConfig';  // Import the connection pool

// Function to get the backorders
export async function getBackorders() {
  const query = `CALL GetBackorderQuantities()`;  // SQL query to call the stored procedure

  try {
    const [rows] = await pool.execute(query);
    const backorders = (rows as any[])[0];  // Extract backorders
    console.log('Extracted backorders:', backorders);
    return backorders;
  } catch (error: any) {
    console.error('Database error:', error);
    throw new Error('Database query failed: ' + error.message);
  }
}
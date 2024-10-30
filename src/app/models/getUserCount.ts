import pool from '../lib/dbConfig';  // Import the connection pool
import { RowDataPacket } from 'mysql2';  // Import RowDataPacket type

// Function to get the user count

export async function getUserCount(): Promise<number> {
  const query = `SELECT GetUserCount() AS userCount;`;  // Call the SQL function


  try {
    // Execute the query
    const [rows] = await pool.query<RowDataPacket[]>(query);

    // Check if the result set contains rows and extract user count
    if (rows.length > 0 && rows[0].userCount !== null) {
      const userCount = rows[0].userCount;  // Extract the user count
      return userCount;  // Return the total user count
    } else {
      throw new Error('No user count returned from GetUserCount function.');
    }
  } catch (error: any) {
    console.error('Database error:', error);
    throw new Error('Database query failed: ' + error.message);
  }
}

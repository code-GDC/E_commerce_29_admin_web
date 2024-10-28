import pool from '../lib/dbConfig';

// Function to get the list of customers
export async function getCustomerList() {
  const query = `CALL GetUsers()`; // Stored procedure

  try {
    const [rows, fields]: [any, any] = await pool.execute(query);
    const customerList = rows[0]; // Assuming the first result set contains customer list

    console.log('Extracted customer list:', customerList); // Log for debugging
    return customerList;
  } catch (error: any) {
    console.error('Database error:', error);
    throw new Error('Database query failed: ' + error.message);
  }
}

import pool from '../../lib/dbConfig';  // Import the connection pool

// Define the expected structure of category order data
type CategoryOrderData = {
  categoryName: string;
  orderCount: number;
};

// Function to get the top 10 most ordered product categories
export async function getTopOrderedCategories(): Promise<CategoryOrderData[]> {
  const query = `CALL GetTopCategories();`;  // Call the stored procedure

  try {
    const [rows]: [CategoryOrderData[], any] = await pool.query(query) as [CategoryOrderData[], any];

    // Check if the rows are in the expected format
    if (!Array.isArray(rows) || rows.length === 0) {
      throw new Error('No data returned from the stored procedure');
    }

    return rows;  // Return the fetched rows
  } catch (error: any) {
    console.error('Database error:', error);
    throw new Error('Database query failed: ' + error.message);
  }
}
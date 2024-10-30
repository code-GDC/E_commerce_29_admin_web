import pool from '../../lib/dbConfig';  // Import the connection pool
import { RowDataPacket } from 'mysql2'; // Importing RowDataPacket for typing

// Define the structure for product data
type ProductData = {
  Title: string;
  ProductID: number;
};

// Function to get product titles
export async function getProductTitles(): Promise<ProductData[]> {
  const query = `CALL GetProductTitles();`; // Call the stored procedure

  try {
    // Execute the query and destructure the results
    const [rows] = await pool.execute<RowDataPacket[]>(query);
    
    // Assuming the stored procedure returns a result set, 
    // ensure to extract the first result set if there are multiple
    const products = rows[0] as ProductData[]; // Access the first result set

    return products;
  } catch (error: any) {
    console.error('Database error:', error); // Log the error for debugging
    throw new Error('Database query failed: ' + error.message); // Throw an error with message
  }
}

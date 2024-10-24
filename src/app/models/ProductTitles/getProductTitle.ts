import pool from '../../lib/dbConfig';  // Import the connection pool

// Define the structure for product data
type ProductData = {
  Title: string;
  ProductID: number;
};

// Function to get product titles
export async function getProductTitles(): Promise<ProductData[]> {
  const query = `
    SELECT Title, ProductID
    FROM product
  `;

  try {
    const [rows] = await pool.execute(query);
    return rows as ProductData[];
  } catch (error: any) {
    console.error('Database error:', error);
    throw new Error('Database query failed: ' + error.message);
  }
}
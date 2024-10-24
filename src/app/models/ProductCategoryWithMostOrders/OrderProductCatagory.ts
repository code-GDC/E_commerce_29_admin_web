import pool from '../../lib/dbConfig';  // Import the connection pool

// Define the expected structure of category order data
type CategoryOrderData = {
  categoryName: string;
  orderCount: number;
};

// Function to get the top 10 most ordered product categories
export async function getTopOrderedCategories(): Promise<CategoryOrderData[]> {
  const query = `
    SELECT c.categoryName, COUNT(o.OrderID) AS orderCount
    FROM category c
    LEFT JOIN product p ON c.categoryID = p.categoryID
    LEFT JOIN variant v ON p.productID = v.productID
    LEFT JOIN orderitem o ON v.variantID = o.variantID
    GROUP BY c.categoryID
    ORDER BY orderCount DESC
    LIMIT 10;
  `;

  try {
    const [rows]: [CategoryOrderData[], any] = await pool.query(query) as [CategoryOrderData[], any];
    return rows;
  } catch (error: any) {
    console.error('Database error:', error);
    throw new Error('Database query failed: ' + error.message);
  }
}
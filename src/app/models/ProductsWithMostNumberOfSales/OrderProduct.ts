import pool from '../../lib/dbConfig';  // Import the connection pool
import { RowDataPacket } from 'mysql2/promise';

// Define the structure for product sales data
type ProductSalesData = {
  productName: string;
  month: string; // Month in 'YYYY-MM' format
  totalQuantitySold: number;
};

// Function to get the most sold products in a given period grouped by month
export async function getProductSalesData(startDate: string, endDate: string): Promise<ProductSalesData[]> {
  const query = `
    SELECT p.Title AS productName, 
           DATE_FORMAT(o.OrderDate, '%Y-%m') AS month,  -- Extract year and month
           SUM(oi.Quantity) AS totalQuantitySold
    FROM orderitem oi
    JOIN variant v ON oi.VariantID = v.VariantID
    JOIN product p ON v.ProductID = p.ProductID
    JOIN \`order\` o ON oi.OrderID = o.OrderID
    WHERE o.OrderDate BETWEEN ? AND ?
    GROUP BY p.Title, month  -- Group by product and month
    ORDER BY month, p.Title;
  `;

  try {
    const [rows] = await pool.query<RowDataPacket[]>(query, [startDate, endDate]);
    return rows.map(row => ({
      productName: row.productName,
      month: row.month,
      totalQuantitySold: row.totalQuantitySold,
    }));
  } catch (error: any) {
    console.error('Database error:', error);
    throw new Error('Database query failed: ' + error.message);
  }
}
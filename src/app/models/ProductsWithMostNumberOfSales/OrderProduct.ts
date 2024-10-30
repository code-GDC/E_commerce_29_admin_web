import pool from '../../lib/dbConfig';  // Import the connection pool
import { RowDataPacket } from 'mysql2';

// Define the expected structure of product sales data
type ProductSalesData = {
  productName: string;
  month: string;
  totalQuantitySold: number;
};

// Function to get the product sales data by month
export async function getProductSalesData(startDate: string, endDate: string): Promise<ProductSalesData[]> {
  const query = `
    call GetProductSalesByMonth(?, ?);
  `;

  try {
    const [rows] = await pool.query<RowDataPacket[][]>(query, [startDate, endDate]);
    console.log('Extracted product sales data:', rows); // Log for debugging

    // Ensure the correct structure of the returned data
    return rows[0].map(row => ({
      productName: row.productName,
      month: row.month,
      totalQuantitySold: parseInt(row.totalQuantitySold, 10), // Convert to number
    }));
  } catch (error: any) {
    console.error('Database error:', error);
    throw new Error('Database query failed: ' + error.message);
  }
}
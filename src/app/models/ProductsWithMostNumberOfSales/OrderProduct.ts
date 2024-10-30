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
    call GetProductsWithMostNumberOfSales(?, ?);
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
import { NextRequest, NextResponse } from 'next/server';
import pool from '../../lib/dbConfig';  // Import the connection pool
import { RowDataPacket } from 'mysql2/promise';

// Define the structure for product sales data
type ProductSalesData = {
  productName: string;
  month: string; // Month in 'YYYY-MM' format
  totalQuantitySold: number;
};

// API handler to get the most sold products in a given period grouped by month
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');

  if (!startDate || !endDate) {
    return NextResponse.json({ error: 'Invalid date range provided' }, { status: 400 });
  }

  try {
    // Query to get total quantity sold per product, grouped by month for the given date range
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

    // Use the pool to execute the query
    const [rows] = await pool.query<RowDataPacket[]>(query, [startDate, endDate]);

    // Map the results to the ProductSalesData structure
    const products: ProductSalesData[] = rows.map(row => ({
      productName: row.productName,
      month: row.month,  // Add month to the mapped data
      totalQuantitySold: row.totalQuantitySold,
    }));

    return NextResponse.json({ data: products });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'An unknown error occurred' }, { status: 500 });
  }
}

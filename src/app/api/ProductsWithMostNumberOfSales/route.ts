import { NextRequest, NextResponse } from 'next/server';
import mysql, { RowDataPacket } from 'mysql2/promise';

// Define the structure for product sales data
type ProductSalesData = {
  productName: string;
  month: string; // Month in 'YYYY-MM' format
  totalQuantitySold: number;
};

// Function to connect to the MySQL database
const connectToDatabase = async () => {
  try {
    const connection = await mysql.createConnection({
      host: process.env.MYSQL_HOST,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
      port: Number(process.env.MYSQL_PORT),
    });
    return connection;
  } catch (error) {
    throw new Error('Failed to connect to the database');
  }
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
    const connection = await connectToDatabase();

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

    const [rows] = await connection.query<RowDataPacket[]>(query, [startDate, endDate]);

    // Map the results to the ProductSalesData structure
    const products: ProductSalesData[] = rows.map(row => ({
      productName: row.productName,
      month: row.month,  // Add month to the mapped data
      totalQuantitySold: row.totalQuantitySold,
    }));

    await connection.end();

    return NextResponse.json({ data: products });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'An unknown error occurred' }, { status: 500 });
  }
}
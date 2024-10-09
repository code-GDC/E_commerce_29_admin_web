import { NextRequest, NextResponse } from 'next/server';
import mysql, { RowDataPacket } from 'mysql2/promise';

// Define the structure for the most interest period data
type MostInterestPeriodData = {
  month: string;
  totalOrders: number;
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

// API handler to get the most interest period for a given product
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const productId = searchParams.get('productId');

  if (!productId) {
    return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
  }

  try {
    const connection = await connectToDatabase();

    const query = `
      SELECT 
        DATE_FORMAT(o.OrderDate, '%Y-%m') AS month, 
        COUNT(oi.OrderID) AS totalOrders
      FROM 
        orderitem oi
      JOIN 
        \`order\` o ON oi.OrderID = o.OrderID
      JOIN 
        variant v ON oi.VariantID = v.VariantID
      JOIN 
        product p ON v.ProductID = p.ProductID
      WHERE 
        p.ProductID = ?
      GROUP BY 
        month
      ORDER BY 
        totalOrders DESC
      LIMIT 1;
    `;

    // Execute the query with proper typing
    const [rows] = await connection.query<RowDataPacket[]>(query, [productId]);

    // Check if any rows were returned
    if (rows.length === 0) {
      return NextResponse.json({ message: 'No data found for this product' }, { status: 404 });
    }

    // Cast rows to the expected type
    const result: MostInterestPeriodData = {
      month: rows[0].month,
      totalOrders: rows[0].totalOrders,
    };

    await connection.end();

    return NextResponse.json({ data: result });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'An unknown error occurred' }, { status: 500 });
  }
}

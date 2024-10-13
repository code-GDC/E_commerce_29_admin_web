import { NextRequest, NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

// Define the expected structure of category order data
type CategoryOrderData = {
  categoryName: string;
  orderCount: number;
};

// Connect to the database
const connectToDatabase = async () => {
  console.log('Connecting to the database...');
  try {
    const connection = await mysql.createConnection({
      host: process.env.MYSQL_HOST,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
      port: Number(process.env.MYSQL_PORT),
    });
    console.log('Database connected successfully');
    return connection;
  } catch (error) {
    console.error('Database connection error:', (error as Error).message);
    throw error; // Rethrow the error to be caught in the GET handler
  }
};

// API handler for getting the top 10 most ordered product categories
export async function GET(req: NextRequest) {
  try {
    const connection = await connectToDatabase();

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

    const [rows]: [CategoryOrderData[], any] = await connection.query(query) as [CategoryOrderData[], any];

    await connection.end();

    return NextResponse.json({ connectionStatus: 'Connected', data: rows }); // Return array of categories
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Database error:', error.message);
      return NextResponse.json({ connectionStatus: 'Disconnected', error: 'Database query failed: ' + error.message }, { status: 500 });
    } else {
      console.error('An unknown error occurred:', error);
      return NextResponse.json({ connectionStatus: 'Disconnected', error: 'An unknown error occurred' }, { status: 500 });
    }
  }
}
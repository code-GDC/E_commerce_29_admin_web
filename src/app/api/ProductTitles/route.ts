import { NextRequest, NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

// Database connection setup
const connectToDatabase = async () => {
  return await mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    port: Number(process.env.MYSQL_PORT),
  });
};

// API to get product titles
export async function GET(req: NextRequest) {
  try {
    const connection = await connectToDatabase();

    // Query to get product titles from the Product table
    const query = `
      SELECT Title, ProductID
      FROM product
    `;

    const [rows] = await connection.execute(query);

    await connection.end();

    // Return the product titles as JSON
    return NextResponse.json({ products: rows });
  } catch (error: any) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Database query failed: ' + error.message }, { status: 500 });
  }
}

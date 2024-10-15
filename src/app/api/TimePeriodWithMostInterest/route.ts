import { NextRequest, NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

// Function to establish a MySQL connection
async function connectToDatabase() {
  const connection = await mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    port: Number(process.env.MYSQL_PORT),
  });
  return connection;
}

// API route handler using GET method
export async function GET(req: NextRequest) {
  // Get 'productId' from the URL search parameters
  const { searchParams } = new URL(req.url);
  const productId = searchParams.get('productId');

  // Check if productId is provided
  if (!productId) {
    return NextResponse.json({ error: 'Missing productId parameter' }, { status: 400 });
  }

  try {
    // Connect to the database
    const connection = await connectToDatabase();

    // Execute stored procedure for product interest
    const [rows] = await connection.query('CALL GetProductInterest(?)', [productId]);
    await connection.end();

    // Handle case where no data is returned
    if (!Array.isArray(rows) || rows.length === 0) {
      return NextResponse.json({ error: 'No data found for the given productId' }, { status: 404 });
    }

    // Return the result data
    return NextResponse.json({ data: rows[0] });
  } catch (error: any) {
    // Log and return the error
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Database query failed: ' + error.message }, { status: 500 });
  }
}

// Export a handler for unsupported methods
export async function POST() {
  return NextResponse.json({ error: 'Method Not Allowed' }, { status: 405 });
}

export async function DELETE() {
  return NextResponse.json({ error: 'Method Not Allowed' }, { status: 405 });
}

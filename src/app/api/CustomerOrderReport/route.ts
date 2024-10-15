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

// API handler function
export async function GET(req: NextRequest) {
  try {
    const connection = await connectToDatabase();

    // Call the stored procedure
    const [rows, fields]: [any, any] = await connection.execute('CALL GetOrderReport()');

    await connection.end();

    // Return the data as JSON
    return NextResponse.json({ orders: rows[0] });  // Use rows[0] to return the actual data
  } catch (error: any) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Database query failed: ' + error.message }, { status: 500 });
  }
}

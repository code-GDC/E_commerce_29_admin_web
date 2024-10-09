import { NextRequest, NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

type SalesData = {
  quarter: string;
  sales: number;
};

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
  const { searchParams } = new URL(req.url);
  const year = searchParams.get('year');
  const category = searchParams.get('category');

  try {
    const connection = await connectToDatabase();

    // Call stored procedure with year and category parameters
    const [rows] = await connection.execute(
      `CALL GetSalesByQuarter(?, ?)`,
      [year || null, category || null]
    );

    // Extract the actual result set from the stored procedure's response
    const salesData: SalesData[] = (rows as any[][])[0].map(row => ({
      quarter: `Q${row.quarter}`,  // Map quarter from 1-4 to Q1, Q2, etc.
      sales: row.sales,            // Map sales values from the query result
    }));

    await connection.end();

    // Return both quarters and sales as part of the response for clarity
    return NextResponse.json({ sales: salesData });
  } catch (error: any) {
    console.error('Database error:', error);  // Log the full error for debugging
    return NextResponse.json({ error: 'Database query failed: ' + error.message }, { status: 500 });
  }
}

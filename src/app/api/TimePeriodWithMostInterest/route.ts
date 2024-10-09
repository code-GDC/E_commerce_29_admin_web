import { NextRequest, NextResponse } from "next/server";
import mysql from 'mysql2/promise';

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

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const searchTerm = searchParams.get('search') || ''; // Correctly retrieve the search term using 'search'

  try {
    const connection = await connectToDatabase();
    
    const [rows]: [any[], any[]] = await connection.execute(
      'CALL SearchProductTitles(?)',
      [searchTerm]
    );

    await connection.end();

    console.log("API Response:", rows[0]); // Log the response

    return NextResponse.json({ products: rows[0] }); // rows[0] contains the actual data
  } catch (error: any) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Database query failed: ' + error.message }, { status: 500 });
  }
}


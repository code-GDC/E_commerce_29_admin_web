// src/pages/api/ProductTitles.ts

import { NextRequest, NextResponse } from 'next/server';
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
  const searchTerm = searchParams.get('search') || '';

  console.log('Search term received:', searchTerm);

  try {
    const connection = await connectToDatabase();
    const [rows] = await connection.execute('CALL SearchProductTitles(?)', [`%${searchTerm}%`]);
    console.log('Product titles from database:', rows);
    await connection.end();

    return NextResponse.json({ products: rows });
  } catch (error: any) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Database query failed: ' + error.message }, { status: 500 });
  }
}

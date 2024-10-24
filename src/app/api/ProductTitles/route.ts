import { NextRequest, NextResponse } from 'next/server';
import pool from '../../lib/dbConfig';  // Import the connection pool

// API to get product titles
export async function GET(req: NextRequest) {
  try {
    // Query to get product titles from the Product table
    const query = `
      SELECT Title, ProductID
      FROM product
    `;

    // Use the connection pool to execute the query
    const [rows] = await pool.execute(query);

    // Return the product titles as JSON
    return NextResponse.json({ products: rows });
  } catch (error: any) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Database query failed: ' + error.message }, { status: 500 });
  }
}

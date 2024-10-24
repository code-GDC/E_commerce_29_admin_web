import { NextRequest, NextResponse } from 'next/server';
import pool from '../../lib/dbConfig';  // Import the connection pool

// API handler function
export async function GET(req: NextRequest) {
  try {
    // Use the connection pool to execute the query
    const [rows, fields]: [any, any] = await pool.execute('CALL GetOrderReport()');

    // Return the data as JSON
    return NextResponse.json({ orders: rows[0] });  // Use rows[0] to return the actual data
  } catch (error: any) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Database query failed: ' + error.message }, { status: 500 });
  }
}

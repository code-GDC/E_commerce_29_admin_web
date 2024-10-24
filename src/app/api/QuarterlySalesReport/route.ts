import { NextRequest, NextResponse } from 'next/server';
import pool from '../../lib/dbConfig';  // Import the connection pool

type SalesData = {
  quarter: string;
  sales: number;
};

// API handler function
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const year = searchParams.get('year');
  const category = searchParams.get('category');

  try {
    // Call stored procedure with year and category parameters using the connection pool
    const [rows] = await pool.execute(
      `CALL GetSalesByQuarter(?, ?)`,
      [year || null, category || null]
    );

    // Extract the actual result set from the stored procedure's response
    const salesData: SalesData[] = (rows as any[][])[0].map(row => ({
      quarter: `Q${row.quarter}`,  // Map quarter from 1-4 to Q1, Q2, etc.
      sales: row.sales,            // Map sales values from the query result
    }));

    // Return both quarters and sales as part of the response for clarity
    return NextResponse.json({ sales: salesData });
  } catch (error: any) {
    console.error('Database error:', error);  // Log the full error for debugging
    return NextResponse.json({ error: 'Database query failed: ' + error.message }, { status: 500 });
  }
}

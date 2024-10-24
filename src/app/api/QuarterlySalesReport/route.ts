import { NextRequest, NextResponse } from 'next/server';
import { getSalesByQuarter } from '../../models/QuarterlySalesReport/getQsales';  // Import the new function

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
    const salesData: SalesData[] = await getSalesByQuarter(year, category);  // Call the function to get sales data
    return NextResponse.json({ sales: salesData });
  } catch (error: any) {
    console.error('Database error:', error);  // Log the full error for debugging
    return NextResponse.json({ error: 'Database query failed: ' + error.message }, { status: 500 });
  }
}
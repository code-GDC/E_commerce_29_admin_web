import { NextRequest, NextResponse } from 'next/server';
import { getOrderReport } from '../../models/CustomerOrderReport/orderReport';  // Import the new function

// API handler function
export async function GET(req: NextRequest) {
  try {
    const orders = await getOrderReport();  // Call the function to get the order report
    return NextResponse.json({ orders });  // Return the data as JSON
  } catch (error: any) {
    console.error('Database error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
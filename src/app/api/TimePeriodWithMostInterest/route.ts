import { NextRequest, NextResponse } from "next/server";
import { getSalesInterest } from '../../models/TimePeriodWithMostInterest/getOrderTime';  // Import the new function

// API handler function
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const productId = searchParams.get('productId');
  const period = searchParams.get('period');  // year, week, etc.

  try {
    const data = await getSalesInterest(productId, period);  // Call the function to get sales interest data
    return NextResponse.json({ data });
  } catch (error: any) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Database query failed: ' + error.message }, { status: 500 });
  }
}
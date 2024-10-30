import { NextRequest, NextResponse } from "next/server";
import { getBackorders } from '../../models/getBackorders';  // Import the getDeals function

// API handler for getting the total deals (order count)
export async function GET(req: NextRequest) {
  try {
    const totalDeals = await getBackorders();  // Fetch total deals from the database
    return NextResponse.json({ connectionStatus: 'Connected', totalDeals });  // Return as JSON
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Database error:', error.message);
      return NextResponse.json({ connectionStatus: 'Disconnected', error: 'Database query failed: ' + error.message }, { status: 500 });
    } else {
      console.error('An unknown error occurred:', error);
      return NextResponse.json({ connectionStatus: 'Disconnected', error: 'An unknown error occurred' }, { status: 500 });
    }
  }
}
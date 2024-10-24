import { NextRequest, NextResponse } from 'next/server';
import { getRevenue } from '../../models/getRevenue';  // Import the getRevenue function

// API handler for getting the total revenue
export async function GET(req: NextRequest) {
  try {
    console.log('Fetching total revenue...');
    const totalRevenue = await getRevenue();  // Fetch total revenue from the database
    console.log('Total revenue fetched:', totalRevenue);
    return NextResponse.json({ connectionStatus: 'Connected', totalRevenue });  // Return as JSON
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

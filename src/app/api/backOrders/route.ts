import { NextRequest, NextResponse } from 'next/server';
import { getBackorders } from '../../models/getBackorders';  // Import the function

// API handler for getting the backorders
export async function GET(req: NextRequest) {
  try {
    const backorders = await getBackorders();  // Fetch backorders from the database
    console.log('Fetched backorders:', backorders);  // Add this line
    return NextResponse.json({ connectionStatus: 'Connected', backorders });  // Return as JSON
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
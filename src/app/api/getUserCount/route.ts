import { NextRequest, NextResponse } from 'next/server';
import { getUserCount } from '../../models/getUserCount';  // Import the corrected function

// API handler for getting the user count
export async function GET(req: NextRequest) {
  try {
    const userCount = await getUserCount();  // Call the function to get the user count
    return NextResponse.json({ connectionStatus: 'Connected', userCount });  // Return the user count
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

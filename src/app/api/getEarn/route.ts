import { NextRequest, NextResponse } from 'next/server';
import { getEarn } from '../../models/getEarn';  // Adjust the path to your getEarn function

// API handler for fetching earnings per month
export async function GET(req: NextRequest) {
  try {
    const earningsPerMonth = await getEarn();  // Fetch earnings data from the database
    return NextResponse.json({
      connectionStatus: 'Connected',
      earningsPerMonth  // Return the earnings data
    });
  } catch (error) {
    console.error('Error fetching earnings:', error);
    return NextResponse.json({
      connectionStatus: 'Disconnected',
      error: 'Failed to fetch earnings'
    }, { status: 500 });
  }
}

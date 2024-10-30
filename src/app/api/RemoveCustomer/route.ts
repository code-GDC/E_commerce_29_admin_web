import { NextRequest, NextResponse } from 'next/server';
import { unregisterCustomer } from '../../models/RemoveCustomer';  // Import the function

// API handler function to unregister a customer
export async function POST(req: NextRequest) {
  const { userId } = await req.json();

  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }

  try {
    await unregisterCustomer(Number(userId));  // Call the function to unregister the customer
    return NextResponse.json({ message: 'Customer deleted successfully' });
  } catch (error: any) {
    console.error('Database error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
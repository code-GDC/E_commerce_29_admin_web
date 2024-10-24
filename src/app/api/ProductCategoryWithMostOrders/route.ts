import { NextRequest, NextResponse } from 'next/server';
import { getTopOrderedCategories } from '../../models/ProductCategoryWithMostOrders/OrderProductCatagory';  // Import the new function

// API handler for getting the top 10 most ordered product categories
export async function GET(req: NextRequest) {
  try {
    const data = await getTopOrderedCategories();  // Call the function to get the top ordered categories
    return NextResponse.json({ connectionStatus: 'Connected', data });  // Return array of categories
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
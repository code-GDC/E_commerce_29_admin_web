import { NextRequest, NextResponse } from 'next/server';
import { getProductSalesData } from '../../models/ProductsWithMostNumberOfSales/OrderProduct';  // Import the new function

// API handler to get the most sold products in a given period grouped by month
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');

  if (!startDate || !endDate) {
    return NextResponse.json({ error: 'Invalid date range provided' }, { status: 400 });
  }

  try {
    const products = await getProductSalesData(startDate, endDate);  // Call the function to get the product sales data
    return NextResponse.json({ data: products });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'An unknown error occurred' }, { status: 500 });
  }
}
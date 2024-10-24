import { NextRequest, NextResponse } from 'next/server';
import { getProductTitles } from '../../models/ProductTitles/getProductTitle';  // Import the new function

// API to get product titles
export async function GET(req: NextRequest) {
  try {
    const products = await getProductTitles();  // Call the function to get the product titles
    return NextResponse.json({ products });
  } catch (error: any) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Database query failed: ' + error.message }, { status: 500 });
  }
}
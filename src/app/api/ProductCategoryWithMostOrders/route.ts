import { NextRequest, NextResponse } from 'next/server';
import pool from '../../lib/dbConfig';  // Import the connection pool

// Define the expected structure of category order data
type CategoryOrderData = {
  categoryName: string;
  orderCount: number;
};

// API handler for getting the top 10 most ordered product categories
export async function GET(req: NextRequest) {
  try {
    // Use the connection pool to execute the query
    const query = `
      SELECT c.categoryName, COUNT(o.OrderID) AS orderCount
      FROM category c
      LEFT JOIN product p ON c.categoryID = p.categoryID
      LEFT JOIN variant v ON p.productID = v.productID
      LEFT JOIN orderitem o ON v.variantID = o.variantID
      GROUP BY c.categoryID
      ORDER BY orderCount DESC
      LIMIT 10;
    `;

    const [rows]: [CategoryOrderData[], any] = await pool.query(query) as [CategoryOrderData[], any];

    return NextResponse.json({ connectionStatus: 'Connected', data: rows }); // Return array of categories
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

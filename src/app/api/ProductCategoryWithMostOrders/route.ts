import { NextRequest, NextResponse } from 'next/server';
import pool from '../../lib/dbConfig';  // Import the connection pool

// Define the expected structure of category order data
type CategoryOrderData = {
  categoryName: string;
  orderCount: number;
};


// API handler for getting most ordered product category
export async function GET(req: NextRequest) {
  let connection;

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
      console.error('Error executing stored procedure:', error.message);

      // If there's an issue with the connection, ensure it gets closed
      if (connection) {
        try {
          await connection.end();
        } catch (closeError) {
          console.error('Failed to close the database connection:', (closeError as Error).message);
        }
      }

      return NextResponse.json(
        { connectionStatus: 'Disconnected', error: 'Database query failed: ' + error.message },
        { status: 500 }
      );
    } else {
      console.error('An unknown error occurred:', error);

      return NextResponse.json(
        { connectionStatus: 'Disconnected', error: 'An unknown error occurred' },
        { status: 500 }
      );
    }
  }
}

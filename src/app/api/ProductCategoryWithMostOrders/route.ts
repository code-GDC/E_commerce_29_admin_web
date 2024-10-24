import { NextRequest, NextResponse } from 'next/server';
import { getTopOrderedCategories } from '../../models/ProductCategoryWithMostOrders/OrderProductCatagory';  // Import the new function


// API handler for getting most ordered product category
export async function GET(req: NextRequest) {
  let connection;

  try {
    const data = await getTopOrderedCategories();  // Call the function to get the top ordered categories
    return NextResponse.json({ connectionStatus: 'Connected', data });  // Return array of categories
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
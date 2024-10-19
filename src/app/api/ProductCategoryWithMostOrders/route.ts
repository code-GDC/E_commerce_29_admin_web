import { NextRequest, NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

// Define the expected structure of category order data
type CategoryOrderData = {
  categoryName: string;
  orderCount: number;
};

// Connect to the database
const connectToDatabase = async () => {
  console.log('Connecting to the database...');
  try {
    const connection = await mysql.createConnection({
      host: process.env.MYSQL_HOST,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
      port: Number(process.env.MYSQL_PORT),
    });
    console.log('Database connected successfully');
    return connection;
  } catch (error) {
    console.error('Database connection error:', (error as Error).message);
    throw new Error('Failed to connect to the database: ' + (error as Error).message); // Rethrow with a clear message
  }
};

// API handler for getting the top 10 most ordered product categories
export async function GET(req: NextRequest) {
  let connection;

  try {
    connection = await connectToDatabase();

    // Execute the stored procedure defined in the database
    const query = `CALL GetTopCategories();`;

    const [rows]: [CategoryOrderData[], any] = await connection.query(query) as [CategoryOrderData[], any];

    if (!rows || rows.length === 0) {
      throw new Error('No data returned from the stored procedure.');
    }

    await connection.end();

    return NextResponse.json({ connectionStatus: 'Connected', data: rows[0] }); // Return array of categories (rows[0] since it's from CALL)
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

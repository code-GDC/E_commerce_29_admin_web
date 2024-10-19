import { NextRequest, NextResponse } from 'next/server';
import mysql, { RowDataPacket } from 'mysql2/promise';

// Define the structure for product sales data
type ProductSalesData = {
  productName: string;
  month: string; // Month in 'YYYY-MM' format
  totalQuantitySold: number;
};

// Function to connect to the MySQL database
const connectToDatabase = async () => {
  try {
    const connection = await mysql.createConnection({
      host: process.env.MYSQL_HOST,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
      port: Number(process.env.MYSQL_PORT),
    });
    return connection;
  } catch (error) {
    throw new Error('Failed to connect to the database: ' + (error as Error).message);
  }
};

// API handler to get the most sold products in a given period grouped by month
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');

  if (!startDate || !endDate) {
    return NextResponse.json({ error: 'Invalid date range provided' }, { status: 400 });
  }

  let connection;

  try {
    connection = await connectToDatabase();

    // Call the stored procedure
    const query = `CALL GetProductSalesByMonth(?, ?);`;
    const [rows]: [RowDataPacket[], any] = await connection.query(query, [startDate, endDate]);

    // Check if the procedure returned any data
    if (!rows || rows.length === 0 || rows[0].length === 0) {
      throw new Error('No data returned from the stored procedure.');
    }

    // Map the results to the ProductSalesData structure
    const products: ProductSalesData[] = rows[0].map((row: RowDataPacket) => ({
      productName: row.productName,
      month: row.month,
      totalQuantitySold: row.totalQuantitySold,
    }));

    return NextResponse.json({ data: products });

  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error during database operation:', error.message);

      return NextResponse.json(
        { error: 'Database query failed: ' + error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'An unknown error occurred' },
      { status: 500 }
    );

  } finally {
    if (connection) {
      try {
        await connection.end();
      } catch (closeError) {
        console.error('Failed to close the database connection:', (closeError as Error).message);
      }
    }
  }
}

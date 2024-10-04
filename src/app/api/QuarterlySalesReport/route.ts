import { NextRequest, NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

// Type definitions for expected response
type SalesData = {
  quarter: string;
  sales: number;
};

// Database connection setup
const connectToDatabase = async () => {
  return await mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    port: Number(process.env.MYSQL_PORT),
  });
};

// API handler function
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const year = searchParams.get('year');
  const category = searchParams.get('category');

  try {
    const connection = await connectToDatabase();

    // SQL Query depending on filters
    let query = `
      SELECT 
        QUARTER(s.sale_date) as quarter, 
        SUM(s.sales_amount) as sales 
      FROM sales s
      JOIN products p ON s.product_id = p.product_id
    `;
    
    let queryParams: (string | number)[] = [];

    // Modify the query based on selected filters
    if (year && category) {
      query += ` WHERE YEAR(s.sale_date) = ? AND p.category = ?`;
      queryParams.push(year, category);
    } else if (year && !category) {
      query += ` WHERE YEAR(s.sale_date) = ?`;
      queryParams.push(year);
    } else if (!year && category) {
      query += ` WHERE p.category = ?`;
      queryParams.push(category);
    }

    query += ` GROUP BY QUARTER(s.sale_date) ORDER BY QUARTER(s.sale_date)`;

    // Execute the query
    const [rows] = await connection.execute(query, queryParams);

    // Format the data
    const salesData: SalesData[] = (rows as any[]).map(row => ({
      quarter: `Q${row.quarter}`,
      sales: row.sales,
    }));

    await connection.end();

    // Return the fetched data
    return NextResponse.json({ sales: salesData.map(data => data.sales) });
  } catch (error: any) {
    console.error('Database error:', error.message);
    return NextResponse.json({ error: 'Database query failed: ' + error.message }, { status: 500 });
  }
}

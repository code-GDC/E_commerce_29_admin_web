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
    QUARTER(o.OrderDate) AS quarter, 
    SUM(oi.Quantity) AS sales 
  FROM 
    \`order\` o 
    LEFT JOIN orderitem oi USING(OrderID) 
    LEFT JOIN variant v USING(VariantID) 
    LEFT JOIN product p USING(ProductID) 
`;

   
    let queryParams: (string | number)[] = [];

    // Modify the query based on selected filters
    if (year && category) {
      query += ` WHERE YEAR(o.OrderDate) = ? AND ecommercedb.GetMainCategory(p.CategoryID) COLLATE utf8mb4_unicode_ci = ?`;
      queryParams.push(year, category);
    } else if (year && !category) {
      query += ` WHERE YEAR(o.OrderDate) = ?`;
      queryParams.push(year);
    } else if (!year && category) {
      query += ` WHERE ecommercedb.GetMainCategory(p.CategoryID) COLLATE utf8mb4_unicode_ci= ?`;
      queryParams.push(category);
    }

    query += ` GROUP BY QUARTER(o.OrderDate) ORDER BY QUARTER(o.OrderDate)`;

    // Execute the query with the appropriate parameters
    const [rows] = await connection.execute(query, queryParams);

    // Format the data, ensuring both quarter and sales are returned
    const salesData: SalesData[] = (rows as any[]).map(row => ({
      quarter: `Q${row.quarter}`,  // Map quarter from 1-4 to Q1, Q2, etc.
      sales: row.sales,            // Map sales values from the query result
    }));

    await connection.end();

    // Return both quarters and sales as part of the response for clarity
    return NextResponse.json({ sales: salesData });
  } catch (error: any) {
    console.error('Database error:', error);  // Log the full error for debugging
    return NextResponse.json({ error: 'Database query failed: ' + error.message }, { status: 500 });
  }
}

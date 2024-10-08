import { NextRequest, NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

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
  try {
    const connection = await connectToDatabase();

    // SQL query to get the required fields for the report
    const query = `
      SELECT 
        o.OrderID, 
        o.OrderDate, 
        u.UserID, 
        CONCAT(u.FirstName, ' ', u.LastName) AS CustomerName,
        o.OrderTotal, 
        o.PaymentMethod, 
        o.DeliveryType 
      FROM 
        \`order\` o
        LEFT JOIN user u ON o.UserID = u.UserID
      ORDER BY 
        o.OrderDate DESC
    `;

    // Execute the query
    const [rows] = await connection.execute(query);

    await connection.end();

    // Return the data as JSON
    return NextResponse.json({ orders: rows });
  } catch (error: any) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Database query failed: ' + error.message }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import mysql from 'mysql2/promise';

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get('productId');
    const period = searchParams.get('period');  // year, week, etc.
  
    try {
      const connection = await connectToDatabase();
  
      let groupByClause = '';
      if (period === 'year') {
        groupByClause = 'YEAR(o.OrderDate)';
      } else if (period === 'week') {
        groupByClause = 'YEAR(o.OrderDate), WEEK(o.OrderDate)';
      }
  
      const query = `
        SELECT ${groupByClause} AS timePeriod, SUM(oi.Quantity) AS interest
        FROM orderitem oi
        LEFT JOIN \`order\` o ON oi.OrderID = o.OrderID
        Left JOIN variant v ON oi.VariantID = v.VariantID
        WHERE v.ProductID = ?
        GROUP BY ${groupByClause}
        ORDER BY ${groupByClause}
      `;
  
      const [rows] = await connection.execute(query, [productId]);
  
      await connection.end();
  
      return NextResponse.json({ data: rows });
    } catch (error: any) {
      console.error('Database error:', error);
      return NextResponse.json({ error: 'Database query failed: ' + error.message }, { status: 500 });
    }
  }
  



async function connectToDatabase() {
    const connection = await mysql.createConnection({
        host: process.env.MYSQL_HOST,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DATABASE,
        port: Number(process.env.MYSQL_PORT),
    });
    return connection;
}
  
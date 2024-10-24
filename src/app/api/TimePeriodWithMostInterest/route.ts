import { NextRequest, NextResponse } from "next/server";
import pool from '../../lib/dbConfig';  // Import the connection pool

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const productId = searchParams.get('productId');
  const period = searchParams.get('period');  // year, week, etc.

  try {
    // Build the GROUP BY clause dynamically based on the period
    let groupByClause = '';
    if (period === 'year') {
      groupByClause = 'YEAR(o.OrderDate)';
    } else if (period === 'week') {
      groupByClause = 'YEAR(o.OrderDate), WEEK(o.OrderDate)';
    }

    // Query to get sales interest by the given time period (year or week)
    const query = `
      SELECT ${groupByClause} AS timePeriod, SUM(oi.Quantity) AS interest
      FROM orderitem oi
      LEFT JOIN \`order\` o ON oi.OrderID = o.OrderID
      LEFT JOIN variant v ON oi.VariantID = v.VariantID
      WHERE v.ProductID = ?
      GROUP BY ${groupByClause}
      ORDER BY ${groupByClause}
    `;

    // Use the connection pool to execute the query
    const [rows] = await pool.execute(query, [productId]);

    // Return the result as JSON
    return NextResponse.json({ data: rows });
  } catch (error: any) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Database query failed: ' + error.message }, { status: 500 });
  }
}

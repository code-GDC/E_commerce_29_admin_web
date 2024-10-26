import pool from '../../lib/dbConfig';

export async function getSalesInterest(productId: string | null, period: string | null) {
  let groupByClause = '';
  let selectClause = '';

  // Adjust SELECT and GROUP BY clauses based on the period
  if (period === 'year') {
    groupByClause = 'YEAR(o.OrderDate)';
    selectClause = 'YEAR(o.OrderDate) AS timePeriod';
  } else if (period === 'month') {
    groupByClause = 'YEAR(o.OrderDate), MONTH(o.OrderDate)';
    selectClause = "DATE_FORMAT(o.OrderDate, '%Y-%m') AS timePeriod";  // Combines year and month
  }

  const query = `
    SELECT ${selectClause}, SUM(oi.Quantity) AS interest
    FROM orderitem oi
    LEFT JOIN \`order\` o ON oi.OrderID = o.OrderID
    LEFT JOIN variant v ON oi.VariantID = v.VariantID
    WHERE v.ProductID = ?
    GROUP BY ${groupByClause}
    ORDER BY ${groupByClause}
  `;

  try {
    // Disable ONLY_FULL_GROUP_BY for the session
    await pool.execute("SET SESSION sql_mode = (SELECT REPLACE(@@sql_mode, 'ONLY_FULL_GROUP_BY', ''))");

    const [rows] = await pool.execute(query, [productId]);
    return rows;
  } catch (error: any) {
    console.error('Database error:', error);
    throw new Error('Database query failed: ' + error.message);
  }
}
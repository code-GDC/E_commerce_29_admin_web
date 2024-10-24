import pool from '../../lib/dbConfig';  // Import the connection pool

// Function to get sales interest by the given time period (year or week)
export async function getSalesInterest(productId: string | null, period: string | null) {
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

  try {
    const [rows] = await pool.execute(query, [productId]);
    return rows;
  } catch (error: any) {
    console.error('Database error:', error);
    throw new Error('Database query failed: ' + error.message);
  }
}
import pool from '../../lib/dbConfig';  // Import the connection pool

type SalesData = {
  quarter: string;
  sales: number;
};

// Function to get sales data by quarter
export async function getSalesByQuarter(year: string | null, category: string | null): Promise<SalesData[]> {
  const query = `CALL GetSalesByQuarter(?, ?)`;

  try {
    const [rows] = await pool.execute(query, [year, category]);
    return (rows as any[][])[0].map(row => ({
      quarter: `Q${row.quarter}`,  // Map quarter from 1-4 to Q1, Q2, etc.
      sales: row.sales,            // Map sales values from the query result
    }));
  } catch (error: any) {
    console.error('Database error:', error);
    throw new Error('Database query failed: ' + error.message);
  }
}
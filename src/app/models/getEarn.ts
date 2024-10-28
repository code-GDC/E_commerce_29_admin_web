import pool from '../lib/dbConfig'; // Your database connection pool

export async function getEarn() {
    const query = 'CALL GetMonthlyEarnings2024();';

    try {
        // Execute the query and expect the result in rows
        const [rows]: [any, any] = await pool.execute(query);
        
        // Log the raw result from the database
        console.log('Raw earnings rows:', rows);
        
        // Assuming the first result set contains the earnings data
        if (Array.isArray(rows) && rows[0]) {
            const earningsPerMonth = rows[0].map((row: EarningsRow) => ({
                month: row.Month,
                totalEarnings: row.TotalEarnings,
            }));

            // Log the formatted earnings data
            console.log('Formatted earnings:', earningsPerMonth);

            return earningsPerMonth;
        } else {
            throw new Error('Unexpected data format received from the database');
        }
    } catch (error) {
        console.error('Database error:', error);
        if (error instanceof Error) {
            throw new Error('Database query failed: ' + error.message);
        } else {
            throw new Error('Database query failed: ' + String(error));
        }
    }
}

// Interface for the earnings row
interface EarningsRow {
    Month: string;
    TotalEarnings: number;
}

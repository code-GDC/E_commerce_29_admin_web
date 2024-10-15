// src/pages/api/ProductInterest.ts

import { NextApiRequest, NextApiResponse } from 'next';
import mysql from 'mysql2/promise';

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

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const productId = req.query.productId as string;

  console.log('Product ID received:', productId);

  if (!productId) {
    return res.status(400).json({ error: 'Missing productId parameter' });
  }

  try {
    const connection = await connectToDatabase();
    const [rows] = await connection.query('CALL GetProductInterest(?)', [productId]);
    console.log('Interest data from database:', rows);
    await connection.end();

    if (!Array.isArray(rows) || rows.length === 0) {
      return res.status(404).json({ error: 'No data found for the given productId' });
    }

    res.status(200).json({ data: rows[0] });
  } catch (error: any) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Database query failed: ' + error.message });
  }
}

import mysql from 'mysql2/promise';

const connectionParams = {
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    port: Number(process.env.MYSQL_PORT),
    charset: 'utf8mb4',
};

let pool: mysql.Pool;

try {
    pool = mysql.createPool(connectionParams);
    console.log('Database connection pool created successfully.');
} catch (error) {
    console.error('Error creating database connection pool:', error);
    process.exit(1); // Exit the process with a failure code
}

export default pool;

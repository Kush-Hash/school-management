import dotenv from "dotenv";
dotenv.config();
import mysql from "mysql2/promise";

const pool = mysql.createPool({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASS || " ",
    database: process.env.DB_NAME || "school_db",
    port: Number(process.env.DB_PORT) || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

export async function query(sql, params) {
    const [rows] = await pool.execute(sql, params);
    return rows;
}

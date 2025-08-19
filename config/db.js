import dotenv from "dotenv";
import mysql from "mysql2/promise";
import fs from "fs";

dotenv.config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    ssl: {
        ca: fs.readFileSync(process.env.DB_CA)
    }
});

export async function query(sql, params) {
    const [rows] = await pool.execute(sql, params);
    return rows;
}


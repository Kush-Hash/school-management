import dotenv from "dotenv";
import mysql from "mysql2/promise";

dotenv.config();

const pool = mysql.createPool(process.env.DB_URL);

export async function query(sql, params) {
    const [rows] = await pool.execute(sql, params);
    return rows;
}

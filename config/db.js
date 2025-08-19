import dotenv from "dotenv";
import mysql from "mysql2/promise";
import fs from "fs";

dotenv.config();
console.log("DB_CA from env:", process.env.DB_CA);

let sslConfig;


if (process.env.DB_CA?.includes("BEGIN CERTIFICATE")) {

    sslConfig = { ca: process.env.DB_CA };
} else if (process.env.DB_CA) {
    sslConfig = { ca: fs.readFileSync(process.env.DB_CA) };
} else {
    sslConfig = undefined; // No SSL
}

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    ssl: sslConfig
});

export async function query(sql, params) {
    const [rows] = await pool.execute(sql, params);
    return rows;
}

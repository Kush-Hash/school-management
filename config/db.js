import dotenv from "dotenv";
import mysql from "mysql2/promise";
import fs from "fs";

dotenv.config();
console.log("DB_CA from env:", process.env.DB_CA);

let sslConfig;

// Check if DB_CA looks like a file path (local dev) or an inline certificate (Render env)
if (process.env.DB_CA?.includes("BEGIN CERTIFICATE")) {
    // Case 1: certificate directly stored in env variable (Render)
    sslConfig = { ca: process.env.DB_CA };
} else if (process.env.DB_CA) {
    // Case 2: path to certificate file (local dev)
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

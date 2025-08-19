import dotenv from "dotenv";
dotenv.config();
import express from 'express'
import { query } from "./config/db.js";
import { validateSchool } from "./middlewares.js";
import calculateDistance from "./utils/distance.js";

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
    res.send("Root Directory")
})

app.post("/addSchool", validateSchool, async (req, res) => {
    try {
        const { name, address, latitude, longitude } = req.body;

        const sql = `INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)`;

        await query(sql, [name, address, latitude, longitude]);

        res.status(201).json({ message: "School added successfully" });

    } catch (error) {
        console.error("Error inserting school:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
})


app.get("/listSchools", async (req, res) => {
    try {
        const { lat, lon } = req.query;
        if (!lat || !lon) {
            return res.status(400).json({ error: "Latitude and Longitude required" });
        }

        const schools = await query("SELECT * FROM schools");

        const sortedSchools = schools
            .map(school => ({
                ...school,
                distance: calculateDistance(
                    parseFloat(lat),
                    parseFloat(lon),
                    school.latitude,
                    school.longitude
                )
            }))
            .sort((a, b) => a.distance - b.distance);

        res.json(sortedSchools);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
});
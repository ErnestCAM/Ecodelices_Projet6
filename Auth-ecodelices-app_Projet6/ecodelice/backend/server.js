import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import { pool } from "./db.js";  // On utilise la connexion

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Route test qui interroge la base
app.get("/api/products", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM products");
    res.json(rows);
  } catch (error) {
    console.error("Erreur requête SQL:", error.message);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Serveur backend lancé sur le port ${PORT}`);
});

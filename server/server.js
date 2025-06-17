const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const cors = require("cors");

const app = express();
const PORT = 3000;

// Base de datos
const dbPath = path.resolve(__dirname, "database.db");
const db = new sqlite3.Database(dbPath);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.resolve(__dirname, "../public")));

// Crear tabla si no existe
db.run(`
  CREATE TABLE IF NOT EXISTS alumnos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT,
    apellido TEXT,
    correo TEXT,
    carrera TEXT
  )
`);

// Rutas
app.get("/api/alumnos", (req, res) => {
  db.all("SELECT * FROM alumnos", (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post("/api/alumnos", (req, res) => {
  const { nombre, apellido, correo, carrera } = req.body;
  const stmt = `INSERT INTO alumnos (nombre, apellido, correo, carrera) VALUES (?, ?, ?, ?)`;
  db.run(stmt, [nombre, apellido, correo, carrera], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: this.lastID });
  });
});

app.put("/api/alumnos/:id", (req, res) => {
  const { nombre, apellido, correo, carrera } = req.body;
  const { id } = req.params;
  const stmt = `
    UPDATE alumnos SET nombre = ?, apellido = ?, correo = ?, carrera = ?
    WHERE id = ?
  `;
  db.run(stmt, [nombre, apellido, correo, carrera, id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ changes: this.changes });
  });
});

app.delete("/api/alumnos/:id", (req, res) => {
  const { id } = req.params;
  db.run(`DELETE FROM alumnos WHERE id = ?`, id, function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ deleted: this.changes });
  });
});

module.exports = app;

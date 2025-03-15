const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "crud_db"
});

db.connect(err => {
  if (err) throw err;
  console.log("MySQL Connected...");
});

// Create User
app.post("/api/users", (req, res) => {
  const { name, email } = req.body;
  db.query("INSERT INTO users (name, email) VALUES (?, ?)", [name, email], (err, result) => {
    if (err) return res.status(500).send(err);
    res.send(result);
  });
});

// Read Users
app.get("/api/users", (req, res) => {
  db.query("SELECT * FROM users", (err, results) => {
    if (err) return res.status(500).send(err);
    res.send(results);
  });
});

// Update User
app.put("/api/users/:id", (req, res) => {
  const { name, email } = req.body;
  const { id } = req.params;
  db.query("UPDATE users SET name=?, email=? WHERE id=?", [name, email, id], (err, result) => {
    if (err) return res.status(500).send(err);
    res.send(result);
  });
});

// Delete User
app.delete("/api/users/:id", (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM users WHERE id=?", [id], (err, result) => {
    if (err) return res.status(500).send(err);
    res.send(result);
  });
});

app.listen(5000, () => console.log("Server running on port 5000"));

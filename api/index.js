const express = require("express");
const sqlite3 = require("sqlite3").verbose();

const app = express();
app.use(express.json());

const db = new sqlite3.Database("user.db");

app.get("/", (req, res) => res.send("Express on Vercel"));

// Create user table
db.serialize(() => {
    db.run("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, email TEXT)");
});

// Get all users
app.get("/users", (req, res) => {
    db.all("SELECT * FROM users", (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

// Get user by ID
app.get("/users/:id", (req, res) => {
    const { id } = req.params;
    db.get("SELECT * FROM users WHERE id = ?", [id], (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (!row) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        res.json(row);
    });
});

// Create user
app.post("/users", (req, res) => {
    const { name, email } = req.body;
    db.run("INSERT INTO users (name, email) VALUES (?, ?)", [name, email], function (err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ id: this.lastID });
    });
});

// Update user by ID
app.put("/users/:id", (req, res) => {
    const { name, email } = req.body;
    const { id } = req.params;
    db.run("UPDATE users SET name = ?, email = ? WHERE id = ?", [name, email, id], (err) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ message: "User updated successfully" });
    });
});

// Delete user by ID
app.delete("/users/:id", (req, res) => {
    const { id } = req.params;
    db.run("DELETE FROM users WHERE id = ?", [id], (err) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ message: "User deleted successfully" });
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server ready on port ${PORT}`);
});
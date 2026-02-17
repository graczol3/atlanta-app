const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
app.use(cors());
app.use(express.json());

// 🔐 Połączenie z Supabase (PostgreSQL)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

pool.connect()
  .then(() => console.log("✅ Połączono z PostgreSQL (Supabase)"))
  .catch(err => console.error("❌ Błąd połączenia:", err.message));


// ================= LOGIN =================
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query(
      `SELECT * FROM users WHERE email = $1 AND password = $2`,
      [email, password]
    );

    if (result.rows.length > 0) {
      return res.json({ success: true, user: result.rows[0] });
    }

    res.status(401).json({ success: false });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ================= REGISTER =================
app.post('/api/register', async (req, res) => {
  const { email, password, firstName, lastName } = req.body;

  try {
    await pool.query(
      `INSERT INTO users (email, password, role, firstName, lastName, createdAt)
       VALUES ($1, $2, 'najemca', $3, $4, NOW())`,
      [email, password, firstName, lastName]
    );

    res.status(201).json({ success: true });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ================= PROFILE =================
app.get('/api/profile/:email', async (req, res) => {
  const email = req.params.email;

  try {
    const result = await pool.query(
      `SELECT * FROM users WHERE email = $1`,
      [email]
    );

    if (result.rows.length > 0) {
      return res.json({ success: true, user: result.rows[0] });
    }

    res.status(404).json({ success: false });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ================= UPDATE PROFILE =================
app.put('/api/update-profile', async (req, res) => {
  const { email, firstName, lastName, phone, address } = req.body;

  try {
    await pool.query(
      `UPDATE users
       SET firstName = $1,
           lastName = $2,
           phone = $3,
           address = $4
       WHERE email = $5`,
      [firstName, lastName, phone, address, email]
    );

    res.json({ success: true });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ================= DELETE ACCOUNT =================
app.delete('/api/delete-account', async (req, res) => {
  const { email } = req.body;

  try {
    await pool.query(
      `DELETE FROM users WHERE email = $1`,
      [email]
    );

    res.json({ success: true });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


app.listen(process.env.PORT || 5001, () =>
  console.log(`🚀 Serwer działa`)
);

const express = require('express');
const sql = require('mssql');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const dbConfig = {
    user: 'sa',
    password: 'Atlanta123!',
    server: '127.0.0.1',
    port: 1433,
    database: 'AtlantaDB',
    options: {
        encrypt: false,
        trustServerCertificate: true
    }
};

let pool;

sql.connect(dbConfig)
    .then(p => {
        pool = p;
        console.log("✅ POŁĄCZONO Z BAZĄ SQL SERVER");
    })
    .catch(err => {
        console.error("❌ BŁĄD POŁĄCZENIA:", err.message);
    });


// ================= ADMIN LOGIN =================
app.post('/api/admin-login', async (req, res) => {
    const { email, password } = req.body;

    console.log("📨 POST /api/admin-login");

    try {
        const result = await pool.request()
            .input('email', sql.NVarChar, email)
            .input('password', sql.NVarChar, password)
            .query(`
                SELECT Email, Role 
                FROM Users 
                WHERE Email = @email AND Password = @password AND Role = 'admin'
            `);

        if (result.recordset.length > 0) {
            return res.json({ success: true, admin: result.recordset[0] });
        }

        res.status(401).json({ success: false });

    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false });
    }
});


// ================= NAJEMCA LOGIN =================
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const result = await pool.request()
            .input('email', sql.NVarChar, email)
            .input('password', sql.NVarChar, password)
            .query(`
                SELECT Email, Role, FirstName, LastName, Phone, Address
                FROM Users
                WHERE Email = @email AND Password = @password AND Role = 'najemca'
            `);

        if (result.recordset.length > 0) {
            return res.json({ success: true, user: result.recordset[0] });
        }

        res.status(401).json({ success: false });

    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false });
    }
});


// ================= REJESTRACJA =================
app.post('/api/register', async (req, res) => {
    const { email, password, firstName, lastName } = req.body;

    try {
        await pool.request()
            .input('email', sql.NVarChar, email)
            .input('password', sql.NVarChar, password)
            .input('firstName', sql.NVarChar, firstName)
            .input('lastName', sql.NVarChar, lastName)
            .query(`
                INSERT INTO Users
                (Email, Password, Role, FirstName, LastName, CreatedAt)
                VALUES (@email, @password, 'najemca', @firstName, @lastName, GETDATE())
            `);

        res.status(201).json({ success: true });

    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false });
    }
});


// ================= AKTUALIZACJA PROFILU =================
app.put('/api/update-profile', async (req, res) => {
    const { email, firstName, lastName, phone, address } = req.body;

    try {
        await pool.request()
            .input('email', sql.NVarChar, email)
            .input('firstName', sql.NVarChar, firstName)
            .input('lastName', sql.NVarChar, lastName)
            .input('phone', sql.NVarChar, phone)
            .input('address', sql.NVarChar, address)
            .query(`
                UPDATE Users
                SET FirstName = @firstName,
                    LastName = @lastName,
                    Phone = @phone,
                    Address = @address
                WHERE Email = @email
            `);

        res.json({ success: true });

    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false });
    }
});


// ================= ZMIANA HASŁA =================
app.put('/api/change-password', async (req, res) => {
    const { email, currentPassword, newPassword } = req.body;

    try {
        const check = await pool.request()
            .input('email', sql.NVarChar, email)
            .input('currentPassword', sql.NVarChar, currentPassword)
            .query(`SELECT Id FROM Users WHERE Email = @email AND Password = @currentPassword`);

        if (check.recordset.length === 0) {
            return res.status(401).json({ success: false });
        }

        await pool.request()
            .input('email', sql.NVarChar, email)
            .input('newPassword', sql.NVarChar, newPassword)
            .query(`UPDATE Users SET Password = @newPassword WHERE Email = @email`);

        res.json({ success: true });

    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false });
    }
});


// ================= POBIERANIE PROFILU =================
app.get('/api/profile/:email', async (req, res) => {
    const email = decodeURIComponent(req.params.email);

    try {
        const result = await pool.request()
            .input('email', sql.NVarChar, email)
            .query(`
                SELECT Email, FirstName, LastName, Phone, Address
                FROM Users
                WHERE Email = @email
            `);

        if (result.recordset.length > 0) {
            return res.json({ success: true, user: result.recordset[0] });
        }

        res.status(404).json({ success: false });

    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false });
    }
});


// ================= USUWANIE KONTA =================
app.delete('/api/delete-account', async (req, res) => {
    const { email } = req.body;

    try {
        await pool.request()
            .input('email', sql.NVarChar, email)
            .query(`DELETE FROM Users WHERE Email = @email`);

        res.json({ success: true });

    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false });
    }
});


app.listen(5001, () => console.log('🚀 Serwer pracuje na porcie 5001'));

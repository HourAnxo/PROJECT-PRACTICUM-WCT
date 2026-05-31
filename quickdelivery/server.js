const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

// ================= MYSQL CONNECTION =================
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'quickdelivery'
});

db.connect((err) => {
    if (err) {
        console.log('MySQL connection failed');
        console.log(err);
    } else {
        console.log('MySQL connected');
    }
});


// ================= REGISTER =================
app.post('/register', (req, res) => {

    const { firstname, lastname, email, password } = req.body;

    console.log("Incoming data:", req.body);

    // ✅ Validate input
    if (!firstname || !lastname || !email || !password) {
        return res.status(400).json({
            message: 'All fields are required'
        });
    }

    // ✅ CHECK EMAIL EXISTS
    const checkSql = 'SELECT * FROM users WHERE email = ?';

    db.query(checkSql, [email], (err, result) => {

        if (err) {
            console.log(err);
            return res.status(500).json({ message: 'Server error' });
        }

        if (result.length > 0) {
            return res.status(400).json({
                message: 'Email already exists'
            });
        }

        // ✅ INSERT USER
        const insertSql = `
            INSERT INTO users (first_name, last_name, email, password)
            VALUES (?, ?, ?, ?)
        `;

        db.query(insertSql, [firstname, lastname, email, password], (err, result) => {

            if (err) {
                console.log(err);
                return res.status(500).json({
                    message: 'Registration failed'
                });
            }

            res.json({
                message: 'Registration successful'
            });

        });

    });

});


// ================= LOGIN =================
app.post('/login', (req, res) => {

    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            message: 'Email and password required'
        });
    }

    const sql = 'SELECT * FROM users WHERE email = ? AND password = ?';

    db.query(sql, [email, password], (err, result) => {

        if (err) {
            console.log(err);
            return res.status(500).json({
                message: 'Server error'
            });
        }

        if (result.length > 0) {
            res.json({
                success: true,
                user: result[0]
            });
        } else {
            res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

    });

});


// ================= START SERVER =================
app.listen(3000, () => {
    console.log('Server running on port 3000');
});
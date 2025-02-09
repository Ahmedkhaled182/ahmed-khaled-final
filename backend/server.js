const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const db_access = require('./data-base.js');
const db = db_access.db;
const server = express();
const port = 555;
const secret_key = 'DdsdsdKKFDDFDdvfddvxvc4dsdvdsvdb';

server.use(cors({ origin: "http://localhost:3000", credentials: true }));
server.use(express.json());
server.use(cookieParser());

//Token Generation 
const generateToken = (id, isAdmin) => jwt.sign({ id, isAdmin }, secret_key, { expiresIn: '1h' });

//Token Verification
const verifyToken = (req, res, next) => {
    const token = req.cookies.authToken;
    if (!token) return res.status(401).send('Unauthorized');

    jwt.verify(token, secret_key, (err, details) => {
        if (err) return res.status(403).send('Invalid or expired token');
        req.userDetails = details;
        next();
    });
};

//Login
server.post('/user/login', (req, res) => {
    const { email, password } = req.body;
    db.get(`SELECT * FROM USER WHERE EMAIL=?`, [email], (err, row) => {
        if (err || !row) return res.status(404).send('User not found');

        bcrypt.compare(password, row.PASSWORD, (err, isMatch) => {
            if (err || !isMatch) return res.status(401).send('Invalid credentials');

            const token = generateToken(row.ID, row.ISADMIN);
            res.cookie('authToken', token, { httpOnly: true, sameSite: 'none', secure: true });
            res.status(200).json({ admin: row.ISADMIN });
        });
    });
});

// Registration
server.post('/user/register', (req, res) => {
    const { name, email, password } = req.body;
    bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) return res.status(500).send('Error hashing password');

        db.run(`INSERT INTO USER (NAME, EMAIL, PASSWORD, ISADMIN) VALUES (?, ?, ?, 0)`, 
            [name, email, hashedPassword], 
            err => err ? res.status(500).send('Error registering user.') : res.status(200).send('Registration successful')
        );
    });
});

//Fetch Products by Category
server.get('/products', (req, res) => {
    db.all(`SELECT * FROM PERFUME WHERE CATEGORY = ?`, [req.query.category], 
        (err, rows) => err ? res.status(500).send('Error fetching products.') : res.json(rows)
    );
});

//Get Cart Items
server.get('/cart', verifyToken, (req, res) => {
    db.all(
        `SELECT C.ID AS CART_ID, P.NAME, P.BRAND, P.PRICE, C.QUANTITY 
         FROM CART C JOIN PERFUME P ON C.PERFUME_ID = P.ID 
         WHERE C.USER_ID = ?`, 
        [req.userDetails.id], 
        (err, rows) => err ? res.status(500).send('Error fetching cart items.') : res.json(rows)
    );
});

//Add Item to Cart
server.post('/cart/add', verifyToken, (req, res) => {
    const { perfumeId, quantity } = req.body;
    db.run(`INSERT INTO CART (USER_ID, PERFUME_ID, QUANTITY) VALUES (?, ?, ?)`, 
        [req.userDetails.id, perfumeId, quantity], 
        err => err ? res.status(500).send('Error adding item to cart') : res.status(200).send('Item added successfully')
    );
});

// Clear Cartz
server.delete('/cart/clear', verifyToken, (req, res) => {
    db.run(`DELETE FROM CART WHERE USER_ID = ?`, [req.userDetails.id], 
        err => err ? res.status(500).send('Error clearing cart.') : res.status(200).send('Cart cleared.')
    );
});

//Checkout
server.post('/checkout', verifyToken, (req, res) => {
    const userId = req.userDetails.id;
    db.all(`SELECT * FROM CART WHERE USER_ID = ?`, [userId], (err, cartItems) => {
        if (err || !cartItems.length) return res.status(400).send('Cart is empty.');

        cartItems.forEach(item => {
            db.run(`INSERT INTO PURCHASES (USER_ID, PERFUME_ID, QUANTITY) VALUES (?, ?, ?)`, 
                [userId, item.PERFUME_ID, item.QUANTITY], 
                err => err && console.error('Error inserting into PURCHASES:', err.message)
            );
        });

        db.run(`DELETE FROM CART WHERE USER_ID = ?`, [userId], 
            err => err ? res.status(500).send('Error clearing cart.') : res.status(200).send('Purchase completed successfully!')
        );
    });
});

//Admin Orders
server.get('/admin/orders', verifyToken, (req, res) => {
    if (req.userDetails.isAdmin !== 1) return res.status(403).send('Access denied.');

    db.all(`
        SELECT O.ID, O.USER_ID, 
        GROUgi 
        SUM(O.QUANTITY * P.PRICE) AS TOTAL_PRICE, 
        MAX(O.DATE) AS ORDER_DATE  
        FROM PURCHASES O
        JOIN PERFUME P ON O.PERFUME_ID = P.ID
        GROUP BY O.ID, O.USER_ID
    `, (err, rows) => err ? res.status(500).send(`Error fetching orders: ${err.message}`) : res.json(rows));
});

//Start Server
server.listen(port, () => console.log(`Server running at port ${port}`));

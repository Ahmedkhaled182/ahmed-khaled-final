const sqlite = require('sqlite3');
const bcrypt = require('bcrypt');
const db = new sqlite.Database('perfume_shop.db');

//Table Creation
const queries = {
    user: `CREATE TABLE IF NOT EXISTS USER (
        ID INTEGER PRIMARY KEY AUTOINCREMENT,
        NAME TEXT NOT NULL,
        EMAIL TEXT UNIQUE NOT NULL,
        PASSWORD TEXT NOT NULL,
        ISADMIN INT DEFAULT 0
    )`,
    perfume: `CREATE TABLE IF NOT EXISTS PERFUME (
        ID INTEGER PRIMARY KEY AUTOINCREMENT,
        NAME TEXT NOT NULL,
        BRAND TEXT NOT NULL,
        PRICE REAL NOT NULL,
        DESCRIPTION TEXT,
        QUANTITY INT NOT NULL,
        CATEGORY TEXT NOT NULL,
        IMAGE_URL TEXT
    )`,
    purchases: `CREATE TABLE IF NOT EXISTS PURCHASES (
        ID INTEGER PRIMARY KEY AUTOINCREMENT,
        USER_ID INT NOT NULL,
        PERFUME_ID INT NOT NULL
        QUANTITY INT NOT NULL,
        DATE TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (USER_ID) REFERENCES USER(ID),
        FOREIGN KEY (PERFUME_ID) REFERENCES PERFUME(ID)
    )`,
    cart: `CREATE TABLE IF NOT EXISTS CART (
        ID INTEGER PRIMARY KEY AUTOINCREMENT,
        USER_ID INT NOT NULL,
        PERFUME_ID INT NOT NULL,
        QUANTITY INT NOT NULL,
        FOREIGN KEY (USER_ID) REFERENCES USER(ID),
        FOREIGN KEY (PERFUME_ID) REFERENCES PERFUME(ID)
    )`
};

//Run Table Creations
db.serialize(() => {
    Object.values(queries).forEach(query => 
        db.run(query, err => err && console.error(`Error creating table: ${err.message}`))
    );

    //Ensure an Admin User Exists
    db.get(`SELECT COUNT(*) AS count FROM USER WHERE ISADMIN = 1`, (err, row) => {
        if (!err && row.count === 0) {
            bcrypt.hash('ahmed123', 10, (err, hashedPassword) => {
                if (!err) {
                    db.run(`INSERT INTO USER (NAME, EMAIL, PASSWORD, ISADMIN) VALUES (?, ?, ?, 1)`, 
                        ['Admin User', 'ahmedkhalednabil2004@gmail.com', hashedPassword], 
                        err => err ? console.error('Error inserting admin user:', err.message) : console.log('Admin user created')
                    );
                }
            });
        }
    });

    //Ensure Sample Products Exist
    db.get(`SELECT COUNT(*) AS count FROM PERFUME`, (err, row) => {
        if (!err && row.count === 0) {
            db.run(`
                INSERT INTO PERFUME (NAME, BRAND, PRICE, DESCRIPTION, QUANTITY, CATEGORY, IMAGE_URL) VALUES
                ('Valentino Uomo', 'Brand A', 49.99, 'Fresh and invigorating', 10, 'men', 'https://m.media-amazon.com/images/I/71w9oj9Wp-L.jpg'),
                ('YSL myself', 'Brand B', 59.99, 'Deep woody scent', 8, 'men', 'https://i5.walmartimages.com/seo/Myself-by-Yves-Saint-Laurent-Eau-De-Parfum-2-0oz-60ml-Spray-New-With-Box_a7d37d4b-987e-4aab-843f-6375beeab7b9.aa5c34cf6519af9d756944ae2723a8da.jpeg?odnHeight=640&odnWidth=640&odnBg=FFFFFF'),
                ('Mont Blanc Explorer', 'Brand C', 29.99, 'Citrusy, light fragrance', 12, 'men', 'https://th.bing.com/th/id/R.9c5eb51a16f4d29819114d2564c364d5?rik=n6VNMmcsHB9abQ&pid=ImgRaw&r=0'),
                ('Good Girl', 'Brand D', 69.99, 'A floral and sweet fragrance for women', 15, 'women', 'https://cdn.shopify.com/s/files/1/2978/5842/products/perfume-good-girl-for-women-by-carolina-herrera-eau-de-parfum-spray-2.jpg?v=1546632192'),
                ('Black Opium', 'Brand E', 39.99, 'A vanilla-based warm scent for women', 10, 'women', 'https://th.bing.com/th/id/OIP.l953iTQUC8iixl3ku2XsEQHaHa?rs=1&pid=ImgDetMain'),
                ('Tom Ford Tobacco Vanille', 'Brand F', 55.99, 'A refreshing aquatic fragrance for women', 7, 'women', 'https://perfumestuff.com/wp-content/uploads/2022/02/Tom-Ford-Tobacco-Vanille-EDP-For-Women-100ml.jpg')`,
                err => err ? console.error('Error inserting sample perfumes:', err.message) : console.log('Sample perfumes inserted')
            );
        }
    });
});

module.exports = { db, queries };

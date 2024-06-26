const mysql = require("mysql2");
const bcrypt = require("bcrypt");

const dbConfig = {
  host: "localhost",
  user: "root",
  password: "W3_vernice", // Assicurati di usare la password corretta
  database: "mydatabase",
};

const db = mysql.createConnection(dbConfig);
// db.query("drop database mydatabase");
db.connect((err) => {
  if (err) {
    console.error("Error connecting: " + err.stack);
    return;
  }
  console.log("Connected as id " + db.threadId);

  // Crea il database se non esiste
  db.query("CREATE DATABASE IF NOT EXISTS mydatabase", (err, result) => {
    if (err) throw err;
    console.log("Database created or already exists");

    // Crea una tabella di esempio se non esiste
    const createTableQuery = `
                CREATE TABLE IF NOT EXISTS users (
                    id INT AUTO_INCREMENT,
                    email VARCHAR(255) NOT NULL,
                    username VARCHAR(255) NOT NULL,
                    password VARCHAR(255) NOT NULL,
                    token VARCHAR(255),
                    PRIMARY KEY (id)
                )
            `;
    db.query(createTableQuery, (err, result) => {
      if (err) throw err;
      console.log("Table created or already exists");

      // Controlla se l'utente con nome 'Davide Chigliaro' esiste
      const checkUserQuery = `
                    SELECT * FROM users WHERE username = 'Davide Chigliaro'
                `;
      db.query(checkUserQuery, async (err, results) => {
        if (err) throw err;

        if (results.length === 0) {
          // Se l'utente non esiste, lo inserisce
          const hashedPassword = await bcrypt.hash("test", 10);

          const insertUserQuery = `
                            INSERT INTO users (username, email, password, token) VALUES ('Davide Chigliaro', 'd@d', ?, '')
                        `;
          db.query(insertUserQuery, [hashedPassword], (err, result) => {
            if (err) throw err;
            console.log("User Davide Chigliaro inserted");
          });
        } else {
          console.log("User Davide Chigliaro already exists");
        }
      });
    });
  });
});

module.exports = db;

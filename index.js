const express = require('express');
const app = express();
require('dotenv').config();
const port = process.env.ENV_PORT || 3000;
const path = require('path');
const cors = require("cors");
var flush = require('connect-flash');
const http = require("http");
var crypto = require('crypto');
var bcrypt = require('bcrypt');
const mysql = require('mysql2');
var session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);
var createError = require('http-errors');
var encoder = express.urlencoded({ extended: true });

app.use(cors());

const mysqlConfig = {
  host: process.env.ENV_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  port: process.env.MYSQL_TCP_PORT
}

let db = mysql.createConnection(mysqlConfig);

db.connect((error) => {
  if (error) {
    console.log(error)
    return;
  }
  console.log("Connected to the database...")
  creaLoginuser();
});

global.sessionStore = new MySQLStore({
  expiration: 34560000,
  createDatabaseTable: true,
  schema: {
    tableName: process.env.ENV_TABLE,
    columnNames: {
      session_id: process.env.ENV_SESSION,
      expires: process.env.ENV_EXPIRES,
      data: process.env.ENV_DATA
    }
  }
}, db);

const biscotto = session({
  key: process.env.ENV_KEY,
  secret: process.env.ENV_SECRET,
  store: sessionStore,
  cookie: {
    maxAge: 34560000,
    httpOnly: false
  },
  resave: false,
  saveUninitialized: false,
  path: '/',

});

app.use(biscotto);

app.use(express.json());

app.use(express.static(path.join(__dirname, '/fantaf1/dist/fantaf1')));

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const salt = await bcrypt.genSalt();
  let hashedPassword = await bcrypt.hash(password, salt);
  const query = `SELECT * FROM loginuser WHERE user_email = '${email}'`;
  db.query(query, async (error, results) => {
    if (error) {
      res.status(500).json({ error: 'Errore durante il login' });
      console.log(error)
    } else {
      if (results.length > 0) {
        if (await bcrypt.compare(password, hashedPassword)) {
          console.log("l'utente " + email + " ha fatto il login");
          req.session.userinfo = results[0].user_email;
          res.status(200).json({ message: 'Login effettuato con successo' });
        }
      } else {
        res.status(401).json({ error: 'Credenziali non valide' });
      }
    }
  });
});

app.post('/register', encoder, (req, res) => {
  const { email, password, confirmPassword } = req.body;
  console.log({ email, password, confirmPassword });
  if (password !== confirmPassword) {
    return res.status(400).json({ error: 'La password e la conferma della password non coincidono' });
  }
  const checkQuery = `SELECT * FROM loginuser WHERE user_email = '${email}'`;
  db.query(checkQuery, async (error, results) => {
    if (error) {
      console.error(error);
      return res.status(500).json({ error: 'Errore durante la verifica dell\'utente' });
    }
    if (results.length > 0) {
      return res.status(409).json({ error: 'Utente già registrato' });
    }
    const salt = await bcrypt.genSalt();
    let hashedPassword = await bcrypt.hash(password, salt);
    const insertQuery = `INSERT INTO loginuser (user_email, user_pass) VALUES ('${email}', '${hashedPassword}')`;
    db.query(insertQuery, (error) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ error: 'Errore durante l\'inserimento dell\'utente nel database' });
      }
      req.session.userinfo = email;
      return res.status(201).json({ message: 'Registrazione effettuata con successo' });
    });
  });
});

app.post('/logout', (req, res) => {
  res.clearCookie("userID");
  res.status(200).json({ message: 'Logout effettuato con successo' });
  res.end();
  console.log("testlogout");
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, './fantaf1/dist/fantaf1/index.html'));
});


function creaLoginuser() {
  const checkTableQuery = `SELECT 1 FROM loginuser LIMIT 1`;
  db.query(checkTableQuery, (err, result) => {
    if (err) {
      if (err.code === 'ER_NO_SUCH_TABLE') {
        const createTableQuery = `
        CREATE TABLE loginuser (
          id INT AUTO_INCREMENT PRIMARY KEY,
          user_email VARCHAR(255),
          user_pass VARCHAR(255)
        )
      `;
        db.query(createTableQuery, async (err, result) => {
          if (err) {
            console.error('Errore durante la creazione della tabella loginuser:', err);
            return;
          }
          console.log('Tabella loginuser creata con successo.');
          email = process.env.loginuser_email;
          password = process.env.loginuser_pass;
          const salt = await bcrypt.genSalt();
          let hashedPassword = await bcrypt.hash(password, salt);
          console.log(hashedPassword);
          console.log(salt);
          db.query("insert into loginuser(user_pass,user_email) values( ?, ? )", [hashedPassword, email], function (error, results) {
            if (error) {
              console.log(error);
            } else {
              console.log(results);
            }
          });
        });
      } else {
        console.error('Errore durante la verifica della tabella loginuser:', err);
        return;
      }
    } else {
      console.log('La tabella loginuser esiste già.');
    }
  });
}

const server = http.createServer(app);
server.listen(port, (err) => {
  if (err) {
    return console.error(err);
  }
  return console.log(`app is listening on ${port}`);
});
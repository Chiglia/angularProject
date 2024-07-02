const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const db = require("./database");

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Endpoint per il login
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body.user;
  db.query(
    "SELECT * FROM users WHERE email = ?",
    [email],
    async (err, results) => {
      if (err) {
        res.status(500).json({ error: "Errore nel server" });
        return;
      }

      if (results.length === 0) {
        res.status(401).json({ error: "Username o password non validi" });
        return;
      }
      const passwordMatch = await bcrypt.compare(password, results[0].password);

      if (!passwordMatch) {
        res.status(401).json({ error: "Username o password non validi" });
        return;
      }
      const token = jwt.sign(
        { username: results[0].username },
        "your_secret_key",
        {
          expiresIn: "1h",
        }
      );

      res.json({
        user: {
          email: results[0].email,
          username: results[0].username,
          token: token,
        },
      });
    }
  );
});

// Middleware per verificare il token JWT
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.sendStatus(401);
  }

  jwt.verify(token, "your_secret_key", (err, user) => {
    if (err) {
      console.error("Errore nella verifica del token:", err);
      return res.sendStatus(403);
    }
    req.user = user;
    next();
  });
}

// Definisci una route di esempio
app.get("/api/users", (req, res) => {
  db.query("SELECT email,username FROM users", (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

// Definisci una route per aggiungere un nuovo utente
app.post("/api/users", (req, res) => {
  const newUser = req.body;
  const sql = "INSERT INTO users (name) VALUES (?)";
  db.query(sql, [newUser.name], (err, result) => {
    if (err) throw err;
    res.json({ id: result.insertId, ...newUser });
  });
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});

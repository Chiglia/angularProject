const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
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
  // Verifica delle credenziali nel database
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

      const user = results[0];
      const passwordMatch = await bcrypt.compare(password, user.password);

      if (!passwordMatch) {
        res.status(401).json({ error: "Username o password non validi" });
        return;
      }

      // Generazione del token JWT
      const token = jwt.sign({ username: user.username }, "your_secret_key", {
        expiresIn: "1h",
      });

      db.query(
        "UPDATE users SET token = ? WHERE email = ?",
        [token, email],
        async (err, results) => {
          if (err) {
            res.status(500).json({ error: "Errore nel server" });
            return;
          }
          console.log("inserito token");
          db.query(
            "SELECT email,token,username FROM users WHERE email = ?",
            [email],
            async (err, results) => {
              if (err) {
                res.status(500).json({ error: "Errore nel server" });
                return;
              }
              res.json({ user: results[0] });
              console.log({ user: results[0] });
            }
          );
        }
      );
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
  db.query("SELECT * FROM users", (err, results) => {
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

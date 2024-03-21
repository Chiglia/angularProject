const express = require('express')
const mysql = require('mysql2');
var path = require('path');
const app = express();
require('dotenv').config();
const port = process.env.ENV_PORT;
var encoder = express.urlencoded({ extended: true });
const cors = require("cors");
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
  console.log("Connected to the database...");
});

app.use(express.json());

app.use(express.static(path.resolve(__dirname, 'public')));

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'public', 'index.html'));
});


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
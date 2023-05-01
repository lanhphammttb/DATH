const express = require("express");
var mysql = require('mysql');
const cors = require('cors');

const app = express();

app.use(cors());

const bodyParser = require('body-parser');


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  port: '3306',  /* port on which phpmyadmin run */
  password: '1704',
  database: 'dath'  
});


app.get('/users', (req, res) => {
  connection.query('SELECT * FROM admin', (err, results) => {
    if (err) {
      res.status(500).json({ error: err });
    } else {
      res.status(200).json({ users: results });
    }
  });
});

const jwt = require('jsonwebtoken');
const secretKey = 'yoursecretkey';

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  console.log(username + password);
  connection.query(
    `SELECT * FROM admin WHERE username = ? AND password = ?`,
    [username, password],
    (err, results) => {
      if (err) {
        res.status(500).json({ error: err });
      } else if (results.length === 0) {
        res.status(401).json({ error: 'Invalid username or password' });
      } else {
        const user = results[0];
        const token = jwt.sign({ id: user.id, username: user.username }, secretKey);
        res.status(200).json({ token });
      }
    }
  );
});

connection.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL database!');
});

app.get('/api/sanpham', (req, res) => {
  const sql = 'SELECT * FROM SanPham';

  connection.query(sql, (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});

app.get('/api/anhsanpham/1', (req, res) => {
  const masp = req.params.MaSP;
  const sql = `SELECT * FROM AnhSanPham Where MaSP= ${1}`;

  connection.query(sql, (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});



const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});

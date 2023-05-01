const express = require("express");
var mysql = require('mysql');
const cors = require('cors');

const app = express();

app.use(cors());

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    port: '3306',  /* port on which phpmyadmin run */
    password: '1704',
    database: 'dath'  
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
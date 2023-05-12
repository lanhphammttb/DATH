const express = require("express");
var mysql = require('mysql2');
const cors = require('cors');
const multer = require("multer");
const moment = require("moment");

const app = express();

app.use(cors());

const bodyParser = require('body-parser');


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  port: '3306',  /* port on which phpmyadmin run */
  password: '',
  database: 'test'  
});

connection.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL database!');
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

//khởi tạo middleware multer
const storage = multer.diskStorage({
  destination: function (req, file, callback){
    callback(null, './uploads')
  },
  filename: function (req, file, callback){
    callback(null, `image-${Date.now()}.${file.originalname}`)
  }
});

// img filter
const isImage = (req,file,callback)=>{
  if(file.mimetype.startsWith("image")){
      callback(null,true)
  }else{
      callback(null,Error("only image is allowd"))
  }
}

const upload = multer({ 
  storage: storage,
  fileFilter:isImage
});

//xử lý POST request để tải ảnh lên file ảnh và lưu trữ vào MYSQL
app.post('/api/sanpham', upload.single('file'), (req, res)=>{
  const {masp, tensp, soluong, gianhap, giaban, maloaisp, nsx, mota} = req.body;
  const file = req.file;
  connection.query('INSERT INTO sanpham SET ?', { masp: masp, SoLuong: soluong, GiaNhap: gianhap, GiaBan: giaban, MaLoaiSP: maloaisp, NSX: nsx, MoTa: mota, Image: file,  TenSP: tensp}, (error, results) => {
    if (error) {
      console.error('MySQL error:', error);
      res.sendStatus(500);
    } else {
      console.log('MySQL success:', results);
      res.sendStatus(200);
    }
  });
});

app.get('/api/sanpham', (req, res) => {1
  const sql = 'SELECT * FROM SanPham';

  connection.query(sql, (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});

app.get('/api/sanpham/:id', (req, res) => {
  const id = req.params.id;
  const sql = `SELECT * FROM sanpham WHERE masp = ${id}`;

  connection.query(sql, (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else if (result.length === 0) {
      res.status(404).json({ error: 'User not found' });
    } else {
      res.send(result[0].Image);
      // res.json(result[0].Image);
    }
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

const express = require("express");
var mysql = require('mysql2');
const cors = require('cors');
const multer = require("multer");
const moment = require("moment");
const { format } = require('date-fns');
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
        const name = results[0].name;
        const chucvu = results[0].chucvu;
        const token = jwt.sign({ id: user.id, username: user.username, chucvu: user.chucvu  }, secretKey);
        res.status(200).json({ token, name, chucvu });
      }
    }
  );
});

//khởi tạo middleware multer
const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, './uploads')
  },
  filename: function (req, file, callback) {
    callback(null, `image-${Date.now()}.${file.originalname}`)
  }
});

// img filter
const isImage = (req, file, callback) => {
  if (file.mimetype.startsWith("image")) {
    callback(null, true)
  } else {
    callback(null, Error("only image is allowd"))
  }
}

const upload = multer({
  storage: storage,
  fileFilter: isImage
});
app.get('/api/sanpham', (req, res) => {
  const sql = 'SELECT * FROM sanpham';
  connection.query(sql, (error, results, fields) => {
    if (error) throw error;

    const updatedResults = results.map((result) => {
      // Chuyển đổi dữ liệu buffer thành URL hình ảnh
      // const imageUrl = `data:image/jpeg;base64,${result.Image.toString('base64')}`;
      imageUrl = Buffer.from(result.Image, 'base64').toString('binary');
      return { ...result, imageUrl };
    });
    // console.log(results);
    res.json(updatedResults);
  });
});

app.get('/api/loaisanpham', (req, res) => {
  const sql = 'SELECT * FROM loaisanpham';
  connection.query(sql, (error, results, fields) => {
    if (error) throw error;
    res.json(results);
  });
});

//xử lý POST request để tải ảnh lên file ảnh và lưu trữ vào MYSQL
const fs = require('fs');
// app.post('/api/sanpham', upload.single('file'), (req, res)=>{
app.post('/api/sanpham', upload.single('file'), (req, res) => {
  const { masp, tensp, soluong, gianhap, giaban, maloaisp, nsx, mota } = req.body;
  // const image = req.file.buffer;
  // var img = fs.readFileSync(req.file.path);
  // var encode_image = img.toString('base64');
  // var finalImg = {
  //   contentType: req.file.mimetype,
  //   image:  Buffer.from(encode_image, 'base64')
  // };
  // console.log(JSON.stringify(req.body));
  const finalImg = req.body.file;
  connection.query('INSERT INTO sanpham SET ?', { masp: masp, SoLuong: soluong, GiaNhap: gianhap, GiaBan: giaban, MaLoaiSP: maloaisp, NSX: nsx, MoTa: mota, Image: finalImg, TenSP: tensp }, (error, results) => {
    if (error) {
      console.error('MySQL error:', error);
      res.sendStatus(500);
    } else {
      // console.log('MySQL success:', results);
      res.sendStatus(200);
    }
  });
});

app.post('/api/loaisanpham', upload.none(), (req, res) => {
  // console.log(req);
  const { maloaisp, tenloaisp } = req.body;
  connection.query('INSERT INTO loaisanpham SET ?', { maloaisp: maloaisp, tenloaisp: tenloaisp}, (error, results) => {
    if (error) {
      console.error('MySQL error:', error);
      res.sendStatus(500);
    } else {
      // console.log('MySQL success:', results);
      res.sendStatus(200);
    }
  });
});

app.put('/api/sanpham/:id', async (req, res) => {
  const productId = req.params.id;
  const { tensp, soluong, gianhap, giaban, maloaisp, nsx, mota } = req.body;
  const finalImg = req.body.file;
  // Kiểm tra tính hợp lệ của dữ liệu sản phẩm
  // ...

  try {
    // Cập nhật thông tin sản phẩm trong CSDL
    const [rows] = await connection.execute(
      'UPDATE sanpham SET TenSP=? SoLuong=? GiaNhap=? GiaBan=? MaLoaiSP=? NSX=? MoTa=? Image=?,  WHERE MaSP=?',
      [tensp, soluong, gianhap, giaban, maloaisp, nsx, mota, finalImg, productId]
    );
    
    console.log('up')
    res.json(updatedProduct[0]);

  } catch (error) {
    console.error(error);
    res.status(500).send(`Error updating product: ${error.message}`);
  }
});

app.delete('/api/sanpham/:id', (req, res) => {
  const MaSP = req.params.id;
  connection.query('DELETE FROM sanpham WHERE MaSP = ?', [MaSP], (error, results, fields) => {
    if (error) throw error;
    console.log('Product deleted successfully.');
  });
  res.send({ message: `Sản phẩm ${MaSP} đã được xóa` });
});

app.delete('/api/loaisanpham/:id', (req, res) => {
  const MaLoaiSP = req.params.id;
  connection.query('DELETE FROM loaisanpham WHERE MaLoaiSP = ?', [MaLoaiSP], (error, results, fields) => {
    if (error) throw error;
    console.log('Type product deleted successfully.');
  });
  res.send({ message: `Mã loại sản phẩm ${MaLoaiSP} đã được xóa` });
});


app.get('/api/sanpham/:id', (req, res) => {
  const id = req.params.id;
  const sql = `SELECT * FROM sanpham WHERE masp = ${id}`;
  connection.query(sql, (error, results, fields) => {
    if (error) throw error;

    const updatedResults = results.map((result) => {
      // Chuyển đổi dữ liệu buffer thành URL hình ảnh
      // const imageUrl = `data:image/jpeg;base64,${result.Image.toString('base64')}`;
      imageUrl = Buffer.from(result.Image, 'base64').toString('binary');
      return { ...result, imageUrl };
    });
    // console.log(results);
    res.json(updatedResults);
  });
});

app.get('/api/hoadon', (req, res) => {
  const sql = 'SELECT * FROM hoadon';
  connection.query(sql, (error, results, fields) => {
    if (error) {
      res.status(500).json({ error: err });
    } else {
      const updatedResults = results.map((result) => {
        const formattedDateTime = format(new Date(result.NgayLapHD), 'dd/MM/yyyy HH:mm:ss');
        return { ...result, formattedDateTime };
      });
      res.status(200).json(updatedResults);
    }
  })

});

app.post('/api/hoadon', (req, res) => {
  const { mahd, makh, ngaylaphd, khuyenmai, tongtien, ghichu } = req.body;

  const finalImg = req.body.file;
  connection.query('INSERT INTO hoadon SET ?', { MaHD: mahd, MaKH: makh, NgayLapHD: ngaylaphd, KhuyenMai: khuyenmai, TongTien: tongtien, GhiChu: ghichu }, (error, results) => {
    if (error) {
      console.error('MySQL error:', error);
      res.sendStatus(500);
    } else {
      console.log('MySQL success:', results);
      res.sendStatus(200);
    }
  });
});


// app.get('/api/anhsanpham/1', (req, res) => {
//   const masp = req.params.MaSP;
//   const sql = `SELECT * FROM AnhSanPham Where MaSP= ${1}`;

//   connection.query(sql, (err, result) => {
//     if (err) throw err;
//     res.send(result);
//   });
// });



const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});

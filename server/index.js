const express = require('express');
var mysql = require('mysql2');
const cors = require('cors');
const multer = require('multer');
const moment = require('moment');
const { format } = require('date-fns');
const unidecode = require('unidecode');
const fs = require('fs');
const app = express();
const currencyFormatter = require('currency-formatter');
const vnpayRouter = require('./routes/vnpay');

app.use(cors());
const crypto = require('crypto');
const algorithm = 'aes-256-ctr';
const secretKey = 'yoursecretkey';

// Example function to encrypt password


// Example function to decrypt password


const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  port: '3306' /* port on which phpmyadmin run */,
  password: '',
  database: 'dath',
});

connection.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL database!');
});

app.use('/api/vnpay', vnpayRouter);

app.get('/api/users', (req, res) => {
  const userr = fs.readFileSync('data.txt', 'utf-8');
  console.log(userr + "j");
  connection.query(
    `SELECT MAKH FROM khachhang WHERE TAIKHOAN = ? `,
    [userr],
    (err, results) => {
      if (err) {
        res.status(500).json({ error: err });
      } else {
        res.status(200).json({ users: results });
      }
    }
  );
});

const jwt = require('jsonwebtoken');

app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
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
        fs.writeFileSync('data.txt', username);
        const token = jwt.sign(
          { id: user.id, username: user.username, chucvu: user.chucvu },
          secretKey
        );
        res.status(200).json({ token, name, chucvu });
      }
    }
  );
});

//khởi tạo middleware multer
const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, './uploads');
  },
  filename: function (req, file, callback) {
    callback(null, `image-${Date.now()}.${file.originalname}`);
  },
});

// img filter
const isImage = (req, file, callback) => {
  if (file.mimetype.startsWith('image')) {
    callback(null, true);
  } else {
    callback(null, Error('only image is allowd'));
  }
};

const upload = multer({
  storage: storage,
  fileFilter: isImage,
  limits: {
    fieldSize: 1024 * 1024 * 10, // 10 MB (in bytes)
  },
});
// app.get('/api/sanpham', (req, res) => {
//   const sql = 'SELECT * FROM sanpham';
//   connection.query(sql, (error, results, fields) => {
//     if (error) throw error;

//     const updatedResults = results.map((result) => {
//       // Chuyển đổi dữ liệu buffer thành URL hình ảnh
//       // const imageUrl = `data:image/jpeg;base64,${result.Image.toString('base64')}`;
//       imageUrl = Buffer.from(result.Image, 'base64').toString('binary');
//       return { ...result, imageUrl };
//     });
//     // console.log(results);
//     res.json(updatedResults);
//   });
// });

app.get('/api/loaisanpham', (req, res) => {
  const sql = 'SELECT * FROM loaisanpham';
  connection.query(sql, (error, results, fields) => {
    if (error) throw error;
    res.json(results);
  });
});

// Xử lý yêu cầu GET /api/products
app.get('/api/sanpham', (req, res) => {
  const { searchTerm } = req.query;
  const sql = 'SELECT * FROM sanpham';
  connection.query(sql, (error, results, fields) => {
    if (error) throw error;

    const updatedResults = results.map((result) => {
      // Chuyển đổi dữ liệu buffer thành URL hình ảnh
      // const imageUrl = `data:image/jpeg;base64,${result.Image.toString('base64')}`;
      imageUrl = Buffer.from(result.Image, 'base64').toString('binary');
      return { ...result, imageUrl };
    });
    // Lọc danh sách sản phẩm dựa trên searchTerm
    const filteredProducts = searchTerm
      ? updatedResults.filter((product) =>
        unidecode(product.TenSP.toLowerCase()).includes(
          unidecode(searchTerm.toLowerCase())
        )
      )
      : updatedResults;
    // Trả về danh sách sản phẩm dưới dạng JSON
    res.json(filteredProducts);
  });
});

app.get('/api/sanpham/topseller', (req, res) => {
  const { searchTerm } = req.query;
  const sql =
    'SELECT c.MaSP, TenSP, GiaNhap, GiaBan, MaLoaiSP, NSX, MoTa, Image, SUM(c.SoLuong) as topseller FROM SanPham AS s JOIN chitiethoadon AS c ON S.MaSP = C.MaSP GROUP BY TenSP, GiaNhap, GiaBan, MaLoaiSP, NSX, MoTa, Image ORDER BY topseller DESC;';
  connection.query(sql, (error, results, fields) => {
    if (error) throw error;
    const updatedResults = results.map((result) => {
      // Chuyển đổi dữ liệu buffer thành URL hình ảnh
      // const imageUrl = `data:image/jpeg;base64,${result.Image.toString('base64')}`;
      imageUrl = Buffer.from(result.Image, 'base64').toString('binary');
      return { ...result, imageUrl };
    });
    res.json(updatedResults);
  });
});

//xử lý POST request để tải ảnh lên file ảnh và lưu trữ vào MYSQL
const { error } = require('console');
const e = require('express');
// app.post('/api/sanpham', upload.single('file'), (req, res)=>{
app.post('/api/sanpham', upload.single('file'), (req, res) => {
  const { masp, tensp, soluong, gianhap, giaban, maloaisp, nsx, mota } =
    req.body;
  // const image = req.file.buffer;
  // var img = fs.readFileSync(req.file.path);
  // var encode_image = img.toString('base64');
  // var finalImg = {
  //   contentType: req.file.mimetype,
  //   image:  Buffer.from(encode_image, 'base64')
  // };
  // console.log(JSON.stringify(req.body));
  const finalImg = req.body.file;
  connection.query(
    'INSERT INTO sanpham SET ?',
    {
      masp: masp,
      SoLuong: soluong,
      GiaNhap: gianhap,
      GiaBan: giaban,
      MaLoaiSP: maloaisp,
      NSX: nsx,
      MoTa: mota,
      Image: finalImg,
      TenSP: tensp,
    },
    (error, results) => {
      if (error) {
        console.error('MySQL error:', error);
        res.sendStatus(500);
      } else {
        // console.log('MySQL success:', results);
        res.sendStatus(200);
      }
    }
  );
});

app.post('/api/loaisanpham', upload.none(), (req, res) => {
  // console.log(req);
  const { maloaisp, tenloaisp } = req.body;
  connection.query(
    'INSERT INTO loaisanpham SET ?',
    { maloaisp: maloaisp, tenloaisp: tenloaisp },
    (error, results) => {
      if (error) {
        console.error('MySQL error:', error);
        res.sendStatus(500);
      } else {
        // console.log('MySQL success:', results);
        res.sendStatus(200);
      }
    }
  );
});

app.put('/api/sanpham/:id', upload.single('file'), async (req, res) => {
  const productId = req.params.id;
  const { tensp, soluong, gianhap, giaban, maloaisp, nsx, mota } = req.body;
  const finalImg = req.body.file;
  try {
    await connection.execute(
      'UPDATE sanpham SET TenSP=?, SoLuong=?, GiaNhap=?, GiaBan=?, MaLoaiSP=?, NSX=?, MoTa=?, Image=? WHERE MaSP=?',
      [
        tensp,
        soluong,
        gianhap,
        giaban,
        maloaisp,
        nsx,
        mota,
        finalImg,
        productId,
      ]
    );
    res.json({ message: 'Sửa sản phẩm thành công' });
  } catch (error) {
    console.error(error);
    res.status(500).send(`Error updating product: ${error.message}`);
  }
});

app.delete('/api/sanpham/:id', (req, res) => {
  const MaSP = req.params.id;
  connection.query(
    'DELETE FROM sanpham WHERE MaSP = ?',
    [MaSP],
    (error, results, fields) => {
      if (error) throw error;
      console.log('Product deleted successfully.');
    }
  );
  res.send({ message: `Sản phẩm ${MaSP} đã được xóa` });
});

app.delete('/api/loaisanpham/:id', (req, res) => {
  const MaLoaiSP = req.params.id;
  connection.query(
    'DELETE FROM loaisanpham WHERE MaLoaiSP = ?',
    [MaLoaiSP],
    (error, results, fields) => {
      if (error) throw error;
      console.log('Type product deleted successfully.');
    }
  );
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

app.get('/api/khachhang/:id', (req, res) => {
  const id = req.params.id;
  const sql = `SELECT * FROM khachhang WHERE MaKH = ${id}`;
  connection.query(sql, (error, results, fields) => {
    if (error) {
      res.status(500).json({ error: err });
    } else {
      const updatedResults = results.map((result) => {
        const formattedDateTime = format(
          new Date(result.NgaySinh),
          'dd/MM/yyyy HH:mm:ss'
        );
        return { ...result, formattedDateTime };
      });
      res.status(200).json(updatedResults);
    }
  });
});

app.get('/api/hoadon', (req, res) => {
  const sql = `SELECT MaHD,hd.MaKH as MaKH,NgayLapHD,KhuyenMai,TongTien,TinhTrang,GhiChu,khachhang.TENKH as TenKH,khachhang.SDT as SDT
  from hoadon as hd
  left join khachhang on hd.MaKH = khachhang.MAKH
  order by NgayLapHD desc
  `;
  connection.query(sql, (error, results, fields) => {
    if (error) {
      res.status(500).json({ error: err });
    } else {
      const updatedResults = results.map((result) => {
        const formattedDateTime = format(
          new Date(result.NgayLapHD),
          'dd/MM/yyyy HH:mm:ss'
        );
        return { ...result, formattedDateTime };
      });
      res.status(200).json(updatedResults);
    }
  });
});

app.post('/api/hoadon', (req, res) => {
  const {
    makh,
    ngaylaphd,
    tennguoinhan,
    diachinhanhang,
    sdtnguoinhan,
    khuyenmai,
    tongtien,
    ghichu,
    tinhtrang,
  } = req.body;
  connection.query(
    'INSERT INTO hoadon SET ?',
    {
      MaKH: makh,
      // NgayLapHD: ngaylaphd || '',
      TenNguoiNhan: tennguoinhan,
      DiaChiNhanHang: diachinhanhang,
      SDTNguoiNhan: sdtnguoinhan,
      KhuyenMai: khuyenmai || '',
      TongTien: tongtien,
      GhiChu: ghichu || '',
      TinhTrang: tinhtrang,
    },
    (error, results) => {
      if (error) {
        console.error('MySQL error:', error);
        res.sendStatus(500);
      } else {
        const maHoaDon = results.insertId;
        console.log('Thêm hóa đơn thành công', maHoaDon);
        res.status(201).json({ mahd: maHoaDon });
      }
    }
  );
});

app.put('/api/hoadon/:id', (req, res, feilds) => {
  let MaHD = req.params.id;
  let sql = 'update hoadon set TinhTrang = ? where MaHD = ?';
  let value = ['Đang vận chuyển', MaHD];
  connection.query(sql, value, (error, results, fields) => {
    if (error) throw error;
  });
});

app.put('/api/loaisanpham/:id', upload.none(), (req, res, feilds) => {
  let MaLoaiSP = req.params.id;
  let { tenloaisp } = req.body;
  let sql = 'update loaisanpham set TenLoaiSP = ? where MaLoaiSP= ?';
  let value = [tenloaisp, MaLoaiSP];
  connection.query(sql, value, (error, results, fields) => {
    if (error) throw error;
  });
});

app.put('/api/delete/:id', (req, res, feilds) => {
  let MaHD = req.params.id;
  let sql = 'update hoadon set TinhTrang = ? where MaHD = ?';
  let value = ['Huỷ', MaHD];
  connection.query(sql, value, (error, results, fields) => {
    if (error) throw error;
  });
});

app.get('/api/chitiethoadon/:id', (req, res) => {
  const id = req.params.id;
  const sql = `SELECT MaCTHD, chitiethoadon.MaSP as MaSP,chitiethoadon.SoLuong as SoLuong,TongTien,TinhTrang, sanpham.TenSP as TenSP,MaHD,sanpham.SoLuong as Kho,sanpham.SoLuong-chitiethoadon.SoLuong as ConLai
  from chitiethoadon
  LEFT join sanpham on chitiethoadon.MaSP = sanpham.MaSP
  WHERE MaHD = ${id}
  `;

  connection.query(sql, (error, result, fields) => {
    if (error) {
      res.status(500).json({ error: error });
    } else {
      res.status(200).json(result);
    }
  });
});

app.get('/api/loaisanpham/:id', (req, res) => {
  const id = req.params.id;
  const sql = `SELECT TenLoaiSP from loaisanpham WHERE MaLoaiSP = ${id}`;

  connection.query(sql, (error, result, fields) => {
    if (error) {
      res.status(500).json({ error: error });
    } else {
      res.status(200).json(result[0]);
    }
  });
});

let isLogin = false;

app.post('/api/logout', (req, res) => {
  // Xóa token khỏi cookie hoặc local storage
  res.clearCookie('token');
  isLogin = false;

  // Trả về kết quả thành công
  res.json({ success: true });
});
// app.get('/api/anhsanpham/1', (req, res) => {
//   const masp = req.params.MaSP;
//   const sql = `SELECT * FROM AnhSanPham Where MaSP= ${1}`;

//   connection.query(sql, (err, result) => {
//     if (err) throw err;
//     res.send(result);
//   });
// });

app.post('/api/history', (req, res) => {
  const { MaHD } = req.body;
  const sql = ` SELECT chitiethoadon.MaHD as MaHD, MaCTHD,chitiethoadon.MaSP,sanpham.TenSP,sanpham.Giaban as Gia,chitiethoadon.SoLuong,chitiethoadon.TongTien as TONGTIENCTHD,sanpham.Image  from chitiethoadon
  left join sanpham on sanpham.MaSP = chitiethoadon.MaSP
  left join hoadon on chitiethoadon.MaHD = hoadon.MaHD
  where chitiethoadon.MaHD = ?
  `;
  connection.query(sql, MaHD, (err, results, fields) => {
    if (err) {
      console.error(err);
    } else {
      const money = results.map((result) => {
        const moneyy = currencyFormatter.format(result.Gia, {
          code: 'VND',
          precision: 0,
          symbol: '₫',
        });
        return { ...result, moneyy };
      });
      const moneyy = money.map((result) => {
        const moneyy1 = currencyFormatter.format(result.TONGTIENCTHD, {
          code: 'VND',
          precision: 0,
          symbol: '₫',
        });
        return { ...result, moneyy1 };
      });
      const updatedResults = moneyy.map((result) => {
        // Chuyển đổi dữ liệu buffer thành URL hình ảnh
        // const imageUrl = `data:image/jpeg;base64,${result.Image.toString('base64')}`;
        imageUrl = Buffer.from(result.Image, 'base64').toString('binary');
        return { ...result, imageUrl };
      });
      res.json(updatedResults);
    }
  });
});

app.put('/api/updatebill/:id', (req, res) => {
  const MaHD = req.params.id;
  const sql = `update sanpham 
  join chitiethoadon on sanpham.MaSP = chitiethoadon.MaSP
  set sanpham.SoLuong = sanpham.SoLuong - chitiethoadon.SoLuong
  WHERE chitiethoadon.MaHD = ?`;
  connection.query(sql, MaHD, (err, results) => {
    if (err) console.error(err);
  })
})

app.post('/api/historybill', (req, res) => {
  const MaKH = req.body;
  const sql = `select * from hoadon where MaKH = ?
  order by NgayLapHD desc`;
  connection.query(sql, [MaKH], (err, results) => {
    if (err) {
      console.error(err);
    }
    else {
      const updatedResult = results.map((result) => {
        const formattedDateTime = format(
          new Date(result.NgayLapHD),
          'dd/MM/yyyy HH:mm:ss'
        );
        return { ...result, formattedDateTime };
      });
      const moneyy = updatedResult.map((result) => {
        const moneyy1 = currencyFormatter.format(result.TongTien, {
          code: 'VND',
          precision: 0,
          symbol: '₫',
        });
        return { ...result, moneyy1 };
      });
      res.json(moneyy);
    }
  })
})


app.post('/api/signup', (req, res) => {
  const { user, phone, address, name } = req.body;
  const sql = 'insert into khachhang set ?';
  connection.query(
    sql,
    { TAIKHOAN: user, SDT: phone, DIACHI: address, TENKH: name },
    (err, results) => {
      if (err) {
        console.error(err);
      } else {
        res.status(200);
      }
    }
  );
});

app.post('/api/signupp', (req, res) => {
  const { name, user, password } = req.body;
  const sql = 'insert into admin set ?';
  connection.query(
    sql,
    { name: name, username: user, password: password, chucvu: 'Khách hàng' },
    (err, results) => {
      if (err) {
        console.error(err);
      } else {
        res.status(200);
      }
    }
  );
});

app.post('/api/chitiethoadon', (req, res) => {
  const { mahd, masp, soluong, tongtien } = req.body;
  connection.query(
    'INSERT INTO chitiethoadon SET ?',
    {
      MaHD: mahd,
      MaSP: masp,
      SoLuong: soluong,
      TongTien: tongtien,
    },
    (error, results) => {
      if (error) {
        console.error('MySQL error:', error);
        res.sendStatus(500);
      } else {
        console.log('Thêm chi tiết hóa đơn thành công');
        res.sendStatus(200);
      }
    }
  );
});
app.put('/api/cancel/:id', (req, res) => {
  let MaHD = req.params.id;
  let sql = `update hoadon set TinhTrang = ? where MaHD = ? `;
  let value = ['Huỷ', MaHD];

  connection.query(sql, value, (err, results) => {
    if (err) {
      res.sendStatus(500);
    } else {
      res.json('Đã huỷ');
    }
  });
});
app.put('/api/re-bill/:id', (req, res) => {
  let MaHD = req.params.id;
  let sql = `update hoadon set TinhTrang = ? where MaHD = ? `;
  let value = ['Chưa check', MaHD];

  connection.query(sql, value, (err, results) => {
    if (err) {
      res.sendStatus(500);
    } else {
      res.json('Đã huỷ');
    }
  });
});
app.put('/api/done/:id', (req, res) => {
  let MaHD = req.params.id;
  let sql = `update hoadon set TinhTrang = ? where MaHD = ? `;
  let value = ['Đã giao hàng', MaHD];

  connection.query(sql, value, (err, results) => {
    if (err) {
      res.sendStatus(500);
    } else {
      res.json('Huỷ đơn thành công');
    }
  });
});




// app.get('/api/history', (req, res) => {
//   const { MaKH } = req.body;
//   const sql = ` SELECT khachhang.MAKH, TENKH, hoadon.MaHD AS MaHD, MaCTHD, chitiethoadon.TongTien AS TONGTIENCTHD, chitiethoadon.SoLuong, TenSP
//   FROM khachhang
//   LEFT JOIN hoadon ON khachhang.MAKH = hoadon.MaKH
//   LEFT JOIN chitiethoadon ON chitiethoadon.MaHD = hoadon.MaHD
//   LEFT JOIN sanpham ON sanpham.MaSP = chitiethoadon.MaSP
//   WHERE khachhang.MAKH  = ${MaKH}
//   order by NgayLapHD desc`;
//   connection.query(sql, (err, results, field) => {
//     if (err) {
//       console.error(err);
//     } else {
//       const updatedResults = results.map((result) => {
//         // Chuyển đổi dữ liệu buffer thành URL hình ảnh
//         // const imageUrl = `data:image/jpeg;base64,${result.Image.toString('base64')}`;
//         imageUrl = Buffer.from(result.Image, 'base64').toString('binary');
//         return { ...result, imageUrl };
//       });
//       const updatedResult = updatedResults.map((result) => {
//         const formattedDateTime = format(
//           new Date(result.NgayLapHD),
//           'dd/MM/yyyy HH:mm:ss'
//         );
//         return { ...result, formattedDateTime };
//       });
//       const money = updatedResult.map((result) => {
//         const moneyy = currencyFormatter.format(result.Gia, {
//           code: 'VND',
//           precision: 0,
//           symbol: '₫',
//         });
//         return { ...result, moneyy };
//       });
//       res.json(money);
//     }
//   });
// });

app.post('/api/signup', (req, res) => {
  const { user, phone, address, name } = req.body;
  const sql = 'insert into khachhang set ?';
  connection.query(
    sql,
    { TAIKHOAN: user, SDT: phone, DIACHI: address, TENKH: name },
    (err, results) => {
      if (err) {
        console.error(err);
      } else {
        res.status(200);
      }
    }
  );
});

app.post('/api/signupp', (req, res) => {
  const { name, user, password } = req.body;
  const sql = 'insert into admin set ?';
  connection.query(
    sql,
    { name: name, username: user, password: password, chucvu: 'Khách hàng' },
    (err, results) => {
      if (err) {
        console.error(err);
      } else {
        res.status(200);
      }
    }
  );
});

app.post('/return', (req, res) => {
  const vnp_Params = req.body;
  // Xử lý dữ liệu kết quả thanh toán tại đây
  // ...
  // Trả về kết quả cho frontend
  res.status(200).json({ message: 'Thanh toán thành công' });
});

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});

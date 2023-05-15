import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ListProduct.scss';

const ListProduct = (props) => {
  const [data, setData] = useState([]);
  useEffect(() => {
    axios.get('http://localhost:8000/api/sanpham')
      .then(response => {
        setData(response.data);
        console.log(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  const handleAddProduct = (e) => {
    e.preventDefault();
    window.location.href = '/admin/create-product';
  };

  return (
    <div className='container'>
      <div className='mb-3'>
        <button class="btn btn-navbar" type="button" onClick={(e) => handleAddProduct(e)}>
          <i class="fas fa-plus"></i>Thêm sản phẩm
        </button>
      </div>
      <div id="list-product" >
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Mã SP</th>
              <th>Tên SP</th>
              <th>Số lượng</th>
              <th>Giá nhập</th>
              <th>Giá bán</th>
              <th>Mã LSP</th>
              <th>NSX</th>
              <th>Mô tả</th>
              <th>Hình ảnh</th>
            </tr>
          </thead>
          <tbody>
            {data.map(item => (
              <tr key={item.id}>
                <td>{item.MaSP}</td>
                <td>{item.TenSP}</td>
                <td>{item.SoLuong}</td>
                <td>{item.GiaNhap}</td>
                <td>{item.GiaBan}</td>
                <td>{item.MaLoaiSP}</td>
                <td>{item.NSX}</td>
                <td>{item.MoTa}</td>
                <td><img src={item.imageUrl} alt={item.TenSP} className='fixImage' /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  )
}

export default ListProduct;
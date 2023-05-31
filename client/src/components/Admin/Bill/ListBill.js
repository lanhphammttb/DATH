import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Bill.scss';

const ListBill = (props) => {
  const [data, setData] = useState([]);
  useEffect(() => {
    axios
      .get('/api/hoadon')
      .then((response) => {
        setData(response.data);
        console.log(response.data);
        console.log('A');
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const handleAddProduct = (e) => {
    e.preventDefault();
    window.location.href = '/admin/create-bill';
  };

  return (
    <div className="container">
      {/* <div className='mb-3'>
                <button class="btn btn-navbar" type="button" onClick={(e) => handleAddProduct(e)}>
                    <i class="fas fa-plus"></i>Thêm hoá đơn
                </button>
            </div> */}
      <div id="list-bill">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Mã hoá đơn</th>
              <th>Mã khách hàng</th>
              <th>Ngày lập hoá đơn</th>
              <th>Khuyến mãi</th>
              <th>Tổng tiền</th>
              <th>Ghi chú</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.MaHD}>
                <td>{item.MaHD}</td>
                <td>{item.MaKH}</td>
                <td>{item.formattedDateTime}</td>
                <td>{item.KhuyenMai}</td>
                <td>{item.TongTien}</td>
                <td>{item.GhiChu}</td>
                <td className="check">
                  <button className="btn">
                    Check <i class="fas fa-check"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ListBill;

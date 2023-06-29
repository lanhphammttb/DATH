import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const BillDone = () => {
    const [data, setData] = useState([]);
    const [show, setShow] = useState(false);
    const navigate = useNavigate();
    useEffect(() => {
        axios
            .get('/api/hoadon')
            .then((response) => {
                setData(response.data);
                console.log(response.data);
            })
            .catch((error) => {
                console.error(error);
            });
    }, []);


    return (
        <div className="container">
            {/* <div className='mb-3'>
                      <button class="btn btn-navbar" type="button" onClick={(e) => handleAddProduct(e)}>
                          <i class="fas fa-plus"></i>Thêm hoá đơn
                      </button>
                  </div> */}
            <div id="list-bill" style={{ width: '100%' }}>
                <p className='text-center text-danger'>Đơn hàng đã hoàn thành</p>
                <table className="table table-striped">
                    <thead>
                        <tr className="text-center">
                            <th>Mã hoá đơn</th>
                            <th>Tên khách hàng</th>
                            <th>Số điện thoại</th>
                            <th>Ngày lập hoá đơn</th>
                            <th>Tổng tiền</th>
                            <th>Ghi chú</th>

                        </tr>
                    </thead>
                    <tbody>
                        {data.map((item) => (
                            <tr key={item.MaHD} className="text-center">
                                {item.TinhTrang === 'Đã giao hàng' && (
                                    <>
                                        <td
                                            onClick={() => {
                                                setShow(show ? false : true);
                                                localStorage.removeItem('mahd');
                                                localStorage.setItem('mahd', item.MaHD);
                                                navigate('/admin/list-bills');
                                            }}
                                            style={{
                                                cursor: 'pointer',
                                                color: 'red',
                                                fontWeight: 900,
                                            }}
                                        >
                                            #{item.MaHD}
                                        </td>
                                        <td>{item.TenKH}</td>
                                        <td>{item.SDT}</td>
                                        <td>{item.formattedDateTime}</td>
                                        <td>{item.TongTien}</td>
                                        <td>{item.GhiChu}</td>
                                    </>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default BillDone;
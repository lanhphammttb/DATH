import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Delivering = () => {
    const [data, setData] = useState([]);
    const [show, setShow] = useState(false);
    const navigate = useNavigate();
    useEffect(() => {
        axios
            .get('/api/hoadon')
            .then((response) => {
                setData(response.data);
                // console.log(response.data);
            })
            .catch((error) => {
                console.error(error);
            });
    }, []);
    const handleCheck = (id) => {
        axios.put(`/api/done/${id}`);

        setData(data.filter((data) => data.MaHD !== id));
    };

    return (
        <div className="container">
            {/* <div className='mb-3'>
                      <button class="btn btn-navbar" type="button" onClick={(e) => handleAddProduct(e)}>
                          <i class="fas fa-plus"></i>Thêm hoá đơn
                      </button>
                  </div> */}
            <div id="list-bill" style={{ width: '100%' }}>
                <p className='text-center text-danger'>Đang vận chuyển</p>
                <table className="table table-striped">
                    <thead>
                        <tr className="text-center">
                            <th>Mã hoá đơn</th>
                            <th>Tên khách hàng</th>
                            <th>Số điện thoại</th>
                            <th>Ngày lập hoá đơn</th>
                            <th>Tổng tiền</th>
                            <th>Ghi chú</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((item) => (
                            <tr key={item.MaHD} className="text-center">
                                {item.TinhTrang === 'Đang vận chuyển' && (
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
                                        <td className=' align-items-center'>
                                            <button
                                                onClick={() => handleCheck(item.MaHD)}
                                                className="btn btn-success w-100 mr-2 mb-2  "
                                            >
                                                Đã giao hàng <i class="fas fa-check"></i>
                                            </button>
                                        </td>
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

export default Delivering;
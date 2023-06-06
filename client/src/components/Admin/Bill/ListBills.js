import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ListBills = () => {
    const MaHD = parseInt(localStorage.getItem('mahd'));
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    useEffect(() => {
        axios.get(`http://localhost:8000/api/chitiethoadon/${MaHD}`)
            .then(response => {
                setData(response.data)
                console.log(response.data)
                debugger
            }
            )
            .catch(error => {
                console.error(error);
            })

    }, []);

    return (

        <div className='container'>
            <div id="list-bills" >
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>Mã chi tiết hoá đơn</th>
                            <th>Mã hoá đơn</th>
                            <th>Mã sản phẩm</th>
                            <th>Số Lượng</th>
                            <th>Tổng tiền</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map(item => (
                            <tr key={item.MaCTHD}>
                                <td>{item.MaCTHD}</td>
                                <td>{item.MaHD}</td>
                                <td>{item.MaSP}</td>
                                <td>{item.SoLuong}</td>
                                <td>{item.TongTien}</td>

                            </tr>
                        ))
                        }
                    </tbody>
                </table>
                <button onClick={() => {

                    navigate('/admin/list-bill');

                }}
                    className="custom-button"    >Trở về</button>
            </div>
        </div>

    )
}

export default ListBills;
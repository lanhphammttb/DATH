import React, { useEffect, useState } from "react";
import axios from "axios";
const Canceled = () => {
    const MaKH = localStorage.getItem('makh');
    const [data, setData] = useState([]);
    const [show, setShow] = useState(false);
    const [cthd, setCthd] = useState([]);
    useEffect(() => {
        axios
            .post('/api/historybill', { MaKH })
            .then((response) => {
                setData(response.data);
                console.log(response.data);

            })
            .catch((err) => {
                console.error(err);
            });
    }, []);

    const handleCancel = (id) => {
        axios
            .put(`/api/re-bill/${id}`)
            .then(() => {
                setData(
                    data.filter((dt) => {
                        return dt.MaHD !== id;
                    })
                );
            })
            .catch((err) => {
                console.error(err);
            });
    }
    return (
        <>
            <div className="container-fluid">
                <ul style={{ padding: '0px', minHeight: 350 }}>
                    {data.map((item) => (
                        <div key={item.MaHD}>
                            {item.TinhTrang === 'Huỷ' && (
                                <li className="row d-flex align-items-center mt-2 border ">
                                    <div className="col-1 d-flex justify-content-center text-danger font-weight-bold " onClick={(e) => {
                                        e.preventDefault();
                                        setShow(show ? false : true);
                                        const MaHD = item.MaHD;
                                        localStorage.setItem("mahdd", MaHD);
                                        console.log(MaHD);
                                        axios.post('/api/history', { MaHD })
                                            .then((res) => {
                                                setCthd(res.data);
                                                console.log(res.data);
                                            })
                                    }}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        #{item.MaHD}
                                    </div>
                                    <div className="col-2">Tên người nhận : <br />
                                        {item.TenNguoiNhan}
                                    </div>
                                    <div className="col-1" style={{ color: 'rgba(0,0,0,.87)' }}>SĐT : <br />
                                        {item.SDTNguoiNhan}
                                    </div>
                                    <div className="col-2">
                                        Ngày đặt hàng :<br />
                                        {item.formattedDateTime}
                                    </div>
                                    <div className="col-3">
                                        Địa chỉ :<br />
                                        {item.DiaChiNhanHang}
                                    </div>
                                    <div className="col-2 d-flex justify-content-center">
                                        Tổng tiền :
                                        <br />
                                        <p
                                            className="font-weight-bold"
                                            style={{ color: '#ee4d2d' }}
                                        >
                                            {item.moneyy1}
                                        </p>
                                    </div>
                                    <div className="col-1 d-flex justify-content-center">
                                        <button className="btn btn-danger" onClick={() => handleCancel(item.MaHD)}>Đặt lại</button>
                                    </div>
                                </li>
                            )}
                        </div>
                    ))}
                </ul>
                {show &&
                    <div>
                        <p>Chi tiết hoá đơn #{localStorage.getItem("mahdd")}</p>
                        <ul>
                            {
                                cthd.map((item) => (
                                    <li key={item.MaCTHD} className="row d-flex align-items-center mt-2 border ">
                                        <div className='col-1'>#{item.MaCTHD}</div>
                                        <div className='col-1'>
                                            <img
                                                src={item.imageUrl}
                                                alt="sản phẩm"
                                                className='w-50'
                                            />
                                        </div>
                                        <div className='col-2'>
                                            {item.TenSP}
                                        </div>
                                        <div className='col-2'>
                                            {item.moneyy}
                                        </div>
                                        <div className='col-2 d-flex align-items-center'>
                                            x{item.SoLuong}
                                        </div>
                                        <div className='col-2'>
                                            Tổng tiền : <br />
                                            {item.moneyy1}
                                        </div>
                                    </li>
                                ))
                            }
                        </ul>
                    </div>
                }
            </div>
        </>
    );
}

export default Canceled;
import Form from 'react-bootstrap/Form';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CreatProduct = (props) =>{

    const [masp,setMaSP] = useState("");
    const [tensp,setTenSP] = useState("");
    const [soluong,setSoLuong] = useState("");
    const [gianhap,setGiaNhap] = useState("");
    const [giaban,setGiaBan] = useState("");
    const [maloaisp,setMaLoaiSP] = useState("");
    const [nsx,setNSX] = useState("");
    const [mota,setMoTa] = useState("");
    const [file,setFile] = useState("");

    // const history = useNavigate();

    const setmasp = (e)=>{
        setMaSP(e.target.value)
    }

    const settensp = (e)=>{
        setTenSP(e.target.value)
    }

    const setsoluong = (e)=>{
        setSoLuong(e.target.value)
    }

    const setgianhap = (e)=>{
        setGiaNhap(e.target.value)
    }

    const setgiaban = (e)=>{
        setGiaBan(e.target.value)
    }

    const setmaloaisp = (e)=>{
        setMaLoaiSP(e.target.value)
    }

    const setnsx = (e)=>{
        setNSX(e.target.value)
    }

    const setmota = (e)=>{
        setMoTa(e.target.value)
    }

    const setimgfile = (e)=>{
        setFile(e.target.files[0])
    }

    const addData = async(e)=>{
        e.preventDefault();

        var formData = new FormData();
        formData.append("masp",masp);
        formData.append("tensp",tensp);
        formData.append("soluong",soluong);
        formData.append("gianhap",gianhap);
        formData.append("giaban",giaban);
        formData.append("maloaisp",maloaisp);
        formData.append("nsx",nsx);
        formData.append("mota",mota);
        formData.append("file",file)

        const config = {
            headers:{
                "Content-Type":"multipart/form-data"
            }
        }

        const res = await axios.post("http://localhost:8000/api/sanpham",formData,config);
       
        if(res.data.status == 201){
            console.log("success")
            // history("/")
        }else{
            console.log("error")
        }
    }

    return (
        <>
            <div className='container mt-3'>
                <h1>Upload Your Img Here</h1>

                <Form>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Mã sản phẩm</Form.Label>
                        <Form.Control type="text" name='masp' onChange={setmasp} />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Tên sản phẩm</Form.Label>
                        <Form.Control type="text" name='tensp' onChange={settensp} />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Số lượng</Form.Label>
                        <Form.Control type="text" name='soluong' onChange={setsoluong} />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Giá nhập</Form.Label>
                        <Form.Control type="text" name='gianhap' onChange={setgianhap} />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Giá bán</Form.Label>
                        <Form.Control type="text" name='giaban' onChange={setgiaban} />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Mã loại sản phẩm</Form.Label>
                        <Form.Control type="text" name='maloaisp' onChange={setmaloaisp} />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>NSX</Form.Label>
                        <Form.Control type="text" name='nsx' onChange={setnsx} />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Mô tả</Form.Label>
                        <Form.Control type="text" name='mota' onChange={setmota} />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Label>Select Your Image</Form.Label>
                        <Form.Control type="file" name='file' onChange={setimgfile} />
                    </Form.Group>
                    <button variant="primary" type="submit" onClick={addData}>
                        Submit
                    </button>
                </Form>
            </div>
        </>
    )
}

export default CreatProduct;
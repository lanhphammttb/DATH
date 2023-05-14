import Form from 'react-bootstrap/Form';
import React, { useState, useEffect, useRef } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import './CreateProduct.scss';
import CommonUtils from '../../../ultils/CommonUtils';
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
    
    const imageRef = useRef(null);
    const setimgfile = async(e) => {
        var fileImage = e.target.files[0];
        var base64 = await CommonUtils.getBase64(fileImage);
        var imageElement = document.createElement('img');


        console.log(base64);
        if(!fileImage.name) {
            return
        }

        if(!['.jpg', '.png', '.jpeg'].some(ext => fileImage.name.toLowerCase().includes(ext)))
        {
            toast.error('Hình ảnh phải thuộc dạng jpeg');
            return
        }
        console.log(fileImage);
        imageElement.src = URL.createObjectURL(fileImage);
        imageRef.current.appendChild(imageElement);   
        
        setFile(base64);
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
            toast.success('Thêm sản phẩm thành công')
            // history("/")
        }else{
            console.log("error")
        }
    }

    return (
        <>
            <div className='container'>

                <Form className='row'>
                <Form.Group className="col-md-6">
                    <Form.Group className="mb-1">
                        <Form.Label>Mã sản phẩm</Form.Label>
                        <Form.Control type="text" name='masp' onChange={setmasp} />
                    </Form.Group>

                    <Form.Group className="mb-1">
                        <Form.Label>Tên sản phẩm</Form.Label>
                        <Form.Control type="text" name='tensp' onChange={settensp} />
                    </Form.Group>

                    <Form.Group className="mb-1">
                        <Form.Label>Số lượng</Form.Label>
                        <Form.Control type="text" name='soluong' onChange={setsoluong} />
                    </Form.Group>

                    <Form.Group className="mb-1">
                        <Form.Label>Giá nhập</Form.Label>
                        <Form.Control type="text" name='gianhap' onChange={setgianhap} />
                    </Form.Group>

                    <Form.Group className="mb-1">
                        <Form.Label>Giá bán</Form.Label>
                        <Form.Control type="text" name='giaban' onChange={setgiaban} />
                    </Form.Group>

                    <Form.Group className="mb-1">
                        <Form.Label>Mã loại sản phẩm</Form.Label>
                        <Form.Control type="text" name='maloaisp' onChange={setmaloaisp} />
                    </Form.Group>

                    <Form.Group className="mb-1">
                        <Form.Label>NSX</Form.Label>
                        <Form.Control type="text" name='nsx' onChange={setnsx} />
                    </Form.Group>

                    <Form.Group className="mb-1">
                        <Form.Label>Mô tả</Form.Label>
                        <Form.Control type="text" name='mota' onChange={setmota} />
                    </Form.Group>
                </Form.Group>                    

                <Form.Group className="col-md-6">
                    <Form.Group className="mb-1">
                        <Form.Label htmlFor ="mypicture" className='preview'  ref={imageRef}>
                            <i className="fas fa-cloud-upload"></i>
                            <span>
                                Select Your Image
                            </span>
                        </Form.Label>
                        <Form.Control type="file" name='file' onChange={(e) => setimgfile(e)} hidden id="mypicture"/>
                    </Form.Group>
                    <button className='btn btn-primary' variant="primary" type="submit" onClick={addData}>
                        Submit
                    </button>    
        
                </Form.Group>
                </Form>   
            </div>             
        </>
    )
}

export default CreatProduct;
import React from "react";
import { NavLink, Link } from "react-router-dom";
import { BsSearch } from "react-icons/bs";
import { useState } from "react";
// import compare from "../assets/images/compare.svg";
// import wishlist from "../assets/images/wishlist.svg";
import user from "../assets/images/user.svg";
import cart from "../assets/images/cart.svg";
import menu from "../assets/images/menu.svg";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Header = () => {
    const u = JSON.parse(localStorage.getItem('user'));
    const welcomeMessage = u?.name;
    const navigate = useNavigate();
    const [state, setState] = useState(true);
    const logout = async () => {
        try {
            await axios.post('/api/logout');
            // Xóa token khỏi cookie hoặc local storage
            localStorage.removeItem('user');
            localStorage.removeItem('token');
            localStorage.removeItem('chucvu');
            // Chuyển hướng trang về trang đăng nhập
            navigate('/login');
            setState(true);
        } catch (error) {
            console.log(error);
        }
    };
    return (
        <>
            <header className="header-top-strip py-3">
                <div className="container-xxl">
                    <div className="row">
                        <div className="col-6">
                            <div class="flex-col hide-for-medium flex-left">
                                <ul class="nav nav-left medium-nav-center nav-small  nav-divided">
                                    <li class="html custom html_topbar_left">
                                        <p className="text-end text-white mb-0"><i class="fa fa-map-marker mr-2"></i>Địa chỉ: 55 Giải Phóng, Hai Bà Trưng, Hà Nội</p>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="col-6">
                            <p className="text-end text-white mb-0">
                                <i class="fa fa-phone mr-2"></i>Hotline:
                                <a className="text-white" href="tel:+91 8264954234">
                                    +91 8264954234
                                </a>
                            </p>
                        </div>
                    </div>
                </div>
            </header>
            <header className="header-upper py-3">
                <div className="container-xxl">
                    <div className="row align-items-center">
                        <div className="col-2">
                            <h2>
                                <Link className="text-white">Vinh Quang</Link>
                            </h2>
                        </div>
                        <div className="col-5">
                            <div className="input-group" >
                                <input
                                    style={{ height: '50px' }}
                                    type="text"
                                    className="form-control py-2"
                                    placeholder="Nhập tên sản phẩm..."
                                    aria-label="Nhập tên sản phẩm..."
                                    aria-describedby="basic-addon2"
                                />
                                <span className="input-group-text p-3" id="basic-addon2">
                                    <BsSearch className="fs-6" />
                                </span>
                            </div>
                        </div>
                        <div className="col-5">
                            <div className="header-upper-links d-flex align-items-center justify-content-between">
                                <div>
                                    {/* <Link
                                        to="/compare-product"
                                        className="d-flex align-items-center gap-10 text-white"
                                    >
                                        <img src={compare} alt="compare" />
                                        <p className="mb-0">
                                            Compare <br /> Products
                                        </p>
                                    </Link> */}
                                </div>
                                <div>
                                    {/* <Link
                                        to="/wishlist"
                                        className="d-flex align-items-center gap-10 text-white"
                                    >
                                        <img src={wishlist} alt="wishlist" />
                                        <p className="mb-0">
                                            Favourite <br /> wishlist
                                        </p>
                                    </Link> */}
                                </div>
                                <div >
                                    <ul style={{ listStyle: 'none' }}>
                                        <li>
                                            {welcomeMessage ?
                                                <Link onClick={() => setState(state ? false : true)}
                                                    to="/"
                                                    className="d-flex align-items-center gap-10 text-white"
                                                >
                                                    <img src={user} alt="user" />
                                                    <p className="mb-0"  >
                                                        {
                                                            welcomeMessage != undefined ? welcomeMessage : "ĐĂNG NHẬP"
                                                        }
                                                        {/* Đăng nhập <br /> tài khoản của tôi */}
                                                    </p>


                                                </Link> :
                                                <Link onClick={(e) => {
                                                    e.preventDefault();
                                                    setState(true)
                                                }}
                                                    to="/login"
                                                    className="d-flex align-items-center gap-10 text-white"
                                                >
                                                    <img src={user} alt="user" />
                                                    <p className="mb-0"  >
                                                        {
                                                            welcomeMessage != undefined ? welcomeMessage : "ĐĂNG NHẬP"
                                                        }
                                                        {/* Đăng nhập <br /> tài khoản của tôi */}
                                                    </p>
                                                </Link>
                                            }
                                        </li>
                                        <li style={{ width: 77, height: 28 }} >
                                            <div style={{ display: state ? "none" : "flex" }}>
                                                <button onClick={() => logout()} className="custom-button">Đăng xuất</button>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                                <div>
                                    <Link
                                        to="/cart"
                                        className="d-flex align-items-center gap-10 text-white"
                                    >
                                        <img src={cart} alt="cart" />
                                        <div className="d-flex flex-column gap-10">
                                            <span className="badge bg-white text-dark">0</span>
                                            <p className="mb-0">$ 500</p>
                                        </div>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>
            <header className="header-bottom py-3">
                <div className="container-xxl">
                    <div className="row">
                        <div className="col-12">
                            <div className="menu-bottom d-flex align-items-center gap-30">
                                <div>
                                    <div className="dropdown">
                                        <button
                                            className="btn btn-secondary dropdown-toggle bg-transparent border-0 gap-15 d-flex align-items-center"
                                            type="button"
                                            id="dropdownMenuButton1"
                                            data-bs-toggle="dropdown"
                                            aria-expanded="false"
                                        >
                                            <img src={menu} alt="" />
                                            <span className="me-5 d-inline-block">
                                                Danh mục cửa hàng
                                            </span>
                                        </button>
                                        <ul
                                            className="dropdown-menu"
                                            aria-labelledby="dropdownMenuButton1"
                                        >
                                            <li>
                                                <Link className="dropdown-item text-white" to="">
                                                    Action
                                                </Link>
                                            </li>
                                            <li>
                                                <Link className="dropdown-item text-white" to="">
                                                    Another action
                                                </Link>
                                            </li>
                                            <li>
                                                <Link className="dropdown-item text-white" to="">
                                                    Something else here
                                                </Link>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                                <div className="menu-links">
                                    <div className="d-flex align-items-center gap-15">
                                        <NavLink to="/">Trang chủ</NavLink>
                                        <NavLink to="/product">Sản phẩm</NavLink>
                                        <NavLink to="/blogs">Blogs</NavLink>
                                        <NavLink to="/contact">Liên hệ</NavLink>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>
        </>
    );
};

export default Header;

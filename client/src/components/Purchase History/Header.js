import React from "react";
import { Link } from "react-router-dom";

const Headers = () => {

    return (
        <>
            <div className="container-fuild">
                <div className="row">

                    <div className="col-md-2 bg-secondary">
                    </div>
                    <div className="col-md-10">
                        <ul className="nav text-center w-100">
                            <li className="nav-item bg-light ">
                                <Link className="nav-link text-dark">Chờ xác nhận</Link>
                            </li>
                            <li className="nav-item bg-light">
                                <Link className="nav-link text-dark">Đang vận chuyển</Link>
                            </li>
                            <li className="nav-item bg-light">
                                <Link className="nav-link text-dark">Hoàn thành</Link>
                            </li>
                            <li className="nav-item bg-light">
                                <Link className="nav-link text-dark">Đã huỷ</Link>
                            </li>
                        </ul>

                    </div>
                </div>
            </div>
        </>
    )
}

export default Headers;
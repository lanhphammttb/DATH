import { Link } from "react-router-dom";
import BreadCrumb from "../components/BreadCrumb";
import Meta from "../components/Meta";
import Container from "../components/Container";
import axios from 'axios';
import React, { useEffect, useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';




const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [data, setData] = useState([]);
  const isAdmin = true;
  useEffect(() => {
    axios.get('http://localhost:8000/users')
      .then(response => {
        setData(response.data);
        console.log(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    axios
      .post('http://localhost:8000/login', { username, password })
      .then((response) => {
        const token = response.data.token;
        const user = response.data;
        localStorage.setItem('chucvu', response.data.chucvu);
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        if (response.data.chucvu === 'Admin' || response.data.chucvu === 'Nhân viên') {
          window.location.href = '/admin'; // Chuyển hướng sang trang dashboard sau khi đăng nhập thành công
          isAdmin = true;
        }
        else {
          window.location.href = '/';
          isAdmin = false;
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const pushMenuRef = useRef(null);

  // const isVisible = (e) => {
  //   e.preventDefault();
  //   let a = document.getElementById("password");
  //   let b = document.getElementById("icon");
  //   a.type === "password" ? a.type = "text" : a.type = "password";
  //   a.type === "password" ? b.classList.add('fa-eye')&&b.classList.remove('fa-eye-slash') : b.classList.add('fa-eye-slash')&&b.classList.remove('fa-eye');
  //   };

  const [status, setStatus] = useState(false);

  const isVisible = () => {
    setStatus(status ? false : true)
  }
  const navigate = useNavigate();

  useEffect(() => {
    // kiểm tra xem người dùng đã đăng nhập hay chưa
    const isLoggedIn = localStorage.getItem('user');

    if (isLoggedIn) {
      // nếu đã đăng nhập, chuyển hướng đến trangkhác
      navigate('/', { replace: true });
    }
  }, [navigate]);
  return (
    <>
      <Meta title={"Login"} />
      <BreadCrumb title="Login" />
      <Container class1="login-wrapper py-5 home-wrapper-2">
        <div className="row">
          <div className="col-12">
            <div className="auth-card">
              <h3 className="text-center mb-3">Login</h3>
              <form onSubmit={handleSubmit} action="" className="d-flex flex-column gap-15" name="formlogin">
                <input value={username} onChange={(e) => setUsername(e.target.value)} type="email" name="email" placeholder="Email" className=" form-control input" />
                <div className="d-flex" style={{ backgroundColor: "#F5F5F7", borderRadius: "10px" }}>
                  <input
                    value={password} onChange={(e) => setPassword(e.target.value)}
                    type={status ? "text" : "password"}
                    name="password"
                    placeholder="Password"
                    className=" form-control input"
                    id="password"
                  />
                  <FontAwesomeIcon style={{ marginTop: 18, marginRight: 10, cursor: "pointer" }} icon={status ? faEye : faEyeSlash} onClick={isVisible} />
                </div>
                <div>
                  <Link to="/forgot-password">Forgot Password?</Link>

                  <div className="mt-3 d-flex justify-content-center gap-15 align-items-center">
                    <button className="button border-0" type="submit"
                      onClick={(e) => {
                        // e.preventDefault();
                      }}>
                      Login
                    </button>
                    <Link to="/signup" className="button signup">
                      SignUp
                    </Link>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </Container>
    </>
  );
};

export default Login;

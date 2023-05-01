import { Link} from "react-router-dom";
import BreadCrumb from "../components/BreadCrumb";
import Meta from "../components/Meta";
import Container from "../components/Container";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEyeSlash } from '@fortawesome/free-solid-svg-icons'
import axios from 'axios';
import React, { useEffect, useState } from 'react';


const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const handleSubmit = (event) => {
    event.preventDefault();
    axios
      .post('http://localhost:8000/login', { username, password })
      .then((response) => {
        const token = response.data.token;
        localStorage.setItem('token', token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        window.location.href = '/product'; // Chuyển hướng sang trang dashboard sau khi đăng nhập thành công
      })
      .catch((error) => {
        console.error(error);
      });
  };
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
                    type="password"
                    name="password"
                    placeholder="Password"
                    className=" form-control input"
                    id="password"
                  />
                  <FontAwesomeIcon style={{ paddingRight: "1rem", cursor: "pointer" }} className="align-self-center" onClick={(e) => {
                    e.preventDefault();
                    let a = document.getElementById("password");
                    a.type === "password" ? a.type = "text" : a.type = "password";
                  }} icon={faEyeSlash} />
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

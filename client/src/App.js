import React from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./views/Home";
import About from "./views/About";
import Contact from "./views/Contact";
import OurStore from "./views/OurStore";
import Blog from "./views/Blog";
import CompareProduct from "./views/CompareProduct";
import Wishlist from "./views/Wishlist";
import Login from "./views/Login";
import Forgotpassword from "./views/Forgotpassword";
import Signup from "./views/Signup";
import Resetpassword from "./views/Resetpassword";
import SingleBlog from "./views/SingleBlog";
import PrivacyPolicy from "./views/PrivacyPolicy";
import RefundPloicy from "./views/RefundPloicy";
import ShippingPolicy from "./views/ShippingPolicy";
import TermAndContions from "./views/TermAndContions";
import SingleProduct from "./views/SingleProduct";
import Cart from "./views/Cart";
import Checkout from "./views/Checkout";
import ListProduct from "./components/Admin/ListProduct/ListProduct";
import LayoutAdmin from "./components/Admin/LayoutAdmin/LayoutAdmin";
import CreatProduct from "./components/Admin/CreateProduct/CreateProduct";
import ListBill from "./components/Admin/ListBill/ListBill";
function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="about" element={<About />} />
            <Route path="contact" element={<Contact />} />
            <Route path="product" element={<OurStore />} />
            <Route path="product/:id" element={<SingleProduct />} />
            <Route path="blogs" element={<Blog />} />
            <Route path="blog/:id" element={<SingleBlog />} />
            <Route path="cart" element={<Cart />} />
            <Route path="checkout" element={<Checkout />} />
            <Route path="compare-product" element={<CompareProduct />} />
            <Route path="wishlist" element={<Wishlist />} />
            <Route path="login" element={<Login />} />
            <Route path="forgot-password" element={<Forgotpassword />} />
            <Route path="signup" element={<Signup />} />
            <Route path="reset-password" element={<Resetpassword />} />
            <Route path="privacy-policy" element={<PrivacyPolicy />} />
            <Route path="refund-policy" element={<RefundPloicy />} />
            <Route path="shipping-policy" element={<ShippingPolicy />} />
            <Route path="term-conditions" element={<TermAndContions />} />
          </Route>
        </Routes>
      </BrowserRouter>
      <BrowserRouter>
        {localStorage.getItem('chucvu') !== 'Khách hàng' ?
          <Routes>
            <Route path="/admin" element={<LayoutAdmin />}>
              <Route index element={<ListProduct />} />
              <Route path="list-product" element={<ListProduct />} />
              <Route path="create-product" element={<CreatProduct />} />
              <Route path="list-bill" element={<ListBill />} />
            </Route>
          </Routes>

          : <Routes>
            <Route path="/admin" element={<LayoutAdmin />}> </Route>
          </Routes>}
      </BrowserRouter>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      {/* Same as */}
      <ToastContainer />
    </>
  );
}

export default App;

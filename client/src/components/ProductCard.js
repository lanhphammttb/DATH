import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactStars from "react-rating-stars-component";
import { Link, useLocation } from "react-router-dom";
import prodcompare from "../assets/images/prodcompare.svg";
import wish from "../assets/images/wish.svg";
import wishlist from "../assets/images/wishlist.svg";
import watch from "../assets/images/watch.jpg";
import watch2 from "../assets/images/watch-1.avif";
import iconcart from "../assets/images/icon-cart.png"
import addcart from "../assets/images/add-cart.svg";
import view from "../assets/images/view.svg";
const ProductCard = (props) => {
  const { grid } = props;
  let location = useLocation();
  const [data, setData] = useState([]);
  const [id, setId] = useState('');

  useEffect(() => {
    axios.get('http://localhost:8000/api/sanpham')
      .then((res) => setData(res.data))
      .catch((err) => console.log(err));
  }, []);
  return (
    <>
      <div>
        {data.map((item) => (
          <div key={item.MaSP}>
            <div
              className={` ${location.pathname == "/product" ? `gr-${grid}` : "col-3"
                } `}
            >  
              <Link
                to={
                  location.pathname === "/product"
                    ? `/product/${item.MaSP}`
                    : `/${item.MaSP}`
                }
                className="product-card position-relative"
              >
                <div className="wishlist-icon position-absolute">
                  <button className="border-0 bg-transparent">
                    <img src={wish} alt="wishlist" />
                  </button>
                </div>
                <div className="product-image">
                  <img src={item.imageUrl} className="img-fluid" alt="product image" />
                  <img src={iconcart} className="img-fluid" alt="product image" />
                </div>
                <div className="product-details">
                  <h6 className="brand">Havels</h6>
                  <h5 p style={{ fontFamily: "Roboto, sans-serif" }} className="product-title">
                    <p>{item.TenSP}</p>
                  </h5>
                  <ReactStars
                    count={5}
                    size={24}
                    value={4}
                    edit={false}
                    activeColor="#ffd700"
                  />
                  <p className={`description ${grid === 12 ? "d-block" : "d-none"}`}>
                    At vero eos et accusamus et iusto odio dignissimos ducimus qui
                    blanditiis praesentium voluptatum deleniti atque corrupti quos
                    dolores et quas molestias excepturi sint occaecati cupiditate non
                    provident, similique sunt...
                  </p>
                  <p className="price"><p>{item.GiaBan} VNĐ</p></p>
                </div>
                <div className="action-bar position-absolute">
                  <div className="d-flex flex-column gap-15">
                    <button className="border-0 bg-transparent">
                      <img src={prodcompare} alt="compare" />
                    </button>
                    <button className="border-0 bg-transparent">
                      <img src={view} alt="view" />
                    </button>
                    <button className="border-0 bg-transparent">
                      <img src={addcart} alt="addcart" />
                    </button>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default ProductCard;

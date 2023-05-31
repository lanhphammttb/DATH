import React, { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import ReactStars from 'react-rating-stars-component';
import { Link, useLocation } from 'react-router-dom';
import prodcompare from '../assets/images/prodcompare.svg';
import wish from '../assets/images/wish.svg';
// import wishlist from '../assets/images/wishlist.svg';
// import watch from '../assets/images/watch.jpg';
// import watch2 from '../assets/images/watch-1.avif';
import iconcart from '../assets/images/icon-cart.png';
import addcart from '../assets/images/add-cart.svg';
import view from '../assets/images/view.svg';
import { CartContext } from '../CartContext';
import _ from 'lodash';
const ProductCard = (props) => {
  const { grid } = props;
  const { condition } = props;
  let location = useLocation();
  const [products, setProducts] = useState([]);
  // const [id, setId] = useState('');
  const { searchTerm } = useContext(CartContext);

  // useEffect(() => {
  //   axios
  //     .get('/api/sanpham')
  //     .then((response) => {
  //       setProducts(response.data);
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  // }, []);

  // useEffect(() => {
  //   if (searchTerm) {
  //     axios
  //       .get('http://localhost:8000/api/sanpham', { params: { searchTerm } })
  //       .then((response) => {
  //         setProducts(response.data);
  //       })
  //       .catch((error) => {
  //         console.log(error);
  //       });
  //   } else {
  //     setProducts(products);
  //   }
  // }, [searchTerm, products]);
  const fetchProducts = async () => {
    let url = 'http://localhost:8000/api/sanpham';
    let config = {};
    if (searchTerm) {
      config.params = { searchTerm };
    }

    const response = await axios.get(url, config);
    let data = response.data;

    switch (condition) {
      case 'Giá, Thấp đến Cao':
        data = _.sortBy(data, 'GiaBan');
        break;
      case 'Giá, Cao đến Thấp':
        data = _.sortBy(data, 'GiaBan').reverse();
        break;
      case 'Theo Thứ Tự, A-Z':
        data = _.sortBy(data, 'TenSP');
        break;
      case 'Theo Thứ Tự, Z-A':
        data = _.sortBy(data, 'TenSP').reverse();
        break;
      // Thêm các case cho các trường hợp khác
      default:
        // Xử lý cho trường hợp mặc định nếu không có case nào khớp với giá trị của biến condition
        break;
    }
    setProducts(data);
  };

  useEffect(() => {
    fetchProducts();
  }, [searchTerm, condition]);

  return (
    <>
      {products.map((item) => (
        <div
          key={item.MaSP}
          className={` ${location.pathname === '/' ? 'col-3' : `gr-${grid}`} `}
        >
          <Link
            to={`${
              location.pathname === '/'
                ? `/product/${item.MaSP}`
                : location.pathname === `/product/${item.MaSP}`
                ? `/product/${item.MaSP}`
                : `${item.MaSP}`
            }`}
            className="product-card position-relative"
          >
            <div className="wishlist-icon position-absolute">
              <button className="border-0 bg-transparent">
                <img src={wish} alt="wishlist" />
              </button>
            </div>
            <div className="product-image">
              <img
                src={item.imageUrl}
                className="img-fluid"
                aria-hidden
                alt="product image"
              />
              <img
                src={iconcart}
                className="img-fluid"
                aria-hidden
                alt="product image"
              />
            </div>
            <div className="product-details">
              <h6 className="brand">Havels</h6>
              <h5
                p
                style={{ fontFamily: 'Roboto, sans-serif' }}
                className="product-title"
              >
                <p>{item.TenSP}</p>
              </h5>
              <ReactStars
                count={5}
                size={24}
                value={4}
                edit={false}
                activeColor="#ffd700"
              />
              <p
                className={`description ${grid === 12 ? 'd-block' : 'd-none'}`}
              >
                At vero eos et accusamus et iusto odio dignissimos ducimus qui
                blanditiis praesentium voluptatum deleniti atque corrupti quos
                dolores et quas molestias excepturi sint occaecati cupiditate
                non provident, similique sunt...
              </p>
              <p className="price">
                <p>
                  {item.GiaBan.toLocaleString('vi-VN', {
                    style: 'currency',
                    currency: 'VND',
                  })}
                </p>
              </p>
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
      ))}
    </>
  );
};

export default ProductCard;

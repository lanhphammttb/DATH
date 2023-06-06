import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { BiArrowBack } from 'react-icons/bi';
import watch from '../assets/images/watch.jpg';
import Container from '../components/Container';
import { CartContext } from '../CartContext';
import AddressForm from '../components/AddressForm';
const Checkout = () => {
  const { cartItems, totalPrice } = useContext(CartContext);
  const [address, setAddress] = useState({});

  const handleAddressChange = (newAddress) => {
    setAddress(newAddress);
  };
  return (
    <>
      <Container class1="checkout-wrapper py-5 home-wrapper-2">
        <div className="row">
          <div className="col-7">
            <div className="checkout-left-data">
              <h3 className="website-name">Vinh Quang</h3>
              <nav
                style={{ '--bs-breadcrumb-divider': '>' }}
                aria-label="breadcrumb"
              >
                <ol className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link className="text-dark total-price" to="/cart">
                      Giỏ hàng
                    </Link>
                  </li>
                  &nbsp; /&nbsp;
                  <li
                    className="breadcrumb-ite total-price active"
                    aria-current="page"
                  >
                    Thông tin
                  </li>
                  &nbsp; /
                  <li className="breadcrumb-item total-price active">
                    Chi phí vận chuyển
                  </li>
                  &nbsp; /
                  <li
                    className="breadcrumb-item total-price active"
                    aria-current="page"
                  >
                    Thanh toán
                  </li>
                </ol>
              </nav>
              <h4 className="title total">Thông tin liên lạc</h4>
              <p className="user-details total">
                Phạm Thị Lanh (lanhphammttb@gmail.com)
              </p>
              <h4 className="mb-3">Địa chỉ nhận hàng</h4>
              <form
                action=""
                className="d-flex gap-15 flex-wrap justify-content-between"
              >
                <div className="flex-grow-1">
                  <input
                    type="text"
                    placeholder="Họ và tên"
                    className="form-control"
                  />
                </div>
                <div className="flex-grow-1">
                  <input
                    type="text"
                    placeholder="Số điện thoại"
                    className="form-control"
                  />
                </div>
                <div className="w-100">
                  <form>
                    <h4 class="title total">
                      Tỉnh/Thành phố, Quận/Huyện, Phường/Xã
                    </h4>
                    <AddressForm onChange={handleAddressChange} />
                  </form>
                </div>
                <div className="d-flex">
                  <div className="mr-2">
                    {address.province ? address.province.label : ''},
                  </div>
                  <div className="mr-2">
                    {address.district ? address.district.label : ''},
                  </div>
                  <div>{address.ward ? address.ward.label : ''}</div>
                </div>
                <div className="w-100">
                  <h4 class="title total">Địa chỉ cụ thể</h4>
                  <input
                    type="text"
                    placeholder="Tên đường, Tòa nhà, Số nhà."
                    className="form-control"
                  />
                </div>
                {/* <div className="flex-grow-1">
                  <input
                    type="text"
                    placeholder="City"
                    className="form-control"
                  />
                </div>
                <div className="flex-grow-1">
                  <select name="" className="form-control form-select" id="">
                    <option value="" selected disabled>
                      Select State
                    </option>
                  </select>
                </div>
                <div className="flex-grow-1">
                  <input
                    type="text"
                    placeholder="Zipcode"
                    className="form-control"
                  />
                </div> */}
                <div className="w-100">
                  <div className="d-flex justify-content-between align-items-center">
                    <Link to="/cart" className="text-dark">
                      <BiArrowBack className="me-2" />
                      Quay lại Giỏ hàng
                    </Link>
                    <Link to="/cart" className="button">
                      Tiếp tục mua sắm
                    </Link>
                  </div>
                </div>
              </form>
            </div>
          </div>
          <div className="col-5">
            {cartItems.map((item) => (
              <div key={item.MaSP} className="border-bottom py-4">
                <div className="d-flex gap-10 mb-2 align-align-items-center">
                  <div className="w-75 d-flex gap-10">
                    <div className="w-25 position-relative">
                      <span
                        style={{ top: '-10px', right: '2px' }}
                        className="badge bg-secondary text-white rounded-circle p-2 position-absolute"
                      >
                        {item.quantity}
                      </span>
                      <img
                        className="img-fluid"
                        src={item.imageUrl}
                        alt="product"
                      />
                    </div>
                    <div>
                      <h5 className="total-price">{item.TenSP}</h5>
                      <p className="total-price">
                        {item.GiaBan.toLocaleString('vi-VN', {
                          style: 'currency',
                          currency: 'VND',
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="flex-grow-1">
                    <h5 className="total">
                      {item.prices.toLocaleString('vi-VN', {
                        style: 'currency',
                        currency: 'VND',
                      })}
                    </h5>
                  </div>
                </div>
              </div>
            ))}
            <div className="border-bottom py-4">
              <div className="d-flex justify-content-between align-items-center">
                <p className="total">Tổng tiền hàng</p>
                <p className="total-price">
                  {totalPrice.toLocaleString('vi-VN', {
                    style: 'currency',
                    currency: 'VND',
                  })}
                </p>
              </div>
              <div className="d-flex justify-content-between align-items-center">
                <p className="mb-0 total">Chi phí vận chuyển</p>
                <p className="mb-0 total-price">$ 10000</p>
              </div>
            </div>
            <div className="d-flex justify-content-between align-items-center border-bootom py-4">
              <h4 className="total">Tổng thanh toán</h4>
              <h5 className="total-price">$ 10000</h5>
            </div>
          </div>
        </div>
      </Container>
    </>
  );
};

export default Checkout;

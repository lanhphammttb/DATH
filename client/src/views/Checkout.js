import React, { useContext, useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { BiArrowBack } from 'react-icons/bi';
import Container from '../components/Container';
import { CartContext } from '../CartContext';
import AddressForm from '../components/AddressForm';
import axios from 'axios';
// import { add } from 'date-fns';
const Checkout = () => {
  const { cartItems, totalPrice } = useContext(CartContext);
  const [address, setAddress] = useState({});
  const [customer, setCustomer] = useState({});
  const [invoice, setInvoice] = useState({});
  const [name, setName] = useState('');
  const [numberPhone, setNumberphone] = useState('');
  const [addressDetail, setDetailAddress] = useState('');
  const [invoiceDetails, setInvoiceDetails] = useState([]);
  const makh = localStorage.getItem('makh');
  const handleAddressChange = useCallback((newAddress) => {
    setAddress(newAddress);
  }, []); // Xóa các giá trị phụ thuộc để chỉ gọi lại khi component được render lần đầu tiên

  const handleNameChange = (event) => {
    if (event.target.value) {
      setName(event.target.value);
    } else {
      setName('');
    }
  };

  const handleNumberPhoneChange = (event) => {
    if (event.target.value) {
      setNumberphone(event.target.value);
    } else {
      setNumberphone('');
    }
  };

  const handleDetailAddressChange = (event) => {
    if (event.target.value) {
      setDetailAddress(
        event.target.value +
          ', ' +
          address.ward.label +
          ', ' +
          address.district.label +
          ', ' +
          address.province.label
      );
    } else {
      setDetailAddress('');
    }
  };

  // const { id } = useState('1');
  useEffect(() => {
    const fetchKhachHang = async () => {
      try {
        const response = await axios.get(`/api/khachhang/${makh}`);
        setCustomer(response.data[0]);
        // console.log(customer);
      } catch (error) {
        console.error(error);
      }
    };

    fetchKhachHang();
    setInvoice({
      makh: makh,
      tennguoinhan: name,
      diachinhanhang: addressDetail,
      sdtnguoinhan: numberPhone,
      khuyenmai: '1',
      tongtien: totalPrice,
      ghichu: 'ko',
      tinhtrang: 'Chưa check',
    });
    setInvoiceDetails(
      cartItems.map((item) => ({
        masp: item.MaSP,
        soluong: item.quantity,
        tongtien: item.prices,
      }))
    );
  }, [cartItems, totalPrice, name, numberPhone, addressDetail]);

  const handleOrder = async () => {
    try {
      // Tạo mới Hóa đơn
      const invoiceResponse = await axios.post('/api/hoadon', invoice);
      const invoiceId = invoiceResponse.data.mahd;
      // Tạo mới danh sách Chi tiết hóa đơn
      const invoiceDetailPromises = invoiceDetails.map((invoiceDetail) => {
        const newInvoiceDetail = { ...invoiceDetail, mahd: invoiceId };
        return axios.post('/api/chitiethoadon', newInvoiceDetail);
      });
      const invoiceDetailResponses = await Promise.all(invoiceDetailPromises);
      console.log('Tạo mới Hóa đơn thành công:', invoiceResponse.data);
      console.log(
        'Tạo mới Chi tiết hóa đơn thành công:',
        invoiceDetailResponses.map((response) => response.data)
      );
    } catch (error) {
      console.error('Lỗi khi tạo mới Hóa đơn và Chi tiết hóa đơn:', error);
    }
  };

  return (
    <>
      <Container className="checkout-wrapper py-5 home-wrapper-2">
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
                {customer.TenKH} <nbsp /> ({customer.TAIKHOAN})
              </p>
              <h4 className="mb-3">Địa chỉ nhận hàng</h4>
              <form
                action=""
                className="d-flex gap-15 flex-wrap justify-content-between"
              >
                <div className="flex-grow-1">
                  <input
                    type="text"
                    defaultValue={name}
                    placeholder="Họ và tên"
                    className="form-control"
                    onChange={handleNameChange}
                  />
                </div>
                <div className="flex-grow-1">
                  <input
                    type="text"
                    defaultValue={numberPhone}
                    onChange={handleNumberPhoneChange}
                    placeholder="Số điện thoại"
                    className="form-control"
                  />
                </div>
                <div className="w-100">
                  <form>
                    <h4 className="title total">
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
                  <h4 className="title total">Địa chỉ cụ thể</h4>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Tên đường, Tòa nhà, Số nhà."
                    defaultValue={addressDetail}
                    onChange={handleDetailAddressChange}
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
                    <Link to="/order" className="button" onClick={handleOrder}>
                      Đặt hàng
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

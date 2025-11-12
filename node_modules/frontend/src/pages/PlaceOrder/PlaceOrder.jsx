import React, { useContext, useEffect, useState } from 'react'
import './PlaceOrder.css'
import { storeContext } from '../../context/StoreContext'
import { useNavigate } from 'react-router-dom'; 
import axios from 'axios';

const PlaceOrder = () => {

  const {getTotalCartAmount,token,food_list,cartItems,url, discount} = useContext(storeContext)

  const [data, setData] = useState({
    firstName:"",
    lastName:"",
    email:"",
    street:"",
    city:"",
    state:"",
    zipcode:"",
    country:"",
    phone: ""
  })
  const [errors, setErrors] = useState({});
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showAddressList, setShowAddressList] = useState(false);

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData(data=>({...data,[name]:value}))

    // Xóa lỗi khi người dùng bắt đầu nhập lại
    if (errors[name]) {
      setErrors(prevErrors => ({ ...prevErrors, [name]: '' }));
    }
  }

  const validateForm = () => {
    const newErrors = {};
    if (!data.firstName) newErrors.firstName = "First name is required.";
    if (!data.lastName) newErrors.lastName = "Last name is required.";
    if (!data.email) {
      newErrors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(data.email)) {
      newErrors.email = "Email address is invalid.";
    }
    if (!data.street) newErrors.street = "Street is required.";
    if (!data.city) newErrors.city = "City is required.";
    if (!data.state) newErrors.state = "State is required.";
    if (!data.zipcode) newErrors.zipcode = "Zip code is required.";
    if (!data.country) newErrors.country = "Country is required.";
    if (!data.phone) {
      newErrors.phone = "Phone number is required.";
    } else if (!/^\d{10,}$/.test(data.phone.replace(/\s/g, ''))) {
      newErrors.phone = "Phone number must be at least 10 digits.";
    }
    return newErrors;
  }

  // Select saved address
  const selectSavedAddress = (address) => {
    setData({
      firstName: address.firstName,
      lastName: address.lastName,
      email: address.email,
      street: address.street,
      city: address.city,
      state: address.state,
      zipcode: address.zipcode,
      country: address.country,
      phone: address.phone
    });
    setSelectedAddress(address._id);
    setShowAddressList(false);
  };

  const placeOrder = async (event) => {
    event.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const totalCartAmount = getTotalCartAmount();
    let orderItems = [];
    if (totalCartAmount === 0) {
        alert("Your cart is empty. Please add items to proceed to checkout.");
        return;
    }
    food_list.map((item)=>{
      if (cartItems[item._id]>0){
        let itemInfo = item;
        itemInfo["quantity"] = cartItems[item._id];
        orderItems.push(itemInfo);
      }
    })
    let orderData = {
      address:data,
      items:orderItems,
      amount:totalCartAmount + 2 - discount,
    }
    let response = await axios.post(url+"/api/order/place",orderData,{headers:{token}});
    if (response.data.success){
      const {session_url} = response.data;
      // Save address to user's address book if not already saved
      if (!selectedAddress) {
        await axios.post(`${url}/api/address/add`, {
          address: { ...data, isDefault: addresses.length === 0 }
        }, { headers: { token } });
      }
      window.location.replace(session_url);
    }
    else{
      alert("Error");
    }
  }

  const navigate = useNavigate();

  const totalAmount = getTotalCartAmount();

  // Fetch saved addresses
  const fetchAddresses = async () => {
    try {
      const response = await axios.post(`${url}/api/address/list`, {}, {
        headers: { token }
      });
      if (response.data.success) {
        setAddresses(response.data.addresses);
        // Auto-fill default address if exists
        const defaultAddress = response.data.addresses.find(addr => addr.isDefault);
        if (defaultAddress && !data.firstName) {
          setData({
            firstName: defaultAddress.firstName,
            lastName: defaultAddress.lastName,
            email: defaultAddress.email,
            street: defaultAddress.street,
            city: defaultAddress.city,
            state: defaultAddress.state,
            zipcode: defaultAddress.zipcode,
            country: defaultAddress.country,
            phone: defaultAddress.phone
          });
          setSelectedAddress(defaultAddress._id);
        }
      }
    } catch (error) {
      console.error('Error fetching addresses:', error);
    }
  };

  useEffect(() => {
    if (totalAmount === 0) {
      navigate('/cart')
    } else if (token) {
      fetchAddresses();
    }
  }, [totalAmount, navigate, token]);

  return (
    <form onSubmit={placeOrder} className='place-order'>
      <div className="place-order-left">
        <div className="delivery-header">
          <p className="title">Delivery Information</p>
          {addresses.length > 0 && (
            <button
              type="button"
              className="btn-select-address"
              onClick={() => setShowAddressList(!showAddressList)}
            >
              📍 {showAddressList ? 'Hide' : 'Select'} Address
            </button>
          )}
        </div>

        {showAddressList && addresses.length > 0 && (
          <div className="saved-addresses-list">
            {addresses.map((address) => (
              <div
                key={address._id}
                className={`saved-address-item ${selectedAddress === address._id ? 'selected' : ''}`}
                onClick={() => selectSavedAddress(address)}
              >
                <div className="address-content">
                  <strong>{address.firstName} {address.lastName}</strong>
                  {address.isDefault && <span className="badge-default">Default</span>}
                  <p>{address.street}, {address.city}, {address.state} {address.zipcode}</p>
                  <p>{address.phone}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="multi-fields">
          <div className='form-field'><input name='firstName' onChange={onChangeHandler} value={data.firstName} type="text" placeholder='First name' /><p className='error-text'>{errors.firstName}</p></div>
          <div className='form-field'><input name='lastName' onChange={onChangeHandler} value={data.lastName} type="text" placeholder='Last name' /><p className='error-text'>{errors.lastName}</p></div>
        </div>
        <div className='form-field'>
          <input name='email' onChange={onChangeHandler} value={data.email} type="email" placeholder='Email address' />
          <p className='error-text'>{errors.email}</p>
        </div>
        <div className='form-field'>
          <input name='street' onChange={onChangeHandler} value={data.street} type="text" placeholder='Street' />
          <p className='error-text'>{errors.street}</p>
        </div>
        <div className="multi-fields">
          <div className='form-field'><input name='city' onChange={onChangeHandler} value={data.city} type="text" placeholder='City' /><p className='error-text'>{errors.city}</p></div>
          <div className='form-field'><input name='state' onChange={onChangeHandler} value={data.state} type="text" placeholder='State' /><p className='error-text'>{errors.state}</p></div>
        </div>
        <div className="multi-fields">
          <div className='form-field'><input name='zipcode' onChange={onChangeHandler} value={data.zipcode} type="text" placeholder='Zip Code' /><p className='error-text'>{errors.zipcode}</p></div>
          <div className='form-field'><input name='country' onChange={onChangeHandler} value={data.country}  type="text" placeholder='Country' /><p className='error-text'>{errors.country}</p></div>
        </div>
        <div className='form-field'>
          <input name='phone' onChange={onChangeHandler} value={data.phone} type="text" placeholder='Phone' />
          <p className='error-text'>{errors.phone}</p>
        </div>
      </div>
      <div className="place-order-right">
        <div className="cart-total">
            <h2>Cart Totals</h2>
            <div>
              <div className="cart-total-details">
                <p>Subtotal</p>
                <p>${totalAmount.toFixed(2)}</p>
              </div>
              <hr />
              <div className="cart-total-details">
                <p>Delivery Fee</p>
                <p>${totalAmount===0?(0).toFixed(2):(2).toFixed(2)}</p>
              </div>
              <hr />
              {discount > 0 && (
                <>
                  <div className="cart-total-details">
                    <p>Discount</p>
                    <p>-${discount.toFixed(2)}</p>
                  </div>
                  <hr />
                </>
              )}
              <div className="cart-total-details">
                <b>Total</b>
                <b>${totalAmount===0?(0).toFixed(2):(totalAmount + 2 - discount).toFixed(2)}</b>
              </div>
            </div>
            <button type='submit'>PROCEED TO PAYMENT </button>
          </div>
      </div>
    </form>
  )
}

export default PlaceOrder

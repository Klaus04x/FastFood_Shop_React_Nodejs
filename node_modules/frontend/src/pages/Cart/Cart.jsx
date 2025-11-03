import React, { useContext, useState } from 'react'
import './Cart.css'
import { storeContext } from '../../context/StoreContext'
import { useNavigate } from 'react-router-dom';

const Cart = () => {

  const { cartItems, food_list, removeFromCart, getTotalCartAmount, url, discount, applyPromoCode } = useContext(storeContext);
  const [promoInput, setPromoInput] = useState('');
  const [promoMessage, setPromoMessage] = useState({ text: '', success: null });

  const navigate = useNavigate();

  const handleApplyPromo = async () => {
    if (!promoInput) {
      setPromoMessage({ text: "Please enter a promo code.", success: false });
      return;
    }
    const response = await applyPromoCode(promoInput);
    setPromoMessage({ text: response.message, success: response.success });
  };

  const totalAmount = getTotalCartAmount();
  const finalTotal = totalAmount > 0 ? totalAmount + 2 - discount : 0;

  return (
    <div>
      <div className='cart'>
        <div className="cart-items">
          <div className="cart-items-title">
            <p>Items</p>
            <p>Title</p>
            <p>Price</p>
            <p>Quantity</p>
            <p>Total</p>
            <p>Remove</p>
          </div>
          <br />
          <hr />
          {food_list.map((item, index) => {
            if (cartItems[item._id] > 0) {
              return (
                <div>
                  <div className='cart-items-title cart-items-item'>
                    <img src={url+"/images/"+item.image} alt="" />
                    <p>{item.name}</p>
                    <p>${item.price.toFixed(2)}</p>
                    <p>{cartItems[item._id]}</p>
                    <p>${(item.price * cartItems[item._id]).toFixed(2)}</p>
                    <p onClick={()=>removeFromCart(item._id)} className='cross'>x</p>
                  </div>
                  <hr />
                </div>
              )
            }
          })}
        </div>
        <div className="cart-bottom">
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
                <p>${totalAmount === 0 ? (0).toFixed(2) : (2).toFixed(2)}</p>
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
                <b>${(finalTotal < 0 ? 0 : finalTotal).toFixed(2)}</b>
              </div>
            </div>
            <button onClick={()=>navigate('/order')} disabled={totalAmount===0}>PROCEED TO CHECKOUT</button>
          </div>
          <div className="cart-promocode">
            <div>
              <p>If you have a promo code, Enter it here</p>
              <div className='cart-promocode-input'>
                <input type="text" value={promoInput} onChange={(e) => setPromoInput(e.target.value)} placeholder='Promo Code' />
                <button onClick={handleApplyPromo}>Submit</button>
              </div>
              {promoMessage.text && (
                <p className={`promo-message ${promoMessage.success ? 'success' : 'error'}`}>{promoMessage.text}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart

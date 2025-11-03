import React, { useContext, useState, useEffect } from 'react'
import './MyOrders.css'
import { assets } from '../../assets/assets';
import { storeContext } from '../../context/StoreContext';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';

const MyOrders = () => {

    const {url, token} = useContext(storeContext);
    const [data, setData] = useState([]);
    const [searchParams] = useSearchParams();

    const fetchOrders = async () => {
        const response = await axios.post(url+"/api/order/userorders",{},{headers:{token}});
        setData(response.data.data);
    }

    const handleCancelledOrder = async () => {
        const success = searchParams.get("success");
        const orderId = searchParams.get("orderId");

        // Nếu thanh toán bị hủy (success=false)
        if (success === "false" && orderId) {
            await axios.post(url+"/api/order/verify", {success, orderId});
        }
    }

    useEffect(()=>{
        if (token) {
            handleCancelledOrder().then(() => {
                fetchOrders();
            });
        }
    },[token])

  return (
    <div className='my-orders'>
        <h2>My Orders</h2>
        <div className="container">
            {data.map((order,index)=>{
                return(
                    <div key={index} className='my-orders-order' >
                        <img src={assets.parcel_icon} alt="" />
                        <p>{order.items.map((item,index)=>{
                            if (index === order.items. length-1){
                                return item.name+" x "+item.quantity
                            }
                            else{
                                return item.name+" x "+item.quantity+", "
                            }
                        })}</p>
                        <p>${order.amount.toFixed(2)}</p>
                        <p>Items: {order.items.length}</p>
                        <p><span>&#x25cf;</span> <b>{order.status}</b></p>
                        <button onClick={fetchOrders}>Track Order</button>
                    </div>
                )
            })}
        </div>  
    </div>
  )
}

export default MyOrders

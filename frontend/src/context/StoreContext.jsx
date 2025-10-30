import { createContext, useEffect, useState } from "react";
import { food_list } from "../assets/assets";
import axios from 'axios';
import { API_BASE_URL } from "../config";

export const storeContext = createContext(null)

const StoreContextProvider = (props) => {

    const [cartItems, setCartItems] = useState({});
    const url = API_BASE_URL;
    const [token,setToken] = useState("");
    const [food_list,setFoodList] = useState([])
    const [authLoading, setAuthLoading] = useState(true); // Thêm state loading
    const [discount, setDiscount] = useState(0); // State cho số tiền giảm giá


    const addToCart = async (itemId) => {
        if (!cartItems[itemId]) {
            setCartItems((prev)=>({...prev,[itemId]:1}))
        }
        else{
            setCartItems((prev)=>({...prev,[itemId]:prev[itemId]+1}))
        }

        if(token) {
            await axios.post(url+"/api/cart/add",{itemId},{headers:{token}})
        }

    }

    const removeFromCart = async (itemId) => {
        setCartItems((prev)=>({...prev,[itemId]:prev[itemId]-1}));
        if(token) {
            await axios.post(url+"/api/cart/remove",{itemId},{headers:{token}})
        }
    }

    const getTotalCartAmount = () => {
        let totalAmount = 0;
        for (const item in cartItems){
            if (cartItems[item] > 0) {
                let itemInfo = food_list.find((product) => product._id === item);
                totalAmount += itemInfo.price * cartItems[item];
            }
        }
        return totalAmount;
    }

    const fetchFoodList = async () => {
        const response = await axios.get(url+"/api/food/list");
        setFoodList(response.data.data)
    }

    const applyPromoCode = async (code) => {
        try {
            const response = await axios.post(url + "/api/promocode/validate", { code });
            if (response.data.success) {
                setDiscount(response.data.discount); // Giả sử giảm $5
            }
            return response.data; // Trả về toàn bộ response để component xử lý message
        } catch (error) {
            return { success: false, message: "Error applying promo code." };
        }
    }

    const loadCartData = async (token) => {
        const response = await axios.post(url+"/api/cart/get",{},{headers:{token}});
        setCartItems(response.data.cartData);
    }

    useEffect(()=>{
        async function loadData() {
            await fetchFoodList();
            if (localStorage.getItem("token")){
                setToken(localStorage.getItem("token"));
                await loadCartData(localStorage.getItem("token"));
            }
            setAuthLoading(false); // Đánh dấu quá trình tải token đã hoàn tất
        }
        loadData();
    },[])

    const contextValue = {
        food_list,
        cartItems,
        setCartItems,
        addToCart,
        removeFromCart,
        getTotalCartAmount,
        url,
        token,
        setToken,
        authLoading, // Cung cấp state loading cho context
        applyPromoCode, // Cung cấp hàm áp dụng mã
        discount // Cung cấp state giảm giá
    }
    
    return (
        <storeContext.Provider value={contextValue}>
            {props.children}
        </storeContext.Provider>
    )
}

export default StoreContextProvider;
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
    const [authLoading, setAuthLoading] = useState(true);
    const [discount, setDiscount] = useState(0);
    const [categories, setCategories] = useState([]);


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

    const fetchCategories = async () => {
        try {
            const response = await axios.get(url+"/api/category/list");
            if (response.data.success) {
                setCategories(response.data.data);
            }
        } catch (error) {
            console.log("Error fetching categories:", error);
        }
    }

    const applyPromoCode = async (code) => {
        try {
            const response = await axios.post(url + "/api/promocode/validate", { code });
            if (response.data.success) {
                setDiscount(response.data.discount);
            }
            return response.data;
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
            await fetchCategories();
            if (localStorage.getItem("token")){
                setToken(localStorage.getItem("token"));
                await loadCartData(localStorage.getItem("token"));
            }
            setAuthLoading(false);
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
        authLoading,
        applyPromoCode,
        discount,
        categories
    }
    
    return (
        <storeContext.Provider value={contextValue}>
            {props.children}
        </storeContext.Provider>
    )
}

export default StoreContextProvider;
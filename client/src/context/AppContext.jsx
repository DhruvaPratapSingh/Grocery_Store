import { createContext, useEffect, useState } from "react";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import axios from "axios";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

export const AppContext = createContext();
export const AppContextProvider = ({ children }) => {

const currency=import.meta.env.VITE_CURRENCY;

    const navigate=useNavigate();
    const [user, setUser] = useState(null);
    const [isSeller,setIsSeller]=useState(false);
    const [showUserLogin,setShowUserLogin]=useState(false);
    const [products,setProducts]=useState([]);


    const [cartItems,setCartItems]=useState({});
    const [searchQuery,setSearchQuery]=useState({});


    // fetch seller status

    const fetchSeller=async()=>{
        try {
            const {data}=await axios.get("/api/seller/is-auth");
            if(data.success){
                setIsSeller(true);
            }else{
                setIsSeller(false);
            }
        }catch (error) {
            console.log(error);
            setIsSeller(false);
        }
    }
    const fetchProducts=async()=>{
      try {
        const {data}=await axios.get("/api/product/list"); 
        if(data.success){
          setProducts(data.products);
        }
        else{
          toast.error(data.message);
        }
      } catch (error) {
        toast.error(error.message);
        console.log(error);
      }
    }
    const addToCart=(itemId)=>{
        let cartData=structuredClone(cartItems);
        if(cartData[itemId]){
            cartData[itemId]+=1;
        }else{
            cartData[itemId]=1;
        }
        setCartItems(cartData);
        toast.success("Item added to cart successfully!");
}

   const updateCartItem =(itemId,quantity)=>{
    let cartData=structuredClone(cartItems);
    cartData[itemId]=quantity;
    setCartItems(cartData);
    toast.success("Item updated successfully!");
   }


    const removeFromCart=(itemId)=>{
        let cartData=structuredClone(cartItems);
        if(cartData[itemId]){
            cartData[itemId]-=1;
            if(cartData[itemId]===0){
                delete cartData[itemId];
            }
        }
        setCartItems(cartData);
        toast.success("Item removed from cart successfully!");
    }
    // get item count in cart
    const getCartCount=()=>{
        let TotalCount=0;
        for(let item in cartItems){
            TotalCount+=cartItems[item];
        }
        return TotalCount;
    }

    // get total price of cart items
    const getCartAmount=()=>{
        let totalAmount=0;
        for(let items in cartItems){
            let itemInfo=products.find((product)=>product._id===items);
            if(cartItems[items] > 0){
                totalAmount+=itemInfo.offerPrice*cartItems[items];
            }
        }
        return Math.floor(totalAmount*100)/100;
    }
  useEffect(()=>{
    fetchProducts();
    fetchSeller();
  },[])
    const value={navigate,user,setUser,isSeller,setIsSeller,showUserLogin,setShowUserLogin,products,currency,addToCart,updateCartItem,removeFromCart,cartItems,searchQuery,setSearchQuery,getCartCount,getCartAmount,axios,fetchProducts};
  return <AppContext.Provider value={value}>
  {children}
  </AppContext.Provider>
}
export const useAppContext = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error("useAppContext must be used within an AppContextProvider");
    }
    return context;
}
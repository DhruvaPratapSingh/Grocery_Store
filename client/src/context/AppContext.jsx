import { createContext, useState } from "react";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
export const AppContext = createContext();
export const AppContextProvider = ({ children }) => {
    const navigate=useNavigate();
    const [user, setUser] = useState(null);
    const [isSeller,setIsSeller]=useState(false);
    const [showUserLogin,setShowUserLogin]=useState(false);

    const value={navigate,user,setUser,isSeller,setIsSeller,showUserLogin,setShowUserLogin};
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
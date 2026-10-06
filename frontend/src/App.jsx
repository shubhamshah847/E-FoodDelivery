import "./App.css";
import "../src/pages/otp.css";

import {
    Navigate,
    Route,
    Routes
} from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";

import Splash from "./pages/splash";
import Register from "./pages/register";
import Login from "./pages/login";
import Home from "./pages/home";
import VerifyOtp from "./pages/otp";
import OwnerDashBoard from "./components/ownerDashBoard";

import { getUserData } from "./hooks/getUser";
import getUserLocation from "./hooks/getUserLocation";
import { getShop } from "./hooks/getShop";
import Cart from "./pages/cart";
import CheckOut from "./pages/checkOut";
import GetMyOrders from "./components/getUserOrders";
import GetOwnerOrder from "./components/getOnwnerOrders";

export const serverURI = "http://localhost:3000";

function App() {

    const dispatch = useDispatch();

    useEffect(() => {
        getUserData(dispatch);
        getShop(dispatch)
    }, [dispatch]);

    getUserLocation();
    

    const { userData } = useSelector((state) => state.user);

    return (
        <Routes>

            {/* Splash */}
            <Route
                path="/"
                element={
                    !userData
                        ? <Splash />
                        : <Navigate to="/home" replace />
                }
            />

            {/* Register */}
            <Route
                path="/register/user"
                element={
                    !userData
                        ? <Register />
                        : <Navigate to="/home" replace />
                }
            />

            {/* Login */}
            <Route
                path="/login/user"
                element={
                    !userData
                        ? <Login />
                        : <Navigate to="/home" />
                }
            />

            {/* Home */}
            <Route
                path="/home"
                element={
                    userData
                        ? <Home />
                        : <Navigate to="/register/user"  />
                }
            />

            {/* Verify OTP */}
            <Route
                path="/register/verify-otp"
                element={<VerifyOtp />}
            />

           
            <Route
              path='/cart'
              element={userData? <Cart/> : <Navigate to='/login/user'/>}
            />
            <Route path='/get-my-orders'
            element={userData? <GetMyOrders/> : <Navigate to='/login/user'/>}
            />
              <Route path='/get-owner-orders'
            element={userData? <GetOwnerOrder/> : <Navigate to='/login/user'/>}
            />
            <Route path="/item/checkout" element={userData? <CheckOut/> : <Navigate to='/login/user'/>}/>

        </Routes>
    );
}

export default App;
import "./App.css";
import "../src/pages/otp.css";

import {
    Navigate,
    Route,
    Routes
} from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";

import Splash from "./pages/splash";
import Register from "./pages/register";
import Login from "./pages/login";
import Home from "./pages/home";
import VerifyOtp from "./pages/otp";
import OwnerDashBoard from "./components/ownerDashBoard";

import { getUserData } from "./hooks/getUser";
import useUserLocation from "./hooks/getUserLocation";
import { getShop } from "./hooks/getShop";
import Cart from "./pages/cart";
import CheckOut from "./pages/checkOut";
import GetMyOrders from "./components/getUserOrders";
import GetOwnerOrder from "./components/getOnwnerOrders";

export const serverURI = "https://yumzo-hf2l.onrender.com";

function App() {

    const dispatch = useDispatch();
    const [isCheckingSession, setIsCheckingSession] = useState(true);

    useEffect(() => {
        let isMounted = true;

        const initializeApp = async () => {
            try {
                await getUserData(dispatch);
                await getShop(dispatch);
            } finally {
                if (isMounted) {
                    setIsCheckingSession(false);
                }
            }
        };

        initializeApp();

        return () => {
            isMounted = false;
        };
    }, [dispatch]);

    const { userData } = useSelector((state) => state.user);
    const currentUser = userData?.user ?? userData ?? null;
    const isVerifiedUser = Boolean(currentUser?.isVerified);
    const hasVerifiedUser = Boolean(currentUser && isVerifiedUser);
    const verificationUserId = currentUser?._id || localStorage.getItem("pendingOtpUserId");
    useUserLocation();

    return (
        <Routes>

            {/* Splash */}
            <Route
                path="/"
                element={
                    isCheckingSession
                        ? <Splash />
                        : hasVerifiedUser
                            ? <Navigate to="/home" replace />
                            : verificationUserId
                                ? <Navigate to="/register/verify-otp" state={{ userId: verificationUserId }} replace />
                                : userData
                                    ? <Navigate to="/login/user" replace />
                                    : <Splash />
                }
            />

            {/* Register */}
            <Route
                path="/register/user"
                element={
                    hasVerifiedUser
                        ? <Navigate to="/home" replace />
                        : verificationUserId
                            ? <Navigate to="/register/verify-otp" state={{ userId: verificationUserId }} replace />
                            : <Register />
                }
            />

            {/* Login */}
            <Route
                path="/login/user"
                element={
                    hasVerifiedUser
                        ? <Navigate to="/home" replace />
                        : verificationUserId
                            ? <Navigate to="/register/verify-otp" state={{ userId: verificationUserId }} replace />
                            : <Login />
                }
            />

            {/* Home */}
            <Route
                path="/home"
                element={
                    hasVerifiedUser
                        ? <Home />
                        : verificationUserId
                            ? <Navigate to="/register/verify-otp" state={{ userId: verificationUserId }} replace />
                            : <Navigate to="/login/user" replace />
                }
            />

            {/* Verify OTP */}
            <Route
                path="/register/verify-otp"
                element={<VerifyOtp />}
            />

           
            <Route
              path='/cart'
              element={hasVerifiedUser? <Cart/> : <Navigate to='/login/user' replace/>}
            />
            <Route path='/get-my-orders'
            element={hasVerifiedUser? <GetMyOrders/> : <Navigate to='/login/user' replace/>}
            />
              <Route path='/get-owner-orders'
            element={hasVerifiedUser? <GetOwnerOrder/> : <Navigate to='/login/user' replace/>}
            />
            
            <Route path="/item/checkout" element={hasVerifiedUser? <CheckOut/> : <Navigate to='/login/user' replace/>}/>

        </Routes>
    );
}

export default App;

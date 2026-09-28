
import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { serverURI } from "../App";
import { setuserData } from "../redux/userSlice";

const Login = () => {
  const [Loginloading, setLoginloading] = useState(false)
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [Message, setMessage] = useState("")
   const navigate = useNavigate()
   const dispatch = useDispatch()
  const handleLogin = async(e) => {
    setMessage("")
    e.preventDefault();
    setLoginloading(true)
    try {
       const response = await axios.post(serverURI+"/auth/user/login",{
    email,password
   },{
    withCredentials:true
   }) 
   dispatch(setuserData(response.data))
  console.log("resonse - login:-",response)
  
     
      setMessage(response.data.message|| "login successfully")
    setTimeout(()=>{
        navigate('/home')
      },1100)
    } catch (err) {
      console.log("login api err :",err)
       setMessage(
      err.response?.data?.message || "Login failed. Please try again."
    );
    }
    finally{
      setLoginloading(false)
      //setMessage("")
    }
  
    // Add your API logic here
  };

  return (
    <div className="login-page">
      <div className="login-card">

        {/* Left Section */}
        <div className="login-left">
          <div className="brand">
            <div className="brand-icon">🍴</div>
            <span>Yumzo</span>
          </div>

          <div className="welcome-content">
            <h1>Welcome Back!</h1>

            <p>
              Login to continue ordering your favorite food
              and discovering delicious meals.
            </p>

            <div className="food-decoration">
              <span>🍕</span>
              <span>🍔</span>
              <span>🍜</span>
              <span>🍰</span>
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="login-right">
          <div className="login-header">
            <h2>Login</h2>
            <p>Enter your details to continue</p>
          </div>

          <form onSubmit={handleLogin}>

            {/* Email */}
            <div className="input-group">
              <label>Email Address</label>

              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Password */}
            <div className="input-group">
              <label>Password</label>

              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {Message && (
            <div className="login-message">
              {Message}
            </div>
            )
           }

            <div className="forgot-password">
              <button type="button">
                Forgot Password?
              </button>
            </div>

            <button className="login-btn" type="submit">
              {Loginloading ? "Waiting for response..." : "Login"}
            </button>

          </form>

          <div className="signup-text">
            Don't have an account?
            <button type="button" onClick={()=>{
              navigate('/register/user')
            }}>
              Sign Up 
            </button>
          </div>

          <p className="footer-text">
            © 2026 Yumzo · Developed by Shubham Shah
          </p>
        </div>

      </div>
    </div>
  );
};

export default Login;


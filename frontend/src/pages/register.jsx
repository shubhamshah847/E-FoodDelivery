import React, { useState } from "react";
import axios from "axios";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import { auth, provider } from "../utils/firebase";
import { serverURI } from "../App";
import { signInWithPopup } from "firebase/auth";
import { setuserData } from "../redux/userSlice";

const Register = () => {
  
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loadingRegister, setLoadingRegister] = useState(false);
  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const [loadingLogin,setloadingLogin] = useState(false)
const [message, setMessage] = useState("");
const [error, setError] = useState("");




  const handleGoogleRegister = async(e)=>{
    e.preventDefault()
    try {
      setLoadingGoogle(true)
      const response = await signInWithPopup(auth,provider)

      let user = response.user
      let name = user.displayName
      let email = user.email
      let googleId = user.uid
       
      const result = await axios.post(
        serverURI + '/auth/user/google/register',
        {
          name,
          email,
          googleId
        },
        {
          withCredentials: true
        }
      )
     dispatch(setuserData(result.data))
     navigate('/home')
    
      

    } catch (err) {
      console.log("err register :-", err);
      
    }
    finally{
      setLoadingGoogle(false)
    }
   
  }
  const handleRegister = async (e) => {
    e.preventDefault()
    try{
      setLoadingRegister(true)
      const response = await axios.post(serverURI+"/auth/user/register",{
        name,email,password
      },{
        withCredentials:true
      })
      setError("")
      setMessage("regestration completed")
     // console.log("response",response)
     
     navigate('/register/verify-otp',{
      state:{
        userId:response.data.user._id
      }
     })
  
     dispatch(setuserData(response.data))

    }

    catch(err){
      console.log("handleRegister err:-",err)
      setError(err?.response?.data?.message || "something went wrong ")
    }
    finally{
     setLoadingRegister(false)
    }
  }

  
  return (
    <div className="register-page">

      {/* Left Section */}
      <div className="register-left">

        <div className="register-logo">
          <div className="register-logo-icon">
            🍔
          </div>

          <span>Foodie</span>
        </div>


        <div className="register-left-content">

          <span className="register-label">
            ✦ Welcome to Foodie
          </span>

          <h1>
            Good food.
            <br />
            <span>Good mood.</span>
          </h1>

          <p>
            Create your account and discover delicious food
            from your favorite restaurants, delivered straight
            to your doorstep.
          </p>


          <div className="register-foods">

            <div className="register-food">🍕</div>
            <div className="register-food">🍔</div>
            <div className="register-food">🍟</div>
            <div className="register-food">🌮</div>
            <div className="register-food">🥤</div>

          </div>

        </div>


        <div className="register-left-footer">
          Fresh food. Fast delivery. Happy you. ❤️
        </div>

      </div>


      {/* Right Section */}
      <div className="register-right">

        <div className="register-form-container">

          {/* Mobile Logo */}
          <div className="register-mobile-logo">
            🍔 <span>Foodie</span>
          </div>


          {/* Heading */}
          <div className="register-header">

            <span className="register-eyebrow">
              CREATE ACCOUNT
            </span>

            <h2>
              Welcome to Foodie
            </h2>

            <p>
              Create an account to start ordering
              delicious food.
            </p>

          </div>


          {/* Register Form */}
          <form
                 className="register-form"
                 onSubmit={handleRegister}
             >

            {/* Name */}
            <div className="register-field">

              <label htmlFor="name">
                Full name
              </label>

              <input
                id="name"
                type="text"
                name="name"
                required
                placeholder="Enter your full name"
                className="register-input"
                 value={name}
                 onChange={(e) => setName(e.target.value)}
              />

            </div>


            {/* Email */}
            <div className="register-field">

              <label htmlFor="email">
                Email address
              </label>

              <input
                id="email"
                type="email"
                name="email"
                placeholder="Enter your email"
                className="register-input"
                required
                 value={email}
                 onChange={(e) => setEmail(e.target.value)}
              />

            </div>


            {/* Password */}
            <div className="register-field">

              <label htmlFor="password">
                Password
              </label>

              <input
                id="password"
                type="password"
                name="password"
                required
                placeholder="Create a password"
                className="register-input"
                 value={password}
                 onChange={(e) => setPassword(e.target.value)}
              />

            </div>
           {message && (
  <div className="mt-4 rounded-lg bg-green-100 px-4 py-3 text-sm font-medium text-green-700">
    {message}
  </div>
)}

{error && (
  <div className="mt-4 rounded-lg bg-red-100 px-4 py-3 text-sm font-medium text-red-700">
    {error}
  </div>
)}

            {/* Create Account */}
          <button
    type="submit"
    className="register-submit"
    disabled={loadingRegister}
>
  
    <span>
        {loadingRegister ? "Creating account..." : "Create Account"}
    </span>

       <span className="register-submit-arrow">
            →
             </span>
        </button>

          </form>


          {/* Divider */}
          <div className="register-divider">
            <span>OR</span>
          </div>


          {/* Google */}
          <button
    onClick={handleGoogleRegister}
    type="button"
    className="register-google"
    disabled={loadingGoogle}
      >
    <span className="google-logo">
        <FcGoogle size={20} />
    </span>

    <span>
        {loadingGoogle
            ? "Creating account..."
            : "Continue with Google"
        }
    </span>
</button>


          {/* Login */}
          <p className="register-login-text">
            Already have an account?
            <button
    onClick={() => navigate("/login/user")}
    disabled={loadingLogin}
    className="login-btn"
> {loadingLogin ? "loading...." :"login"}
</button>
          </p>

        </div>

      </div>

    </div>
  );
}

export default Register;
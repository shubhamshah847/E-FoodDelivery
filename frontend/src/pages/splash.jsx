import React from "react";
import {useNavigate} from 'react-router-dom'
const Splash = () => {
  const navigate = useNavigate()
  return (
    <div className="yumzo-splash">

      {/* Background */}
      <div className="yumzo-orb orb-1"></div>
      <div className="yumzo-orb orb-2"></div>

      {/* Floating food */}
      <div className="food food-1">🍕</div>
      <div className="food food-2">🍔</div>
      <div className="food food-3">🍟</div>
      <div className="food food-4">🥤</div>

      {/* Main Content */}
      <div className="yumzo-content">

        {/* Logo */}
        <div className="yumzo-logo">
          <span>Y</span>
        </div>

        {/* App Name */}
        <h1>Yumzo</h1>

        {/* Tagline */}
        <p className="yumzo-tagline">
          Your cravings, delivered.
        </p>

        {/* Description */}
        <p className="yumzo-description">
          Discover delicious food from your favorite restaurants
          <br />
          and get it delivered right to your doorstep.
        </p>

        {/* Buttons */}
        <div className="yumzo-actions">
          <button className="signup-btn" onClick={()=>{
            navigate('/register/user')
          }}>
            Sign Up
          </button>

          <button className="login-btn" onClick={()=>{
            navigate('/login/user') }} >
            Login
          </button>
        </div>

      </div>
      

      {/* Footer */}
      <footer className="yumzo-footer">

        <div className="footer-line"></div>

        <p>
          Made with <span>♥</span> for food lovers
        </p>

        <h4>
          Developed by <strong>Shubham Shah</strong>
        </h4>

        <small>
          © 2026 Yumzo
        </small>

      </footer>

    </div>
  );
};

export default Splash;







import React from "react";
import {useNavigate} from 'react-router-dom'
const Splash = () => {
  const navigate = useNavigate()
  return (
    <div className="yumzo-splash">

      {/* Background */}
      <div className="yumzo-orb orb-1"></div>
      <div className="yumzo-orb orb-2"></div>

      <header className="splash-header">
        <a className="splash-brand" href="/" aria-label="Yumzo home">
          <span className="splash-brand-mark">Y</span>
          <span>yumzo</span>
        </a>
        <span className="demo-pill"><span /> Demo experience</span>
      </header>

      {/* Floating food */}
      <div className="food food-1">🍕</div>
      <div className="food food-2">🍔</div>
      <div className="food food-3">🍟</div>
      <div className="food food-4">🥤</div>

      {/* Main Content */}
      <div className="yumzo-content">

        <div className="hero-kicker">
          <span>GOOD FOOD, GOOD MOOD</span>
        </div>

        <h1 className="hero-title">
          Your next favorite meal<br />
          <span>is just a click away.</span>
        </h1>

        <p className="yumzo-tagline">
          Meet Yumzo — a little demo built for big cravings.
        </p>

        <p className="yumzo-description">
          Explore the experience, discover tasty picks, and follow an order from cart to doorstep.
        </p>

        <p className="hero-demo-note">
          <span aria-hidden="true">✦</span> Demo website — orders and payments are not real.
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
        <span className="footer-credit">Made with <span aria-label="love">♥</span> by</span>
        <strong className="footer-developer">Shubham Shah</strong>
        <a className="website-link" href="https://shubhamsah.com.np" target="_blank" rel="noreferrer">
          shubhamsah.com.np <span aria-hidden="true">↗</span>
        </a>
        <small>© 2026 Yumzo · Demo project, not a real food-delivery service</small>
      </footer>

    </div>
  );
};

export default Splash;







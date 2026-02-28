import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "../Assets/CSS/Navbar.css";
import { Menu, X } from "lucide-react";
import Logo from "../Assets/Images/navbar/Logo.png";
import { useAuth } from "../Context/AuthContext";

export const Navbar = () => {
  const {user, logout} = useAuth()
  const [isOpen, setIsOpen] = useState(false);
  const closeMenu = () => setIsOpen(false);
  const navigate = useNavigate()

  return (
    <header className="navbar-container">
      <div className="navbar">
        {/* ✅ Logo + Text Centered */}
        <div className="navbar-logo">
          <NavLink to="/">
            {/* <img src={Logo} alt="logo" /> */}
            <span>Hoang Truc Portfolio</span>
          </NavLink>
        </div>

        {/* Hamburger Icon */}
        <div className="navbar-toggle" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={26} /> : <Menu size={26} />}
        </div>

        {/* Menu */}
        <nav className={`navbar-menu ${isOpen ? "active" : ""}`}>
          <NavLink to="/" end onClick={closeMenu}>Home</NavLink>
          <NavLink to="/my-project" onClick={closeMenu}>My Project</NavLink>
          <NavLink to="/portrait" onClick={closeMenu}>Portrait</NavLink>
          <NavLink to="/animation" onClick={closeMenu}>Animation (Demo)</NavLink>
          <NavLink to="/about" onClick={closeMenu}>About</NavLink>
          {/* <NavLink to="/dashboard" onClick={closeMenu}>Dashboard</NavLink> */}
          {user ? (
            <div className="nav-user-dropdown">
              <span className="nav-user">
                Xin chào {user.username}
              </span>

              <div className="nav-user-menu">
                <NavLink to="/dashboard" onClick={closeMenu}>Dashboard</NavLink>
                <NavLink to="/" onClick={() => { logout(); closeMenu(); navigate("/") }}>logout</NavLink>
              </div>
            </div>
          ) : (
            <NavLink to="/login" onClick={closeMenu}>Login</NavLink>
          )}

          {/* <NavLink to="/motion" onClick={closeMenu}>Motion</NavLink>
          <NavLink to="/social" onClick={closeMenu}>Social</NavLink>
          <NavLink to="/about" onClick={closeMenu}>About</NavLink> */}
        </nav>
      </div>

      {/* Overlay */}
      {isOpen && <div className="navbar-overlay" onClick={closeMenu}></div>}
    </header>
  );
};

export default Navbar;

import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css";
const links = [
 { to: "/", label: "Home" },
 { to: "/marketplace", label: "Marketplace" },
 { to: "/about", label: "About" },
 { to: "/contact", label: "Contact" },
];
export default function Navbar() {
 const [open, setOpen] = useState(false);
 const { user, logout } = useAuth();
 const navigate = useNavigate();
 const linkClass = ({ isActive }) => (isActive ? "nav-link active" : "nav-link");
 const close = () => setOpen(false);
 const handleLogout = () => {
   logout();
   close();
toast.info("You have been logged out");
   navigate("/");
 };
 return (
<header className="navbar">
<nav className="navbar-inner">
<Link to="/" className="navbar-logo">Abuja<span>Cars</span></Link>
<div className={`navbar-menu ${open ? "open" : ""}`}>
<div className="navbar-links">
           {links.map((l) => (
<NavLink key={l.to} to={l.to} className={linkClass} onClick={close}>{l.label}</NavLink>
           ))}
</div>
<div className="navbar-actions">
           {user ? (
<>
<NavLink to="/profile" className={linkClass} onClick={close}>Hi, {user.fullName.split(" ")[0]}</NavLink>
<button className="navbar-logout" onClick={handleLogout}>Log out</button>
</>
           ) : (
<>
<Link to="/login" className="nav-link" onClick={close}>Log in</Link>
<Link to="/register" className="navbar-signup" onClick={close}>Sign up</Link>
</>
           )}
</div>
</div>
<button className="navbar-toggle" onClick={() => setOpen(!open)} aria-label="Toggle menu" aria-expanded={open}>
         {open ? "✕" : "☰"}
</button>
</nav>
</header>
 );
}
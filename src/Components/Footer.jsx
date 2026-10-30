import { Link } from "react-router-dom";

import "./Footer.css";

export default function Footer() {

  return (
<footer className="footer">
<div className="footer-grid">
<div>
<p className="footer-logo">Abuja<span>Cars</span></p>
<p className="footer-text">Rent or buy your next car from trusted vendors.</p>
</div>
<div>
<h4>Explore</h4>
<Link to="/marketplace">Marketplace</Link>
<Link to="/about">About us</Link>
<Link to="/contact">Contact</Link>
</div>
<div>
<h4>Account</h4>
<Link to="/login">Log in</Link>
<Link to="/register">Become a vendor</Link>
</div>
<div>
<h4>Contact</h4>
<p>support@abujacars.com</p>
<p>+234 800 000 0000</p>
</div>
</div>
<p className="footer-bottom">© {new Date().getFullYear()} DriveHub. All rights reserved.</p>
</footer>

  );

}
 
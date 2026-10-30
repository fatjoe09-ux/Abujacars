import { useState } from "react";

import { Link } from "react-router-dom";

import BookingModal from "./BookingModal";

import "./CarCard.css";

export default function CarCard({ car }) {

  const [showBooking, setShowBooking] = useState(false);

  const { id, name, logo, image, description, price, unit, mode, availability, status } = car;

  const isAvailable = availability === "Available";

  return (
<article className="car-card">
<div className="car-card-image">
<img src={image} alt={name} loading="lazy" />
<span className={`car-card-status ${status === "New" ? "is-new" : "is-used"}`}>{status}</span>
<span className="car-card-mode">{mode === "rent" ? "For rent" : "For sale"}</span>
</div>
<div className="car-card-body">
<div className="car-card-title">
<h3>{name}</h3>
<img src={logo} alt="" className="car-card-logo" />
</div>
<p className="car-card-desc">{description}</p>
<div className="car-card-row">
<p className="car-card-price">

            ${price.toLocaleString()}<span>{unit}</span>
</p>
<span className={`car-card-avail ${availability.toLowerCase()}`}>{availability}</span>
</div>
<div className="car-card-actions">
<Link to={`/cars/${id}`} className="car-card-btn">View details</Link>
<button className="car-card-btn car-card-btn-primary" disabled={!isAvailable} onClick={() => setShowBooking(true)}>

            {isAvailable ? (mode === "rent" ? "Book now" : "Buy now") : availability}
</button>
</div>
</div>

      {showBooking && <BookingModal car={car} onClose={() => setShowBooking(false)} />}
</article>

  );

}
 
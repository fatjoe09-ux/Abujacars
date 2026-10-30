import { useEffect, useState } from "react";

import { Link, useParams } from "react-router-dom";

import BookingModal from "../components/BookingModal";

import CarCard from "../components/CarCard";

import { useCars } from "../context/CarsContext";

import "./CarDetails.css";

const included = {

  rent: ["Insurance cover", "24/7 roadside support", "Free cancellation up to 24 hours before pick-up"],

  sale: ["Vehicle inspection report", "Warranty options", "Financing guidance"],

};

export default function CarDetails() {

  const { id } = useParams();

  const { cars, loading } = useCars();

  const car = cars.find((c) => String(c.id) === id);

  const [showBooking, setShowBooking] = useState(false);

  const [activeImg, setActiveImg] = useState(0);

  useEffect(() => {

    window.scrollTo(0, 0);

    setActiveImg(0);

  }, [id]);

  if (loading) return <section className="cd-container"><p>Loading car...</p></section>;

  if (!car) {

    return (
<section className="cd-container cd-missing">
<h1>Car not found</h1>
<p>This car may have been removed or the link is wrong.</p>
<Link to="/marketplace" className="cd-btn">Back to marketplace</Link>
</section>

    );

  }

  const isRent = car.mode === "rent";

  const isAvailable = car.availability === "Available";

  const images = car.gallery?.length ? car.gallery : [car.image];

  const specs = [

    ["Year", car.year],

    ["Transmission", car.transmission],

    ["Fuel", car.fuel],

    ["Seats", car.seats],

    ["Mileage", car.mileage],

    ["Colour", car.color],

    ["Location", car.location],

    ["Condition", car.status],

  ];

  const similar = cars

    .filter((c) => c.id !== car.id && (c.brand === car.brand || c.mode === car.mode))

    .slice(0, 3);

  return (
<>
<div className="cd-container">
<p className="cd-crumbs">
<Link to="/">Home</Link> / <Link to="/marketplace">Marketplace</Link> / {car.name}
</p>
<div className="cd-main">
<div className="cd-gallery">
<div className="cd-image">
<img src={images[activeImg]} alt={car.name} />
<span className={`cd-badge ${car.status === "New" ? "is-new" : "is-used"}`}>{car.status}</span>
</div>

            {images.length > 1 && (
<div className="cd-thumbs">

                {images.map((src, i) => (
<button key={src} className={i === activeImg ? "active" : ""} onClick={() => setActiveImg(i)} aria-label={`Show photo ${i + 1}`}>
<img src={src} alt="" />
</button>

                ))}
</div>

            )}
</div>
<div className="cd-info">
<div className="cd-title">
<h1>{car.name}</h1>
<img src={car.logo} alt={car.brand} />
</div>
<div className="cd-tags">
<span>{isRent ? "For rent" : "For sale"}</span>
<span className={`cd-avail ${car.availability.toLowerCase()}`}>{car.availability}</span>
<span>{car.location}</span>
</div>
<p className="cd-price">

              ${car.price.toLocaleString()}<span>{car.unit}</span>
</p>
<p className="cd-desc">{car.description}</p>
<button className="cd-btn cd-btn-full" disabled={!isAvailable} onClick={() => setShowBooking(true)}>

              {isAvailable ? (isRent ? "Book this car" : "Request to buy") : `Currently ${car.availability.toLowerCase()}`}
</button>
<ul className="cd-included">

              {included[car.mode].map((item) => <li key={item}>{item}</li>)}
</ul>
</div>
</div>
<section className="cd-specs">
<h2>Specifications</h2>
<dl>

            {specs.map(([label, value]) => (
<div key={label}><dt>{label}</dt><dd>{value}</dd></div>

            ))}
</dl>
</section>
</div>

      {similar.length > 0 && (
<section className="cd-similar">
<div className="cd-container">
<h2>Similar cars</h2>
<div className="cd-similar-grid">

              {similar.map((c) => <CarCard key={c.id} car={c} />)}
</div>
</div>
</section>

      )}

      {showBooking && <BookingModal car={car} onClose={() => setShowBooking(false)} />}
</>

  );

}
 
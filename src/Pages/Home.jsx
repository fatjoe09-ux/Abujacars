import { useState } from "react";

import { Link, useNavigate } from "react-router-dom";

import CarCard from "../components/CarCard";

import { brands } from "../data/cars";

import { useCars } from "../context/CarsContext";

import "./Home.css";

const trust = [

  { title: "Verified vendors", text: "Every seller is checked" },

  { title: "Clear pricing", text: "No hidden fees" },

  { title: "Flexible options", text: "Rent by day or buy" },

  { title: "Support", text: "Before and after you drive" },

];

const services = [

  { title: "Rent a car", text: "Pick dates and drive away, from one day to one month." },

  { title: "Buy a car", text: "Browse new and used cars listed by vendors." },

  { title: "Sell as a vendor", text: "List your cars and manage them from your profile." },

  { title: "Support", text: "Ask us anything about a booking or a purchase." },

];

const reviews = [

  { name: "James Carter", text: "Booking took two minutes and the car was spotless.", stars: 5 },

  { name: "Sophia Martinez", text: "I found my car, compared prices and bought it the same week.", stars: 5 },

  { name: "Daniel Wilson", text: "Listing my cars as a vendor was simple and the dashboard is clear.", stars: 4 },

];

const tabs = ["All", "New", "Used", "Rent", "Buy"];

function SearchBar() {

  const navigate = useNavigate();

  const [tab, setTab] = useState("All");

  const [brand, setBrand] = useState("");

  const [maxPrice, setMaxPrice] = useState("");

  const onSubmit = (e) => {

    e.preventDefault();

    const params = new URLSearchParams();

    if (tab !== "All") params.set("type", tab.toLowerCase());

    if (brand) params.set("brand", brand);

    if (maxPrice) params.set("maxPrice", maxPrice);

    navigate(`/marketplace?${params.toString()}`);

  };

  return (
<form onSubmit={onSubmit} className="search">
<div className="search-tabs" role="tablist">

        {tabs.map((t) => (
<button key={t} type="button" role="tab" aria-selected={tab === t}

            className={tab === t ? "search-tab active" : "search-tab"} onClick={() => setTab(t)}>

            {t}
</button>

        ))}
</div>
<div className="search-fields">
<select value={brand} onChange={(e) => setBrand(e.target.value)} aria-label="Brand">
<option value="">Any brand</option>

          {brands.map((b) => <option key={b.name}>{b.name}</option>)}
</select>
<select value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} aria-label="Max price">
<option value="">Any price</option>
<option value="100">Up to $100</option>
<option value="30000">Up to $30,000</option>
<option value="80000">Up to $80,000</option>
</select>
<button className="search-btn">Search cars</button>
</div>
</form>

  );

}

export default function Home() {

  const { cars } = useCars();

  return (
<>

      {/* Hero */}
<section className="hero">
<img className="hero-bg" src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1600" alt="" />
<div className="hero-overlay" />
<div className="container hero-content">
<h1>Rent or buy the car for <span>every journey</span></h1>
<p>New and used cars from trusted vendors. Compare prices, check availability and book in minutes.</p>
<div className="hero-buttons">
<Link to="/marketplace" className="btn btn-red">Browse cars</Link>
<Link to="/register" className="btn btn-outline">Become a vendor</Link>
</div>
<div className="trust">

            {trust.map((t) => (
<div key={t.title} className="trust-item">
<strong>{t.title}</strong>
<span>{t.text}</span>
</div>

            ))}
</div>
</div>
</section>
<div className="search-wrap"><SearchBar /></div>

      {/* Brands */}
<section className="section container">
<div className="section-head">
<h2>Explore top car brands</h2>
<Link to="/marketplace">View all</Link>
</div>
<div className="brands">

          {brands.map((b) => (
<Link key={b.name} to={`/marketplace?brand=${b.name}`} className="brand">
<img src={b.logo} alt={b.name} />
<span>{b.name}</span>
</Link>

          ))}
</div>
</section>

      {/* Popular cars */}
<section className="section section-gray">
<div className="container">
<div className="section-head">
<h2>Popular cars</h2>
<Link to="/marketplace">View all cars</Link>
</div>
<div className="cars-grid">

            {cars.slice(0, 6).map((car) => <CarCard key={car.id} car={car} />)}
</div>
</div>
</section>

      {/* Services */}
<section className="section container">
<h2>Everything you need, in one place</h2>
<p className="section-sub">From your first booking to listing your own fleet.</p>
<div className="services">

          {services.map((s) => (
<div key={s.title} className="service">
<h3>{s.title}</h3>
<p>{s.text}</p>
</div>

          ))}
</div>
</section>

      {/* Stats */}
<section className="stats">
<div className="container stats-grid">

          {[["5K+", "Happy customers"], ["500+", "Cars listed"], ["120+", "Verified vendors"]].map(([n, l]) => (
<div key={l}><strong>{n}</strong><span>{l}</span></div>

          ))}
</div>
</section>

      {/* Reviews */}
<section className="section container">
<h2>What our customers say</h2>
<div className="reviews">

          {reviews.map((r) => (
<figure key={r.name} className="review">
<p className="review-stars" aria-label={`${r.stars} out of 5 stars`}>{"★".repeat(r.stars)}{"☆".repeat(5 - r.stars)}</p>
<blockquote>{r.text}</blockquote>
<figcaption>{r.name}</figcaption>
</figure>

          ))}
</div>
</section>

      {/* CTA */}
<section className="cta">
<h2>Find your car today</h2>
<p>Browse the marketplace or create a vendor account to list your cars.</p>
<div className="hero-buttons cta-buttons">
<Link to="/marketplace" className="btn btn-white">Browse cars</Link>
<Link to="/contact" className="btn btn-outline">Contact us</Link>
</div>
</section>
</>

  );

}
 
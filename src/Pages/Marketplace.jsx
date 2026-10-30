import { useState } from "react";

import { Link, useSearchParams } from "react-router-dom";

import CarCard from "../components/CarCard";

import { brands } from "../data/cars";

import { useCars } from "../context/CarsContext";

import "./Marketplace.css";

const types = [

  { value: "", label: "All" },

  { value: "new", label: "New" },

  { value: "used", label: "Used" },

  { value: "rent", label: "For rent" },

  { value: "buy", label: "For sale" },

];

const matchesType = (car, type) => {

  if (type === "new") return car.status === "New";

  if (type === "used") return car.status === "Used";

  if (type === "rent") return car.mode === "rent";

  if (type === "buy") return car.mode === "sale";

  return true;

};

export default function Marketplace() {

  const [params, setParams] = useSearchParams();

  const [showFilters, setShowFilters] = useState(false);

  const { cars, loading } = useCars();

  const q = params.get("q") || "";

  const brand = params.get("brand") || "";

  const type = params.get("type") || "";

  const maxPrice = params.get("maxPrice") || "";

  const availableOnly = params.get("available") === "1";

  const sort = params.get("sort") || "";

  const update = (key, value) => {

    const next = new URLSearchParams(params);

    if (value) next.set(key, value);

    else next.delete(key);

    setParams(next, { replace: true });

  };

  const results = cars

    .filter((c) => {

      const text = `${c.name} ${c.brand} ${c.description}`.toLowerCase();

      return (

        (!q || text.includes(q.toLowerCase())) &&

        (!brand || c.brand === brand) &&

        matchesType(c, type) &&

        (!maxPrice || c.price <= Number(maxPrice)) &&

        (!availableOnly || c.availability === "Available")

      );

    })

    .sort((a, b) => {

      if (sort === "price-asc") return a.price - b.price;

      if (sort === "price-desc") return b.price - a.price;

      if (sort === "name") return a.name.localeCompare(b.name);

      return 0;

    });

  const hasFilters = q || brand || type || maxPrice || availableOnly || sort;

  return (
<>
<section className="mp-header">
<div className="mp-container">
<p className="mp-crumbs"><Link to="/">Home</Link> / Marketplace</p>
<h1>Car marketplace</h1>
<p>Browse cars to rent or buy from trusted vendors.</p>
</div>
</section>
<div className="mp-container mp-layout">
<button className="mp-filter-toggle" onClick={() => setShowFilters(!showFilters)} aria-expanded={showFilters}>

          {showFilters ? "Hide filters" : "Show filters"}
</button>
<aside className={`mp-filters ${showFilters ? "open" : ""}`}>
<div className="mp-filter-group">
<label htmlFor="mp-search">Search</label>
<input id="mp-search" type="search" placeholder="Name, brand or keyword" value={q} onChange={(e) => update("q", e.target.value)} />
</div>
<div className="mp-filter-group">
<span className="mp-label">Type</span>
<div className="mp-chips">

              {types.map((t) => (
<button key={t.label} className={type === t.value ? "mp-chip active" : "mp-chip"} onClick={() => update("type", t.value)}>

                  {t.label}
</button>

              ))}
</div>
</div>
<div className="mp-filter-group">
<label htmlFor="mp-brand">Brand</label>
<select id="mp-brand" value={brand} onChange={(e) => update("brand", e.target.value)}>
<option value="">Any brand</option>

              {brands.map((b) => <option key={b.name}>{b.name}</option>)}
</select>
</div>
<div className="mp-filter-group">
<label htmlFor="mp-price">Max price</label>
<select id="mp-price" value={maxPrice} onChange={(e) => update("maxPrice", e.target.value)}>
<option value="">Any price</option>
<option value="100">Up to $100</option>
<option value="30000">Up to $30,000</option>
<option value="80000">Up to $80,000</option>
</select>
</div>
<label className="mp-check">
<input type="checkbox" checked={availableOnly} onChange={(e) => update("available", e.target.checked ? "1" : "")} />

            Available only
</label>

          {hasFilters && <button className="mp-clear" onClick={() => setParams({}, { replace: true })}>Clear all filters</button>}
</aside>
<section className="mp-results">
<div className="mp-toolbar">
<p><strong>{results.length}</strong> {results.length === 1 ? "car" : "cars"} found</p>
<select value={sort} onChange={(e) => update("sort", e.target.value)} aria-label="Sort cars">
<option value="">Sort: Featured</option>
<option value="price-asc">Price: low to high</option>
<option value="price-desc">Price: high to low</option>
<option value="name">Name: A to Z</option>
</select>
</div>

          {loading ? (
<div className="mp-empty"><p>Loading cars...</p></div>

          ) : results.length > 0 ? (
<div className="mp-grid">

              {results.map((car) => <CarCard key={car.id} car={car} />)}
</div>

          ) : (
<div className="mp-empty">
<h2>No cars match your filters</h2>
<p>Try a different brand or price, or clear the filters.</p>
<button className="mp-clear" onClick={() => setParams({}, { replace: true })}>Clear all filters</button>
</div>

          )}
</section>
</div>
</>

  );

}
 
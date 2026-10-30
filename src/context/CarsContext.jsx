import { createContext, useCallback, useContext, useEffect, useState } from "react";

import { CARS_API_BASE } from "../config";

import { brands, cars as sampleCars } from "../data/cars";

const CarsContext = createContext(null);

const CARS_URL = `${CARS_API_BASE}/cars`;

async function request(path = "", options = {}) {

  let res;

  try {

    res = await fetch(`${CARS_URL}${path}`, { ...options, headers: { "Content-Type": "application/json" } });

  } catch {

    throw new Error("Could not reach the server. Check your connection and CARS_API_BASE in config.js.");

  }

  if (!res.ok) {

    const err = new Error(`The server replied with an error (${res.status}).`);

    err.status = res.status;

    throw err;

  }

  return res.json();

}

// Turns a raw API record into the shape our cards and pages expect.

const normalise = (c) => ({

  ...c,

  price: Number(c.price),

  year: Number(c.year),

  seats: Number(c.seats),

  unit: c.mode === "rent" ? "/day" : "",

  logo: brands.find((b) => b.name === c.brand)?.logo || "",

});

export function CarsProvider({ children }) {

  const [cars, setCars] = useState([]);

  const [loading, setLoading] = useState(true);

  // true while the database has no cars (or can't be reached), so the site still shows the sample cars

  const [usingSamples, setUsingSamples] = useState(false);

  const load = useCallback(async () => {

    try {

      const list = await request();

      if (list.length) {

        setCars(list.map(normalise));

        setUsingSamples(false);

      } else {

        setCars(sampleCars);

        setUsingSamples(true);

      }

    } catch {

      setCars(sampleCars);

      setUsingSamples(true);

    } finally {

      setLoading(false);

    }

  }, []);

  useEffect(() => {

    load();

  }, [load]);

  const addCar = async (data) => {

    const created = normalise(await request("", { method: "POST", body: JSON.stringify(data) }));

    setCars((prev) => (usingSamples ? [created] : [created, ...prev]));

    setUsingSamples(false);

  };

  const updateCar = async (id, data) => {

    const updated = normalise(await request(`/${id}`, { method: "PUT", body: JSON.stringify(data) }));

    setCars((prev) => prev.map((c) => (String(c.id) === String(id) ? updated : c)));

  };

  const deleteCar = async (id) => {

    try {

      await request(`/${id}`, { method: "DELETE" });

    } catch (err) {

      if (err.status !== 404) throw err; // 404 = already gone

    }

    setCars((prev) => prev.filter((c) => String(c.id) !== String(id)));

  };

  return (
<CarsContext.Provider value={{ cars, loading, usingSamples, addCar, updateCar, deleteCar, reload: load }}>

      {children}
</CarsContext.Provider>

  );

}

export const useCars = () => useContext(CarsContext);
 
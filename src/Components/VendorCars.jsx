import { useState } from "react";

import { Link } from "react-router-dom";

import { toast } from "react-toastify";

import { useAuth } from "../context/AuthContext";

import { useCars } from "../context/CarsContext";

import CarFormModal from "./CarFormModal";

import "./VendorCars.css";

export default function VendorCars() {

  const { user } = useAuth();

  const { cars, usingSamples, addCar, updateCar, deleteCar } = useCars();

  const [editing, setEditing] = useState(undefined); // undefined = closed, null = adding, car = editing

  const [confirmId, setConfirmId] = useState(null);

  const myCars = usingSamples ? [] : cars.filter((c) => String(c.vendorId) === String(user.id));

  const toPayload = (v) => ({

    name: v.name.trim(),

    brand: v.brand,

    mode: v.mode,

    price: Number(v.price),

    status: v.status,

    availability: v.availability,

    image: v.image.trim(),

    description: v.description.trim(),

    year: Number(v.year),

    transmission: v.transmission,

    fuel: v.fuel,

    seats: Number(v.seats),

    mileage: v.mileage.trim(),

    color: v.color.trim(),

    location: v.location.trim(),

    vendorId: user.id,

    vendorName: user.businessName || user.fullName,

  });

  const save = async (values) => {

    try {

      if (editing) {

        await updateCar(editing.id, toPayload(values));

        toast.success("Car updated");

      } else {

        await addCar(toPayload(values));

        toast.success("Car added to the marketplace");

      }

      setEditing(undefined);

    } catch (err) {

      toast.error(err.message);

      throw err;

    }

  };

  const remove = async (id) => {

    try {

      await deleteCar(id);
toast.info("Car deleted");

    } catch (err) {

      toast.error(err.message);

    } finally {

      setConfirmId(null);

    }

  };

  return (
<div className="pf-card vc">
<div className="pf-card-head">
<h2>My cars</h2>
<button className="pf-btn pf-btn-primary" onClick={() => setEditing(null)}>+ Add car</button>
</div>

      {myCars.length === 0 ? (
<p className="vc-empty">You haven't listed any cars yet. Click “Add car” to list your first one.</p>

      ) : (
<ul className="vc-list">

          {myCars.map((car) => (
<li key={car.id} className="vc-item">
<img src={car.image} alt={car.name} className="vc-thumb" />
<div className="vc-info">
<Link to={`/cars/${car.id}`} className="vc-name">{car.name}</Link>
<p className="vc-meta">

                  ${car.price.toLocaleString()}{car.unit} · {car.mode === "rent" ? "For rent" : "For sale"} · {car.status} · {car.availability}
</p>
</div>

              {confirmId === car.id ? (
<div className="vc-actions">
<button className="pf-btn pf-btn-danger" onClick={() => remove(car.id)}>Yes, delete</button>
<button className="pf-btn" onClick={() => setConfirmId(null)}>No</button>
</div>

              ) : (
<div className="vc-actions">
<button className="pf-btn" onClick={() => setEditing(car)}>Edit</button>
<button className="pf-btn pf-btn-danger" onClick={() => setConfirmId(car.id)}>Delete</button>
</div>

              )}
</li>

          ))}
</ul>

      )}

      {editing !== undefined && <CarFormModal car={editing} onClose={() => setEditing(undefined)} onSubmit={save} />}
</div>

  );

}
 
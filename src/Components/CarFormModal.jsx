import { useEffect } from "react";

import { createPortal } from "react-dom";

import { Formik, Form, Field, ErrorMessage } from "formik";

import * as Yup from "yup";

import { brands } from "../data/cars";

import "./CarFormModal.css";

const thisYear = new Date().getFullYear();

const num = (label) => Yup.number().typeError(`Enter a number for ${label}`);

const schema = Yup.object({

  name: Yup.string().min(3, "Enter the car name").required("Car name is required"),

  brand: Yup.string().required("Choose a brand"),

  mode: Yup.string().oneOf(["rent", "sale"]).required(),

  price: num("price").positive("Price must be more than 0").required("Price is required"),

  status: Yup.string().required(),

  availability: Yup.string().required(),

  image: Yup.string().url("Enter a valid image link starting with https://").required("Image link is required"),

  description: Yup.string().min(10, "Write at least 10 characters").max(160, "Keep it under 160 characters").required("Description is required"),

  year: num("year").integer("Enter a whole year").min(1990, "Year must be 1990 or later").max(thisYear + 1, "Year is too far ahead").required("Year is required"),

  transmission: Yup.string().required(),

  fuel: Yup.string().required(),

  seats: num("seats").integer("Whole number only").min(1, "At least 1 seat").max(12, "At most 12 seats").required("Seats are required"),

  mileage: Yup.string().required("Mileage is required"),

  color: Yup.string().required("Colour is required"),

  location: Yup.string().required("Location is required"),

});

const defaults = {

  name: "", brand: "", mode: "rent", price: "", status: "New", availability: "Available", image: "", description: "",

  year: "", transmission: "Automatic", fuel: "Petrol", seats: "", mileage: "", color: "", location: "",

};

function Input({ name, label, children, ...rest }) {

  return (
<div className="cf-field">
<label htmlFor={name}>{label}</label>
<Field id={name} name={name} {...rest}>{children}</Field>
<ErrorMessage name={name} component="p" className="cf-error" />
</div>

  );

}

export default function CarFormModal({ car, onClose, onSubmit }) {

  useEffect(() => {

    const onKey = (e) => e.key === "Escape" && onClose();

    document.addEventListener("keydown", onKey);

    document.body.style.overflow = "hidden";

    return () => {

      document.removeEventListener("keydown", onKey);

      document.body.style.overflow = "";

    };

  }, [onClose]);

  const initialValues = car ? Object.fromEntries(Object.keys(defaults).map((k) => [k, car[k] ?? defaults[k]])) : defaults;

  const handle = async (values, { setSubmitting }) => {

    try {

      await onSubmit(values);

    } catch {

      setSubmitting(false); // the parent already showed the error

    }

  };

  return createPortal(
<div className="cf-overlay" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
<div className="cf-dialog" role="dialog" aria-modal="true" aria-labelledby="cf-title">
<button className="cf-close" onClick={onClose} aria-label="Close">✕</button>
<h2 id="cf-title">{car ? "Edit car" : "Add a car"}</h2>
<Formik initialValues={initialValues} validationSchema={schema} onSubmit={handle}>

          {({ values, isSubmitting }) => (
<Form noValidate>
<Input name="name" label="Car name" placeholder="e.g. Toyota Camry XSE" />
<div className="cf-row">
<Input name="brand" label="Brand" as="select">
<option value="">Choose brand</option>

                  {brands.map((b) => <option key={b.name}>{b.name}</option>)}
</Input>
<Input name="mode" label="Listing type" as="select">
<option value="rent">For rent</option>
<option value="sale">For sale</option>
</Input>
</div>
<div className="cf-row">
<Input name="price" label={values.mode === "rent" ? "Price per day ($)" : "Price ($)"} type="number" min="0" />
<Input name="status" label="Condition" as="select">
<option>New</option>
<option>Used</option>
</Input>
<Input name="availability" label="Availability" as="select">
<option>Available</option>
<option>Rented</option>
<option>Sold</option>
</Input>
</div>
<Input name="image" label="Image link (URL)" placeholder="https://..." />

              {values.image && /^https?:\/\//.test(values.image) && (
<img className="cf-preview" src={values.image} alt="Preview" onError={(e) => (e.currentTarget.style.display = "none")} onLoad={(e) => (e.currentTarget.style.display = "block")} />

              )}
<Input name="description" label="Short description" as="textarea" rows="2" placeholder="A line or two about the car" />
<div className="cf-row">
<Input name="year" label="Year" type="number" />
<Input name="seats" label="Seats" type="number" />
<Input name="color" label="Colour" />
</div>
<div className="cf-row">
<Input name="transmission" label="Transmission" as="select">
<option>Automatic</option>
<option>Manual</option>
</Input>
<Input name="fuel" label="Fuel" as="select">
<option>Petrol</option>
<option>Diesel</option>
<option>Hybrid</option>
<option>Electric</option>
</Input>
</div>
<div className="cf-row">
<Input name="mileage" label="Mileage" placeholder="e.g. 12,000 km" />
<Input name="location" label="Location" placeholder="e.g. Lagos" />
</div>
<button type="submit" className="cf-submit" disabled={isSubmitting}>

                {isSubmitting ? "Saving..." : car ? "Save changes" : "Add car"}
</button>
</Form>

          )}
</Formik>
</div>
</div>,

    document.body

  );

}
 
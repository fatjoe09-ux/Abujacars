import { useEffect, useState } from "react";

import { createPortal } from "react-dom";

import { Link } from "react-router-dom";

import { Formik, Form, Field, ErrorMessage } from "formik";

import * as Yup from "yup";

import { toast } from "react-toastify";

import { useAuth } from "../context/AuthContext";

import { API_BASE } from "../config";

import "./BookingModal.css";

const today = new Date();

today.setHours(0, 0, 0, 0);

const base = {

  fullName: Yup.string().min(3, "Enter your full name").required("Full name is required"),

  email: Yup.string().email("Enter a valid email").required("Email is required"),

  phone: Yup.string().matches(/^[+\d][\d\s-]{7,14}$/, "Enter a valid phone number").required("Phone number is required"),

  message: Yup.string().max(300, "Keep it under 300 characters"),

};

const rentSchema = Yup.object({

  ...base,

  startDate: Yup.date().typeError("Choose a pick-up date").min(today, "Pick-up cannot be in the past").required("Pick-up date is required"),

  endDate: Yup.date().typeError("Choose a return date").min(Yup.ref("startDate"), "Return date must be after pick-up").required("Return date is required"),

});

const buySchema = Yup.object(base);

const daysBetween = (a, b) => {

  if (!a || !b) return 0;

  const d = Math.ceil((new Date(b) - new Date(a)) / 86400000);

  return d > 0 ? d : 1; // same-day rental counts as 1 day

};

const makeReference = () => "DH-" + Math.random().toString(36).slice(2, 8).toUpperCase();

const formatDate = (d) => new Date(d).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });

function FormField({ name, label, type = "text", as, ...rest }) {

  return (
<div className="bm-field">
<label htmlFor={name}>{label}</label>
<Field id={name} name={name} type={type} as={as} {...rest} />
<ErrorMessage name={name} component="p" className="bm-error" />
</div>

  );

}

export default function BookingModal({ car, onClose }) {

  const { user } = useAuth();

  const [confirmed, setConfirmed] = useState(null);

  const isRent = car.mode === "rent";

  useEffect(() => {

    const onKey = (e) => e.key === "Escape" && onClose();

    document.addEventListener("keydown", onKey);

    document.body.style.overflow = "hidden";

    return () => {

      document.removeEventListener("keydown", onKey);

      document.body.style.overflow = "";

    };

  }, [onClose]);

  const handleSubmit = async (values, { setSubmitting }) => {

    const days = isRent ? daysBetween(values.startDate, values.endDate) : 0;

    const booking = {

      reference: makeReference(),

      type: isRent ? "rent" : "buy",

      carId: car.id,

      carName: car.name,

      startDate: isRent ? values.startDate : "",

      endDate: isRent ? values.endDate : "",

      days,

      total: isRent ? days * car.price : car.price,

      fullName: values.fullName.trim(),

      email: values.email.trim().toLowerCase(),

      phone: values.phone.trim(),

      message: values.message.trim(),

      userId: user?.id ?? "",

      status: "Pending",

      createdAt: new Date().toISOString(),

    };

    try {

      const res = await fetch(`${API_BASE}/bookings`, {

        method: "POST",

        headers: { "Content-Type": "application/json" },

        body: JSON.stringify(booking),

      });

      if (!res.ok) throw new Error(`Status ${res.status}`);

      setConfirmed(booking);

   } catch (err) {
 console.error("Booking failed:", err);
 const reason = err.message.startsWith("Status")
   ? `The server replied with an error (${err.message.replace("Status ", "")}).`
   : "Could not reach the server. Check your connection and the API_BASE in config.js.";
 toast.error(`We could not send your request. ${reason}`);
 setSubmitting(false);
}

  };

  return createPortal(
<div className="bm-overlay" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
<div className="bm-dialog" role="dialog" aria-modal="true" aria-labelledby="bm-title">
<button className="bm-close" onClick={onClose} aria-label="Close">✕</button>

        {confirmed ? (
<div className="bm-confirm">
<div className="bm-check" aria-hidden="true">✓</div>
<h2 id="bm-title">{isRent ? "Booking request received" : "Purchase request received"}</h2>
<p className="bm-confirm-sub">We will contact you at <strong>{confirmed.email}</strong> to confirm.</p>
<p className="bm-ref">Reference <strong>{confirmed.reference}</strong></p>
<dl className="bm-summary">
<div><dt>Car</dt><dd>{confirmed.carName}</dd></div>

              {isRent && <div><dt>Pick-up</dt><dd>{formatDate(confirmed.startDate)}</dd></div>}

              {isRent && <div><dt>Return</dt><dd>{formatDate(confirmed.endDate)}</dd></div>}

              {isRent && <div><dt>Duration</dt><dd>{confirmed.days} day{confirmed.days > 1 ? "s" : ""}</dd></div>}
<div><dt>Name</dt><dd>{confirmed.fullName}</dd></div>
<div><dt>Phone</dt><dd>{confirmed.phone}</dd></div>
<div className="bm-summary-total"><dt>{isRent ? "Estimated total" : "Price"}</dt><dd>${confirmed.total.toLocaleString()}</dd></div>
</dl>
<div className="bm-confirm-actions">
<button className="bm-submit" onClick={onClose}>Done</button>
<Link to="/marketplace" className="bm-link" onClick={onClose}>Browse more cars</Link>
</div>
</div>

        ) : (
<>
<h2 id="bm-title">{isRent ? "Request a booking" : "Request to buy"}</h2>
<p className="bm-car">{car.name} · ${car.price.toLocaleString()}{car.unit}</p>
<Formik

              initialValues={{

                fullName: user?.fullName || "",

                email: user?.email || "",

                phone: user?.phone || "",

                startDate: "",

                endDate: "",

                message: "",

              }}

              validationSchema={isRent ? rentSchema : buySchema}

              onSubmit={handleSubmit}
>

              {({ isSubmitting, values }) => {

                const days = isRent ? daysBetween(values.startDate, values.endDate) : 0;

                return (
<Form noValidate>
<FormField name="fullName" label="Full name" placeholder="e.g. Maryam Adeyemi" />
<div className="bm-row">
<FormField name="email" label="Email" type="email" placeholder="you@email.com" />
<FormField name="phone" label="Phone" type="tel" placeholder="+234 800 000 0000" />
</div>

                    {isRent && (
<div className="bm-row">
<FormField name="startDate" label="Pick-up date" type="date" />
<FormField name="endDate" label="Return date" type="date" />
</div>

                    )}
<FormField name="message" label="Message (optional)" as="textarea" rows="3" placeholder="Anything we should know?" />

                    {isRent && days > 0 && (
<p className="bm-total">{days} day{days > 1 ? "s" : ""} · estimated total <strong>${(days * car.price).toLocaleString()}</strong></p>

                    )}
<button type="submit" className="bm-submit" disabled={isSubmitting}>

                      {isSubmitting ? "Sending..." : isRent ? "Send booking request" : "Send purchase request"}
</button>
</Form>

                );

              }}
</Formik>
</>

        )}
</div>
</div>,

    document.body

  );

}
 
import { useState } from "react";

import { Formik, Form } from "formik";

import * as Yup from "yup";

import { toast } from "react-toastify";

import { useNavigate } from "react-router-dom";

import FormField from "../components/FormField";

import VendorCars from "../components/VendorCars";

import { useAuth } from "../context/AuthContext";

import "./Profile.css";

const buildSchema = (isVendor) =>

  Yup.object({

    fullName: Yup.string().min(3, "Enter your full name").required("Full name is required"),

    businessName: isVendor ? Yup.string().min(2, "Enter your business name").required("Business name is required") : Yup.string(),

    email: Yup.string().email("Enter a valid email").required("Email is required"),

    phone: Yup.string().matches(/^[+\d][\d\s-]{7,14}$/, "Enter a valid phone number").required("Phone number is required"),

    newPassword: Yup.string().test("pw", "Use at least 6 characters with a number", (v) => !v || (v.length >= 6 && /\d/.test(v))),

  });

export default function Profile() {

  const { user, updateAccount, deleteAccount } = useAuth();

  const navigate = useNavigate();

  const [editing, setEditing] = useState(false);

  const [confirmDelete, setConfirmDelete] = useState(false);

  const [confirmText, setConfirmText] = useState("");

  const isVendor = user.role === "vendor";

  const onSubmit = async (values, { setSubmitting, setFieldError, resetForm }) => {

    try {

      await updateAccount(values);

      toast.success("Your account has been updated");

      resetForm();

      setEditing(false);

    } catch (err) {

      setFieldError("email", err.message);

      toast.error(err.message);

      setSubmitting(false);

    }

  };

  const onDelete = async () => {

    try {

      await deleteAccount();
toast.info("Your account has been deleted");

      navigate("/", { replace: true });

    } catch (err) {

      toast.error(err.message);

    }

  };

  const details = [

    ["Full name", user.fullName],

    ...(isVendor ? [["Business name", user.businessName]] : []),

    ["Email", user.email],

    ["Phone", user.phone],

    ["Member since", new Date(user.createdAt).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })],

  ];

  return (
<section className="pf-page">
<div className="pf-container">
<header className="pf-header">
<div className="pf-avatar">{user.fullName.charAt(0).toUpperCase()}</div>
<div>
<h1>{user.fullName}</h1>
<p>{user.email}</p>
</div>
<span className="pf-role">{isVendor ? "Vendor" : "Customer"}</span>
</header>
<div className="pf-card">
<div className="pf-card-head">
<h2>Account details</h2>

            {!editing && <button className="pf-btn" onClick={() => setEditing(true)}>Edit</button>}
</div>

          {!editing ? (
<dl className="pf-details">

              {details.map(([label, value]) => (
<div key={label}><dt>{label}</dt><dd>{value}</dd></div>

              ))}
</dl>

          ) : (
<Formik

              initialValues={{ fullName: user.fullName, businessName: user.businessName || "", email: user.email, phone: user.phone, newPassword: "" }}

              validationSchema={buildSchema(isVendor)}

              onSubmit={onSubmit}
>

              {({ isSubmitting, resetForm }) => (
<Form noValidate>
<FormField name="fullName" label="Full name" />

                  {isVendor && <FormField name="businessName" label="Business name" />}
<div className="pf-row">
<FormField name="email" label="Email" type="email" />
<FormField name="phone" label="Phone" type="tel" />
</div>
<FormField name="newPassword" label="New password (leave blank to keep current)" type="password" autoComplete="new-password" />
<div className="pf-actions">
<button type="submit" className="pf-btn pf-btn-primary" disabled={isSubmitting}>{isSubmitting ? "Saving..." : "Save changes"}</button>
<button type="button" className="pf-btn" onClick={() => { resetForm(); setEditing(false); }}>Cancel</button>
</div>
</Form>

              )}
</Formik>

          )}
</div>

        {isVendor && <VendorCars />}
<div className="pf-card pf-danger">
<h2>Delete account</h2>
<p>This permanently removes your account. This cannot be undone.</p>
<button className="pf-btn pf-btn-danger" onClick={() => setConfirmDelete(true)}>Delete my account</button>
</div>
</div>

      {confirmDelete && (
<div className="pf-overlay" onMouseDown={(e) => e.target === e.currentTarget && setConfirmDelete(false)}>
<div className="pf-dialog" role="dialog" aria-modal="true" aria-labelledby="pf-del-title">
<h2 id="pf-del-title">Delete your account?</h2>
<p>Type <strong>DELETE</strong> to confirm. Your details will be removed from this device.</p>
<input value={confirmText} onChange={(e) => setConfirmText(e.target.value)} placeholder="DELETE" aria-label="Type DELETE to confirm" />
<div className="pf-actions">
<button className="pf-btn pf-btn-danger" disabled={confirmText !== "DELETE"} onClick={onDelete}>Delete account</button>
<button className="pf-btn" onClick={() => { setConfirmDelete(false); setConfirmText(""); }}>Cancel</button>
</div>
</div>
</div>

      )}
</section>

  );

}
 
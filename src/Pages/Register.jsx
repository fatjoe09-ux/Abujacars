import { Formik, Form } from "formik";

import * as Yup from "yup";

import { toast } from "react-toastify";

import { Link, Navigate, useNavigate } from "react-router-dom";

import FormField from "../components/FormField";

import { useAuth } from "../context/AuthContext";

import "./Auth.css";

const schema = Yup.object({

  role: Yup.string().oneOf(["user", "vendor"]),

  fullName: Yup.string().min(3, "Enter your full name").required("Full name is required"),

  businessName: Yup.string().when("role", {

    is: "vendor",

    then: (s) => s.min(2, "Enter your business name").required("Business name is required"),

    otherwise: (s) => s,

  }),

  email: Yup.string().email("Enter a valid email").required("Email is required"),

  phone: Yup.string().matches(/^[+\d][\d\s-]{7,14}$/, "Enter a valid phone number").required("Phone number is required"),

  password: Yup.string().min(6, "Use at least 6 characters").matches(/\d/, "Include at least one number").required("Password is required"),

  confirmPassword: Yup.string().oneOf([Yup.ref("password")], "Passwords do not match").required("Confirm your password"),

});

export default function Register() {

  const { user, register } = useAuth();

  const navigate = useNavigate();

  if (user) return <Navigate to="/profile" replace />;

  const onSubmit = async (values, { setSubmitting, setFieldError }) => {

    try {

      await register(values);

      toast.success(`Welcome to DriveHub, ${values.fullName.split(" ")[0]}!`);

      navigate("/profile");

    } catch (err) {

      setFieldError("email", err.message);

      toast.error(err.message);

      setSubmitting(false);

    }

  };

  return (
<section className="auth-page">
<div className="auth-card">
<h1>Create your account</h1>
<p className="auth-sub">Rent or buy cars, or list your own as a vendor.</p>
<Formik

          initialValues={{ role: "user", fullName: "", businessName: "", email: "", phone: "", password: "", confirmPassword: "" }}

          validationSchema={schema}

          onSubmit={onSubmit}
>

          {({ values, setFieldValue, isSubmitting }) => (
<Form noValidate>
<div className="auth-roles" role="tablist">

                {[["user", "I want to rent or buy"], ["vendor", "I'm a vendor"]].map(([value, label]) => (
<button key={value} type="button" role="tab" aria-selected={values.role === value}

                    className={values.role === value ? "active" : ""} onClick={() => setFieldValue("role", value)}>

                    {label}
</button>

                ))}
</div>
<FormField name="fullName" label="Full name" placeholder="e.g. Maryam Adeyemi" autoComplete="name" />

              {values.role === "vendor" && <FormField name="businessName" label="Business name" placeholder="e.g. Adeyemi Motors" />}
<div className="auth-row">
<FormField name="email" label="Email" type="email" placeholder="you@email.com" autoComplete="email" />
<FormField name="phone" label="Phone" type="tel" placeholder="+234 800 000 0000" autoComplete="tel" />
</div>
<FormField name="password" label="Password" type="password" autoComplete="new-password" />
<FormField name="confirmPassword" label="Confirm password" type="password" autoComplete="new-password" />
<button type="submit" className="auth-submit" disabled={isSubmitting}>

                {isSubmitting ? "Creating account..." : "Create account"}
</button>
</Form>

          )}
</Formik>
<p className="auth-switch">Already have an account? <Link to="/login">Log in</Link></p>
</div>
</section>

  );

}
 
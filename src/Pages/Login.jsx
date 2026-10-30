import { Formik, Form } from "formik";

import * as Yup from "yup";

import { toast } from "react-toastify";

import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";

import FormField from "../components/FormField";

import { useAuth } from "../context/AuthContext";

import "./Auth.css";

const schema = Yup.object({

  email: Yup.string().email("Enter a valid email").required("Email is required"),

  password: Yup.string().required("Password is required"),

});

export default function Login() {

  const { user, login } = useAuth();

  const navigate = useNavigate();

  const location = useLocation();

  const redirectTo = location.state?.from || "/profile";

  if (user) return <Navigate to={redirectTo} replace />;

  const onSubmit = async ({ email, password }, { setSubmitting }) => {

    try {

      await login(email, password);

      toast.success("Welcome back!");

      navigate(redirectTo, { replace: true });

    } catch (err) {

      toast.error(err.message);

      setSubmitting(false);

    }

  };

  return (
<section className="auth-page">
<div className="auth-card">
<h1>Welcome back</h1>
<p className="auth-sub">Log in to manage your bookings and account.</p>
<Formik initialValues={{ email: "", password: "" }} validationSchema={schema} onSubmit={onSubmit}>

          {({ isSubmitting }) => (
<Form noValidate>
<FormField name="email" label="Email" type="email" placeholder="you@email.com" autoComplete="email" />
<FormField name="password" label="Password" type="password" autoComplete="current-password" />
<button type="submit" className="auth-submit" disabled={isSubmitting}>

                {isSubmitting ? "Logging in..." : "Log in"}
</button>
</Form>

          )}
</Formik>
<p className="auth-switch">New to DriveHub? <Link to="/register">Create an account</Link></p>
</div>
</section>

  );

}
 
import { Formik, Form, Field, ErrorMessage } from "formik";

import * as Yup from "yup";

import { toast } from "react-toastify";

import "./Contact.css";

// Add a "messages" resource in your MockAPI project and paste its URL here

const MESSAGES_URL = "https://6adf57db8e42963c8d5dcc72.mockapi.io/contacts";

const schema = Yup.object({

  name: Yup.string()

    .min(2, "Name must be at least 2 characters")

    .required("Enter your name"),

  email: Yup.string()

    .email("Enter a valid email address")

    .required("Enter your email"),

  phone: Yup.string()

    .matches(/^[0-9+\s-]{7,15}$/, "Enter a valid phone number")

    .notRequired(),

  subject: Yup.string().required("Choose a subject"),

  message: Yup.string()

    .min(10, "Message must be at least 10 characters")

    .max(500, "Message must be 500 characters or fewer")

    .required("Write your message"),

});

const initialValues = {

  name: "",

  email: "",

  phone: "",

  subject: "",

  message: "",

};

const details = [

  { label: "Address", value: "12 Lugbe Road, Abuja, Nigeria" },

  { label: "Phone", value: "+234 808 582 4204" },

  { label: "Email", value: "support@abujacars.com" },

  { label: "Hours", value: "Mon to Sat, 8am to 6pm" },

];

function Field_({ name, label, as, children, ...rest }) {

  return (
<div className="contact-field">
<label htmlFor={name}>{label}</label>
<Field id={name} name={name} as={as} {...rest}>

        {children}
</Field>
<ErrorMessage name={name} component="p" className="contact-error" />
</div>

  );

}

function Contact() {

  const handleSubmit = async (values, { resetForm, setSubmitting }) => {

    try {

      const res = await fetch(MESSAGES_URL, {

        method: "POST",

        headers: { "Content-Type": "application/json" },

        body: JSON.stringify({ ...values, createdAt: new Date().toISOString() }),

      });

      if (!res.ok) throw new Error("Request failed");

      toast.success("Message sent. We will reply within 24 hours.");

      resetForm();

    } catch (err) {

      toast.error("Could not send your message. Check your connection and try again.");

    } finally {

      setSubmitting(false);

    }

  };

  return (
<main className="contact">
<section className="contact-hero">
<h1>Contact us</h1>
<p>

          Questions about a car, a booking or your vendor account? Send us a

          message and we will get back to you.
</p>
</section>
<section className="contact-body">
<Formik

          initialValues={initialValues}

          validationSchema={schema}

          onSubmit={handleSubmit}
>

          {({ isSubmitting, values }) => (
<Form className="contact-form" noValidate>
<Field_ name="name" label="Full name" type="text" autoComplete="name" />
<Field_ name="email" label="Email" type="email" autoComplete="email" />
<Field_

                name="phone"

                label="Phone (optional)"

                type="tel"

                autoComplete="tel"

              />
<Field_ name="subject" label="Subject" as="select">
<option value="">Select a subject</option>
<option value="booking">Booking help</option>
<option value="buying">Buying a car</option>
<option value="vendor">Vendor account</option>
<option value="other">Something else</option>
</Field_>
<Field_

                name="message"

                label={`Message (${values.message.length}/500)`}

                as="textarea"

                rows="5"

              />
<button type="submit" className="contact-btn" disabled={isSubmitting}>

                {isSubmitting ? "Sending..." : "Send message"}
</button>
</Form>

          )}
</Formik>
<aside className="contact-info">
<h2>Reach us directly</h2>
<dl>

            {details.map((d) => (
<div key={d.label}>
<dt>{d.label}</dt>
<dd>{d.value}</dd>
</div>

            ))}
</dl>
</aside>
</section>
</main>

  );

}

export default Contact;
 
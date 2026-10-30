import { useState } from "react";

import { Field, ErrorMessage } from "formik";

import "./FormField.css";

export default function FormField({ name, label, type = "text", ...rest }) {

  const [show, setShow] = useState(false);

  const isPassword = type === "password";

  return (
<div className="ff">
<label htmlFor={name}>{label}</label>
<div className="ff-input">
<Field id={name} name={name} type={isPassword && show ? "text" : type} {...rest} />

        {isPassword && (
<button type="button" className="ff-toggle" onClick={() => setShow(!show)} aria-label={show ? "Hide password" : "Show password"}>

            {show ? "Hide" : "Show"}
</button>

        )}
</div>
<ErrorMessage name={name} component="p" className="ff-error" />
</div>

  );

}
 
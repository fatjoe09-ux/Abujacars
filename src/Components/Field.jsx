import { useField } from 'formik';

export default function Field({ label, as: El = 'input', full, children, ...props }) {
  const [field, meta] = useField(props);
  const err = meta.touched && meta.error;
  return (
    <label className={`field ${err ? 'has-error' : ''} ${full ? 'full' : ''} ${props.type === 'checkbox' ? 'check' : ''}`}>
      <span>{label}</span>
      <El {...field} {...props}>{children}</El>
      {err && <small className="err">{meta.error}</small>}
    </label>
  );
}

import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useApp } from '../context/AppContext';
import Field from '../components/Field';
import { money, todayStr, FALLBACK_IMG } from '../utils/format';
import './Checkout.css';

export default function Checkout() {
  const { id } = useParams();
  const [sp] = useSearchParams();
  const { cars, user, placeOrder } = useApp();
  const nav = useNavigate();
  const car = cars.find((c) => c.id === id);
  const rent = sp.get('mode') === 'rent';

  if (!car || !car.available) return <div className="container empty"><h1 className="title">This car is not available</h1><Link to="/cars" className="btn btn-red">Back to marketplace</Link></div>;

  const schema = Yup.object({
    fullName: Yup.string().min(3, 'Enter your full name').required('Full name is required'),
    phone: Yup.string().matches(/^[0-9+\s-]{7,15}$/, 'Enter a valid phone number').required('Phone is required'),
    address: Yup.string().min(8, 'Please enter a full address').required('Address is required'),
    payment: Yup.string().required('Choose a payment method'),
    ...(rent && {
      startDate: Yup.string().required('Pick a start date').test('future', 'Start date cannot be in the past', (v) => !v || v >= todayStr()),
      days: Yup.number().typeError('Enter a number').integer('Whole days only').min(1, 'Minimum 1 day').max(60, 'Maximum 60 days').required('Number of days is required'),
    }),
  });

  const submit = async (v, { setSubmitting }) => {
    await new Promise((r) => setTimeout(r, 900));
    const total = rent ? car.rentPrice * Number(v.days) : car.price;
    placeOrder({ carId: car.id, carName: car.name, carImage: car.image, vendorId: car.vendorId, mode: rent ? 'rent' : 'buy', total, days: rent ? Number(v.days) : null, startDate: rent ? v.startDate : null, payment: v.payment, address: v.address });
    toast.success(rent ? 'Rental booked successfully!' : 'Purchase order placed!');
    nav('/profile');
    setSubmitting(false);
  };

  return (
    <>
      <section className="page-hero"><div className="container"><span className="eyebrow">{rent ? 'Rent' : 'Buy'} checkout</span><h1 className="title">Complete your {rent ? 'rental' : 'purchase'}</h1></div></section>
      <div className="container section co-grid">
        <Formik initialValues={{ fullName: user.name, phone: user.phone || '', address: '', payment: '', startDate: '', days: 1 }} validationSchema={schema} onSubmit={submit}>
          {({ values, isSubmitting }) => {
            const total = rent ? car.rentPrice * (Number(values.days) || 0) : car.price;
            return (
              <>
                <div className="card">
                  <Form noValidate className="form-grid">
                    <Field label="Full name" name="fullName" />
                    <Field label="Phone" name="phone" />
                    <Field label={rent ? 'Delivery / pickup address' : 'Delivery address'} name="address" full placeholder="Street, city, state" />
                    {rent && <><Field label="Start date" name="startDate" type="date" min={todayStr()} /><Field label="Number of days" name="days" type="number" min="1" max="60" /></>}
                    <Field label="Payment method" name="payment" as="select" full>
                      <option value="">Select…</option><option>Card</option><option>Bank transfer</option><option>Pay on {rent ? 'pickup' : 'delivery'}</option>
                    </Field>
                    <button className="btn btn-red full-btn" type="submit" disabled={isSubmitting}>{isSubmitting ? <><span className="spinner" /> Processing…</> : `Confirm ${rent ? 'rental' : 'purchase'} · ${money(total)}`}</button>
                  </Form>
                </div>
                <aside className="card co-sum">
                  <img src={car.image} alt={car.name} onError={(e) => { e.currentTarget.src = FALLBACK_IMG; }} />
                  <h3>{car.name}</h3>
                  <p className="muted">{car.year} · {car.status} · {car.category}</p>
                  <div className="row"><span>{rent ? `${money(car.rentPrice)} × ${Number(values.days) || 0} day(s)` : 'Car price'}</span><b>{money(total)}</b></div>
                  <div className="row tot"><span>Total</span><b>{money(total)}</b></div>
                </aside>
              </>
            );
          }}
        </Formik>
      </div>
    </>
  );
}

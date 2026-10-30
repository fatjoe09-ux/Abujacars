import { useState } from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useApp } from '../context/AppContext';
import Field from '../Components/Field';
import { money, CATEGORIES, FALLBACK_IMG } from '../utils/format';
import './VendorProfile.css';

const profileSchema = Yup.object({
  name: Yup.string().min(3, 'Name is too short').required('Name is required'),
  email: Yup.string().email('Enter a valid email').required('Email is required'),
  phone: Yup.string().matches(/^[0-9+\s-]{7,15}$/, 'Enter a valid phone number').required('Phone is required'),
  companyName: Yup.string().min(2, 'Company name is too short').required('Company name is required'),
  location: Yup.string().required('Location is required'),
  about: Yup.string().max(200, 'Max 200 characters'),
  logo: Yup.string().url('Enter a valid image URL'),
  password: Yup.string().test('pw', 'At least 8 characters', (v) => !v || v.length >= 8),
});

const carSchema = Yup.object({
  name: Yup.string().min(3, 'Name is too short').required('Car name is required'),
  brand: Yup.string().min(2, 'Brand is required').required('Brand is required'),
  logo: Yup.string().url('Enter a valid logo URL'),
  image: Yup.string().url('Enter a valid image URL').required('Car image URL is required'),
  description: Yup.string().min(20, 'At least 20 characters').max(160, 'Max 160 characters').required('Short description is required'),
  category: Yup.string().required(),
  year: Yup.number().typeError('Enter a year').integer().min(1990, 'Year too old').max(new Date().getFullYear() + 1, 'Year too far ahead').required('Year is required'),
  seats: Yup.number().typeError('Enter seats').integer().min(1).max(12).required('Seats required'),
  price: Yup.number().typeError('Enter a price').positive('Must be greater than 0').required('Buy price is required'),
  rentPrice: Yup.number().typeError('Enter a price').positive('Must be greater than 0').required('Rent price is required'),
});

const blankCar = { name: '', brand: '', logo: '', image: '', description: '', category: 'Sedan', year: new Date().getFullYear(), transmission: 'Automatic', fuel: 'Petrol', seats: 5, status: 'New', price: '', rentPrice: '', available: true };

export default function VendorProfile() {
  const { user, cars, orders, updateUser, deleteAccount, addCar, updateCar, deleteCar } = useApp();
  const [tab, setTab] = useState('cars');
  const [editing, setEditing] = useState(null);
  const nav = useNavigate();
  const mine = cars.filter((c) => c.vendorId === user.id);
  const received = orders.filter((o) => o.vendorId === user.id);

  const saveProfile = async (v, { setSubmitting, resetForm }) => {
    await new Promise((r) => setTimeout(r, 500));
    try {
      const { password, ...rest } = v;
      updateUser({ ...rest, ...(password && { password }) });
      toast.success('Profile updated');
      resetForm({ values: { ...v, password: '' } });
    } catch (e) { toast.error(e.message); }
    setSubmitting(false);
  };

  const saveCar = async (v, { setSubmitting, resetForm }) => {
    await new Promise((r) => setTimeout(r, 500));
    const slug = v.brand.toLowerCase().replace(/[^a-z0-9]/g, '');
    const data = { ...v, year: +v.year, seats: +v.seats, price: +v.price, rentPrice: +v.rentPrice, logo: v.logo || `https://cdn.simpleicons.org/${slug}` };
    if (editing) { updateCar(editing.id, data); toast.success('Car updated'); }
    else { addCar(data); toast.success('Car added to the marketplace'); }
    setEditing(null); resetForm({ values: blankCar }); setTab('cars'); setSubmitting(false);
  };

  const remove = (c) => { if (window.confirm(`Delete "${c.name}"?`)) { deleteCar(c.id); toast.info('Car deleted'); } };
  const del = () => { if (!window.confirm('Delete your vendor account and ALL your cars? This cannot be undone.')) return; deleteAccount(); toast.info('Account deleted'); nav('/'); };
  const edit = (c) => { setEditing(c); setTab('form'); window.scrollTo({ top: 0, behavior: 'smooth' }); };

  return (
    <>
      <section className="page-hero"><div className="container"><span className="eyebrow">Vendor dashboard</span><h1 className="title">{user.companyName}</h1><p className="muted">📍 {user.location} · {user.email}</p></div></section>
      <div className="container section">
        <div className="vp-stats">
          {[['Cars listed', mine.length], ['Available', mine.filter((c) => c.available).length], ['Orders received', received.length]].map(([l, n]) => <div key={l}><b>{n}</b><span>{l}</span></div>)}
        </div>
        <div className="tabs">
          {[['cars', `My cars (${mine.length})`], ['form', editing ? 'Edit car' : '+ Add car'], ['orders', 'Orders'], ['profile', 'Profile'], ['danger', 'Delete account']].map(([k, l]) => (
            <button key={k} className={`tab ${tab === k ? 'active' : ''}`} onClick={() => { setTab(k); if (k === 'form' && tab !== 'form') setEditing(null); }}>{l}</button>
          ))}
        </div>

        {tab === 'cars' && (mine.length ? (
          <div className="vp-list">
            {mine.map((c) => (
              <div className="vp-car" key={c.id}>
                <img src={c.image} alt={c.name} onError={(e) => { e.currentTarget.src = FALLBACK_IMG; }} />
                <div className="vp-info"><Link to={`/cars/${c.id}`}><b>{c.name}</b></Link><small className="muted">{c.status} · {c.category} · {c.year}</small><small>{money(c.price)} · {money(c.rentPrice)}/day</small>
                  <label className="tog"><input type="checkbox" checked={c.available} onChange={(e) => { updateCar(c.id, { available: e.target.checked }); toast.info(e.target.checked ? 'Marked available' : 'Marked unavailable'); }} /> {c.available ? 'Available' : 'Unavailable'}</label></div>
                <div className="vp-act"><button className="btn btn-ghost btn-sm" onClick={() => edit(c)}>Edit</button><button className="btn btn-danger btn-sm" onClick={() => remove(c)}>Delete</button></div>
              </div>
            ))}
          </div>
        ) : <div className="card empty"><h3>You have no cars yet</h3><button className="btn btn-red" style={{ marginTop: 14 }} onClick={() => setTab('form')}>Add your first car</button></div>)}

        {tab === 'form' && (
          <div className="card vp-fade">
            <h3 style={{ marginBottom: 16 }}>{editing ? `Edit ${editing.name}` : 'Add a new car'}</h3>
            <Formik key={editing?.id || 'new'} initialValues={editing ? { ...blankCar, ...editing } : blankCar} validationSchema={carSchema} onSubmit={saveCar}>
              {({ isSubmitting }) => (
                <Form noValidate className="form-grid">
                  <Field label="Car name" name="name" placeholder="Toyota Camry XLE" />
                  <Field label="Brand" name="brand" placeholder="Toyota" />
                  <Field label="Car image URL" name="image" full placeholder="https://…" />
                  <Field label="Brand logo URL (optional, auto-filled)" name="logo" full placeholder="https://…" />
                  <Field label="Short description" name="description" as="textarea" rows="3" full />
                  <Field label="Category" name="category" as="select">{CATEGORIES.map((c) => <option key={c}>{c}</option>)}</Field>
                  <Field label="Status" name="status" as="select"><option>New</option><option>Used</option></Field>
                  <Field label="Year" name="year" type="number" />
                  <Field label="Seats" name="seats" type="number" />
                  <Field label="Transmission" name="transmission" as="select"><option>Automatic</option><option>Manual</option></Field>
                  <Field label="Fuel" name="fuel" as="select"><option>Petrol</option><option>Diesel</option><option>Electric</option><option>Hybrid</option></Field>
                  <Field label="Buy price ($)" name="price" type="number" />
                  <Field label="Rent price per day ($)" name="rentPrice" type="number" />
                  <Field label="Available in market" name="available" type="checkbox" />
                  <div className="full vp-btns">
                    <button className="btn btn-red" type="submit" disabled={isSubmitting}>{isSubmitting ? <><span className="spinner" /> Saving…</> : editing ? 'Update car' : 'Add car'}</button>
                    {editing && <button type="button" className="btn btn-ghost" onClick={() => { setEditing(null); setTab('cars'); }}>Cancel</button>}
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        )}

        {tab === 'orders' && (received.length ? received.map((o) => (
          <div className="vp-car" key={o.id}><img src={o.carImage} alt="" onError={(e) => (e.currentTarget.style.visibility = 'hidden')} /><div className="vp-info"><b>{o.carName}</b><small className="muted">{o.mode === 'rent' ? `Rental · ${o.days} day(s)` : 'Purchase'} · {new Date(o.date).toLocaleDateString()}</small></div><b>{money(o.total)}</b></div>
        )) : <div className="card empty"><h3>No orders received yet</h3></div>)}

        {tab === 'profile' && (
          <div className="card vp-fade">
            <Formik enableReinitialize initialValues={{ name: user.name, email: user.email, phone: user.phone || '', companyName: user.companyName || '', location: user.location || '', about: user.about || '', logo: user.logo || '', password: '' }} validationSchema={profileSchema} onSubmit={saveProfile}>
              {({ isSubmitting, dirty }) => (
                <Form noValidate className="form-grid">
                  <Field label="Contact name" name="name" /><Field label="Phone" name="phone" />
                  <Field label="Company name" name="companyName" /><Field label="Location" name="location" />
                  <Field label="Email" name="email" type="email" /><Field label="Company logo URL (optional)" name="logo" />
                  <Field label="About" name="about" as="textarea" rows="3" full />
                  <Field label="New password (leave blank to keep)" name="password" type="password" full autoComplete="new-password" />
                  <button className="btn btn-red" type="submit" disabled={isSubmitting || !dirty}>{isSubmitting ? <><span className="spinner" /> Saving…</> : 'Save changes'}</button>
                </Form>
              )}
            </Formik>
          </div>
        )}

        {tab === 'danger' && <div className="card vp-fade" style={{ borderLeft: '5px solid #b91c1c' }}><h3>Delete vendor account</h3><p className="muted" style={{ margin: '8px 0 18px' }}>This permanently removes your profile and every car you listed.</p><button className="btn btn-danger" onClick={del}>Delete my account</button></div>}
      </div>
    </>
  );
}

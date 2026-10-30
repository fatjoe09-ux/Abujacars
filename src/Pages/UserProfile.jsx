import { useState } from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useApp } from '../context/AppContext';
import Field from '../Components/Field';
import { money } from '../utils/format';
import './UserProfile.css';

const schema = Yup.object({
  name: Yup.string().min(3, 'Name must be at least 3 characters').required('Name is required'),
  email: Yup.string().email('Enter a valid email').required('Email is required'),
  phone: Yup.string().matches(/^[0-9+\s-]{7,15}$/, 'Enter a valid phone number').required('Phone is required'),
  password: Yup.string().test('pw', 'At least 8 characters', (v) => !v || v.length >= 8),
});

export default function UserProfile() {
  const { user, orders, updateUser, deleteAccount, cancelOrder } = useApp();
  const [tab, setTab] = useState('account');
  const nav = useNavigate();
  const mine = orders.filter((o) => o.userId === user.id);

  const save = async (v, { setSubmitting, resetForm }) => {
    await new Promise((r) => setTimeout(r, 500));
    try {
      updateUser({ name: v.name, email: v.email, phone: v.phone, ...(v.password && { password: v.password }) });
      toast.success('Profile updated');
      resetForm({ values: { ...v, password: '' } });
    } catch (e) { toast.error(e.message); }
    setSubmitting(false);
  };
  const del = () => {
    if (!window.confirm('Delete your account permanently? This cannot be undone.')) return;
    deleteAccount(); toast.info('Account deleted'); nav('/');
  };

  return (
    <>
      <section className="page-hero"><div className="container up-head"><div className="avatar">{user.name[0]}</div><div><span className="eyebrow">My account</span><h1 className="title">{user.name}</h1><p className="muted">{user.email}</p></div></div></section>
      <div className="container section">
        <div className="tabs">{[['account', 'Account details'], ['orders', `My orders (${mine.length})`], ['danger', 'Delete account']].map(([k, l]) => <button key={k} className={`tab ${tab === k ? 'active' : ''}`} onClick={() => setTab(k)}>{l}</button>)}</div>

        {tab === 'account' && (
          <div className="card up-fade">
            <Formik enableReinitialize initialValues={{ name: user.name, email: user.email, phone: user.phone || '', password: '' }} validationSchema={schema} onSubmit={save}>
              {({ isSubmitting, dirty }) => (
                <Form noValidate className="form-grid">
                  <Field label="Full name" name="name" /><Field label="Phone" name="phone" />
                  <Field label="Email" name="email" type="email" />
                  <Field label="New password (leave blank to keep)" name="password" type="password" autoComplete="new-password" />
                  <button className="btn btn-red" type="submit" disabled={isSubmitting || !dirty}>{isSubmitting ? <><span className="spinner" /> Saving…</> : 'Save changes'}</button>
                </Form>
              )}
            </Formik>
          </div>
        )}

        {tab === 'orders' && (
          <div className="up-fade">
            {mine.length ? mine.map((o) => (
              <div className="order" key={o.id}>
                <img src={o.carImage} alt="" onError={(e) => (e.currentTarget.style.visibility = 'hidden')} />
                <div className="o-info"><b>{o.carName}</b><small className="muted">{o.mode === 'rent' ? `Rental · ${o.days} day(s) from ${o.startDate}` : 'Purchase'} · {new Date(o.date).toLocaleDateString()}</small><small className="muted">Payment: {o.payment}</small></div>
                <div className="o-end"><b>{money(o.total)}</b><span className="badge st">{o.status}</span>
                  <button className="btn btn-danger btn-sm" onClick={() => { cancelOrder(o.id); toast.info('Order cancelled'); }}>Cancel</button></div>
              </div>
            )) : <div className="card empty"><h3>No orders yet</h3><Link to="/cars" className="btn btn-red" style={{ marginTop: 14 }}>Browse cars</Link></div>}
          </div>
        )}

        {tab === 'danger' && (
          <div className="card up-fade danger"><h3>Delete account</h3><p className="muted" style={{ margin: '8px 0 18px' }}>This permanently removes your profile and all your orders.</p><button className="btn btn-danger" onClick={del}>Delete my account</button></div>
        )}
      </div>
    </>
  );
}

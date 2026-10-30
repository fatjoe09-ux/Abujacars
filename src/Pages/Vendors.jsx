import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import Reveal from '../components/Reveal';
import './Vendors.css';

export default function Vendors() {
  const { vendors, cars } = useApp();
  const [q, setQ] = useState('');
  const list = vendors.filter((v) => `${v.companyName} ${v.location}`.toLowerCase().includes(q.toLowerCase()));
  return (
    <>
      <section className="page-hero"><div className="container"><span className="eyebrow">Our network</span><h1 className="title">Trusted Vendors</h1><p className="muted">{vendors.length} verified vendors ready to serve you.</p></div></section>
      <div className="container section">
        <input className="vsearch" placeholder="🔍 Search vendors or location…" value={q} onChange={(e) => setQ(e.target.value)} />
        {list.length ? (
          <div className="v-grid">
            {list.map((v, i) => {
              const count = cars.filter((c) => c.vendorId === v.id).length;
              return (
                <Reveal key={v.id} delay={(i % 3) * 100}>
                  <div className="vcard">
                    <div className="vlogo">{v.logo ? <img src={v.logo} alt="" onError={(e) => (e.currentTarget.style.display = 'none')} /> : v.companyName[0]}</div>
                    <h3>{v.companyName}</h3>
                    <small className="muted">📍 {v.location}</small>
                    <p>{v.about || 'Trusted DriveHub vendor.'}</p>
                    <div className="vmeta"><span>🚗 {count} car{count !== 1 && 's'}</span><span>📞 {v.phone}</span></div>
                    <Link to={`/cars?vendor=${v.id}`} className="btn btn-dark btn-sm">View cars →</Link>
                  </div>
                </Reveal>
              );
            })}
          </div>
        ) : <div className="empty"><h3>No vendors found</h3></div>}
      </div>
    </>
  );
}

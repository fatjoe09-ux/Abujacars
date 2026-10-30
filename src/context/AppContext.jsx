import { createContext, useContext, useEffect, useState } from 'react';
import { seedUsers, seedCars } from '../data/seed';

const Ctx = createContext(null);
export const useApp = () => useContext(Ctx);
const load = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } };
const uid = () => Math.random().toString(36).slice(2, 10);
const same = (a, b) => a.toLowerCase() === b.toLowerCase();

export function AppProvider({ children }) {
  const [users, setUsers] = useState(() => load('ch_users', seedUsers));
  const [cars, setCars] = useState(() => load('ch_cars', seedCars));
  const [orders, setOrders] = useState(() => load('ch_orders', []));
  const [sessionId, setSessionId] = useState(() => load('ch_session', null));

  useEffect(() => localStorage.setItem('ch_users', JSON.stringify(users)), [users]);
  useEffect(() => localStorage.setItem('ch_cars', JSON.stringify(cars)), [cars]);
  useEffect(() => localStorage.setItem('ch_orders', JSON.stringify(orders)), [orders]);
  useEffect(() => localStorage.setItem('ch_session', JSON.stringify(sessionId)), [sessionId]);

  const user = users.find((u) => u.id === sessionId) || null;
  const vendors = users.filter((u) => u.role === 'vendor');

  const register = (data) => {
    if (users.some((u) => same(u.email, data.email))) throw new Error('This email is already registered');
    const u = { ...data, id: uid() };
    setUsers([...users, u]); setSessionId(u.id); return u;
  };
  const login = ({ email, password }) => {
    const u = users.find((x) => same(x.email, email) && x.password === password);
    if (!u) throw new Error('Invalid email or password');
    setSessionId(u.id); return u;
  };
  const logout = () => setSessionId(null);
  const updateUser = (patch) => {
    if (patch.email && users.some((u) => u.id !== sessionId && same(u.email, patch.email))) throw new Error('That email is used by another account');
    setUsers((us) => us.map((u) => (u.id === sessionId ? { ...u, ...patch } : u)));
  };
  const deleteAccount = () => {
    const id = sessionId;
    setSessionId(null);
    setUsers((us) => us.filter((u) => u.id !== id));
    setCars((cs) => cs.filter((c) => c.vendorId !== id));
    setOrders((os) => os.filter((o) => o.userId !== id && o.vendorId !== id));
  };
  const addCar = (c) => setCars((cs) => [{ ...c, id: uid(), vendorId: sessionId }, ...cs]);
  const updateCar = (id, patch) => setCars((cs) => cs.map((c) => (c.id === id ? { ...c, ...patch } : c)));
  const deleteCar = (id) => setCars((cs) => cs.filter((c) => c.id !== id));
  const placeOrder = (o) => setOrders((os) => [{ ...o, id: uid(), userId: sessionId, date: new Date().toISOString(), status: 'Pending' }, ...os]);
  const cancelOrder = (id) => setOrders((os) => os.filter((o) => o.id !== id));

  return (
    <Ctx.Provider value={{ user, users, vendors, cars, orders, register, login, logout, updateUser, deleteAccount, addCar, updateCar, deleteCar, placeOrder, cancelOrder }}>
      {children}
    </Ctx.Provider>
  );
}

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { api } from '../services/api';
const StoreContext = createContext(null);
const readSessionUser = () => { try { return JSON.parse(localStorage.getItem('dh-user') || 'null'); } catch { return null; } };
export function StoreProvider({ children }) {
  const [cars, setCars] = useState([]);
  const [users, setUsers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [user, setUserState] = useState(readSessionUser);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState('');
  const vendors = users.filter(u => String(u.role || '').toLowerCase() === 'vendor').map(u => ({
    ...u, location: u.location || 'Location not provided', description: u.description || 'DriveHub marketplace vendor',
    initials: u.initials || String(u.name || 'V').split(' ').map(x => x[0]).join('').slice(0, 2).toUpperCase(),
    rating: u.rating ?? 'New', cars: cars.filter(c => String(c.createdBy || '').toLowerCase() === String(u.email || '').toLowerCase() || String(c.vendor || '').toLowerCase() === String(u.name || '').toLowerCase()).length
  }));
  const refresh = useCallback(async () => {
    setLoading(true); setApiError('');
    try {
      const [carData, userData] = await Promise.all([api.get('cars'), api.get('users')]);
      if (!Array.isArray(carData) || !Array.isArray(userData)) throw new Error('Your /cars and /users endpoints must return JSON arrays. Check MockAPI response settings.');
      setCars(carData); setUsers(userData);
    } catch (e) { setApiError(e.message || 'Could not load your MockAPI data.'); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { refresh(); }, [refresh]);
  useEffect(() => { user ? localStorage.setItem('dh-user', JSON.stringify(user)) : localStorage.removeItem('dh-user'); }, [user]);
  const setUser = next => setUserState(next);
  const createCar = async data => { const item = await api.create('cars', data); setCars(prev => [...prev, item]); return item; };
  const updateCar = async (id, data) => { const item = await api.update('cars', id, data); setCars(prev => prev.map(c => String(c.id) === String(id) ? { ...c, ...item } : c)); return item; };
  const deleteCar = async id => { await api.remove('cars', id); setCars(prev => prev.filter(c => String(c.id) !== String(id))); };
  const saveUser = async data => {
    const saved = data.id ? await api.patch('users', data.id, data) : await api.create('users', data);
    setUsers(prev => data.id ? prev.map(u => String(u.id) === String(saved.id) ? { ...u, ...saved } : u) : [...prev, saved]);
    setUser(saved); return saved;
  };
  const deleteUser = async id => { await api.remove('users', id); setUsers(prev => prev.filter(u => String(u.id) !== String(id))); setUser(null); };
  // These three collections are kept in memory only because the supplied API currently has only /cars and /users.
  const createBooking = async data => { const saved = { ...data, id: `local-${Date.now()}` }; data.kind === 'Purchase' ? setPurchases(prev => [...prev, saved]) : setBookings(prev => [...prev, saved]); return saved; };
  const deleteBooking = async (id, kind = 'Rental') => { kind === 'Purchase' ? setPurchases(prev => prev.filter(x => String(x.id) !== String(id))) : setBookings(prev => prev.filter(x => String(x.id) !== String(id))); };
  const createContact = async data => { const saved = { ...data, id: `local-${Date.now()}` }; setContacts(prev => [...prev, saved]); return saved; };
  return <StoreContext.Provider value={{ cars, setCars, vendors, setVendors: () => {}, users, setUsers, bookings, setBookings, purchases, contacts, user, setUser, loading, apiError, refresh, createCar, updateCar, deleteCar, saveUser, deleteUser, createBooking, deleteBooking, createContact }}>{children}</StoreContext.Provider>;
}
export const useStore = () => useContext(StoreContext);

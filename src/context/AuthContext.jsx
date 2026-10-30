import { createContext, useContext, useState } from "react";



const API_URL = "https://6ace7169f338359cf1c383f0.mockapi.io/users";



const SESSION_KEY = "drivehub_session";

const AuthContext = createContext(null);

const readSession = () => {

  try {

    return JSON.parse(localStorage.getItem(SESSION_KEY));

  } catch {

    return null;

  }

};

async function hash(text) {

  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));

  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");

}

const strip = (u) => {

  const { passwordHash, ...safe } = u;

  return safe;

};

async function request(path = "", options = {}) {

  let res;

  try {

    res = await fetch(`${API_URL}${path}`, { ...options, headers: { "Content-Type": "application/json" } });

  } catch {

    throw new Error("Could not reach the server. Please try again.");

  }

  if (!res.ok) {

    const err = new Error(`Request failed (${res.status})`);

    err.status = res.status;

    throw err;

  }

  return res.json();

}


async function findByEmail(email) {

  try {

    const list = await request(`?email=${encodeURIComponent(email)}`);

    return list.filter((u) => u.email === email);

  } catch (err) {

    if (err.status === 404) return [];

    throw err;

  }

}

export function AuthProvider({ children }) {

  const [user, setUser] = useState(readSession);

  const saveSession = (u) => {

    const safe = strip(u);

    localStorage.setItem(SESSION_KEY, JSON.stringify(safe));

    setUser(safe);

  };

  const register = async ({ role, fullName, email, phone, businessName, password }) => {

    const cleanEmail = email.trim().toLowerCase();

    if ((await findByEmail(cleanEmail)).length) throw new Error("An account with this email already exists");

    const created = await request("", {

      method: "POST",

      body: JSON.stringify({

        role,

        fullName: fullName.trim(),

        email: cleanEmail,

        phone: phone.trim(),

        businessName: role === "vendor" ? businessName.trim() : "",

        passwordHash: await hash(password),

        createdAt: new Date().toISOString(),

      }),

    });

    saveSession(created);

  };

  const login = async (email, password) => {

    const found = (await findByEmail(email.trim().toLowerCase()))[0];

    if (!found || found.passwordHash !== (await hash(password))) throw new Error("Incorrect email or password");

    saveSession(found);

  };

  const logout = () => {

    localStorage.removeItem(SESSION_KEY);

    setUser(null);

  };

  const updateAccount = async ({ fullName, email, phone, businessName, newPassword }) => {

    const cleanEmail = email.trim().toLowerCase();

    const clash = (await findByEmail(cleanEmail)).find((u) => String(u.id) !== String(user.id));

    if (clash) throw new Error("That email is already used by another account");

    const current = await request(`/${user.id}`);

    const updated = await request(`/${user.id}`, {

      method: "PUT",

      body: JSON.stringify({

        ...current,

        fullName: fullName.trim(),

        email: cleanEmail,

        phone: phone.trim(),

        businessName: current.role === "vendor" ? businessName.trim() : "",

        passwordHash: newPassword ? await hash(newPassword) : current.passwordHash,

      }),

    });

    saveSession(updated);

  };

  const deleteAccount = async () => {

    await request(`/${user.id}`, { method: "DELETE" });

    logout();

  };

  return (
<AuthContext.Provider value={{ user, register, login, logout, updateAccount, deleteAccount }}>

      {children}
</AuthContext.Provider>

  );

}

export const useAuth = () => useContext(AuthContext);
 
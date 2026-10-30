import { AuthProvider } from "./context/AuthContext";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Marketplace from "./pages/Marketplace";
import "./App.css";
import CarDetails from "./pages/CarDetails";
import Register from "./pages/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import { CarsProvider } from "./context/CarsContext";
import About from "./pages/About";
import Contact  from "./pages/Contact";


export default function App() {

  return (
<BrowserRouter>
<AuthProvider>
    <CarsProvider>
<Navbar />
<main>
<Routes>
<Route path="/" element={<Home />} />
<Route path="marketplace" element={<Marketplace />} />
<Route path="/cars/:id" element={<CarDetails />} />
<Route path="/login" element={<Login />} />
<Route path="/register" element={<Register />} />
<Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
<Route path="/about" element={<About />} />
<Route path="/contact" element={<Contact />} />


         
</Routes>
</main>
<Footer />
<ToastContainer position="top-right" autoClose={3500} />
</CarsProvider>
</AuthProvider>
</BrowserRouter>

  );

}
 
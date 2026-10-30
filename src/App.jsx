import { AuthProvider } from "./context/AuthContext";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "./Components/NavBar";
import Footer from "./Components/Footer";
import Home from "./Pages/Home"
import Marketplace from "./Pages/Marketplace";
import "./App.css";
import CarDetails from "./Pages/CarDetails";
import Register from "./Pages/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import Profile from "./Pages/Profile";
import Login from "./Pages/Login";
import { CarsProvider } from "./context/CarsContext";
import About from "./Pages/About";
import Contact from "./Pages/Contact";


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
 
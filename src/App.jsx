import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Login from "./Components/Admin/Login";
import NotFound from "./Components/Error/NotFound";
import Navbar from "./Components/Navbar/Navbar";
import Dashboard from "./Components/Dashboard/Dashboard";
import Profile from "./Components/Dashboard/Profile";
import Properties from "./Components/Dashboard/Properties";
import Archive from "./Components/Dashboard/Archive";
import ResetPassword from "./Components/Admin/ResetPassword";
import ProtectedRoute from './Components/Dashboard/ProtectedRoute';
import { auth } from './data/firebaseConfig';
import { useAuthState } from 'react-firebase-hooks/auth';

// Composant pour gérer l'affichage conditionnel de la Navbar
function Layout() {
  const location = useLocation();
  const [user, unconnected] = useAuthState(auth);
  const showNavbar = (location.pathname !== "/login" && location.pathname !== "/") && (location.pathname !== "/resetpassword");

  return (
    <>
    
      {(showNavbar && <Navbar />)}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/resetpassword" element={<ResetPassword />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/dashboard" element={<Dashboard />}>
            <Route path="/dashboard/Profile" element={<Profile />} />
            <Route path="/dashboard/properties" element={<Properties />} />
            <Route path="/dashboard/autorisation" element={<Archive />} />
          </Route>
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}

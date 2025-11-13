// import React from 'react'
// import { Outlet } from 'react-router-dom'

// const PrivateRoute = ({allowedRoles}) => {
//   return <Outlet />

// }

// export default PrivateRoute
import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { UserContext } from '../context/userContext';

const PrivateRoute = ({ allowedRoles }) => {
  const { user, loading } = useContext(UserContext);

   console.log("🔐 PrivateRoute check:");
  console.log("User:", user);
  console.log("Loading:", loading);
  console.log("Allowed Roles:", allowedRoles);

  if (loading) {
    // Bisa tampilkan loading spinner atau blank
    return <div>Loading...</div>;
  }

  if (!user) {
    // Kalau gak ada user, redirect ke login
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Role tidak sesuai, redirect juga ke login (atau bisa buat halaman 403)
    return <Navigate to="/login" replace />;
  }

  // Kalau user sudah valid dan role sesuai, render child routes
  return <Outlet />;
};

export default PrivateRoute;

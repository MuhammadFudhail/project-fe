
//kode baru
import React, { useContext } from 'react';
import { UserContext } from '../../context/userContext';
import Navbar from './Navbar';
import SideMenu from './SideMenu';

const DashboardLayout = ({ children, activeMenu }) => {
  const { user, loading } = useContext(UserContext);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>Please login first.</div>; // bisa diganti redirect
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar activeMenu={activeMenu} />

      <div className="flex flex-grow">
        <div className="hidden lg:block">
          <SideMenu activeMenu={activeMenu} />
        </div>

        <main className="flex-grow mx-5">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;


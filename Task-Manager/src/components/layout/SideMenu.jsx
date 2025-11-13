import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../context/userContext';
import { SIDE_MENU_DATA, SIDE_MENU_USER_DATA } from '../../utils/data';
import { FiLogOut, FiMenu } from 'react-icons/fi';

const SideMenu = ({ activeMenu }) => {
  const { user, clearUser } = useContext(UserContext);
  const [sideMenuData, setSideMenuData] = useState([]);
  const [isOpen, setIsOpen] = useState(true);
  const navigate = useNavigate();

  // Fungsi Logout
  const handleLogout = () => {
    localStorage.clear();
    clearUser();
    navigate('/login');
  };

  // Navigasi antar halaman
  const handleClick = (route) => {
    if (route === 'logout') {
      handleLogout();
      return;
    }
    navigate(route);
  };

  // Tentukan menu berdasarkan role
  useEffect(() => {
    if (user) {
      setSideMenuData(user?.role === 'admin' ? SIDE_MENU_DATA : SIDE_MENU_USER_DATA);
    }
  }, [user]);

  return (
    <aside
      className={`${
        isOpen ? 'w-64 ' : 'w-20'
      } bg-gradient-to-b bg-white border-r border-gray-100 shadow-sm h-[calc(100vh-40px)] sticky top-[35px] transition-all duration-300 flex flex-col justify-between z-30`}
    >
      {/* Tombol toggle sidebar */}
      <div className="flex items-center justify-between p-4 ">
        <h2
          className={`font-semibold text-gray-800 text-sm tracking-wide transition-all duration-300 ${
            !isOpen && 'opacity-0'
          }`}
        >
          {/* Navigation */}
        </h2>
        <button
          className="p-2 rounded-md hover:bg-gray-100 transition-colors"
          onClick={() => setIsOpen(!isOpen)}
        >
          <FiMenu className="text-gray-700 text-lg" />
        </button>
      </div>

      {/* Profil Pengguna */}
      <div className="flex flex-col items-center mt-6 mb-4 px-3 text-center">
        <img
          src={user?.profileImageUrl || '/default-profile.png'}
          alt="Profile"
          className="w-20 h-20 rounded-full object-cover border-2 border-red-400 shadow-sm"
        />
        {user?.role === 'admin' && (
          <div className="text-[10px] font-semibold text-white bg-gradient-to-r from-red-500 to-red-400 px-3 py-0.5 rounded mt-2 shadow-sm">
            Admin
          </div>
        )}
        {isOpen && (
          <>
            <h5 className="text-gray-900 font-semibold mt-2">{user?.name || ''}</h5>
            <p className="text-[12px] text-gray-500">{user?.email || ''}</p>
          </>
        )}
      </div>

      {/* Menu Navigasi */}
      <nav className="flex-1 overflow-y-auto px-3">
        {sideMenuData.map((item, index) => (
          <button
            key={`menu_${index}`}
            className={`w-full flex items-center gap-4 text-sm font-medium rounded-xl mb-2 px-4 py-3 transition-all duration-300 ${
              activeMenu === item.label
                ? 'bg-gradient-to-r from-red-500 to-red-400 text-white shadow-md scale-[1.02]'
                : 'text-gray-700 hover:bg-gray-100 hover:text-red-600'
            }`}
            onClick={() => handleClick(item.path)}
          >
            <item.icon
              className={`text-lg min-w-[20px] ${
                activeMenu === item.label ? 'text-white' : 'text-gray-500'
              }`}
            />
            {isOpen && <span className="truncate">{item.label}</span>}
          </button>
        ))}
      </nav>

      {/* Tombol Logout */}
      <div className="p-4 border-t border-gray-100">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-red-500 to-red-400 text-white font-semibold py-2 rounded-xl hover:shadow-md hover:scale-[1.03] transition-all duration-300"
        >
          <FiLogOut className="text-lg" />
          {isOpen && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default SideMenu;

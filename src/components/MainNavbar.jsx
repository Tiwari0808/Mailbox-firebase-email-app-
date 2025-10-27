import { Link, useLocation } from 'react-router-dom';
import { FaMessage } from 'react-icons/fa6';
import { FaBars, FaTimes } from 'react-icons/fa';
import { logout } from '../store/logout';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

const MainNavbar = () => {
  const { isAuth } = useAuth();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { path: '/', label: 'Inbox' },
    { path: '/composeMail', label: 'Send' },
    { path: '/sentMail', label: 'Sent Mails' },
  ];

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <nav className="bg-white shadow-md border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-2 text-blue-600 font-semibold text-xl">
          <FaMessage />
          <span>Mailbox</span>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex gap-6 items-center">
          {isAuth &&
            navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition-colors ${
                  location.pathname === link.path
                    ? 'text-blue-600 border-b-2 border-blue-600 pb-1'
                    : 'text-gray-700 hover:text-blue-500'
                }`}
              >
                {link.label}
              </Link>
            ))}

          <Link
            to="/login"
            onClick={logout}
            className="text-sm font-medium text-red-500 hover:text-red-600 transition"
          >
            {isAuth ? 'Logout' : 'Login'}
          </Link>
        </div>

        {/* Hamburger for mobile */}
        <div className="md:hidden">
          <button onClick={toggleMenu} className="text-xl text-gray-700">
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden px-4 pb-4">
          <div className="flex flex-col gap-3">
            {isAuth &&
              navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={closeMenu}
                  className={`text-sm font-medium ${
                    location.pathname === link.path
                      ? 'text-blue-600 border-b border-blue-600 pb-1'
                      : 'text-gray-700 hover:text-blue-500'
                  }`}
                >
                  {link.label}
                </Link>
              ))}

            <Link
              to="/login"
              onClick={() => {
                logout();
                closeMenu();
              }}
              className="text-sm font-medium text-red-500 hover:text-red-600 transition"
            >
              {isAuth ? 'Logout' : 'Login'}
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default MainNavbar;
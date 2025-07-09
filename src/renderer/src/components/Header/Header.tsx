import { AnimatePresence, motion } from 'framer-motion';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import './Header.css';

import {
  BellRing,
  CircleUserRound,
  LayoutGrid,
  LogOut,
  PackageSearch,
  Settings,
  ShoppingCart,
} from 'lucide-react';

import snehalayaaLogo from '../../assets/logo/icon.png';
import { Tooltip } from 'primereact/tooltip';

const topRoutes = [
  {
    path: '/dashboard',
    name: 'DashBoard',
    icon: <LayoutGrid />,
  },
  {
    path: '/inventory',
    name: 'Inventory',
    icon: <PackageSearch />,
  },
  {
    path: '/pomgmt',
    name: 'Purchsae Order',
    icon: <ShoppingCart />,
  },
  {
    path: '/notifications',
    name: 'Notifications',
    icon: <BellRing />,
  },
];

const bottomRoutes = [
  {
    path: '/settings',
    name: 'Settings',
    icon: <Settings />,
  },
  {
    path: '/profile',
    name: 'Profile',
    icon: <CircleUserRound />,
  },
  {
    path: '#', 
    name: 'Logout',
    icon: <LogOut />,
  },
];

interface HeaderProps {
  children: React.ReactNode;
}

const Header: React.FC<HeaderProps> = ({ children }) => {
  const isOpen = false;
  const location = useLocation();
  const navigate = useNavigate();

  const showAnimation = {
    hidden: {
      width: 0,
      opacity: 0,
      transition: { duration: 0.2 },
    },
    show: {
      width: 'auto',
      opacity: 1,
      transition: { duration: 0.2 },
    },
  };

  const hideSidebarPaths = ['/dfsdf'];

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    localStorage.clear();
    sessionStorage.clear();
    navigate('/login');
  };

  return (
    <div>
      <Tooltip target=".link" />
      <div className="main_container">
        {!hideSidebarPaths.includes(location.pathname) && (
          <>
            <motion.div
              animate={{
                width: isOpen ? '15vw' : '75px',
                transition: { duration: 0.2, type: 'spring', damping: 10 },
              }}
              className="sidebar"
            >
 
              <div className="flex align-items-center justify-content-center">
                <img src={snehalayaaLogo} alt="Logo" className="logo_image" />
              </div>

              <section className="routes">
                {topRoutes.map((route) => (
                  <NavLink
                    to={route.path}
                    key={route.name}
                    className={({ isActive }) => `link ${isActive ? 'active' : ''}`}
                    data-pr-tooltip={!isOpen ? route.name : undefined}
                    data-pr-position="right"
                  >
                    <div className="icon">{route.icon}</div>
                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          className="link_text"
                          variants={showAnimation}
                          initial="hidden"
                          animate="show"
                          exit="hidden"
                        >
                          {route.name}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </NavLink>
                ))}
              </section>

              
              <div className="bottom_section">
                {bottomRoutes.map((route) =>
                  route.name === 'Logout' ? (
                    <NavLink
                      to="#"
                      key={route.name}
                      className="link"
                      onClick={handleLogout}
                      data-pr-tooltip={!isOpen ? route.name : undefined}
                      data-pr-position="right"
                    >
                      <div className="icon">{route.icon}</div>
                      {isOpen && <span className="link_text">{route.name}</span>}
                    </NavLink>
                  ) : (
                    <NavLink
                      to={route.path}
                      key={route.name}
                      className={({ isActive }) => `link ${isActive ? 'active' : ''}`}
                      data-pr-tooltip={!isOpen ? route.name : undefined}
                      data-pr-position="right"
                    >
                      <div className="icon">{route.icon}</div>
                      {isOpen && <span className="link_text">{route.name}</span>}
                    </NavLink>
                  )
                )}
              </div>
            </motion.div>

            <main style={{ width: isOpen ? '85vw' : '97vw', marginLeft: '75px' }}>
              {children}
            </main>
          </>
        )}
        {hideSidebarPaths.includes(location.pathname) && (
          <main style={{ width: '100vw' }}>{children}</main>
        )}
      </div>
    </div>
  );
};

export default Header;

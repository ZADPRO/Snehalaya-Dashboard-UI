import React, { useEffect } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import Header from '@renderer/components/Header/Header';
import Login from '@renderer/pages/00-Login/Login';
import ForgotPassword from '@renderer/pages/00-Login/ForgetPass';
import Dashboard from '@renderer/pages/01-Dashboard/Dashboard';
import Settings from '@renderer/pages/02-Settings/Settings';

const MainRoutes: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const isAuthRoute = location.pathname === '/login' || location.pathname === '/forgetpass';

  const token = localStorage.getItem('token') || sessionStorage.getItem('token');

  useEffect(() => {
    if (!token && !isAuthRoute) {
      navigate('/login', { replace: true });
    }
  }, [location.pathname]);

  return (
    <div>
      {isAuthRoute ? (
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/forgetpass" element={<ForgotPassword />} />
        </Routes>
      ) : (
        <>
          <Header>
            <Routes>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/" element={<Dashboard />} />
            </Routes>
          </Header>
        </>
      )}
    </div>
  );
};

export default MainRoutes;

import React, { useEffect } from 'react'
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom'

import Header from '../components/Header/Header'
import Login from '../pages/00-Login/Login'
import ForgotPassword from '../pages/00-Login/ForgetPass'
import InternetIssue from '../pages/07-Exceptions/InternetIssue'
import InternalServerError from '../pages/07-Exceptions/InternalServerError'
import NotAuthorized from '../pages/07-Exceptions/NotAuthorized'
import NotFound from '../pages/07-Exceptions/NotFound'
import Dashboard from '../pages/01-Dashboard/Dashboard'
import Inventory from '../pages/05-Inventory/Inventory'
import Settings from '../pages/02-Settings/Settings'
import Notifications from '../pages/04-Notifications/Notifications'
import Profile from '../pages/03-Profile/Profile'
import POMgmt from '../pages/06-POMgmt/POMgmt'

const MainRoutes: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()

  const token = localStorage.getItem('token') || sessionStorage.getItem('token')

  const isAuthRoute = ['/login', '/forgetpass'].includes(location.pathname)
  const isExceptionRoute = [
    '/internet-issue',
    '/internal-server-error',
    '/not-authorized',
    '/not-found'
  ].includes(location.pathname)

  // 🔐 Redirect to login if not authenticated AND not on auth/exception routes
  useEffect(() => {
    if (!token && !isAuthRoute && !isExceptionRoute) {
      navigate('/login', { replace: true })
    }
  }, [location.pathname])

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/forgetpass" element={<ForgotPassword />} />

      {/* Exception Routes */}
      <Route path="/internet-issue" element={<InternetIssue />} />
      <Route path="/internal-server-error" element={<InternalServerError />} />
      <Route path="/not-authorized" element={<NotAuthorized />} />
      <Route path="/not-found" element={<NotFound />} />

      {/* Authenticated Routes */}
      <Route
        path="*"
        element={
          <Header>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/inventory" element={<Inventory />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/pomgmt" element={<POMgmt />} />
              <Route path="/internet-issue" element={<InternetIssue />} />
              <Route path="/internal-server-error" element={<InternalServerError />} />
              <Route path="/not-authorized" element={<NotAuthorized />} />
              <Route path="/not-found" element={<NotFound />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Header>
        }
      />
    </Routes>
  )
}

export default MainRoutes

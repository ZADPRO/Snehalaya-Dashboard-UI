import Header from '@renderer/components/Header/Header'
import Login from '@renderer/pages/00-Login/Login'
import Dashboard from '@renderer/pages/01-Dashboard/Dashboard'
import Settings from '@renderer/pages/02-Settings/Settings'
import React from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'

const MainRoutes: React.FC = () => {
  const location = useLocation()
  const isLoginRoute = location.pathname === '/login'

  return (
    <div>
      {isLoginRoute ? (
        <Routes>
          <Route path="/login" element={<Login />} />
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
  )
}

export default MainRoutes

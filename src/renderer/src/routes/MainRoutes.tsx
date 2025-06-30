import Header from '@renderer/components/Header/Header'
import Dashboard from '@renderer/pages/01-Dashboard/Dashboard'
import Settings from '@renderer/pages/02-Settings/Settings'
import React from 'react'
import { Route, Routes } from 'react-router-dom'

const MainRoutes: React.FC = () => {
  return (
    <div>
      <Header>
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/" element={<Dashboard />} />
        </Routes>
      </Header>
    </div>
  )
}

export default MainRoutes

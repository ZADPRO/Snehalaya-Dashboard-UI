import Header from '@renderer/components/Header/Header'
import Dashboard from '@renderer/pages/01-Dashboard/Dashboard'
import React from 'react'
import { Route, Routes } from 'react-router-dom'

const MainRoutes: React.FC = () => {
  return (
    <div>
      <Header>
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </Header>
    </div>
  )
}

export default MainRoutes

import Header from '@renderer/components/Header/Header'
import React from 'react'
import { Route, Routes } from 'react-router-dom'

const MainRoutes: React.FC = () => {
  return (
    <div>
      <Header>
        <Routes>
          <Route />
        </Routes>
      </Header>
    </div>
  )
}

export default MainRoutes

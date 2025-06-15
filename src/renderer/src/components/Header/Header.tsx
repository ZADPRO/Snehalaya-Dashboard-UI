import { AnimatePresence, motion } from 'framer-motion'

import { NavLink, useLocation } from 'react-router-dom'

import './Header.css'
import { CircleUserRound, LayoutGrid, Menu, PackageSearch, Settings } from 'lucide-react'

import { Tooltip } from 'primereact/tooltip'

const routes = [
  {
    path: '/dashboard',
    name: 'DashBoard',
    icon: <LayoutGrid />
  },
  {
    path: '/instock',
    name: 'Inventory',
    icon: <PackageSearch />
  }
]

interface HeaderProps {
  children: React.ReactNode
}

const Header: React.FC<HeaderProps> = ({ children }) => {
  const isOpen = false

  const showAnimation = {
    hidden: {
      width: 0,
      opacity: 0,
      transition: {
        duration: 0.2
      }
    },
    show: {
      width: 'auto',
      opacity: 1,
      transition: {
        duration: 0.2
      }
    }
  }

  const hideSidebarPaths = ['/dfsdf']

  const location = useLocation()

  return (
    <div>
      <Tooltip target=".link" />

      <div className="main_container">
        {!hideSidebarPaths.includes(location.pathname) && (
          <>
            <motion.div
              animate={{
                width: isOpen ? '15vw' : '75px',
                transition: {
                  duration: 0.2,
                  type: 'spring',
                  damping: 10
                }
              }}
              className="sidebar"
            >
              {/* Top: Logo */}
              <div className="">
                <div className="link">
                  {/* <img src="/logo.png" alt="Logo" className="logo_image" /> */}
                  <Menu />
                </div>
              </div>

              {/* Middle: Routes */}
              <section className="routes">
                {routes.map((route) => (
                  <NavLink
                    to={route.path}
                    key={route.name}
                    className="link"
                    onClick={() => {
                      if (route.name === 'Logout') {
                        localStorage.clear()
                      }
                    }}
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

              {/* Bottom: Fixed Icons */}
              <div className="bottom_section">
                <div
                  className="link cursor-pointer"
                  data-pr-tooltip={!isOpen ? 'Settings' : undefined}
                  data-pr-position="right"
                >
                  <Settings />
                  {isOpen && <span className="link_text">Settings</span>}
                </div>

                <div
                  className="link cursor-pointer"
                  data-pr-tooltip={!isOpen ? 'Profile' : undefined}
                  data-pr-position="right"
                >
                  <CircleUserRound />
                  {isOpen && <span className="link_text">Profile</span>}
                </div>
              </div>
            </motion.div>

            <main style={{ width: isOpen ? '85vw' : '97vw', marginLeft: '75px' }}>{children}</main>
          </>
        )}
        {hideSidebarPaths.includes(location.pathname) && (
          <main style={{ width: '100vw' }}>{children}</main>
        )}
      </div>
    </div>
  )
}

export default Header

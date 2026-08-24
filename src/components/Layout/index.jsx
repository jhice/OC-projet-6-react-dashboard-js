import { Outlet } from 'react-router'
import Header from '../Header'

function Layout() {
  return (
    <div className="layout">
      <Header />
      <main className="layout-content">
        <Outlet />
      </main>
    </div>
  )
}

export default Layout

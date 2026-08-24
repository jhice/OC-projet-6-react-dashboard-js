import { Outlet } from 'react-router'
import Header from '../Header'

function Layout() {
  return (
    <>
      <Header />
      <main className="layout-content">
        <Outlet />
      </main>
    </>
  )
}

export default Layout

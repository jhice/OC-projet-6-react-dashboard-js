import { Outlet } from 'react-router'
import Header from '../Header'

function Layout({ removeToken }) {
  return (
    <>
      <Header removeToken={removeToken} />
      <main className="layout-content">
        <Outlet />
      </main>
    </>
  )
}

export default Layout

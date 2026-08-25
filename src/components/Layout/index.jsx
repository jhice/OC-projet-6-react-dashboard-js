import { Outlet } from 'react-router'
import Header from '../Header'

function Layout({ removeToken, token }) {
  return (
    <>
      <Header removeToken={removeToken} token={token} />
      <main className="layout-content">
        <Outlet />
      </main>
    </>
  )
}

export default Layout

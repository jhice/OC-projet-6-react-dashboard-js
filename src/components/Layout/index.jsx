import { Outlet } from 'react-router'
import { useContext } from 'react'
import { LoginContext } from '../../utils/context'
import Header from '../Header'

function Layout() {

  const { token, removeToken } = useContext(LoginContext)
  
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
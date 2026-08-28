import { Outlet } from 'react-router'
import { useContext } from 'react'
import { LoginContext } from '../../utils/context'
import Header from '../Header'
import Footer from '../Footer'

function Layout() {

  const { token, removeToken } = useContext(LoginContext)
  
  return (
    <>
      <Header removeToken={removeToken} token={token} />
      <main className="mx-auto flex w-[1140px] justify-between">
        <Outlet />
      </main>
      <Footer />
    </>
  )
}

export default Layout
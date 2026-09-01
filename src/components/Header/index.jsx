import { NavLink, useNavigate } from 'react-router'
import { useContext } from 'react';
import { LoginContext } from '../../utils/context';

import './header.css'
import logo from "../../assets/images/logo-icon.png"

function Header() {

  const { token, removeToken } = useContext(LoginContext)

  const navigate = useNavigate();

  const handleLogout = () => {
    removeToken();
    navigate('/');
  };

  if (!token) {
    // pas de menu sur la home (Login)
    return
  }

  return (
    <header className="mx-auto flex h-[96px] mb-[104px] w-[1140px] items-start justify-between">
      <a href="#" className="mt-[38px] flex items-center gap-[5px] no-underline">
        <span className="flex h-[24px] items-center gap-[2px]" aria-hidden="true">
          <img src={logo} alt="" />
        </span>
        <span className="text-[27px] font-bold tracking-[-1.2px] text-[#1737ee]">
          SPORTSEE
        </span>
      </a>

      <nav className="mt-[28px] flex h-[50px] w-[500px] items-center justify-center gap-[43px] rounded-full bg-white text-[14px]">
        <NavLink to="/dashboard" className="nav-link text-[#171717] no-underline hover:text-[#1737ee]">Tableau de bord</NavLink>
        <NavLink to="/profile" className="nav-link text-[#171717] no-underline hover:text-[#1737ee]">Profil</NavLink>
        <NavLink to="/404" className="nav-link text-[#171717] no-underline hover:text-[#1737ee]">404</NavLink>
        <span className="h-[18px] w-px bg-[#8e9cff]"></span>
        <a href="" className="text-[#1737ee] no-underline" onClick={handleLogout}>Se déconnecter</a>
      </nav>
    </header>
  )
}

export default Header

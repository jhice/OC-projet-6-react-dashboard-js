import { NavLink, useNavigate } from 'react-router'
import { useContext } from 'react';
import { LoginContext } from '../../utils/context';

import './header.css'

function Header() {

  const { token, removeToken } = useContext(LoginContext)

  const navigate = useNavigate();

  const handleLogout = () => {
    removeToken();
    navigate('/');
  };

  return (
    <header>
      <p>Sportsee</p>
      <nav>
        <ul>
          {token !== null ?
            (<li className="nav-link" onClick={handleLogout}>Déconnexion</li>) :
            (<li><NavLink to="/" className="nav-link">Connexion</NavLink></li>)
          }
          <li><NavLink to="/dashboard" className="nav-link">Tableau de bord</NavLink></li>
          <li><NavLink to="/profile" className="nav-link">Profil</NavLink></li>
          <li><NavLink to="/404" className="nav-link">404</NavLink></li>
        </ul>
        <hr />
      </nav>
    </header>
  )
}

export default Header

import { Link } from 'react-router'
import './header.css'

function Header() {

  return (
    <header>
      <p>Sportsee</p>
      <nav>
        <ul>
          <li><Link to="/" className="nav-link">Connexion</Link></li>
          <li><Link to="/dashboard" className="nav-link">Tableau de bord</Link></li>
          <li><Link to="/profile" className="nav-link">Profil</Link></li>
          <li><Link to="/404" className="nav-link">404</Link></li>
        </ul>
        <hr />
      </nav>
    </header>
  )
}

export default Header

import { Link } from "react-router";

function Error404() {
  return (
    <div className="page">
      <div className="error-container">
        <h1 className="error-title">404</h1>
        <h2>Oups 🙈 Cette page n'existe pas</h2>
        <p>La page que vous cherchez semble introuvable.</p>
        <Link to="/" className="error-link">
          Retour à l'accueil
        </Link>
      </div>
    </div>
  )
}

export default Error404
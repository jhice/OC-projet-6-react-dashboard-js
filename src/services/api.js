// Couche réseau, sans React : utilisable depuis un hook comme depuis un
// gestionnaire d'évènement (Login), un loader de route, un test, etc.

const BASE_URL = "http://localhost:8000";

/**
 * Appel HTTP générique.
 * @param {string} pathOrUrl  "/api/login" ou une URL absolue déjà construite
 * @param {object} [options]
 * @param {string} [options.method]  "GET" par défaut
 * @param {object} [options.body]    sérialisé en JSON si présent
 * @param {string} [options.token]   ajoute l'en-tête Authorization: Bearer
 * @returns {Promise<any>}  le JSON de la réponse
 * @throws {Error}  message exploitable pour l'UI si la requête échoue
 */
export async function request(pathOrUrl, { method = "GET", body, token } = {}) {
  // url relative ou absolue
  const url = pathOrUrl.startsWith("http") ? pathOrUrl : `${BASE_URL}${pathOrUrl}`;
console.log(token);

  const headers = {};
  if (body !== undefined) {
    // entêtes de requête selon si body JSON présent ou non
    headers["Content-Type"] = "application/json";
  }
  if (token) {
    // ajout Bearer si tokep présent
    headers["Authorization"] = `Bearer ${token}`;
  }

  let response;
  try {
    // appel de la requête
    response = await fetch(url, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    // serveur injoignable, coupure réseau, CORS...
    throw new Error("Erreur de connexion au serveur");
  }

  // si réponse !== 2xx
  if (!response.ok) {
    // 404
    if (response.status === 404) {
      throw new Error("Erreur de connexion au serveur");
    }
    // on tente de récupérer un message d'erreur envoyé par l'API
    let message = `Erreur ${response.status}`;
    try {
      // on vérifie si un message JSON existe
      const data = await response.json();
      if (data?.message) {
        message = data.message;
      }
    } catch {
      // pas de corps JSON exploitable, on garde le message par défaut
    }
    throw new Error(message);
  }

  // on retourne la donnée JSON reçue, sous forme d'objet
  return response.json();
}

// Fonctions dédiées par endpoint : le reste de l'app ne manipule plus d'URL.

export function login(credentials) {
  return request("/api/login", { method: "POST", body: credentials });
}

// export function getUserInfo(token) {
//   return request("/api/user-info");
// }

// export function getUserActivity({ startWeek, endWeek, token }) {
//   return request(
//     `/api/user-activity?startWeek=${startWeek}&endWeek=${endWeek}`,
//     { token }
//   );
// }

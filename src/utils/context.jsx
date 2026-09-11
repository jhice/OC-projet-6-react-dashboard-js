import { createContext, useEffect, useState } from "react";
import useToken from "../hooks/useToken";
import { getUserInfo } from "../services/api";

const LoginContext = createContext();

const LoginProvider = ({ children }) => {

    const { token, setToken, removeToken } = useToken();
    const [profile, setProfile] = useState(null);

    // récupère le profil juste après le login (token posé), pour l'exposer
    // à toute l'app sans que chaque composant refasse l'appel /api/user-info
    useEffect(() => {
        if (!token) return;
        let cancelled = false;
        getUserInfo(token)
            .then((data) => {
                if (cancelled) return;
                setProfile(data);
            })
            .catch(() => {
                if (!cancelled) setProfile(null);
            });
        return () => {
            cancelled = true;
        };
    }, [token]);

    // pas de token = déconnecté : on ignore un éventuel profil résiduel en
    // mémoire plutôt que de resynchroniser le state dans l'effet ci-dessus
    return (
        <LoginContext.Provider value={{ token, setToken, removeToken, profile: token ? profile : null }}>
            {children}
        </LoginContext.Provider>
    );
};

export { LoginContext, LoginProvider };
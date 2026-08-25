import { createContext } from "react";
import useToken from "../hooks/useToken";

const LoginContext = createContext()

const LoginProvider = ({ children }) => {

    const { token, setToken, removeToken } = useToken();

    return (
        <LoginContext.Provider value={{ token, setToken, removeToken }}>
            {children}
        </LoginContext.Provider>
    )
}

export { LoginContext, LoginProvider }
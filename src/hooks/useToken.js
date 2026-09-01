import { useState } from "react";

export default function useToken() {

  const getToken = () => {
    const tokenString = localStorage.getItem("token");
    // if (!tokenString) {
    //   return null;
    // }
    const userToken = JSON.parse(tokenString);
    return userToken?.token || null;
  };

  // getToken() gère l'état par défaut
  const [token, setToken] = useState(getToken());

  const saveToken = userToken => {
    localStorage.setItem("token", JSON.stringify(userToken));
    setToken(userToken.token);
    console.log("token saved", userToken.token);
  };

  const removeToken = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  return {
    setToken: saveToken,
    token,
    removeToken,
  };

}
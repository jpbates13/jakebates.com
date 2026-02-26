import React, { useContext, useState, useEffect } from "react";
import {
  login as authServiceLogin,
  logout as authServiceLogout,
  subscribeToAuthChanges,
} from "../services/authService";
const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges((user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  function login(email, password) {
    return authServiceLogin(email, password);
  }

  function logout() {
    return authServiceLogout();
  }

  const value = { currentUser, login, logout };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

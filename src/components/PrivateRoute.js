import React from "react";
import { Navigate } from "react-router";
import { useAuth } from "../contexts/AuthContext";

export default function PrivateRoute({ children, adminOnly }) {
  const { currentUser } = useAuth();

  if (!adminOnly && !currentUser) {
    return <Navigate to="/login" />;
  }

  if (
    adminOnly &&
    (!currentUser || currentUser.email != "jpbates13@gmail.com")
  ) {
    return <Navigate to="/" />;
  }

  return children;
}

import { auth } from "../firebase";

export const login = (email, password) => {
  return auth.signInWithEmailAndPassword(email, password);
};

export const logout = () => {
  return auth.signOut();
};

export const subscribeToAuthChanges = (callback) => {
  return auth.onAuthStateChanged(callback);
};

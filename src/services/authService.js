import { auth } from "../firebase";

export const signup = (email, password, fullName) => {
  return auth
    .createUserWithEmailAndPassword(email, password)
    .then((result) => {
      return result.user.updateProfile({
        displayName: fullName,
      });
    });
};

export const login = (email, password) => {
  return auth.signInWithEmailAndPassword(email, password);
};

export const logout = () => {
  return auth.signOut();
};

export const subscribeToAuthChanges = (callback) => {
  return auth.onAuthStateChanged(callback);
};

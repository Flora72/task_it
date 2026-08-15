import React, { createContext, useContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  updatePassword,
  sendEmailVerification,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth } from "../services/firebase";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const signup = async (email, password, displayName) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    if (displayName) {
      await updateProfile(userCredential.user, { displayName });
    }
    // Automatically send verification email on register
    await sendEmailVerification(userCredential.user);
    return userCredential;
  };

  const login = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const logout = () => {
    return signOut(auth);
  };

  const updateUserDisplayName = (name) => {
    if (!auth.currentUser) return;
    return updateProfile(auth.currentUser, { displayName: name });
  };

  const changeUserPassword = (newPassword) => {
    if (!auth.currentUser) return;
    return updatePassword(auth.currentUser, newPassword);
  };

  const triggerEmailVerification = () => {
    if (!auth.currentUser) return;
    return sendEmailVerification(auth.currentUser);
  };

  const resetPassword = (email) => {
    return sendPasswordResetEmail(auth, email);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        setCurrentUser(user);
        setLoading(false);
      },
      (error) => {
        console.error("Auth state listener error:", error);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    signup,
    login,
    logout,
    updateUserDisplayName,
    changeUserPassword,
    triggerEmailVerification,
    resetPassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {loading ? (
        <div className="min-h-screen bg-[#FBFBF9] dark:bg-zinc-950 flex items-center justify-center flex-col gap-3">
          <div className="w-8 h-8 border-2 border-zinc-800 dark:border-zinc-200 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-zinc-500 text-xs font-mono">Loading app...</p>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};
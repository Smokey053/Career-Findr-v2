import React, { createContext, useState, useContext, useEffect } from "react";
import { useAuth } from "./AuthContext";

const ImpersonationContext = createContext();

export const useImpersonation = () => {
  const context = useContext(ImpersonationContext);
  if (!context) {
    throw new Error(
      "useImpersonation must be used within ImpersonationProvider"
    );
  }
  return context;
};

export const ImpersonationProvider = ({ children }) => {
  const { user } = useAuth();
  const [isImpersonating, setIsImpersonating] = useState(false);
  const [impersonatedUser, setImpersonatedUser] = useState(null);
  const [originalUser, setOriginalUser] = useState(null);

  // Check if there's an active impersonation session on mount
  useEffect(() => {
    const savedImpersonation = sessionStorage.getItem("impersonation");
    if (savedImpersonation) {
      const { impersonatedUser, originalUser } = JSON.parse(savedImpersonation);
      setIsImpersonating(true);
      setImpersonatedUser(impersonatedUser);
      setOriginalUser(originalUser);
    }
  }, []);

  const startImpersonation = (targetUser) => {
    if (user?.role !== "admin") {
      console.error("Only admins can impersonate users");
      return;
    }

    setIsImpersonating(true);
    setImpersonatedUser(targetUser);
    setOriginalUser(user);

    // Save impersonation state to session storage
    sessionStorage.setItem(
      "impersonation",
      JSON.stringify({
        impersonatedUser: targetUser,
        originalUser: user,
      })
    );
  };

  const stopImpersonation = () => {
    setIsImpersonating(false);
    setImpersonatedUser(null);
    setOriginalUser(null);

    // Clear impersonation state from session storage
    sessionStorage.removeItem("impersonation");

    // Reload the page to reset the app state
    window.location.href = "/admin/users";
  };

  const getActiveUser = () => {
    return isImpersonating ? impersonatedUser : user;
  };

  const value = {
    isImpersonating,
    impersonatedUser,
    originalUser,
    startImpersonation,
    stopImpersonation,
    getActiveUser,
  };

  return (
    <ImpersonationContext.Provider value={value}>
      {children}
    </ImpersonationContext.Provider>
  );
};

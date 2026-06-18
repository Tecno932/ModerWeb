import {
  createContext,
  useContext,
} from "react";

import { useMe } from "../hooks/useMe";
import type { AuthUser } from "../types";

//////////////////////////////////////////////////
// TYPES
//////////////////////////////////////////////////

interface AuthContextType {
  user: AuthUser | null;

  loading: boolean;

  isAuthenticated: boolean;

  logout: () => void;
}

//////////////////////////////////////////////////
// CONTEXT
//////////////////////////////////////////////////

const AuthContext =
  createContext<AuthContextType>({
    user: null,

    loading: true,

    isAuthenticated: false,

    logout: () => {},
  });

//////////////////////////////////////////////////
// PROVIDER
//////////////////////////////////////////////////

export function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const token =
    localStorage.getItem("token");

  const {
    data: user,
    isLoading,
  } = useMe(token);

  function logout() {
    localStorage.removeItem(
      "token"
    );

    window.location.href =
      "/login";
  }

  return (
    <AuthContext.Provider
      value={{
        user: user ?? null,

        loading: isLoading,

        isAuthenticated:
          !!user,

        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

//////////////////////////////////////////////////
// HOOK
//////////////////////////////////////////////////

export function useAuth() {
  return useContext(
    AuthContext
  );
}
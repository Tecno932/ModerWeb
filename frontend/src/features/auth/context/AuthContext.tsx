import {
  createContext,
  useContext,
} from "react";

import { useMe } from "../hooks/useMe";
import type { AuthUser } from "../types";
import { logout as logoutApi } from "../api";

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
  const {
    data: user,
    isLoading,
  } = useMe();

  async function logout() {
    try {
      const refreshToken =
        localStorage.getItem(
          "refreshToken"
        );

      if (refreshToken) {
        await logoutApi(
          refreshToken
        );
      }
    } catch (err) {
      console.error(err);
    }

    localStorage.removeItem(
      "token"
    );

    localStorage.removeItem(
      "refreshToken"
    );

    localStorage.removeItem(
      "user"
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
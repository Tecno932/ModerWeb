import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

interface User {
  id: number;

  username?: string;

  avatar?: string;

  email?: string;
}

interface AuthContextType {
  user: User | null;
}

const AuthContext =
  createContext<AuthContextType>({
    user: null,
  });

export function AuthProvider({
  children,
}: any) {
  const [user, setUser] =
    useState<User | null>(
      null
    );

  useEffect(() => {
    const token =
      localStorage.getItem(
        "token"
      );

    if (!token) return;

    try {
      const payload = JSON.parse(
        atob(token.split(".")[1])
      );

      setUser({
        id: payload.userId,

        username:
          payload.username,

        avatar: payload.avatar,

        email: payload.email,
      });
    } catch {
      setUser(null);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{ user }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () =>
  useContext(AuthContext);

export function logout() {
  console.log(
    "👋 Logout manual"
  );

  localStorage.removeItem(
    "token"
  );

  localStorage.removeItem(
    "user"
  );

  window.location.href =
    "/login";
}
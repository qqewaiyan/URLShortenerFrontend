import {
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";
import type { ReactNode } from "react";
import type { User } from "../types";
import { API_URL } from "../lib/constants";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (
    email: string,
    password: string
  ) => Promise<{ error: Error | null }>;
  signUp: (
    email: string,
    password: string
  ) => Promise<{ error: Error | null }>;
  signInWithGoogle: () => void;
  signOut: () => void;
}

const AuthContext = createContext<
  AuthContextType | undefined
>(undefined);


export function AuthProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [user, setUser] = useState<User | null>(
    null
  );
  const checkSession = async () => {
    const token =
      localStorage.getItem("accessToken");
    const userId = localStorage.getItem("userId");
    if (!token || !userId) {
      setLoading(false);
      return;
    }

    try {
      const response =   await fetch(
        `${API_URL}/user/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        localStorage.removeItem(
          "accessToken"
        );

        setUser(null);
        setLoading(false);
        return;
      }

      const data = await response.json();

      setUser(data);
    } catch {
      localStorage.removeItem(
        "accessToken"
      );

      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const [loading, setLoading] =
    useState(true);

 useEffect(() => {
  const checkSession = async () => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/me`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        localStorage.removeItem("accessToken");
        setUser(null);
        return;
      }

      const user = await response.json();

      setUser(user);
    } catch {
      localStorage.removeItem("accessToken");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  checkSession();
}, []);

  

  const signIn = async (
    email: string,
    password: string
  ) => {
    try {
      const response = await fetch(
        `${API_URL}/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      if (!response.ok) {
        return {
          error: new Error(
            "Invalid credentials"
          ),
        };
      }

      const result =
        await response.json();
      console.log(result);
      const userId = result.userId;
      localStorage.setItem(
        "accessToken",
        result.response.atk
      );
      localStorage.setItem("userId", userId);

      await checkSession();

      return { error: null };
    } catch {
      return {
        error: new Error(
          "Login failed"
        ),
      };
    }
  };

  const signUp = async (
    email: string,
    password: string
  ) => {
    try {
      const response = await fetch(
        `${API_URL}/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      if (!response.ok) {
        return {
          error: new Error(
            "Registration failed"
          ),
        };
      }

      return { error: null };
    } catch {
      return {
        error: new Error(
          "Registration failed"
        ),
      };
    }
  };

  const signInWithGoogle = () => {
    window.location.href =
      `${API_URL}/google/login`;
  };

  const signOut = () => {
    localStorage.removeItem(
      "accessToken"
    );

    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signIn,
        signUp,
        signInWithGoogle,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context =
    useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used within an AuthProvider"
    );
  }

  return context;
}
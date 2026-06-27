import {
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";
import type { ReactNode } from "react";
import apiClient from "../api/apiClient";
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

const ACCESS_TOKEN_KEY = "accessToken";
const USER_ID_KEY = "userId";

const authStorage = {
  getToken: () => localStorage.getItem(ACCESS_TOKEN_KEY),
  getUserId: () => localStorage.getItem(USER_ID_KEY),

  setSession: (token: string, userId: string) => {
    localStorage.setItem(ACCESS_TOKEN_KEY, token);
    localStorage.setItem(USER_ID_KEY, userId);
  },

  clear: () => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(USER_ID_KEY);
  },
};

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
      authStorage.getToken();
    const userId = authStorage.getUserId();
    if (!token || !userId) {
      setLoading(false);
      return;
    }

    try {

      const result = await apiClient.get(`${API_URL}/user/${userId}`);
      console.log(result);
      const response = result.data;
      if (result.status !== 200) {
        authStorage.clear();

        setUser(null);
        setLoading(false);
        return;
      }


      setUser(response);
    } catch {
      authStorage.clear();

      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const [loading, setLoading] =
    useState(true);

 useEffect(() => {
  const checkSession = async () => {
    const token =  authStorage.getToken();
   
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
        authStorage.clear();
        setUser(null);
        return;
      }

      const user = await response.json();

      setUser(user);
    } catch {
      authStorage.clear();
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
      const loginResponse = await apiClient.post("/auth/login", {
      email,
      password,
    });
    console.log(loginResponse);
    const response = loginResponse.data;
      if (loginResponse.status !== 200) {
    return {
      error: new Error("Invalid credentials"),
    };
  }

      console.log(response);
      const userId = response.userId;
      authStorage.setSession(response.response.atk, userId);
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
      const registerResult = await apiClient.post("/auth/register", {
      email,
      password,
    });
    const response = registerResult.data;
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
    authStorage.clear();
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
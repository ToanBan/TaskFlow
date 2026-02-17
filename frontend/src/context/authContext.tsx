import { createContext, useContext, useState, useEffect } from "react";
import api from "../lib/axios";
import { setAccessToken } from "./tokenStore";




interface AuthContextType {
  user: any;
  accessToken: string | null;
  login: (email: string, password: string) => Promise<any>;
  logout: () => void;
  getProfile: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [accessToken, setAccessTokenState] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);

  const login = async (email: string, password: string) => {
    const res = await api.post(
      "/api/auth/login",
      { email, password },
      { withCredentials: true },
    );
    console.log(res.data);
    setAccessTokenState(res.data.accessToken);
    setAccessToken(res.data.accessToken);
    return res.data;
  };

  const getProfile = async () => {
    const res = await api.get("/api/profile");
    return res.data; 
  };

  const logout = () => {
    setAccessTokenState(null);
    setAccessToken(null);
    setUser(null);
  };

  useEffect(() => {
    const initAuth = async () => {
      try {
        const res = await api.post("/api/auth/refresh-token");

        const newToken = res.data.accessToken;
        setAccessTokenState(newToken);
        setAccessToken(newToken);

        const profileRes = await getProfile();
        setUser(profileRes.user);
      } catch (err) {
        console.log("ERROR:", err);
        setAccessTokenState(null);
        setAccessToken(null);
        setUser(null);
      }
    };

    initAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, accessToken, login, logout, getProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useUser = () => {
  return useContext(AuthContext)!;
};

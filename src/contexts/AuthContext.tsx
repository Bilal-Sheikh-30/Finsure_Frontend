import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { authApi, twoFactorApi } from "../services/apiClient";

interface User {
  userID: string;
  email: string;
  name: string;
  userType: string;
  createdAt: string;
  avatar: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (
    email: string,
    password: string
  ) => Promise<{ requires2fa: boolean; twoFactorToken?: string }>;
  completeTwoFactorLogin: (data: {
    twoFactorToken: string;
    code?: string;
    backupCode?: string;
  }) => Promise<void>;
  signup: (
    email: string,
    password: string,
    name: string,
    userType: string
  ) => Promise<void>;
  logout: () => void;
  updateUser: (user: User) => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Avatar generator (frontend only).
// Uses DiceBear's `initials` style: a colored circle with the user's initials.
// Gender-neutral, language-neutral, and matches FINSURE's cyan accent.
const generateAvatar = (name: string) => {
  const seed = encodeURIComponent(name || "FINSURE");
  return (
    `https://api.dicebear.com/7.x/initials/svg?seed=${seed}` +
    `&backgroundColor=0ab6ff,14e7ff,0c8fb8` +
    `&textColor=0c111a` +
    `&fontWeight=600`
  );
};

const decodeJwtPayload = (token: string) => {
  try {
    const payload = token.split(".")[1];
    if (!payload) return null;
    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized.padEnd(normalized.length + ((4 - (normalized.length % 4)) % 4), "=");
    const decoded = atob(padded);
    return JSON.parse(decoded) as { exp?: number };
  } catch {
    return null;
  }
};

const isTokenExpired = (token: string) => {
  const payload = decodeJwtPayload(token);
  if (!payload || typeof payload.exp !== "number") return true;
  return Date.now() >= payload.exp * 1000;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user on refresh
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const savedUser = localStorage.getItem("user");

    if (token && savedUser) {
      if (isTokenExpired(token)) {
        localStorage.removeItem("authToken");
        localStorage.removeItem("user");
        setUser(null);
        setIsLoading(false);
        return;
      }
      const parsed = JSON.parse(savedUser) as User;
      // Always regenerate the avatar from the current generator so existing
      // sessions pick up style changes (e.g. initials swap) without re-login.
      const refreshed: User = { ...parsed, avatar: generateAvatar(parsed.name) };
      localStorage.setItem("user", JSON.stringify(refreshed));
      setUser(refreshed);
    }
    setIsLoading(false);
  }, []);

  const applyAuthSession = (res: any) => {
    const userWithAvatar: User = {
      ...res.user,
      avatar: generateAvatar(res.user.name),
    };

    localStorage.setItem("authToken", res.access_token);
    localStorage.setItem("user", JSON.stringify(userWithAvatar));
    setUser(userWithAvatar);
  };

  const login = async (email: string, password: string) => {
    const res = await authApi.login({ email, password });

    if (res.requires_2fa) {
      return { requires2fa: true, twoFactorToken: res.two_factor_token };
    }

    applyAuthSession(res);
    return { requires2fa: false };
  };

  const completeTwoFactorLogin = async (data: {
    twoFactorToken: string;
    code?: string;
    backupCode?: string;
  }) => {
    const res = await twoFactorApi.verifyLogin({
      twoFactorToken: data.twoFactorToken,
      code: data.code,
      backup_code: data.backupCode,
    });
    applyAuthSession(res);
  };

  const signup = async (
    email: string,
    password: string,
    name: string,
    userType: string
  ) => {
    const res = await authApi.signup({
      email,
      password,
      name,
      userType,
    });

    applyAuthSession(res);
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    setUser(null);
  };

  useEffect(() => {
    const handleForcedLogout = () => logout();
    window.addEventListener("finsure:auth-logout", handleForcedLogout);
    return () => window.removeEventListener("finsure:auth-logout", handleForcedLogout);
  }, []);

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        completeTwoFactorLogin,
        signup,
        logout,
        updateUser,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

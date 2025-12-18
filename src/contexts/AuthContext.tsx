import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { authApi } from "../services/apiClient";

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
  login: (email: string, password: string) => Promise<void>;
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

// Avatar generator (frontend only)
const generateAvatar = (name: string) =>
  `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`;

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
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const res = await authApi.login({ email, password });

    const userWithAvatar: User = {
      ...res.user,
      avatar: generateAvatar(res.user.name),
    };

    localStorage.setItem("authToken", res.access_token);
    localStorage.setItem("user", JSON.stringify(userWithAvatar));
    setUser(userWithAvatar);
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

    const userWithAvatar: User = {
      ...res.user,
      avatar: generateAvatar(res.user.name),
    };

    localStorage.setItem("authToken", res.access_token);
    localStorage.setItem("user", JSON.stringify(userWithAvatar));
    setUser(userWithAvatar);
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    setUser(null);
  };

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

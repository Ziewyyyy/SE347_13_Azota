import {
  createContext,
  useContext,
  useState,
} from "react";

import {
  loginApi,
  logoutApi,
} from "../services/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = sessionStorage.getItem("azota_user");
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const login = async (identifier, password) => {
    const loggedInUser = await loginApi(identifier, password);

    sessionStorage.setItem(
      "azota_user",
      JSON.stringify(loggedInUser)
    );

    setUser(loggedInUser);
    return loggedInUser;
  };

  const logout = async () => {
    try {
      await logoutApi();
    } finally {
      sessionStorage.removeItem("azota_user");
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth phải nằm trong AuthProvider");
  }

  return context;
}
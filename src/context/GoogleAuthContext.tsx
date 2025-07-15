// context/GoogleAuthContext.tsx
import { GoogleOAuthProvider, googleLogout, useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import React, { createContext, useContext, useEffect, useState } from 'react';

interface User {
  email: string;
  name: string;
  picture?: string;
}

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const GoogleAuthProvider = ({ children }: { children: React.ReactNode }) => {
    console.log("GoogleAuthProvider is rendering");
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
        console.log("I am triggered")
      try {
        const userInfo = await axios.get(
          'https://www.googleapis.com/oauth2/v3/userinfo',
          { headers: { Authorization: `Bearer ${tokenResponse.access_token}` } }
        );
        
        const userData = {
          email: userInfo.data.email,
          name: userInfo.data.name,
          picture: userInfo.data.picture
        };
        console.log("user email is" +userData.email);
        setUser(userData);
        localStorage.setItem("authUser", JSON.stringify(userData));

        setIsAdmin(userData.email === import.meta.env.VITE_ADMIN_EMAIL);
        localStorage.setItem("isAdmin", JSON.stringify(userData.email === import.meta.env.VITE_ADMIN_EMAIL));

      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    },
    onError: (error) => console.log('Login Failed:', error)
  });

  useEffect(() => {
  const storedUser = localStorage.getItem("authUser");
  const storedAdmin = localStorage.getItem("isAdmin");

  if (storedUser) {
    setUser(JSON.parse(storedUser));
  }

  if (storedAdmin) {
    setIsAdmin(JSON.parse(storedAdmin));
  }
}, []);

  const logout = () => {
    googleLogout();
    setUser(null);
    setIsAdmin(false);
    localStorage.removeItem("authUser");
  localStorage.removeItem("isAdmin");
  };

  return (
    <AuthContext.Provider value={{ user, isAdmin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const GoogleAuthWrapper = ({ children }: { children: React.ReactNode }) => {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  console.log("Client ID:", clientId); // In GoogleAuthWrapper
console.log("Admin email:", import.meta.env.VITE_ADMIN_EMAIL); // In login function
  if (!clientId) {
    console.error("Google OAuth client ID is missing. Please set VITE_GOOGLE_CLIENT_ID in your .env file");
    return <>{children}</>; // Render children without Google Auth
  }

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <GoogleAuthProvider>
        {children}
      </GoogleAuthProvider>
    </GoogleOAuthProvider>
  );
};
export const useGoogleAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useGoogleAuth must be used within a GoogleAuthProvider');
  }
  return context;
};
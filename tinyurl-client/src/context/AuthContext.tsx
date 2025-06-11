import React, { createContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';

// 1. Define the User interface based on your Mongoose model
export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  links?: string[];
  passwordChangedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

// 2. Define the AuthContext type
type AuthContextType = {
  user: User | null;
  token: string | null;
  login: (token: string, user: User) => void;
  logout: () => void;
};

// 3. Create the context with default values
export const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  login: () => {},
  logout: () => {},
});

// 4. Define the response type for /api/users/me
type UserMeResponse = {
  data: {
    user: User;
  };
};

// 5. AuthProvider implementation
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));

  useEffect(() => {
    if (token && !user) {
      axios
        .get<UserMeResponse>('http://localhost:3000/api/users/me', {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setUser(res.data.data.user))
        .catch(() => {
          setToken(null);
          localStorage.removeItem('token');
        });
    }
  }, [token, user]);

  const login = (newToken: string, newUser: User) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem('token', newToken);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
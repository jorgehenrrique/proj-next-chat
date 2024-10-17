'use client';

import React, { createContext, useState, useContext, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

interface User {
  id: string;
  name: string;
  color?: string;
}
interface UserContextType {
  user: User | null;
  updateUser: (newUsername: string) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('chatUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const updateUser = (newUsername: string) => {
    const updatedUser = user
      ? { ...user, name: newUsername }
      : { id: uuidv4(), name: newUsername };
    setUser(updatedUser);
    localStorage.setItem('chatUser', JSON.stringify(updatedUser));
  };

  return (
    <UserContext.Provider value={{ user, updateUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}

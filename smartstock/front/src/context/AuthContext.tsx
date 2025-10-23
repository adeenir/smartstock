import React, {createContext, useContext, useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type User = any;

type AuthContextData = {
  user: User | null;
  setUser: (u: User | null) => void;
  loading: boolean;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextData | undefined>(undefined);

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const json = await AsyncStorage.getItem('usuario');
        if (json) {
          setUser(JSON.parse(json));
        }
      } catch (err) {
        console.warn('AuthProvider: failed loading user', err);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const signOut = async () => {
    setUser(null);
    try {
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('usuario');
    } catch (err) {
      console.warn('AuthProvider: failed to clear storage', err);
    }
  };

  return (
    <AuthContext.Provider value={{user, setUser, loading, signOut}}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}

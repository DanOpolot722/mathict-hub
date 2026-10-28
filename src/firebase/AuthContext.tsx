import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User, 
  auth, 
  googleProvider, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged,
  testFirestoreConnection
} from './config';

interface AuthContextType {
  currentUser: User | null;
  isAdmin: boolean;
  isLoading: boolean;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  firestoreConnected: boolean;
}

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  isAdmin: false,
  isLoading: true,
  loginWithGoogle: async () => {},
  logout: async () => {},
  firestoreConnected: false,
});

// EXCLUSIVE ADMIN: No other person or email can access admin panel
export const PRIMARY_ADMIN_EMAIL = 'trdanopolot@gmail.com';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [firestoreConnected, setFirestoreConnected] = useState(false);

  useEffect(() => {
    testFirestoreConnection().then(setFirestoreConnected);

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      // Security Enforcement: If someone logs in with any email other than trdanopolot@gmail.com,
      // they are IMMEDIATELY signed out and denied access.
      if (user && user.email) {
        if (user.email.toLowerCase() !== PRIMARY_ADMIN_EMAIL.toLowerCase()) {
          console.warn('Unauthorized login attempt detected. Forcing sign-out:', user.email);
          await signOut(auth);
          setCurrentUser(null);
          setIsLoading(false);
          return;
        }
      }
      setCurrentUser(user);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const isAdmin = Boolean(
    currentUser &&
    currentUser.email &&
    currentUser.email.toLowerCase() === PRIMARY_ADMIN_EMAIL.toLowerCase()
  );

  const loginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      if (result.user.email?.toLowerCase() !== PRIMARY_ADMIN_EMAIL.toLowerCase()) {
        await signOut(auth);
        throw new Error('UNAUTHORIZED_ACCOUNT');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAdmin,
        isLoading,
        loginWithGoogle,
        logout,
        firestoreConnected,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

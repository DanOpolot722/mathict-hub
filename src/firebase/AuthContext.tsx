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
  isPasscodeAuthenticated: boolean;
  loginWithGoogle: () => Promise<void>;
  loginWithPasscode: (pass: string) => boolean;
  logout: () => Promise<void>;
  firestoreConnected: boolean;
}

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  isAdmin: false,
  isLoading: true,
  isPasscodeAuthenticated: false,
  loginWithGoogle: async () => {},
  loginWithPasscode: () => false,
  logout: async () => {},
  firestoreConnected: false,
});

// EXCLUSIVE ADMIN: No other person or email can access admin panel
export const PRIMARY_ADMIN_EMAIL = 'trdanopolot@gmail.com';

// Valid master teacher passcodes for fallback access
export const VALID_TEACHER_PASSCODES = ['15000314', 'opolot2026', 'danopolot'];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPasscodeAuthenticated, setIsPasscodeAuthenticated] = useState(false);
  const [firestoreConnected, setFirestoreConnected] = useState(false);

  useEffect(() => {
    testFirestoreConnection().then(setFirestoreConnected);

    // Check existing passcode session
    const savedPass = sessionStorage.getItem('mathict_admin_passcode');
    if (savedPass && VALID_TEACHER_PASSCODES.includes(savedPass)) {
      setIsPasscodeAuthenticated(true);
    }

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

  const isGoogleAdmin = Boolean(
    currentUser &&
    currentUser.email &&
    currentUser.email.toLowerCase() === PRIMARY_ADMIN_EMAIL.toLowerCase()
  );

  const isAdmin = isGoogleAdmin || isPasscodeAuthenticated;

  const loginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      if (result.user.email?.toLowerCase() !== PRIMARY_ADMIN_EMAIL.toLowerCase()) {
        await signOut(auth);
        throw new Error('UNAUTHORIZED_ACCOUNT');
      }
    } catch (error) {
      console.error('Google login error:', error);
      throw error;
    }
  };

  const loginWithPasscode = (pass: string): boolean => {
    if (VALID_TEACHER_PASSCODES.includes(pass.trim())) {
      sessionStorage.setItem('mathict_admin_passcode', pass.trim());
      setIsPasscodeAuthenticated(true);
      return true;
    }
    return false;
  };

  const logout = async () => {
    try {
      sessionStorage.removeItem('mathict_admin_passcode');
      setIsPasscodeAuthenticated(false);
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
        isPasscodeAuthenticated,
        loginWithGoogle,
        loginWithPasscode,
        logout,
        firestoreConnected,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

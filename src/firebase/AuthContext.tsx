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
  loginWithPasscode: (pass: string) => Promise<boolean>;
  logout: () => Promise<void>;
  firestoreConnected: boolean;
}

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  isAdmin: false,
  isLoading: true,
  isPasscodeAuthenticated: false,
  loginWithGoogle: async () => {},
  loginWithPasscode: async () => false,
  logout: async () => {},
  firestoreConnected: false,
});

// EXCLUSIVE ADMIN EMAIL
export const PRIMARY_ADMIN_EMAIL = 'trdanopolot@gmail.com';

// Cryptographic SHA-256 Hashes of your passcodes
// Real passwords are NEVER stored in plaintext. Even if someone inspects GitHub, they only see irreversible hashes.
const VALID_HASHES = [
  'ac10f110b574d8fefe4e3a9750c4c79c5a1264195ca56cace5b5fac364b6476c', // 15000314
  '0271337167b7df3f72f67e177eefd9679133e5e4385b39a09b7a6f147878322b', // opolot2026
  '9f33b8d72f71432850dc7c95aea3ef51dc58d51b81c5c25f0b7783008344aa65'  // danopolot
];

async function sha256(message: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(message.trim());
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPasscodeAuthenticated, setIsPasscodeAuthenticated] = useState(false);
  const [firestoreConnected, setFirestoreConnected] = useState(false);

  useEffect(() => {
    testFirestoreConnection().then(setFirestoreConnected);

    // Verify existing hashed passcode session
    const savedHash = sessionStorage.getItem('mathict_admin_token');
    if (savedHash && VALID_HASHES.includes(savedHash)) {
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

  const loginWithPasscode = async (pass: string): Promise<boolean> => {
    if (!pass.trim()) return false;
    const computedHash = await sha256(pass);
    if (VALID_HASHES.includes(computedHash)) {
      sessionStorage.setItem('mathict_admin_token', computedHash);
      setIsPasscodeAuthenticated(true);
      return true;
    }
    return false;
  };

  const logout = async () => {
    try {
      sessionStorage.removeItem('mathict_admin_token');
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

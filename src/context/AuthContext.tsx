import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  signInWithPopup, 
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import type { User } from 'firebase/auth';
import { auth, googleProvider } from '../lib/firebase';
import { saveUserToDB, getUserRole, logActivity } from '../lib/firestore';
import type { UserRole } from '../lib/firestore';

interface AuthContextType {
  currentUser: User | null;
  userRole: UserRole;
  loading: boolean;
  login: (email: string, pass: string) => Promise<any>;
  register: (name: string, email: string, pass: string) => Promise<any>;
  logout: () => Promise<void>;
  googleSignIn: () => Promise<any>;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<UserRole>('user');
  const [loading, setLoading] = useState(true);

  const login = async (email: string, pass: string) => {
    const cred = await signInWithEmailAndPassword(auth, email, pass);
    logActivity(cred.user.uid, 'login', { method: 'email' }).catch(() => {});
    return cred;
  };

  const register = async (name: string, email: string, pass: string) => {
    const cred = await createUserWithEmailAndPassword(auth, email, pass);
    if (cred.user) {
      await updateProfile(cred.user, { displayName: name });
    }
    logActivity(cred.user.uid, 'register', { method: 'email' }).catch(() => {});
    return cred;
  };

  const logout = async () => {
    if (currentUser) {
      logActivity(currentUser.uid, 'logout').catch(() => {});
    }
    setUserRole('user');
    return signOut(auth);
  };

  const googleSignIn = async () => {
    const cred = await signInWithPopup(auth, googleProvider);
    logActivity(cred.user.uid, 'login', { method: 'google' }).catch(() => {});
    return cred;
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        setCurrentUser(user);
        if (user) {
          try {
            await saveUserToDB(user);
            const role = await getUserRole(user.uid);
            setUserRole(role);
          } catch (err) {
            console.error('Error fetching user data:', err);
            setUserRole('user'); // Default to user on error
          }
        } else {
          setUserRole('user');
        }
      } catch (err) {
        console.error('Auth state error:', err);
      } finally {
        setLoading(false); // ALWAYS set loading false
      }
    });
    return unsubscribe;
  }, []);

  const value: AuthContextType = {
    currentUser,
    userRole,
    loading,
    login,
    register,
    logout,
    googleSignIn,
    isAdmin: userRole === 'admin',
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

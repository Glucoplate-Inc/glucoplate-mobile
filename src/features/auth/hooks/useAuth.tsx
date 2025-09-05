import React, {createContext, useContext, useEffect, useState} from 'react';
import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import useAppStore from '../../../stores/useAppStore';
import apiClient from '../../../core/api/client';

interface AuthContextType {
  user: FirebaseAuthTypes.User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInWithApple: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({children}: {children: React.ReactNode}) {
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const {setUser: setAppUser, logout} = useAppStore();

  useEffect(() => {
    // Listen to auth state changes
    const unsubscribe = auth().onAuthStateChanged(async (firebaseUser) => {
      setUser(firebaseUser);
      
      if (firebaseUser) {
        // Sync with backend
        try {
          const idToken = await firebaseUser.getIdToken();
          apiClient.setAuthToken(idToken);
          
          // Sync user with backend
          const response = await apiClient.post('/auth/sync-user', {
            firebaseUid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            photoURL: firebaseUser.photoURL,
          });
          
          setAppUser({
            id: firebaseUser.uid,
            email: firebaseUser.email!,
            name: firebaseUser.displayName || 'User',
            photoUrl: firebaseUser.photoURL || undefined,
          });
          
          // Store user data in Firestore for offline access
          await firestore()
            .collection('users')
            .doc(firebaseUser.uid)
            .set({
              email: firebaseUser.email,
              displayName: firebaseUser.displayName,
              photoURL: firebaseUser.photoURL,
              lastLogin: firestore.FieldValue.serverTimestamp(),
            }, {merge: true});
        } catch (error) {
          console.error('Error syncing user:', error);
        }
      } else {
        logout();
        apiClient.setAuthToken(null);
      }
      
      setIsLoading(false);
    });

    return unsubscribe;
  }, [setAppUser, logout]);

  const signIn = async (email: string, password: string) => {
    try {
      await auth().signInWithEmailAndPassword(email, password);
    } catch (error: any) {
      throw new Error(getAuthErrorMessage(error.code));
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    try {
      const {user} = await auth().createUserWithEmailAndPassword(email, password);
      
      // Update display name
      await user.updateProfile({
        displayName: name,
      });
      
      // Create user document in Firestore
      await firestore()
        .collection('users')
        .doc(user.uid)
        .set({
          email,
          displayName: name,
          createdAt: firestore.FieldValue.serverTimestamp(),
        });
    } catch (error: any) {
      throw new Error(getAuthErrorMessage(error.code));
    }
  };

  const signOut = async () => {
    try {
      await auth().signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      await auth().sendPasswordResetEmail(email);
    } catch (error: any) {
      throw new Error(getAuthErrorMessage(error.code));
    }
  };

  const signInWithGoogle = async () => {
    // TODO: Implement Google Sign-In
    // Requires @react-native-google-signin/google-signin
    throw new Error('Google Sign-In not implemented yet');
  };

  const signInWithApple = async () => {
    // TODO: Implement Apple Sign-In
    // Requires @invertase/react-native-apple-authentication
    throw new Error('Apple Sign-In not implemented yet');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        signIn,
        signUp,
        signOut,
        resetPassword,
        signInWithGoogle,
        signInWithApple,
      }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

function getAuthErrorMessage(code: string): string {
  switch (code) {
    case 'auth/invalid-email':
      return 'Invalid email address';
    case 'auth/user-disabled':
      return 'This account has been disabled';
    case 'auth/user-not-found':
      return 'No account found with this email';
    case 'auth/wrong-password':
      return 'Incorrect password';
    case 'auth/email-already-in-use':
      return 'An account already exists with this email';
    case 'auth/weak-password':
      return 'Password should be at least 6 characters';
    case 'auth/network-request-failed':
      return 'Network error. Please check your connection';
    default:
      return 'An error occurred. Please try again';
  }
}
import {create} from 'zustand';
import {immer} from 'zustand/middleware/immer';
import {devtools} from 'zustand/middleware';
import {MMKV} from 'react-native-mmkv';

// Initialize MMKV storage
const storage = new MMKV();

interface User {
  id: string;
  email: string;
  name: string;
  photoUrl?: string;
  preferences?: UserPreferences;
}

interface UserPreferences {
  units: 'metric' | 'imperial';
  darkMode: boolean;
  calorieTarget: number;
  proteinTarget: number;
  carbsTarget: number;
  fatTarget: number;
}

interface AppState {
  // User
  user: User | null;
  isAuthenticated: boolean;
  
  // UI
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setUser: (user: User | null) => void;
  updatePreferences: (preferences: Partial<UserPreferences>) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  logout: () => void;
  
  // Persistence
  hydrate: () => void;
}

const useAppStore = create<AppState>()(
  devtools(
    immer((set) => ({
      // Initial state
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      
      // Actions
      setUser: (user) =>
        set((state) => {
          state.user = user;
          state.isAuthenticated = !!user;
          if (user) {
            storage.set('user', JSON.stringify(user));
          } else {
            storage.delete('user');
          }
        }),
        
      updatePreferences: (preferences) =>
        set((state) => {
          if (state.user) {
            state.user.preferences = {
              ...state.user.preferences,
              ...preferences,
            } as UserPreferences;
            storage.set('user', JSON.stringify(state.user));
          }
        }),
        
      setLoading: (isLoading) =>
        set((state) => {
          state.isLoading = isLoading;
        }),
        
      setError: (error) =>
        set((state) => {
          state.error = error;
        }),
        
      logout: () =>
        set((state) => {
          state.user = null;
          state.isAuthenticated = false;
          storage.delete('user');
        }),
        
      hydrate: () =>
        set((state) => {
          const userStr = storage.getString('user');
          if (userStr) {
            try {
              const user = JSON.parse(userStr);
              state.user = user;
              state.isAuthenticated = true;
            } catch (e) {
              console.error('Failed to hydrate user:', e);
            }
          }
        }),
    })),
    {
      name: 'app-store',
    },
  ),
);

export default useAppStore;
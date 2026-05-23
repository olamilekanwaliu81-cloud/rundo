import { create } from 'zustand';
import { User, Errand, UserRole } from '../types';

interface AppState {
  user: User | null;
  role: UserRole;
  activeErrand: Errand | null;
  errands: Errand[];
  isLoading: boolean;

  setUser: (user: User | null) => void;
  setRole: (role: UserRole) => void;
  setActiveErrand: (errand: Errand | null) => void;
  addErrand: (errand: Errand) => void;
  updateErrand: (id: string, updates: Partial<Errand>) => void;
  setLoading: (loading: boolean) => void;
}

// Mock data for demonstration
const mockErrands: Errand[] = [
  {
    id: '1',
    senderId: 'user1',
    runnerId: 'runner1',
    title: 'Pick up documents from GTBank Ikeja',
    description: 'Collect signed contract documents from GTBank Ikeja branch, bring to Lekki Phase 1.',
    pickupLocation: { address: 'GTBank Ikeja, Lagos', latitude: 6.6018, longitude: 3.3515 },
    dropoffLocation: { address: 'Lekki Phase 1, Lagos', latitude: 6.4698, longitude: 3.5852 },
    itemValue: 15000,
    price: 3500,
    status: 'confirmed',
    createdAt: new Date(Date.now() - 86400000),
    completedAt: new Date(Date.now() - 82800000),
  },
  {
    id: '2',
    senderId: 'user1',
    title: 'Buy groceries from Shoprite Ikeja',
    description: 'Buy the items on the attached list from Shoprite Ikeja City Mall.',
    pickupLocation: { address: 'Shoprite Ikeja City Mall, Lagos', latitude: 6.6055, longitude: 3.3481 },
    dropoffLocation: { address: 'Allen Avenue, Ikeja', latitude: 6.6050, longitude: 3.3490 },
    itemValue: 25000,
    price: 2800,
    status: 'pending',
    createdAt: new Date(),
  },
];

export const useStore = create<AppState>((set) => ({
  user: null,
  role: null,
  activeErrand: null,
  errands: mockErrands,
  isLoading: false,

  setUser: (user) => set({ user }),
  setRole: (role) => set({ role }),
  setActiveErrand: (errand) => set({ activeErrand: errand }),
  addErrand: (errand) => set((state) => ({ errands: [errand, ...state.errands] })),
  updateErrand: (id, updates) =>
    set((state) => ({
      errands: state.errands.map((e) => (e.id === id ? { ...e, ...updates } : e)),
      activeErrand:
        state.activeErrand?.id === id
          ? { ...state.activeErrand, ...updates }
          : state.activeErrand,
    })),
  setLoading: (isLoading) => set({ isLoading }),
}));

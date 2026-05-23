export type UserRole = 'sender' | 'runner' | null;

export type RunnerLevel = 1 | 2 | 3;

export type ErrandStatus =
  | 'pending'
  | 'matched'
  | 'in_progress'
  | 'delivered'
  | 'confirmed'
  | 'disputed'
  | 'cancelled';

export interface User {
  id: string;
  name: string;
  phone: string;
  role: UserRole;
  avatar?: string;
  rating: number;
  totalJobs: number;
  isVerified: boolean;
}

export interface Runner extends User {
  level: RunnerLevel;
  earnings: number;
  badges: string[];
  nin: string;
  bvn?: string;
}

export interface Location {
  address: string;
  latitude: number;
  longitude: number;
}

export interface Errand {
  id: string;
  senderId: string;
  runnerId?: string;
  title: string;
  description: string;
  pickupLocation: Location;
  dropoffLocation: Location;
  itemValue: number;
  price: number;
  status: ErrandStatus;
  pickupPhoto?: string;
  dropoffPhoto?: string;
  createdAt: Date;
  acceptedAt?: Date;
  completedAt?: Date;
}

export interface EarningsSummary {
  today: number;
  week: number;
  month: number;
  total: number;
  pendingPayout: number;
}

export type RootStackParamList = {
  Welcome: undefined;
  Login: undefined;
  RoleSelect: undefined;
  SenderTabs: undefined;
  RunnerTabs: undefined;
  ErrandForm: undefined;
  Tracking: { errandId: string };
  ErrandDetail: { errand: Errand };
  ActiveErrand: { errand: Errand };
  RateRunner: { errandId: string };
};

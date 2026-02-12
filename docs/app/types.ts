
export type UserRole = 'LENDER' | 'BORROWER';

export interface User {
  id: string;
  name: string;
  email: string;
  isVerified: boolean;
  avatar: string;
}

export type PricingSchedules = {
  hourly?: number;
  daily?: number;
  monthly?: number;
};

export interface Listing {
  id: string;
  ownerId: string;
  title: string;
  description: string;
  category: string;
  pricing: PricingSchedules;
  deposit: number;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  images: string[];
  manualUrl?: string;
  availability: string[]; // ISO dates
  createdAt: string;
}

export type BookingStatus = 'PENDING' | 'APPROVED' | 'ACTIVE' | 'HANDOVER_IN' | 'HANDOVER_OUT' | 'COMPLETED' | 'CANCELLED';

export interface Booking {
  id: string;
  listingId: string;
  borrowerId: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  deposit: number;
  status: BookingStatus;
  handoverPhotos?: string[];
  returnPhotos?: string[];
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  text: string;
  timestamp: string;
}

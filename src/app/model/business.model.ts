import { UserProfile } from './user-profile.model'; // Ajuste o caminho conforme necessário

export interface Photo {
  photo_id: number;
  business_id: number;
  photo_url: string;
  description: string;
  created_at: string;
}

export interface Service {
  service_id: number;
  service_name: string;
  description: string;
  service_fotoUrl?: string | null;
  price: number;
  duration: number;
  category?: string;
  isActive?: boolean;
  business_id?: number;
}

export interface Business {
  business_id: number;
  business_name: string;
  business_address?: string;
  business_phone?: string;
  business_email?: string;
  main_photo_url: string | null;
  description?: string;
  business_type?: string;
  isActive?: boolean;
  opening_hour?: string; // "09:00:00"
  closing_hour?: string; // "18:00:00"
  photos?: Photo[];
}

export interface BusinessSummary {
  business_id: number;
  business_name: string;
  main_photo_url: string | null;
  role: 'Owner' | 'Manager' | 'Employee' | string;
}

export interface Rating {
  average_rating: number;
  total_reviews: number;
}

export interface Review {
  review_id: number;
  review_title: string;
  review_body: string;
  review_rating: number;
  user_id: number;
  createdAt: string;
  Service: {
    service_id: number;
    service_name: string;
  };
  User: {
    username: string;
    fotoUrl: string | null;
  };
}

export interface CreateReview {
  review_title: string;
  review_body: string;
  review_rating: number;
}

export interface BusinessReviewsResponse {
  business_name: string;
  total_reviews: number;
  reviews: Review[];
}

export interface Professionals {
  professional_id?: number;
  email?: string;
  availability: AvailabilitySlot[] | 'Full-time';
  role: 'Owner' | 'Manager' | 'Employee' | 'Assistant' | 'Other';
  isActive?: boolean;
  business_id?: number;
  user_id?: number;
  Business?: {
    business_name: string;
  };
  User: UserProfile;
}

export interface AvailabilitySlot {
  day: string;
  start: string;
  end: string;
}

export interface ProfessionalInvite {
  availability: AvailabilitySlot[] | 'Full-time';
  role: string;
  email?: string;
  isActive: boolean;
}

export interface ProfessionalUpdateData {
  role?: string;
  isActive?: boolean;
  availability?: AvailabilitySlot[];
}

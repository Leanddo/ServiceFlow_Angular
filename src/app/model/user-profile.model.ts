export interface UserProfile {
  username: string;
  email: string;
  fotoUrl: string | null;
  role: string;
}

export interface UserProfileResponse {
  profile: UserProfile;
}

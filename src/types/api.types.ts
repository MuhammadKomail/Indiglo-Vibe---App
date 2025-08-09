// Common API Response type
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

// Auth types
export interface LoginRequest {
  email: string;
  password: string;
  role: string | undefined;
}

export interface AuthResponse {
  token: string;
  user: UserData;
}

// User types
export interface UserData {
  id: string;
  name: string;
  email: string;
  role: string | undefined;
  technicianId?: string;
}

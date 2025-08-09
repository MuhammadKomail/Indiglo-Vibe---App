// Represents the data needed for login
export interface LoginData {
  username: string;
  password: string;
  role: string | undefined;
}

// Represents the entire response from the login API
export interface LoginResponse {
  isApiHandled: boolean;
  isRequestSuccess: boolean;
  statusCode: number;
  message: string;
  data: UserDataResponse | null;
  exception: string[];
}

// Represents the user data contained within the `data` field of the `AuthResponse`
export interface UserDataResponse {
  email: string;
  password: string;
  role: string | undefined;
}

// Represents the role and actions assigned to the user
export interface RoleAndAction {
  actions: any[];
  id: string;
  name: string;
  tag: string;
  createdBy: string;
  updatedBy: string;
  updatedDate: string;
  createdDate: string;
  isActive: boolean;
}

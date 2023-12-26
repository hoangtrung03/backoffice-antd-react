export interface User {
    id: number;
    firstname: string | null;
    lastname: string | null;
    email: string;
    date_of_birth: string | null;
    avatar: string | null;
    address: string | null;
    phone: string | null;
    gender: string | null;
    country: string | null;
    city: string | null;
    bio: string | null;
    roles: UserRole[];
  }
  
  export interface UserRole {
    id: number;
    name: string;
  }
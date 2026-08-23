import { UserRole } from "../types/authTypes";

export interface User {
  id: number;
  role: UserRole;
  firstName: string;
  lastName: string;
  email: string;
  passwordHash: string;
  isActive: boolean;
  createdAt: Date;
}

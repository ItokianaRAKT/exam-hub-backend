export enum UserRole {
  ADMIN = "admin",
  STUDENT = "student",
}

export interface JwtPayload {
  userId: string;
  role: UserRole;
}

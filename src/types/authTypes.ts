export enum UserRole {
  ADMIN = "admin",
  STUDENT = "student",
}

export interface JwtPayload {
  userId: number;
  role: UserRole;
}

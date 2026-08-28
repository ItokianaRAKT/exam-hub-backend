import { findByEmail } from "../repositories/userRepository";
import { comparePassword } from "../security/password";
import { generateToken } from "../security/jwt";
import { createApiError } from "../types/commonTypes";
import { User } from "../models/userModel";

export const login = async (
  email: string,
  password: string
): Promise<{
  token: string;
  user: Pick<User, "id" | "role" | "firstName" | "lastName" | "email">;
}> => {
  const user = await findByEmail(email);

  if (!user) {
    throw createApiError("Email ou mot de passe incorrect", 401);
  }

  if (!user.isActive) {
    throw createApiError("Compte désactivé", 403);
  }

  const valid = await comparePassword(password, user.passwordHash ?? "");
  if (!valid) {
    throw createApiError("Email ou mot de passe incorrect", 401);
  }

  const token = generateToken({ userId: user.id, role: user.role });

  return {
    token,
    user: {
      id: user.id,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    },
  };
};

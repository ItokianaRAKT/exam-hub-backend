import * as userRepository from "../repositories/userRepository";
import { User } from "../models/userModel";
import { hashPassword } from "../security/password";
import { createApiError } from "../types/commonTypes";
import { UserRole } from "../types/authTypes";

export const getAll = async (role?: string): Promise<User[]> => {
  return userRepository.findAll(role);
};

export const getById = async (id: string): Promise<User> => {
  const user = await userRepository.findById(id);
  if (!user) {
    throw createApiError("Étudiant introuvable", 404);
  }
  return user;
};

export const create = async (data: {
  firstName: string;
  lastName?: string;
  email: string;
  password: string;
}): Promise<User> => {
  const existingUser = await userRepository.findByEmail(data.email);
  if (existingUser) {
    throw createApiError("Un compte avec cet email existe déjà", 409);
  }

  const passwordHash = await hashPassword(data.password);

  return userRepository.create({
    role: UserRole.STUDENT,
    firstName: data.firstName,
    lastName: (data.lastName ?? "").trim(),
    email: data.email,
    passwordHash,
  });
};

export const update = async (
  id: string,
  data: { email: string; password?: string }
): Promise<User> => {
  const existingUser = await userRepository.findById(id);
  if (!existingUser) {
    throw createApiError("Étudiant introuvable", 404);
  }

  const emailTaken = await userRepository.findByEmail(data.email);
  if (emailTaken && emailTaken.id !== id) {
    throw createApiError("Un compte avec cet email existe déjà", 409);
  }

  const updatedUser = await userRepository.update(id, { email: data.email });

  if (data.password) {
    const passwordHash = await hashPassword(data.password);
    await userRepository.updatePassword(id, passwordHash);
  }

  return updatedUser!;
};

export const deactivate = async (id: string): Promise<User> => {
  const user = await userRepository.findById(id);
  if (!user) {
    throw createApiError("Étudiant introuvable", 404);
  }

  const deactivated = await userRepository.setActive(id, false);
  return deactivated!;
};

export const activate = async (id: string): Promise<User> => {
  const user = await userRepository.findById(id);
  if (!user) {
    throw createApiError("Étudiant introuvable", 404);
  }

  const activated = await userRepository.setActive(id, true);
  return activated!;
};

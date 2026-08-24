import * as userRepository from "../repositories/userRepository";
import { User } from "../models/userModel";
import { createApiError } from "../types/commonTypes";

export async function getAll(role?: string): Promise<User[]> {
  return userRepository.findAll(role);
}

export async function getById(id: number): Promise<User> {
  const user = await userRepository.findById(id);
  if (!user) {
    throw createApiError("Étudiant introuvable", 404);
  }
  return user;
}

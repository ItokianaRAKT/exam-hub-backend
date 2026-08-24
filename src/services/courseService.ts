import * as courseRepository from "../repositories/courseRepository";
import { Course } from "../models/courseModel";
import { createApiError } from "../types/commonTypes";

export async function getAll(): Promise<Course[]> {
  return courseRepository.findAll();
}

export async function getById(id: number): Promise<Course> {
  const course = await courseRepository.findById(id);
  if (!course) {
    throw createApiError("Cours introuvable", 404);
  }
  return course;
}

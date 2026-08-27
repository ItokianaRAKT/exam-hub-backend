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

export async function create(data: {
  code: string;
  name: string;
  description?: string;
}): Promise<Course> {
  const existingCourse = await courseRepository.findByCode(data.code);
  if (existingCourse) {
    throw createApiError("Un cours avec ce code existe déjà", 409);
  }

  return courseRepository.create({
    code: data.code,
    name: data.name,
    description: data.description || null,
  });
}

export async function update(
  id: number,
  data: { code: string; name: string; description?: string }
): Promise<Course> {
  const existingCourse = await courseRepository.findById(id);
  if (!existingCourse) {
    throw createApiError("Cours introuvable", 404);
  }

  const codeTaken = await courseRepository.findByCode(data.code);
  if (codeTaken && codeTaken.id !== id) {
    throw createApiError("Un cours avec ce code existe déjà", 409);
  }

  const updatedCourse = await courseRepository.update(id, {
    code: data.code,
    name: data.name,
    description: data.description || null,
  });

  return updatedCourse!;
}

export async function remove(id: number): Promise<void> {
  const course = await courseRepository.findById(id);
  if (!course) {
    throw createApiError("Cours introuvable", 404);
  }

  const examCount = await courseRepository.countExamsByCourse(id);
  if (examCount > 0) {
    throw createApiError("Ce cours contient des examens et ne peut pas être supprimé", 409);
  }

  await courseRepository.remove(id);
}

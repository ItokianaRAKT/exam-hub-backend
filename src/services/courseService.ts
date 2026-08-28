import { CourseRepository } from "../repositories/courseRepository";
import { Course } from "../models/courseModel";
import { createApiError } from "../types/commonTypes";

const courseRepository = new CourseRepository();

export const getAll = async (): Promise<Course[]> => {
  return courseRepository.findAll();
};

export const getById = async (id: string): Promise<Course> => {
  const course = await courseRepository.findById(id);
  if (!course) {
    throw createApiError("Cours introuvable", 404);
  }
  return course;
};

export const create = async (data: {
  code: string;
  name: string;
  description?: string;
}): Promise<Course> => {
  const existingCourse = await courseRepository.findByCode(data.code);
  if (existingCourse) {
    throw createApiError("Un cours avec ce code existe déjà", 409);
  }

  return courseRepository.create({
    code: data.code,
    name: data.name,
    description: data.description || null,
  });
};

export const update = async (
  id: string,
  data: { code: string; name: string; description?: string }
): Promise<Course> => {
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
};

export const remove = async (id: string): Promise<void> => {
  const course = await courseRepository.findById(id);
  if (!course) {
    throw createApiError("Cours introuvable", 404);
  }

  const examCount = await courseRepository.countExamsByCourse(id);
  if (examCount > 0) {
    throw createApiError("Ce cours contient des examens et ne peut pas être supprimé", 409);
  }

  await courseRepository.remove(id);
};

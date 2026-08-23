import * as examRepository from "../repositories/examRepository";
import * as courseRepository from "../repositories/courseRepository";
import * as attemptRepository from "../repositories/attemptRepository";
import { Exam } from "../models/examModel";
import { createApiError } from "../types/commonTypes";

export async function getAll(courseId?: number): Promise<Exam[]> {
  return examRepository.findAll(courseId);
}

export async function getById(id: number): Promise<Exam> {
  const exam = await examRepository.findById(id);
  if (!exam) {
    throw createApiError("Examen introuvable", 404);
  }
  return exam;
}

export async function create(
  courseId: number,
  title: string,
  description: string | null,
  startsAt: string,
  endsAt: string
): Promise<Exam> {
  const course = await courseRepository.findById(courseId);
  if (!course) {
    throw createApiError("Cours introuvable", 404);
  }

  return examRepository.create(courseId, title, description, startsAt, endsAt);
}

export async function update(
  id: number,
  courseId: number,
  title: string,
  description: string | null,
  startsAt: string,
  endsAt: string
): Promise<Exam> {
  const existing = await examRepository.findById(id);
  if (!existing) {
    throw createApiError("Examen introuvable", 404);
  }

  const attempts = await attemptRepository.countByExam(id);
  if (attempts > 0) {
    throw createApiError("Cet examen a déjà des tentatives et ne peut plus être modifié", 409);
  }

  const course = await courseRepository.findById(courseId);
  if (!course) {
    throw createApiError("Cours introuvable", 404);
  }

  const updated = await examRepository.update(id, courseId, title, description, startsAt, endsAt);
  return updated!;
}

export async function remove(id: number): Promise<void> {
  const existing = await examRepository.findById(id);
  if (!existing) {
    throw createApiError("Examen introuvable", 404);
  }

  const attempts = await attemptRepository.countByExam(id);
  if (attempts > 0) {
    throw createApiError("Cet examen a déjà des tentatives et ne peut pas être supprimé", 409);
  }

  await examRepository.remove(id);
}

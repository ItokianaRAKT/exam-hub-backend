import { Request, Response, NextFunction } from "express";
import * as examService from "../services/examService";

export async function listExams(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const courseId = req.query.courseId ? Number(req.query.courseId) : undefined;
    const exams = await examService.getAll(courseId);
    res.json(exams);
  } catch (err) {
    next(err);
  }
}

export async function getExam(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = Number(req.params.id);
    const exam = await examService.getById(id);
    res.json(exam);
  } catch (err) {
    next(err);
  }
}

export async function createExam(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { courseId, title, description, startDate, endDate } = req.body;
    const exam = await examService.create(courseId, title, description || null, startDate, endDate);
    res.status(201).json(exam);
  } catch (err) {
    next(err);
  }
}

export async function updateExam(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = Number(req.params.id);
    const { courseId, title, description, startDate, endDate } = req.body;
    const exam = await examService.update(id, courseId, title, description || null, startDate, endDate);
    res.json(exam);
  } catch (err) {
    next(err);
  }
}

export async function deleteExam(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = Number(req.params.id);
    await examService.remove(id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

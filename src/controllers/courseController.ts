import { Request, Response, NextFunction } from "express";
import * as courseService from "../services/courseService";

export async function listCourses(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const courses = await courseService.getAll();
    res.json(courses);
  } catch (err) {
    next(err);
  }
}

export async function getCourse(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = Number(req.params.id);
    const course = await courseService.getById(id);
    res.json(course);
  } catch (err) {
    next(err);
  }
}

export async function createCourse(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { code, name, description } = req.body;
    const course = await courseService.create({ code, name, description });
    res.status(201).json(course);
  } catch (err) {
    next(err);
  }
}

export async function updateCourse(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = Number(req.params.id);
    const { code, name, description } = req.body;
    const course = await courseService.update(id, { code, name, description });
    res.json(course);
  } catch (err) {
    next(err);
  }
}

export async function deleteCourse(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = Number(req.params.id);
    await courseService.remove(id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

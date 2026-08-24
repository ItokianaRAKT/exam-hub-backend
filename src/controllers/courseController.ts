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

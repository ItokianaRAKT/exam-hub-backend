import { Request, Response, NextFunction } from "express";
import * as courseService from "../services/courseService";

export const listCourses = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const courses = await courseService.getAll();
    res.json(courses);
  } catch (err) {
    next(err);
  }
};

export const getCourse = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = req.params.id as string;
    const course = await courseService.getById(id);
    res.json(course);
  } catch (err) {
    next(err);
  }
};

export const createCourse = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { code, name, description } = req.body;
    const course = await courseService.create({ code, name, description });
    res.status(201).json(course);
  } catch (err) {
    next(err);
  }
};

export const updateCourse = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = req.params.id as string;
    const { code, name, description } = req.body;
    const course = await courseService.update(id, { code, name, description });
    res.json(course);
  } catch (err) {
    next(err);
  }
};

export const deleteCourse = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = req.params.id as string;
    await courseService.remove(id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

import { Request, Response, NextFunction } from "express";
import * as studentService from "../services/studentService";

export async function listStudents(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const students = await studentService.getAll();
    res.json(students);
  } catch (err) {
    next(err);
  }
}

export async function getStudent(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = Number(req.params.id);
    const student = await studentService.getById(id);
    res.json(student);
  } catch (err) {
    next(err);
  }
}

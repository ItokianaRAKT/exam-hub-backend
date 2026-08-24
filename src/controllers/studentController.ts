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

export async function createStudent(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { firstName, lastName, email, password } = req.body;
    const student = await studentService.create({ firstName, lastName, email, password });
    res.status(201).json(student);
  } catch (err) {
    next(err);
  }
}

export async function updateStudent(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = Number(req.params.id);
    const { firstName, lastName, email, password } = req.body;
    const student = await studentService.update(id, { firstName, lastName, email, password });
    res.json(student);
  } catch (err) {
    next(err);
  }
}

export async function deleteStudent(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = Number(req.params.id);
    await studentService.deactivate(id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

export async function activateStudent(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = Number(req.params.id);
    const student = await studentService.activate(id);
    res.json(student);
  } catch (err) {
    next(err);
  }
}

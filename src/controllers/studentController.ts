import { Request, Response, NextFunction } from "express";
import * as studentService from "../services/studentService";

export const listStudents = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const students = await studentService.getAll();
    res.json(students);
  } catch (err) {
    next(err);
  }
};

export const getStudent = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = req.params.id as string;
    const student = await studentService.getById(id);
    res.json(student);
  } catch (err) {
    next(err);
  }
};

export const createStudent = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { firstName, lastName, email, password } = req.body;
    const student = await studentService.create({ firstName, lastName, email, password });
    res.status(201).json(student);
  } catch (err) {
    next(err);
  }
};

export const updateStudent = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = req.params.id as string;
    const { email, password } = req.body;
    const student = await studentService.update(id, { email, password });
    res.json(student);
  } catch (err) {
    next(err);
  }
};

export const deleteStudent = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = req.params.id as string;
    await studentService.deactivate(id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

export const activateStudent = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = req.params.id as string;
    const student = await studentService.activate(id);
    res.json(student);
  } catch (err) {
    next(err);
  }
};

import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { AppError } from '../middlewares/errorHandler';

const prisma = new PrismaClient();

export const createTask = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { title, description } = req.body;
    const task = await prisma.task.create({
      data: { title: title.trim(), description: description || '' },
    });
    res.status(201).json(task);
  } catch (error) {
    next(error);
  }
};

export const getTasks = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tasks = await prisma.task.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.json(tasks);
  } catch (error) {
    next(error);
  }
};


export const updateTaskStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const existingTask = await prisma.task.findUnique({
      where: { id: Number(id) },
    });

    if (!existingTask) {
      return next(new AppError(404, 'TASK_NOT_FOUND'));
    }

    const updatedTask = await prisma.task.update({
      where: { id: Number(id) },
      data: { status },
    });

    res.json(updatedTask);
  } catch (error) {
    next(error);
  }
};
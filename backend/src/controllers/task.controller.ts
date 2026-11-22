import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import { AppError } from "../middlewares/errorHandler";

const prisma = new PrismaClient();

export const createTask = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { title, description } = req.body;
    const task = await prisma.task.create({
      data: { title, description },
    });
    res.status(201).json(task);
  } catch (error) {
    next(error);
  }
};

export const getTasks = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const tasks = await prisma.task.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.json(tasks);
  } catch (error) {
    next(error);
  }
};

export const updateTaskStatus = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const existingTask = await prisma.task.findUnique({
      where: { id: Number(id) },
    });

    if (!existingTask) {
      return next(new AppError(404, "TASK_NOT_FOUND"));
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

export const updateTask = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;
    const taskId = Number(id);

    const existingTask = await prisma.task.findUnique({
      where: { id: taskId },
    });

    if (!existingTask) {
      return next(new AppError(404, "TASK_NOT_FOUND"));
    }

    // به‌روزرسانی عنوان، توضیحات و زمان ویرایش (createdAt = now)
    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: {
        title,
        description,
        createdAt: new Date(),
      },
    });

    res.json(updatedTask);
  } catch (error) {
    next(error);
  }
};

export const deleteTask = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const taskId = Number(id);

    const existingTask = await prisma.task.findUnique({
      where: { id: taskId },
    });

    if (!existingTask) {
      return next(new AppError(404, "TASK_NOT_FOUND"));
    }

    // حذف قطعی، دائم و کامل از پایگاه داده (Hard Delete)
    await prisma.task.delete({
      where: { id: taskId },
    });

    res.json({ message: "TASK_DELETED", id: taskId });
  } catch (error) {
    next(error);
  }
};

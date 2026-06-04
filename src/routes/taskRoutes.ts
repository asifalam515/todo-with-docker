import type { Request, Response } from "express";
import { Router } from "express";
import prisma from "../prismaClient.js";

const router = Router();

// Get all tasks
router.get("/", async (req: Request, res: Response) => {
  try {
    const tasks = await prisma.task.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
});

// Get a single task
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const task = await prisma.task.findUnique({
      where: { id: Number(req.params.id) },
    });
    if (task) {
      res.json(task);
    } else {
      res.status(404).json({ error: "Task not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch task" });
  }
});

// Create a task
router.post("/", async (req: Request, res: Response) => {
  const { title, description, dueDate, priority, todoId } = req.body;
  if (!title) {
    return res.status(400).json({ error: "Title is required" });
  }
  try {
    const newTask = await prisma.task.create({
      data: {
        title,
        description,
        dueDate: dueDate ? new Date(dueDate) : undefined,
        priority,
        todo: todoId ? { connect: { id: Number(todoId) } } : undefined,
      },
    });
    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ error: "Failed to create task" });
  }
});

// Update a task
router.put("/:id", async (req: Request, res: Response) => {
  const { title, description, completed, dueDate, priority, todoId } = req.body;
  try {
    const updatedTask = await prisma.task.update({
      where: { id: Number(req.params.id) },
      data: {
        title,
        description,
        completed,
        dueDate: dueDate ? new Date(dueDate) : undefined,
        priority,
        todo: todoId ? { connect: { id: Number(todoId) } } : undefined,
      },
    });
    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ error: "Failed to update task" });
  }
});

// Delete a task
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    await prisma.task.delete({
      where: { id: Number(req.params.id) },
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Failed to delete task" });
  }
});

export default router;

import { Router } from 'express';
import type { Request, Response } from 'express';
import prisma from '../prismaClient.js';

const router = Router();

// Get all todos
router.get('/', async (req: Request, res: Response) => {
  try {
    const todos = await prisma.todo.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(todos);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch todos' });
  }
});

// Get a single todo
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const todo = await prisma.todo.findUnique({
      where: { id: Number(req.params.id) }
    });
    if (todo) {
      res.json(todo);
    } else {
      res.status(404).json({ error: 'Todo not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch todo' });
  }
});

// Create a todo
router.post('/', async (req: Request, res: Response) => {
  const { title, description } = req.body;
  if (!title) {
    return res.status(400).json({ error: 'Title is required' });
  }
  try {
    const newTodo = await prisma.todo.create({
      data: {
        title,
        description,
      }
    });
    res.status(201).json(newTodo);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create todo' });
  }
});

// Update a todo
router.put('/:id', async (req: Request, res: Response) => {
  const { title, description, completed } = req.body;
  try {
    const updatedTodo = await prisma.todo.update({
      where: { id: Number(req.params.id) },
      data: {
        title,
        description,
        completed
      }
    });
    res.json(updatedTodo);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update todo' });
  }
});

// Delete a todo
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    await prisma.todo.delete({
      where: { id: Number(req.params.id) }
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete todo' });
  }
});

export default router;

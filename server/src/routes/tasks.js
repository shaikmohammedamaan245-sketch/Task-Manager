
import { Router } from 'express';
import Task from '../models/Task.js';
import { auth } from '../middleware/auth.js';

const router = Router();

// All routes require auth
router.use(auth);

// Create
router.post('/', async (req, res) => {
  try {
    const task = await Task.create({ user: req.userId, ...req.body });
    res.status(201).json(task);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// Read all for user (optional filter by status)
router.get('/', async (req, res) => {
  const { status } = req.query; // 'pending' | 'completed' | undefined
  const filter = { user: req.userId };
  if (status === 'pending') filter.completed = false;
  if (status === 'completed') filter.completed = true;
  const tasks = await Task.find(filter).sort({ createdAt: -1 });
  res.json(tasks);
});

// Update
router.put('/:id', async (req, res) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      req.body,
      { new: true }
    );
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.json(task);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// Toggle status
router.patch('/:id/toggle', async (req, res) => {
  const task = await Task.findOne({ _id: req.params.id, user: req.userId });
  if (!task) return res.status(404).json({ error: 'Task not found' });
  task.completed = !task.completed;
  await task.save();
  res.json(task);
});

// Delete
router.delete('/:id', async (req, res) => {
  const deleted = await Task.findOneAndDelete({ _id: req.params.id, user: req.userId });
  if (!deleted) return res.status(404).json({ error: 'Task not found' });
  res.json({ ok: true });
});

export default router;

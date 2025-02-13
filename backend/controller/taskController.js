const Task = require("../models/task");
const Joi = require("joi");

// Validation Schema for Task
const taskSchema = Joi.object({
  title: Joi.string().min(3).max(100).required(),
  description: Joi.string().max(500),
  completed: Joi.boolean(),
});

const taskController = {
  // 🔹 Create a new task
  async create(req, res, next) {
    const { error } = taskSchema.validate(req.body);
    if (error) return next(error);

    try {
      const { title, description, completed } = req.body;
      const userId = req.user._id; // Extracted from JWT middleware

      const newTask = new Task({
        title,
        description,
        completed: completed || false,
        userId,
      });

      const savedTask = await newTask.save();
      return res.status(201).json({ message: "Task created successfully", task: savedTask });
    } catch (err) {
      return next(err);
    }
  },

  // 🔹 Get all tasks for logged-in user
  async getAll(req, res, next) {
    try {
      const userId = req.user._id;
      const tasks = await Task.find({ userId }).sort({ createdAt: -1 });

      return res.status(200).json(tasks);
    } catch (err) {
      return next(err);
    }
  },

  // 🔹 Get task by ID
  async getById(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user._id;

      const task = await Task.findOne({ _id: id, userId });
      if (!task) return res.status(404).json({ message: "Task not found" });

      return res.status(200).json(task);
    } catch (err) {
      return next(err);
    }
  },

  // 🔹 Update task by ID
  async update(req, res, next) {
    const { error } = taskSchema.validate(req.body);
    if (error) return next(error);

    try {
      const { id } = req.params;
      const userId = req.user._id;
      const { title, description, completed } = req.body;

      const updatedTask = await Task.findOneAndUpdate(
        { _id: id, userId },
        { title, description, completed },
        { new: true, runValidators: true }
      );

      if (!updatedTask) return res.status(404).json({ message: "Task not found or unauthorized" });

      return res.status(200).json({ message: "Task updated successfully", task: updatedTask });
    } catch (err) {
      return next(err);
    }
  },

  // 🔹 Delete task by ID
  async delete(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user._id;

      const deletedTask = await Task.findOneAndDelete({ _id: id, userId });
      if (!deletedTask) return res.status(404).json({ message: "Task not found or unauthorized" });

      return res.status(200).json({ message: "Task deleted successfully" });
    } catch (err) {
      return next(err);
    }
  },
};

module.exports = taskController;

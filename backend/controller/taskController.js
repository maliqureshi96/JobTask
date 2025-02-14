const Task = require("../models/task");
const User = require("../models/user");
const Joi = require("joi");
const mongoose = require("mongoose");

const taskController = {
    // ✅ Create a new task
    async createTask(req, res, next) {
        const taskSchema = Joi.object({
            title: Joi.string().required(),
            description: Joi.string().allow(""),
            completed: Joi.boolean(),
            userId: Joi.string().required(),
        });

        const { error } = taskSchema.validate(req.body);
        if (error) return res.status(400).json({ message: error.details[0].message });

        const { title, description, completed, userId } = req.body;

        try {
            const task = new Task({ title, description, completed, userId });
            await task.save();

            await User.findByIdAndUpdate(userId, { $push: { tasks: task._id } });

            return res.status(201).json({ message: "Task created successfully", task });
        } catch (err) {
            return res.status(500).json({ message: "Internal server error" });
        }
    },

    // ✅ Get all tasks for a user
    async getUserTasks(req, res, next) {
        const { userId } = req.params;

        try {
            const tasks = await Task.find({ userId }).sort({ createdAt: -1 });
            return res.status(200).json(tasks);
        } catch (err) {
            return res.status(500).json({ message: "Internal server error" });
        }
    },

    // ✅ Get a single task
    async getTask(req, res, next) {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid task ID" });
        }

        try {
            const task = await Task.findById(id);
            if (!task) return res.status(404).json({ message: "Task not found" });

            return res.status(200).json(task);
        } catch (err) {
            return res.status(500).json({ message: "Internal server error" });
        }
    },

    // ✅ Update a task
    async updateTask(req, res, next) {
        const { id } = req.params;

        // 🔹 Validate Task ID
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid task ID" });
        }

        // 🔹 Validate Update Fields
        const taskSchema = Joi.object({
            title: Joi.string().min(3).max(100),
            description: Joi.string().allow(""),
            completed: Joi.boolean(),
        });

        const { error } = taskSchema.validate(req.body);
        if (error) return res.status(400).json({ message: error.details[0].message });

        try {
            // 🔹 Check if Task Exists
            const existingTask = await Task.findById(id);
            if (!existingTask) return res.status(404).json({ message: "Task not found" });

            // 🔹 Update Task
            // const updatedTask = await Task.findByIdAndUpdate(id, req.body, { new: true });
            // ✅ Ensure updateTask allows updating only specific fields
const updatedTask = await Task.findByIdAndUpdate(id, { $set: req.body }, { new: true });

            return res.status(200).json({ message: "Task updated successfully", updatedTask });

        } catch (err) {
            console.error("Update Error:", err);
            return res.status(500).json({ message: "Something went wrong while updating." });
        }
    },

    // ✅ Delete a task
    async deleteTask(req, res, next) {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid task ID" });
        }

        try {
            const task = await Task.findByIdAndDelete(id);
            if (!task) return res.status(404).json({ message: "Task not found" });

            await User.findByIdAndUpdate(task.userId, { $pull: { tasks: task._id } });

            return res.status(200).json({ message: "Task deleted successfully" });
        } catch (err) {
            return res.status(500).json({ message: "Internal server error" });
        }
    },
};

module.exports = taskController;

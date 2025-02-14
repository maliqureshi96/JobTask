const express = require('express');
const authController = require('../controller/authController');
const auth = require('../middlewares/auth');
const taskController = require('../controller/taskController');

const router = express.Router();

// User Routes
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', auth, authController.logout);
router.get('/refresh', authController.refresh);

// Task Routes
router.post('/task', auth, taskController.createTask);
router.get('/tasks/:userId', auth, taskController.getUserTasks);
router.get('/task/:id', auth, taskController.getTask);
router.put('/task/:id', auth, taskController.updateTask);
router.delete('/task/:id', auth, taskController.deleteTask);

module.exports = router;

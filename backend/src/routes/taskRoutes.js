const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const taskValidator = require('../validators/taskValidator');
const authMiddleware = require('../middleware/authMiddleware');


router.use(authMiddleware);


router.get('/stats', taskController.getTaskStats);


router.post(
  '/',
  taskValidator.createTask,
  taskController.createTask
);


router.get(
  '/',
  taskValidator.queryParams,
  taskController.getAllTasks
);


router.get(
  '/:id',
  taskValidator.taskId,
  taskController.getTaskById
);


router.put(
  '/:id',
  taskValidator.updateTask,
  taskController.updateTask
);


router.delete(
  '/:id',
  taskValidator.taskId,
  taskController.deleteTask
);

module.exports = router;

const { validationResult } = require('express-validator');
const taskService = require('../services/taskService');

class TaskController {
  
  async createTask(req, res, next) {
    try {
      
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array().map(err => ({
            field: err.path,
            message: err.msg
          }))
        });
      }

      const task = await taskService.createTask(req.body, req.user._id);

      res.status(201).json({
        success: true,
        message: 'Task created successfully',
        data: task
      });

    } catch (error) {
      next(error);
    }
  }


  async getAllTasks(req, res, next) {
    try {

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array().map(err => ({
            field: err.path,
            message: err.msg
          }))
        });
      }

      const result = await taskService.getAllTasks(req.user._id, req.query);

      res.status(200).json({
        success: true,
        data: result.tasks,
        pagination: result.pagination
      });

    } catch (error) {
      next(error);
    }
  }


  async getTaskById(req, res, next) {
    try {
     
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array().map(err => ({
            field: err.path,
            message: err.msg
          }))
        });
      }

      const task = await taskService.getTaskById(req.params.id, req.user._id);

      res.status(200).json({
        success: true,
        data: task
      });

    } catch (error) {
      next(error);
    }
  }


  async updateTask(req, res, next) {
    try {

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array().map(err => ({
            field: err.path,
            message: err.msg
          }))
        });
      }

      const task = await taskService.updateTask(
        req.params.id,
        req.user._id,
        req.body
      );

      res.status(200).json({
        success: true,
        message: 'Task updated successfully',
        data: task
      });

    } catch (error) {
      next(error);
    }
  }


  async deleteTask(req, res, next) {
    try {
     
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array().map(err => ({
            field: err.path,
            message: err.msg
          }))
        });
      }

      await taskService.deleteTask(req.params.id, req.user._id);

      res.status(200).json({
        success: true,
        message: 'Task deleted successfully'
      });

    } catch (error) {
      next(error);
    }
  }

  
  async getTaskStats(req, res, next) {
    try {
      const stats = await taskService.getTaskStats(req.user._id);

      res.status(200).json({
        success: true,
        data: stats
      });

    } catch (error) {
      next(error);
    }
  }
}

module.exports = new TaskController();

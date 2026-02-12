const Task = require('../models/Task');

class TaskService {

  async createTask(taskData, userId) {
    const task = await Task.create({
      ...taskData,
      user: userId
    });

    return task;
  }

  async getAllTasks(userId, queryParams) {
    const {
      status,
      search,
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      order = 'desc'
    } = queryParams;


    const query = { user: userId };


    if (status) {
      query.status = status;
    }


    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }


    const skip = (parseInt(page) - 1) * parseInt(limit);
    const limitNum = parseInt(limit);


    const sortOrder = order === 'asc' ? 1 : -1;
    const sortOptions = { [sortBy]: sortOrder };

    
    const [tasks, totalTasks] = await Promise.all([
      Task.find(query)
        .sort(sortOptions)
        .skip(skip)
        .limit(limitNum),
      Task.countDocuments(query)
    ]);


    const totalPages = Math.ceil(totalTasks / limitNum);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    return {
      tasks,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalTasks,
        limit: limitNum,
        hasNextPage,
        hasPrevPage
      }
    };
  }

  // Get task by ID
  async getTaskById(taskId, userId) {
    const task = await Task.findOne({ _id: taskId, user: userId });

    if (!task) {
      const error = new Error('Task not found');
      error.statusCode = 404;
      throw error;
    }

    return task;
  }


  async updateTask(taskId, userId, updateData) {
    // Check if task exists and belongs to user
    const task = await Task.findOne({ _id: taskId, user: userId });

    if (!task) {
      const error = new Error('Task not found');
      error.statusCode = 404;
      throw error;
    }


    const updatedTask = await Task.findByIdAndUpdate(
      taskId,
      { $set: updateData },
      { 
        new: true, 
        runValidators: true 
      }
    );

    return updatedTask;
  }


  async deleteTask(taskId, userId) {
    const task = await Task.findOneAndDelete({ _id: taskId, user: userId });

    if (!task) {
      const error = new Error('Task not found');
      error.statusCode = 404;
      throw error;
    }

    return { message: 'Task deleted successfully' };
  }

  async getTaskStats(userId) {
    const stats = await Task.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const statsObject = {
      TODO: 0,
      IN_PROGRESS: 0,
      DONE: 0,
      total: 0
    };

    stats.forEach(stat => {
      statsObject[stat._id] = stat.count;
      statsObject.total += stat.count;
    });

    return statsObject;
  }
}

module.exports = new TaskService();

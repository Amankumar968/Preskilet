import { ref, computed } from 'vue';
import { taskService } from '../services/taskService';

export function useTasks() {
  const tasks = ref([]);
  const loading = ref(false);
  const error = ref(null);
  const pagination = ref({
    currentPage: 1,
    totalPages: 1,
    totalTasks: 0,
    limit: 10,
    hasNextPage: false,
    hasPrevPage: false
  });

  const filters = ref({
    status: '',
    search: '',
    page: 1,
    limit: 10,
    sortBy: 'createdAt',
    order: 'desc'
  });

  const stats = ref({
    TODO: 0,
    IN_PROGRESS: 0,
    DONE: 0,
    total: 0
  });

  // Fetch tasks with current filters
  const fetchTasks = async () => {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await taskService.getTasks(filters.value);
      tasks.value = response.data;
      pagination.value = response.pagination;
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to fetch tasks';
      console.error('Error fetching tasks:', err);
    } finally {
      loading.value = false;
    }
  };

  // Fetch task statistics
  const fetchStats = async () => {
    try {
      const response = await taskService.getStats();
      stats.value = response.data;
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  // Create new task
  const createTask = async (taskData) => {
    loading.value = true;
    error.value = null;
    
    try {
      await taskService.createTask(taskData);
      await fetchTasks();
      await fetchStats();
      return { success: true };
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to create task';
      return { success: false, error: error.value };
    } finally {
      loading.value = false;
    }
  };

  // Update existing task
  const updateTask = async (id, taskData) => {
    loading.value = true;
    error.value = null;
    
    try {
      await taskService.updateTask(id, taskData);
      await fetchTasks();
      await fetchStats();
      return { success: true };
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to update task';
      return { success: false, error: error.value };
    } finally {
      loading.value = false;
    }
  };

  // Delete task
  const deleteTask = async (id) => {
    loading.value = true;
    error.value = null;
    
    try {
      await taskService.deleteTask(id);
      await fetchTasks();
      await fetchStats();
      return { success: true };
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to delete task';
      return { success: false, error: error.value };
    } finally {
      loading.value = false;
    }
  };

  // Apply filters
  const applyFilters = (newFilters) => {
    filters.value = { ...filters.value, ...newFilters, page: 1 };
    fetchTasks();
  };

  // Change page
  const changePage = (page) => {
    filters.value.page = page;
    fetchTasks();
  };

  // Reset filters
  const resetFilters = () => {
    filters.value = {
      status: '',
      search: '',
      page: 1,
      limit: 10,
      sortBy: 'createdAt',
      order: 'desc'
    };
    fetchTasks();
  };

  return {
    tasks,
    loading,
    error,
    pagination,
    filters,
    stats,
    fetchTasks,
    fetchStats,
    createTask,
    updateTask,
    deleteTask,
    applyFilters,
    changePage,
    resetFilters
  };
}

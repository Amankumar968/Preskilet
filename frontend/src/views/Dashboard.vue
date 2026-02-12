<template>
  <div class="dashboard">
    <nav class="navbar">
      <div class="navbar-content">
        <div class="logo">
          <h1>Task Tracker</h1>
          <span class="badge">Preskilet</span>
        </div>
        <div class="user-section">
          <span class="user-name">
            {{ user?.name }}</span>
          <button class="logout-btn" @click="handleLogout">
            <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
            </svg>
            Logout
          </button>
        </div>
      </div>
    </nav>

    <div class="container">
      <!-- Stats Cards -->
      <div class="stats-grid">
        <div class="stat-card total">
          <div class="stat-icon">📊</div>
          <div class="stat-info">
            <h3>{{ stats.total }}</h3>
            <p>Total Tasks</p>
          </div>
        </div>
        <div class="stat-card todo">
          <div class="stat-icon">📝</div>
          <div class="stat-info">
            <h3>{{ stats.TODO }}</h3>
            <p>To Do</p>
          </div>
        </div>
        <div class="stat-card progress">
          <div class="stat-icon">⚡</div>
          <div class="stat-info">
            <h3>{{ stats.IN_PROGRESS }}</h3>
            <p>In Progress</p>
          </div>
        </div>
        <div class="stat-card done">
          <div class="stat-icon">✅</div>
          <div class="stat-info">
            <h3>{{ stats.DONE }}</h3>
            <p>Done</p>
          </div>
        </div>
      </div>

      <!-- Header with Add Button -->
      <div class="section-header">
        <h2>My Tasks</h2>
        <button class="add-task-btn" @click="openCreateModal">
          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
          </svg>
          Add Task
        </button>
      </div>

      <!-- Filters -->
      <TaskFilters 
        v-model="filters" 
        @update:model-value="applyFilters"
        @reset="resetFilters"
      />

      <!-- Loading State -->
      <div v-if="loading && !tasks.length" class="loading">
        <div class="spinner"></div>
        <p>Loading tasks...</p>
      </div>

      <!-- Empty State -->
      <div v-else-if="!loading && !tasks.length" class="empty-state">
        <svg width="120" height="120" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path>
        </svg>
        <h3>No tasks found</h3>
        <p>{{ filters.search || filters.status ? 'Try adjusting your filters' : 'Create your first task to get started!' }}</p>
      </div>

      <!-- Tasks List -->
      <div v-else class="tasks-grid">
        <TaskItem
          v-for="task in tasks"
          :key="task._id"
          :task="task"
          @edit="openEditModal"
          @delete="handleDeleteTask"
        />
      </div>

      <!-- Pagination -->
      <Pagination
        v-if="pagination.totalPages > 1"
        :current-page="pagination.currentPage"
        :total-pages="pagination.totalPages"
        @change-page="changePage"
      />

      <!-- Task Form Modal -->
      <TaskForm
        v-if="showModal"
        :task="selectedTask"
        :loading="formLoading"
        @close="closeModal"
        @submit="handleTaskSubmit"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../store/auth';
import { useTasks } from '../composables/useTasks';
import TaskFilters from '../components/TaskFilters.vue';
import TaskItem from '../components/TaskItem.vue';
import TaskForm from '../components/TaskForm.vue';
import Pagination from '../components/Pagination.vue';

const router = useRouter();
const authStore = useAuthStore();
const user = ref(authStore.user);

const {
  tasks,
  loading,
  pagination,
  filters,
  stats,
  fetchTasks,
  fetchStats,
  createTask,
  updateTask,
  deleteTask,
  applyFilters: applyTaskFilters,
  changePage,
  resetFilters: resetTaskFilters
} = useTasks();

const showModal = ref(false);
const selectedTask = ref(null);
const formLoading = ref(false);

onMounted(async () => {
  await Promise.all([fetchTasks(), fetchStats()]);
});

const openCreateModal = () => {
  selectedTask.value = null;
  showModal.value = true;
};

const openEditModal = (task) => {
  selectedTask.value = task;
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  selectedTask.value = null;
};

const handleTaskSubmit = async (taskData) => {
  formLoading.value = true;
  
  let result;
  if (selectedTask.value) {
    result = await updateTask(selectedTask.value._id, taskData);
  } else {
    result = await createTask(taskData);
  }
  
  formLoading.value = false;
  
  if (result.success) {
    closeModal();
  } else {
    alert(result.error || 'An error occurred');
  }
};

const handleDeleteTask = async (taskId) => {
  const result = await deleteTask(taskId);
  if (!result.success) {
    alert(result.error || 'Failed to delete task');
  }
};

const applyFilters = (newFilters) => {
  applyTaskFilters(newFilters);
};

const resetFilters = () => {
  resetTaskFilters();
};

const handleLogout = () => {
  if (confirm('Are you sure you want to logout?')) {
    authStore.logout();
    router.push('/login');
  }
};
</script>

<style scoped>
.dashboard {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.navbar {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.navbar-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 15px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo h1 {
  color: #667eea;
  font-size: 24px;
  margin: 0;
}

.badge {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
}

.user-section {
  display: flex;
  align-items: center;
  gap: 20px;
}

.user-name {
  color: #333;
  font-weight: 500;
  font-size: 15px;
}

.logout-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: #f5f5f5;
  border: none;
  border-radius: 8px;
  color: #666;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.logout-btn:hover {
  background: #e0e0e0;
  color: #333;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 30px 20px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.stat-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 15px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: transform 0.2s;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
}

.stat-icon {
  font-size: 40px;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
}

.stat-card.total .stat-icon {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.stat-card.todo .stat-icon {
  background: #dbeafe;
}

.stat-card.progress .stat-icon {
  background: #fef3c7;
}

.stat-card.done .stat-icon {
  background: #d1fae5;
}

.stat-info h3 {
  color: #333;
  font-size: 32px;
  margin: 0 0 5px 0;
}

.stat-info p {
  color: #666;
  font-size: 14px;
  margin: 0;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
}

.section-header h2 {
  color: white;
  font-size: 28px;
  margin: 0;
}

.add-task-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: white;
  border: none;
  border-radius: 8px;
  color: #667eea;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.add-task-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.loading {
  text-align: center;
  padding: 60px 20px;
  background: white;
  border-radius: 12px;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #667eea;
  border-radius: 50%;
  margin: 0 auto 20px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading p {
  color: #666;
  font-size: 16px;
}

.empty-state {
  text-align: center;
  padding: 80px 20px;
  background: white;
  border-radius: 12px;
}

.empty-state svg {
  color: #ddd;
  margin-bottom: 20px;
}

.empty-state h3 {
  color: #333;
  font-size: 24px;
  margin-bottom: 10px;
}

.empty-state p {
  color: #666;
  font-size: 16px;
}

.tasks-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
}

@media (max-width: 768px) {
  .navbar-content {
    flex-direction: column;
    gap: 15px;
  }

  .user-section {
    width: 100%;
    justify-content: space-between;
  }

  .section-header {
    flex-direction: column;
    gap: 15px;
    align-items: flex-start;
  }

  .add-task-btn {
    width: 100%;
    justify-content: center;
  }

  .tasks-grid {
    grid-template-columns: 1fr;
  }
}
</style>

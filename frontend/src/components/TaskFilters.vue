<template>
  <div class="filters-container">
    <div class="search-box">
      <svg class="search-icon" width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
      </svg>
      <input
        v-model="searchTerm"
        type="text"
        placeholder="Search tasks by title..."
        @input="debouncedSearch"
      />
      <button v-if="searchTerm" class="clear-search" @click="clearSearch">
        &times;
      </button>
    </div>

    <div class="filter-controls">
      <div class="filter-group">
        <label for="status-filter">Status</label>
        <select id="status-filter" v-model="statusFilter" @change="applyFilters">
          <option value="">All Status</option>
          <option value="TODO">To Do</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="DONE">Done</option>
        </select>
      </div>

      <div class="filter-group">
        <label for="sort-by">Sort By</label>
        <select id="sort-by" v-model="sortBy" @change="applyFilters">
          <option value="createdAt">Created Date</option>
          <option value="updatedAt">Updated Date</option>
          <option value="title">Title</option>
        </select>
      </div>

      <div class="filter-group">
        <label for="order">Order</label>
        <select id="order" v-model="order" @change="applyFilters">
          <option value="desc">Newest First</option>
          <option value="asc">Oldest First</option>
        </select>
      </div>

      <button 
        v-if="hasActiveFilters" 
        class="reset-btn" 
        @click="resetFilters"
        title="Reset all filters"
      >
        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
        </svg>
        Reset
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  modelValue: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['update:modelValue', 'reset']);

const searchTerm = ref(props.modelValue.search || '');
const statusFilter = ref(props.modelValue.status || '');
const sortBy = ref(props.modelValue.sortBy || 'createdAt');
const order = ref(props.modelValue.order || 'desc');

let debounceTimer = null;

const hasActiveFilters = computed(() => {
  return searchTerm.value || 
         statusFilter.value || 
         sortBy.value !== 'createdAt' || 
         order.value !== 'desc';
});

const debouncedSearch = () => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    applyFilters();
  }, 500);
};

const clearSearch = () => {
  searchTerm.value = '';
  applyFilters();
};

const applyFilters = () => {
  emit('update:modelValue', {
    search: searchTerm.value,
    status: statusFilter.value,
    sortBy: sortBy.value,
    order: order.value
  });
};

const resetFilters = () => {
  searchTerm.value = '';
  statusFilter.value = '';
  sortBy.value = 'createdAt';
  order.value = 'desc';
  emit('reset');
};
</script>

<style scoped>
.filters-container {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  margin-bottom: 25px;
}

.search-box {
  position: relative;
  margin-bottom: 20px;
}

.search-icon {
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: #999;
}

.search-box input {
  width: 100%;
  padding: 12px 45px 12px 45px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 15px;
  transition: all 0.3s;
}

.search-box input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.clear-search {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  font-size: 24px;
  color: #999;
  cursor: pointer;
  padding: 5px 10px;
  border-radius: 50%;
  transition: all 0.2s;
}

.clear-search:hover {
  background: #f5f5f5;
  color: #333;
}

.filter-controls {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 15px;
  align-items: end;
}

.filter-group {
  display: flex;
  flex-direction: column;
}

.filter-group label {
  color: #666;
  font-size: 13px;
  font-weight: 500;
  margin-bottom: 6px;
}

.filter-group select {
  padding: 10px 12px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 14px;
  background: white;
  cursor: pointer;
  transition: all 0.3s;
}

.filter-group select:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.reset-btn {
  padding: 10px 15px;
  background: #f5f5f5;
  border: none;
  border-radius: 8px;
  color: #666;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s;
}

.reset-btn:hover {
  background: #e0e0e0;
  color: #333;
}

@media (max-width: 768px) {
  .filter-controls {
    grid-template-columns: 1fr 1fr;
  }

  .reset-btn {
    grid-column: 1 / -1;
  }
}

@media (max-width: 480px) {
  .filter-controls {
    grid-template-columns: 1fr;
  }
}
</style>

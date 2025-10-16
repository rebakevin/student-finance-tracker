// State module - Manages application state and business logic

import {
  getTransactions as getStoredTransactions,
  addTransaction as addStoredTransaction,
  updateTransaction as updateStoredTransaction,
  deleteTransaction as deleteStoredTransaction,
  getSettings as getStoredSettings,
  updateSettings as updateStoredSettings,
  getCategories as getStoredCategories,
  addCategory as addStoredCategory,
  deleteCategory as deleteStoredCategory,
  exportData,
  importData,
  clearTransactions as clearStoredTransactions,
} from "./storage.js";

import {
  searchTransactions,
  getUniqueCategories,
  calculateTotal,
  getCategorySummary,
  getRecentTransactions,
  getMonthlySummary,
  getTopCategory,
} from "./search.js";

// Application state
let state = {
  // UI state
  currentSection: "dashboard",
  isLoading: false,
  error: null,

  // Data
  transactions: [],
  filteredTransactions: [],
  categories: [],
  settings: {},

  // Search and filters
  searchQuery: "",
  selectedCategory: "",
  sortBy: "date-desc",

  // UI state for forms
  isEditing: false,
  currentTransactionId: null,

  // Pagination
  currentPage: 1,
  itemsPerPage: 10,
};

// Subscribers for state changes
const subscribers = [];

/**
 * Subscribe to state changes
 * @param {Function} callback - Function to call when state changes
 * @returns {Function} Unsubscribe function
 */
function subscribe(callback) {
  subscribers.push(callback);

  // Return unsubscribe function
  return () => {
    const index = subscribers.indexOf(callback);
    if (index > -1) {
      subscribers.splice(index, 1);
    }
  };
}

/**
 * Update state and notify subscribers
 * @param {Object} updates - New state values
 */
function setState(updates) {
  state = { ...state, ...updates };
  notifySubscribers();
}

/**
 * Notify all subscribers of state changes
 */
function notifySubscribers() {
  subscribers.forEach((callback) => callback(state));
}

/**
 * Load initial data from storage
 */
async function loadInitialData() {
  setState({ isLoading: true });

  try {
    const [transactions, settings] = await Promise.all([
      getStoredTransactions(),
      getStoredSettings(),
    ]);

    const categories = getStoredCategories();

    setState({
      transactions,
      settings,
      categories,
      filteredTransactions: applyFilters(
        transactions,
        state.searchQuery,
        state.selectedCategory,
        state.sortBy
      ),
      isLoading: false,
    });
  } catch (error) {
    console.error("Error loading initial data:", error);
    setState({
      error: "Failed to load data. Please try refreshing the page.",
      isLoading: false,
    });
  }
}

/**
 * Apply filters to transactions
 * @param {Array} transactions - Transactions to filter
 * @param {string} query - Search query
 * @param {string} category - Category filter
 * @param {string} sortBy - Sort field and direction
 * @returns {Array} Filtered and sorted transactions
 */
function applyFilters(transactions, query, category, sortBy) {
  return searchTransactions(transactions, { query, category, sortBy });
}

/**
 * Add a new transaction
 * @param {Object} transaction - Transaction data
 * @returns {Promise<boolean>} True if successful
 */
async function addTransaction(transaction) {
  try {
    setState({ isLoading: true });

    await addStoredTransaction(transaction);
    const transactions = await getStoredTransactions();

    setState({
      transactions,
      filteredTransactions: applyFilters(
        transactions,
        state.searchQuery,
        state.selectedCategory,
        state.sortBy
      ),
      isLoading: false,
    });

    return true;
  } catch (error) {
    console.error("Error adding transaction:", error);
    setState({
      error: "Failed to add transaction. Please try again.",
      isLoading: false,
    });
    return false;
  }
}

/**
 * Update an existing transaction
 * @param {string} id - Transaction ID
 * @param {Object} updates - Updated transaction data
 * @returns {Promise<boolean>} True if successful
 */
async function updateTransaction(id, updates) {
  try {
    setState({ isLoading: true });

    await updateStoredTransaction(id, updates);
    const transactions = await getStoredTransactions();

    setState({
      transactions,
      filteredTransactions: applyFilters(
        transactions,
        state.searchQuery,
        state.selectedCategory,
        state.sortBy
      ),
      isLoading: false,
      isEditing: false,
      currentTransactionId: null,
    });

    return true;
  } catch (error) {
    console.error("Error updating transaction:", error);
    setState({
      error: "Failed to update transaction. Please try again.",
      isLoading: false,
    });
    return false;
  }
}

/**
 * Delete a transaction
 * @param {string} id - Transaction ID to delete
 * @returns {Promise<boolean>} True if successful
 */
async function deleteTransaction(id) {
  try {
    setState({ isLoading: true });

    await deleteStoredTransaction(id);
    const transactions = await getStoredTransactions();

    setState({
      transactions,
      filteredTransactions: applyFilters(
        transactions,
        state.searchQuery,
        state.selectedCategory,
        state.sortBy
      ),
      isLoading: false,
    });

    return true;
  } catch (error) {
    console.error("Error deleting transaction:", error);
    setState({
      error: "Failed to delete transaction. Please try again.",
      isLoading: false,
    });
    return false;
  }
}

/**
 * Set the search query and update filtered transactions
 * @param {string} query - Search query
 */
function setSearchQuery(query) {
  const filteredTransactions = applyFilters(
    state.transactions,
    query,
    state.selectedCategory,
    state.sortBy
  );

  setState({
    searchQuery: query,
    filteredTransactions,
    currentPage: 1, // Reset to first page when search changes
  });
}

/**
 * Set the selected category filter
 * @param {string} category - Category to filter by (empty string for all)
 */
function setSelectedCategory(category) {
  const filteredTransactions = applyFilters(
    state.transactions,
    state.searchQuery,
    category,
    state.sortBy
  );

  setState({
    selectedCategory: category,
    filteredTransactions,
    currentPage: 1, // Reset to first page when filter changes
  });
}

/**
 * Set the sort field and direction
 * @param {string} sortBy - Sort field and direction (e.g., 'date-desc')
 */
function setSortBy(sortBy) {
  const filteredTransactions = applyFilters(
    state.transactions,
    state.searchQuery,
    state.selectedCategory,
    sortBy
  );

  setState({
    sortBy,
    filteredTransactions,
  });
}

/**
 * Set the current page for pagination
 * @param {number} page - Page number (1-based)
 */
function setCurrentPage(page) {
  setState({ currentPage: page });
}

/**
 * Navigate to a different section
 * @param {string} sectionId - ID of the section to navigate to
 */
function navigateTo(sectionId) {
  setState({
    currentSection: sectionId,
    isEditing: false,
    currentTransactionId: null,
  });
}

/**
 * Start editing a transaction
 * @param {string} id - Transaction ID to edit
 */
function startEditingTransaction(id) {
  setState({
    isEditing: true,
    currentTransactionId: id,
  });
}

/**
 * Cancel editing a transaction
 */
function cancelEditingTransaction() {
  setState({
    isEditing: false,
    currentTransactionId: null,
  });
}

/**
 * Update application settings
 * @param {Object} newSettings - New settings to update
 * @returns {Promise<boolean>} True if successful
 */
async function updateSettings(newSettings) {
  try {
    setState({ isLoading: true });

    await updateStoredSettings(newSettings);
    const settings = await getStoredSettings();

    setState({
      settings,
      isLoading: false,
    });

    return true;
  } catch (error) {
    console.error("Error updating settings:", error);
    setState({
      error: "Failed to update settings. Please try again.",
      isLoading: false,
    });
    return false;
  }
}

/**
 * Add a new category
 * @param {string} category - Category name to add
 * @returns {Promise<boolean>} True if successful
 */
async function addCategory(category) {
  try {
    setState({ isLoading: true });

    await addStoredCategory(category);
    const categories = getStoredCategories();

    setState({
      categories,
      isLoading: false,
    });

    return true;
  } catch (error) {
    console.error("Error adding category:", error);
    setState({
      error: "Failed to add category. It may already exist.",
      isLoading: false,
    });
    return false;
  }
}

/**
 * Delete a category
 * @param {string} category - Category name to delete
 * @returns {Promise<boolean>} True if successful
 */
async function deleteCategory(category) {
  try {
    setState({ isLoading: true });

    await deleteStoredCategory(category);
    const categories = getStoredCategories();

    setState({
      categories,
      isLoading: false,
    });

    return true;
  } catch (error) {
    console.error("Error deleting category:", error);
    setState({
      error:
        "Failed to delete category. It may be in use or a default category.",
      isLoading: false,
    });
    return false;
  }
}

/**
 * Export all data as a JSON string
 * @returns {string} JSON string of all data
 */
function exportAllData() {
  return exportData();
}

/**
 * Import data from a JSON string
 * @param {string} jsonString - JSON string to import
 * @returns {Promise<boolean>} True if successful
 */
async function importAllData(jsonString) {
  try {
    setState({ isLoading: true });

    const data = importData(jsonString);

    if (!data) {
      throw new Error("Invalid data format");
    }

    const [transactions, settings] = await Promise.all([
      getStoredTransactions(),
      getStoredSettings(),
    ]);

    const categories = getStoredCategories();

    setState({
      transactions,
      settings,
      categories,
      filteredTransactions: applyFilters(
        transactions,
        state.searchQuery,
        state.selectedCategory,
        state.sortBy
      ),
      isLoading: false,
    });

    return true;
  } catch (error) {
    console.error("Error importing data:", error);
    setState({
      error:
        "Failed to import data. The file may be corrupted or in an incorrect format.",
      isLoading: false,
    });
    return false;
  }
}

/**
 * Get dashboard statistics
 * @returns {Object} Dashboard statistics
 */
function getDashboardStats() {
  const recentTransactions = getRecentTransactions(state.transactions, 30);
  const totalSpent = calculateTotal(recentTransactions);
  const categorySummary = getCategorySummary(recentTransactions);
  const monthlySummary = getMonthlySummary(recentTransactions);
  const { category: topCategory, amount: topCategoryAmount } =
    getTopCategory(recentTransactions);

  return {
    totalSpent,
    transactionCount: recentTransactions.length,
    topCategory,
    topCategoryAmount,
    categorySummary,
    monthlySummary,
  };
}

// Initialize the application
loadInitialData();

// Export public API
export default {
  // State access
  getState: () => state,
  subscribe,

  // Navigation
  navigateTo,

  // Transactions
  addTransaction,
  updateTransaction,
  deleteTransaction,
  startEditingTransaction,
  cancelEditingTransaction,

  // Search and filters
  setSearchQuery,
  setSelectedCategory,
  setSortBy,
  setCurrentPage,

  // Categories
  addCategory,
  deleteCategory,

  // Settings
  updateSettings,

  // Import/Export
  exportAllData,
  importAllData,

  // Dashboard
  getDashboardStats,

  // Maintenance
  clearAllTransactions: async () => {
    try {
      setState({ isLoading: true });
      const ok = await clearStoredTransactions();
      const transactions = await getStoredTransactions();
      setState({
        transactions,
        filteredTransactions: applyFilters(
          transactions,
          state.searchQuery,
          state.selectedCategory,
          state.sortBy
        ),
        isLoading: false,
      });
      return ok;
    } catch (error) {
      console.error("Error clearing transactions:", error);
      setState({ isLoading: false });
      return false;
    }
  },
};

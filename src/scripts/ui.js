// UI module - Handles all DOM manipulation and event listeners

import state from "./state.js";
import {
  validateDescription,
  validateAmount,
  validateCategory,
  validateDate,
} from "./validators.js";

// DOM Elements - will be initialized after components are loaded
let elements = {};

// State for UI
let uiState = {
  currentTransactionId: null,
  confirmCallback: null,
};

/**
 * Initialize DOM element references after components are loaded
 */
function initElements() {
  elements = {
    // Main sections
    sections: {
      dashboard: document.getElementById("dashboard"),
      transactions: document.getElementById("transactions"),
      "add-transaction": document.getElementById("add-transaction"),
      settings: document.getElementById("settings"),
      about: document.getElementById("about"),
    },

    // Navigation
    navLinks: document.querySelectorAll(".nav-link"),

    // Transaction form
    transactionForm: document.getElementById("transaction-form"),
    transactionDescription: document.getElementById("transaction-description"),
    transactionAmount: document.getElementById("transaction-amount"),
    transactionCategory: document.getElementById("transaction-category"),
    transactionDate: document.getElementById("transaction-date"),

    // Transaction list
    transactionsList: document.getElementById("transactions-list"),
    recentTransactions: document.getElementById("recent-transactions"),

    // Search and filters
    searchInput: document.getElementById("search-transactions"),
    clearSearchBtn: document.getElementById("clear-search"),
    filterCategory: document.getElementById("filter-category"),
    sortBy: document.getElementById("sort-by"),

    // Dashboard elements
    totalBalance: document.getElementById("total-balance"),
    monthlyTotal: document.getElementById("monthly-total"),
    topCategory: document.getElementById("top-category"),

    // Settings form
    settingsForm: document.getElementById("settings-form"),
    monthlyBudget: document.getElementById("monthly-budget"),

    // Modals
    editModal: document.getElementById("edit-modal"),
    confirmDialog: document.getElementById("confirm-dialog"),
    confirmMessage: document.getElementById("confirm-message"),
    confirmYes: document.getElementById("confirm-yes"),
    confirmNo: document.getElementById("confirm-no"),

    // Status message
    statusMessage: document.getElementById("status-message"),
  };
}

/**
 * Initialize the UI
 */
function init() {
  // Initialize DOM element references
  initElements();

  // Set up event listeners
  setupEventListeners();

  // Initial render with current state
  render(state.getState());

  // Set current date as default and max for new transactions
  const today = new Date().toISOString().split("T")[0];
  if (elements.transactionDate) {
    elements.transactionDate.value = today;
    elements.transactionDate.setAttribute("max", today);
  }

  console.log("✓ UI initialized");
  console.log("Current state:", state.getState());
}

/**
 * Set up all event listeners
 */
function setupEventListeners() {
  // Navigation
  elements.navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const sectionId = link.getAttribute("data-section");
      state.navigateTo(sectionId);
    });
  });

  // Transaction form
  elements.transactionForm.addEventListener("submit", handleTransactionSubmit);

  // Search and filters
  elements.searchInput.addEventListener("input", (e) => {
    state.setSearchQuery(e.target.value);
  });

  elements.clearSearchBtn.addEventListener("click", () => {
    elements.searchInput.value = "";
    state.setSearchQuery("");
  });

  elements.filterCategory.addEventListener("change", (e) => {
    state.setSelectedCategory(e.target.value);
  });

  elements.sortBy.addEventListener("change", (e) => {
    state.setSortBy(e.target.value);
  });

  // Settings form
  elements.settingsForm.addEventListener("submit", handleSettingsSubmit);

  // Export/Import buttons
  const exportBtn = document.getElementById("export-json");
  const exportCsvBtn = document.getElementById("export-csv");
  const importBtn = document.getElementById("import-json");
  const importFileInput = document.getElementById("import-json-file");
  const clearDataBtn = document.getElementById("clear-data");

  if (exportBtn) {
    exportBtn.addEventListener("click", handleExportData);
  }

  if (exportCsvBtn) {
    exportCsvBtn.addEventListener("click", handleExportCsv);
  }

  if (importBtn) {
    importBtn.addEventListener("click", () => {
      importFileInput?.click();
    });
  }

  if (importFileInput) {
    importFileInput.addEventListener("change", handleImportData);
  }

  if (clearDataBtn) {
    clearDataBtn.addEventListener("click", async (e) => {
      e.preventDefault();
      showConfirm(
        "Are you sure you want to delete ALL transactions? Settings will be kept.",
        async () => {
          const ok = await state.clearAllTransactions();
          if (ok) {
            showStatus("All transactions cleared.", "success");
            // If currently on transactions page, re-render list (now empty)
            if (state.getState().currentSection === "transactions") {
              renderTransactionList([], 1, state.getState().itemsPerPage);
            }
          } else {
            showStatus("Failed to clear transactions.", "error");
          }
        }
      );
    });
  }

  // Modal close buttons
  document.querySelectorAll(".close-modal").forEach((btn) => {
    btn.addEventListener("click", closeAllModals);
  });

  // Close modal when clicking outside content
  window.addEventListener("click", (e) => {
    if (e.target === elements.editModal) {
      closeAllModals();
    }
    if (e.target === elements.confirmDialog) {
      closeAllModals();
    }
  });

  // Confirm dialog buttons
  elements.confirmYes.addEventListener("click", handleConfirmYes);
  elements.confirmNo.addEventListener("click", closeAllModals);

  // Keyboard navigation
  document.addEventListener("keydown", (e) => {
    // Close modals on Escape key
    if (e.key === "Escape") {
      closeAllModals();
    }
  });
}

/**
 * Handle transaction form submission
 * @param {Event} e - Form submit event
 */
async function handleTransactionSubmit(e) {
  e.preventDefault();

  // Get form data
  const formData = new FormData(elements.transactionForm);
  const transactionData = {
    description: formData.get("description"),
    amount: parseFloat(formData.get("amount")),
    category: formData.get("category"),
    date: formData.get("date"),
  };

  console.log("🚀 TRANSACTION");
  console.log(transactionData);

  // Validate form data
  const descriptionValidation = validateDescription(
    transactionData.description
  );
  const amountValidation = validateAmount(transactionData.amount);
  const categoryValidation = validateCategory(transactionData.category);
  const dateValidation = validateDate(transactionData.date);

  console.log("🚀 VALIDATION");
  console.log(descriptionValidation);
  console.log(amountValidation);
  console.log(categoryValidation);
  console.log(dateValidation);

  // Display validation errors if any
  if (
    !descriptionValidation.isValid ||
    !amountValidation.isValid ||
    !categoryValidation.isValid ||
    !dateValidation.isValid
  ) {
    // Show error messages
    document.getElementById("description-error").textContent =
      !descriptionValidation.isValid ? descriptionValidation.message : "";

    document.getElementById("amount-error").textContent =
      !amountValidation.isValid ? amountValidation.message : "";

    document.getElementById("category-error").textContent =
      !categoryValidation.isValid ? categoryValidation.message : "";

    document.getElementById("date-error").textContent = !dateValidation.isValid
      ? dateValidation.message
      : "";

    // Show the first error message in the status
    const firstError = !descriptionValidation.isValid
      ? descriptionValidation.message
      : !amountValidation.isValid
      ? amountValidation.message
      : !categoryValidation.isValid
      ? categoryValidation.message
      : !dateValidation.isValid
      ? dateValidation.message
      : "Please fix the errors in the form";

    showStatus(firstError, "error");
    return;
  }

  try {
    // Check budget limit before adding new transaction
    if (!uiState.currentTransactionId) {
      const currentState = state.getState();
      const monthlyBudget = currentState.settings?.monthlyBudget;

      if (monthlyBudget && monthlyBudget > 0) {
        // Get current month's transactions
        const transactionDate = new Date(transactionData.date);
        const transactionMonth = `${transactionDate.getFullYear()}-${String(
          transactionDate.getMonth() + 1
        ).padStart(2, "0")}`;

        const monthlyTransactions = currentState.transactions.filter((tx) => {
          const txDate = new Date(tx.date);
          const txMonth = `${txDate.getFullYear()}-${String(
            txDate.getMonth() + 1
          ).padStart(2, "0")}`;
          return txMonth === transactionMonth;
        });

        // Calculate current month's total
        const currentMonthTotal = monthlyTransactions.reduce(
          (sum, tx) => sum + tx.amount,
          0
        );
        const newTotal = currentMonthTotal + transactionData.amount;

        // Check if adding this transaction would exceed budget
        if (newTotal > monthlyBudget) {
          const remaining = monthlyBudget - currentMonthTotal;
          showStatus(
            `Budget limit exceeded! Monthly budget: ${formatCurrency(
              monthlyBudget
            )}. ` +
              `Current spending: ${formatCurrency(currentMonthTotal)}. ` +
              `Remaining: ${formatCurrency(remaining)}. ` +
              `This transaction would exceed your budget by ${formatCurrency(
                newTotal - monthlyBudget
              )}.`,
            "error",
            8000
          );
          return;
        }
      }
    }

    // Add or update transaction
    let success = false;

    if (uiState.currentTransactionId) {
      // Update existing transaction
      success = await state.updateTransaction(
        uiState.currentTransactionId,
        transactionData
      );
      showStatus("Transaction updated successfully", "success");
    } else {
      // Add new transaction
      success = await state.addTransaction(transactionData);
      showStatus("Transaction added successfully", "success");
    }

    if (success) {
      // Reset form
      elements.transactionForm.reset();
      elements.transactionDate.value = new Date().toISOString().split("T")[0];
      uiState.currentTransactionId = null;

      // Navigate to transactions list
      state.navigateTo("transactions");
    }
  } catch (error) {
    console.error("Error saving transaction:", error);
    showStatus("Failed to save transaction. Please try again.", "error");
  }
}

/**
 * Handle settings form submission
 * @param {Event} e - Form submit event
 */
async function handleSettingsSubmit(e) {
  e.preventDefault();

  const formData = new FormData(elements.settingsForm);
  const settingsData = {
    currency: formData.get("currency"),
    monthlyBudget: formData.get("monthly-budget")
      ? parseFloat(formData.get("monthly-budget"))
      : null,
    usdToRwf: formData.get("usd-to-rwf")
      ? parseFloat(formData.get("usd-to-rwf"))
      : 1452.49,
    eurToRwf: formData.get("eur-to-rwf")
      ? parseFloat(formData.get("eur-to-rwf"))
      : 1681.4,
  };

  try {
    const success = await state.updateSettings(settingsData);

    if (success) {
      showStatus("Settings saved successfully. Refreshing...", "success");

      // Reload the page after a short delay to show the success message
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  } catch (error) {
    console.error("Error saving settings:", error);
    showStatus("Failed to save settings. Please try again.", "error");
  }
}

/**
 * Handle confirm dialog "Yes" button click
 */
async function handleConfirmYes() {
  if (typeof uiState.confirmCallback === "function") {
    try {
      await uiState.confirmCallback();
    } catch (error) {
      console.error("Error in confirmation callback:", error);
    }
  }
  closeAllModals();
}

/**
 * Show confirmation dialog
 * @param {string} message - The message to display
 * @param {Function} callback - Callback function to execute on confirmation
 */
function showConfirm(message, callback) {
  uiState.confirmCallback = callback;
  elements.confirmMessage.textContent = message;
  elements.confirmDialog.classList.add("show");
  document.body.style.overflow = "hidden";

  // Focus the "No" button by default for safety
  elements.confirmNo.focus();
}

/**
 * Close all modals and dialogs
 */
function closeAllModals() {
  elements.editModal.classList.remove("show");
  elements.confirmDialog.classList.remove("show");
  document.body.style.overflow = "";
  uiState.confirmCallback = null;

  // Reset the form if it's open in the modal
  if (uiState.currentTransactionId) {
    elements.transactionForm.reset();
    uiState.currentTransactionId = null;
  }
}

/**
 * Show status message
 * @param {string} message - The message to display
 * @param {string} type - Message type (success, error, info)
 * @param {number} duration - Duration in milliseconds (default: 5000)
 */
function showStatus(message, type = "info", duration = 5000) {
  const status = elements.statusMessage;
  status.textContent = message;
  status.className = `status-message ${type}`;
  status.classList.add("show");

  // Auto-hide after duration
  setTimeout(() => {
    status.classList.remove("show");
  }, duration);
}

/**
 * Render the UI based on current state
 */
function render(state) {
  // Update active navigation
  updateActiveNav(state.currentSection);

  // Show the current section
  showSection(state.currentSection);

  // Update transaction list if on transactions page
  if (state.currentSection === "transactions") {
    console.log("Rendering transactions:", state.filteredTransactions.length);
    renderTransactionList(
      state.filteredTransactions,
      state.currentPage,
      state.itemsPerPage
    );
  }

  // Update dashboard if on dashboard page
  if (state.currentSection === "dashboard") {
    renderDashboard(state);
  }

  // Update settings form if on settings page
  if (state.currentSection === "settings") {
    renderSettingsForm(state.settings);
  }

  // Update categories dropdown
  updateCategoryDropdowns(state.categories);
}

/**
 * Update active navigation link
 * @param {string} activeSection - ID of the active section
 */
function updateActiveNav(activeSection) {
  elements.navLinks.forEach((link) => {
    if (link.getAttribute("data-section") === activeSection) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });
}

/**
 * Show a specific section and hide others
 * @param {string} sectionId - ID of the section to show
 */
function showSection(sectionId) {
  // Hide all sections
  Object.values(elements.sections).forEach((section) => {
    section.classList.remove("active");
  });

  // Show the requested section
  if (elements.sections[sectionId]) {
    elements.sections[sectionId].classList.add("active");
  }

  // Set max date when showing add-transaction section
  if (sectionId === "add-transaction" && elements.transactionDate) {
    const today = new Date().toISOString().split("T")[0];
    elements.transactionDate.setAttribute("max", today);
    if (!elements.transactionDate.value) {
      elements.transactionDate.value = today;
    }
  }

  // Scroll to top
  window.scrollTo(0, 0);
}

/**
 * Render the transaction list
 * @param {Array} transactions - Array of transactions to display
 * @param {number} currentPage - Current page number
 * @param {number} itemsPerPage - Number of items per page
 */
function renderTransactionList(
  transactions,
  currentPage = 1,
  itemsPerPage = 10
) {
  const container = elements.transactionsList;

  console.log("📊 renderTransactionList called");
  console.log("Transactions to render:", transactions);
  console.log("Container element:", container);

  if (!container) {
    console.error("❌ Transaction list container not found!");
    return;
  }

  if (!transactions || transactions.length === 0) {
    console.log("⚠️ No transactions to display");
    container.innerHTML = `
            <tr class="empty-row">
                <td colspan="5">No transactions found</td>
            </tr>
        `;
    return;
  }

  console.log("✅ Rendering", transactions.length, "transactions");

  // Calculate pagination
  const totalPages = Math.ceil(transactions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, transactions.length);
  const paginatedTransactions = transactions.slice(startIndex, endIndex);

  // Generate transaction rows
  const rows = paginatedTransactions
    .map((transaction) => {
      const amountClass = transaction.amount < 0 ? "expense" : "income";
      const formattedAmount = formatCurrency(Math.abs(transaction.amount));
      const formattedDate = formatDate(transaction.date);

      return `
            <tr data-id="${transaction.id}">
                <td>${formattedDate}</td>
                <td>${escapeHtml(transaction.description)}</td>
                <td><span class="category-badge">${escapeHtml(
                  transaction.category
                )}</span></td>
                <td class="amount ${amountClass}">${
        transaction.amount < 0 ? "-" : ""
      }${formattedAmount}</td>
                <td class="actions">
                    <button class="btn-icon edit-transaction" aria-label="Edit transaction">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-icon delete-transaction" aria-label="Delete transaction">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    })
    .join("");

  // Add pagination controls
  let pagination = "";
  if (totalPages > 1) {
    pagination = `
            <tr class="pagination-row">
                <td colspan="5">
                    <div class="pagination">
                        <button class="btn ${
                          currentPage === 1 ? "disabled" : ""
                        }" 
                                onclick="state.setCurrentPage(${
                                  currentPage - 1
                                })" 
                                ${currentPage === 1 ? "disabled" : ""}>
                            Previous
                        </button>
                        <span>Page ${currentPage} of ${totalPages}</span>
                        <button class="btn ${
                          currentPage === totalPages ? "disabled" : ""
                        }" 
                                onclick="state.setCurrentPage(${
                                  currentPage + 1
                                })" 
                                ${currentPage === totalPages ? "disabled" : ""}>
                            Next
                        </button>
                    </div>
                </td>
            </tr>
        `;
  }

  container.innerHTML = rows + pagination;

  // Add event listeners to action buttons
  container.querySelectorAll(".edit-transaction").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const row = e.target.closest("tr");
      const transactionId = row.getAttribute("data-id");
      editTransaction(transactionId);
    });
  });

  container.querySelectorAll(".delete-transaction").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const row = e.target.closest("tr");
      const transactionId = row.getAttribute("data-id");
      deleteTransaction(transactionId);
    });
  });
}

/**
 * Render the dashboard with summary and recent transactions
 * @param {Object} stateData - Current application state data
 */
function renderDashboard(stateData) {
  const stats = state.getDashboardStats();

  // Update summary cards
  elements.totalBalance.textContent = formatCurrency(stats.totalSpent);

  const currentMonthTotal = stats.monthlySummary[getCurrentMonthYear()] || 0;
  elements.monthlyTotal.textContent = formatCurrency(currentMonthTotal);

  // Update budget information
  const monthlyBudgetDisplay = document.getElementById(
    "monthly-budget-display"
  );
  const remainingBudgetDisplay = document.getElementById("remaining-budget");
  const monthlyBudget = stateData.settings?.monthlyBudget;

  if (monthlyBudget && monthlyBudget > 0) {
    monthlyBudgetDisplay.textContent = formatCurrency(monthlyBudget);

    const remaining = monthlyBudget - currentMonthTotal;
    remainingBudgetDisplay.textContent = formatCurrency(remaining);

    // Add color coding based on budget status
    if (remaining < 0) {
      remainingBudgetDisplay.style.color = "var(--danger-color, #dc3545)";
      remainingBudgetDisplay.textContent =
        formatCurrency(Math.abs(remaining)) + " over";
    } else if (remaining < monthlyBudget * 0.2) {
      remainingBudgetDisplay.style.color = "var(--warning-color, #ffc107)";
    } else {
      remainingBudgetDisplay.style.color = "var(--success-color, #28a745)";
    }
  } else {
    monthlyBudgetDisplay.textContent = "Not Set";
    remainingBudgetDisplay.textContent = "-";
    remainingBudgetDisplay.style.color = "";
  }

  if (stats.topCategory) {
    elements.topCategory.textContent = `${stats.topCategory} (${formatCurrency(
      stats.topCategoryAmount
    )})`;
  } else {
    elements.topCategory.textContent = "N/A";
  }

  // Render recent transactions (last 5)
  const recentTransactions = stateData.transactions.slice(0, 5);
  renderRecentTransactions(recentTransactions);

  // TODO: Render charts if using a charting library
}

/**
 * Render recent transactions for the dashboard
 * @param {Array} transactions - Array of recent transactions
 */
function renderRecentTransactions(transactions) {
  const container = elements.recentTransactions;

  if (!transactions || transactions.length === 0) {
    container.innerHTML =
      '<p class="empty-state">No recent transactions. Add your first transaction to get started!</p>';
    return;
  }

  const items = transactions
    .map((transaction) => {
      const amountClass = transaction.amount < 0 ? "expense" : "income";
      const formattedAmount = formatCurrency(Math.abs(transaction.amount));
      const formattedDate = formatDate(transaction.date);

      return `
            <div class="transaction-card">
                <div class="transaction-card-header">
                    <div class="transaction-card-icon ${amountClass}">
                        <i class="fas fa-${
                          transaction.amount < 0 ? "arrow-down" : "arrow-up"
                        }"></i>
                    </div>
                    <div class="transaction-card-info">
                        <h4 class="transaction-card-title">${escapeHtml(
                          transaction.description
                        )}</h4>
                        <div class="transaction-card-meta">
                            <span class="transaction-card-category">
                                <i class="fas fa-tag"></i> ${escapeHtml(
                                  transaction.category
                                )}
                            </span>
                            <span class="transaction-card-date">
                                <i class="fas fa-calendar"></i> ${formattedDate}
                            </span>
                        </div>
                    </div>
                </div>
                <div class="transaction-card-amount ${amountClass}">
                    ${transaction.amount < 0 ? "-" : "+"}${formattedAmount}
                </div>
            </div>
        `;
    })
    .join("");

  container.innerHTML = items;
}

/**
 * Render the settings form with current settings
 * @param {Object} settings - Current application settings
 */
function renderSettingsForm(settings = {}) {
  if (!settings) return;

  // Set currency radio button
  const currencyRadio = document.querySelector(
    `input[name="currency"][value="${settings.currency || "USD"}"]`
  );
  if (currencyRadio) {
    currencyRadio.checked = true;
  }

  // Set monthly budget
  if (settings.monthlyBudget !== null && settings.monthlyBudget !== undefined) {
    elements.monthlyBudget.value = settings.monthlyBudget;
  } else {
    elements.monthlyBudget.value = "";
  }

  // Set conversion rates
  const usdToRwfInput = document.getElementById("usd-to-rwf");
  const eurToRwfInput = document.getElementById("eur-to-rwf");

  if (usdToRwfInput) {
    usdToRwfInput.value = settings.usdToRwf || 1452.49;
  }

  if (eurToRwfInput) {
    eurToRwfInput.value = settings.eurToRwf || 1681.4;
  }
}

/**
 * Update category dropdowns with current categories
 * @param {Array} categories - Array of category names
 */
function updateCategoryDropdowns(categories = []) {
  if (!Array.isArray(categories)) return;

  // Update transaction form category dropdown
  const categorySelects = [
    elements.transactionCategory,
    elements.filterCategory,
  ];

  categorySelects.forEach((select) => {
    if (!select) return;

    // Store current value
    const currentValue = select.value;

    // Clear existing options except the first one (default/placeholder)
    while (select.options.length > 1) {
      select.remove(1);
    }

    // Add categories
    categories.forEach((category) => {
      const option = document.createElement("option");
      option.value = category;
      option.textContent = category;
      select.appendChild(option);
    });

    // Restore selected value if it still exists
    if (currentValue && categories.includes(currentValue)) {
      select.value = currentValue;
    }
  });
}

/**
 * Open the edit transaction modal
 * @param {string} transactionId - ID of the transaction to edit
 */
async function editTransaction(transactionId) {
  try {
    const transaction = state
      .getState()
      .transactions.find((t) => t.id === transactionId);

    if (!transaction) {
      throw new Error("Transaction not found");
    }

    // Set form values
    elements.transactionDescription.value = transaction.description;
    elements.transactionAmount.value = Math.abs(transaction.amount);
    elements.transactionCategory.value = transaction.category;
    elements.transactionDate.value = transaction.date;

    // Update form title and submit button
    document.querySelector("#add-transaction h2").textContent =
      "Edit Transaction";
    elements.transactionForm.querySelector(
      'button[type="submit"]'
    ).textContent = "Update Transaction";

    // Store the transaction ID for update
    uiState.currentTransactionId = transactionId;

    // Show the add transaction section immediately
    state.navigateTo("add-transaction");
    // Force render now so the form is visible without extra click
    showSection("add-transaction");

    // Focus the first field
    elements.transactionDescription.focus();
  } catch (error) {
    console.error("Error preparing transaction for edit:", error);
    showStatus("Failed to load transaction for editing", "error");
  }
}

/**
 * Prompt for confirmation before deleting a transaction
 * @param {string} transactionId - ID of the transaction to delete
 */
function deleteTransaction(transactionId) {
  const transaction = state
    .getState()
    .transactions.find((t) => t.id === transactionId);

  if (!transaction) {
    showStatus("Transaction not found", "error");
    return;
  }

  showConfirm(
    `Are you sure you want to delete the transaction "${escapeHtml(
      transaction.description
    )}"?`,
    async () => {
      const success = await state.deleteTransaction(transactionId);
      if (success) {
        showStatus("Transaction deleted successfully", "success");
      }
    }
  );
}

/**
 * Format a date string
 * @param {string} dateString - Date string in YYYY-MM-DD format
 * @param {Object} options - Formatting options
 * @returns {string} Formatted date string
 */
function formatDate(dateString, options = {}) {
  if (!dateString) return "";

  const date = new Date(dateString);

  if (isNaN(date.getTime())) {
    return dateString; // Return original if invalid date
  }

  if (options.short) {
    // Short format: MMM D (e.g., Jan 15)
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  }

  // Default format: Month Day, Year (e.g., January 15, 2023)
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * Format a number as currency
 * @param {number} amount - The amount to format
 * @param {string} currency - Currency code (e.g., 'USD', 'EUR', 'RWF')
 * @returns {string} Formatted currency string
 */
function formatCurrency(amount, currency) {
  // Get currency from settings if not provided
  if (!currency) {
    const currentState = state.getState();
    currency = currentState.settings?.currency || "USD";
  }

  // Special handling for RWF (Rwandan Franc)
  if (currency === "RWF") {
    const formatted = new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount || 0);
    return `${formatted} RWF`;
  }

  // Standard currency formatting for USD, EUR, etc.
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount || 0);
}

/**
 * Get current month and year in YYYY-MM format
 * @returns {string} Current month and year (e.g., '2023-04')
 */
function getCurrentMonthYear() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
}

/**
 * Escape HTML to prevent XSS
 * @param {string} unsafe - Unsafe HTML string
 * @returns {string} Escaped HTML string
 */
function escapeHtml(unsafe) {
  if (typeof unsafe !== "string") return "";
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/**
 * Handle export data button click
 */
function handleExportData() {
  try {
    const jsonData = state.exportAllData();
    const blob = new Blob([jsonData], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `finance-tracker-export-${
      new Date().toISOString().split("T")[0]
    }.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showStatus("Data exported successfully", "success");
  } catch (error) {
    console.error("Error exporting data:", error);
    showStatus("Failed to export data", "error");
  }
}

/**
 * Handle export data as CSV button click
 */
function handleExportCsv() {
  try {
    const currentState = state.getState();
    const transactions = currentState.transactions || [];

    // CSV headers
    const headers = ["Date", "Description", "Category", "Amount"];

    // Escape CSV cell values
    const escapeCell = (value) => {
      if (value === null || value === undefined) return "";
      const stringValue = String(value);
      // If contains comma, quote or newline, wrap in quotes and escape quotes
      if (/[",\n\r]/.test(stringValue)) {
        return '"' + stringValue.replace(/"/g, '""') + '"';
      }
      return stringValue;
    };

    const rows = transactions.map((tx) => [
      tx.date,
      tx.description,
      tx.category,
      tx.amount,
    ]);

    const csvLines = [headers, ...rows]
      .map((row) => row.map(escapeCell).join(","))
      .join("\r\n");

    const blob = new Blob([csvLines], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `finance-tracker-transactions-${
      new Date().toISOString().split("T")[0]
    }.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showStatus("CSV exported successfully", "success");
  } catch (error) {
    console.error("Error exporting CSV:", error);
    showStatus("Failed to export CSV", "error");
  }
}

/**
 * Handle import data file selection
 */
async function handleImportData(e) {
  const file = e.target.files?.[0];
  if (!file) return;

  try {
    const text = await file.text();
    const success = await state.importAllData(text);

    if (success) {
      showStatus("Data imported successfully", "success");
      // Reset file input
      e.target.value = "";
    } else {
      showStatus("Failed to import data. Invalid file format.", "error");
    }
  } catch (error) {
    console.error("Error importing data:", error);
    showStatus("Failed to import data", "error");
  }
}

// Initialize the UI when components are loaded
document.addEventListener("componentsLoaded", () => {
  init();
  // Subscribe to state changes after initialization
  state.subscribe(render);
});

// Make UI functions available globally for inline event handlers
window.state = state;

// Export functions for use in other modules
export { showStatus };

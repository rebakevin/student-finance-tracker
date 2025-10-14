// Storage module - Handles all data persistence using localStorage

// Constants
const STORAGE_KEY = 'student-finance-tracker';
const DEFAULT_CURRENCY = 'USD';
const DEFAULT_CATEGORIES = ['Food', 'Books', 'Transport', 'Entertainment', 'Fees', 'Other'];
const BASE_CURRENCY = 'RWF';
const USD_TO_RWF = 1452.49;
const EURO_TO_RWF = 1681.40;

/**
 * Get currency conversion rates from settings
 * @returns {Object} Currency rates relative to RWF as base
 */
function getCurrencyRates() {
    const settings = getSettings();
    const usdToRwf = settings.usdToRwf || USD_TO_RWF;
    const eurToRwf = settings.eurToRwf || EURO_TO_RWF;
    
    return {
        'RWF': 1,
        'USD': 1 / usdToRwf,
        'EUR': 1 / eurToRwf
    };
}

/**
 * Get available currencies
 * @returns {Array} Array of currency codes
 */
export function getAvailableCurrencies() {
    return ['RWF', 'USD', 'EUR'];
}

/**
 * Convert amount from one currency to another
 * @param {number} amount - Amount to convert
 * @param {string} fromCurrency - Source currency code
 * @param {string} toCurrency - Target currency code
 * @returns {number} Converted amount
 */
export function convertCurrency(amount, fromCurrency, toCurrency) {
    if (fromCurrency === toCurrency) return amount;
    
    // Get current conversion rates from settings
    const rates = getCurrencyRates();
    
    // Convert to RWF first (base currency)
    const amountInRWF = amount / (rates[fromCurrency] || 1);
    
    // Convert from RWF to target currency
    const convertedAmount = amountInRWF * (rates[toCurrency] || 1);
    
    return parseFloat(convertedAmount.toFixed(2));
}

// Initialize default settings if they don't exist
const defaultSettings = {
    currency: DEFAULT_CURRENCY,
    monthlyBudget: null,
    categories: [...DEFAULT_CATEGORIES],
    usdToRwf: USD_TO_RWF,
    eurToRwf: EURO_TO_RWF
};

// Initialize default data structure
const defaultData = {
    version: '1.0.0',
    settings: { ...defaultSettings },
    transactions: [],
    lastUpdated: new Date().toISOString()
};

/**
 * Load data from localStorage
 * @returns {Object} The stored data or default data if none exists
 */
export function loadData() {
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        if (!data) return { ...defaultData };
        
        const parsed = JSON.parse(data);
        
        // Merge with default data to ensure all fields exist
        return {
            ...defaultData,
            ...parsed,
            settings: {
                ...defaultData.settings,
                ...(parsed.settings || {})
            },
            // Ensure transactions is always an array
            transactions: Array.isArray(parsed.transactions) ? parsed.transactions : []
        };
    } catch (error) {
        console.error('Error loading data from localStorage:', error);
        return { ...defaultData };
    }
}

/**
 * Save data to localStorage
 * @param {Object} data - The data to save
 */
function saveData(data) {
    try {
        const dataToSave = {
            ...data,
            lastUpdated: new Date().toISOString()
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
        return true;
    } catch (error) {
        console.error('Error saving data to localStorage:', error);
        return false;
    }
}

/**
 * Get all transactions
 * @returns {Array} Array of transactions
 */
export function getTransactions() {
    const data = loadData();
    return data.transactions || [];
}

/**
 * Get a transaction by ID
 * @param {string} id - The transaction ID
 * @returns {Object|null} The transaction or null if not found
 */
export function getTransactionById(id) {
    const transactions = getTransactions();
    return transactions.find(tx => tx.id === id) || null;
}

/**
 * Add a new transaction
 * @param {Object} transaction - The transaction to add
 * @returns {boolean} True if successful, false otherwise
 */
export function addTransaction(transaction) {
    const data = loadData();
    const now = new Date().toISOString();
    
    const newTransaction = {
        ...transaction,
        id: `txn_${Date.now()}`,
        amount: parseFloat(transaction.amount),
        date: transaction.date || new Date().toISOString().split('T')[0],
        createdAt: now,
        updatedAt: now
    };
    
    data.transactions = [newTransaction, ...data.transactions];
    return saveData(data);
}

/**
 * Update an existing transaction
 * @param {string} id - The transaction ID
 * @param {Object} updates - The updates to apply
 * @returns {boolean} True if successful, false otherwise
 */
export function updateTransaction(id, updates) {
    const data = loadData();
    const index = data.transactions.findIndex(tx => tx.id === id);
    
    if (index === -1) return false;
    
    data.transactions[index] = {
        ...data.transactions[index],
        ...updates,
        updatedAt: new Date().toISOString()
    };
    
    return saveData(data);
}

/**
 * Delete a transaction
 * @param {string} id - The transaction ID to delete
 * @returns {boolean} True if successful, false otherwise
 */
export function deleteTransaction(id) {
    const data = loadData();
    const initialLength = data.transactions.length;
    
    data.transactions = data.transactions.filter(tx => tx.id !== id);
    
    // Only save if something was actually removed
    if (data.transactions.length < initialLength) {
        return saveData(data);
    }
    
    return false;
}

/**
 * Get application settings
 * @returns {Object} The application settings
 */
export function getSettings() {
    const data = loadData();
    return { ...defaultSettings, ...data.settings };
}

/**
 * Update application settings
 * @param {Object} newSettings - The new settings to save
 * @returns {boolean} True if successful, false otherwise
 */
export function updateSettings(newSettings) {
    const data = loadData();
    const oldCurrency = data.settings.currency || DEFAULT_CURRENCY;
    const newCurrency = newSettings.currency;
    
    // Check if currency is being changed
    if (newCurrency && newCurrency !== oldCurrency) {
        console.log(`Converting all transactions from ${oldCurrency} to ${newCurrency}`);
        
        // Convert all transaction amounts to the new currency
        data.transactions = data.transactions.map(transaction => ({
            ...transaction,
            amount: convertCurrency(transaction.amount, oldCurrency, newCurrency)
        }));
        
        // Convert monthly budget if it exists
        if (data.settings.monthlyBudget) {
            data.settings.monthlyBudget = convertCurrency(
                data.settings.monthlyBudget,
                oldCurrency,
                newCurrency
            );
        }
    }
    
    data.settings = {
        ...data.settings,
        ...newSettings
    };
    return saveData(data);
}

/**
 * Get all categories
 * @returns {Array} Array of category names
 */
export function getCategories() {
    const settings = getSettings();
    return [...new Set([...DEFAULT_CATEGORIES, ...(settings.categories || [])])];
}

/**
 * Add a new category
 * @param {string} category - The category name to add
 * @returns {boolean} True if successful, false otherwise
 */
export function addCategory(category) {
    if (!category || typeof category !== 'string') return false;
    
    const settings = getSettings();
    const categories = new Set(settings.categories || []);
    
    // Check if category already exists (case-insensitive)
    const normalizedNewCategory = category.trim();
    const categoryExists = Array.from(categories).some(
        cat => cat.toLowerCase() === normalizedNewCategory.toLowerCase()
    );
    
    if (categoryExists) return false;
    
    categories.add(normalizedNewCategory);
    return updateSettings({
        categories: Array.from(categories)
    });
}

/**
 * Delete a category
 * @param {string} category - The category name to delete
 * @returns {boolean} True if successful, false otherwise
 */
export function deleteCategory(category) {
    if (!category || typeof category !== 'string') return false;
    
    const settings = getSettings();
    const categories = new Set(settings.categories || []);
    
    // Find the category (case-insensitive)
    const categoryToDelete = Array.from(categories).find(
        cat => cat.toLowerCase() === category.toLowerCase()
    );
    
    if (!categoryToDelete || DEFAULT_CATEGORIES.includes(categoryToDelete)) {
        return false; // Don't allow deleting default categories
    }
    
    categories.delete(categoryToDelete);
    return updateSettings({
        categories: Array.from(categories)
    });
}

/**
 * Clear all data (reset to defaults)
 * @returns {boolean} True if successful, false otherwise
 */
export function clearAllData() {
    try {
        localStorage.removeItem(STORAGE_KEY);
        return true;
    } catch (error) {
        console.error('Error clearing data:', error);
        return false;
    }
}

/**
 * Export all data as a JSON string
 * @returns {string} JSON string of all data
 */
export function exportData() {
    return JSON.stringify(loadData(), null, 2);
}

/**
 * Import data from a JSON string
 * @param {string} jsonString - The JSON string to import
 * @returns {Object} The imported data or null if invalid
 */
export function importData(jsonString) {
    try {
        const data = JSON.parse(jsonString);
        
        // Basic validation
        if (!data || typeof data !== 'object') {
            throw new Error('Invalid data format');
        }
        
        // Ensure we have the minimum required structure
        const importedData = {
            ...defaultData,
            ...data,
            settings: {
                ...defaultData.settings,
                ...(data.settings || {})
            },
            transactions: Array.isArray(data.transactions) ? data.transactions : []
        };
        
        // Save the imported data
        if (saveData(importedData)) {
            return importedData;
        }
        
        return null;
    } catch (error) {
        console.error('Error importing data:', error);
        return null;
    }
}

// Initialize data if it doesn't exist
(function init() {
    if (!localStorage.getItem(STORAGE_KEY)) {
        saveData(defaultData);
    }
})();

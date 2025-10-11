// Search module - Handles searching and filtering transactions

import { validateSearchPattern } from './validators.js';

/**
 * Search and filter transactions based on criteria
 * @param {Array} transactions - Array of transactions to search through
 * @param {Object} options - Search options
 * @param {string} options.query - Search query (regex pattern)
 * @param {string} options.category - Category filter
 * @param {string} options.sortBy - Sort field and direction (e.g., 'date-desc', 'amount-asc')
 * @param {number} options.limit - Maximum number of results to return (optional)
 * @returns {Array} Filtered and sorted array of transactions
 */
export function searchTransactions(transactions, { query = '', category = '', sortBy = 'date-desc', limit = 0 } = {}) {
    if (!Array.isArray(transactions)) {
        console.error('Transactions must be an array');
        return [];
    }

    // Filter by category if specified
    let results = transactions;
    if (category) {
        results = results.filter(transaction => 
            transaction.category.toLowerCase() === category.toLowerCase()
        );
    }

    // Apply search query if provided
    if (query) {
        const { isValid, regex } = validateSearchPattern(query);
        
        if (isValid && regex) {
            results = results.filter(transaction => {
                // Search in description and category
                return regex.test(transaction.description) || 
                       regex.test(transaction.category);
            });
        } else if (!isValid) {
            // If the search pattern is invalid, return no results
            return [];
        }
    }

    // Sort the results
    results = sortTransactions(results, sortBy);

    // Apply limit if specified
    if (limit > 0) {
        results = results.slice(0, limit);
    }

    return results;
}

/**
 * Sort transactions by the specified field and direction
 * @param {Array} transactions - Array of transactions to sort
 * @param {string} sortBy - Sort field and direction (e.g., 'date-desc', 'amount-asc')
 * @returns {Array} Sorted array of transactions
 */
export function sortTransactions(transactions, sortBy = 'date-desc') {
    if (!Array.isArray(transactions)) {
        console.error('Transactions must be an array');
        return [];
    }

    // Create a copy of the array to avoid mutating the original
    const sorted = [...transactions];

    // Parse sort field and direction
    const [field, direction = 'desc'] = sortBy.split('-');
    const sortOrder = direction.toLowerCase() === 'asc' ? 1 : -1;

    sorted.sort((a, b) => {
        let valueA, valueB;

        switch (field) {
            case 'date':
                valueA = new Date(a.date).getTime();
                valueB = new Date(b.date).getTime();
                return (valueA - valueB) * sortOrder;

            case 'amount':
                valueA = parseFloat(a.amount);
                valueB = parseFloat(b.amount);
                return (valueA - valueB) * sortOrder;

            case 'category':
                valueA = a.category.toLowerCase();
                valueB = b.category.toLowerCase();
                if (valueA < valueB) return -1 * sortOrder;
                if (valueA > valueB) return 1 * sortOrder;
                return 0;

            case 'description':
            default:
                valueA = a.description.toLowerCase();
                valueB = b.description.toLowerCase();
                if (valueA < valueB) return -1 * sortOrder;
                if (valueA > valueB) return 1 * sortOrder;
                return 0;
        }
    });

    return sorted;
}

/**
 * Get unique categories from transactions
 * @param {Array} transactions - Array of transactions
 * @returns {Array} Array of unique category names
 */
export function getUniqueCategories(transactions) {
    if (!Array.isArray(transactions)) {
        return [];
    }

    const categories = new Set();
    
    transactions.forEach(transaction => {
        if (transaction.category) {
            categories.add(transaction.category);
        }
    });

    return Array.from(categories).sort();
}

/**
 * Calculate total amount for a set of transactions
 * @param {Array} transactions - Array of transactions
 * @returns {number} Total amount
 */
export function calculateTotal(transactions) {
    if (!Array.isArray(transactions)) {
        return 0;
    }

    return transactions.reduce((total, transaction) => {
        return total + parseFloat(transaction.amount || 0);
    }, 0);
}

/**
 * Get transactions summary by category
 * @param {Array} transactions - Array of transactions
 * @returns {Object} Object with category totals and percentages
 */
export function getCategorySummary(transactions) {
    if (!Array.isArray(transactions)) {
        return {
            totals: {},
            percentages: {},
            totalAmount: 0
        };
    }

    const summary = {
        totals: {},
        percentages: {},
        totalAmount: 0
    };

    // Calculate total amount and category totals
    transactions.forEach(transaction => {
        const amount = parseFloat(transaction.amount || 0);
        const category = transaction.category || 'Uncategorized';
        
        summary.totals[category] = (summary.totals[category] || 0) + amount;
        summary.totalAmount += amount;
    });

    // Calculate percentages
    if (summary.totalAmount > 0) {
        Object.keys(summary.totals).forEach(category => {
            summary.percentages[category] = (summary.totals[category] / summary.totalAmount) * 100;
        });
    }

    return summary;
}

/**
 * Get transactions for a specific date range
 * @param {Array} transactions - Array of transactions
 * @param {Date} startDate - Start date (inclusive)
 * @param {Date} endDate - End date (inclusive)
 * @returns {Array} Filtered array of transactions within the date range
 */
export function getTransactionsByDateRange(transactions, startDate, endDate) {
    if (!Array.isArray(transactions)) {
        return [];
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    
    // Set time to start/end of day for proper date comparison
    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);

    return transactions.filter(transaction => {
        const transactionDate = new Date(transaction.date);
        return transactionDate >= start && transactionDate <= end;
    });
}

/**
 * Get transactions for the last N days
 * @param {Array} transactions - Array of transactions
 * @param {number} days - Number of days to go back
 * @returns {Array} Filtered array of transactions for the last N days
 */
export function getRecentTransactions(transactions, days = 30) {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    return getTransactionsByDateRange(transactions, startDate, endDate);
}

/**
 * Highlight search matches in text
 * @param {string} text - The text to highlight matches in
 * @param {RegExp} regex - The regex pattern to search for
 * @returns {string} HTML string with matches wrapped in <mark> tags
 */
export function highlightMatches(text, regex) {
    if (!text || !regex) return text;
    
    return text.replace(regex, match => `<mark>${match}</mark>`);
}

/**
 * Get transactions summary by month
 * @param {Array} transactions - Array of transactions
 * @returns {Object} Object with monthly totals
 */
export function getMonthlySummary(transactions) {
    if (!Array.isArray(transactions)) {
        return {};
    }

    const monthlySummary = {};
    
    transactions.forEach(transaction => {
        if (!transaction.date) return;
        
        // Extract year and month from date (YYYY-MM format)
        const date = new Date(transaction.date);
        if (isNaN(date.getTime())) return;
        
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const monthKey = `${year}-${month}`;
        
        const amount = parseFloat(transaction.amount || 0);
        
        if (!monthlySummary[monthKey]) {
            monthlySummary[monthKey] = 0;
        }
        
        monthlySummary[monthKey] += amount;
    });
    
    return monthlySummary;
}

/**
 * Get the top spending category
 * @param {Array} transactions - Array of transactions
 * @returns {Object} Object with category and total amount
 */
export function getTopCategory(transactions) {
    if (!Array.isArray(transactions) || transactions.length === 0) {
        return { category: null, amount: 0 };
    }
    
    const categorySummary = getCategorySummary(transactions);
    let topCategory = null;
    let maxAmount = 0;
    
    Object.entries(categorySummary.totals).forEach(([category, amount]) => {
        if (amount > maxAmount) {
            maxAmount = amount;
            topCategory = category;
        }
    });
    
    return {
        category: topCategory,
        amount: maxAmount
    };
}

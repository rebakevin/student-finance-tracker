// Validators module - Handles all form validation using regex and other validation logic

/**
 * Validates a description/title field
 * Rules: 
 * - Cannot be empty or contain only whitespace
 * - No leading/trailing spaces
 * - Collapses multiple spaces into one
 * @param {string} value - The value to validate
 * @returns {Object} Validation result with isValid and error message
 */
export function validateDescription(value) {
    if (!value || typeof value !== 'string') {
        return {
            isValid: false,
            message: 'Description is required'
        };
    }
    
    // Check for leading/trailing spaces or multiple spaces
    if (/^\s|\s$|\s{2,}/.test(value)) {
        return {
            isValid: false,
            message: 'Description cannot have leading/trailing spaces or multiple spaces between words'
        };
    }
    
    return { isValid: true };
}

/**
 * Validates an amount field
 * Rules:
 * - Must be a positive number
 * - Can have up to 2 decimal places
 * - Cannot be negative or non-numeric
 * @param {string|number} value - The value to validate
 * @returns {Object} Validation result with isValid and error message
 */
export function validateAmount(value) {
    if (value === '' || value === null || value === undefined) {
        return {
            isValid: false,
            message: 'Amount is required'
        };
    }
    
    const numValue = parseFloat(value);
    
    if (isNaN(numValue)) {
        return {
            isValid: false,
            message: 'Please enter a valid number'
        };
    }
    
    if (numValue <= 0) {
        return {
            isValid: false,
            message: 'Amount must be greater than zero'
        };
    }
    
    // Check for more than 2 decimal places
    if (value.toString().includes('.') && value.toString().split('.')[1].length > 2) {
        return {
            isValid: false,
            message: 'Amount can have up to 2 decimal places'
        };
    }
    
    return { isValid: true };
}

/**
 * Validates a category field
 * Rules:
 * - Must be a non-empty string
 * - Can only contain letters, spaces, and hyphens
 * - Must start and end with a letter
 * @param {string} value - The value to validate
 * @returns {Object} Validation result with isValid and error message
 */
export function validateCategory(value) {
    if (!value || typeof value !== 'string' || value.trim() === '') {
        return {
            isValid: false,
            message: 'Category is required'
        };
    }
    
    // Check for valid characters and format
    const categoryRegex = /^[A-Za-z]+(?:[ -][A-Za-z]+)*$/;
    if (!categoryRegex.test(value)) {
        return {
            isValid: false,
            message: 'Category can only contain letters, spaces, and hyphens, and must start and end with a letter'
        };
    }
    
    return { isValid: true };
}

/**
 * Validates a date field
 * Rules:
 * - Must be a valid date in YYYY-MM-DD format
 * - Cannot be a future date (optional)
 * @param {string} value - The date string to validate (YYYY-MM-DD)
 * @param {Object} options - Validation options
 * @param {boolean} options.allowFuture - Whether to allow future dates (default: false)
 * @returns {Object} Validation result with isValid and error message
 */
export function validateDate(value, { allowFuture = false } = {}) {
    if (!value || typeof value !== 'string') {
        return {
            isValid: false,
            message: 'Date is required'
        };
    }
    
    // Check format with regex first
    const dateRegex = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;
    if (!dateRegex.test(value)) {
        return {
            isValid: false,
            message: 'Please enter a valid date in YYYY-MM-DD format'
        };
    }
    
    // Parse the date to check if it's valid (e.g., 2023-02-30 is invalid)
    const date = new Date(value);
    const isInvalidDate = isNaN(date.getTime());
    
    if (isInvalidDate) {
        return {
            isValid: false,
            message: 'Please enter a valid date'
        };
    }
    
    // Check if date is in the future (if not allowed)
    if (!allowFuture) {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Reset time part for comparison
        
        if (date > today) {
            return {
                isValid: false,
                message: 'Future dates are not allowed'
            };
        }
    }
    
    return { isValid: true };
}

/**
 * Validates a search query (regex pattern)
 * @param {string} value - The regex pattern to validate
 * @returns {Object} Validation result with isValid, error message, and compiled regex if valid
 */
export function validateSearchPattern(value) {
    if (!value || typeof value !== 'string' || value.trim() === '') {
        return {
            isValid: true, // Empty search is valid (shows all)
            regex: null
        };
    }
    
    try {
        // Test if the regex compiles
        const regex = new RegExp(value, 'i'); // Case-insensitive by default
        
        // Check for potentially problematic patterns (optional, for security)
        // This is a simple check and might need to be adjusted based on requirements
        if (value.length > 50) {
            return {
                isValid: false,
                message: 'Search pattern is too long',
                regex: null
            };
        }
        
        return {
            isValid: true,
            regex
        };
    } catch (error) {
        return {
            isValid: false,
            message: 'Invalid search pattern',
            regex: null
        };
    }
}

/**
 * Validates an email address
 * Uses a comprehensive regex pattern for email validation
 * @param {string} email - The email to validate
 * @returns {Object} Validation result with isValid and error message
 */
export function validateEmail(email) {
    if (!email || typeof email !== 'string') {
        return {
            isValid: false,
            message: 'Email is required'
        };
    }
    
    // Comprehensive email regex pattern
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    
    if (!emailRegex.test(email)) {
        return {
            isValid: false,
            message: 'Please enter a valid email address'
        };
    }
    
    return { isValid: true };
}

/**
 * Validates a password
 * Rules:
 * - At least 8 characters
 * - At least one uppercase letter
 * - At least one lowercase letter
 * - At least one number
 * - At least one special character
 * @param {string} password - The password to validate
 * @returns {Object} Validation result with isValid and error message
 */
export function validatePassword(password) {
    if (!password || typeof password !== 'string') {
        return {
            isValid: false,
            message: 'Password is required'
        };
    }
    
    if (password.length < 8) {
        return {
            isValid: false,
            message: 'Password must be at least 8 characters long'
        };
    }
    
    // Check for at least one uppercase letter
    if (!/[A-Z]/.test(password)) {
        return {
            isValid: false,
            message: 'Password must contain at least one uppercase letter'
        };
    }
    
    // Check for at least one lowercase letter
    if (!/[a-z]/.test(password)) {
        return {
            isValid: false,
            message: 'Password must contain at least one lowercase letter'
        };
    }
    
    // Check for at least one number
    if (!/\d/.test(password)) {
        return {
            isValid: false,
            message: 'Password must contain at least one number'
        };
    }
    
    // Check for at least one special character
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]/.test(password)) {
        return {
            isValid: false,
            message: 'Password must contain at least one special character'
        };
    }
    
    return { isValid: true };
}

/**
 * Validates that a value is not empty
 * @param {*} value - The value to check
 * @param {string} fieldName - The name of the field for the error message
 * @returns {Object} Validation result with isValid and error message
 */
export function validateRequired(value, fieldName = 'This field') {
    if (value === null || value === undefined || value === '') {
        return {
            isValid: false,
            message: `${fieldName} is required`
        };
    }
    
    return { isValid: true };
}

/**
 * Validates a currency code (ISO 4217)
 * @param {string} currency - The currency code to validate (e.g., 'USD', 'EUR')
 * @returns {Object} Validation result with isValid and error message
 */
export function validateCurrency(currency) {
    if (!currency || typeof currency !== 'string') {
        return {
            isValid: false,
            message: 'Currency is required'
        };
    }
    
    // Simple check for 3-letter uppercase currency code
    const currencyRegex = /^[A-Z]{3}$/;
    
    if (!currencyRegex.test(currency)) {
        return {
            isValid: false,
            message: 'Please enter a valid 3-letter currency code (e.g., USD, EUR, GBP)'
        };
    }
    
    return { isValid: true };
}

/**
 * Validates a budget value
 * @param {number|string} value - The budget value to validate
 * @returns {Object} Validation result with isValid and error message
 */
export function validateBudget(value) {
    if (value === '' || value === null || value === undefined) {
        return { isValid: true }; // Budget is optional
    }
    
    const numValue = parseFloat(value);
    
    if (isNaN(numValue)) {
        return {
            isValid: false,
            message: 'Please enter a valid number'
        };
    }
    
    if (numValue < 0) {
        return {
            isValid: false,
            message: 'Budget cannot be negative'
        };
    }
    
    // Check for more than 2 decimal places
    if (value.toString().includes('.') && value.toString().split('.')[1].length > 2) {
        return {
            isValid: false,
            message: 'Budget can have up to 2 decimal places'
        };
    }
    
    return { isValid: true };
}

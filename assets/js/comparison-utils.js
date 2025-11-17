// Product Comparison utility functions using localStorage
const COMPARISON_STORAGE_KEY = 'furniro-comparison';
const MAX_COMPARISON_ITEMS = 3;

// Get comparison list from localStorage
function getComparison() {
    try {
        const comparison = localStorage.getItem(COMPARISON_STORAGE_KEY);
        return comparison ? JSON.parse(comparison) : [];
    } catch (err) {
        console.error('Failed to parse comparison', err);
        return [];
    }
}

// Save comparison to localStorage
function saveComparison(comparison) {
    try {
        localStorage.setItem(COMPARISON_STORAGE_KEY, JSON.stringify(comparison));
        // Dispatch custom event for comparison updates
        window.dispatchEvent(new CustomEvent('comparisonUpdated'));
    } catch (err) {
        console.error('Failed to save comparison', err);
    }
}

// Add product to comparison
function addToComparison(product) {
    const comparison = getComparison();
    
    // Check if product already exists
    if (comparison.some(item => item.id === product.id)) {
        return { success: false, message: 'Product already in comparison' };
    }
    
    // Check if comparison is full
    if (comparison.length >= MAX_COMPARISON_ITEMS) {
        return { success: false, message: `Maximum ${MAX_COMPARISON_ITEMS} products can be compared` };
    }
    
    // Add product
    comparison.push({
        ...product,
        addedAt: new Date().toISOString()
    });
    
    saveComparison(comparison);
    return { success: true, message: 'Product added to comparison' };
}

// Remove product from comparison
function removeFromComparison(productId) {
    const comparison = getComparison().filter(item => item.id !== productId);
    saveComparison(comparison);
    return comparison;
}

// Clear comparison
function clearComparison() {
    saveComparison([]);
}

// Get comparison count
function getComparisonCount() {
    return getComparison().length;
}

// Check if product is in comparison
function isInComparison(productId) {
    return getComparison().some(item => item.id === productId);
}


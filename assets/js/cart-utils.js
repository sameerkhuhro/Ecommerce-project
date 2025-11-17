// Cart utility functions using localStorage
const CART_STORAGE_KEY = 'furniro-cart';

// Get cart from localStorage
function getCart() {
    try {
        const cart = localStorage.getItem(CART_STORAGE_KEY);
        return cart ? JSON.parse(cart) : [];
    } catch (err) {
        console.error('Failed to parse cart', err);
        return [];
    }
}

// Save cart to localStorage
function saveCart(cart) {
    try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
        // Dispatch custom event for cart updates
        window.dispatchEvent(new CustomEvent('cartUpdated'));
    } catch (err) {
        console.error('Failed to save cart', err);
    }
}

// Add item to cart
function addToCart(product) {
    const cart = getCart();
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
        // If item exists, increase quantity
        existingItem.quantity += 1;
    } else {
        // Add new item with quantity 1
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    saveCart(cart);
    
    // Open cart sidebar if available
    if (typeof window.openCartSidebar === 'function') {
        window.openCartSidebar();
    }
    
    return cart;
}

// Remove item from cart
function removeFromCart(productId) {
    const cart = getCart().filter(item => item.id !== productId);
    saveCart(cart);
    return cart;
}

// Update item quantity in cart
function updateCartQuantity(productId, quantity) {
    if (quantity <= 0) {
        return removeFromCart(productId);
    }
    
    const cart = getCart();
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity = quantity;
        saveCart(cart);
    }
    return cart;
}

// Clear cart
function clearCart() {
    saveCart([]);
}

// Get cart total
function getCartTotal() {
    const cart = getCart();
    return cart.reduce((total, item) => {
        const price = parseFloat(item.price.replace(/[^\d.]/g, '')) || 0;
        return total + (price * item.quantity);
    }, 0);
}

// Get cart item count
function getCartItemCount() {
    const cart = getCart();
    return cart.reduce((count, item) => count + item.quantity, 0);
}


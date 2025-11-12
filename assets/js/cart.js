// Cart page functionality - loads items from localStorage and displays them

// Wait for cart utilities to load
function initCart() {
    // Check if cart utilities are loaded
    if (typeof getCart !== 'function') {
        setTimeout(initCart, 100);
        return;
    }

    const cart = getCart();
    const cartSection = document.querySelector('.cart-section');
    const cartTotals = document.querySelector('.cart-totals');
    
    if (!cartSection) return;

    // Clear existing items (except header)
    const existingItems = cartSection.querySelectorAll('.cart-item');
    existingItems.forEach(item => item.remove());
    
    // Remove empty cart message if exists
    const emptyMsg = cartSection.querySelector('.cart-empty');
    if (emptyMsg) emptyMsg.remove();

    if (cart.length === 0) {
        // Hide cart header
        const cartHeader = cartSection.querySelector('.cart-header');
        if (cartHeader) cartHeader.style.display = 'none';
        
        // Show empty cart message
        const emptyMsg = document.createElement('div');
        emptyMsg.className = 'cart-empty';
        emptyMsg.style.textAlign = 'center';
        emptyMsg.style.padding = '40px';
        emptyMsg.innerHTML = `
            <p style="font-size: 18px; margin-bottom: 20px;">Your cart is empty</p>
            <a href="shop.html" class="checkout-btn" style="display: inline-block; text-decoration: none;">Continue Shopping</a>
        `;
        cartSection.appendChild(emptyMsg);
        updateTotals(0);
        return;
    }
    
    // Show cart header if cart has items
    const cartHeader = cartSection.querySelector('.cart-header');
    if (cartHeader) cartHeader.style.display = 'grid';

    // Render cart items
    cart.forEach((item, index) => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.id = `cartItem-${item.id}`;
        
        // Extract numeric price
        const priceNum = parseFloat(item.price.replace(/[^\d.]/g, '')) || 0;
        const subtotal = priceNum * item.quantity;
        
        cartItem.innerHTML = `
            <div class="product-info">
                <div class="product-image">
                    <img src="${item.image || 'assets/images/Our_products/lolito.png'}" alt="${item.name}">
                </div>
                <span>${item.name}</span>
            </div>
            <div class="price">${item.price}</div>
            <div>
                <input type="number" class="quantity-input" value="${item.quantity}" min="1" data-product-id="${item.id}">
            </div>
            <div class="subtotal" data-product-id="${item.id}">Rs. ${subtotal.toLocaleString('en-IN')}.00</div>
            <div>
                <button class="delete-btn" data-product-id="${item.id}" onclick="removeCartItem('${item.id}')">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </button>
            </div>
        `;
        
        cartSection.appendChild(cartItem);
    });

    // Add event listeners for quantity changes
    document.querySelectorAll('.quantity-input').forEach(input => {
        input.addEventListener('change', function() {
            const productId = this.getAttribute('data-product-id');
            const quantity = parseInt(this.value) || 1;
            updateCartQuantity(productId, quantity);
            renderCart();
        });
    });

    // Update totals
    updateTotals();
}

function updateTotals(customTotal = null) {
    if (typeof getCartTotal !== 'function') return;
    
    const total = customTotal !== null ? customTotal : getCartTotal();
    const subtotalEl = document.getElementById('subtotal');
    const totalEl = document.getElementById('total');
    
    if (subtotalEl) {
        subtotalEl.textContent = `Rs. ${total.toLocaleString('en-IN')}.00`;
    }
    if (totalEl) {
        totalEl.textContent = `Rs. ${total.toLocaleString('en-IN')}.00`;
    }
}

function removeCartItem(productId) {
    if (confirm('Are you sure you want to remove this item?')) {
        if (typeof removeFromCart === 'function') {
            removeFromCart(productId);
            renderCart();
        }
    }
}

function renderCart() {
    initCart();
}

// Initialize cart when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Load cart utilities first
    const cartUtilsScript = document.createElement('script');
    cartUtilsScript.src = 'assets/js/cart-utils.js';
    cartUtilsScript.onload = function() {
        initCart();
    };
    document.head.appendChild(cartUtilsScript);
    
    // Also listen for cart updates
    window.addEventListener('cartUpdated', function() {
        renderCart();
    });
});

// Legacy function for backward compatibility
function updateCart() {
    const quantityInput = document.querySelector('.quantity-input');
    if (!quantityInput) return;
    
    const productId = quantityInput.getAttribute('data-product-id');
    if (!productId) return;
    
    const quantity = parseInt(quantityInput.value) || 1;
    if (typeof updateCartQuantity === 'function') {
        updateCartQuantity(productId, quantity);
        renderCart();
    }
}

function removeItem() {
    const cartItem = document.querySelector('.cart-item');
    if (!cartItem) return;
    
    const productId = cartItem.id.replace('cartItem-', '');
    removeCartItem(productId);
}

function checkout() {
    const cart = typeof getCart === 'function' ? getCart() : [];
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return false;
    }
    return true; // Allow navigation
}

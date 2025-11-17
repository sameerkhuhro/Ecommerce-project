// Cart Sidebar functionality
(function() {
    'use strict';
    
    const CART_SIDEBAR_ID = 'cart-sidebar';
    const CART_OVERLAY_ID = 'cart-overlay';
    
    // Create cart sidebar HTML structure
    function createCartSidebar() {
        // Check if sidebar already exists
        if (document.getElementById(CART_SIDEBAR_ID)) {
            return;
        }
        
        // Create overlay
        const overlay = document.createElement('div');
        overlay.id = CART_OVERLAY_ID;
        overlay.className = 'cart-overlay';
        overlay.addEventListener('click', closeCartSidebar);
        
        // Create sidebar
        const sidebar = document.createElement('div');
        sidebar.id = CART_SIDEBAR_ID;
        sidebar.className = 'cart-sidebar';
        sidebar.innerHTML = `
            <div class="cart-sidebar-header">
                <h2>Shopping Cart</h2>
                <button class="cart-sidebar-close" id="closeCartSidebar" aria-label="Close cart">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </button>
            </div>
            <div class="cart-sidebar-content" id="cartSidebarContent">
                <div class="cart-sidebar-empty">
                    <p>Your cart is empty</p>
                    <a href="shop.html" class="btn-primary">Continue Shopping</a>
                </div>
            </div>
            <div class="cart-sidebar-footer" id="cartSidebarFooter" style="display: none;">
                <div class="cart-sidebar-total">
                    <span>Subtotal:</span>
                    <span id="cartSidebarSubtotal">Rp 0</span>
                </div>
                <div class="cart-sidebar-actions">
                    <a href="cart.html" class="btn-outline">View Cart</a>
                    <a href="checkout.html" class="btn-primary">Checkout</a>
                </div>
            </div>
        `;
        
        document.body.appendChild(overlay);
        document.body.appendChild(sidebar);
        
        // Add close button event
        const closeBtn = sidebar.querySelector('#closeCartSidebar');
        if (closeBtn) {
            closeBtn.addEventListener('click', closeCartSidebar);
        }
    }
    
    // Open cart sidebar
    function openCartSidebar() {
        createCartSidebar();
        const sidebar = document.getElementById(CART_SIDEBAR_ID);
        const overlay = document.getElementById(CART_OVERLAY_ID);
        
        if (sidebar && overlay) {
            sidebar.classList.add('active');
            overlay.classList.add('active');
            document.body.style.overflow = 'hidden';
            renderCartSidebar();
        }
    }
    
    // Close cart sidebar
    function closeCartSidebar() {
        const sidebar = document.getElementById(CART_SIDEBAR_ID);
        const overlay = document.getElementById(CART_OVERLAY_ID);
        
        if (sidebar && overlay) {
            sidebar.classList.remove('active');
            overlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    }
    
    // Render cart items in sidebar
    function renderCartSidebar() {
        if (typeof getCart !== 'function') return;
        
        const cart = getCart();
        const content = document.getElementById('cartSidebarContent');
        const footer = document.getElementById('cartSidebarFooter');
        
        if (!content) return;
        
        if (cart.length === 0) {
            content.innerHTML = `
                <div class="cart-sidebar-empty">
                    <p>Your cart is empty</p>
                    <a href="shop.html" class="btn-primary">Continue Shopping</a>
                </div>
            `;
            if (footer) footer.style.display = 'none';
            return;
        }
        
        // Show footer
        if (footer) footer.style.display = 'block';
        
        // Render items
        let html = '<div class="cart-sidebar-items">';
        let subtotal = 0;
        
        cart.forEach(item => {
            const priceNum = parseFloat(item.price.replace(/[^\d.]/g, '')) || 0;
            const itemTotal = priceNum * item.quantity;
            subtotal += itemTotal;
            
            html += `
                <div class="cart-sidebar-item" data-product-id="${item.id}">
                    <div class="cart-sidebar-item-image">
                        <img src="${item.image || 'assets/images/Our_products/lolito.png'}" alt="${item.name}">
                    </div>
                    <div class="cart-sidebar-item-info">
                        <h4>${item.name}</h4>
                        <p class="cart-sidebar-item-price">${item.price} x ${item.quantity}</p>
                        <button class="cart-sidebar-item-remove" data-product-id="${item.id}">Remove</button>
                    </div>
                </div>
            `;
        });
        
        html += '</div>';
        content.innerHTML = html;
        
        // Update subtotal
        const subtotalEl = document.getElementById('cartSidebarSubtotal');
        if (subtotalEl) {
            // Format price based on currency format in cart
            const priceStr = cart[0]?.price || 'Rp 0';
            if (priceStr.includes('Rp')) {
                subtotalEl.textContent = `Rp ${subtotal.toLocaleString('id-ID')}`;
            } else if (priceStr.includes('Rs')) {
                subtotalEl.textContent = `Rs. ${subtotal.toLocaleString('en-IN')}.00`;
            } else {
                subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
            }
        }
        
        // Add remove button events
        content.querySelectorAll('.cart-sidebar-item-remove').forEach(btn => {
            btn.addEventListener('click', function() {
                const productId = this.getAttribute('data-product-id');
                if (typeof removeFromCart === 'function') {
                    removeFromCart(productId);
                    renderCartSidebar();
                    // Dispatch event for cart icon update
                    window.dispatchEvent(new CustomEvent('cartUpdated'));
                }
            });
        });
    }
    
    // Listen for cart updates
    window.addEventListener('cartUpdated', function() {
        renderCartSidebar();
    });
    
    // Make functions globally available
    window.openCartSidebar = openCartSidebar;
    window.closeCartSidebar = closeCartSidebar;
    window.renderCartSidebar = renderCartSidebar;
    
    // Auto-open sidebar when item is added (optional - can be controlled)
    // This will be called from cart-utils.js after adding item
})();


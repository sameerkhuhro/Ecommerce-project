// Product Detail Page Functionality

// Product database - in a real app, this would come from an API
const PRODUCTS_DB = {
    'syltherine': {
        id: 'syltherine',
        name: 'Syltherine',
        subtitle: 'Stylish cafe chair',
        price: 'Rs. 2.500.000',
        priceOld: 'Rs. 3.500.000',
        image: 'assets/images/Our_products/syltherine.img.png',
        images: ['assets/images/Our_products/syltherine.img.png'],
        badge: 'sale',
        badgeText: '-30%',
        description: 'Embodying the raw, wayward spirit of rock \'n\' roll, the Syltherine cafe chair takes the unmistakable look and sound of modern design, unplugs the chords, and takes the show on the road. Perfect for your home or office.',
        sku: 'SKU-SYL-001',
        category: 'Chairs',
        tags: 'Chair, Cafe, Modern, Stylish'
    },
    'leviosa': {
        id: 'leviosa',
        name: 'Leviosa',
        subtitle: 'Stylish cafe chair',
        price: 'Rp 2.500.000',
        image: 'assets/images/Our_products/tenny.jpg',
        images: ['assets/images/Our_products/tenny.jpg'],
        description: 'A beautiful and comfortable cafe chair perfect for any modern space.',
        sku: 'SKU-LEV-001',
        category: 'Chairs',
        tags: 'Chair, Cafe, Comfortable'
    },
    'lolito': {
        id: 'lolito',
        name: 'Lolito',
        subtitle: 'Luxury big sofa',
        price: 'Rs. 7.000.000',
        priceOld: 'Rs. 14.000.000',
        image: 'assets/images/Our_products/lolito.png',
        images: ['assets/images/Our_products/lolito.png'],
        badge: 'sale',
        badgeText: '-50%',
        description: 'Luxury big sofa with premium materials and exceptional comfort. Perfect for large living rooms.',
        sku: 'SKU-LOL-001',
        category: 'Sofas',
        tags: 'Sofa, Luxury, Big, Comfortable'
    },
    'asgaard': {
        id: 'asgaard',
        name: 'Asgaard sofa',
        subtitle: 'Premium outdoor sofa set',
        price: 'Rs. 250,000.00',
        image: 'assets/images/Our_products/lolito.png',
        images: ['assets/images/Our_products/lolito.png', 'assets/images/Our_products/lolito.png'],
        description: 'Setting the bar as one of the loudest speakers in its class, the Kilburn is a compact, stout-hearted hero with a well-balanced audio which boasts a clear midrange and extended highs for a sound that is both articulate and pronounced. The analogue knobs allow you to fine tune the controls to your personal preferences while the guitar-influenced leather strap enables easy and stylish travel.',
        sku: 'SS001',
        category: 'Sofas',
        tags: 'Sofa, Chair, Home, Shop'
    },
    'respira': {
        id: 'respira',
        name: 'Respira',
        subtitle: 'Outdoor bar table and stool',
        price: 'Rp 500.000',
        image: 'assets/images/Our_products/respira_img.png',
        images: ['assets/images/Our_products/respira_img.png'],
        badge: 'new',
        badgeText: 'New',
        description: 'Modern outdoor bar table and stool set, perfect for your patio or garden.',
        sku: 'SKU-RES-001',
        category: 'Outdoor',
        tags: 'Outdoor, Table, Stool, Modern'
    },
    'grifo': {
        id: 'grifo',
        name: 'Grifo',
        subtitle: 'Night lamp',
        price: 'Rp 1.500.000',
        image: 'assets/images/Our_products/grifo.png',
        images: ['assets/images/Our_products/grifo.png'],
        description: 'Elegant night lamp with modern design, perfect for bedrooms.',
        sku: 'SKU-GRI-001',
        category: 'Lighting',
        tags: 'Lamp, Night, Bedroom, Elegant'
    },
    'muggo': {
        id: 'muggo',
        name: 'Muggo',
        subtitle: 'Small mug',
        price: 'Rp 150.000',
        image: 'assets/images/Our_products/muggo.png',
        images: ['assets/images/Our_products/muggo.png'],
        badge: 'new',
        badgeText: 'New',
        description: 'Small, stylish mug perfect for your morning coffee.',
        sku: 'SKU-MUG-001',
        category: 'Accessories',
        tags: 'Mug, Small, Coffee, Stylish'
    },
    'pingky': {
        id: 'pingky',
        name: 'Pingky',
        subtitle: 'Cute bed set',
        price: 'Rp 7.000.000',
        priceOld: 'Rp 14.000.000',
        image: 'assets/images/Our_products/pingkey.png',
        images: ['assets/images/Our_products/pingkey.png'],
        badge: 'sale',
        badgeText: '-50%',
        description: 'Cute and comfortable bed set for your bedroom.',
        sku: 'SKU-PIN-001',
        category: 'Bedroom',
        tags: 'Bed, Set, Cute, Comfortable'
    },
    'potty': {
        id: 'potty',
        name: 'Potty',
        subtitle: 'Minimalist flower pot',
        price: 'Rp 500.000',
        image: 'assets/images/Our_products/potty.png',
        images: ['assets/images/Our_products/potty.png'],
        badge: 'new',
        badgeText: 'New',
        description: 'Minimalist flower pot perfect for modern homes.',
        sku: 'SKU-POT-001',
        category: 'Decor',
        tags: 'Pot, Flower, Minimalist, Modern'
    }
};

document.addEventListener('DOMContentLoaded', function() {
    // Get product ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    let productId = urlParams.get('id') || urlParams.get('product') || 'asgaard';
    
    // Handle product name variations
    if (productId.toLowerCase() === 'asgaard sofa' || productId.toLowerCase() === 'asgaard') {
        productId = 'asgaard';
    }
    
    // Load product data
    const product = PRODUCTS_DB[productId.toLowerCase()];
    
    if (product) {
        displayProduct(product);
        // Setup event listeners
        setupEventListeners(product);
    } else {
        // Product not found, try default
        const defaultProduct = PRODUCTS_DB['asgaard'] || PRODUCTS_DB['syltherine'];
        if (defaultProduct) {
            displayProduct(defaultProduct);
            setupEventListeners(defaultProduct);
        } else {
            // No products available, redirect to shop
            window.location.href = 'shop.html';
        }
    }
});

function displayProduct(product) {
    // Update page title
    document.title = `${product.name} - Furniro`;
    
    // Update breadcrumb
    const breadcrumb = document.getElementById('productBreadcrumb');
    if (breadcrumb) {
        breadcrumb.textContent = product.name;
        breadcrumb.style.color = '#333';
    }
    
    // Update main product image
    const mainImage = document.getElementById('mainProductImage');
    if (mainImage) {
        mainImage.src = product.image;
        mainImage.alt = product.name;
    }
    
    // Update thumbnails
    const thumbnailContainer = document.getElementById('thumbnailImages');
    if (thumbnailContainer) {
        thumbnailContainer.innerHTML = '';
        const images = product.images || [product.image];
        images.forEach((img, index) => {
            const thumbnail = document.createElement('div');
            thumbnail.className = 'thumbnail-item' + (index === 0 ? ' active' : '');
            thumbnail.innerHTML = `<img src="${img}" alt="${product.name}">`;
            thumbnail.addEventListener('click', () => {
                if (mainImage) mainImage.src = img;
                document.querySelectorAll('.thumbnail-item').forEach(t => t.classList.remove('active'));
                thumbnail.classList.add('active');
            });
            thumbnailContainer.appendChild(thumbnail);
        });
    }
    
    // Update product info
    const productName = document.getElementById('productName');
    if (productName) productName.textContent = product.name;
    
    const productSubtitle = document.getElementById('productSubtitle');
    if (productSubtitle) productSubtitle.textContent = product.subtitle;
    
    const productPrice = document.getElementById('productPrice');
    if (productPrice) {
        // Format price to match design (Rs. 250,000.00)
        let priceText = product.price;
        if (priceText.startsWith('Rp ')) {
            priceText = priceText.replace('Rp ', 'Rs. ');
        }
        productPrice.textContent = priceText;
    }
    
    const productPriceOld = document.getElementById('productPriceOld');
    if (productPriceOld) {
        if (product.priceOld) {
            productPriceOld.textContent = product.priceOld;
            productPriceOld.style.display = 'inline';
        } else {
            productPriceOld.style.display = 'none';
        }
    }
    
    const productDescription = document.getElementById('productDescription');
    if (productDescription) productDescription.textContent = product.description;
    
    const productSku = document.getElementById('productSku');
    if (productSku) productSku.textContent = product.sku || 'SKU-001';
    
    const productCategory = document.getElementById('productCategory');
    if (productCategory) productCategory.textContent = product.category || 'Furniture';
    
    const productTags = document.getElementById('productTags');
    if (productTags) productTags.textContent = product.tags || 'Furniture';
    
    // Store product data for later use
    window.currentProduct = product;
}

function setupEventListeners(product) {
    // Quantity controls
    const decreaseBtn = document.getElementById('decreaseQty');
    const increaseBtn = document.getElementById('increaseQty');
    const quantityInput = document.getElementById('productQuantity');
    
    if (decreaseBtn && quantityInput) {
        decreaseBtn.addEventListener('click', () => {
            const current = parseInt(quantityInput.value) || 1;
            if (current > 1) {
                quantityInput.value = current - 1;
            }
        });
    }
    
    if (increaseBtn && quantityInput) {
        increaseBtn.addEventListener('click', () => {
            const current = parseInt(quantityInput.value) || 1;
            if (current < 10) {
                quantityInput.value = current + 1;
            }
        });
    }
    
    // Add to cart
    const addToCartBtn = document.getElementById('addToCartBtn');
    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', () => {
            const quantity = parseInt(quantityInput?.value) || 1;
            const productToAdd = {
                ...product,
                quantity: quantity
            };
            
            // Add multiple quantities
            for (let i = 0; i < quantity; i++) {
                if (typeof addToCart === 'function') {
                    addToCart(product);
                }
            }
            
            if (typeof showToast === 'function') {
                showToast(`${product.name} (${quantity}x) added to cart`);
            } else {
                alert(`${product.name} (${quantity}x) added to cart`);
            }
        });
    }
    
    // Like button
    const likeBtn = document.getElementById('likeBtn');
    if (likeBtn) {
        likeBtn.addEventListener('click', () => {
            // Toggle like state
            likeBtn.classList.toggle('liked');
            if (typeof showToast === 'function') {
                showToast(likeBtn.classList.contains('liked') ? 'Added to wishlist' : 'Removed from wishlist');
            }
        });
    }
    
    // Compare button
    const compareBtn = document.getElementById('compareBtn');
    if (compareBtn) {
        compareBtn.addEventListener('click', () => {
            if (typeof showToast === 'function') {
                showToast('Product added to comparison');
            }
        });
    }
    
    // Size selection
    const sizeButtons = document.querySelectorAll('.size-btn');
    sizeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            sizeButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });
    
    // Color selection
    const colorButtons = document.querySelectorAll('.color-btn');
    colorButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            colorButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });
    
    // Tab switching
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabName = btn.getAttribute('data-tab');
            
            // Remove active class from all tabs and contents
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            
            // Add active class to clicked tab and corresponding content
            btn.classList.add('active');
            const tabContent = document.getElementById(tabName + 'Tab');
            if (tabContent) tabContent.classList.add('active');
        });
    });
    
    // Load related products
    loadRelatedProducts(product);
}

function loadRelatedProducts(currentProduct) {
    const relatedContainer = document.getElementById('relatedProducts');
    if (!relatedContainer) return;
    
    // Get all products except current one
    const relatedProducts = Object.values(PRODUCTS_DB)
        .filter(p => p.id !== currentProduct.id)
        .slice(0, 4);
    
    relatedContainer.innerHTML = '';
    
    relatedProducts.forEach(product => {
        const card = document.createElement('article');
        card.className = 'product-card';
        card.dataset.productId = product.id;
        card.dataset.productName = product.name;
        card.style.cursor = 'pointer';
        
        const badgeMarkup = product.badge && product.badgeText
            ? `<span class="badge badge-${product.badge}">${product.badgeText}</span>`
            : '';
        
        const priceOldMarkup = product.priceOld
            ? `<span class="price-old">${product.priceOld}</span>`
            : '';
        
        card.innerHTML = `
            <div class="product-image-wrapper">
                <img src="${product.image}" alt="${product.name}" class="product-image">
                ${badgeMarkup}
                <div class="product-overlay">
                    <button class="btn-add-cart" data-product="${product.name}">Add to cart</button>
                    <div class="overlay-actions">
                        <button class="overlay-action" data-action="share">
                            <img class="action-icon" src="assets/images/icons/share.png" alt="Share">
                            <span>Share</span>
                        </button>
                        <button class="overlay-action" data-action="compare">
                            <img class="action-icon" src="assets/images/icons/compare-icon.png" alt="Compare">
                            <span>Compare</span>
                        </button>
                        <button class="overlay-action like-toggle" aria-pressed="false">
                            <img class="action-icon" src="assets/images/icons/Heart.png" alt="Like">
                            <span>Like</span>
                        </button>
                    </div>
                </div>
            </div>
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <p class="product-subtitle">${product.subtitle}</p>
                <div class="product-prices">
                    <span class="price">${product.price}</span>
                    ${priceOldMarkup}
                </div>
            </div>
        `;
        
        // Make card clickable
        card.addEventListener('click', function(e) {
            if (e.target.closest('button')) return;
            window.location.href = `product-detail.html?id=${product.id}`;
        });
        
        // Bind product interactions
        if (typeof bindProductCard === 'function') {
            bindProductCard(card);
        }
        
        relatedContainer.appendChild(card);
    });
    
    // Show More button
    const showMoreBtn = document.getElementById('showMoreRelated');
    if (showMoreBtn) {
        showMoreBtn.addEventListener('click', () => {
            window.location.href = 'shop.html';
        });
    }
}

// Note: Product card click handlers are in script.js and shop.js


// Navigation Active State
document.addEventListener('DOMContentLoaded', function() {
    // Handle navigation link clicks
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all links
            navLinks.forEach(l => l.classList.remove('active'));
            
            // Add active class to clicked link
            this.classList.add('active');
            
            // Navigation functionality - Update href attributes in HTML
            const linkText = this.textContent.trim();
            switch(linkText) {
                case 'Home':
                    window.location.href = 'index.html'; // or '/'
                    break;
                case 'Shop':
                    window.location.href = 'shop.html'; // or '/shop'
                    break;
                case 'About':
                    window.location.href = 'about.html'; // or '/about'
                    // OR scroll to about section: document.querySelector('#about').scrollIntoView({ behavior: 'smooth' });
                    break;
                case 'Contact':
                    window.location.href = 'contact.html'; // or '/contact'
                    // OR scroll to contact section: document.querySelector('#contact').scrollIntoView({ behavior: 'smooth' });
                    break;
            }
        });
    });

    // Smooth scroll for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });

    // Header scroll effect
    let lastScroll = 0;
    const header = document.querySelector('.header');
    
    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.05)';
        }
        
        lastScroll = currentScroll;
    });

    // BUY NOW Button - Choose one of these options:
    const buyNowBtn = document.querySelector('.btn-primary');
    if (buyNowBtn) {
        buyNowBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Add ripple effect
            const ripple = document.createElement('span');
            ripple.style.position = 'absolute';
            ripple.style.borderRadius = '50%';
            ripple.style.background = 'rgba(255, 255, 255, 0.6)';
            ripple.style.width = '20px';
            ripple.style.height = '20px';
            ripple.style.left = '50%';
            ripple.style.top = '50%';
            ripple.style.transform = 'translate(-50%, -50%)';
            ripple.style.animation = 'ripple 0.6s ease-out';
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
            
            // ============================================
            // OPTION 1: Navigate to Shop Page (Recommended)
            // ============================================
            window.location.href = 'shop.html'; // or '/shop' if using routing
            
            // ============================================
            // OPTION 2: Navigate to Specific Product Page
            // ============================================
            // window.location.href = 'product.html?id=new-collection';
            
            // ============================================
            // OPTION 3: Scroll to Shop Section on Same Page
            // ============================================
            // const shopSection = document.querySelector('#shop-section');
            // if (shopSection) {
            //     shopSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            // }
            
            // ============================================
            // OPTION 4: Open Product Modal/Popup
            // ============================================
            // openProductModal('new-collection');
            
            // ============================================
            // OPTION 5: Add to Cart Directly
            // ============================================
            // addToCart('new-collection-item-id');
            // showCartNotification();
            
            // ============================================
            // OPTION 6: Track Analytics Event (Google Analytics, etc.)
            // ============================================
            // if (typeof gtag !== 'undefined') {
            //     gtag('event', 'click', {
            //         'event_category': 'Button',
            //         'event_label': 'Buy Now - Hero Section'
            //     });
            // }
        });
    }

    // Utility icon interactions (account/search/wishlist/cart)
    const iconLinks = document.querySelectorAll('.icon-link');
    iconLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const ariaLabel = this.getAttribute('aria-label');
            if (ariaLabel === 'Search') {
                // Open inline search on all pages with page-specific filtering
                e.preventDefault();
                const filterFn = getPageSpecificFilter();
                openSearchBarAndBindFilter(filterFn);
            }
        });
    });
    
    // Search bar toggle function
    function toggleSearchBar() {
        let searchBar = document.querySelector('.search-bar');
        if (!searchBar) {
            // Create search bar if it doesn't exist
            searchBar = document.createElement('div');
            searchBar.className = 'search-bar';
            searchBar.innerHTML = `
                <div class="search-container">
                    <input type="text" placeholder="Search products..." class="search-input" autofocus aria-label="Search products by name">
                    <button class="search-close">&times;</button>
                </div>
            `;
            document.querySelector('.header').appendChild(searchBar);
            
            // Close button functionality
            searchBar.querySelector('.search-close').addEventListener('click', () => {
                searchBar.remove();
            });
            
            // Key handling is added in openSearchBarAndBindFilter
        } else {
            searchBar.remove();
        }
    }

    function openSearchBarAndBindFilter(filterFn) {
        toggleSearchBar();
        const input = document.querySelector('.search-bar .search-input');
        if (input) {
            input.focus();
            // Remove previous listeners by cloning
            const clone = input.cloneNode(true);
            input.parentNode.replaceChild(clone, input);
            const active = document.querySelector('.search-bar .search-input');
            active.addEventListener('input', () => filterFn && filterFn(active.value));
            active.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') e.preventDefault();
            });
            // Initial filter
            if (filterFn) filterFn(active.value);
        }
    }

    function filterHomeProducts(query) {
        const grid = document.querySelector('.products-section .product-grid');
        if (!grid) return;
        const q = (query || '').trim().toLowerCase();
        const cards = grid.querySelectorAll('.product-card');
        let visibleCount = 0;
        cards.forEach(card => {
            const name = (card.dataset.productName || card.querySelector('.product-title')?.textContent || '').toLowerCase();
            const match = q.length === 0 || name.includes(q);
            card.style.display = match ? '' : 'none';
            if (match) visibleCount++;
        });
        // Optionally scroll into view when searching
        if (q) {
            grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        return visibleCount;
    }

    function filterShopProducts(query) {
        const grid = document.querySelector('.shop-products .product-grid');
        if (!grid) return;
        const q = (query || '').trim().toLowerCase();
        const cards = grid.querySelectorAll('.product-card');
        let visibleCount = 0;
        cards.forEach(card => {
            const name = (card.dataset.name || card.querySelector('.card-title')?.textContent || '').toLowerCase();
            const match = q.length === 0 || name.includes(q);
            card.style.display = match ? '' : 'none';
            if (match) visibleCount++;
        });
        if (q) {
            grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        return visibleCount;
    }

    function filterWishlistItems(query) {
        const grid = document.querySelector('[data-wishlist-grid]');
        if (!grid) return;
        const q = (query || '').trim().toLowerCase();
        const cards = grid.querySelectorAll('.wishlist-card');
        let visibleCount = 0;
        cards.forEach(card => {
            const name = (card.querySelector('.wishlist-card-title')?.textContent || '').toLowerCase();
            const match = q.length === 0 || name.includes(q);
            card.style.display = match ? '' : 'none';
            if (match) visibleCount++;
        });
        if (q) {
            grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        return visibleCount;
    }

    function getPageSpecificFilter() {
        if (document.querySelector('.products-section .product-grid')) {
            return filterHomeProducts;
        }
        if (document.querySelector('.shop-products .product-grid')) {
            return filterShopProducts;
        }
        if (document.querySelector('[data-wishlist-grid]')) {
            return filterWishlistItems;
        }
        // default no-op
        return () => {};
    }

    // Parallax effect for hero section (subtle)
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero');
        const promoBox = document.querySelector('.promo-box');
        const heroBg = document.querySelector('.hero-bg-image');
        
        if (hero && scrolled < hero.offsetHeight) {
            if (heroBg) {
                heroBg.style.transform = `translateY(${scrolled * 0.3}px)`;
            }
            
            if (promoBox) {
                promoBox.style.transform = `translateY(calc(-50% + ${scrolled * 0.2}px))`;
            }
        }
    });

    // Add animation on scroll for browse section
    const observerOptions = {
        threshold: 0.3,
        rootMargin: '0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    const browseSection = document.querySelector('.browse-section');
    if (browseSection) {
        browseSection.style.opacity = '0';
        browseSection.style.transform = 'translateY(30px)';
        browseSection.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(browseSection);
    }
});

// Add CSS animation for ripple effect
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: translate(-50%, -50%) scale(10);
            opacity: 0;
        }
    }

    .toast {
        position: fixed;
        bottom: 24px;
        right: 24px;
        background: #1A1A1A;
        color: #FFFFFF;
        padding: 12px 16px;
        border-radius: 6px;
        font-family: 'Poppins', sans-serif;
        box-shadow: 0 10px 25px rgba(0,0,0,0.2);
        opacity: 0;
        transform: translateY(10px);
        transition: opacity .25s ease, transform .25s ease;
        z-index: 2000;
    }
`;
document.head.appendChild(style);


// Product interactions
const DEFAULT_LIKE_OFF_ICON = 'data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%2218%22%20height%3D%2218%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23ffffff%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22M20.8%204.6c-1.5-1.4-3.9-1.4-5.4%200L12%208l-3.4-3.4c-1.5-1.4-3.9-1.4-5.4%200-1.6%201.5-1.6%203.9%200%205.4l8.1%208c.3.3.8.3%201.1%200l8.1-8c1.5-1.5%201.5-3.9%200-5.4z%22/%3E%3C/svg%3E';
const DEFAULT_LIKE_ON_ICON = 'data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%2218%22%20height%3D%2218%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22%23ffd166%22%20stroke%3D%22%23ffd166%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22M20.8%204.6c-1.5-1.4-3.9-1.4-5.4%200L12%208l-3.4-3.4c-1.5-1.4-3.9-1.4-5.4%200-1.6%201.5-1.6%203.9%200%205.4l8.1%208c.3.3.8.3%201.1%200l8.1-8c1.5-1.5%201.5-3.9%200-5.4z%22/%3E%3C/svg%3E';
const WISHLIST_STORAGE_KEY = 'furniro-wishlist';
const EXTRA_PRODUCTS = [
    {
        id: 'aurora-sofa',
        name: 'Aurora Sofa',
        subtitle: 'Modular family sofa',
        price: 'Rp 5.500.000',
        priceOld: 'Rp 6.200.000',
        image: 'https://images.unsplash.com/photo-1549388604-817d15aa0110?auto=format&fit=crop&w=800&q=60',
        badge: 'sale',
        badgeText: '-12%'
    },
    {
        id: 'nimbus-desk',
        name: 'Nimbus Desk',
        subtitle: 'Walnut writing desk',
        price: 'Rp 3.300.000',
        image: 'https://images.unsplash.com/photo-1493666438817-866a91353ca9?auto=format&fit=crop&w=800&q=60',
        badge: 'new',
        badgeText: 'New'
    },
    {
        id: 'luxe-bed',
        name: 'Luxe Bed',
        subtitle: 'Upholstered queen bed',
        price: 'Rp 8.900.000',
        image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=800&q=60'
    },
    {
        id: 'terra-chair',
        name: 'Terra Lounge Chair',
        subtitle: 'Leather accent chair',
        price: 'Rp 4.200.000',
        priceOld: 'Rp 4.800.000',
        image: 'https://images.unsplash.com/photo-1505691723518-36a5ac3be353?auto=format&fit=crop&w=800&q=60',
        badge: 'sale',
        badgeText: '-13%'
    }
];

document.addEventListener('DOMContentLoaded', function() {
    setupProductInteractions();
    renderWishlistPage();
});

function setupProductInteractions() {
    document.querySelectorAll('.product-card').forEach(card => bindProductCard(card));
    syncWishlistButtons();
    setupShowMore();
}

function bindProductCard(card) {
    if (!card || card.dataset.interactionsBound === 'true') return;
    card.dataset.interactionsBound = 'true';

    const likeBtn = card.querySelector('.like-toggle');
    if (likeBtn) {
        likeBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const product = getProductDataFromCard(card);
            if (!product.id) return;

            const alreadyLiked = likeBtn.getAttribute('aria-pressed') === 'true';

            if (alreadyLiked) {
                removeFromWishlist(product.id);
                applyLikeState(likeBtn, false);
                showToast(`${product.name} removed from wishlist`);
            } else {
                addToWishlist(product);
                applyLikeState(likeBtn, true);
                showToast(`${product.name} added to wishlist`);
            }

            renderWishlistPage();
        });
    }

    const addCartBtn = card.querySelector('.btn-add-cart');
    if (addCartBtn) {
        addCartBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const productName = card.dataset.productName || addCartBtn.getAttribute('data-product') || 'Item';
            showToast(`${productName} added to cart`);
        });
    }

    card.querySelectorAll('.overlay-action[data-action]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const action = btn.getAttribute('data-action');
            if (!action) return;
            e.preventDefault();
            showToast(`${action.charAt(0).toUpperCase() + action.slice(1)} clicked`);
        });
    });
}

function setupShowMore() {
    const button = document.querySelector('[data-action="show-more"]');
    const grid = document.querySelector('.products-section .product-grid');
    if (!button || !grid) return;
    if (button.dataset.bound === 'true') return;
    button.dataset.bound = 'true';

    button.addEventListener('click', () => {
        const fragment = document.createDocumentFragment();

        EXTRA_PRODUCTS.forEach(product => {
            const card = createProductCard(product);
            bindProductCard(card);
            fragment.appendChild(card);
        });

        grid.appendChild(fragment);
        syncWishlistButtons();

        const wrapper = button.closest('.show-more-wrapper');
        if (wrapper) {
            wrapper.remove();
        } else {
            button.remove();
        }
    });
}

function createProductCard(product) {
    const card = document.createElement('article');
    card.className = 'product-card';
    card.dataset.productId = product.id || '';
    card.dataset.productName = product.name || '';
    card.dataset.productSubtitle = product.subtitle || '';
    card.dataset.productPrice = product.price || '';
    if (product.priceOld) {
        card.dataset.productPriceOld = product.priceOld;
    }
    card.dataset.productImage = product.image || '';
    if (product.badge) {
        card.dataset.productBadge = product.badge;
    }
    if (product.badgeText) {
        card.dataset.productBadgeText = product.badgeText;
    }

    const badgeMarkup = product.badge && product.badgeText
        ? `<span class="badge badge-${product.badge}">${product.badgeText}</span>`
        : '';

    const priceOldMarkup = product.priceOld
        ? `<span class="price-old">${product.priceOld}</span>`
        : '';

    card.innerHTML = `
        <div class="product-image-wrapper">
            <img src="${product.image}" alt="${product.name} - ${product.subtitle}" class="product-image">
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
                    <button class="overlay-action like-toggle" aria-pressed="false" data-like-off="images/icons/like.png" data-like-on="images/icons/like-filled.png">
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

    return card;
}

function syncWishlistButtons() {
    const wishlist = getWishlist();
    const lookup = new Map(wishlist.map(item => [item.id, item]));

    document.querySelectorAll('.product-card .like-toggle').forEach(btn => {
        const card = btn.closest('.product-card');
        if (!card) return;
        const id = card.dataset.productId;
        applyLikeState(btn, Boolean(id && lookup.has(id)));
    });
}

function applyLikeState(button, isLiked) {
    button.setAttribute('aria-pressed', String(isLiked));
    button.classList.toggle('is-liked', isLiked);
    updateLikeVisuals(button, isLiked);
}

function updateLikeVisuals(button, isLiked) {
    const img = button.querySelector('img');
    const label = button.querySelector('span');
    const preferred = isLiked ? button.getAttribute('data-like-on') : button.getAttribute('data-like-off');
    const fallback = isLiked ? DEFAULT_LIKE_ON_ICON : DEFAULT_LIKE_OFF_ICON;
    if (img) {
        setImageWithFallback(img, preferred, fallback, isLiked ? 'Liked' : 'Like');
    }
    if (label) {
        label.textContent = isLiked ? 'Liked' : 'Like';
    }
}

function setImageWithFallback(img, primary, fallback, altText) {
    const desired = (primary && primary.trim()) ? primary : fallback;
    if (img.src !== desired) {
        img.onerror = () => {
            img.onerror = null;
            if (fallback && img.src !== fallback) {
                img.src = fallback;
            }
        };
        img.src = desired;
    }
    if (altText) {
        img.alt = altText;
    }
}

function getProductDataFromCard(card) {
    return {
        id: card.dataset.productId || '',
        name: card.dataset.productName || '',
        subtitle: card.dataset.productSubtitle || '',
        price: card.dataset.productPrice || '',
        priceOld: card.dataset.productPriceOld || '',
        image: card.dataset.productImage || card.querySelector('.product-image')?.getAttribute('src') || '',
        badge: card.dataset.productBadge || '',
        badgeText: card.dataset.productBadgeText || ''
    };
}

function getWishlist() {
    try {
        const raw = localStorage.getItem(WISHLIST_STORAGE_KEY);
        if (!raw) return [];
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [];
    } catch (err) {
        console.error('Failed to parse wishlist', err);
        return [];
    }
}

function saveWishlist(items) {
    try {
        localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(items));
    } catch (err) {
        console.error('Failed to save wishlist', err);
    }
}

function addToWishlist(product) {
    const wishlist = getWishlist();
    if (!wishlist.some(item => item.id === product.id)) {
        wishlist.push(product);
        saveWishlist(wishlist);
    }
    syncWishlistButtons();
}

function removeFromWishlist(id) {
    const wishlist = getWishlist().filter(item => item.id !== id);
    saveWishlist(wishlist);
    syncWishlistButtons();
}

function renderWishlistPage() {
    const grid = document.querySelector('[data-wishlist-grid]');
    const emptyState = document.querySelector('[data-wishlist-empty]');
    if (!grid) return;

    const items = getWishlist();
    grid.innerHTML = '';

    if (items.length === 0) {
        if (emptyState) emptyState.classList.remove('hidden');
        return;
    }

    if (emptyState) emptyState.classList.add('hidden');

    items.forEach(item => {
        const card = document.createElement('article');
        card.className = 'wishlist-card';
        card.dataset.productId = item.id;
        card.innerHTML = `
            <div class="wishlist-card-image">
                <img src="${item.image}" alt="${item.name}">
                ${item.badge && item.badgeText ? `<span class="badge badge-${item.badge}">${item.badgeText}</span>` : ''}
            </div>
            <div class="wishlist-card-info">
                <h3 class="wishlist-card-title">${item.name}</h3>
                <p class="wishlist-card-subtitle">${item.subtitle}</p>
                <div class="wishlist-card-prices">
                    <span class="price">${item.price}</span>
                    ${item.priceOld ? `<span class="price-old">${item.priceOld}</span>` : ''}
                </div>
                <div class="wishlist-card-actions">
                    <button class="btn-primary btn-primary--sm" data-action="add-cart" data-id="${item.id}">Add to cart</button>
                    <button class="btn-outline" data-action="remove-wishlist" data-id="${item.id}">Remove</button>
                </div>
            </div>
        `;
        grid.appendChild(card);
    });

    grid.querySelectorAll('[data-action="remove-wishlist"]').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.getAttribute('data-id');
            if (!id) return;
            removeFromWishlist(id);
            renderWishlistPage();
            showToast('Removed from wishlist');
        });
    });

    grid.querySelectorAll('[data-action="add-cart"]').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.getAttribute('data-id');
            const item = getWishlist().find(entry => entry.id === id);
            if (item) {
                showToast(`${item.name} added to cart`);
            }
        });
    });
}

function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);
    requestAnimationFrame(() => {
        toast.style.opacity = '1';
        toast.style.transform = 'translateY(0)';
    });
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(10px)';
        setTimeout(() => toast.remove(), 250);
    }, 1600);
}

// Room Inspiration Carousel
document.addEventListener('DOMContentLoaded', function() {
    initInspirationCarousel();
});

function initInspirationCarousel() {
    const carousel = document.querySelector('.inspiration-carousel');
    if (!carousel) return;

    const track = carousel.querySelector('.carousel-track');
    const slides = carousel.querySelectorAll('.carousel-slide');
    const dots = document.querySelectorAll('.carousel-dot');
    const arrow = carousel.querySelector('.carousel-arrow');
    const slideNextBtns = carousel.querySelectorAll('.slide-next-btn');

    if (!track || slides.length === 0) return;

    let currentSlide = 0;
    const totalSlides = slides.length;
    let autoplayInterval = null;
    const autoplayDelay = 5000; // 5 seconds

    // Initialize carousel
    updateCarousel();

    // Function to update carousel display
    function updateCarousel() {
        // Update slides
        slides.forEach((slide, index) => {
            if (index === currentSlide) {
                slide.classList.add('active');
            } else {
                slide.classList.remove('active');
            }
        });

        // Update track transform
        track.style.transform = `translateX(-${currentSlide * 100}%)`;

        // Update dots
        dots.forEach((dot, index) => {
            if (index === currentSlide) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }

    // Function to go to next slide
    function nextSlide() {
        currentSlide = (currentSlide + 1) % totalSlides;
        updateCarousel();
        resetAutoplay();
    }

    // Function to go to previous slide
    function prevSlide() {
        currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
        updateCarousel();
        resetAutoplay();
    }

    // Function to go to specific slide
    function goToSlide(index) {
        if (index >= 0 && index < totalSlides) {
            currentSlide = index;
            updateCarousel();
            resetAutoplay();
        }
    }

    // Autoplay functionality
    function startAutoplay() {
        autoplayInterval = setInterval(nextSlide, autoplayDelay);
    }

    function stopAutoplay() {
        if (autoplayInterval) {
            clearInterval(autoplayInterval);
            autoplayInterval = null;
        }
    }

    function resetAutoplay() {
        stopAutoplay();
        startAutoplay();
    }

    // Event listeners for arrow button
    if (arrow) {
        arrow.addEventListener('click', function(e) {
            e.preventDefault();
            nextSlide();
        });
    }

    // Event listeners for slide next buttons
    slideNextBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            nextSlide();
        });
    });

    // Event listeners for dots
    dots.forEach((dot, index) => {
        dot.addEventListener('click', function(e) {
            e.preventDefault();
            goToSlide(index);
        });
    });

    // Pause autoplay on hover
    carousel.addEventListener('mouseenter', stopAutoplay);
    carousel.addEventListener('mouseleave', startAutoplay);

    // Touch/swipe support for mobile
    let touchStartX = 0;
    let touchEndX = 0;

    track.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    track.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });

    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // Swiped left - next slide
                nextSlide();
            } else {
                // Swiped right - previous slide
                prevSlide();
            }
        }
    }

    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (carousel.closest('.room-inspiration-section')) {
            if (e.key === 'ArrowLeft') {
                prevSlide();
            } else if (e.key === 'ArrowRight') {
                nextSlide();
            }
        }
    });

    // Start autoplay
    startAutoplay();

    // Cleanup on page unload
    window.addEventListener('beforeunload', function() {
        stopAutoplay();
    });
}

// Newsletter Form Handler
document.addEventListener('DOMContentLoaded', function() {
    const newsletterForm = document.getElementById('newsletterForm');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const emailInput = this.querySelector('.newsletter-input');
            const email = emailInput.value.trim();
            
            if (email) {
                // Here you can add your newsletter subscription logic
                // For example, send to an API endpoint
                showToast('Thank you for subscribing to our newsletter!');
                emailInput.value = '';
            }
        });
    }
});



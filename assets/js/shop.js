// Shop page interactions: filter toggle, sorting, show count, pagination

(function () {
  const grid = document.getElementById('productGrid');
  if (!grid) return;

  const cards = Array.from(grid.querySelectorAll('.product-card'));
  const totalCountEl = document.getElementById('totalCount');
  const visibleCountEl = document.getElementById('visibleCount');
  const showSelect = document.getElementById('showCount');
  const sortSelect = document.getElementById('sortBy');
  const filterToggle = document.getElementById('filterToggle');
  const filterPanel = document.getElementById('filterPanel');
  const pageButtons = Array.from(document.querySelectorAll('.page-btn'));

  let pageSize = parseInt(showSelect?.value || '16', 10);
  let currentPage = 1;
  let workingCards = [...cards];

  function formatVisibleRange(startIndex, endIndex, total) {
    return `${startIndex + 1}–${Math.min(endIndex, total)}`;
  }

  function updateCounts() {
    const total = workingCards.length;
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    if (totalCountEl) totalCountEl.textContent = `${total}`;
    if (visibleCountEl) visibleCountEl.textContent = formatVisibleRange(startIndex, endIndex, total);
  }

  function renderPage() {
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    // Hide all, then show the current slice
    workingCards.forEach((el, idx) => {
      if (idx >= start && idx < end) {
        el.style.display = '';
      } else {
        el.style.display = 'none';
      }
    });
    updateCounts();
  }

  function sortCards(mode) {
    const getPrice = (el) => parseInt(el.dataset.price || '0', 10);
    const getName = (el) => (el.dataset.name || '').toLowerCase();

    switch (mode) {
      case 'price-asc':
        workingCards.sort((a, b) => getPrice(a) - getPrice(b));
        break;
      case 'price-desc':
        workingCards.sort((a, b) => getPrice(b) - getPrice(a));
        break;
      case 'name-asc':
        workingCards.sort((a, b) => getName(a).localeCompare(getName(b)));
        break;
      case 'name-desc':
        workingCards.sort((a, b) => getName(b).localeCompare(getName(a)));
        break;
      default:
        workingCards = [...cards];
    }
    workingCards.forEach((el) => grid.appendChild(el));
  }

  // Events
  if (showSelect) {
    showSelect.addEventListener('change', () => {
      pageSize = parseInt(showSelect.value, 10);
      currentPage = 1;
      renderPage();
    });
  }

  if (sortSelect) {
    sortSelect.addEventListener('change', () => {
      sortCards(sortSelect.value);
      currentPage = 1;
      renderPage();
    });
  }

  if (filterToggle && filterPanel) {
    filterToggle.addEventListener('click', () => {
      const isHidden = filterPanel.hasAttribute('hidden');
      if (isHidden) {
        filterPanel.removeAttribute('hidden');
        filterToggle.setAttribute('aria-expanded', 'true');
      } else {
        filterPanel.setAttribute('hidden', '');
        filterToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  if (pageButtons.length) {
    pageButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const val = btn.dataset.page;
        if (val === 'next') {
          currentPage += 1;
        } else {
          currentPage = parseInt(val || '1', 10);
        }
        // keep within range
        const maxPage = Math.max(1, Math.ceil(workingCards.length / pageSize));
        if (currentPage > maxPage) currentPage = maxPage;
        if (currentPage < 1) currentPage = 1;
        pageButtons.forEach((b) => b.classList.toggle('active', b.dataset.page === String(currentPage)));
        renderPage();
      });
    });
  }

  // Initialize
  renderPage();

  // Setup overlay action handlers for share, compare, and like
  function setupOverlayActions() {
    grid.querySelectorAll('.overlay-action').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        const card = btn.closest('.product-card');
        if (!card) return;
        
        const btnText = btn.textContent.trim().toLowerCase();
        
        // Handle Share button
        if (btnText.includes('share')) {
          const productName = card.dataset.name || card.querySelector('.card-title')?.textContent || 'Product';
          const productUrl = window.location.href;
          
          // Try to use Web Share API if available
          if (navigator.share) {
            navigator.share({
              title: productName,
              text: `Check out ${productName} on Furniro!`,
              url: productUrl
            }).catch(err => {
              console.log('Error sharing:', err);
              // Fallback: copy to clipboard
              copyToClipboard(productUrl);
              showToast('Link copied to clipboard!');
            });
          } else {
            // Fallback: copy to clipboard
            copyToClipboard(productUrl);
            showToast('Link copied to clipboard!');
          }
        }
        
        // Handle Compare button
        else if (btnText.includes('compare')) {
          const productName = card.dataset.name || card.querySelector('.card-title')?.textContent || 'Product';
          showToast(`${productName} added to compare`);
          // You can add compare functionality here (store in localStorage, etc.)
        }
        
        // Handle Like button
        else if (btnText.includes('like')) {
          const product = {
            id: card.dataset.name?.toLowerCase() || `product-${Date.now()}`,
            name: card.dataset.name || card.querySelector('.card-title')?.textContent || 'Product',
            subtitle: card.querySelector('.card-sub')?.textContent || '',
            price: card.querySelector('.price')?.textContent || 'Rp 0',
            priceOld: card.querySelector('.price-old')?.textContent || '',
            image: card.querySelector('.product-img')?.getAttribute('src') || '',
            badge: card.querySelector('.badge')?.classList.contains('badge-sale') ? 'sale' : 
                   card.querySelector('.badge')?.classList.contains('badge-new') ? 'new' : '',
            badgeText: card.querySelector('.badge')?.textContent || ''
          };
          
          // Use wishlist functions from script.js if available
          if (typeof getWishlist === 'function' && typeof addToWishlist === 'function' && typeof removeFromWishlist === 'function') {
            const wishlist = getWishlist();
            const isLiked = wishlist.some(item => item.id === product.id);
            
            if (isLiked) {
              removeFromWishlist(product.id);
              btn.classList.remove('is-liked');
              const img = btn.querySelector('img');
              if (img) img.src = 'assets/images/icons/Heart.png';
              showToast(`${product.name} removed from wishlist`);
            } else {
              addToWishlist(product);
              btn.classList.add('is-liked');
              const img = btn.querySelector('img');
              if (img) img.src = 'assets/images/icons/Heart.png'; // You can use a filled heart icon here
              showToast(`${product.name} added to wishlist`);
            }
          } else {
            // Simple toggle if wishlist functions not available
            btn.classList.toggle('is-liked');
            const isLiked = btn.classList.contains('is-liked');
            showToast(isLiked ? `${product.name} added to wishlist` : `${product.name} removed from wishlist`);
          }
        }
      });
    });
  }
  
  // Helper function to copy to clipboard
  function copyToClipboard(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text);
    } else {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.opacity = '0';
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
      } catch (err) {
        console.error('Failed to copy:', err);
      }
      document.body.removeChild(textArea);
    }
  }
  
  // Helper function to show toast notification
  // Use global showToast from script.js if available, otherwise create our own
  function showToast(message) {
    // Try to use global showToast from script.js (loaded before this file)
    // Since script.js loads first, showToast should be in global scope
    if (typeof window.showToast === 'function') {
      window.showToast(message);
      return;
    }
    
    // Fallback: Create simple toast if global function not available
    const toast = document.createElement('div');
    toast.style.cssText = `
      position: fixed;
      bottom: 24px;
      right: 24px;
      background: #1A1A1A;
      color: #FFFFFF;
      padding: 12px 16px;
      border-radius: 6px;
      font-family: 'Poppins', sans-serif;
      box-shadow: 0 10px 25px rgba(0,0,0,0.2);
      z-index: 2000;
      opacity: 0;
      transform: translateY(10px);
      transition: opacity 0.25s ease, transform 0.25s ease;
    `;
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

  // Make product cards clickable to navigate to product detail page
  grid.addEventListener('click', (e) => {
    const card = e.target.closest('.product-card');
    if (!card) return;
    
    // Don't navigate if clicking on buttons or overlay actions
    if (e.target.closest('.btn-add') || e.target.closest('.overlay-action') || e.target.closest('.overlay')) {
      // Handle add to cart
      const btn = e.target.closest('.btn-add');
      if (btn) {
        const product = {
          id: card.dataset.name?.toLowerCase() || `product-${Date.now()}`,
          name: card.dataset.name || 'Product',
          subtitle: card.querySelector('.card-sub')?.textContent || '',
          price: card.querySelector('.price')?.textContent || 'Rp 0',
          priceOld: card.querySelector('.price-old')?.textContent || '',
          image: card.querySelector('.product-img')?.getAttribute('src') || '',
          badge: card.querySelector('.badge')?.classList.contains('badge-sale') ? 'sale' : 
                 card.querySelector('.badge')?.classList.contains('badge-new') ? 'new' : '',
          badgeText: card.querySelector('.badge')?.textContent || ''
        };
        
        // Add to cart using cart utilities
        if (typeof addToCart === 'function') {
          addToCart(product);
          btn.textContent = 'Added!';
          setTimeout(() => (btn.textContent = 'Add to cart'), 1200);
        } else {
          btn.textContent = 'Added!';
          setTimeout(() => (btn.textContent = 'Add to cart'), 1200);
        }
      }
      return;
    }
    
    // Navigate to product detail page
    const productId = card.dataset.name?.toLowerCase();
    if (productId) {
      window.location.href = `product-detail.html?id=${productId}`;
    }
  });
  
  // Make product cards have pointer cursor
  grid.querySelectorAll('.product-card').forEach(card => {
    card.style.cursor = 'pointer';
  });
  
  // Setup overlay actions
  setupOverlayActions();
})();


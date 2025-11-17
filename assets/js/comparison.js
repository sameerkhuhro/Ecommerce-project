// Comparison page functionality
(function() {
    'use strict';
    
    function renderComparison() {
        if (typeof getComparison !== 'function') {
            setTimeout(renderComparison, 100);
            return;
        }
        
        const comparison = getComparison();
        const container = document.getElementById('comparisonContainer');
        
        if (!container) return;
        
        if (comparison.length === 0) {
            container.innerHTML = `
                <div class="comparison-empty">
                    <h2>No products to compare</h2>
                    <p>Add products to comparison from the shop page</p>
                    <a href="shop.html" class="btn-primary">Go to Shop</a>
                </div>
            `;
            return;
        }
        
        // Create comparison table
        let html = '<div class="comparison-table-wrapper">';
        html += '<table class="comparison-table">';
        
        // Header row with product images and names
        html += '<thead><tr>';
        html += '<th class="comparison-label-col">Product</th>';
        comparison.forEach((product, index) => {
            html += `
                <th class="comparison-product-col">
                    <div class="comparison-product-header">
                        <button class="comparison-remove" data-product-id="${product.id}" aria-label="Remove from comparison">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </button>
                        <div class="comparison-product-image">
                            <img src="${product.image || 'assets/images/Our_products/lolito.png'}" alt="${product.name}">
                        </div>
                        <h3>${product.name}</h3>
                        <p class="comparison-product-subtitle">${product.subtitle || ''}</p>
                        <div class="comparison-product-price">${product.price}</div>
                        ${product.priceOld ? `<div class="comparison-product-price-old">${product.priceOld}</div>` : ''}
                        <a href="product-detail.html?id=${product.id}" class="btn-outline comparison-view-btn">View Product</a>
                    </div>
                </th>
            `;
        });
        
        // Add empty columns if less than 3 products
        for (let i = comparison.length; i < 3; i++) {
            html += `
                <th class="comparison-product-col comparison-empty-col">
                    <div class="comparison-add-product">
                        <p>Add A Product</p>
                        <a href="shop.html" class="btn-primary">Choose a Product</a>
                    </div>
                </th>
            `;
        }
        
        html += '</tr></thead>';
        
        // Comparison rows
        html += '<tbody>';
        
        // General information
        html += '<tr class="comparison-section-header"><td colspan="4"><h3>General</h3></td></tr>';
        
        const generalFields = [
            { label: 'Sales Package', getValue: (p) => '1 piece' },
            { label: 'Model Number', getValue: (p) => p.id.toUpperCase().replace(/-/g, '') || 'N/A' },
            { label: 'Secondary Material', getValue: (p) => 'Solid Wood' },
            { label: 'Configuration', getValue: (p) => 'Standard' },
            { label: 'Upholstery Material', getValue: (p) => 'Fabric' },
            { label: 'Upholstery Color', getValue: (p) => p.subtitle || 'N/A' }
        ];
        
        generalFields.forEach(field => {
            html += '<tr>';
            html += `<td class="comparison-label">${field.label}</td>`;
            comparison.forEach(product => {
                html += `<td>${field.getValue(product)}</td>`;
            });
            // Empty cells for remaining columns
            for (let i = comparison.length; i < 3; i++) {
                html += '<td>-</td>';
            }
            html += '</tr>';
        });
        
        // Product information
        html += '<tr class="comparison-section-header"><td colspan="4"><h3>Product</h3></td></tr>';
        
        const productFields = [
            { label: 'Filling Material', getValue: (p) => 'Foam' },
            { label: 'Finish Type', getValue: (p) => 'Matte' },
            { label: 'Maximum Load Capacity', getValue: (p) => '280 KG' },
            { label: 'Origin of Manufacture', getValue: (p) => 'Indonesia' }
        ];
        
        productFields.forEach(field => {
            html += '<tr>';
            html += `<td class="comparison-label">${field.label}</td>`;
            comparison.forEach(product => {
                html += `<td>${field.getValue(product)}</td>`;
            });
            for (let i = comparison.length; i < 3; i++) {
                html += '<td>-</td>';
            }
            html += '</tr>';
        });
        
        // Dimensions
        html += '<tr class="comparison-section-header"><td colspan="4"><h3>Dimensions</h3></td></tr>';
        
        const dimensionFields = [
            { label: 'Width', getValue: (p) => '265.32 cm' },
            { label: 'Height', getValue: (p) => '76 cm' },
            { label: 'Depth', getValue: (p) => '167.76 cm' },
            { label: 'Weight', getValue: (p) => '45 KG' },
            { label: 'Seat Height', getValue: (p) => '41.52 cm' },
            { label: 'Leg Height', getValue: (p) => '5.46 cm' }
        ];
        
        dimensionFields.forEach(field => {
            html += '<tr>';
            html += `<td class="comparison-label">${field.label}</td>`;
            comparison.forEach(product => {
                html += `<td>${field.getValue(product)}</td>`;
            });
            for (let i = comparison.length; i < 3; i++) {
                html += '<td>-</td>';
            }
            html += '</tr>';
        });
        
        // Warranty
        html += '<tr class="comparison-section-header"><td colspan="4"><h3>Warranty</h3></td></tr>';
        
        const warrantyFields = [
            { label: 'Warranty Summary', getValue: (p) => '1 Year' },
            { label: 'Warranty Service Type', getValue: (p) => 'Product Related Issues. Please Email at operations@funiro.com' },
            { label: 'Covered in Warranty', getValue: (p) => 'Manufacturing defect, Damages due to usage only' },
            { label: 'Not Covered in Warranty', getValue: (p) => 'Product Beyond Its Intended Use, And Wear & Tear In The Natural Course Of Product Usage' },
            { label: 'Domestic Warranty', getValue: (p) => 'N/A' }
        ];
        
        warrantyFields.forEach(field => {
            html += '<tr>';
            html += `<td class="comparison-label">${field.label}</td>`;
            comparison.forEach(product => {
                html += `<td>${field.getValue(product)}</td>`;
            });
            for (let i = comparison.length; i < 3; i++) {
                html += '<td>-</td>';
            }
            html += '</tr>';
        });
        
        html += '</tbody></table></div>';
        
        container.innerHTML = html;
        
        // Add remove button events
        container.querySelectorAll('.comparison-remove').forEach(btn => {
            btn.addEventListener('click', function() {
                const productId = this.getAttribute('data-product-id');
                if (typeof removeFromComparison === 'function') {
                    removeFromComparison(productId);
                    renderComparison();
                }
            });
        });
    }
    
    // Listen for comparison updates
    window.addEventListener('comparisonUpdated', renderComparison);
    
    // Initial render
    renderComparison();
})();


  function updateCart() {
            const quantity = document.querySelector('.quantity-input').value;
            const price = 250000;
            const subtotal = price * quantity;
            
            document.querySelector('.subtotal').textContent = `Rs. ${subtotal.toLocaleString('en-IN')}.00`;
            document.getElementById('subtotal').textContent = `Rs. ${subtotal.toLocaleString('en-IN')}.00`;
            document.getElementById('total').textContent = `Rs. ${subtotal.toLocaleString('en-IN')}.00`;
        }

        function removeItem() {
            if (confirm('Are you sure you want to remove this item?')) {
                document.getElementById('cartItem1').style.display = 'none';
                document.getElementById('subtotal').textContent = 'Rs. 0.00';
                document.getElementById('total').textContent = 'Rs. 0.00';
            }
        }

        function checkout() {
            alert('Proceeding to checkout...');
            // Add checkout functionality here
        }
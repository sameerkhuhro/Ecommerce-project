    function placeOrder() {
            const form = document.getElementById('checkoutForm');
            
            if (form.checkValidity()) {
                const paymentMethod = document.querySelector('input[name="payment"]:checked').value;
                alert(`Order placed successfully!\nPayment Method: ${paymentMethod}\n\nThank you for your purchase!`);
                // Here you would typically send the form data to your server
            } else {
                alert('Please fill in all required fields.');
                form.reportValidity();
            }
        }

        // Optional: Add form validation styling
        document.querySelectorAll('input, select, textarea').forEach(element => {
            element.addEventListener('invalid', function() {
                this.style.borderColor = '#ff0000';
            });
            
            element.addEventListener('input', function() {
                if (this.validity.valid) {
                    this.style.borderColor = '#ddd';
                }
            });
        });
// Contact page interactive functionality

document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    const newsletterForm = document.getElementById('newsletterFormContact');
    
    // Contact form validation and submission
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactSubmit);
        
        // Real-time validation
        const inputs = contactForm.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });
            
            input.addEventListener('input', function() {
                // Clear error on input
                if (this.classList.contains('error')) {
                    clearFieldError(this);
                }
            });
        });
    }
    
    // Newsletter form
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const emailInput = this.querySelector('.newsletter-input');
            const email = emailInput.value.trim();
            
            if (email) {
                showToast('Thank you for subscribing to our newsletter!');
                emailInput.value = '';
            }
        });
    }
});

function validateField(field) {
    const value = field.value.trim();
    const fieldName = field.name;
    const errorElement = document.getElementById(fieldName + 'Error');
    
    let isValid = true;
    let errorMessage = '';
    
    // Remove previous error state
    clearFieldError(field);
    
    // Validation rules
    switch(fieldName) {
        case 'name':
            if (!value) {
                isValid = false;
                errorMessage = 'Name is required';
            } else if (value.length < 2) {
                isValid = false;
                errorMessage = 'Name must be at least 2 characters';
            }
            break;
            
        case 'email':
            if (!value) {
                isValid = false;
                errorMessage = 'Email is required';
            } else if (!isValidEmail(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid email address';
            }
            break;
            
        case 'message':
            if (!value) {
                isValid = false;
                errorMessage = 'Message is required';
            } else if (value.length < 10) {
                isValid = false;
                errorMessage = 'Message must be at least 10 characters';
            }
            break;
    }
    
    if (!isValid) {
        showFieldError(field, errorElement, errorMessage);
    }
    
    return isValid;
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showFieldError(field, errorElement, message) {
    field.classList.add('error');
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.classList.add('show');
    }
}

function clearFieldError(field) {
    field.classList.remove('error');
    const fieldName = field.name;
    const errorElement = document.getElementById(fieldName + 'Error');
    if (errorElement) {
        errorElement.textContent = '';
        errorElement.classList.remove('show');
    }
}

function handleContactSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    const data = {
        name: formData.get('name'),
        email: formData.get('email'),
        subject: formData.get('subject') || 'No subject',
        message: formData.get('message'),
        timestamp: new Date().toISOString()
    };
    
    // Validate all fields
    let isFormValid = true;
    const requiredFields = ['name', 'email', 'message'];
    
    requiredFields.forEach(fieldName => {
        const field = form.querySelector(`[name="${fieldName}"]`);
        if (!validateField(field)) {
            isFormValid = false;
        }
    });
    
    if (!isFormValid) {
        showToast('Please fix the errors in the form', 'error');
        return;
    }
    
    // Save to localStorage
    saveContactSubmission(data);
    
    // Show success message
    showSuccessMessage(form);
    
    // Reset form
    form.reset();
    
    // Show toast notification
    showToast('Thank you! Your message has been sent successfully.');
}

function saveContactSubmission(data) {
    try {
        const submissions = JSON.parse(localStorage.getItem('furniro-contact-submissions') || '[]');
        submissions.push(data);
        // Keep only last 50 submissions
        if (submissions.length > 50) {
            submissions.shift();
        }
        localStorage.setItem('furniro-contact-submissions', JSON.stringify(submissions));
    } catch (err) {
        console.error('Failed to save contact submission', err);
    }
}

function showSuccessMessage(form) {
    // Remove existing success message if any
    const existingMsg = form.querySelector('.success-message');
    if (existingMsg) {
        existingMsg.remove();
    }
    
    // Create success message
    const successMsg = document.createElement('div');
    successMsg.className = 'success-message show';
    successMsg.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 6L9 17l-5-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <span>Your message has been sent successfully! We'll get back to you soon.</span>
    `;
    
    form.insertBefore(successMsg, form.firstChild);
    
    // Remove success message after 5 seconds
    setTimeout(() => {
        successMsg.classList.remove('show');
        setTimeout(() => successMsg.remove(), 300);
    }, 5000);
}

function showToast(message, type = 'success') {
    // Use the toast function from script.js if available
    if (typeof window.showToast === 'function') {
        window.showToast(message);
        return;
    }
    
    // Fallback toast implementation
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.style.cssText = `
        position: fixed;
        bottom: 24px;
        right: 24px;
        background: ${type === 'error' ? '#e74c3c' : '#1A1A1A'};
        color: #FFFFFF;
        padding: 12px 16px;
        border-radius: 6px;
        font-family: 'Poppins', sans-serif;
        box-shadow: 0 10px 25px rgba(0,0,0,0.2);
        opacity: 0;
        transform: translateY(10px);
        transition: opacity .25s ease, transform .25s ease;
        z-index: 2000;
        max-width: 300px;
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
    }, 3000);
}


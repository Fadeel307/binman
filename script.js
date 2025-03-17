document.addEventListener('DOMContentLoaded', () => {
    // Carousel functionality
    const carousel = document.querySelector('.carousel');
    const slides = document.querySelectorAll('.carousel-slide');
    const prevBtn = document.querySelector('.carousel-btn.prev');
    const nextBtn = document.querySelector('.carousel-btn.next');
    const dotsContainer = document.querySelector('.carousel-dots');
    
    let currentSlide = 0;
    const totalSlides = slides.length;

    // Create dots
    slides.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.classList.add('carousel-dot');
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(index));
        dotsContainer.appendChild(dot);
    });

    const dots = document.querySelectorAll('.carousel-dot');

    // Function to update slide
    function updateSlide() {
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        slides[currentSlide].classList.add('active');
        dots[currentSlide].classList.add('active');
    }

    // Function to go to specific slide
    function goToSlide(index) {
        currentSlide = index;
        updateSlide();
    }

    // Next slide
    function nextSlide() {
        currentSlide = (currentSlide + 1) % totalSlides;
        updateSlide();
    }

    // Previous slide
    function prevSlide() {
        currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
        updateSlide();
    }

    // Event listeners
    prevBtn.addEventListener('click', prevSlide);
    nextBtn.addEventListener('click', nextSlide);

    // Auto-play
    let autoplay = setInterval(nextSlide, 5000);

    // Pause autoplay on hover
    carousel.addEventListener('mouseenter', () => {
        clearInterval(autoplay);
    });

    carousel.addEventListener('mouseleave', () => {
        autoplay = setInterval(nextSlide, 5000);
    });

    // Login Modal Functionality
    const modal = document.getElementById('loginModal');
    const loginBtn = document.querySelector('.login-btn');
    const closeModal = document.querySelector('.close-modal');
    const togglePassword = document.querySelector('.toggle-password');
    const passwordInput = document.getElementById('password');
    const loginForm = document.getElementById('loginForm');
    const googleBtn = document.querySelector('.google-btn');
    const appleBtn = document.querySelector('.apple-btn');

    // Open modal
    loginBtn.addEventListener('click', (e) => {
        e.preventDefault();
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    });

    // Close modal
    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    });

    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });

    // Toggle password visibility
    togglePassword.addEventListener('click', () => {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        togglePassword.innerHTML = type === 'password' ? 
            '<i class="far fa-eye"></i>' : 
            '<i class="far fa-eye-slash"></i>';
    });

    // Handle form submission
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const remember = document.getElementById('remember').checked;

        // Here you would typically send this data to your backend
        console.log('Login attempt:', { email, password, remember });
    });

    // Google Sign In
    googleBtn.addEventListener('click', () => {
        // Implement Google Sign In
        console.log('Google sign in clicked');
        // You would typically initialize Google Sign In here
        // window.location.href = 'your-google-auth-endpoint';
    });

    // Apple Sign In
    appleBtn.addEventListener('click', () => {
        // Implement Apple Sign In
        console.log('Apple sign in clicked');
        // You would typically initialize Apple Sign In here
        // window.location.href = 'your-apple-auth-endpoint';
    });

    // Mobile menu functionality
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    mobileMenuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        mobileMenuBtn.classList.toggle('active');
    });
}); 
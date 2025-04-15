// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Sticky Navbar
    const navbar = document.getElementById('navbar');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // Initialize 3D Model Display
    function init3DModel() {
        const modelContainer = document.getElementById('threed-trash-can');
        if (!modelContainer) return;
        
        const loadingSpinner = document.getElementById('model-loading');
        
        try {
            // Create scene
            const scene = new THREE.Scene();
            scene.background = new THREE.Color(0xf5f5f5);
            
            // Create camera
            const camera = new THREE.PerspectiveCamera(75, modelContainer.clientWidth / modelContainer.clientHeight, 0.1, 1000);
            camera.position.z = 5;
            
            // Create renderer
            const renderer = new THREE.WebGLRenderer({ antialias: true });
            renderer.setSize(modelContainer.clientWidth, modelContainer.clientHeight);
            modelContainer.appendChild(renderer.domElement);
            
            // Create a placeholder cube while waiting for the model to load
            const geometry = new THREE.BoxGeometry(2, 2, 2);
            const material = new THREE.MeshBasicMaterial({ color: 0x3CB371, wireframe: true });
            const cube = new THREE.Mesh(geometry, material);
            scene.add(cube);
            
            // Add ambient light
            const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
            scene.add(ambientLight);
            
            // Add directional light
            const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
            directionalLight.position.set(1, 1, 1);
            scene.add(directionalLight);
            
            // Add orbit controls
            const controls = new THREE.OrbitControls(camera, renderer.domElement);
            controls.enableDamping = true;
            controls.dampingFactor = 0.25;
            controls.screenSpacePanning = false;
            controls.maxPolarAngle = Math.PI / 2;
            
            // Animation function
            function animate() {
                requestAnimationFrame(animate);
                cube.rotation.x += 0.01;
                cube.rotation.y += 0.01;
                controls.update();
                renderer.render(scene, camera);
            }
            
            // Start animation
            animate();
            
            // Hide loading spinner
            if (loadingSpinner) {
                loadingSpinner.style.display = 'none';
            }
            
            // Handle window resize
            window.addEventListener('resize', function() {
                camera.aspect = modelContainer.clientWidth / modelContainer.clientHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(modelContainer.clientWidth, modelContainer.clientHeight);
            });
            
        } catch (error) {
            console.error('Error initializing 3D model:', error);
            if (loadingSpinner) {
                loadingSpinner.innerHTML = '<p>Failed to load 3D model. Please try again later.</p>';
            }
        }
    }
    
    // Initialize 3D model immediately
    init3DModel();
    
    // Mobile Nav Toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const authButtons = document.querySelector('.auth-buttons');
    
    hamburger?.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('show');
        authButtons.classList.toggle('show');
    });
    
    // Image Carousel
    const slides = document.querySelectorAll('.carousel-slide');
    const dots = document.querySelectorAll('.carousel-dots .dot');
    const prevBtn = document.querySelector('.prev');
    const nextBtn = document.querySelector('.next');
    let currentSlide = 0;
    let slideInterval;

    // Function to go to a specific slide
    function goToSlide(slideIndex) {
        slides[currentSlide].classList.remove('active');
        dots[currentSlide].classList.remove('active');
        
        currentSlide = slideIndex;
        
        if (currentSlide >= slides.length) {
            currentSlide = 0;
        }
        
        if (currentSlide < 0) {
            currentSlide = slides.length - 1;
        }
        
        slides[currentSlide].classList.add('active');
        dots[currentSlide].classList.add('active');
    }
    
    function goToNextSlide() {
        goToSlide(currentSlide + 1);
    }
    
    function goToPrevSlide() {
        goToSlide(currentSlide - 1);
    }

    function startSlideshow() {
        slideInterval = setInterval(goToNextSlide, 5000);
    }
    
    // Start automatic slideshow
    startSlideshow();
    
    // Next button click
    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
        clearInterval(slideInterval);
            goToNextSlide();
            startSlideshow();
        });
    }
    
    // Previous button click
    if (prevBtn) {
        prevBtn.addEventListener('click', function() {
            clearInterval(slideInterval);
            goToPrevSlide();
        startSlideshow();
    });
    }
    
    // Dot indicators click
    dots.forEach(function(dot, index) {
        dot.addEventListener('click', function() {
            clearInterval(slideInterval);
            goToSlide(index);
            startSlideshow();
        });
    });

    // Intersection Observer for animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    // Stats Counter Animation
    const stats = document.querySelectorAll('.stat-number');
    let statsAnimated = false;
    
    // Immediately animate stats instead of waiting for intersection
    function initStats() {
        const stats = document.querySelectorAll('.stat-number');
        if (!stats.length) return;

        stats.forEach(function(stat) {
            const target = parseInt(stat.getAttribute('data-count'));
            // Set the value immediately
            stat.textContent = target.toLocaleString();
            stat.style.opacity = "1";
        });
    }
    
    // Initialize stats immediately
    initStats();

    // Chart initialization for impact section
    function initCharts() {
        console.log("Initializing charts...");
        
        // Check if charts exist
        const wasteChart = document.getElementById('wasteChart');
        const impactChart = document.getElementById('impactChart');
        
        if (!wasteChart || !impactChart) {
            console.log("Charts not found in DOM");
            return;
        }
        
        // Explicitly clear any previous charts
        if (window.wasteChartInstance) window.wasteChartInstance.destroy();
        if (window.impactChartInstance) window.impactChartInstance.destroy();
        
        try {
            // Set global Chart.js options for better visibility
            Chart.defaults.font.family = "'Poppins', sans-serif";
            Chart.defaults.color = '#333';
            Chart.defaults.responsive = true;
            Chart.defaults.maintainAspectRatio = false;
            
            console.log("Creating waste chart...");
            // Line Chart - Waste Reduction (Realistic growth over 12 months)
            window.wasteChartInstance = new Chart(wasteChart.getContext('2d'), {
                type: 'line',
                data: {
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                    datasets: [{
                        label: 'Waste Reduction (kg)',
                        data: [850, 1200, 1850, 2400, 3100, 4200, 5700, 7200, 8600, 9800, 11200, 12500],
                        backgroundColor: 'rgba(60, 179, 113, 0.2)',
                        borderColor: 'rgba(60, 179, 113, 1)',
                        borderWidth: 3,
                        pointBackgroundColor: '#fff',
                        pointBorderColor: 'rgba(60, 179, 113, 1)',
                        pointBorderWidth: 2,
                        pointRadius: 4,
                        pointHoverRadius: 6,
                        fill: true,
                        tension: 0.3
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true,
                            grid: {
                                color: 'rgba(200, 200, 200, 0.2)'
                            },
                            ticks: {
                                callback: function(value) {
                                    return value >= 1000 ? value/1000 + 'k' : value;
                                },
                                color: '#555'
                            }
                        },
                        x: {
                            grid: {
                                display: false
                            },
                            ticks: {
                                color: '#555'
                            }
                        }
                    },
                    plugins: {
                        legend: {
                            display: false
                        },
                        tooltip: {
                            backgroundColor: 'rgba(0, 0, 0, 0.7)',
                            titleFont: {
                                size: 14
                            },
                            bodyFont: {
                                size: 13
                            },
                            callbacks: {
                                label: function(context) {
                                    return context.parsed.y.toLocaleString() + ' kg';
                                }
                            }
                        }
                    }
                }
            });
            
            console.log("Creating impact chart...");
            // Doughnut Chart - Impact Distribution (Realistic breakdown of waste streams)
            window.impactChartInstance = new Chart(impactChart.getContext('2d'), {
                type: 'doughnut',
                data: {
                    labels: ['Recycled Plastic', 'Recycled Paper', 'Composted', 'Repurposed Materials', 'Donated Items'],
                    datasets: [{
                        data: [32, 28, 22, 12, 6],
                        backgroundColor: [
                            'rgba(46, 204, 113, 0.8)',  // Green for plastic
                            'rgba(52, 152, 219, 0.8)',  // Blue for paper
                            'rgba(155, 89, 182, 0.8)',  // Purple for composted
                            'rgba(241, 196, 15, 0.8)',  // Yellow for repurposed
                            'rgba(230, 126, 34, 0.8)'   // Orange for donated
                        ],
                        borderColor: 'rgba(255, 255, 255, 1)',
                        borderWidth: 2,
                        hoverOffset: 15
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    cutout: '65%',
                    plugins: {
                        legend: {
                            position: 'bottom',
                            labels: {
                                padding: 15,
                                boxWidth: 12,
                                font: {
                                    size: 11,
                                    weight: 'bold'
                                },
                                color: '#333'
                            }
                        },
                        tooltip: {
                            backgroundColor: 'rgba(0, 0, 0, 0.7)',
                            callbacks: {
                                label: function(context) {
                                    return `${context.label}: ${context.parsed}%`;
                                }
                            }
                        }
                    }
                }
            });
            
            console.log("Charts created successfully");
        } catch (error) {
            console.error('Error initializing charts:', error);
        }
    }

    // Initialize charts with a slight delay to ensure DOM is ready
    setTimeout(function() {
        initCharts();
    }, 300);
    
    // Steps Animation
    const steps = document.querySelectorAll('.step');
    
    const stepsObserver = new IntersectionObserver(function(entries) {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('animated');
                }, index * 200); // Staggered animation
            }
        });
    }, observerOptions);
    
    steps.forEach(step => {
        stepsObserver.observe(step);
    });
    
    // Testimonial Slider
    const testimonialSlider = document.querySelector('.testimonial-slider');
    const testimonials = document.querySelectorAll('.testimonial');
    const testimonialDots = document.querySelectorAll('.testimonial-dots .dot');
    const prevTestimonialBtn = document.querySelector('.prev-testimonial');
    const nextTestimonialBtn = document.querySelector('.next-testimonial');
    let currentTestimonial = 0;
    let testimonialInterval;
    
    // Function to go to a specific testimonial
    function goToTestimonial(index) {
        if (!testimonialSlider) return;
        
        if (testimonialDots.length > 0) {
            testimonialDots[currentTestimonial].classList.remove('active');
        }
        
        currentTestimonial = index;
        
        if (currentTestimonial >= testimonials.length) {
            currentTestimonial = 0;
        }
        
        if (currentTestimonial < 0) {
            currentTestimonial = testimonials.length - 1;
        }
        
        testimonialSlider.style.transform = `translateX(-${currentTestimonial * 100}%)`;
        
        if (testimonialDots.length > 0) {
            testimonialDots[currentTestimonial].classList.add('active');
        }
    }
    
    function nextTestimonial() {
        goToTestimonial((currentTestimonial + 1) % testimonials.length);
    }
    
    function prevTestimonial() {
        goToTestimonial((currentTestimonial - 1 + testimonials.length) % testimonials.length);
    }
    
    function startTestimonialRotation() {
        if (!testimonialSlider) return;
        testimonialInterval = setInterval(nextTestimonial, 8000);
    }
    
    // Start automatic testimonial rotation
    startTestimonialRotation();
    
    // Prev/Next buttons
    if (prevTestimonialBtn) {
        prevTestimonialBtn.addEventListener('click', function() {
            clearInterval(testimonialInterval);
            prevTestimonial();
            startTestimonialRotation();
        });
    }
    
    if (nextTestimonialBtn) {
        nextTestimonialBtn.addEventListener('click', function() {
            clearInterval(testimonialInterval);
            nextTestimonial();
            startTestimonialRotation();
        });
    }
    
    // Testimonial dot indicators click
    testimonialDots.forEach(function(dot, index) {
        dot.addEventListener('click', function() {
            clearInterval(testimonialInterval);
            goToTestimonial(index);
            startTestimonialRotation();
        });
    });
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Chat bubble interaction
    const chatBubble = document.querySelector('.chat-bubble');
    
    if (chatBubble) {
        chatBubble.addEventListener('click', function() {
            alert('Chat support will be available soon!');
        });
    }

    // Section reveal animation
    const sectionsObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        root: null,
        threshold: 0.1
    });

    // Show all sections immediately
        document.querySelectorAll('.section').forEach(section => {
            section.classList.add('visible');
    });

    // Screenshot carousel for download page
    const screenshotCarousel = document.querySelector('.screenshot-carousel');
    if (screenshotCarousel) {
        const screenshots = document.querySelectorAll('.screenshot');
        const prevBtn = document.querySelector('.carousel-btn.prev');
        const nextBtn = document.querySelector('.carousel-btn.next');
        const dotsContainer = document.querySelector('.carousel-dots');
        
        let currentIndex = 0;
        
        // Clear existing dots
        dotsContainer.innerHTML = '';
        
        // Create dots
        screenshots.forEach((_, index) => {
            const dot = document.createElement('span');
            dot.classList.add('dot');
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => {
                goToScreenshot(index);
            });
            dotsContainer.appendChild(dot);
        });
        
        const dots = document.querySelectorAll('.carousel-dots .dot');
        
        // Function to go to a specific slide
        function goToScreenshot(index) {
            // Remove active class from current slide and dot
            screenshots[currentIndex].classList.remove('active');
            dots[currentIndex].classList.remove('active');
            
            // Update index
            currentIndex = index;
            
            // Make sure index is in bounds
            if (currentIndex < 0) {
                currentIndex = screenshots.length - 1;
            } else if (currentIndex >= screenshots.length) {
                currentIndex = 0;
            }
            
            // Add active class to new slide and dot
            screenshots[currentIndex].classList.add('active');
            dots[currentIndex].classList.add('active');
        }
        
        // Next button click
            nextBtn.addEventListener('click', () => {
                goToScreenshot(currentIndex + 1);
            });
        
        // Previous button click
            prevBtn.addEventListener('click', () => {
                goToScreenshot(currentIndex - 1);
            });
        
        // Add keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                goToScreenshot(currentIndex - 1);
            } else if (e.key === 'ArrowRight') {
                goToScreenshot(currentIndex + 1);
            }
        });
        
        // Auto rotate slides every 5 seconds
        let slideInterval = setInterval(() => {
            goToScreenshot(currentIndex + 1);
        }, 5000);
        
        // Pause auto rotation when user interacts with carousel
        screenshotCarousel.addEventListener('mouseenter', () => {
            clearInterval(slideInterval);
        });
        
        // Resume auto rotation when user leaves carousel
        screenshotCarousel.addEventListener('mouseleave', () => {
            slideInterval = setInterval(() => {
                goToScreenshot(currentIndex + 1);
            }, 5000);
        });
    }

    // Login Modal Functionality
    const loginLinks = document.querySelectorAll('.login-link');
    const loginModal = document.getElementById('loginModal');
    const closeModal = document.querySelector('.close-modal');
    
    if (loginLinks.length > 0 && loginModal) {
        // Open modal when login link is clicked
        loginLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                loginModal.style.display = 'block';
                document.body.style.overflow = 'hidden'; // Prevent scrolling
            });
        });
        
        // Close modal when X is clicked
        if (closeModal) {
            closeModal.addEventListener('click', function() {
                loginModal.style.display = 'none';
                document.body.style.overflow = 'auto'; // Enable scrolling
            });
        }
        
        // Close modal when clicking outside of it
        window.addEventListener('click', function(e) {
            if (e.target === loginModal) {
                loginModal.style.display = 'none';
                document.body.style.overflow = 'auto'; // Enable scrolling
            }
        });
        
        // Toggle password visibility
        const togglePassword = document.querySelector('.toggle-password');
        if (togglePassword) {
            togglePassword.addEventListener('click', function() {
                const passwordInput = document.getElementById('password');
                const icon = this.querySelector('i');
                
                if (passwordInput.type === 'password') {
                    passwordInput.type = 'text';
                    icon.classList.remove('fa-eye');
                    icon.classList.add('fa-eye-slash');
                } else {
                    passwordInput.type = 'password';
                    icon.classList.remove('fa-eye-slash');
                    icon.classList.add('fa-eye');
            }
        });
    }

        // Handle login form submission
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', function(e) {
                e.preventDefault();
                // Here you would typically send the login data to your server
                alert('Login functionality will be implemented soon!');
            });
        }
    }

    // Phone App Screenshots Carousel
    class Carousel {
        constructor(element) {
            this.carousel = element;
            this.container = element.querySelector('.carousel-container');
            this.slides = Array.from(element.querySelectorAll('.screenshot-wrapper'));
            this.dotsContainer = element.querySelector('.carousel-dots');
            this.prevBtn = element.querySelector('.prev');
            this.nextBtn = element.querySelector('.next');
            
            this.currentIndex = 0;
            this.slideWidth = 0;
            this.totalSlides = this.slides.length;
            
            this.init();
        }
        
        init() {
            // Create dots
            this.slides.forEach((_, index) => {
                const dot = document.createElement('div');
                dot.classList.add('dot');
                if (index === 0) dot.classList.add('active');
                dot.addEventListener('click', () => this.goToSlide(index));
                this.dotsContainer.appendChild(dot);
            });
            
            // Add event listeners
            this.prevBtn.addEventListener('click', () => this.prevSlide());
            this.nextBtn.addEventListener('click', () => this.nextSlide());
            
            // Set initial position
            this.updateCarousel();
            
            // Add touch support
            this.addTouchSupport();
            
            // Add resize handler
            window.addEventListener('resize', () => this.updateCarousel());
        }
        
        updateCarousel() {
            this.slideWidth = this.slides[0].offsetWidth;
            this.container.style.transform = `translateX(${-this.currentIndex * this.slideWidth}px)`;
            
            // Update dots
            const dots = this.dotsContainer.querySelectorAll('.dot');
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === this.currentIndex);
            });
            
            // Update slides
            this.slides.forEach((slide, index) => {
                if (index === this.currentIndex) {
                    slide.style.opacity = '1';
                } else {
                    slide.style.opacity = '0.5';
                }
            });
        }
        
        prevSlide() {
            this.currentIndex = (this.currentIndex - 1 + this.totalSlides) % this.totalSlides;
            this.updateCarousel();
        }
        
        nextSlide() {
            this.currentIndex = (this.currentIndex + 1) % this.totalSlides;
            this.updateCarousel();
        }
        
        goToSlide(index) {
            this.currentIndex = index;
            this.updateCarousel();
        }
        
        addTouchSupport() {
            let startX, moveX;
            const threshold = 50;
            
            this.container.addEventListener('touchstart', (e) => {
                startX = e.touches[0].clientX;
            });
            
            this.container.addEventListener('touchmove', (e) => {
                moveX = e.touches[0].clientX;
            });
            
            this.container.addEventListener('touchend', () => {
                const diff = startX - moveX;
                if (Math.abs(diff) > threshold) {
                    if (diff > 0) {
                        this.nextSlide();
                    } else {
                        this.prevSlide();
                    }
                }
            });
        }
    }

    // Initialize carousel when DOM is loaded
    document.addEventListener('DOMContentLoaded', () => {
        const phoneCarousel = document.querySelector('.phone-carousel');
        if (phoneCarousel) {
            new Carousel(phoneCarousel);
        }
        
        // Initialize AOS
        AOS.init({
            duration: 800,
            offset: 100,
            once: true
        });
    });

    // Chat bubble animation
    const chatBubble = document.querySelector('.chat-bubble');
    if (chatBubble) {
        chatBubble.addEventListener('mouseenter', () => {
            chatBubble.style.transform = 'scale(1.1)';
        });
        
        chatBubble.addEventListener('mouseleave', () => {
            chatBubble.style.transform = 'scale(1)';
        });
    }

    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Implement App Interface Showcase carousel on download page
    function initAppInterfaceCarousel() {
        const slides = document.querySelectorAll('.image-carousel .image-slide');
        const indicators = document.querySelectorAll('.carousel-indicators .indicator');
        const prevBtn = document.querySelector('.carousel-nav-btn.prev-btn');
        const nextBtn = document.querySelector('.carousel-nav-btn.next-btn');
        
        if (!slides.length || !indicators.length) return; // Exit if elements don't exist
        
        let currentSlideIndex = 0;
        let slideInterval;
        
        // Function to display a specific slide
        function showSlide(index) {
            // Hide current slide
            slides[currentSlideIndex].classList.remove('active');
            indicators[currentSlideIndex].classList.remove('active');
            
            // Update current index
            currentSlideIndex = index;
            
            // Handle index bounds
            if (currentSlideIndex >= slides.length) {
                currentSlideIndex = 0;
            } else if (currentSlideIndex < 0) {
                currentSlideIndex = slides.length - 1;
            }
            
            // Show new current slide
            slides[currentSlideIndex].classList.add('active');
            indicators[currentSlideIndex].classList.add('active');
        }
        
        // Next slide function
        function nextSlide() {
            showSlide(currentSlideIndex + 1);
        }
        
        // Previous slide function
        function prevSlide() {
            showSlide(currentSlideIndex - 1);
        }
        
        // Start automatic slideshow
        function startSlideshow() {
            if (slideInterval) {
                clearInterval(slideInterval);
            }
            slideInterval = setInterval(nextSlide, 5000);
        }
        
        // Stop slideshow
        function stopSlideshow() {
            if (slideInterval) {
                clearInterval(slideInterval);
            }
        }
        
        // Event listeners for navigation buttons
        if (nextBtn) {
            nextBtn.addEventListener('click', function() {
                stopSlideshow();
                nextSlide();
                startSlideshow();
            });
        }
        
        if (prevBtn) {
            prevBtn.addEventListener('click', function() {
                stopSlideshow();
                prevSlide();
                startSlideshow();
            });
        }
        
        // Event listeners for indicators
        indicators.forEach(function(indicator, index) {
            indicator.addEventListener('click', function() {
                stopSlideshow();
                showSlide(index);
                startSlideshow();
            });
        });
        
        // Add touch swipe support for mobile
        const carousel = document.querySelector('.image-carousel');
        let touchStartX = 0;
        let touchEndX = 0;
        
        if (carousel) {
            carousel.addEventListener('touchstart', function(e) {
                touchStartX = e.changedTouches[0].screenX;
            }, { passive: true });
            
            carousel.addEventListener('touchend', function(e) {
                touchEndX = e.changedTouches[0].screenX;
                handleSwipe();
            }, { passive: true });
            
            function handleSwipe() {
                if (touchEndX < touchStartX - 50) {
                    // Swipe left - next slide
                    stopSlideshow();
                    nextSlide();
                    startSlideshow();
                } else if (touchEndX > touchStartX + 50) {
                    // Swipe right - previous slide
                    stopSlideshow();
                    prevSlide();
                    startSlideshow();
                }
            }
        }
        
        // Start slideshow on page load
        startSlideshow();
    }
    
    // Initialize the App Interface carousel
    initAppInterfaceCarousel();

    // Logo handling
    const logoImg = document.getElementById('nav-logo');
    if (logoImg) {
        // Check if logo has a source
        if (!logoImg.src || logoImg.src === window.location.href || logoImg.src === '') {
            // If no source is set, hide the logo
            logoImg.style.display = 'none';
        }
        
        // Add error handler in case the logo fails to load
        logoImg.onerror = function() {
            this.style.display = 'none';
        };
        
        // Show logo when it loads successfully
        logoImg.onload = function() {
            if (this.src && this.src !== window.location.href) {
                this.style.display = 'inline-block';
            }
        };
    }

    // Authentication functionality
    const authModal = document.getElementById('authModal');
    const loginBtn = document.getElementById('loginBtn');
    const signupBtn = document.getElementById('signupBtn');
    const closeModalBtn = document.querySelector('.close-modal');
    const authTabs = document.querySelectorAll('.auth-tab');
    const authForms = document.querySelectorAll('.auth-form');
    const tabSwitches = document.querySelectorAll('.tab-switch');
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const userProfile = document.getElementById('userProfile');
    const userName = document.getElementById('userName');
    const logoutBtn = document.getElementById('logoutBtn');
    
    // Show auth modal
    function showAuthModal(activeTab = 'login') {
        // Activate the specified tab
        authTabs.forEach(tab => {
            tab.classList.toggle('active', tab.dataset.tab === activeTab);
        });
        
        // Show the corresponding form
        authForms.forEach(form => {
            form.classList.toggle('active', form.id === `${activeTab}Form`);
        });
        
        // Display the modal
        authModal.classList.add('active');
    }
    
    // Hide auth modal
    function hideAuthModal() {
        authModal.classList.remove('active');
        // Reset forms
        loginForm.reset();
        signupForm.reset();
        // Clear error messages
        document.getElementById('loginError').textContent = '';
        document.getElementById('signupError').textContent = '';
    }
    
    // Event Listeners
    loginBtn.addEventListener('click', () => showAuthModal('login'));
    signupBtn.addEventListener('click', () => showAuthModal('signup'));
    closeModalBtn.addEventListener('click', hideAuthModal);
    
    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === authModal) {
            hideAuthModal();
        }
    });
    
    // Tab switching
    authTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetTab = tab.dataset.tab;
            
            // Update active tab
            authTabs.forEach(t => t.classList.toggle('active', t === tab));
            
            // Show corresponding form
            authForms.forEach(form => {
                form.classList.toggle('active', form.id === `${targetTab}Form`);
            });
        });
    });
    
    // Tab switch links
    tabSwitches.forEach(link => {
        link.addEventListener('click', () => {
            const targetTab = link.dataset.tab;
            
            // Update active tab
            authTabs.forEach(tab => {
                tab.classList.toggle('active', tab.dataset.tab === targetTab);
            });
            
            // Show corresponding form
            authForms.forEach(form => {
                form.classList.toggle('active', form.id === `${targetTab}Form`);
            });
        });
    });
    
    // Form submissions
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        
        // Simple validation
        if (!email || !password) {
            document.getElementById('loginError').textContent = 'Please fill in all fields';
            return;
        }
        
        // Simulate successful login
        simulateLogin(email);
    });
    
    signupForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const name = document.getElementById('signupName').value;
        const email = document.getElementById('signupEmail').value;
        const password = document.getElementById('signupPassword').value;
        
        // Simple validation
        if (!name || !email || !password) {
            document.getElementById('signupError').textContent = 'Please fill in all fields';
            return;
        }
        
        if (password.length < 6) {
            document.getElementById('signupError').textContent = 'Password must be at least 6 characters';
            return;
        }
        
        // Simulate successful signup
        simulateLogin(email, name);
    });
    
    // Simulate login/signup (for demo purposes)
    function simulateLogin(email, name = email.split('@')[0]) {
        // Hide buttons, show profile
        loginBtn.style.display = 'none';
        signupBtn.style.display = 'none';
        userProfile.style.display = 'flex';
        
        // Set user info
        userName.textContent = name;
        document.getElementById('userAvatar').textContent = name.charAt(0).toUpperCase();
        
        // Save to localStorage (for demo)
        localStorage.setItem('currentUser', JSON.stringify({ name, email }));
        
        // Close modal
        hideAuthModal();
    }
    
    // Logout functionality
    logoutBtn.addEventListener('click', function() {
        // Show buttons, hide profile
        loginBtn.style.display = 'inline-block';
        signupBtn.style.display = 'inline-block';
        userProfile.style.display = 'none';
        
        // Clear user data
        localStorage.removeItem('currentUser');
    });
    
    // Check if user is logged in (for demo persistence)
    function checkAuthState() {
        const user = JSON.parse(localStorage.getItem('currentUser'));
        if (user) {
            loginBtn.style.display = 'none';
            signupBtn.style.display = 'none';
            userProfile.style.display = 'flex';
            userName.textContent = user.name;
            document.getElementById('userAvatar').textContent = user.name.charAt(0).toUpperCase();
        }
    }
    
    // Check auth state on load
    checkAuthState();
});

// Ensure charts are initialized when window is fully loaded
window.addEventListener('load', function() {
    console.log('Window loaded - ensuring charts are initialized');
    setTimeout(function() {
        initCharts();
    }, 500);
}); 
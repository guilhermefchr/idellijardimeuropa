document.addEventListener('DOMContentLoaded', () => {
    /* ==========================================================================
       1. Sticky Header & Mobile Menu Functionality
       ========================================================================== */
    const header = document.getElementById('header');
    const mobileMenuBtn = document.querySelector('.menu-mobile-btn');
    const mobileMenuOverlay = document.getElementById('mobile-menu');
    const mobileMenuClose = document.querySelector('.menu-mobile-close');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link, .btn-mobile-nav');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    mobileMenuBtn.addEventListener('click', () => {
        mobileMenuOverlay.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scrolling when menu is open
    });

    const closeMobileMenu = () => {
        mobileMenuOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    mobileMenuClose.addEventListener('click', closeMobileMenu);

    mobileNavLinks.forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });

    /* ==========================================================================
       2. Scroll Animations (Intersection Observer)
       ========================================================================== */
    const fadeElements = document.querySelectorAll('.fade-in-up');

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target); // Animate only once
            }
        });
    }, observerOptions);

    fadeElements.forEach(el => {
        observer.observe(el);
    });

    /* ==========================================================================
       3. Dynamic Multi-Step Form Logic
       ========================================================================== */
    const WHATSAPP_NUMBER = "5511999999999"; // <-- COLOCAR NÚMERO REAL AQUI

    const form = document.getElementById('dynamic-lead-form');
    const steps = Array.from(document.querySelectorAll('.form-step'));
    const progressBar = document.getElementById('progress-bar');

    // Buttons
    const nextBtns = document.querySelectorAll('.btn-next');
    const prevBtns = document.querySelectorAll('.btn-prev');
    const submitBtn = document.getElementById('btn-submit');
    const step2NextBtn = document.getElementById('btn-next-2');

    // Inputs Validation state
    let currentStep = 0;

    // Store collected data
    const formData = {
        nome: '',
        ambiente: '',
        prazo: ''
    };

    function updateFormDisplay() {
        // Toggle step visibility
        steps.forEach((step, index) => {
            step.classList.toggle('active', index === currentStep);
        });

        // Update Progress bar (1/3, 2/3, 3/3)
        const progressPercentage = ((currentStep + 1) / steps.length) * 100;
        progressBar.style.width = `${progressPercentage}%`;
    }

    function validateStep(stepIndex) {
        let isValid = true;
        const currentStepEl = steps[stepIndex];

        if (stepIndex === 0) {
            const nameInput = document.getElementById('userName');
            const errorMsg = currentStepEl.querySelector('.error-msg');

            if (nameInput.value.trim().length < 3) {
                errorMsg.style.display = 'block';
                isValid = false;
            } else {
                errorMsg.style.display = 'none';
                formData.nome = nameInput.value.trim();
            }
        }

        if (stepIndex === 1) {
            const radios = currentStepEl.querySelectorAll('input[type="radio"]:checked');
            if (radios.length === 0) isValid = false;
        }

        return isValid;
    }

    // Enable/Disable Step 2 Next Button based on radio selection
    const step2Radios = steps[1].querySelectorAll('input[type="radio"]');
    step2Radios.forEach(radio => {
        radio.addEventListener('change', () => {
            formData.ambiente = radio.value;
            step2NextBtn.disabled = false;
            // Optional: Auto-advance after small delay for better UX
            setTimeout(() => {
                currentStep++;
                updateFormDisplay();
            }, 300);
        });
    });

    // Enable/Disable Submit Button based on Step 3 radio selection
    const step3Radios = steps[2].querySelectorAll('input[type="radio"]');
    step3Radios.forEach(radio => {
        radio.addEventListener('change', () => {
            formData.prazo = radio.value;
            submitBtn.disabled = false;
        });
    });

    // Next Button Click Handlers
    nextBtns.forEach((btn) => {
        btn.addEventListener('click', () => {
            // Only validate if not the specific step 2 button (which is handled by radio change)
            if (btn.id !== 'btn-next-2' && !validateStep(currentStep)) return;

            if (currentStep < steps.length - 1) {
                currentStep++;
                updateFormDisplay();
            }
        });
    });

    // Previus Button Click Handlers
    prevBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if (currentStep > 0) {
                currentStep--;
                updateFormDisplay();
            }
        });
    });

    /* ==========================================================================
       4. Form Submission & WhatsApp Redirect
       ========================================================================== */
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        if (!formData.nome || !formData.ambiente || !formData.prazo) return; // Fallback check

        // Construct personalized message
        const message = `Olá, equipe Idélli Jardim Europa!
Meu nome é *${formData.nome}*.
Gostaria de falar sobre um projeto para *${formData.ambiente}*.
A minha expectativa de prazo é: *${formData.prazo}*.
Podemos conversar?`;

        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;

        // Show loading state on button
        submitBtn.innerHTML = 'Redirecionando... <i class="ph ph-spinner-gap ph-spin"></i>';
        submitBtn.disabled = true;

        // Redirect to WhatsApp
        setTimeout(() => {
            window.location.href = whatsappUrl;

            // Reset button state just in case user comes back
            setTimeout(() => {
                submitBtn.innerHTML = 'Falar no WhatsApp <i class="ph ph-whatsapp-logo"></i>';
                submitBtn.disabled = false;
            }, 2000);

        }, 500); // Small delay to show user action was registered
    });

    /* ==========================================================================
       5. Counter Animation (Factory Section)
       ========================================================================== */
    const counters = document.querySelectorAll('.counter-number');
    const counterObserverOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.8
    };

    const counterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = +counter.getAttribute('data-target');
                const duration = 2000; // 2 seconds
                const increment = target / (duration / 16); // 60fps
                let current = 0;

                const updateCounter = () => {
                    current += increment;
                    if (current < target) {
                        counter.childNodes[0].nodeValue = Math.ceil(current);
                        requestAnimationFrame(updateCounter);
                    } else {
                        counter.childNodes[0].nodeValue = target;
                    }
                };

                updateCounter();
                observer.unobserve(counter);
            }
        });
    }, counterObserverOptions);

    counters.forEach(counter => {
        counterObserver.observe(counter);
    });

    /* ==========================================================================
       6. Interactive Materials Showcase
       ========================================================================== */
    const materialBtns = document.querySelectorAll('.material-btn');
    const showcaseImg = document.getElementById('showcase-img');
    const showcaseLoader = document.querySelector('.showcase-loader');

    if (materialBtns.length > 0 && showcaseImg) {
        materialBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Remove active class from all
                materialBtns.forEach(b => b.classList.remove('active'));

                // Add active class to clicked
                btn.classList.add('active');

                const newImgSrc = btn.getAttribute('data-img');

                // If it's already the same image, do nothing
                if (showcaseImg.src.includes(newImgSrc)) return;

                // Start transition
                showcaseImg.classList.add('fade-out');
                showcaseLoader.classList.add('active');

                // Preload image
                const tempImg = new Image();
                tempImg.onload = () => {
                    showcaseImg.src = newImgSrc;
                    showcaseImg.alt = "Ambiente com " + (btn.getAttribute('data-name') || "material selecionado");

                    // Small delay to ensure smooth transition
                    setTimeout(() => {
                        showcaseImg.classList.remove('fade-out');
                        showcaseLoader.classList.remove('active');
                    }, 100);
                };
                tempImg.src = newImgSrc;
            });
        });
    }
});

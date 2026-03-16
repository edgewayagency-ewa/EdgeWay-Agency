// Ensure all scripts wait for DOM load
document.addEventListener("DOMContentLoaded", () => {
    
    // --- Lenis Smooth Scroll ---
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Integrate lenis with ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);
    
    // --- Custom Cursor ---
    const cursor = document.getElementById('custom-cursor');
    const isMobile = window.innerWidth <= 768;
    
    if (!isMobile && cursor) {
        // Track mouse position
        let mouseX = 0, mouseY = 0;
        let cursorX = 0, cursorY = 0;
        
        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        // Loop for smooth trailing
        const renderCursor = () => {
            // interpolation for trail effect
            cursorX += (mouseX - cursorX) * 0.2;
            cursorY += (mouseY - cursorY) * 0.2;
            cursor.style.transform = `translate(${cursorX}px, ${cursorY}px) translate(-50%, -50%)`;
            requestAnimationFrame(renderCursor);
        };
        requestAnimationFrame(renderCursor);
        
        // Hover effects on links/buttons
        const interactiveEle = document.querySelectorAll('a, button');
        interactiveEle.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.classList.add('hovering');
            });
            el.addEventListener('mouseleave', () => {
                cursor.classList.remove('hovering');
            });
        });
    }

    // --- Theme Toggle Setup ---
    const themeBtn = document.getElementById('theme-toggle');
    const body = document.body;
    
    // Check saved theme or preference
    const savedTheme = localStorage.getItem('edgeway-theme');
    if (savedTheme) {
        body.setAttribute('data-theme', savedTheme);
    } else {
        body.setAttribute('data-theme', 'dark');
    }

    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            if (body.getAttribute('data-theme') === 'dark') {
                body.setAttribute('data-theme', 'light');
                localStorage.setItem('edgeway-theme', 'light');
            } else {
                body.setAttribute('data-theme', 'dark');
                localStorage.setItem('edgeway-theme', 'dark');
            }
        });
    }

    // --- Navbar Scroll Effect ---
    window.addEventListener('scroll', () => {
        const nav = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });
    
    // --- Hero Animations Loading Sequence ---
    // 0.0s -> Black screen, Handled by CSS
    const heroTl = gsap.timeline({delay: 0.2});
    
    // 0.2s -> Noise texture fades in (already opacity 0.03 in css, maybe animate an overlay? actually, it's fine as static noise.)
    
    // 0.8s -> Micro label slides in
    heroTl.to('.micro-label', {
        opacity: 1,
        x: 0,
        duration: 0.8,
        ease: "power3.out",
        onStart: () => {
            gsap.set('.micro-label', {x: -30});
        }
    }, "+=0.6");
    
    // 1.0s -> Headline lines reveal
    heroTl.to('.hero-headline .line', {
        y: 0,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.2
    }, "-=0.4");
    
    // 1.6s -> Sub line fades up
    heroTl.fromTo('.hero-sub', {
        opacity: 0,
        y: 20
    }, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out"
    }, "-=0.2");
    
    // 1.9s -> CTA Button
    heroTl.fromTo('.btn-primary.hero-cta', {
        opacity: 0,
        y: 20
    }, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out",
        onComplete: () => {
            // Activate glow
            document.querySelector('.btn-primary.hero-cta').classList.add('glow-cyan');
            setTimeout(() => {
                document.querySelector('.btn-primary.hero-cta').classList.remove('glow-cyan');
            }, 1000); // give it a transient glow initially if wanted, or just rely on CSS
        }
    }, "-=0.4");
    
    // 2.1s -> Social proof
    heroTl.fromTo('.social-proof', {
        opacity: 0
    }, {
        opacity: 1,
        duration: 0.8
    }, "-=0.4");
        
    // --- SCROLL ANIMATIONS ---
    
    // Services Grid
    gsap.fromTo('.service-card', {
        opacity: 0,
        x: -60
    }, {
        scrollTrigger: {
            trigger: '#services',
            start: 'top 70%',
            onEnter: () => {
                const cards = document.querySelectorAll('.service-card');
                cards.forEach((card, i) => {
                    setTimeout(() => {
                        card.classList.add('in-view');
                    }, i * 150);
                });
            }
        },
        opacity: 1,
        x: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power3.out'
    });

    // Process Timeline
    const processTl = gsap.timeline({
        scrollTrigger: {
            trigger: '.timeline-wrapper',
            start: 'top 75%',
            end: 'bottom center',
            scrub: 1
        }
    });

    processTl.to('.timeline-line-progress', {
        width: '100%',
        ease: 'none'
    });

    const steps = document.querySelectorAll('.step');
    steps.forEach((step, i) => {
        gsap.to(step, {
            scrollTrigger: {
                trigger: step,
                start: 'top 60%',
                onEnter: () => step.classList.add('active'),
                onLeaveBack: () => step.classList.remove('active')
            }
        });
    });

    // Why EdgeWay Cards
    gsap.fromTo('.reason-card', {
        opacity: 0,
        x: -30
    }, {
        scrollTrigger: {
            trigger: '.reasons-grid',
            start: 'top 80%'
        },
        opacity: 1,
        x: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: 'power3.out'
    });

    // Contact Form & Text
    gsap.fromTo('.contact-text', {
        opacity: 0,
        x: -40
    }, {
        scrollTrigger: {
            trigger: '#contact',
            start: 'top 70%'
        },
        opacity: 1,
        x: 0,
        duration: 1,
        ease: 'power3.out'
    });

    gsap.fromTo('.contact-form-wrapper', {
        opacity: 0,
        x: 40
    }, {
        scrollTrigger: {
            trigger: '#contact',
            start: 'top 70%'
        },
        opacity: 1,
        x: 0,
        duration: 1,
        ease: 'power3.out'
    });

    // --- Swiper Initialization ---
    if (typeof Swiper !== 'undefined') {
        const portfolioSwiper = new Swiper('.portfolio-slider', {
            slidesPerView: 1,
            spaceBetween: 30,
            grabCursor: true,
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            breakpoints: {
                768: {
                    slidesPerView: 1.5,
                    spaceBetween: 40,
                },
                1024: {
                    slidesPerView: 2.2,
                    spaceBetween: 50,
                }
            }
        });
    }
        
    // --- THREE.JS GLOBE IMPLEMENTATION ---
    const container = document.getElementById('globe-container');
    if (container && window.THREE) {
        // Setup
        const scene = new THREE.Scene();
        let w = container.clientWidth;
        let h = container.clientHeight;
        const camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 1000);
        camera.position.z = 250;

        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setSize(w, h);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        container.appendChild(renderer.domElement);

        const globeGroup = new THREE.Group();
        scene.add(globeGroup);

        const baseColor = new THREE.Color(0x00F5FF);

        // Globe Geometry
        const radius = isMobile ? 80 : 160; // Scale to fit as a background
        const geometry = new THREE.IcosahedronGeometry(radius, 2);
        
        // Nodes (Points)
        const pointsMaterial = new THREE.PointsMaterial({
            color: baseColor,
            size: 2,
            transparent: true,
            opacity: 1.0
        });
        const points = new THREE.Points(geometry, pointsMaterial);
        globeGroup.add(points);

        // Lines (Wireframe)
        const wireframeMaterial = new THREE.LineBasicMaterial({
            color: baseColor,
            transparent: true,
            opacity: 0.4
        });
        const wireframe = new THREE.LineSegments(new THREE.WireframeGeometry(geometry), wireframeMaterial);
        globeGroup.add(wireframe);

        // Particle field
        const particlesGeometry = new THREE.BufferGeometry();
        const particlesCount = 200;
        const posArray = new Float32Array(particlesCount * 3);
        
        for(let i = 0; i < particlesCount * 3; i++) {
            posArray[i] = (Math.random() - 0.5) * 600; 
        }
        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
        const particlesMaterial = new THREE.PointsMaterial({
            size: 1.5,
            color: baseColor,
            transparent: true,
            opacity: 0.2
        });
        const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
        // drift particles behind globe
        particlesMesh.position.z = -100;
        scene.add(particlesMesh);

        // Mouse interaction state
        let targetRotationX = 0;
        let targetRotationY = 0;
        let mouseXObj = 0;
        let mouseYObj = 0;
        let windowHalfX = window.innerWidth / 2;
        let windowHalfY = window.innerHeight / 2;
        let isHoveringGlobe = false;
        let isTabActive = true;

        document.addEventListener('visibilitychange', () => {
            isTabActive = !document.hidden;
        });

        document.addEventListener('mousemove', (event) => {
            mouseXObj = (event.clientX - windowHalfX);
            mouseYObj = (event.clientY - windowHalfY);
            
            // simple check if mouse is on the right side of the screen roughly
            if (event.clientX > window.innerWidth / 2) {
                isHoveringGlobe = true;
            } else {
                isHoveringGlobe = false;
            }
        });

        // Intro Animation
        gsap.to(container, {
            opacity: 0.3, // Subtle background visibility
            duration: 1.5,
            delay: 0.5
        });
        
        // Float animation wrapper
        const floatGroup = new THREE.Group();
        floatGroup.add(globeGroup);
        scene.add(floatGroup);

        // Animation Loop
        const clock = new THREE.Clock();
        function animate() {
            requestAnimationFrame(animate);
            if (!isTabActive) return;

            const time = clock.getElapsedTime();

            // Auto-rotate left to right 0.002 rad
            let rotationSpeed = 0.002;
            
            if (!isMobile) {
                if (isHoveringGlobe) {
                    rotationSpeed = 0.0035;
                    targetRotationY = (mouseXObj * 0.0005);
                    targetRotationX = (mouseYObj * 0.0005);
                    
                    // tilt towards cursor
                    globeGroup.rotation.x += (targetRotationX - globeGroup.rotation.x) * 0.05;
                    // Max tilt 15 degrees (~0.26 rad)
                    globeGroup.rotation.x = Math.max(-0.26, Math.min(0.26, globeGroup.rotation.x));
                } else {
                    // return to center tilt
                    globeGroup.rotation.x += (0 - globeGroup.rotation.x) * 0.05;
                }
            } else {
                 // Mobile gyro would go here, omitting for simplicity/permissions, keeping auto-rotate
            }

            globeGroup.rotation.y += rotationSpeed;

            // Float up and down
            floatGroup.position.y = Math.sin(time * (Math.PI / 2)) * 10;

            // Particles drift gently
            particlesMesh.rotation.y += 0.0005;
            particlesMesh.rotation.x += 0.0002;

            renderer.render(scene, camera);
        }
        animate();

        // Handle Resize
        window.addEventListener('resize', () => {
            if(!container) return;
            w = container.clientWidth;
            h = container.clientHeight;
            renderer.setSize(w, h);
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
            windowHalfX = window.innerWidth / 2;
            windowHalfY = window.innerHeight / 2;
        });
    }

    // --- Formspree AJAX Submission ---
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const submitBtn = contactForm.querySelector('.form-submit');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Sending...';
            submitBtn.style.opacity = '0.5';
            submitBtn.style.pointerEvents = 'none';

            try {
                const response = await fetch(contactForm.action, {
                    method: 'POST',
                    body: new FormData(contactForm),
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    contactForm.reset();
                    submitBtn.textContent = 'Sent Successfully!';
                    submitBtn.style.background = 'var(--accent-cyan)';
                    submitBtn.style.color = '#000';
                    
                    setTimeout(() => {
                        submitBtn.textContent = originalText;
                        submitBtn.style.background = ''; // reset to CSS defined
                        submitBtn.style.color = '';
                    }, 4000);
                } else {
                    throw new Error('Form submission failed');
                }
            } catch (error) {
                console.error('Error submitting form:', error);
                submitBtn.textContent = 'Error. Try Again.';
                submitBtn.style.background = '#ff4444';
                
                setTimeout(() => {
                    submitBtn.textContent = originalText;
                    submitBtn.style.background = '';
                }, 3000);
            } finally {
                submitBtn.style.opacity = '1';
                submitBtn.style.pointerEvents = 'auto';
            }
        });
    }
});

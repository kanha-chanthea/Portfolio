// Dark / light mode toggle
const themeToggle = document.getElementById('themeToggle');
const themeToggleIcon = themeToggle?.querySelector('.theme-toggle-icon');
const savedTheme = localStorage.getItem('theme');

function setTheme(theme) {
    const isLight = theme === 'light';

    document.body.classList.toggle('light-mode', isLight);
    localStorage.setItem('theme', theme);

    if (themeToggle && themeToggleIcon) {
        themeToggleIcon.textContent = isLight ? '☀' : '☾';
        themeToggle.setAttribute('aria-label', isLight ? 'Switch to dark mode' : 'Switch to light mode');
    }
}

setTheme(savedTheme || 'dark');

themeToggle?.addEventListener('click', () => {
    const nextTheme = document.body.classList.contains('light-mode') ? 'dark' : 'light';
    setTheme(nextTheme);
});

// Mobile hamburger toggle
const navToggle = document.getElementById('navToggle');

if (navToggle) {
    navToggle.addEventListener('click', () => {
        const isOpen = document.body.classList.toggle('nav-open');
        navToggle.setAttribute('aria-expanded', isOpen);
    });

    // Close menu on link click
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            document.body.classList.remove('nav-open');
            navToggle.setAttribute('aria-expanded', 'false');
        });
    });

    // Close menu on Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && document.body.classList.contains('nav-open')) {
            document.body.classList.remove('nav-open');
            navToggle.setAttribute('aria-expanded', 'false');
            navToggle.focus();
        }
    });
}

// Hero typewriter animation
const typedText = document.getElementById('typedText');

if (typedText) {
    const roles = [
        'Web Developer',
        'QA Tester',
        
    ];
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeSpeed = 80;

    function typeLoop() {
        const currentRole = roles[roleIndex];

        if (!currentRole) return;

        if (isDeleting) {
            typedText.textContent = currentRole.substring(0, charIndex - 1);
            charIndex--;
            typeSpeed = 40;
        } else {
            typedText.textContent = currentRole.substring(0, charIndex + 1);
            charIndex++;
            typeSpeed = 80;
        }

        if (!isDeleting && charIndex === currentRole.length) {
            typeSpeed = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            charIndex = 0;
            typeSpeed = 300;
        }

        setTimeout(typeLoop, typeSpeed);
    }

    setTimeout(typeLoop, 600);
}

// Active nav link highlight with IntersectionObserver
const navLinks = document.querySelectorAll('.nav-links a');
const sections = document.querySelectorAll('section[id]');

if (sections.length && navLinks.length) {
    const navObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                navLinks.forEach(link => {
                    const isActive = link.getAttribute('href') === `#${entry.target.id}`;
                    link.classList.toggle('active', isActive);
                    if (isActive) {
                        link.setAttribute('aria-current', 'page');
                    } else {
                        link.removeAttribute('aria-current');
                    }
                });
            }
        });
    }, {
        rootMargin: '-15% 0px -55% 0px'
    });

    sections.forEach(section => navObserver.observe(section));
}

// Back to top button
const backToTop = document.getElementById('backToTop');

if (backToTop) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });

    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// Fade in animation
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.15 });

document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

// Interactive hero network
const heroNetwork = document.getElementById('heroNetwork');

if (heroNetwork) {
    const heroSection = heroNetwork.closest('.hero');
    const ctx = heroNetwork.getContext('2d');
    const pointer = { x: 0, y: 0, active: false };
    const particles = [];
    const colors = ['#22D3EE', '#0891B2', '#67E8F9', '#0E7490'];
    let width = 0;
    let height = 0;
    let dpr = 1;

    function resizeNetwork() {
        const rect = heroNetwork.getBoundingClientRect();
        dpr = window.devicePixelRatio || 1;
        width = rect.width;
        height = rect.height;
        heroNetwork.width = width * dpr;
        heroNetwork.height = height * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        const particleCount = Math.max(34, Math.floor(width / 32));
        while (particles.length < particleCount) {
            particles.push(createParticle());
        }
        particles.length = particleCount;
    }

    function createParticle() {
        return {
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * 0.45,
            vy: (Math.random() - 0.5) * 0.45,
            size: Math.random() * 2.2 + 1.4,
            color: colors[Math.floor(Math.random() * colors.length)]
        };
    }

    function updateParticle(particle) {
        particle.x += particle.vx;
        particle.y += particle.vy;

        if (pointer.active) {
            const dx = pointer.x - particle.x;
            const dy = pointer.y - particle.y;
            const distance = Math.hypot(dx, dy);

            if (distance > 0 && distance < 150) {
                const force = (150 - distance) / 150;
                particle.x -= (dx / distance) * force * 2.4;
                particle.y -= (dy / distance) * force * 2.4;
            }
        }

        if (particle.x < 0 || particle.x > width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > height) particle.vy *= -1;

        particle.x = Math.max(0, Math.min(width, particle.x));
        particle.y = Math.max(0, Math.min(height, particle.y));
    }

    function drawNetwork() {
        ctx.clearRect(0, 0, width, height);

        particles.forEach(updateParticle);

        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const first = particles[i];
                const second = particles[j];
                const distance = Math.hypot(first.x - second.x, first.y - second.y);

                if (distance < 135) {
                    ctx.strokeStyle = `rgba(34, 211, 238, ${1 - distance / 135})`;
                    ctx.lineWidth = 1.2;
                    ctx.beginPath();
                    ctx.moveTo(first.x, first.y);
                    ctx.lineTo(second.x, second.y);
                    ctx.stroke();
                }
            }
        }

        particles.forEach(particle => {
            ctx.fillStyle = particle.color;
            ctx.shadowBlur = 12;
            ctx.shadowColor = particle.color;
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fill();
        });

        if (pointer.active) {
            particles.forEach(particle => {
                const distance = Math.hypot(pointer.x - particle.x, pointer.y - particle.y);

                if (distance < 170) {
                    ctx.shadowBlur = 0;
                    ctx.strokeStyle = `rgba(34, 211, 238, ${0.55 - distance / 340})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(pointer.x, pointer.y);
                    ctx.lineTo(particle.x, particle.y);
                    ctx.stroke();
                }
            });

            ctx.shadowBlur = 30;
            ctx.shadowColor = '#22D3EE';
            ctx.strokeStyle = 'rgba(34, 211, 238, 0.45)';
            ctx.beginPath();
            ctx.arc(pointer.x, pointer.y, 95, 0, Math.PI * 2);
            ctx.stroke();
        }

        ctx.shadowBlur = 0;
        requestAnimationFrame(drawNetwork);
    }

    heroSection.addEventListener('pointermove', event => {
        const rect = heroNetwork.getBoundingClientRect();
        pointer.x = event.clientX - rect.left;
        pointer.y = event.clientY - rect.top;
        pointer.active = true;
    });

    heroSection.addEventListener('pointerleave', () => {
        pointer.active = false;
    });

    window.addEventListener('resize', resizeNetwork);
    resizeNetwork();
    drawNetwork();
}

// Contact form / EmailJS submission
const contactForm = document.getElementById("contactForm");

if (contactForm) {
    contactForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const button = document.getElementById("sendButton");

        if (!contactForm.checkValidity()) {
            contactForm.reportValidity();
            return;
        }

        if (typeof emailjs === "undefined") {
            console.error("EmailJS did not load. Check the script in index.html and your internet connection.");
            alert("Email service could not load. Please refresh and try again.");
            return;
        }

        const parms = {
            name: document.getElementById("name").value.trim(),
            email: document.getElementById("email").value.trim(),
            message: document.getElementById("message").value.trim()
        };

        button.disabled = true;
        button.textContent = "Sending...";

        try {
            await emailjs.send(
                "service_cc5mksa",  // service ID
                "template_g6unit8",  // template ID
                parms
            );

            alert("Email sent successfully!");
            contactForm.reset();
        } catch (error) {
            console.error("EmailJS failed:", error);

            const details = error?.text || error?.message || "Unknown EmailJS error";
            alert(`Failed to send email: ${details}`);
        } finally {
            button.disabled = false;
            button.textContent = "Send Message";
        }
    });
}

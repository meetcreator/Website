document.addEventListener('DOMContentLoaded', () => {

    // --- Custom Cursor Logic ---
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');

    window.addEventListener('mousemove', (e) => {
        const posX = e.clientX;
        const posY = e.clientY;

        // Dot follows instantly
        cursorDot.style.left = `${posX}px`;
        cursorDot.style.top = `${posY}px`;

        // Outline follows with lag (handled by CSS transition, just update pos)
        cursorOutline.animate({
            left: `${posX}px`,
            top: `${posY}px`
        }, { duration: 500, fill: "forwards" });
    });

    // Hover effects for cursor
    document.querySelectorAll('a, button, .process-step').forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursorOutline.style.width = '60px';
            cursorOutline.style.height = '60px';
            cursorOutline.style.backgroundColor = 'rgba(0,0,0,0.05)';
        });
        el.addEventListener('mouseleave', () => {
            cursorOutline.style.width = '40px';
            cursorOutline.style.height = '40px';
            cursorOutline.style.backgroundColor = 'transparent';
        });
    });

    // --- Canvas Visual (Constellation) ---
    const canvas = document.getElementById('hero-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width, height;
        let particles = [];

        const resize = () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        };
        window.addEventListener('resize', resize);
        resize();

        class Particle {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.vx = (Math.random() - 0.5) * 0.5;
                this.vy = (Math.random() - 0.5) * 0.5;
                this.val = Math.random() * 0.5 + 0.5; // Brightness
            }
            update() {
                this.x += this.vx;
                this.y += this.vy;
                if (this.x < 0 || this.x > width) this.vx *= -1;
                if (this.y < 0 || this.y > height) this.vy *= -1;
            }
        }

        for (let i = 0; i < 50; i++) particles.push(new Particle());

        const animate = () => {
            ctx.clearRect(0, 0, width, height);

            // Draw particles
            ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
            particles.forEach(p => {
                p.update();
                ctx.beginPath();
                ctx.arc(p.x, p.y, 1.5, 0, Math.PI * 2);
                ctx.fill();
            });

            // Draw connections
            ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const d = Math.sqrt(dx * dx + dy * dy);
                    if (d < 150) {
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }
            requestAnimationFrame(animate);
        };
        animate();
    }

    // Update hover effects to include new cards
    document.querySelectorAll('.service-card, .project-card').forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursorOutline.style.width = '60px';
            cursorOutline.style.height = '60px';
            cursorOutline.style.backgroundColor = 'rgba(0,0,0,0.05)';
        });
        el.addEventListener('mouseleave', () => {
            cursorOutline.style.width = '40px';
            cursorOutline.style.height = '40px';
            cursorOutline.style.backgroundColor = 'transparent';
        });
    });
});

const DEMO_DATA = {
    archshield: {
        url: 'tinmco.com/archshield',
        href: '/archshield',
        tags: ['Next.js 16', 'FastAPI', 'Python', 'Terraform']
    },
    business: {
        url: 'tinmco.com/business',
        href: '/business',
        tags: ['React', 'FastAPI', 'Pandas', 'Tailwind']
    },
    olympiad: {
        url: 'tinmco.com/olympiad',
        href: '/olympiad',
        tags: ['Next.js', 'Tailwind CSS', 'Framer Motion', 'Firebase']
    },
    'ca-webcodex': {
        url: 'tinmco.com/ca-webcodex',
        href: '/ca-webcodex/',
        tags: ['HTML5', 'CSS3', 'Vanilla JS', 'Static']
    },
    'ca-website': {
        url: 'tinmco.com/ca-website',
        href: '/ca-website/',
        tags: ['HTML5', 'CSS3', 'Vanilla JS', 'Static']
    },
    'import-export': {
        url: 'tinmco.com/import-export',
        href: '/import-export/',
        tags: ['HTML5', 'CSS3', 'Vanilla JS', 'Logistics']
    }
};

function switchDemo(btn, key) {
    document.querySelectorAll('.demo-tab').forEach(t => t.classList.remove('active'));
    btn.classList.add('active');

    const d = DEMO_DATA[key];
    const viewport = document.querySelector('.browser-viewport');
    const iframe = document.getElementById('demo-iframe');
    const urlLabel = document.getElementById('demo-url-label');
    const openLink = document.getElementById('demo-open-link');
    const tagsEl = document.getElementById('demo-tags');

    viewport.classList.add('loading');
    iframe.style.opacity = '0';

    setTimeout(() => {
        iframe.src = d.href;
        urlLabel.textContent = d.url;
        openLink.href = d.href;
        tagsEl.innerHTML = d.tags.map(t => `<span>${t}</span>`).join('');
        iframe.onload = () => {
            iframe.style.opacity = '1';
            viewport.classList.remove('loading');
        };
    }, 200);
}

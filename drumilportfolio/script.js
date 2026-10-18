document.addEventListener('DOMContentLoaded', () => {

    // --- Canvas (subtle floating dots) ---
    const canvas = document.getElementById('hero-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let W, H, particles = [];

        const resize = () => {
            W = canvas.width = window.innerWidth;
            H = canvas.height = window.innerHeight;
        };
        window.addEventListener('resize', resize);
        resize();

        class Dot {
            constructor() { this.reset(); }
            reset() {
                this.x = Math.random() * W;
                this.y = Math.random() * H;
                this.vx = (Math.random() - 0.5) * 0.35;
                this.vy = (Math.random() - 0.5) * 0.35;
            }
            update() {
                this.x += this.vx;
                this.y += this.vy;
                if (this.x < 0 || this.x > W) this.vx *= -1;
                if (this.y < 0 || this.y > H) this.vy *= -1;
            }
        }

        for (let i = 0; i < 45; i++) particles.push(new Dot());

        const animate = () => {
            ctx.clearRect(0, 0, W, H);
            ctx.fillStyle = 'rgba(193, 125, 60, 0.35)';
            particles.forEach(p => {
                p.update();
                ctx.beginPath();
                ctx.arc(p.x, p.y, 1.2, 0, Math.PI * 2);
                ctx.fill();
            });
            ctx.strokeStyle = 'rgba(193, 125, 60, 0.08)';
            ctx.lineWidth = 1;
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const d = Math.sqrt(dx * dx + dy * dy);
                    if (d < 130) {
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

    // --- Header shadow on scroll ---
    const header = document.querySelector('header');
    if (header) {
        window.addEventListener('scroll', () => {
            header.style.boxShadow = window.scrollY > 10
                ? '0 1px 24px rgba(0,0,0,0.07)'
                : 'none';
        }, { passive: true });
    }
});

// --- Demo Switcher ---
const DEMO_DATA = {
    archshield:    { url: 'aethelhq.com/archshield',              href: '/archshield',              tags: ['Next.js 16', 'FastAPI', 'Python', 'Terraform'] },
    business:      { url: 'aethelhq.com/business',               href: '/business',               tags: ['React', 'FastAPI', 'Pandas', 'Tailwind'] },
    olympiad:      { url: 'aethelhq.com/olympiad',               href: '/olympiad',               tags: ['Next.js', 'Tailwind CSS', 'Framer Motion', 'Firebase'] },
    procurement:   { url: 'aethelhq.com/procurement',            href: '/procurement',            tags: ['Python', 'FastAPI', 'LLM', 'SQLite', 'Vanilla JS'] },
    'ca-webcodex': { url: 'aethelhq.com/demo-websites/ca-webcodex', href: '/demo-websites/ca-webcodex', tags: ['HTML5', 'CSS3', 'Vanilla JS', 'Static'] },
    'ca-website':  { url: 'aethelhq.com/demo-websites/ca-website',  href: '/demo-websites/ca-website',  tags: ['HTML5', 'CSS3', 'Vanilla JS', 'Static'] },
    'import-export': { url: 'aethelhq.com/demo-websites/import-export', href: '/demo-websites/import-export', tags: ['HTML5', 'CSS3', 'Vanilla JS', 'Logistics'] }
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

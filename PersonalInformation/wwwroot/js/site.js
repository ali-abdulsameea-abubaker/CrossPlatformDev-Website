window.siteAnimations = (function () {

    let _initialized = false;

    function initScrollReveal() {
        const targets = document.querySelectorAll('.reveal:not([data-observed])');
        if (!targets.length) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

        targets.forEach(el => {
            el.setAttribute('data-observed', 'true');
            observer.observe(el);
        });
    }

    window.applyTheme = function (themeClass) {
        document.body.classList.remove('dark-theme', 'light-theme');
        document.body.classList.add(themeClass);
        document.documentElement.style.backgroundColor =
            themeClass === 'dark-theme' ? '#050810' : '#F0F4F8';
        const metaThemeColor = document.querySelector('meta[name="theme-color"]');
        if (metaThemeColor) {
            metaThemeColor.content = themeClass === 'dark-theme' ? '#050810' : '#F0F4F8';
        }
    };

    window.getCurrentTheme = function () {
        return localStorage.getItem('theme') || 'dark';
    };

    function initNavScroll() {
        const nav = document.querySelector('.site-nav');
        if (!nav) return;
        const onScroll = () => {
            if (window.scrollY > 24) nav.classList.add('scrolled');
            else nav.classList.remove('scrolled');
        };
        window.removeEventListener('scroll', window.__navScrollHandler || (() => { }));
        window.__navScrollHandler = onScroll;
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
    }

    function initMobileMenu() {
        const toggle = document.querySelector('.nav-toggle');
        const sidebar = document.querySelector('.site-nav');
        const overlay = document.querySelector('.nav-overlay');
        if (!toggle || !sidebar) {
            console.log('Mobile menu elements not found');
            return;
        }

        // Remove existing event listeners to avoid duplicates
        const newToggle = toggle.cloneNode(true);
        toggle.parentNode.replaceChild(newToggle, toggle);

        const newSidebar = sidebar;
        const newOverlay = overlay;

        const close = () => {
            newSidebar.classList.remove('open');
            newToggle.classList.remove('active');
            if (newOverlay) newOverlay.classList.remove('open');
        };

        newToggle.onclick = (e) => {
            e.stopPropagation();
            const isOpen = newSidebar.classList.toggle('open');
            newToggle.classList.toggle('active', isOpen);
            if (newOverlay) newOverlay.classList.toggle('open', isOpen);
        };

        if (newOverlay) {
            newOverlay.onclick = close;
        }

        newSidebar.querySelectorAll('a').forEach(a => a.onclick = close);
    }

    async function typeTerminal(elementId, lines, speed = 22) {
        const el = document.getElementById(elementId);
        if (!el || el.getAttribute('data-typed') === 'true') return;
        el.setAttribute('data-typed', 'true');
        el.innerHTML = '';

        for (const line of lines) {
            const lineEl = document.createElement('div');
            lineEl.className = 'terminal-line';
            el.appendChild(lineEl);

            const span = document.createElement('span');
            if (line.className) span.className = line.className;
            lineEl.appendChild(span);

            for (let i = 0; i < line.text.length; i++) {
                span.textContent += line.text[i];
                await new Promise(r => setTimeout(r, speed));
            }
            await new Promise(r => setTimeout(r, 220));
        }

        const cursor = document.createElement('span');
        cursor.className = 'terminal-cursor';
        el.appendChild(cursor);
    }

    function initCodeTyping() {
        const codeBody = document.getElementById('code-body');
        if (!codeBody || codeBody.getAttribute('data-typed') === 'true') return;

        const lines = [
            { text: '// full-stack developer · 5+ years experience', cls: 'code-comment' },
            { text: '// building production software since 2019', cls: 'code-comment' },
            { text: 'import { experience } from "./career";', cls: '' },
            { text: 'import { projects } from "./portfolio";', cls: '' },
            { text: '', cls: '' },
            { text: 'const skills = {', cls: '' },
            { text: '  frontend: "React, TypeScript, Bootstrap",', cls: '' },
            { text: '  backend: "C#, .NET Core, ASP.NET, Node.js",', cls: '' },
            { text: '  mobile: "Android, iOS, Cross-platform",', cls: '' },
            { text: '  cloud: "Azure, Heroku, Cloudinary",', cls: '' },
            { text: '  database: "SQL Server, MySQL, MongoDB",', cls: '' },
            { text: '  tools: "Git, Azure DevOps, Postman, OWASP ZAP",', cls: '' },
            { text: '  methodologies: "Agile, Scrum, TDD, RESTful APIs",', cls: '' },
            { text: '};', cls: '' },
            { text: '', cls: '' },
            { text: 'const currentRole = {', cls: '' },
            { text: '  title: ".NET Software Developer",', cls: '' },
            { text: '  company: "Gerrie Electric",', cls: '' },
            { text: '  since: "September 2024",', cls: '' },
            { text: '  focus: "APIs, Full-stack, Cloud",', cls: '' },
            { text: '};', cls: '' },
            { text: '', cls: '' },
            { text: 'const certifications = [', cls: '' },
            { text: '  "Microsoft Azure",', cls: '' },
            { text: '  "EAP Certified",', cls: '' },
            { text: '  "Worker Health & Safety",', cls: '' },
            { text: '];', cls: '' },
            { text: '', cls: '' },
            { text: 'export default { skills, currentRole, certifications };', cls: '' },
            { text: '$ ▊', cls: 'code-prompt' },
        ];

        typeTerminal('code-body', lines, 15);
    }

    function initAll() {
        // Always re-initialize mobile menu on each navigation
        initMobileMenu();
        initScrollReveal();
        initCodeTyping();
    }

    // Initialize on DOM ready
    document.addEventListener('DOMContentLoaded', initAll);

    // Re-initialize after Blazor navigation
    document.addEventListener('enhancedload', initAll);

    // Also re-initialize when Blazor finishes loading
    document.addEventListener('blazorLoad', initAll);

    // Expose initMobileMenu so it can be called from Blazor if needed
    window.initMobileMenu = initMobileMenu;

    return { initAll, initScrollReveal, typeTerminal, initMobileMenu };
})();
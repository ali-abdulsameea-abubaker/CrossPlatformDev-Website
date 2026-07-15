window.siteAnimations = (function () {

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
        if (!toggle || !sidebar) return;

        const close = () => {
            sidebar.classList.remove('open');
            toggle.classList.remove('active');
            overlay?.classList.remove('open');
        };

        toggle.onclick = () => {
            const isOpen = sidebar.classList.toggle('open');
            toggle.classList.toggle('active', isOpen);
            overlay?.classList.toggle('open', isOpen);
        };

        overlay && (overlay.onclick = close);

        sidebar.querySelectorAll('a').forEach(a => a.onclick = close);
    }


    // Typing effect for the hero terminal.
    // lines: array of { text, className }
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

    function initAll() {
        initScrollReveal();
        initMobileMenu();
    }

    // Initial load
    document.addEventListener('DOMContentLoaded', initAll);
    // Re-hook after Blazor's enhanced navigation swaps content
    document.addEventListener('enhancedload', initAll);

    return { initAll, initScrollReveal, typeTerminal };
})();
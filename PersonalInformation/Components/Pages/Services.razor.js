// ===== SERVICES PAGE JAVASCRIPT =====

// ===== SCROLL REVEAL FOR SERVICES =====
function initServicesScrollReveal() {
    const targets = document.querySelectorAll('.services-page .reveal:not([data-observed])');
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

// ===== COUNTER ANIMATION FOR STATS =====
function initServiceCounters() {
    const counters = document.querySelectorAll('.stat-number[data-count]');
    if (!counters.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseInt(el.getAttribute('data-count'));
                let current = 0;
                const increment = Math.ceil(target / 30);

                const timer = setInterval(() => {
                    current += increment;
                    if (current >= target) {
                        current = target;
                        clearInterval(timer);
                    }
                    el.textContent = current + (target > 1 ? '+' : '');
                }, 30);

                observer.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(el => observer.observe(el));
}

// ===== EXPOSE FUNCTIONS =====
window.initServicesPage = function () {
    initServicesScrollReveal();
    initServiceCounters();
};
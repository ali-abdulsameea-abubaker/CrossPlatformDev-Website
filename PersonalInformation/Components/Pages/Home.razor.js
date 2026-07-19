// ===== HOME PAGE JAVASCRIPT =====

// ===== SCROLL REVEAL =====
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

// ===== CODE BLOCK TYPING EFFECT =====
function initCodeTyping() {
    const el = document.getElementById('code-body');
    if (!el || el.getAttribute('data-typed') === 'true') return;
    el.setAttribute('data-typed', 'true');

    el.innerHTML = '';

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
        { text: '$', cls: 'code-prompt' },
    ];

    let index = 0;
    let charIndex = 0;
    let currentSpan = null;

    function typeNext() {
        if (index >= lines.length) {
            return;
        }

        if (charIndex === 0) {
            const lineEl = document.createElement('div');
            lineEl.className = 'code-line';
            const indentLines = [6, 7, 8, 9, 10, 11, 12, 17, 18, 19, 20, 24, 25, 26];
            if (indentLines.includes(index)) lineEl.classList.add('code-indent');
            if (index === lines.length - 1) lineEl.className = 'code-line';

            currentSpan = document.createElement('span');
            if (lines[index].cls) currentSpan.className = lines[index].cls;
            lineEl.appendChild(currentSpan);
            el.appendChild(lineEl);
        }

        const line = lines[index];
        if (line.text.length > 0) {
            currentSpan.textContent += line.text[charIndex];
            charIndex++;
        }

        if (charIndex >= line.text.length) {
            charIndex = 0;
            index++;
            const delay = line.text === '' ? 100 : 180;
            setTimeout(typeNext, delay);
        } else {
            setTimeout(typeNext, 15);
        }
    }

    setTimeout(typeNext, 600);
}

// ===== EXPOSE FUNCTION TO GLOBAL WINDOW =====
window.initHomePage = function () {
    initScrollReveal();
    initCodeTyping();
};

// Also run on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', window.initHomePage);
} else {
    window.initHomePage();
}
/* ── Smooth scroll for all anchor links ── */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const target = document.querySelector(link.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth' });
    // close mobile nav
    document.getElementById('navLinks').classList.remove('open');
    document.getElementById('navToggle').classList.remove('open');
  });
});

/* ── Active nav highlight on scroll ── */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a[data-page]');

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(a => {
        a.classList.toggle('active', a.dataset.page === entry.target.id);
      });
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });

sections.forEach(s => observer.observe(s));

/* ── Sticky nav shadow ── */
window.addEventListener('scroll', () => {
  document.getElementById('navbar').classList.toggle('scrolled', window.scrollY > 10);
});

/* ── Mobile nav toggle ── */
function toggleNav() {
  document.getElementById('navLinks').classList.toggle('open');
  document.getElementById('navToggle').classList.toggle('open');
}
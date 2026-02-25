// Manejo de navegación, animaciones y pequeños efectos

document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('.header');
  // enlaces de navegación pueden estar en .nav o .navbar
  const navLinks = Array.from(document.querySelectorAll('.nav a, .navbar a'));

  // detecta la página actual (nombre de archivo)
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';

  // marca enlace activo por página o sección
  function updateActive(link) {
    navLinks.forEach(a => a.classList.remove('is-active'));
    // also clear any active state on dropdown summary elements
    document.querySelectorAll('.nav summary').forEach(s => s.classList.remove('is-active'));
    if (link) link.classList.add('is-active');
  }

  // por href absoluto (index.html, practica1.html, etc.)
  let pageLink = navLinks.find(a => a.getAttribute('href') === currentPage);
  if (!pageLink && currentPage.startsWith('practica')) {
    // mark the dropdown summary if on any práctica page
    const dropdown = document.querySelector('.nav-dropdown > summary');
    if (dropdown) pageLink = dropdown;
  }
  if (pageLink) updateActive(pageLink);

  // si estamos en index.html, también observamos secciones para resaltar enlaces ancla
  if (currentPage === 'index.html' || currentPage === '') {
    const sections = navLinks
      .map(a => {
        const href = a.getAttribute('href');
        if (href && href.startsWith('#')) return document.querySelector(href);
      })
      .filter(Boolean);

    window.addEventListener('scroll', () => {
      if (window.scrollY > 40) header.classList.add('scrolled');
      else header.classList.remove('scrolled');

      let current = sections[0];
      for (let sec of sections) {
        if (sec.offsetTop - 80 <= window.scrollY) current = sec;
        else break;
      }
      const anchor = navLinks.find(a => a.getAttribute('href') === `#${current.id}`);
      if (anchor) updateActive(anchor);
    });
  } else {
    // solo sombra en el header en otras páginas
    window.addEventListener('scroll', () => {
      if (window.scrollY > 40) header.classList.add('scrolled');
      else header.classList.remove('scrolled');
    });
  }

  // scroll reveal
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  document.querySelectorAll('.animate').forEach(el => observer.observe(el));

  // efecto "wave" en textos fancy
  document.querySelectorAll('.fancy-text').forEach(el => {
    const text = el.textContent.trim();
    el.textContent = '';
    text.split('').forEach((char, idx) => {
      const span = document.createElement('span');
      span.textContent = char;
      span.style.animationDelay = `${idx * 0.05}s`;
      el.appendChild(span);
    });
  });

  // close dropdowns when clicking outside and mark summary active when open
  document.addEventListener('click', (e) => {
    const openDetails = document.querySelectorAll('.nav details[open]');
    openDetails.forEach(d => {
      if (!d.contains(e.target)) {
        d.removeAttribute('open');
      }
    });
  });

  // toggle is-active on summary when a detalle is open
  document.querySelectorAll('.nav details').forEach(d => {
    const s = d.querySelector('summary');
    d.addEventListener('toggle', () => {
      if (d.open) s.classList.add('is-active'); else s.classList.remove('is-active');
    });
  });
});

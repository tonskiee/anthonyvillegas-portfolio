/* =========================================================
   Portfolio — Main Script
   ---------------------------------------------------------
   1. Mobile menu
   2. Navbar background on scroll (navbar never hides)
   3. Active nav link on scroll
   4. Portfolio tabs (Projects / Certificates / Tech Stack)
   5. Buttons that open a specific tab
   6. Popup for project details and certificates
   7. Count-up numbers in About
   8. Reveal-on-scroll animation
   9. Contact form validation
   10. Footer year
   11. Image tilt on hover
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* 1. Mobile menu ---------------------------------------- */
  const toggle = document.querySelector('.menu-toggle');
  const menu = document.getElementById('main-nav');

  const closeMenu = () => {
    if (!toggle || !menu) return;
    menu.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open menu');
  };

  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      const isOpen = menu.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(isOpen));
      toggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
    });

    menu.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));

    // Close when clicking outside the menu
    document.addEventListener('click', (event) => {
      if (!menu.contains(event.target) && !toggle.contains(event.target)) closeMenu();
    });
  }

  /* 2. Navbar background on scroll ------------------------ */
  // The navbar is fixed and always visible. This only makes its
  // background more solid once you scroll away from the top.
  const header = document.getElementById('site-header');
  const onScroll = () => {
    if (header) header.classList.toggle('scrolled', window.scrollY > 20);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* 3. Active nav link on scroll -------------------------- */
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = ['home', 'about', 'skills', 'portfolio', 'contact']
    .map((id) => document.getElementById(id))
    .filter(Boolean);

  const setActive = (id) => {
    navLinks.forEach((link) => {
      const match = link.getAttribute('href') === '#' + id;
      link.classList.toggle('active', match);
      if (match) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });
  };

  if ('IntersectionObserver' in window) {
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setActive(entry.target.id);
      });
    }, { rootMargin: '-45% 0px -50% 0px' });

    sections.forEach((section) => sectionObserver.observe(section));
  }

  /* 4. Portfolio tabs ------------------------------------- */
  const tabs = Array.from(document.querySelectorAll('.tab'));
  const panels = document.querySelectorAll('.tab-panel');

  function openTab(name, moveFocus) {
    tabs.forEach((tab) => {
      const on = tab.dataset.tab === name;
      tab.classList.toggle('active', on);
      tab.setAttribute('aria-selected', String(on));
      tab.tabIndex = on ? 0 : -1;
      if (on && moveFocus) tab.focus();
    });

    panels.forEach((panel) => {
      const on = panel.id === 'panel-' + name;
      panel.hidden = !on;
      panel.classList.toggle('active', on);
    });
  }

  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => openTab(tab.dataset.tab, false));

    // Keyboard: left / right arrows move between tabs
    tab.addEventListener('keydown', (event) => {
      let next = null;
      if (event.key === 'ArrowRight') next = tabs[(index + 1) % tabs.length];
      if (event.key === 'ArrowLeft') next = tabs[(index - 1 + tabs.length) % tabs.length];
      if (event.key === 'Home') next = tabs[0];
      if (event.key === 'End') next = tabs[tabs.length - 1];
      if (next) {
        event.preventDefault();
        openTab(next.dataset.tab, true);
      }
    });
  });

  /* 5. Buttons that open a specific tab ------------------- */
  // e.g. the stat cards and "View Projects" in About
  document.querySelectorAll('[data-open-tab]').forEach((link) => {
    link.addEventListener('click', () => openTab(link.dataset.openTab, false));
  });

  /* 6. Popup for project details and certificates --------- */
  const modal = document.getElementById('modal');
  const modalMedia = document.getElementById('modal-media');
  const modalTitle = document.getElementById('modal-title');
  const modalMeta = document.getElementById('modal-meta');
  const modalDesc = document.getElementById('modal-desc');
  const modalTags = document.getElementById('modal-tags');
  const modalLinks = document.getElementById('modal-links');
  const modalClose = document.getElementById('modal-close');
  let lastFocused = null;

  function makeLink(text, href, className) {
    const a = document.createElement('a');
    a.className = 'btn ' + className;
    a.href = href;
    a.target = '_blank';
    a.rel = 'noopener';
    a.textContent = text;
    return a;
  }

  function openModal(fill) {
    if (!modal) return;
    lastFocused = document.activeElement;

    // reset
    modalMedia.innerHTML = '';
    modalMedia.classList.remove('is-cert');
    modalMeta.textContent = '';
    modalDesc.textContent = '';
    modalTags.innerHTML = '';
    modalLinks.innerHTML = '';

    fill();

    if (typeof modal.showModal === 'function') modal.showModal();
    else modal.setAttribute('open', '');
    document.body.classList.add('modal-open');
  }

  function closeModal() {
    if (!modal) return;
    if (typeof modal.close === 'function') modal.close();
    else modal.removeAttribute('open');
  }

  if (modal) {
    modal.addEventListener('close', () => {
      document.body.classList.remove('modal-open');
      if (lastFocused) lastFocused.focus();
    });
    modalClose.addEventListener('click', closeModal);
    // click on the dark area outside closes it
    modal.addEventListener('click', (event) => {
      if (event.target === modal) closeModal();
    });
  }

  // Project "Details" buttons
  document.querySelectorAll('.project-card .details-btn').forEach((button) => {
    button.addEventListener('click', () => {
      const card = button.closest('.project-card');
      openModal(() => {
        modalMedia.innerHTML = card.querySelector('.media').innerHTML;
        modalTitle.textContent = card.querySelector('h3').textContent;
        modalDesc.textContent = card.querySelector('.card-desc').textContent;

        (card.dataset.tech || '').split(',').map((t) => t.trim()).filter(Boolean).forEach((tech) => {
          const li = document.createElement('li');
          li.textContent = tech;
          modalTags.appendChild(li);
        });

        const demo = card.querySelector('.live-link');
        if (demo && demo.getAttribute('href') && demo.getAttribute('href') !== '#') {
          modalLinks.appendChild(makeLink('Live Demo ↗', demo.href, 'btn-gradient'));
        }
        if (card.dataset.github) {
          modalLinks.appendChild(makeLink('Source Code', card.dataset.github, 'btn-ghost'));
        }
      });
    });
  });

  // "Live Demo" links that still point to "#" do nothing yet
  document.querySelectorAll('.live-link').forEach((link) => {
    link.addEventListener('click', (event) => {
      if (link.getAttribute('href') === '#') event.preventDefault();
    });
  });

  // Certificate cards
  document.querySelectorAll('.cert-card').forEach((card) => {
    card.addEventListener('click', () => {
      openModal(() => {
        modalMedia.classList.add('is-cert');
        modalMedia.innerHTML = card.querySelector('.media').innerHTML;
        modalTitle.textContent = card.querySelector('.cert-title').textContent;
        const parts = [card.dataset.issuer, card.dataset.date].filter(Boolean);
        modalMeta.textContent = parts.join(' · ');
      });
    });
  });

  /* 7. Count-up numbers in About -------------------------- */
  const counters = document.querySelectorAll('.stat-number');

  // Numbers with data-count-of count the cards in Portfolio automatically
  counters.forEach((counter) => {
    if (counter.dataset.countOf) {
      counter.dataset.target = document.querySelectorAll(counter.dataset.countOf).length;
    }
  });

  function countUp(el) {
    const target = parseInt(el.dataset.target, 10) || 0;
    const duration = 1200;
    const start = performance.now();
    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(target * eased);
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  if ('IntersectionObserver' in window) {
    const counterObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          countUp(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.6 });
    counters.forEach((c) => counterObserver.observe(c));
  } else {
    counters.forEach((c) => { c.textContent = c.dataset.target; });
  }

  /* 8. Reveal-on-scroll animation ------------------------- */
  const revealItems = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    revealItems.forEach((item) => revealObserver.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add('visible'));
  }

  /* 9. Contact form validation ---------------------------- */
  // Checks the fields, then opens the visitor's email app with the
  // message filled in. To receive messages without an email app, connect
  // the form to a service such as Formspree, Netlify Forms or EmailJS.
  const form = document.getElementById('contact-form');
  const status = document.getElementById('form-status');
  const YOUR_EMAIL = 'hello@yourname.com'; // <- change to your email

  if (form && status) {
    form.addEventListener('submit', (event) => {
      event.preventDefault();

      const name = form.name.value.trim();
      const email = form.email.value.trim();
      const message = form.message.value.trim();
      const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

      form.name.classList.toggle('invalid', !name);
      form.email.classList.toggle('invalid', !emailOk);
      form.message.classList.toggle('invalid', !message);

      if (!name || !emailOk || !message) {
        status.textContent = 'Please fill in your name, a valid email and a message.';
        status.classList.add('error');
        return;
      }

      status.classList.remove('error');
      status.textContent = 'Thanks, ' + name + '! Opening your email app…';

      const subject = encodeURIComponent('Portfolio enquiry from ' + name);
      const body = encodeURIComponent(message + '\n\n— ' + name + ' (' + email + ')');
      window.location.href = 'mailto:' + YOUR_EMAIL + '?subject=' + subject + '&body=' + body;

      form.reset();
    });
  }

  /* 10. Footer year --------------------------------------- */
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  /* 11. Image tilt on hover ------------------------------- */
  const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function addTilt(element, maxTilt, zoom) {
    if (!element || !canHover || reduceMotion) return;

    let frame = null;

    element.addEventListener('mousemove', (event) => {
      const rect = element.getBoundingClientRect();
      // Cursor position from -0.5 (left/top) to 0.5 (right/bottom)
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;

      if (frame) cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        element.classList.add('is-tilting');
        element.style.transform =
          'perspective(900px)' +
          ' rotateX(' + (-y * maxTilt) + 'deg)' +
          ' rotateY(' + (x * maxTilt) + 'deg)' +
          ' scale(' + zoom + ')';

        element.style.setProperty('--mx', (x * 2).toFixed(3));
        element.style.setProperty('--my', (y * 2).toFixed(3));
        element.style.setProperty('--gx', ((x + 0.5) * 100).toFixed(1) + '%');
        element.style.setProperty('--gy', ((y + 0.5) * 100).toFixed(1) + '%');
      });
    });

    element.addEventListener('mouseleave', () => {
      if (frame) cancelAnimationFrame(frame);
      element.classList.remove('is-tilting');
      element.style.transform = '';
      element.style.setProperty('--mx', 0);
      element.style.setProperty('--my', 0);
    });
  }

  // Home photo card: stronger tilt
  addTilt(document.querySelector('.profile-card'), 14, 1.03);

  // About round photo: gentler tilt
  addTilt(document.querySelector('.about-photo-wrap'), 10, 1.03);
});
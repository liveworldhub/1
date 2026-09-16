'use strict';
(() => {
  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => [...document.querySelectorAll(selector)];
  const whatsapp = 'https://wa.me/971559956683';
  const menu = $('#main-nav');
  const toggle = $('.menu-toggle');
  const closeMenu = () => {
    menu.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open menu');
  };
  toggle.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') !== 'true';
    menu.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  });
  menu.addEventListener('click', (event) => {
    if (event.target.closest('a')) closeMenu();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
      closeMenu();
      toggle.focus();
    }
  });
  document.addEventListener('click', (event) => {
    if (!event.target.closest('.site-header')) closeMenu();
  });
  window.matchMedia('(min-width: 761px)').addEventListener('change', closeMenu);

  const filterButtons = $$('[data-filter]');
  filterButtons.forEach((button) =>
    button.addEventListener('click', () => {
      filterButtons.forEach((item) => {
        const selected = item === button;
        item.classList.toggle('active', selected);
        item.setAttribute('aria-pressed', String(selected));
      });
      let count = 0;
      $$('[data-category]').forEach((card) => {
        const show =
          button.dataset.filter === 'all' || button.dataset.filter === card.dataset.category;
        card.hidden = !show;
        card.classList.toggle('fade-in', show);
        if (show) count++;
      });
      $('#filter-status').textContent = `Showing ${count} ${
        count === 1 ? 'category' : 'categories'
      }`;
    })
  );

  const form = $('#request-form');
  const tabs = $$('[data-mode]');
  let mode = 'quote';
  const setMode = (next) => {
    mode = next;
    tabs.forEach((tab) => {
      const selected = tab.dataset.mode === mode;
      tab.setAttribute('aria-selected', String(selected));
      tab.tabIndex = selected ? 0 : -1;
    });
    $('#request-panel').setAttribute('aria-labelledby', `tab-${mode}`);
    $('#form-title').textContent =
      mode === 'quote' ? 'What’s on your wishlist?' : 'Let’s get you up and running.';
    $('#form-description').textContent =
      mode === 'quote'
        ? 'Tell us what you’re looking for. We’ll check the options.'
        : 'Share your device and symptoms. We’ll help with the next step.';
    $('#details-label').textContent =
      mode === 'quote' ? 'A few more details' : 'What seems to be the problem?';
    form.elements.details.placeholder =
      mode === 'quote'
        ? 'Preferred model, storage, colour or budget…'
        : 'Describe the issue, when it started and any visible damage…';
    form.elements.details.required = mode === 'repair';
  };
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => setMode(tab.dataset.mode));
    tab.addEventListener('keydown', (event) => {
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      const target =
        event.key === 'Home'
          ? 0
          : event.key === 'End'
          ? tabs.length - 1
          : (index + 1) % tabs.length;
      setMode(tabs[target].dataset.mode);
      tabs[target].focus();
    });
  });
  $$('[data-enquire]').forEach((link) =>
    link.addEventListener('click', () => {
      setMode('quote');
      form.elements.category.value = link.dataset.enquire;
    })
  );
  const repairCategories = {
    'Mobile phone': 'Smartphones & accessories',
    Laptop: 'Laptops',
    'Gaming console': 'Gaming consoles & accessories',
    'Gaming PC': 'Custom gaming PC',
  };
  $$('[data-repair]').forEach((link) =>
    link.addEventListener('click', () => {
      setMode('repair');
      form.elements.category.value = repairCategories[link.dataset.repair];
    })
  );
  $$('[data-mode-link]').forEach((link) =>
    link.addEventListener('click', () => setMode(link.dataset.modeLink))
  );

  const dialog = $('#request-dialog');
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    for (const key of ['name', 'model', 'details']) {
      const field = form.elements[key];
      field.setCustomValidity(
        field.required && !field.value.trim() ? 'Please enter a value, not only spaces.' : ''
      );
    }
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    const value = (key) => String(data.get(key) || '').trim();
    if (
      !/^[+\d\s().-]+$/.test(value('phone')) ||
      value('phone').replace(/\D/g, '').length < 7 ||
      value('phone').replace(/\D/g, '').length > 15
    ) {
      form.elements.phone.setCustomValidity('Please enter a phone number with 7 to 15 digits.');
      form.elements.phone.reportValidity();
      return;
    }
    const message = [
      `Hello Live World — ${mode === 'repair' ? 'repair enquiry' : 'product enquiry'}`,
      `Name: ${value('name')}`,
      `Phone: ${value('phone')}`,
      `Category: ${value('category')}`,
      `Brand / model: ${value('model')}`,
      `${mode === 'repair' ? 'Issue' : 'Requirements'}: ${
        value('details') || 'Please advise on available options.'
      }`,
      `Preferred branch: ${value('branch')}`,
    ].join('\n');
    $('#request-preview').textContent = message;
    $('#whatsapp-request').href = `${whatsapp}?text=${encodeURIComponent(message)}`;
    dialog.showModal();
  });
  for (const key of ['name', 'model', 'details']) {
    form.elements[key].addEventListener('input', () => form.elements[key].setCustomValidity(''));
  }
  form.elements.phone.addEventListener('input', () => form.elements.phone.setCustomValidity(''));
  $('#close-dialog').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) {
      const rect = dialog.getBoundingClientRect();
      if (
        event.clientX < rect.left ||
        event.clientX > rect.right ||
        event.clientY < rect.top ||
        event.clientY > rect.bottom
      )
        dialog.close();
    }
  });
  // Modal Escape handling, focus trapping and focus restoration are native <dialog> behaviour.

  const branches = [
    {
      name: 'Muhaisnah 4',
      address: 'Shop No. 1, Mango Hypermarket Building, Muhaisnah 4, near Lulu Village, Dubai, UAE',
      query: 'Live World Electronics Trading LLC Mango Hypermarket Muhaisnah 4 Dubai',
    },
    {
      name: 'Al Warqaa 1',
      address: 'Q1 Mall, Al Warqaa 1 Street, Ground Floor, Dubai, UAE',
      query: 'Live World Electronics Q1 Mall Al Warqaa 1 Dubai',
    },
    {
      name: 'Mirdif',
      address: 'Near Abaya Mall, Mirdif, Dubai, UAE',
      query: 'Live World Electronics near Abaya Mall Mirdif Dubai',
    },
    {
      name: 'Oud Al Muteena',
      address: 'Emirates Co-operative Society, Oud Al Muteena 1, Dubai, UAE',
      query: 'Live World Electronics Emirates Cooperative Society Oud Al Muteena 1 Dubai',
    },
    {
      name: 'Al Khawaneej',
      address: 'Live World Electronics, Al Khawaneej, Dubai, UAE',
      query: 'Live World Electronics Al Khawaneej Dubai',
    },
  ];
  let currentBranch = 0;
  let mapTimer;
  const mapShell = $('#map-shell');
  const loadMap = $('#load-map');
  const mapStatus = $('#map-status');
  const resetMap = () => {
    clearTimeout(mapTimer);
    mapShell.querySelector('iframe')?.remove();
    loadMap.hidden = false;
    loadMap.disabled = false;
    loadMap.innerHTML = 'Explore this location <span aria-hidden="true">↗</span>';
    mapStatus.textContent = '';
  };
  $$('[data-branch]').forEach((button) =>
    button.addEventListener('click', () => {
      currentBranch = Number(button.dataset.branch);
      const branch = branches[currentBranch];
      $$('[data-branch]').forEach((item) => {
        item.classList.toggle('active', item === button);
        item.setAttribute('aria-pressed', String(item === button));
      });
      $('#branch-name').textContent = branch.name;
      $('#branch-address').textContent = branch.address;
      $(
        '#directions-link'
      ).href = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        branch.query
      )}`;
      form.elements.branch.value = branch.name;
      resetMap();
    })
  );
  loadMap.addEventListener('click', () => {
    const branch = branches[currentBranch];
    const frame = document.createElement('iframe');
    frame.title = `Google Map — Live World ${branch.name}`;
    frame.referrerPolicy = 'no-referrer-when-downgrade';
    frame.src = `https://www.google.com/maps?q=${encodeURIComponent(branch.query)}&output=embed`;
    frame.hidden = true;
    loadMap.disabled = true;
    mapStatus.textContent = 'Opening the map…';
    frame.addEventListener(
      'load',
      () => {
        if (!frame.isConnected) return;
        clearTimeout(mapTimer);
        frame.hidden = false;
        loadMap.hidden = true;
        mapStatus.textContent = '';
      },
      { once: true }
    );
    mapTimer = setTimeout(() => {
      frame.remove();
      loadMap.disabled = false;
      mapStatus.textContent = 'Map unavailable here. Use Get directions below.';
    }, 8000);
    mapShell.append(frame);
  });
  $('#year').textContent = String(new Date().getFullYear());

  // Navigation highlighting only; content remains visible if scripting or observers are unavailable.
  if ('IntersectionObserver' in window) {
    const navLinks = $$('#main-nav a');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            navLinks.forEach((link) => {
              const selected = link.hash === `#${entry.target.id}`;
              link.classList.toggle('active', selected);
              if (selected) link.setAttribute('aria-current', 'location');
              else link.removeAttribute('aria-current');
            });
          }
        });
      },
      { rootMargin: '-15% 0px -60% 0px', threshold: 0 }
    );
    navLinks.forEach((link) => {
      const target = $(link.hash);
      if (target) observer.observe(target);
    });
  }
})();

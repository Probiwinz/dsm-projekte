  (function() {
    const c = document.getElementById('particles');
    for (let i = 0; i < 15; i++) {
      const b = document.createElement('div');
      b.className = 'bubble';
      const s = Math.random() * 50 + 15;
      b.style.width = s + 'px';
      b.style.height = s + 'px';
      b.style.left = Math.random() * 100 + '%';
      b.style.animationDuration = (Math.random() * 15 + 10) + 's';
      b.style.animationDelay = '-' + (Math.random() * 20).toFixed(2) + 's';
      c.appendChild(b);
    }
  })();

  const projectLocations = [
    { id: 'kvarner', name: 'Kvarner Bucht', place: 'Nordadria, Kroatien', coords: [45.06, 14.62] },
    { id: 'manaia', name: 'Project Manaia', place: 'Mittelmeer (IT, GR, MT)', coords: [36.1, 17.6] },
    { id: 'boa-vista', name: 'Boa Vista', place: 'Kapverden', coords: [16.11, -22.8] },
    { id: 'israel', name: 'Mönchsrobben-Projekt', place: 'Israel, Mittelmeerküste', coords: [33.09, 35.1] },
    { id: 'banda', name: 'Bandasee', place: 'Indonesien', coords: [-4.53, 129.9] },
    { id: 'fidschi', name: 'Fidschi-Inseln', place: 'Viti Levu, Drawaqa', coords: [-17.8, 177.9] }
  ];
  let closeOpenMapPopup = null;

  function initProjectMap() {
    const mapRoot = document.getElementById('world-map');
    const legendItems = Array.from(document.querySelectorAll('.legend-item[data-project-id]'));
    const setLegendState = (activeId) => {
      legendItems.forEach((item) => item.classList.toggle('is-active', item.dataset.projectId === activeId));
    };

    if (!mapRoot) return;

    const fallbackLegendOnly = () => {
      mapRoot.classList.add('map-fallback');
      mapRoot.textContent = 'Karte konnte nicht geladen werden. Nutze die Projektbuttons darunter.';
      legendItems.forEach((item) => {
        item.addEventListener('click', () => {
          const projectId = item.dataset.projectId;
          setLegendState(projectId);
          scrollToProject(projectId);
        });
      });
    };

    if (typeof L === 'undefined') {
      fallbackLegendOnly();
      return;
    }

    const map = L.map(mapRoot, {
      zoomControl: true,
      minZoom: 2,
      maxZoom: 7,
      worldCopyJump: true
    }).setView([18, 15], 2);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap-Mitwirkende'
    }).addTo(map);

    const markerById = new Map();
    const markerResetTimers = new WeakMap();

    function pulseMarker(marker) {
      if (!marker || !map.hasLayer(marker)) return;

      if (markerResetTimers.has(marker)) {
        clearTimeout(markerResetTimers.get(marker));
      }

      marker.setStyle({ radius: 9.5, weight: 2.35 });
      const resetTimer = setTimeout(() => {
        if (map.hasLayer(marker)) marker.setStyle({ radius: 8, weight: 2 });
        markerResetTimers.delete(marker);
      }, 180);
      markerResetTimers.set(marker, resetTimer);

      [0, 120].forEach((delay, index) => {
        const ring = L.circleMarker(marker.getLatLng(), {
          radius: 10,
          color: '#E07A5F',
          weight: 2,
          fillColor: '#E07A5F',
          fillOpacity: 0.08,
          opacity: 0.85,
          interactive: false,
          bubblingMouseEvents: false,
          className: `map-marker-pulse-ring${index ? ' is-delayed' : ''}`
        }).addTo(map);

        if (delay) {
          const applyDelay = () => {
            const ringEl = ring.getElement();
            if (ringEl) ringEl.style.animationDelay = `${delay}ms`;
          };
          applyDelay();
          requestAnimationFrame(applyDelay);
        }

        setTimeout(() => {
          if (map.hasLayer(ring)) map.removeLayer(ring);
        }, 1150 + delay);
      });
    }

    projectLocations.forEach((project) => {
      const marker = L.circleMarker(project.coords, {
        radius: 8,
        color: '#FFFFFF',
        weight: 2,
        fillColor: '#E07A5F',
        fillOpacity: 0.95,
        className: 'project-map-marker'
      }).addTo(map);

      marker.bindPopup(
        `<div class="liquid-popup-card"><div class="liquid-popup-title">${project.name}</div><div class="liquid-popup-place">${project.place}</div><button type="button" class="map-popup-btn" data-project-id="${project.id}">Zum Projekt</button></div>`,
        {
          className: 'liquid-map-popup',
          autoPanPadding: [24, 24],
          closeButton: false,
          autoClose: true,
          closeOnClick: true
        }
      );
      marker.on('click', () => setLegendState(project.id));
      marker.on('popupopen', () => {
        setLegendState(project.id);
        pulseMarker(marker);
      });
      markerById.set(project.id, marker);
    });

    mapRoot.addEventListener('click', (event) => {
      const button = event.target.closest('.map-popup-btn');
      if (!button) return;

      const projectId = button.dataset.projectId;
      setLegendState(projectId);

      // Trigger shimmer on popup card, then scroll after a beat
      const card = button.closest('.liquid-popup-card');
      if (card) {
        card.classList.remove('is-shimmering');
        void card.offsetWidth;
        card.classList.add('is-shimmering');
      }
      setTimeout(() => scrollToProject(projectId), 450);
    });

    legendItems.forEach((item) => {
      item.addEventListener('click', () => {
        const projectId = item.dataset.projectId;
        const marker = markerById.get(projectId);
        setLegendState(projectId);

        if (marker) {
          // Scroll map into view first, then pan (no zoom) and open popup
          mapRoot.scrollIntoView({ behavior: 'smooth', block: 'center' });
          setTimeout(() => {
            map.invalidateSize();
            map.panTo(marker.getLatLng(), { animate: true, duration: 0.6 });
            setTimeout(() => marker.openPopup(), 350);
          }, 400);
        }
      });
    });

    closeOpenMapPopup = () => map.closePopup();
    setTimeout(() => map.invalidateSize(), 0);
  }

  function applySentenceStackLayout() {
    const targets = document.querySelectorAll('.js-sentence-stack');
    const sentencePattern = /[^.!?]+(?:[.!?]+(?=\s|$)|$)/g;

    targets.forEach((el) => {
      if (el.querySelector('.sentence-line')) return;

      const text = el.textContent.replace(/\s+/g, ' ').trim();
      if (!text) return;

      const parts = text.match(sentencePattern) || [text];
      el.textContent = '';

      parts
        .map((part) => part.trim())
        .filter(Boolean)
        .forEach((part) => {
          const line = document.createElement('span');
          line.className = 'sentence-line';
          line.textContent = part;
          el.appendChild(line);
        });
      });
  }

  let heroBubbleFitRaf = null;
  function fitHeroBubbleText() {
    const heroSub = document.querySelector('.hero .hero-sub');
    if (!heroSub) return;

    const lines = heroSub.querySelectorAll('.hero-sub-line');
    if (!lines.length) return;

    // Reset to CSS value before recalculating
    heroSub.style.fontSize = '';

    const availableWidth = Math.max(0, heroSub.clientWidth - 4);
    if (!availableWidth) return;

    let widestLine = 0;
    lines.forEach((line) => {
      widestLine = Math.max(widestLine, line.scrollWidth);
    });

    if (widestLine <= availableWidth) return;

    const currentSize = parseFloat(getComputedStyle(heroSub).fontSize);
    if (!Number.isFinite(currentSize) || currentSize <= 0) return;

    const scale = Math.max(0.5, Math.min(1, (availableWidth / widestLine) * 0.985));
    heroSub.style.fontSize = `${(currentSize * scale).toFixed(2)}px`;
  }

  function scheduleFitHeroBubbleText() {
    if (heroBubbleFitRaf) cancelAnimationFrame(heroBubbleFitRaf);
    heroBubbleFitRaf = requestAnimationFrame(() => {
      heroBubbleFitRaf = null;
      fitHeroBubbleText();
    });
  }

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

  document.querySelectorAll('.project-card, .pattern-step, .timeline-year').forEach(el => obs.observe(el));

  const po = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        document.querySelectorAll('.pattern-step').forEach((s, i) => {
          setTimeout(() => s.classList.add('visible'), i * 200);
        });
        po.disconnect();
      }
    });
  }, { threshold: 0.2 });
  const pf = document.querySelector('.pattern-flow');
  if (pf) po.observe(pf);

  let highlightTimer = 0;
  function scrollToProject(id) {
    const el = document.getElementById(id);
    if (el) {
      if (typeof closeOpenMapPopup === 'function') closeOpenMapPopup();
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      clearTimeout(highlightTimer);
      el.classList.remove('is-highlighted');
      void el.offsetWidth;
      el.classList.add('is-highlighted');
      highlightTimer = setTimeout(() => el.classList.remove('is-highlighted'), 3500);
    }
  }

  function toggleSources() {
    const l = document.getElementById('sources');
    const b = document.querySelector('.sources-toggle');
    const items = l.querySelectorAll('li');
    const isOpening = !l.classList.contains('open');

    if (isOpening) {
      items.forEach((li, i) => {
        li.style.transitionDelay = (0.06 * i) + 's';
      });
      l.classList.add('open');
    } else {
      items.forEach(li => { li.style.transitionDelay = '0s'; });
      l.classList.remove('open');
    }
    b.textContent = isOpening ? 'Quellenverzeichnis ausblenden' : 'Quellenverzeichnis anzeigen';
  }

  applySentenceStackLayout();
  scheduleFitHeroBubbleText();
  initProjectMap();

  // Back-to-map floating button
  (function() {
    const fab = document.getElementById('back-to-map');
    const mapSection = document.getElementById('karte');
    if (!fab || !mapSection) return;

    const fabObserver = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        // Show button when map section is NOT visible (scrolled past it)
        fab.classList.toggle('is-visible', !e.isIntersecting && e.boundingClientRect.top < 0);
      });
    }, { threshold: 0 });
    fabObserver.observe(mapSection);

    fab.addEventListener('click', () => {
      mapSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  })();

  window.addEventListener('resize', scheduleFitHeroBubbleText);
  window.addEventListener('load', scheduleFitHeroBubbleText);
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(scheduleFitHeroBubbleText);
  }

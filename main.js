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

  function flashPopupCard(card) {
    if (!card) return;
    card.classList.remove('is-shimmering');
    void card.offsetWidth;
    card.classList.add('is-shimmering');
  }

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

      const markerEl = marker.getElement();
      if (markerEl) {
        markerEl.classList.remove('is-pulsing');
        void markerEl.getBoundingClientRect();
        markerEl.classList.add('is-pulsing');
      }

      marker.setStyle({ radius: 9.5, weight: 2.35 });
      const resetTimer = setTimeout(() => {
        if (map.hasLayer(marker)) marker.setStyle({ radius: 8, weight: 2 });
        if (markerEl) markerEl.classList.remove('is-pulsing');
        markerResetTimers.delete(marker);
      }, 980);
      markerResetTimers.set(marker, resetTimer);

      [
        { delay: 0, radius: 10, weight: 2.1, fillOpacity: 0.09, className: 'map-marker-pulse-ring' },
        { delay: 140, radius: 10.5, weight: 1.8, fillOpacity: 0.06, className: 'map-marker-pulse-ring is-delayed' },
        { delay: 40, radius: 12, weight: 1.2, fillOpacity: 0.03, className: 'map-marker-pulse-ring is-soft' }
      ].forEach((config) => {
        const ring = L.circleMarker(marker.getLatLng(), {
          radius: config.radius,
          color: '#E07A5F',
          weight: config.weight,
          fillColor: '#E07A5F',
          fillOpacity: config.fillOpacity,
          opacity: 0.85,
          interactive: false,
          bubblingMouseEvents: false,
          className: config.className
        }).addTo(map);

        if (config.delay) {
          const applyDelay = () => {
            const ringEl = ring.getElement();
            if (ringEl) ringEl.style.animationDelay = `${config.delay}ms`;
          };
          applyDelay();
          requestAnimationFrame(applyDelay);
        }

        setTimeout(() => {
          if (map.hasLayer(ring)) map.removeLayer(ring);
        }, 1380 + config.delay);
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
      marker.on('popupopen', (event) => {
        setLegendState(project.id);
        pulseMarker(marker);
        const popupCard = event.popup && event.popup.getElement()
          ? event.popup.getElement().querySelector('.liquid-popup-card')
          : null;
        flashPopupCard(popupCard);
      });
      markerById.set(project.id, marker);
    });

    mapRoot.addEventListener('click', (event) => {
      const button = event.target.closest('.map-popup-btn');
      if (!button) return;

      const projectId = button.dataset.projectId;
      setLegendState(projectId);

      const card = button.closest('.liquid-popup-card');
      flashPopupCard(card);
      setTimeout(() => scrollToProject(projectId), 220);
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

  function pauseProjectVideo(iframe) {
    if (!iframe || !iframe.contentWindow) return;

    iframe.contentWindow.postMessage(
      JSON.stringify({
        event: 'command',
        func: 'pauseVideo',
        args: []
      }),
      '*'
    );
  }

  const projectVideoBridges = [];
  let projectVideoBridgeReady = false;
  let projectVideoBridgeCounter = 0;

  function parseProjectVideoMessage(data) {
    if (!data) return null;

    if (typeof data === 'string') {
      try {
        return JSON.parse(data);
      } catch (error) {
        return null;
      }
    }

    return typeof data === 'object' ? data : null;
  }

  function getProjectVideoState(message) {
    if (!message || typeof message !== 'object') return null;

    if (message.event === 'onStateChange' && typeof message.info === 'number') {
      return message.info;
    }

    if (
      message.event === 'infoDelivery' &&
      message.info &&
      typeof message.info.playerState === 'number'
    ) {
      return message.info.playerState;
    }

    return null;
  }

  function ensureProjectVideoBridge() {
    if (projectVideoBridgeReady) return;
    projectVideoBridgeReady = true;

    window.addEventListener('message', (event) => {
      let hostname = '';

      try {
        hostname = new URL(event.origin).hostname;
      } catch (error) {
        return;
      }

      if (!hostname.includes('youtube.com') && !hostname.includes('youtube-nocookie.com')) {
        return;
      }

      const message = parseProjectVideoMessage(event.data);
      const state = getProjectVideoState(message);
      if (state === null) return;

      const bridge = projectVideoBridges.find(
        (entry) => entry.iframe.contentWindow === event.source
      );
      if (!bridge) return;

      bridge.onStateChange(state);
    });
  }

  function registerProjectVideoBridge(iframe, onStateChange) {
    if (!iframe) return;

    ensureProjectVideoBridge();

    const existingBridge = projectVideoBridges.find((entry) => entry.iframe === iframe);
    if (existingBridge) {
      existingBridge.onStateChange = onStateChange;
      return;
    }

    projectVideoBridgeCounter += 1;
    const playerId = iframe.dataset.projectVideoId || `project-video-${projectVideoBridgeCounter}`;
    iframe.dataset.projectVideoId = playerId;

    projectVideoBridges.push({ iframe, onStateChange });

    const subscribeToStateChanges = () => {
      if (!iframe.contentWindow) return;

      iframe.contentWindow.postMessage(
        JSON.stringify({
          event: 'listening',
          id: playerId
        }),
        '*'
      );

      iframe.contentWindow.postMessage(
        JSON.stringify({
          event: 'command',
          func: 'addEventListener',
          args: ['onStateChange'],
          id: playerId
        }),
        '*'
      );
    };

    iframe.addEventListener('load', () => {
      setTimeout(subscribeToStateChanges, 160);
      setTimeout(subscribeToStateChanges, 900);
    });

    setTimeout(subscribeToStateChanges, 220);
    setTimeout(subscribeToStateChanges, 1100);
  }

  function initProjectMediaCarousels() {
    const carousels = Array.from(document.querySelectorAll('[data-carousel]'));

    carousels.forEach((carousel) => {
      const slides = Array.from(carousel.querySelectorAll('[data-media-slide]'));
      if (!slides.length) return;

      let activeIndex = slides.findIndex((slide) => slide.classList.contains('is-active'));
      if (activeIndex < 0) activeIndex = 0;

      const status = carousel.querySelector('.project-media-status');
      const card = carousel.closest('.project-card');
      const noteShell = card ? card.querySelector('[data-carousel-note-shell]') : null;
      if (status && noteShell && !noteShell.classList.contains('is-inline')) {
        noteShell.classList.add('is-inline');
        status.appendChild(noteShell);
      }
      const noteToggle = noteShell ? noteShell.querySelector('[data-carousel-note-toggle]') : null;
      const note = card ? card.querySelector('[data-carousel-note]') : null;
      const mobileViewportQuery = window.matchMedia('(max-width: 767px)');
      const noteDescription = note ? note.querySelector('[data-carousel-description]') : null;
      const noteCredit = note ? note.querySelector('[data-carousel-credit]') : null;
      const statusKind = carousel.querySelector('[data-carousel-kind]');
      const statusCount = carousel.querySelector('[data-carousel-count]');

      const setVideoOverlayPlaying = (isPlaying) => {
        carousel.classList.toggle('is-video-playing', isPlaying);
        if (status) {
          status.setAttribute('aria-hidden', String(isPlaying));
        }
        if (isPlaying) {
          setNoteOpen(false);
        }
      };

      const setNoteOpen = (isOpen) => {
        if (!noteShell || !noteToggle) return;
        noteShell.classList.toggle('is-open', isOpen);
        noteToggle.setAttribute('aria-expanded', String(isOpen));
      };

      const updateNoteToggleVisibility = () => {
        if (!noteToggle || !slides.length) return;

        const activeSlide = slides[activeIndex] || slides[0];
        const shouldHideNoteToggle =
          mobileViewportQuery.matches && activeSlide && activeSlide.dataset.mediaType === 'video';

        noteToggle.hidden = shouldHideNoteToggle;

        if (shouldHideNoteToggle) {
          setNoteOpen(false);
        }
      };

      slides.forEach((slide) => {
        const iframe = slide.querySelector('iframe');
        if (!iframe) return;

        registerProjectVideoBridge(iframe, (state) => {
          const isActiveVideoSlide =
            slide === slides[activeIndex] && slide.dataset.mediaType === 'video';
          if (!isActiveVideoSlide) return;

          if (state === 1) {
            setVideoOverlayPlaying(true);
          } else if (state === 0 || state === 2 || state === 5) {
            setVideoOverlayPlaying(false);
          }
        });
      });

      const renderSlide = (nextIndex, shouldPausePrevious = true) => {
        const normalizedIndex = (nextIndex + slides.length) % slides.length;
        const previousSlide = slides[activeIndex];
        const activeSlide = slides[normalizedIndex];

        if (shouldPausePrevious && previousSlide && previousSlide !== activeSlide) {
          pauseProjectVideo(previousSlide.querySelector('iframe'));
        }

        slides.forEach((slide, index) => {
          const isActive = index === normalizedIndex;
          slide.classList.toggle('is-active', isActive);
          slide.setAttribute('aria-hidden', String(!isActive));
        });

        activeIndex = normalizedIndex;
        setVideoOverlayPlaying(false);

        if (activeSlide.dataset.mediaType === 'video') {
          setNoteOpen(false);
        }

        if (statusKind) {
          statusKind.textContent =
            (activeSlide.dataset.mediaType === 'image'
              ? activeSlide.dataset.mediaDescription
              : activeSlide.dataset.mediaLabel) ||
            activeSlide.dataset.mediaDescription ||
            'Medium';
        }
        if (statusCount) {
          statusCount.textContent = `${normalizedIndex + 1} / ${slides.length}`;
        }

        if (note) {
          note.dataset.mediaType = activeSlide.dataset.mediaType || '';
        }

        updateNoteToggleVisibility();
        if (noteDescription) {
          noteDescription.textContent = activeSlide.dataset.mediaDescription || '';
        }
        if (noteCredit) {
          const credit = activeSlide.dataset.mediaCredit || '';
          noteCredit.textContent = credit;
          noteCredit.hidden = !credit;
        }
      };

      const prevButton = carousel.querySelector('[data-carousel-prev]');
      const nextButton = carousel.querySelector('[data-carousel-next]');

      if (prevButton) {
        prevButton.addEventListener('click', () => renderSlide(activeIndex - 1));
      }
      if (nextButton) {
        nextButton.addEventListener('click', () => renderSlide(activeIndex + 1));
      }

      if (noteToggle) {
        noteToggle.addEventListener('click', () => {
          const isOpen = !noteShell.classList.contains('is-open');
          setNoteOpen(isOpen);
        });
      }

      if (typeof mobileViewportQuery.addEventListener === 'function') {
        mobileViewportQuery.addEventListener('change', updateNoteToggleVisibility);
      } else if (typeof mobileViewportQuery.addListener === 'function') {
        mobileViewportQuery.addListener(updateNoteToggleVisibility);
      }

      carousel.addEventListener('keydown', (event) => {
        if (event.key === 'ArrowLeft') {
          event.preventDefault();
          renderSlide(activeIndex - 1);
        } else if (event.key === 'ArrowRight') {
          event.preventDefault();
          renderSlide(activeIndex + 1);
        } else if (event.key === 'i' || event.key === 'I') {
          if (noteToggle) {
            event.preventDefault();
            const isOpen = !noteShell.classList.contains('is-open');
            setNoteOpen(isOpen);
          }
        }
      });

      setNoteOpen(false);
      renderSlide(activeIndex, false);
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
  let highlightWatchRaf = 0;
  let highlightWatchToken = 0;
  function triggerProjectHighlight(el) {
    clearTimeout(highlightTimer);
    el.classList.remove('is-highlighted');
    void el.offsetWidth;
    el.classList.add('is-highlighted');
    highlightTimer = setTimeout(() => el.classList.remove('is-highlighted'), 2600);
  }
  function scrollToProject(id) {
    const el = document.getElementById(id);
    if (el) {
      if (typeof closeOpenMapPopup === 'function') closeOpenMapPopup();
      const isMobile = window.matchMedia('(max-width: 767px)').matches;
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const rect = el.getBoundingClientRect();
      const topOffset = isMobile ? 72 : 92;
      const maxScroll = Math.max(
        0,
        document.documentElement.scrollHeight - window.innerHeight
      );
      const targetY = Math.max(
        0,
        Math.min(maxScroll, window.scrollY + rect.top - topOffset)
      );
      const travel = Math.abs(window.scrollY - targetY);
      const maxWait = reduceMotion
        ? 0
        : Math.min(isMobile ? 980 : 760, Math.max(240, Math.round(travel * (isMobile ? 0.62 : 0.48))));

      highlightWatchToken += 1;
      if (highlightWatchRaf) {
        cancelAnimationFrame(highlightWatchRaf);
        highlightWatchRaf = 0;
      }

      window.scrollTo({ top: targetY, behavior: reduceMotion ? 'auto' : 'smooth' });

      if (reduceMotion) {
        triggerProjectHighlight(el);
        return;
      }

      const watchToken = highlightWatchToken;
      const startedAt = performance.now();
      let settledFrames = 0;

      const watchScrollLanding = () => {
        if (watchToken !== highlightWatchToken) return;

        const distance = Math.abs(window.scrollY - targetY);
        settledFrames = distance <= 4 ? settledFrames + 1 : 0;

        if (settledFrames >= 2 || performance.now() - startedAt >= maxWait) {
          highlightWatchRaf = 0;
          triggerProjectHighlight(el);
          return;
        }

        highlightWatchRaf = requestAnimationFrame(watchScrollLanding);
      };

      highlightWatchRaf = requestAnimationFrame(watchScrollLanding);
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
  initProjectMediaCarousels();
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

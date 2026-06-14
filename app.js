// ── JOURNEY MAP DATA ──
// x/y = % of viewport. card: 'right' = card appears to the right of pin, 'left' = left
// above: card appears above pin, below: below
const journeyStops = [
  { x:10, y:60, card:'right', above:false,
    photo:'images/1011.mov', video:true,
    date:'02.08.2025 · Pirita', title:'The First Date',
    desc:'A walk along the Pirita promenade. The one that started everything.' },
  { x:20, y:35, card:'right', above:true,
    photo:'images/IMG_4854.jpg',
    date:'20–21.08.2025 · Paukjärve', title:'Stargazing',
    desc:'The most magical night I have ever experienced. Felt like a runaway.' },
  { x:30, y:62, card:'right', above:false,
    photo:'images/IMG_4895.jpg',
    date:'22.08.2025 · La Pizzeria di Orm Oja', title:'First Dinner',
    desc:'The first time we went out to eat together.' },
  { x:40, y:33, card:'right', above:true,
    photo:'images/IMG_5288.MOV', video:true,
    date:'15.09.2025 · Jüri Staadion', title:'The Breakdown',
    desc:'The first and HOPEFULLY the last time the car breaks down. Loved our midnight walk back.' },
  { x:50, y:63, card:'left', above:false,
    photo:'images/IMG_6522.jpg',
    date:'18.10.2025 · Jüri', title:'Meeting Roco',
    desc:'The first time you came over to see Roco. He loved you from the very start :)' },
  { x:58, y:33, card:'left', above:true,
    photo:'images/IMG_6780.jpg',
    date:'30.10.2025 · Jüri', title:'The First Photo of Us',
    desc:'The first time you came over and met my parents.' },
  { x:67, y:63, card:'left', above:false,
    photo:'images/IMG_7696.jpg',
    date:'22.11.2025 · Milano', title:'Our First Trip',
    desc:'The beginning of us exploring the world together. Also the first time we ever said "I love you" to each other. Will never forget.' },
  { x:75, y:33, card:'left', above:true,
    photo:'images/IMG_7854.jpg',
    date:'23.11.2025 · San Siro', title:'Milan Derby',
    desc:'Our first football match together and it was the biggest Derby in Italy. Amazing.' },
  { x:83, y:63, card:'left', above:false,
    photo:'images/IMG_1976.jpeg',
    date:'21.01.2026 · Lauluväljak', title:'First Time Sleighing',
    desc:'Me, You and Jaco. Was such a blast. Next year we are defo going again.' },
  { x:91, y:33, card:'left', above:true,
    photo:'images/IMG_8944.jpg',
    date:'01.03.2026 · Estonia Kontserdisaal', title:'The Theatre',
    desc:'Our first time at the theatre together. Opera was horrible, you were absolutely gorgeous.' },
];

let journeyStep = -1; // -1 = none revealed yet
let journeyAnimating = false;

function getDims() {
  const svg = document.getElementById('trailSvg');
  const r = svg.getBoundingClientRect();
  return { pw: r.width, ph: r.height };
}

function initJourney() {
  journeyStep = -1;
  journeyAnimating = false;
  document.getElementById('memoryStops').innerHTML = '';
  document.getElementById('trailSvg').innerHTML = '';

  setTimeout(() => {
    const { pw, ph } = getDims();

    journeyStops.forEach((stop, i) => {
      const el = document.createElement('div');
      el.className = 'memory-stop';
      el.id = `stop-${i}`;
      el.style.left = (stop.x / 100) * pw + 'px';
      el.style.top  = (stop.y / 100) * ph + 'px';

      const cardOffsetX = stop.card === 'right' ? 18 : -238;
      const cardOffsetY = stop.above ? -260 : 22;

      const media = stop.video
        ? `<video src="${stop.photo}" autoplay loop muted playsinline style="width:100%;aspect-ratio:4/3;object-fit:cover;object-position:center top;display:block;margin-bottom:0.6rem;filter:sepia(0.2);"></video>`
        : `<img src="${stop.photo}" alt="" loading="lazy"/>`;

      el.innerHTML = `
        <div class="memory-pin"></div>
        <div class="memory-card" style="left:${cardOffsetX}px;top:${cardOffsetY}px;">
          ${media}
          <div class="memory-card-date">${stop.date}</div>
          <div class="memory-card-title">${stop.title}</div>
          <div class="memory-card-desc">${stop.desc}</div>
        </div>`;

      document.getElementById('memoryStops').appendChild(el);


    });
  }, 60);
}

function revealNextStop() {
  if (journeyAnimating) return true;
  const nextStep = journeyStep + 1;
  if (nextStep >= journeyStops.length) return false;

  journeyAnimating = true;

  const { pw, ph } = getDims();
  const svg = document.getElementById('trailSvg');

  if (journeyStep >= 0) {
    const from = journeyStops[journeyStep];
    const to   = journeyStops[nextStep];
    const x1 = (from.x / 100) * pw + 7;
    const y1 = (from.y / 100) * ph + 7;
    const x2 = (to.x   / 100) * pw + 7;
    const y2 = (to.y   / 100) * ph + 7;

    const mx = (x1 + x2) / 2 + (Math.random() - 0.5) * 50;
    const my = (y1 + y2) / 2 - 30 + (Math.random() - 0.5) * 30;

    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', `M ${x1} ${y1} Q ${mx} ${my} ${x2} ${y2}`);
    path.classList.add('trail-path');
    svg.appendChild(path);

    const len = path.getTotalLength();
    path.style.strokeDasharray = `${len}`;
    path.style.strokeDashoffset = `${len}`;

    // glow filter for dot
    if (!svg.querySelector('#dotGlow')) {
      const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
      defs.innerHTML = `<filter id="dotGlow" x="-100%" y="-100%" width="300%" height="300%">
        <feGaussianBlur stdDeviation="3" result="blur"/>
        <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>`;
      svg.insertBefore(defs, svg.firstChild);
    }

    const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    dot.setAttribute('r', '5');
    dot.setAttribute('fill', '#7a3a10');
    dot.setAttribute('opacity', '0.95');
    dot.setAttribute('filter', 'url(#dotGlow)');
    const pt0 = path.getPointAtLength(0);
    dot.setAttribute('cx', pt0.x);
    dot.setAttribute('cy', pt0.y);
    svg.appendChild(dot);

    const duration = 1100;
    const start = performance.now();
    // ease out — starts fast, decelerates as it arrives
    function easeInOut(t) { return t < 0.5 ? 2*t*t : -1+(4-2*t)*t; }

    function animatePath(now) {
      const t    = Math.min((now - start) / duration, 1);
      const easy = easeInOut(t);
      path.style.strokeDashoffset = len * (1 - easy);
      const pt = path.getPointAtLength(len * easy);
      dot.setAttribute('cx', pt.x);
      dot.setAttribute('cy', pt.y);
      if (t < 1) {
        requestAnimationFrame(animatePath);
      } else {
        path.style.strokeDashoffset = '0';
        path.style.strokeDasharray = '5 4';
        svg.removeChild(dot);
        revealPin(nextStep);
      }
    }
    requestAnimationFrame(animatePath);
  } else {
    revealPin(nextStep);
  }

  journeyStep = nextStep;
  return true;
}

const journeyOverlay = document.getElementById('journeyMoment');

function openJourneyMoment(stop) {
  const media = document.getElementById('journeyMomentMedia');
  media.innerHTML = stop.video
    ? `<video src="${stop.photo}" autoplay loop muted playsinline></video>`
    : `<img src="${stop.photo}" alt="" />`;
  document.getElementById('journeyMomentDate').textContent  = stop.date;
  document.getElementById('journeyMomentTitle').textContent = stop.title;
  document.getElementById('journeyMomentDesc').textContent  = stop.desc;

  journeyOverlay.classList.remove('hidden');
  requestAnimationFrame(() => requestAnimationFrame(() => journeyOverlay.classList.add('visible')));
}

function closeJourneyMoment() {
  const isLast = journeyStep >= journeyStops.length - 1;

  if (isLast) {
    // swap content to the closing message, then auto-advance
    const inner = journeyOverlay.querySelector('.journey-moment-inner');
    inner.style.transition = 'opacity 0.4s ease';
    inner.style.opacity = '0';
    setTimeout(() => {
      inner.innerHTML = `
        <div style="text-align:center;color:rgba(255,245,230,0.9);">
          <p style="font-family:'Cormorant Garamond',serif;font-size:2.4rem;font-weight:300;font-style:italic;letter-spacing:0.04em;">
            …and this is only the beginning.
          </p>
        </div>`;
      inner.style.opacity = '1';
    }, 400);
    setTimeout(() => {
      journeyOverlay.classList.remove('visible');
      setTimeout(() => {
        journeyOverlay.classList.add('hidden');
        journeyAnimating = false;
        goTo(current + 1);
      }, 600);
    }, 2800);
    return;
  }

  journeyOverlay.classList.remove('visible');
  setTimeout(() => {
    journeyOverlay.classList.add('hidden');
    journeyAnimating = false;
  }, 500);
}

journeyOverlay.addEventListener('click', closeJourneyMoment);

function revealPin(i) {
  if (i > 0) {
    const prev = document.getElementById(`stop-${i - 1}`);
    if (prev) prev.classList.add('card-hidden');
  }
  const el = document.getElementById(`stop-${i}`);
  if (el) el.classList.add('revealed');

  // show the moment overlay — journeyAnimating stays true until user closes it
  setTimeout(() => openJourneyMoment(journeyStops[i]), 400);
}

function updateJourneyHint() {
  const hint = document.getElementById('mapHint');
  if (journeyStep >= journeyStops.length - 1) {
    hint.textContent = 'Click → to continue';
  } else {
    hint.textContent = `${journeyStep + 1} of ${journeyStops.length} · click anywhere for next`;
  }
}

document.getElementById('page-timeline').addEventListener('click', (e) => {
  if (e.target.closest('#btnPrev, #btnNext')) return;
  if (e.target.closest('#journeyMoment')) return; // handled by overlay listener
  if (current !== pages.findIndex(p => p.id === 'page-timeline')) return;

  // Easter egg: click Meeting Roco card → Roco photo pops up over the card
  const rocoStop = document.getElementById('stop-4');
  if (rocoStop && rocoStop.classList.contains('revealed')) {
    const card = rocoStop.querySelector('.memory-card');
    const rect = card.getBoundingClientRect();

    // Dismiss existing egg
    const existing = document.getElementById('rocoEgg');
    if (existing) {
      existing.style.opacity = '0';
      setTimeout(() => existing.remove(), 350);
      return;
    }

    if (e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom) {
      const imgH = 240;
      const img = document.createElement('img');
      img.src = 'images/IMG_9927.png';
      img.id = 'rocoEgg';
      img.style.cssText = `
        position:fixed;
        left:${rect.left}px;top:${rect.top - imgH}px;
        width:${rect.width}px;height:${imgH}px;
        object-fit:contain;object-position:center bottom;
        opacity:0;transition:opacity 0.35s ease,transform 0.35s cubic-bezier(0.22,1,0.36,1);
        transform:scale(0.92);z-index:500;cursor:pointer;
      `;
      document.body.appendChild(img);
      requestAnimationFrame(() => requestAnimationFrame(() => {
        img.style.opacity = '1';
        img.style.transform = 'scale(1)';
      }));
      return;
    }
  }

  const advanced = revealNextStop();
  if (!advanced) goTo(current + 1);
});

// ── PAGED NAVIGATION ──
const pages = Array.from(document.querySelectorAll('.page'));
const btnPrev = document.getElementById('btnPrev');
const btnNext = document.getElementById('btnNext');
const indicator = document.getElementById('pageIndicator');

let current = 0;

function buildDots() {
  pages.forEach((_, i) => {
    const dot = document.createElement('div');
    dot.className = 'dot' + (i === 0 ? ' active' : '');
    dot.addEventListener('click', () => goTo(i));
    indicator.appendChild(dot);
  });
}

function runStarsToMuseumTransition(leaving, entering, index) {
  // Clean up star page state
  document.getElementById('warpCanvas')?.remove();
  modalOpen = false;
  const _m = document.getElementById('photoModal');
  _m.classList.remove('visible');
  _m.classList.add('hidden');

  const ui = [document.getElementById('pageIndicator'), document.getElementById('btnPrev'), document.getElementById('btnNext')];
  ui.forEach(el => el.style.opacity = '0');

  // Camera shutter click sound
  try {
    const actx = new (window.AudioContext || window.webkitAudioContext)();
    const buf  = actx.createBuffer(1, Math.floor(actx.sampleRate * 0.06), actx.sampleRate);
    const d    = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++) {
      d[i] = (Math.random() * 2 - 1) * Math.exp(-i / (actx.sampleRate * 0.004));
    }
    const src  = actx.createBufferSource();
    src.buffer = buf;
    const gain = actx.createGain();
    gain.gain.value = 0.45;
    src.connect(gain);
    gain.connect(actx.destination);
    src.start(actx.currentTime + 0.05); // slight delay — fires at peak of flash
  } catch (e) {}

  // White flash overlay via a plain div — faster than canvas for a solid fill
  const flash = document.createElement('div');
  flash.style.cssText = 'position:fixed;inset:0;z-index:300;background:#fff;opacity:0;pointer-events:all;transition:none;';
  document.body.appendChild(flash);

  // Museum sits beneath the flash; switch the page immediately
  entering.style.transition = 'none';
  entering.style.transform  = 'translateX(0)';
  entering.style.opacity    = '0';
  entering.classList.add('active');
  leaving.classList.remove('active');
  leaving.style.opacity = '0';
  current = index;
  initMuseum();

  // Phase timing (ms)
  const T_RAMP  =  70;  // ramp to full white
  const T_HOLD  =  30;  // hold at peak (makes it feel punchy)
  const T_FADE  = 700;  // fade from white — museum reveals during this phase

  const start = performance.now();

  function anim(now) {
    const el = now - start;

    if (el < T_RAMP) {
      // Ramp up: 0 → 1
      flash.style.opacity = String(el / T_RAMP);
      requestAnimationFrame(anim);
      return;
    }

    if (el < T_RAMP + T_HOLD) {
      // Peak white
      flash.style.opacity = '1';
      requestAnimationFrame(anim);
      return;
    }

    // Fade out: white → transparent, museum fades in beneath
    const t = Math.min((el - T_RAMP - T_HOLD) / T_FADE, 1);
    // Ease-out so the last part of the fade is slow — nice reveal
    const eased = 1 - Math.pow(1 - t, 2);
    flash.style.opacity = String(1 - eased);
    entering.style.opacity = String(Math.min(t * 1.6, 1));

    if (t >= 1) {
      flash.remove();
      entering.style.opacity = '1';
      updateUI();
      updateArrowColor(index);
      ui.forEach(e => { e.style.opacity = ''; });
      leaving.style.opacity = '';
      return;
    }

    requestAnimationFrame(anim);
  }

  requestAnimationFrame(anim);
}

function runJourneyToStarsTransition(leaving, entering, index) {
  const canvas = document.createElement('canvas');
  canvas.style.cssText = 'position:fixed;inset:0;z-index:300;pointer-events:all;';
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;

  // Hide nav UI so it doesn't flash through the overlay
  const ui = [document.getElementById('pageIndicator'), document.getElementById('btnPrev'), document.getElementById('btnNext')];
  ui.forEach(el => el.style.opacity = '0');

  const T_FADE_IN  = 700;
  const T_STARS    = 2400;
  const T_FADE_OUT = 1000;
  const T_SWITCH   = T_FADE_IN - 50; // switch page just as screen goes fully black

  let switched = false, revealed = false;
  const stars = [];
  const start = performance.now();

  function frame(now) {
    const el = now - start;

    // Switch page silently but keep entering page opacity 0 — canvas hides everything
    if (!switched && el >= T_SWITCH) {
      switched = true;
      entering.style.transition = 'none';
      entering.style.transform  = 'translateX(0)';
      entering.style.opacity    = '0'; // stay hidden until overlay fades
      entering.classList.add('active');
      leaving.classList.remove('active');
      leaving.style.opacity = '0';
      current = index;
      initStars();
    }

    // Only reveal the page when overlay starts fading out
    if (!revealed && el >= T_FADE_IN + T_STARS) {
      revealed = true;
      entering.style.opacity = '1';
    }

    const fadeIn  = Math.min(el / T_FADE_IN, 1);
    const starEl  = Math.max(0, el - T_FADE_IN);
    const starT   = Math.min(starEl / T_STARS, 1);
    const fadeEl  = Math.max(0, el - T_FADE_IN - T_STARS);
    const fadeOut = Math.min(fadeEl / T_FADE_OUT, 1);

    if (fadeOut >= 1) {
      canvas.remove();
      // Restore UI now that transition is done
      updateUI();
      updateArrowColor(index);
      ui.forEach(el => { el.style.opacity = ''; });
      leaving.style.opacity = '';
      return;
    }

    canvas.style.opacity = fadeOut > 0 ? String(1 - fadeOut) : '1';

    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = `rgba(10,12,20,${fadeIn})`;
    ctx.fillRect(0, 0, W, H);

    if (starT > 0) {
      const target = Math.floor(starT * 260);
      while (stars.length < target) {
        stars.push({
          x: Math.random() * W,
          y: Math.random() * H,
          r: Math.random() * 1.3 + 0.2,
          alpha: 0,
          maxAlpha: 0.35 + Math.random() * 0.55,
          fadeSpeed: 0.012 + Math.random() * 0.025,
          twinkleSpeed: 0.002 + Math.random() * 0.005,
          phase: Math.random() * Math.PI * 2,
        });
      }
      stars.forEach(s => {
        s.alpha = Math.min(s.alpha + s.fadeSpeed, s.maxAlpha);
        const twinkle = 0.72 + 0.28 * Math.sin(now * s.twinkleSpeed + s.phase);
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${s.alpha * twinkle})`;
        ctx.fill();
      });
    }

    requestAnimationFrame(frame);
  }

  requestAnimationFrame(frame);
}

function _applyPageSwitch(index, leaving, entering) {
  entering.style.transition = 'none';
  entering.style.transform = 'translateX(0)';
  entering.style.opacity = '1';
  entering.classList.add('active');
  leaving.style.opacity = '0';
  setTimeout(() => {
    leaving.classList.remove('active');
    leaving.style.transform = '';
    leaving.style.opacity = '';
    leaving.style.transition = '';
    entering.style.transition = '';
  }, 650);

  current = index;
  updateUI();
  updateArrowColor(index);

  if (leaving.id === 'page-stars') {
    document.getElementById('warpCanvas')?.remove();
    modalOpen = false;
    const m = document.getElementById('photoModal');
    m.classList.remove('visible');
    m.classList.add('hidden');
  }
  if (leaving.id === 'page-museum') stopMuseumDust();

  if (pages[index].id === 'page-stars') initStars();
  if (pages[index].id === 'page-timeline') initJourney();
  if (pages[index].id === 'page-museum') initMuseum();

  if (pages[index].id === 'page-timeline') {
    entering.classList.remove('map-unfold');
    void entering.offsetWidth;
    entering.classList.add('map-unfold');
  }
}

function goTo(index) {
  if (index === current || index < 0 || index >= pages.length) return;

  const egg = document.getElementById('craftingEgg');
  if (egg) egg.remove();

  const leaving = pages[current];
  const entering = pages[index];
  const forward = index > current;

  // Special: journey → stars gets star-emergence transition
  if (leaving.id === 'page-timeline' && entering.id === 'page-stars') {
    runJourneyToStarsTransition(leaving, entering, index);
    return;
  }

  // Special: stars → museum gets gold spotlight sweep
  if (leaving.id === 'page-stars' && entering.id === 'page-museum') {
    runStarsToMuseumTransition(leaving, entering, index);
    return;
  }

  // Special: stats → ending fades to black
  if (leaving.id === 'page-letter' && entering.id === 'page-end') {
    const fade = document.createElement('div');
    fade.style.cssText = `position:fixed;inset:0;z-index:9999;background:#000;opacity:0;pointer-events:none;transition:opacity 0.9s ease;`;
    document.body.appendChild(fade);
    requestAnimationFrame(() => requestAnimationFrame(() => { fade.style.opacity = '1'; }));
    setTimeout(() => {
      _applyPageSwitch(index, leaving, entering);
      setTimeout(() => { fade.style.opacity = '0'; fade.style.transition = 'opacity 0.01s'; setTimeout(() => fade.remove(), 50); }, 200);
    }, 950);
    return;
  }

  // Special: cinema → stats gets projector overexposure flash
  if (leaving.id === 'page-love' && entering.id === 'page-letter') {
    const flash = document.createElement('div');
    flash.style.cssText = `
      position:fixed;inset:0;z-index:9999;
      background:#fff;opacity:0;pointer-events:none;
      transition:opacity 0.45s ease;
    `;
    document.body.appendChild(flash);
    requestAnimationFrame(() => requestAnimationFrame(() => { flash.style.opacity = '1'; }));
    setTimeout(() => {
      _applyPageSwitch(index, leaving, entering);
      flash.style.transition = 'opacity 0.7s ease';
      flash.style.opacity = '0';
      setTimeout(() => flash.remove(), 750);
    }, 480);
    return;
  }

  // Special: museum → cinema gets curtain transition
  if (leaving.id === 'page-museum' && entering.id === 'page-love') {
    const overlay = document.getElementById('curtainOverlay');
    overlay.style.pointerEvents = 'all';
    overlay.classList.remove('opening');
    overlay.classList.add('closing');
    setTimeout(() => {
      // Switch page silently under closed curtains, also reset cinema state
      cinResetState();
      _applyPageSwitch(index, leaving, entering);
      // Open curtains
      overlay.classList.remove('closing');
      overlay.classList.add('opening');
      setTimeout(() => {
        overlay.classList.remove('opening');
        overlay.style.pointerEvents = 'none';
      }, 1250);
    }, 1000);
    return;
  }

  // Normal transition
  entering.style.transform = `translateX(${forward ? 60 : -60}px)`;
  entering.style.opacity = '0';
  entering.style.transition = 'none';
  entering.classList.add('active');
  entering.getBoundingClientRect();

  leaving.style.transition = 'opacity 0.6s ease, transform 0.6s cubic-bezier(0.22,1,0.36,1)';
  leaving.style.transform = `translateX(${forward ? -60 : 60}px)`;
  leaving.style.opacity = '0';

  if (entering.id === 'page-timeline') {
    entering.style.transition = 'none';
    entering.style.transform = 'translateX(0)';
    entering.style.opacity = '1';
  } else {
    entering.style.transition = 'opacity 0.6s ease, transform 0.6s cubic-bezier(0.22,1,0.36,1)';
    entering.style.transform = 'translateX(0)';
    entering.style.opacity = '1';
  }

  _applyPageSwitch(index, leaving, entering);
}

const darkPages = ['page-hero', 'page-stars'];

function updateArrowColor(index) {
  const isDark = darkPages.includes(pages[index].id);
  document.body.classList.toggle('page-dark', isDark);
  document.body.classList.toggle('page-light', !isDark);
}

function showSafeCornerVideo() {
  if (document.getElementById('safeCornerOverlay')) return;

  const overlay = document.createElement('div');
  overlay.id = 'safeCornerOverlay';
  overlay.style.cssText = `
    position:fixed;inset:0;z-index:10000;background:rgba(0,0,0,0);
    display:flex;align-items:center;justify-content:center;
    transition:background 0.4s ease;cursor:pointer;
  `;

  const video = document.createElement('video');
  video.src = 'images/IMG_9416.MOV';
  video.autoplay = true;
  video.controls = false;
  video.playsInline = true;
  video.style.cssText = `
    max-width:90vw;max-height:85vh;border-radius:4px;
    box-shadow:0 32px 80px rgba(0,0,0,0.8);
    opacity:0;transition:opacity 0.4s ease;
  `;

  const hint = document.createElement('div');
  hint.textContent = 'click anywhere to close';
  hint.style.cssText = `
    position:absolute;bottom:28px;left:50%;transform:translateX(-50%);
    font-family:'Cormorant Garamond',serif;font-style:italic;font-size:0.85rem;
    color:rgba(255,245,230,0.5);letter-spacing:0.06em;pointer-events:none;
  `;

  overlay.appendChild(video);
  overlay.appendChild(hint);
  document.body.appendChild(overlay);

  requestAnimationFrame(() => requestAnimationFrame(() => {
    overlay.style.background = 'rgba(0,0,0,0.92)';
    video.style.opacity = '1';
  }));

  overlay.addEventListener('click', () => {
    video.pause();
    overlay.style.background = 'rgba(0,0,0,0)';
    video.style.opacity = '0';
    setTimeout(() => overlay.remove(), 400);
  });
}

function showNoGoingBack(imgSrc, text, imgH = 420, msgTop = '38%') {
  if (document.getElementById('noGoingBackOverlay')) return;

  const overlay = document.createElement('div');
  overlay.id = 'noGoingBackOverlay';
  overlay.style.cssText = `
    position:fixed;inset:0;z-index:9998;
    background:rgba(0,0,0,0);backdrop-filter:blur(0px);
    transition:background 0.35s ease,backdrop-filter 0.35s ease;
    pointer-events:none;
  `;

  const msg = document.createElement('div');
  msg.style.cssText = `
    position:fixed;top:${msgTop};left:50%;
    transform:translate(-50%,-50%) scale(0.85);
    font-family:'Cormorant Garamond',serif;font-style:italic;
    font-size:2rem;font-weight:300;letter-spacing:0.06em;
    color:rgba(255,245,230,0.95);text-align:center;
    z-index:10000;pointer-events:none;white-space:nowrap;
    opacity:0;transition:opacity 0.35s ease,transform 0.35s cubic-bezier(0.22,1,0.36,1);
  `;
  msg.textContent = text;

  const guard = document.createElement('img');
  guard.src = imgSrc;
  guard.style.cssText = `
    position:fixed;bottom:-${imgH}px;left:50%;
    transform:translateX(-50%);
    height:${imgH}px;object-fit:contain;object-position:top;
    z-index:9999;pointer-events:none;
    transition:bottom 0.9s cubic-bezier(0.22,1,0.36,1);
  `;

  document.body.appendChild(overlay);
  document.body.appendChild(msg);
  document.body.appendChild(guard);

  requestAnimationFrame(() => requestAnimationFrame(() => {
    overlay.style.background = 'rgba(0,0,0,0.55)';
    overlay.style.backdropFilter = 'blur(6px)';
    msg.style.opacity = '1';
    msg.style.transform = 'translate(-50%,-50%) scale(1)';
    setTimeout(() => { guard.style.bottom = '0px'; }, 650);
  }));

  setTimeout(() => {
    overlay.style.background = 'rgba(0,0,0,0)';
    overlay.style.backdropFilter = 'blur(0px)';
    msg.style.opacity = '0';
    msg.style.transform = 'translate(-50%,-50%) scale(0.95)';
    guard.style.bottom = `-${imgH}px`;
    setTimeout(() => { overlay.remove(); msg.remove(); guard.remove(); }, 550);
  }, 3500);
}

function updateUI() {
  btnPrev.disabled = false;
  btnNext.disabled = current === pages.length - 1;
  document.querySelectorAll('.dot').forEach((d, i) => {
    d.classList.toggle('active', i === current);
  });
}

btnNext.addEventListener('click', () => goTo(current + 1));

let noGoingBackCount = 0;
btnPrev.addEventListener('click', () => {
  if (current === 0) {
    noGoingBackCount++;
    if (noGoingBackCount === 1) showNoGoingBack('images/IMG_9922.png', "there's no going back now 🙂", 420, '38%');
    else showNoGoingBack('images/IMG_9924.png', 'I said no.', 580, '22%');
    return;
  }
  goTo(current - 1);
});

document.addEventListener('keydown', e => {
  if (['ArrowRight','ArrowLeft'].includes(e.key)) return;
  if (e.key === 'ArrowRight') {
    if (pages[current].id === 'page-timeline') {
      const advanced = revealNextStop();
      if (!advanced) goTo(current + 1);
    } else goTo(current + 1);
  }
  if (e.key === 'ArrowLeft') goTo(current - 1);
});

buildDots();
pages[0].classList.add('active');
updateUI();
updateArrowColor(0);

// ── STAR CANVAS ──
const canvas = document.getElementById('starCanvas');
const ctx = canvas.getContext('2d');
let W, H, stars = [], photoStars = [], rafId;

const starPhotos = [
  { file: 'images/IMG_2726.jpg',  caption: 'Two lovebirds enjoying Haapsalu Spa. Thanks for the gift bae, felt like a princess.' },
  { file: 'images/IMG_2731.jpg',  caption: 'This duck trynna take spotlight off you, such low level genjutsu dont work on me..' },
  { file: 'images/IMG_2742.jpg',  caption: 'Yeah... Just close this.' },
  { file: 'images/IMG_4252.jpg',  caption: 'You got me doing this twice at this point..' },
  { file: 'images/IMG_7721.jpg',  caption: 'Shoutout to the random person taking pictures of us!' },
  { file: 'images/IMG_7731.jpg',  caption: 'Never have I wished for water more in my life.' },
  { file: 'images/IMG_7845.jpg',  caption: 'Milan vs Milan. Milan won.' },
  { file: 'images/IMG_8341.jpg',  caption: 'There\'s just something special about this picture. The joy on your face while making those braids, unforgettable.' },
  { file: 'images/IMG_8833.jpg',  caption: 'This was after what was probably the fifth sauna round.' },
  { file: 'images/IMG_8982.jpg',  caption: 'When you got what you wanted, and I was made into a femboy.' },
  { file: 'images/IMG_9346.jpg',  caption: 'Pretended to be dragged into this. Would do it again.' },
  { file: 'images/IMG_9401.jpg',  caption: 'Two maniacs who are about to start a 22km walk.' },
  { file: 'images/IMG_9454.jpg',  caption: 'Watching ballet with my gorgeous girl. Never thought I\'d say that and mean it.' },
  { file: 'images/IMG_9344.jpg',  caption: 'Checking out the decathlon drip. We look TUFF.' },
  { file: 'images/IMG_2700.jpeg', caption: 'Brushing teeth together, the little things.' },
];

function initStars() {
  cancelAnimationFrame(rafId);
  W = canvas.width = canvas.offsetWidth;
  H = canvas.height = canvas.offsetHeight;
  stars = [];
  photoStars = [];

  for (let i = 0; i < 240; i++) {
    stars.push({
      x: Math.random() * W, y: Math.random() * H,
      r: Math.random() * 1.2 + 0.2,
      alpha: Math.random() * 0.5 + 0.3,
      speed: Math.random() * 0.008 + 0.003,
      phase: Math.random() * Math.PI * 2,
    });
  }

  starPhotos.forEach((p, i) => {
    const angle = (i / starPhotos.length) * Math.PI * 2 - Math.PI / 2;
    const baseX = W / 2 + Math.cos(angle) * W * 0.28 + (Math.random() - 0.5) * 60;
    const baseY = H / 2 + Math.sin(angle) * H * 0.28 + (Math.random() - 0.5) * 60;
    photoStars.push({
      x: baseX, y: baseY,
      baseX, baseY,
      driftAngle: Math.random() * Math.PI * 2,
      driftSpeed: 0.0003 + Math.random() * 0.0004,
      driftRadius: 6 + Math.random() * 10,
      r: 3.5, phase: Math.random() * Math.PI * 2, photo: p,
    });
  });

  // shooting stars
  const shooters = [];
  function spawnShooter() {
    const angle = (Math.random() * 30 + 10) * Math.PI / 180; // 10–40° downward
    const speed = 6 + Math.random() * 8;
    shooters.push({
      x: Math.random() * W * 1.2 - W * 0.1,
      y: Math.random() * H * 0.4,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      len: 80 + Math.random() * 120,
      alpha: 0,
      life: 0,        // 0→1
      maxLife: 60 + Math.random() * 40, // frames
    });
    setTimeout(spawnShooter, 2500 + Math.random() * 4000);
  }
  setTimeout(spawnShooter, 1000 + Math.random() * 2000);

  function draw(t) {
    ctx.clearRect(0, 0, W, H);
    stars.forEach(s => {
      const a = s.alpha * (0.6 + 0.4 * Math.sin(t * s.speed + s.phase));
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${a})`;
      ctx.fill();
    });

    // shooting stars
    for (let i = shooters.length - 1; i >= 0; i--) {
      const s = shooters[i];
      s.x += s.vx;
      s.y += s.vy;
      s.life++;
      const prog = s.life / s.maxLife;
      // fade in quickly, hold, then fade out
      s.alpha = prog < 0.2 ? prog / 0.2 : prog > 0.7 ? 1 - (prog - 0.7) / 0.3 : 1;

      const tailX = s.x - s.vx / Math.hypot(s.vx, s.vy) * s.len;
      const tailY = s.y - s.vy / Math.hypot(s.vx, s.vy) * s.len;
      const grad = ctx.createLinearGradient(tailX, tailY, s.x, s.y);
      grad.addColorStop(0, `rgba(255,255,255,0)`);
      grad.addColorStop(1, `rgba(255,255,255,${s.alpha * 0.9})`);
      ctx.beginPath();
      ctx.moveTo(tailX, tailY);
      ctx.lineTo(s.x, s.y);
      ctx.strokeStyle = grad;
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // bright head
      ctx.beginPath();
      ctx.arc(s.x, s.y, 1.5, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${s.alpha})`;
      ctx.fill();

      if (s.life >= s.maxLife || s.x > W + 50 || s.y > H + 50) shooters.splice(i, 1);
    }

    photoStars.forEach(s => {
      // drift position in a slow organic circle
      s.x = s.baseX + Math.cos(t * s.driftSpeed + s.driftAngle) * s.driftRadius;
      s.y = s.baseY + Math.sin(t * s.driftSpeed * 0.7 + s.driftAngle) * s.driftRadius * 0.6;

      const pulse = 0.75 + 0.25 * Math.sin(t * 0.002 + s.phase);
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r * pulse, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,215,80,${0.9 * pulse})`;
      ctx.shadowColor = 'rgba(255,215,80,0.6)';
      ctx.shadowBlur = 12;
      ctx.fill();
      ctx.shadowBlur = 0;
    });
    rafId = requestAnimationFrame(draw);
  }
  rafId = requestAnimationFrame(draw);
}

window.addEventListener('resize', () => {
  if (pages[current].id === 'page-stars') initStars();
});

// star click
const modal = document.getElementById('photoModal');

function warpTo(originX, originY, onDone) {
  // kill any existing warp canvas (e.g. double-click)
  document.getElementById('warpCanvas')?.remove();

  const c = document.createElement('canvas');
  c.id = 'warpCanvas';
  c.width  = window.innerWidth;
  c.height = window.innerHeight;
  document.body.appendChild(c);

  let cancelled = false;
  // safety net — if something goes wrong, always clean up
  const safetyTimer = setTimeout(() => { cancelled = true; onDone(c); }, 2000);
  const ctx = c.getContext('2d');

  const W = c.width, H = c.height;
  const cx = originX, cy = originY;
  const diag = Math.sqrt(W * W + H * H);
  const duration = 950;

  // generate streaks
  const streaks = Array.from({ length: 120 }, () => ({
    angle: Math.random() * Math.PI * 2,
    speed: 0.6 + Math.random() * 0.8,
    width: 0.4 + Math.random() * 1.2,
    brightness: 0.5 + Math.random() * 0.5,
  }));

  const start = performance.now();

  function frame(now) {
    if (cancelled) return;
    const t    = Math.min((now - start) / duration, 1);
    const accel = Math.pow(t, 2.5); // aggressive acceleration

    ctx.clearRect(0, 0, W, H);

    // deep space bg darkens fast
    ctx.fillStyle = `rgba(2,4,16,${Math.min(accel * 1.5, 0.92)})`;
    ctx.fillRect(0, 0, W, H);

    // streaks — radiate outward from click point (zooming-in tunnel effect)
    streaks.forEach(s => {
      const near = accel * 0.08 * diag * s.speed;
      const far  = accel * diag  * s.speed * 1.5;

      const x1 = cx + Math.cos(s.angle) * near;
      const y1 = cy + Math.sin(s.angle) * near;
      const x2 = cx + Math.cos(s.angle) * far;
      const y2 = cy + Math.sin(s.angle) * far;

      const alpha = Math.min(accel * 3, 1) * s.brightness;
      const grad = ctx.createLinearGradient(x1, y1, x2, y2);
      grad.addColorStop(0, `rgba(180,210,255,0)`);
      grad.addColorStop(0.4, `rgba(210,230,255,${alpha * 0.7})`);
      grad.addColorStop(1, `rgba(255,255,255,${alpha})`);

      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.strokeStyle = grad;
      ctx.lineWidth = s.width * (1 + accel * 2);
      ctx.stroke();
    });

    // star glow at origin — grows and brightens, simulating zooming into the star
    const glowProgress = Math.pow(t, 1.8);
    const glowR = glowProgress * diag * 0.7;
    if (glowR > 0) {
      const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, glowR);
      glow.addColorStop(0,   `rgba(255,255,220,${Math.min(glowProgress * 1.2, 0.9)})`);
      glow.addColorStop(0.15, `rgba(255,240,180,${glowProgress * 0.6})`);
      glow.addColorStop(0.5, `rgba(200,210,255,${glowProgress * 0.2})`);
      glow.addColorStop(1,   `rgba(0,0,0,0)`);
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(cx, cy, glowR, 0, Math.PI * 2);
      ctx.fill();
    }

    // white flash at the end — glow expands to consume the screen
    if (t > 0.72) {
      const flash = Math.pow((t - 0.72) / 0.28, 2.2);
      ctx.fillStyle = `rgba(255,255,255,${flash})`;
      ctx.fillRect(0, 0, W, H);
    }

    if (t < 1) {
      requestAnimationFrame(frame);
    } else {
      cancelled = true;
      clearTimeout(safetyTimer);
      // Pass canvas to onDone so caller removes it after modal is visible
      onDone(c);
    }
  }

  requestAnimationFrame(frame);
}

let modalOpen = false;

function openModal(photo, caption, clientX, clientY) {
  if (document.getElementById('warpCanvas')) return;
  if (modalOpen) return;
  if (current !== pages.findIndex(p => p.id === 'page-stars')) return;

  const modalImg = document.getElementById('modalImg');
  document.getElementById('modalCaption').textContent = caption;

  // Decode image fully before the modal appears so there's no black frame
  const preload = new Image();
  preload.src = photo;
  const imgReady = preload.decode
    ? preload.decode().catch(() => {})
    : (preload.complete
        ? Promise.resolve()
        : new Promise(res => { preload.onload = res; preload.onerror = res; }));

  warpTo(clientX, clientY, (canvas) => {
    imgReady.then(() => {
      modalImg.src = photo;
      const show = () => {
        modalOpen = true;
        modal.classList.remove('hidden');
        modal.classList.remove('visible');
        void modal.offsetHeight;
        modal.classList.add('visible');
        // Remove canvas now — modal is paint-ready and starting its fade-in
        canvas?.remove();
      };
      modalImg.decode ? modalImg.decode().then(show).catch(show) : show();
    });
  });
}

function closeModal() {
  if (!modalOpen) return;
  modalOpen = false;
  modal.classList.remove('visible');
  setTimeout(() => {
    if (!modalOpen) modal.classList.add('hidden');
  }, 400);
}

canvas.addEventListener('click', e => {
  if (current !== pages.findIndex(p => p.id === 'page-stars')) return;
  const rect = canvas.getBoundingClientRect();
  const mx = e.clientX - rect.left, my = e.clientY - rect.top;
  for (const s of photoStars) {
    if (Math.hypot(mx - s.x, my - s.y) < 22) {
      openModal(s.photo.file, s.photo.caption, e.clientX, e.clientY);
      break;
    }
  }
});

document.getElementById('modalClose').addEventListener('click', closeModal);
modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });


// ── MUSEUM 3D ──
const museumPhotos = [
  { file: 'images/IMG_8824.jpg',  title: 'I',    caption: '"Top Haircut"' },
  { file: 'images/IMG_9111.jpg',  title: 'II',   caption: '"Disgust"' },
  { file: 'images/IMG_9190.jpg',  title: 'III',  caption: '"Yamine Lamal"' },
  { file: 'images/IMG_9311.jpg',  title: 'IV',   caption: '"D"' },
  { file: 'images/IMG_9339.jpg',  title: 'V',    caption: '"Mrs. Posture"' },
  { file: 'images/IMG_9415.jpg',  title: 'VI',   caption: '"Safe Corner"' },
  { file: 'images/IMG_9526.jpg',  title: 'VII',  caption: '"Freaky Reflection"' },
  { file: 'images/IMG_9649.jpg',  title: 'VIII', caption: '"Apple Watch"' },
  { file: 'images/IMG_9708.jpg',  title: 'IX',   caption: '"Nap"' },
  { file: 'images/IMG_9737.jpg',  title: 'X',    caption: '"Top 10 EPIC Polar Bear Sightings *Real*"' },
  { file: 'images/IMG_9768.jpg',  title: 'XI',   caption: '"Zombie"' },
  { file: 'images/IMG_9897.png',  title: 'XII',  caption: '"Jumpscare"' },
];

// Each cycle shows 2 photos: left wall → left peels to center → right wall → right peels to center → walk forward
const M_BASE_W = 240;
const M_BASE_H = 310;
// Left and right frames are slightly different sizes for a real gallery feel
const M_SCALES = { left: 0.90, right: 0.82 };
const M_TR     = 'left 1s cubic-bezier(0.22,1,0.36,1),top 1s cubic-bezier(0.22,1,0.36,1),transform 1s cubic-bezier(0.22,1,0.36,1),opacity 0.85s ease';

// Named positions (l=left%, t=top%, tr=transform)
const MP = {
  leftWall:    { l:'20%', t:'40%', tr:'translateX(-50%) translateY(-50%) perspective(900px) rotateY(22deg)'   },
  rightWall:   { l:'80%', t:'40%', tr:'translateX(-50%) translateY(-50%) perspective(900px) rotateY(-22deg)'  },
  center:      { l:'50%', t:'47%', tr:'translateX(-50%) translateY(-50%) scale(1.75)'                         },
  offLeft:     { l:'20%', t:'40%', tr:'translateX(calc(-50% - 120vw)) translateY(-50%) perspective(900px) rotateY(22deg)'  },
  offRight:    { l:'80%', t:'40%', tr:'translateX(calc(-50% + 120vw)) translateY(-50%) perspective(900px) rotateY(-22deg)' },
  exitLeft:    { l:'20%', t:'40%', tr:'translateX(calc(-50% - 180px)) translateY(-50%) perspective(900px) rotateY(22deg) scale(1.15)'  },
  exitCenter:  { l:'50%', t:'47%', tr:'translateX(-50%) translateY(-50%) scale(1.2)'                          },
  exitRight:   { l:'80%', t:'40%', tr:'translateX(calc(-50% + 180px)) translateY(-50%) perspective(900px) rotateY(-22deg) scale(1.15)' },
};

let museumCycle     = 0;
let museumPhase     = 0;  // 0=empty,1=leftWall,2=leftCenter,3=bothWall,4=rightCenter
let museumAnimating = false;

function mPlace(id, pos, opacity, instant) {
  const art = document.getElementById(`mart-${id}`);
  const isCenter = (pos === MP.center || pos === MP.exitCenter);
  art.classList.toggle('at-center', isCenter);
  art.style.pointerEvents = isCenter ? 'auto' : 'none';
  if (instant) {
    art.style.transition = 'none';
    art.style.left = pos.l; art.style.top = pos.t; art.style.transform = pos.tr;
    if (opacity !== undefined) art.style.opacity = String(opacity);
    void art.offsetHeight; // force reflow
    art.style.transition = M_TR;
  } else {
    art.style.left = pos.l; art.style.top = pos.t; art.style.transform = pos.tr;
    if (opacity !== undefined) art.style.opacity = String(opacity);
  }
}

function mLoad(id, photoIdx) {
  const photo = museumPhotos[photoIdx];
  if (!photo) return false;
  const art = document.getElementById(`mart-${id}`);
  art.querySelector('img').src = photo.file;
  art.querySelector('.museum-plaque-title').textContent = photo.title;
  art.querySelector('.museum-caption').textContent = photo.caption || '';
  return true;
}

// ── Museum dust motes ──
let _dustCanvas = null, _dustRaf = null;

function startMuseumDust() {
  stopMuseumDust();
  const page = document.getElementById('page-museum');
  const c = document.createElement('canvas');
  c.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;z-index:2;pointer-events:none;';
  c.width  = page.offsetWidth  || window.innerWidth;
  c.height = page.offsetHeight || window.innerHeight;
  page.appendChild(c);
  _dustCanvas = c;

  const ctx = c.getContext('2d');
  const W = c.width, H = c.height;
  const spotXs = [W * 0.14, W * 0.86];
  const spread  = W * 0.10;

  const motes = Array.from({length: 60}, (_, i) => {
    const sx = spotXs[i % 2];
    return {
      x:     sx + (Math.random() - 0.5) * spread * 2,
      y:     Math.random() * H,
      r:     0.5 + Math.random() * 1.6,
      vy:    -(0.12 + Math.random() * 0.28),
      vx:    (Math.random() - 0.5) * 0.18,
      alpha: 0.04 + Math.random() * 0.16,
      si:    i % 2,
    };
  });

  function loop() {
    if (!_dustCanvas) return;
    ctx.clearRect(0, 0, W, H);
    for (const m of motes) {
      m.x += m.vx; m.y += m.vy;
      if (m.y < -4) { m.y = H + 4; m.x = spotXs[m.si] + (Math.random() - 0.5) * spread * 2; }
      const dx = m.x - spotXs[m.si];
      if (Math.abs(dx) > spread) m.vx = -Math.sign(dx) * 0.15;
      ctx.beginPath();
      ctx.arc(m.x, m.y, m.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,225,140,${m.alpha})`;
      ctx.fill();
    }
    _dustRaf = requestAnimationFrame(loop);
  }
  _dustRaf = requestAnimationFrame(loop);
}

function stopMuseumDust() {
  if (_dustRaf) { cancelAnimationFrame(_dustRaf); _dustRaf = null; }
  if (_dustCanvas) { _dustCanvas.remove(); _dustCanvas = null; }
}

// ── Museum footstep sound + camera bob ──
function playMuseumFootstep(delayMs) {
  setTimeout(() => {
    try {
      const actx = new (window.AudioContext || window.webkitAudioContext)();
      const sr = actx.sampleRate;
      const buf = actx.createBuffer(1, Math.floor(sr * 0.2), sr);
      const d = buf.getChannelData(0);
      for (let i = 0; i < d.length; i++)
        d[i] = (Math.random() * 2 - 1) * Math.exp(-i / (sr * 0.022));
      const src = actx.createBufferSource();
      src.buffer = buf;
      const lpf = actx.createBiquadFilter();
      lpf.type = 'lowpass'; lpf.frequency.value = 280;
      const gain = actx.createGain();
      gain.gain.value = 0.38;
      src.connect(lpf); lpf.connect(gain); gain.connect(actx.destination);
      src.start();
    } catch(e) {}
  }, delayMs);
}

function museumCameraBob() {
  const page = document.getElementById('page-museum');
  const t0 = performance.now();
  const DUR = 1500;
  (function frame(now) {
    const t = Math.min((now - t0) / DUR, 1);
    const bob = -6 * Math.sin(t * Math.PI * 3.2) * Math.pow(1 - t, 1.4);
    page.style.transform = `translateX(0) translateY(${bob.toFixed(2)}px)`;
    if (t < 1) requestAnimationFrame(frame);
    else page.style.transform = 'translateX(0)';
  })(t0);
}

// ── Polaroid-style develop when photo comes to center ──
function mPolaroidReveal(side) {
  const img = document.getElementById(`mart-${side}`)?.querySelector('img');
  if (!img) return;
  img.style.transition = 'none';
  img.style.filter = 'brightness(5) saturate(0)';
  void img.offsetHeight;
  img.style.transition = 'filter 1.55s cubic-bezier(0.4,0,0.6,1)';
  img.style.filter = 'brightness(1) saturate(1)';
  setTimeout(() => { img.style.transition = ''; img.style.filter = ''; }, 1700);
}

function initMuseum() {
  museumCycle     = 0;
  museumPhase     = 0;
  museumAnimating = false;
  document.getElementById('museumFrames').innerHTML = '';
  document.getElementById('museumSpots').innerHTML  = '';
  document.getElementById('museumHint').textContent = 'click anywhere to enter';
  startMuseumDust();

  ['left','right'].forEach(side => {
    const cx  = side === 'left' ? 14 : 86;
    const w   = Math.round(M_BASE_W * M_SCALES[side]);
    const h   = Math.round(M_BASE_H * M_SCALES[side]);

    const art = document.createElement('div');
    art.className = 'museum-artwork';
    art.id = `mart-${side}`;
    art.style.cssText = `width:${w}px;height:${h}px;left:${cx}%;top:42%;opacity:0;pointer-events:none;
      transform:translateX(-50%) translateY(-50%);transition:${M_TR};`;
    art.innerHTML = `
      <div class="museum-caption"></div>
      <div class="museum-frame" style="width:${w}px;height:${h}px;">
        <img src="" alt="" loading="lazy"/>
      </div>
      <div class="museum-plaque"><div class="museum-plaque-title"></div></div>
    `;
    document.getElementById('museumFrames').appendChild(art);

    const spotW = w * 3.2;
    const spotH = Math.round(42 / 100 * window.innerHeight) + h * 0.7;
    const spot = document.createElement('div');
    spot.className = 'museum-spot';
    spot.id = `mspot-${side}`;
    spot.style.cssText = `left:${cx}%;width:${spotW}px;height:${spotH}px;
      background:radial-gradient(ellipse 42% 100% at 50% 0%,rgba(255,220,110,0.18) 0%,rgba(255,205,80,0.09) 40%,rgba(255,195,60,0.03) 70%,transparent 100%);`;
    document.getElementById('museumSpots').appendChild(spot);
  });
}

function handleMuseumClick(e) {
  if (museumAnimating) return;

  const hint   = document.getElementById('museumHint');
  const photoL = museumCycle * 2;
  const photoR = museumCycle * 2 + 1;
  const hasR   = photoR < museumPhotos.length;
  const isLast = museumCycle >= Math.ceil(museumPhotos.length / 2) - 1;

  if (museumPhase === 0) {
    // Click 1: left photo slides onto left wall
    mLoad('left', photoL);
    mPlace('left', MP.offLeft, 0, true);
    mPlace('left', MP.leftWall, 1, false);
    setTimeout(() => document.getElementById('mspot-left').classList.add('lit'), 280);
    hint.textContent = '';
    museumPhase = 1;

  } else if (museumPhase === 1) {
    // Click 2: left photo peels off wall → faces you in center
    document.getElementById('mspot-left').classList.remove('lit');
    mPlace('left', MP.center, 1, false);
    document.getElementById('mart-left').classList.add('radiant');
    if (!hasR) {
      setTimeout(() => { hint.textContent = 'click → to continue'; }, 950);
    }
    museumPhase = 2;

  } else if (museumPhase === 2) {
    if (!hasR) {
      // No right photo — walk forward
      museumAnimating = true;
      hint.textContent = '';
      mPlace('left', MP.exitCenter, 0, false);
      setTimeout(() => { museumCycle++; museumPhase = 0; museumAnimating = false; goTo(current + 1); }, 700);
      return;
    }
    // Click 3: left photo returns to wall, right photo slides onto right wall
    document.getElementById('mart-left').classList.remove('radiant');
    mPlace('left', MP.leftWall, 1, false);
    setTimeout(() => document.getElementById('mspot-left').classList.add('lit'), 220);
    mLoad('right', photoR);
    mPlace('right', MP.offRight, 0, true);
    mPlace('right', MP.rightWall, 1, false);
    setTimeout(() => document.getElementById('mspot-right').classList.add('lit'), 280);
    hint.textContent = '';
    museumPhase = 3;

  } else if (museumPhase === 3) {
    // Click 4: right photo peels off wall → faces you in center
    document.getElementById('mspot-right').classList.remove('lit');
    mPlace('right', MP.center, 1, false);
    document.getElementById('mart-right').classList.add('radiant');
    setTimeout(() => { hint.textContent = isLast ? 'click → to continue' : 'click to walk forward'; }, 950);
    museumPhase = 4;

  } else if (museumPhase === 4) {
    // Easter egg: Safe Corner (photo index 5, cycle 2, right) plays secret video when clicking the frame
    const rightPhotoIdx = museumCycle * 2 + 1;
    const martRight = document.getElementById('mart-right');
    if (rightPhotoIdx === 5 && martRight.classList.contains('at-center') && e && e.target.closest('#mart-right')) {
      showSafeCornerVideo();
      return;
    }

    // Click 5: right photo returns to wall → walk forward → next cycle
    museumAnimating = true;
    hint.textContent = '';

    // Step 1: right photo slides back to its wall
    document.getElementById('mart-right').classList.remove('radiant');
    mPlace('right', MP.rightWall, 1, false);
    setTimeout(() => document.getElementById('mspot-right').classList.add('lit'), 280);

    // Footsteps + camera bob
    playMuseumFootstep(600);
    playMuseumFootstep(1050);
    setTimeout(museumCameraBob, 550);

    // Step 2: both photos rush off-screen (walk-forward)
    setTimeout(() => {
      mPlace('left',  MP.exitLeft,  0, false);
      mPlace('right', MP.exitRight, 0, false);
      document.getElementById('mspot-left').classList.remove('lit');
      document.getElementById('mspot-right').classList.remove('lit');
    }, 1000);

    // Step 3: new cycle begins
    setTimeout(() => {
      museumCycle++;
      museumPhase     = 0;
      museumAnimating = false;

      if (museumCycle * 2 >= museumPhotos.length) {
        goTo(current + 1);
        return;
      }

      mLoad('left', museumCycle * 2);
      mPlace('left', MP.offLeft, 0, true);
      mPlace('left', MP.leftWall, 1, false);
      setTimeout(() => document.getElementById('mspot-left').classList.add('lit'), 280);
      museumPhase = 1;
    }, 1700);
  }
}

document.getElementById('page-museum').addEventListener('click', e => {
  if (e.target.closest('#btnPrev,#btnNext')) return;
  if (current !== pages.findIndex(p => p.id === 'page-museum')) return;
  handleMuseumClick(e);
});

// ── CINEMA PAGE ──
const cinemaPhotos = [
  { src: 'images/IMG_9706.jpg', caption: '' },
  { src: 'images/IMG_8598.jpg', caption: '' },
  { src: 'images/IMG_8623.jpg', caption: '' },
  { src: 'images/IMG_9060.jpg', caption: '' },
  { src: 'images/IMG_9391.jpg', caption: '' },
  { src: 'images/IMG_9610.jpg', caption: '' },
  { src: 'images/IMG_9725.jpg', caption: '' },
  { src: 'images/IMG_9780.jpg', caption: '' },
  { src: 'images/IMG_9846.jpg', caption: '' },
  { src: 'images/IMG_9868.jpg', caption: '' },
];

let cinState = 'title'; // title | intermission | photo | done
let cinIdx = -1;
let cinBusy = false;

// Web Audio for ambient sounds
let cinAudioCtx = null;
let cinAmbientNode = null;
let cinAmbientGain = null;
let cinSoundOn = true;

function cinGetAudio() {
  if (!cinAudioCtx) cinAudioCtx = new (window.AudioContext || window.webkitAudioContext)();
  return cinAudioCtx;
}

function cinPlayDrumroll(duration = 1800) {
  if (!cinSoundOn) return;
  try {
    const ctx = cinGetAudio();
    const end = ctx.currentTime + duration / 1000;
    // snare hits that speed up
    const times = [];
    let t = ctx.currentTime + 0.05;
    let interval = 0.28;
    while (t < end - 0.05) {
      times.push(t);
      interval = Math.max(0.04, interval * 0.88);
      t += interval;
    }
    times.forEach(time => {
      const buf = ctx.createBuffer(1, ctx.sampleRate * 0.08, ctx.sampleRate);
      const data = buf.getChannelData(0);
      for (let i = 0; i < data.length; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / data.length, 1.8);
      }
      const src = ctx.createBufferSource();
      src.buffer = buf;
      const filt = ctx.createBiquadFilter();
      filt.type = 'bandpass';
      filt.frequency.value = 180 + Math.random() * 120;
      filt.Q.value = 0.8;
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.18, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.075);
      src.connect(filt);
      filt.connect(gain);
      gain.connect(ctx.destination);
      src.start(time);
    });
  } catch(e) {}
}

function cinPlayWhoosh() {
  if (!cinSoundOn) return;
  try {
    const ctx = cinGetAudio();
    const buf = ctx.createBuffer(1, ctx.sampleRate * 0.6, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) {
      const t = i / data.length;
      data[i] = (Math.random() * 2 - 1) * Math.sin(Math.PI * t) * 0.4;
    }
    const src = ctx.createBufferSource();
    src.buffer = buf;
    const filt = ctx.createBiquadFilter();
    filt.type = 'lowpass';
    filt.frequency.setValueAtTime(800, ctx.currentTime);
    filt.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.5);
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.22, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.55);
    src.connect(filt);
    filt.connect(gain);
    gain.connect(ctx.destination);
    src.start();
  } catch(e) {}
}

function cinStartAmbient() {
  if (!cinSoundOn) return;
  if (cinAmbientNode) return;
  try {
    const ctx = cinGetAudio();
    // Low projector hum
    const osc = ctx.createOscillator();
    osc.type = 'sawtooth';
    osc.frequency.value = 48;
    const filt = ctx.createBiquadFilter();
    filt.type = 'lowpass';
    filt.frequency.value = 80;
    cinAmbientGain = ctx.createGain();
    cinAmbientGain.gain.setValueAtTime(0, ctx.currentTime);
    cinAmbientGain.gain.linearRampToValueAtTime(0.04, ctx.currentTime + 2);
    osc.connect(filt);
    filt.connect(cinAmbientGain);
    cinAmbientGain.connect(ctx.destination);
    osc.start();
    cinAmbientNode = osc;
  } catch(e) {}
}

function cinStopAmbient() {
  if (cinAmbientNode && cinAmbientGain) {
    try {
      cinAmbientGain.gain.linearRampToValueAtTime(0, cinAudioCtx.currentTime + 1.5);
      setTimeout(() => { try { cinAmbientNode.stop(); } catch(e){} cinAmbientNode = null; }, 1600);
    } catch(e) {}
  }
}

function cinResetState() {
  cinState = 'title';
  cinIdx = -1;
  cinBusy = false;
  cinStopAmbient();
  document.getElementById('cinPhotoCard').classList.remove('visible');
  document.getElementById('cinIntermission').classList.remove('visible');
  document.getElementById('cinCountdown').style.display = 'none';
  document.getElementById('cinBurn').style.display = 'none';
  const tc = document.getElementById('cinTitleCard');
  tc.classList.remove('hidden');
  document.querySelector('.cin-title').innerHTML = 'my favourite<br>photos of you';
  document.querySelector('.cin-eyebrow').textContent = 'now showing';
  document.querySelector('.cin-sub').textContent = 'click anywhere to begin';
  document.getElementById('cinHint').textContent = 'click anywhere to begin';
}

function cinRunCountdown(onDone) {
  const canvas = document.getElementById('cinCountdown');
  canvas.style.display = 'block';
  canvas.width  = canvas.parentElement.offsetWidth;
  canvas.height = canvas.parentElement.offsetHeight;
  const c = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  const CX = W / 2, CY = H / 2;
  const R = Math.min(W, H) * 0.28;

  function beep(freq) {
    if (!cinSoundOn) return;
    try {
      const ac = cinGetAudio();
      const osc = ac.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = freq;
      const g = ac.createGain();
      g.gain.setValueAtTime(0.28, ac.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.14);
      osc.connect(g); g.connect(ac.destination);
      osc.start(); osc.stop(ac.currentTime + 0.18);
    } catch(e) {}
  }

  const NUMS = [5, 4, 3, 2, 1];
  const FRAME_MS = 700;
  let startTs = null, lastNum = null;

  // Pre-bake noise for film grain randomness per frame
  function drawFrame(num, progress) {
    c.fillStyle = '#080604';
    c.fillRect(0, 0, W, H);

    // Random film scratches
    for (let i = 0; i < 4; i++) {
      if (Math.random() < 0.35) {
        const sx = Math.random() * W;
        c.strokeStyle = `rgba(255,255,255,${Math.random() * 0.22})`;
        c.lineWidth = Math.random() < 0.5 ? 1 : 2;
        c.beginPath(); c.moveTo(sx, 0); c.lineTo(sx + (Math.random()-0.5)*25, H); c.stroke();
      }
    }

    // Pie sweep — remaining time in this number
    const sweep = (1 - progress) * Math.PI * 2;
    c.beginPath();
    c.moveTo(CX, CY);
    c.arc(CX, CY, R, -Math.PI/2, -Math.PI/2 + sweep);
    c.closePath();
    c.fillStyle = 'rgba(210,185,130,0.07)';
    c.fill();

    // Outer ring
    c.beginPath(); c.arc(CX, CY, R, 0, Math.PI*2);
    c.strokeStyle = 'rgba(210,185,130,0.6)'; c.lineWidth = 1.8; c.stroke();


    // Crosshairs full width
    c.strokeStyle = 'rgba(210,185,130,0.25)'; c.lineWidth = 1;
    c.beginPath(); c.moveTo(0, CY); c.lineTo(W, CY); c.stroke();
    c.beginPath(); c.moveTo(CX, 0); c.lineTo(CX, H); c.stroke();

    // Corner brackets
    const bOff = R * 1.4, bLen = R * 0.22;
    for (const [bx, by] of [[CX-bOff,CY-bOff],[CX+bOff,CY-bOff],[CX-bOff,CY+bOff],[CX+bOff,CY+bOff]]) {
      c.strokeStyle = 'rgba(210,185,130,0.22)'; c.lineWidth = 1;
      c.beginPath();
      c.moveTo(bx, by); c.lineTo(bx + (bx < CX ? bLen : -bLen), by);
      c.moveTo(bx, by); c.lineTo(bx, by + (by < CY ? bLen : -bLen));
      c.stroke();
    }

    // Number — use actual glyph bounds for true visual centering
    c.font = `${Math.floor(R * 0.95)}px 'Cormorant Garamond', serif`;
    c.fillStyle = 'rgba(225,210,168,0.9)';
    c.textAlign = 'center';
    c.textBaseline = 'alphabetic';
    const m = c.measureText(num.toString());
    const textCY = CY + (m.actualBoundingBoxAscent - m.actualBoundingBoxDescent) / 2;
    c.fillText(num.toString(), CX, textCY);

    // Film grain
    for (let i = 0; i < 700; i++) {
      c.fillStyle = `rgba(255,255,255,${Math.random() * 0.045})`;
      c.fillRect(Math.random()*W, Math.random()*H, 1, 1);
    }

    // Frame border
    c.strokeStyle = 'rgba(210,185,130,0.1)'; c.lineWidth = 7;
    c.strokeRect(3.5, 3.5, W-7, H-7);
  }

  function tick(ts) {
    if (!startTs) { startTs = ts; lastNum = NUMS[0]; beep(880); }
    const elapsed = ts - startTs;
    const fi = Math.floor(elapsed / FRAME_MS);
    const progress = (elapsed % FRAME_MS) / FRAME_MS;

    if (fi >= NUMS.length) {
      // White flash → done
      c.fillStyle = '#ffffff'; c.fillRect(0, 0, W, H);
      setTimeout(() => { canvas.style.display = 'none'; onDone(); }, 65);
      return;
    }

    const num = NUMS[fi];
    if (num !== lastNum) { lastNum = num; beep(num <= 2 ? 1100 : 880); }
    drawFrame(num, progress);
    requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
}

function cinBurnIn(onDone) {
  const screen = document.getElementById('cinScreen');
  const canvas = document.getElementById('cinBurn');
  canvas.width  = screen.offsetWidth;
  canvas.height = screen.offsetHeight;
  const c = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  const maxR = Math.sqrt(W*W + H*H) * 0.58;

  canvas.style.display = 'block';

  // Pre-bake edge noise for organic burn shape
  const SEGS = 52;
  const edgeNoise = Array.from({length: SEGS}, (_, i) =>
    Math.sin(i * 2.1 + 0.5) * 0.5 + Math.cos(i * 3.9 + 1.2) * 0.5
  );

  const duration = 750;
  const start = performance.now();

  function frame(now) {
    const t = Math.min((now - start) / duration, 1);
    const ease = 1 - Math.pow(1 - t, 2.8);
    const r = ease * maxR;

    c.clearRect(0, 0, W, H);

    if (r > 1) {
      // Dark overlay with expanding hole cut out
      c.fillStyle = '#080604';
      c.fillRect(0, 0, W, H);

      c.save();
      c.globalCompositeOperation = 'destination-out';
      c.beginPath();
      for (let i = 0; i <= SEGS; i++) {
        const angle = (i / SEGS) * Math.PI * 2;
        const n = edgeNoise[i % SEGS];
        const irregularity = 1 + n * 0.16 * (1 - ease * 0.6);
        const pr = r * irregularity;
        const px = W/2 + Math.cos(angle) * pr;
        const py = H/2 + Math.sin(angle) * pr;
        i === 0 ? c.moveTo(px, py) : c.lineTo(px, py);
      }
      c.closePath();
      c.fillStyle = '#000';
      c.fill();
      c.restore();

      // Subtle dark-gold burn edge
      const rIn  = Math.max(0, r * 0.9);
      const rOut = r * 1.08;
      const glow = c.createRadialGradient(W/2, H/2, rIn, W/2, H/2, rOut);
      const fade = Math.max(0, 1 - ease * 0.7);
      glow.addColorStop(0,   `rgba(200,165,80,0)`);
      glow.addColorStop(0.4, `rgba(180,140,60,${0.35 * fade})`);
      glow.addColorStop(1,   `rgba(100,70,20,0)`);
      c.beginPath();
      c.arc(W/2, H/2, rOut, 0, Math.PI*2);
      c.fillStyle = glow;
      c.fill();
    }

    if (t < 1) {
      requestAnimationFrame(frame);
    } else {
      canvas.style.display = 'none';
      onDone();
    }
  }

  requestAnimationFrame(frame);
}

function cinShowIntermission(nextIdx) {
  const el = document.getElementById('cinIntermission');
  const counter = document.getElementById('cinCounter');
  counter.textContent = `${String(nextIdx + 1).padStart(2,'0')} / ${String(cinemaPhotos.length).padStart(2,'0')}`;
  el.classList.add('visible');

  // hide photo card
  document.getElementById('cinPhotoCard').classList.remove('visible');

  cinPlayDrumroll(1900);

  return new Promise(res => setTimeout(res, 2000));
}

function cinShowPhoto(idx) {
  const photo = cinemaPhotos[idx];
  document.getElementById('cinPhoto').src   = photo.src;
  document.getElementById('cinPhotoBg').src = photo.src;
  const card  = document.getElementById('cinPhotoCard');
  const interm = document.getElementById('cinIntermission');

  card.classList.add('visible');
  cinBurnIn(() => {
    interm.classList.remove('visible');
    cinPlayWhoosh();
  });
}

async function handleCinemaClick() {
  if (cinBusy) return;

  // Resume audio context on first interaction
  if (cinAudioCtx && cinAudioCtx.state === 'suspended') cinAudioCtx.resume();

  if (cinState === 'title') {
    cinBusy = true;
    cinStartAmbient();
    document.getElementById('cinHint').textContent = 'click for next';
    // Fade title card, then run film countdown, then first photo
    document.getElementById('cinTitleCard').classList.add('hidden');
    await new Promise(r => setTimeout(r, 350));
    await new Promise(r => cinRunCountdown(r));
    cinIdx = 0;
    await cinShowIntermission(cinIdx);
    cinShowPhoto(cinIdx);
    cinState = 'photo';
    cinBusy = false;
    return;
  }

  if (cinState === 'photo') {
    cinIdx++;
    if (cinIdx >= cinemaPhotos.length) {
      // All photos shown — finale
      cinState = 'done';
      cinBusy = true;
      document.getElementById('cinPhotoCard').classList.remove('visible');
      const titleCard = document.getElementById('cinTitleCard');
      document.querySelector('.cin-title').innerHTML = 'the end';
      document.querySelector('.cin-eyebrow').textContent = 'thank you for watching';
      document.querySelector('.cin-sub').textContent = '♡';
      titleCard.classList.remove('hidden');
      cinStopAmbient();
      cinBusy = false;
      return;
    }
    cinBusy = true;
    await cinShowIntermission(cinIdx);
    cinShowPhoto(cinIdx);
    cinState = 'photo';
    cinBusy = false;
    return;
  }
}

document.getElementById('page-love').addEventListener('click', (e) => {
  if (current !== pages.findIndex(p => p.id === 'page-love')) return;

  // Easter egg: crafting photo (index 1 = IMG_8598) shows IMG_9928 — only when clicking the photo itself
  if (cinState === 'photo' && cinIdx === 1 && !document.getElementById('craftingEgg') && e.target.id === 'cinPhoto') {
    const img = document.createElement('img');
    img.src = 'images/IMG_9928.png';
    img.id = 'craftingEgg';
    img.style.cssText = `
      position:fixed;
      left:7vw;
      top:42vh;
      width:200px;height:240px;
      object-fit:contain;object-position:center bottom;
      opacity:0;transition:opacity 0.4s ease,transform 0.4s cubic-bezier(0.22,1,0.36,1);
      transform:scale(0.88);z-index:10001;pointer-events:none;
    `;
    document.body.appendChild(img);
    requestAnimationFrame(() => requestAnimationFrame(() => {
      img.style.opacity = '1';
      img.style.transform = 'scale(1)';
    }));
    return;
  }

  handleCinemaClick();
});

// ── EASTER EGGS ──
const egg = document.getElementById('easterEgg');
const eggText = document.getElementById('easterEggText');

function closeEgg() {
  egg.classList.remove('visible');
  setTimeout(() => egg.classList.add('hidden'), 650);
}

document.getElementById('easterEggClose').addEventListener('click', closeEgg);
egg.addEventListener('click', e => { if (e.target === egg) closeEgg(); });

function showEgg(msg) {
  eggText.textContent = msg;
  egg.classList.remove('hidden');
  requestAnimationFrame(() => requestAnimationFrame(() => egg.classList.add('visible')));
}

const particles = ['❤️', '🌸', '✨', '💛', '🌷', '⭐', '💫', '🍀'];

let nameClicks = 0;
document.getElementById('heroName').addEventListener('click', (e) => {
  // burst
  const rect = e.target.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;
  const count = 14;

  for (let i = 0; i < count; i++) {
    const el = document.createElement('div');
    el.className = 'burst-particle';
    el.textContent = particles[Math.floor(Math.random() * particles.length)];

    const angle = (i / count) * 2 * Math.PI + Math.random() * 0.4;
    const dist  = 80 + Math.random() * 100;
    const dx    = Math.cos(angle) * dist;
    const dy    = Math.sin(angle) * dist - 40;
    const rot   = (Math.random() - 0.5) * 360 + 'deg';
    const delay = Math.random() * 120;

    el.style.left = cx + 'px';
    el.style.top  = cy + 'px';
    el.style.setProperty('--dx', dx + 'px');
    el.style.setProperty('--dy', dy + 'px');
    el.style.setProperty('--rot', rot);
    el.style.animationDelay = delay + 'ms';
    el.style.fontSize = (0.9 + Math.random() * 0.8) + 'rem';

    document.body.appendChild(el);
    setTimeout(() => el.remove(), 1200 + delay);
  }

  // easter egg on 3 clicks
  if (++nameClicks >= 3) { nameClicks = 0; showEgg('Ma armastan sind, Miina. 🤍'); }
});

let typed = '';
document.addEventListener('keydown', e => {
  if (['ArrowRight','ArrowLeft'].includes(e.key)) return;
  typed += e.key.toLowerCase();
  if (typed.length > 5) typed = typed.slice(-5);
  if (typed === 'miina') { typed = ''; showEgg('You found me. And I\'m so glad you did. ✨'); }
});

// ── STATS PAGE ──
const TOGETHER_START = new Date('2025-08-02T00:00:00');
let statsTicker = null;

function fmt(n) { return Math.floor(n).toLocaleString('en-US'); }

function setStatNum(el, val) {
  const str = String(val);
  if (el.textContent === str) return;
  el.textContent = str;
  el.classList.remove('tick');
  void el.offsetWidth;
  el.classList.add('tick');
}

function calcStats() {
  const elapsed = Date.now() - TOGETHER_START.getTime();
  const totalSec = elapsed / 1000;
  const now = new Date();
  return {
    seconds: fmt(totalSec),
    minutes: fmt(totalSec / 60),
    hours:   fmt(totalSec / 3600),
    days:    fmt(totalSec / 86400),
    months:  String((now.getFullYear() - TOGETHER_START.getFullYear()) * 12
      + (now.getMonth() - TOGETHER_START.getMonth())
      - (now.getDate() < TOGETHER_START.getDate() ? 1 : 0))
  };
}

function updateStats() {
  const s = calcStats();
  setStatNum(document.getElementById('statSeconds'), s.seconds);
  setStatNum(document.getElementById('statMinutes'), s.minutes);
  setStatNum(document.getElementById('statHours'),   s.hours);
  setStatNum(document.getElementById('statDays'),    s.days);
  setStatNum(document.getElementById('statMonths'),  s.months);
}

function countUp(el, target, duration) {
  const isNum = /^[\d,]+$/.test(target.replace(/,/g, ''));
  if (!isNum) { el.textContent = target; return; }
  const end = parseInt(target.replace(/,/g, ''));
  const start = Date.now();
  function tick() {
    const p = Math.min((Date.now() - start) / duration, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    el.textContent = fmt(Math.floor(eased * end));
    if (p < 1) requestAnimationFrame(tick);
    else el.textContent = target;
  }
  requestAnimationFrame(tick);
}

new MutationObserver(() => {
  const page = document.getElementById('page-letter');
  if (page.classList.contains('active')) {
    clearInterval(statsTicker);
    document.querySelectorAll('.stat-card').forEach(card => card.classList.remove('revealed'));
    const s = calcStats();
    const liveIds = { statSeconds: s.seconds, statMinutes: s.minutes, statHours: s.hours, statDays: s.days, statMonths: s.months };
    document.querySelectorAll('.stat-card').forEach(card => {
      const delay = parseInt(card.dataset.delay) * 110 + 200;
      setTimeout(() => {
        card.classList.add('revealed');
        const numEl = card.querySelector('.stat-num[id]');
        if (numEl && liveIds[numEl.id] !== undefined) {
          countUp(numEl, liveIds[numEl.id], 1400);
        }
      }, delay);
    });
    setTimeout(() => { statsTicker = setInterval(updateStats, 1000); }, 2200);
  } else {
    clearInterval(statsTicker);
  }
}).observe(document.getElementById('page-letter'), { attributes: true, attributeFilter: ['class'] });

// ── ENDING PAGE ──
new MutationObserver(() => {
  const page = document.getElementById('page-end');
  const l1 = document.getElementById('endingLine1');
  const l2 = document.getElementById('endingLine2');
  if (page.classList.contains('active')) {
    l1.classList.remove('visible');
    l2.classList.remove('visible');
    setTimeout(() => l1.classList.add('visible'), 800);
    setTimeout(() => l1.classList.remove('visible'), 2800);
    setTimeout(() => l2.classList.add('visible'), 5000);
  } else {
    l1.classList.remove('visible');
    l2.classList.remove('visible');
  }
}).observe(document.getElementById('page-end'), { attributes: true, attributeFilter: ['class'] });

// ── DATA ──────────────────────────────────────────────────
const TOPICS = [
  { id:'first-print', icon:'M12 2L2 7l10 5 10-5-10-5z', level:'Beginner', filter:'beginner', title:'Getting Started', desc:'Your first 24 hours with a printer — unboxing to first successful print.', meta:'6 lessons · 30 min' },
  { id:'materials', icon:'M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z', level:'Beginner', filter:'beginner', title:'Choosing Materials', desc:'PLA, PETG, ABS, TPU, Resin — when to use each, and what to expect.', meta:'5 lessons · 25 min' },
  { id:'slicing', icon:'M3 12h18M12 3v18', level:'Intermediate', filter:'intermediate', title:'Slicing & Settings', desc:'Layer height, infill, supports, speeds — the settings that matter most.', meta:'8 lessons · 50 min' },
  { id:'design', icon:'M12 20h9 M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z', level:'Intermediate', filter:'intermediate', title:'Designing for 3D Print', desc:'Think like a printer. Wall thickness, overhangs, tolerances, and orientation.', meta:'7 lessons · 40 min' },
  { id:'maintenance', icon:'M12 15a3 3 0 100-6 3 3 0 000 6z M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33', level:'Intermediate', filter:'intermediate', title:'Maintenance', desc:'Keep your printer happy — cleaning, lubrication, and small tune-ups.', meta:'4 lessons · 20 min' },
  { id:'advanced', icon:'M13 2L3 14h9l-1 8 10-12h-9l1-8z', level:'Advanced', filter:'advanced', title:'Advanced Techniques', desc:'Multi-color, supports tuning, vase mode, and complex geometries.', meta:'9 lessons · 70 min' },
  { id:'troubleshooting', icon:'M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z M12 9v4 M12 17h.01', level:'Reference', filter:'reference', title:'Troubleshooting', desc:'Stringing, warping, layer shifts — diagnose and fix common failures.', meta:'12 fixes · Reference' },
  { id:'glossary', icon:'M4 19.5A2.5 2.5 0 016.5 17H20 M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z', level:'Reference', filter:'reference', title:'Glossary', desc:'3D printing jargon decoded — extruder, hotend, infill, raft, and more.', meta:'40+ terms' },
];

const GUIDES = [
  { icon:'📘', title:'Bed Leveling — The 5-Minute Method', sub:'Beginner · 4 min read', tag:'Setup' },
  { icon:'📘', title:'PLA vs PETG: Which Should You Use?', sub:'Beginner · 6 min read', tag:'Materials' },
  { icon:'📘', title:'Understanding Layer Adhesion', sub:'Intermediate · 8 min read', tag:'Quality' },
  { icon:'📘', title:'Designing Snap-Fit Parts', sub:'Advanced · 12 min read', tag:'Design' },
  { icon:'📘', title:'Finishing Prints: Sanding to Painting', sub:'Intermediate · 10 min read', tag:'Post-Process' },
];

const VIDEOS = [
  { icon:'🎬', title:'Your First Print — Full Walkthrough', sub:'18:42 · Beginner', tag:'Watch' },
  { icon:'🎬', title:'Slicer Settings Explained Visually', sub:'12:05 · Intermediate', tag:'Watch' },
  { icon:'🎬', title:'How To Replace a Nozzle', sub:'6:18 · Maintenance', tag:'Watch' },
  { icon:'🎬', title:'Multi-Color Printing Basics', sub:'14:30 · Advanced', tag:'Watch' },
];

const TIPS = [
  { icon:'⚡', title:'Glue stick = best bed adhesion for PLA', sub:'Quick Tip', tag:'Adhesion' },
  { icon:'⚡', title:'Dry your filament if it sounds like popcorn', sub:'Quick Tip', tag:'Materials' },
  { icon:'⚡', title:'First layer too low = no plastic. Too high = spaghetti.', sub:'Quick Tip', tag:'Setup' },
  { icon:'⚡', title:'Slow down for tall, thin parts to reduce wobble', sub:'Quick Tip', tag:'Quality' },
  { icon:'⚡', title:'Orient curved surfaces vertically for smooth finish', sub:'Quick Tip', tag:'Design' },
];

const GLOSSARY = [
  { term:'Extruder', def:'The motor + gear assembly that pushes filament toward the hotend.' },
  { term:'Hotend', def:'The heated nozzle assembly that melts and deposits plastic.' },
  { term:'Infill', def:'Internal honeycomb structure inside a print, controlled by percentage.' },
  { term:'Layer Height', def:'Vertical thickness of each printed layer. Smaller = smoother + slower.' },
  { term:'Raft', def:'A thick disposable base printed under your part to improve adhesion.' },
  { term:'Brim', def:'A flat single-layer skirt around your part to prevent corner lifting.' },
  { term:'Supports', def:'Removable scaffolding under overhangs steeper than ~45°.' },
  { term:'Stringing', def:'Thin plastic strands left between parts when nozzle moves.' },
  { term:'Warping', def:'Corners lifting off the bed as the print cools and contracts.' },
  { term:'Slicer', def:'Software that converts a 3D model into G-code for the printer.' },
  { term:'G-code', def:'Plain-text instructions telling the printer where to move and how fast.' },
  { term:'STL', def:'Standard 3D file format — a mesh of triangles describing a model.' },
];

const FAQS = [
  { q:'My first layer isn\'t sticking. What do I do?', a:'Re-level your bed, clean it with isopropyl alcohol, and lower the nozzle slightly. A glue stick or PEI sheet helps a lot for PLA.' },
  { q:'Why are my prints stringy?', a:'Filament is likely wet, or your retraction settings need tuning. Dry the spool for 4-6 hours and increase retraction distance by 1-2mm.' },
  { q:'How do I know which material to use?', a:'PLA for indoor decorative parts, PETG for tougher functional parts, ABS for heat resistance, TPU for flexible parts, Resin for ultra-fine detail.' },
  { q:'My print failed halfway through. Why?', a:'Common causes: clogged nozzle, filament tangle, layer shift from a missed step, or thermal runaway. Check the failure point — it usually tells the story.' },
  { q:'How long does a print take?', a:'Anywhere from 20 minutes for a small keychain to 24+ hours for a large detailed model. Layer height and infill are the biggest factors.' },
  { q:'Do I need a heated bed?', a:'For PLA, technically no — but it helps a lot. For PETG, ABS, and most other materials, yes, a heated bed is required.' },
];

// ── RENDER TOPICS ──────────────────────────────────────────
function renderTopics(filter='all') {
  const grid = document.getElementById('topicsGrid');
  const list = filter === 'all' ? TOPICS : TOPICS.filter(t => t.filter === filter);
  grid.innerHTML = list.map(t => `
    <div class="topic-card" data-id="${t.id}">
      <span class="cs-pill cs-stamp-corner">Soon</span>
      <div class="topic-icon">
        <svg viewBox="0 0 24 24"><path d="${t.icon}"/></svg>
      </div>
      <div class="topic-level">${t.level}</div>
      <h3>${t.title}</h3>
      <p>${t.desc}</p>
      <div class="topic-meta">
        <span>${t.meta}</span>
        <span class="arrow">→</span>
      </div>
    </div>
  `).join('');
}
renderTopics();

document.querySelectorAll('.filter-chip').forEach(chip => {
  chip.addEventListener('click', () => {
    document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
    chip.classList.add('active');
    renderTopics(chip.dataset.filter);
  });
});

// ── RENDER LIBRARY ─────────────────────────────────────────
function renderList(items) {
  return `<div class="lib-list">${items.map(i => `
    <div class="lib-item">
      <div class="lib-item-icon">${i.icon}</div>
      <div class="lib-item-body">
        <div class="lib-item-title">${i.title}</div>
        <div class="lib-item-sub">${i.sub}</div>
      </div>
      <span class="cs-pill">Soon</span>
    </div>`).join('')}</div>`;
}

function renderGlossary() {
  return `<dl class="glossary-grid">${GLOSSARY.map(g => `
    <div class="glossary-term">
      <span class="cs-pill cs-stamp-corner">Soon</span>
      <dt>${g.term}</dt>
      <dd>${g.def}</dd>
    </div>`).join('')}</dl>`;
}

function renderFaq() {
  return FAQS.map((f, i) => `
    <div class="faq-item" data-idx="${i}">
      <button class="faq-q">${f.q}<span style="display:flex;align-items:center;gap:10px;"><span class="cs-pill">Soon</span><span class="chev">⌄</span></span></button>
      <div class="faq-a">${f.a}</div>
    </div>`).join('');
}

function renderTab(tab) {
  const c = document.getElementById('libraryContent');
  if (tab === 'guides') c.innerHTML = renderList(GUIDES);
  else if (tab === 'videos') c.innerHTML = renderList(VIDEOS);
  else if (tab === 'tips') c.innerHTML = renderList(TIPS);
  else if (tab === 'glossary') c.innerHTML = renderGlossary();
  else if (tab === 'faq') {
    c.innerHTML = renderFaq();
    c.querySelectorAll('.faq-item').forEach(item => {
      item.querySelector('.faq-q').addEventListener('click', () => item.classList.toggle('open'));
    });
  }
}
renderTab('guides');

document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    renderTab(tab.dataset.tab);
  });
});

// ── SEARCH ─────────────────────────────────────────────────
document.getElementById('searchInput').addEventListener('input', e => {
  const q = e.target.value.toLowerCase().trim();
  if (!q) { renderTopics(); return; }
  const grid = document.getElementById('topicsGrid');
  const filtered = TOPICS.filter(t =>
    t.title.toLowerCase().includes(q) || t.desc.toLowerCase().includes(q)
  );
  grid.innerHTML = filtered.length ? filtered.map(t => `
    <div class="topic-card" data-id="${t.id}">
      <div class="topic-icon"><svg viewBox="0 0 24 24"><path d="${t.icon}"/></svg></div>
      <div class="topic-level">${t.level}</div>
      <h3>${t.title}</h3>
      <p>${t.desc}</p>
      <div class="topic-meta"><span>${t.meta}</span><span class="arrow">→</span></div>
    </div>
  `).join('') : `<p style="color:var(--fg4); font-style:italic;">No results for "${q}"</p>`;
});

// ── STARS ─────────────────────────────────────────────────
const sc = document.getElementById('starsCanvas');
const sx = sc.getContext('2d');
let stars = [];
function resizeStars() {
  sc.width = window.innerWidth;
  sc.height = Math.max(window.innerHeight, document.body.scrollHeight);
  stars = [];
  const count = Math.min(400, Math.floor(sc.width * sc.height / 4500));
  for (let i = 0; i < count; i++) {
    const roll = Math.random();
    const type = roll > 0.92 ? 1 : roll > 0.78 ? 2 : 0;
    stars.push({ x:Math.random()*sc.width, y:Math.random()*sc.height,
      r: type===1 ? Math.random()*1.1+0.6 : Math.random()*0.9+0.1,
      baseAlpha: type===1 ? 0.85 : Math.random()*0.55+0.15,
      phase:Math.random()*Math.PI*2, phase2:Math.random()*Math.PI*2,
      speed: type===2 ? Math.random()*3+2 : Math.random()*0.6+0.2,
      speed2:Math.random()*1.4+0.4, type,
      color: roll>0.85 ? '#90BAFF' : roll>0.7 ? '#A8C8E0' : '#FFFFFF' });
  }
}
function drawStars(time) {
  sx.clearRect(0,0,sc.width,sc.height);
  const t = time*0.001, scrollY = window.scrollY;
  stars.forEach(s => {
    const y = s.y - scrollY*0.3;
    if (y<-10 || y>sc.height+10) return;
    let twinkle, r;
    if (s.type===1) { const raw=Math.sin(t*s.speed+s.phase); twinkle=Math.pow(Math.max(0,raw),4); r=s.r*(0.6+0.7*twinkle);
      if (twinkle>0.5) { const g=sx.createRadialGradient(s.x,y,0,s.x,y,r*5); g.addColorStop(0,`rgba(41,121,255,${0.3*twinkle})`); g.addColorStop(1,'rgba(41,121,255,0)'); sx.fillStyle=g; sx.beginPath(); sx.arc(s.x,y,r*5,0,Math.PI*2); sx.fill(); } }
    else if (s.type===2) { const a=0.5+0.5*Math.sin(t*s.speed+s.phase), b=0.5+0.5*Math.sin(t*s.speed2*1.7+s.phase2); twinkle=a*b; r=s.r; }
    else { const a=0.5+0.5*Math.sin(t*s.speed+s.phase), b=0.5+0.5*Math.sin(t*s.speed2+s.phase2); twinkle=0.3+0.7*(a*0.6+b*0.4); r=s.r; }
    const alpha = s.baseAlpha*twinkle; if (alpha<0.01) return;
    sx.globalAlpha=alpha; sx.fillStyle=s.color; sx.beginPath(); sx.arc(s.x,y,r,0,Math.PI*2); sx.fill();
  });
  sx.globalAlpha=1;
}
window.addEventListener('resize', resizeStars);
resizeStars();
function loop(t) { drawStars(t); requestAnimationFrame(loop); }
requestAnimationFrame(loop);

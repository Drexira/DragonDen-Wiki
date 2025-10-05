const routes = new Map([
    ['home',            'pages/home.html'],
    ['about',           'about/index.html'],
    ['mods',            'mods/index.html'],
    ['euphoria',        'euphoria/index.html'],
    ['weightsraidtimer','weightsraidtimer/index.html'],
    ['thezonemaker',    'thezonemaker/index.html'],
    ['questimmersion',  'questimmersion/index.html']
]);

const GLOBAL_HINTS = [
    "Warming up the den...",
    "Syncing with Euphoria's trader backend...",
    "Verifying quest chains (Therapist → Euphoria)...",
    "Packing LooseLoot crates...",
    "Calibrating Zone Maker gizmos...",
    "Compiling VCQL zones...",
    "Scanning map locations for Quest Immersion...",
    "Sharpening mods & tools...",
    "Optimizing raid timers and stash weights...",
    "Taming search gremlins...",
    "Counting ammo boxes (twice)...",
    "Sealing SICC pouches...",
    "Dusting the hideout workbench...",
    "Negotiating with PMCs at extract...",
    "Despawning rogue scavs from staging...",
    "Polishing Dragon Den optics & sights...",
    "Fetching scrolls from Forge...",
    "Hydrating Neon Signs shaders...",
    "Pinging Lighthouse rogues...",
    "Feeding the dragons...",
    "Praying to Nikita for netcode mercy...",
    "Bartering a LedX for two bolts and a dream...",
    "Insuring that ratty wallet you swear you'll keep...",
    "Wiping blood off the Slick-totally factory new...",
    "Teaching scavs the sacred words: “Hold your fire!”",
    "Assembling a budget Chad kit (oxymoron detected)...",
    "Camping the marked room (for scientific purposes)...",
    "Staring at a Red Rebel like it's affordable...",
    "Injecting SJ6 and regretting life choices...",
    "Rebinding VoIP to 'Apologize to Killa'...",
    "Consulting Therapist: “Can Propital fix desync?”",
    "Turning bush mode ON (invisible +10 charisma)...",
    "Feeding Flea Tax: 35% for 'health'...",
    "Rolling M62s like they're rubles...",
    "Begging Fence for scav karma forgiveness...",
    "Asking Tagilla to chill with the hammer...",
    "Explaining to Sanitar why CMS is not surgery...",
    "Mining Reserve for bitcoin-GPU screams in pain...",
    "Sacrificing a Tetriz to RNGesus...",
    "Extract camping awareness seminar: eyes behind head..."
];

const MIN_LOAD_MS = 450;
let __barTimer = 0, __p = 0;

const content = () => document.getElementById('content');
const delay = (ms) => new Promise(r => setTimeout(r, ms));
const $loader = () => document.getElementById('appLoader');

function setProgress(p){
    __p = Math.max(0, Math.min(100, p|0));
    const bar = document.getElementById('loaderBar');
    if (bar) bar.style.setProperty('--p', __p + '%');
}
function shuffle(arr){
    for (let i = arr.length - 1; i > 0; i--){
        const j = (Math.random() * (i + 1)) | 0;
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}
shuffle([...GLOBAL_HINTS]);

function showFancyLoader(){
    const el = $loader(); if (!el) return;
    el.classList.remove('is-hidden');
    el.classList.add('is-visible');
    el.classList.remove('is-anim');
    void el.offsetWidth;
    el.classList.add('is-anim');
    setProgress(0);
    let target = 92;
    const step = () => {
        if (__p < target) setProgress(__p + Math.max(1, (target - __p) * 0.08));
        __barTimer = requestAnimationFrame(step);
    };
    cancelAnimationFrame(__barTimer);
    __barTimer = requestAnimationFrame(step);
}

function hideFancyLoader(){
    cancelAnimationFrame(__barTimer);
    const done = () => {
        const el = $loader(); if (!el) return;
        el.classList.remove('is-anim','is-visible');
        el.classList.add('is-hidden');
        document.documentElement.classList.remove('preload');
        setProgress(0);
    };
    const runUp = () => { setProgress(100); setTimeout(done, 120); };
    if (__p < 96){
        const accel = setInterval(() => {
            setProgress(__p + 8);
            if (__p >= 98){ clearInterval(accel); runUp(); }
        }, 30);
    } else runUp();
}

function basePath(){
    const parts = location.pathname.split('/').filter(Boolean);
    return '/' + (parts[0] || '');
}
const BASE = basePath();
window.__DD_BASE = BASE;

function toAbs(p){ return `${BASE}/${p.replace(/^\//,'')}`; }

function pageFromPathname(pathname){
    let p = pathname.startsWith(BASE) ? pathname.slice(BASE.length) : pathname;
    if (p.startsWith('/')) p = p.slice(1);
    if (p === '' || p === '/') return 'home';
    p = p.replace(/\/+$/,'');
    return routes.has(p) ? p : 'home';
}
function pathForPage(page){
    return BASE + (page === 'home' ? '/' : '/' + page);
}

function resetScrollTop(){
    const root = content();
    if (root){
        root.scrollTop = 0;
        try { root.scrollTo({ top: 0, left: 0, behavior: 'auto' }); } catch {}
        try { root.focus({ preventScroll: true }); } catch {}
    }
    if (document.scrollingElement) document.scrollingElement.scrollTop = 0;
    try { window.scrollTo({ top: 0, left: 0, behavior: 'auto' }); } catch {}
}

async function load(name){
    const rel = routes.get(name) || routes.get('home');
    const url = toAbs(rel);
    resetScrollTop();
    showFancyLoader();
    try{
        const [res] = await Promise.all([
            fetch(url, { cache:'no-store' }),
            delay(MIN_LOAD_MS)
        ]);
        if (!res.ok) throw new Error('HTTP ' + res.status + ' ' + url);
        const html = await res.text();
        const root = content();
        root.setAttribute('aria-busy','true');
        root.innerHTML = html;
        resetScrollTop();
        if (window.Prism) Prism.highlightAllUnder(root);
        if (name === 'mods'){
            const m = await import('./mods.js');
            await m.initMods();
        }
        window.dispatchEvent(new CustomEvent('route:loaded', { detail:{ page:name } }));
    } catch (e){
        content().innerHTML = '<div class="content-section"><h3>Load error</h3><p>Failed to load this page.</p></div>';
        resetScrollTop();
    } finally {
        content().removeAttribute('aria-busy');
        hideFancyLoader();
    }
}

function applyActive(page){
    document.querySelectorAll('#sidebar li[data-page]').forEach(li => li.classList.toggle('active', li.dataset.page === page));
}

function navigate(page, replace){
    const dest = pathForPage(page);
    if (replace) history.replaceState({page},'',dest);
    else history.pushState({page},'',dest);
    applyActive(page);
    load(page);
}

function onNavClick(e){
    const li = e.target.closest('li[data-page]');
    if (!li) return;
    navigate(li.dataset.page,false);
}

export function startRouter(){
    const root = content();
    if (root && !root.hasAttribute('tabindex')) root.setAttribute('tabindex','-1');
    document.getElementById('menus').addEventListener('click', onNavClick);

    if (location.hash){
        const page = location.hash.slice(1) || 'home';
        history.replaceState({page},'',pathForPage(page));
    }

    window.addEventListener('popstate', () => {
        const page = pageFromPathname(location.pathname);
        applyActive(page);
        load(page);
    });

    const first = pageFromPathname(location.pathname);
    applyActive(first);
    navigate(first,true);
}
window.__DD_NAV = (page) => navigate(page,false);

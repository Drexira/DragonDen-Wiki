const routes = new Map([
    ['home',            'pages/home.html'],
    ['about',           'pages/about/index.html'],
    ['mods',            'pages/mods/index.html'],
    ['euphoria',        'pages/euphoria/index.html'],
    ['neonsigns',       'pages/neonsigns/index.html'],
    ['weightsraidtimer','pages/weightsraidtimer/index.html'],
    ['thezonemaker',    'pages/thezonemaker/index.html'],
    ['questimmersion',  'pages/questimmersion/index.html'],
    ['devtool',        'pages/devtool/index.html'],
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
    "Wiping blood off the Slick, totally factory new...",
    "Teaching scavs the sacred words: “Hold your fire!”",
    "Assembling a budget Chad kit (oxymoron detected)...",
    "Camping the marked room (for science)...",
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
    "Mining Reserve for bitcoin, GPU screams in pain...",
    "Sacrificing a Tetriz to RNGesus...",
    "Extract camping awareness seminar: eyes behind head...",
    "Teaching AI scavs to use indoor voices...",
    "Recalibrating footstep volume to 'panic'...",
    "Printing toilets on Interchange (art installation)...",
    "Negotiating with a bush that just shot me...",
    "Installing extra pockets into your pockets...",
    "Microwaving moonshine for performance gains...",
    "Whispering sweet nothings to the loot pool...",
    "Polishing your dogtag for posthumous glam...",
    "Turning one duct tape into four somehow...",
    "Consulting the Oracle of Jaeger (he grunted)...",
    "Spawning a GPU then losing it to Alt+F4...",
    "Reinforcing your rat license with glitter...",
    "Refactoring spaghetti to linguine code...",
    "Replacing if statements with cope statements...",
    "De-squeaking Killa's Adidas...",
    "Rewiring Shoreline's power to a potato...",
    "Giving Sanitar a Nerf kit for safety...",
    "Teaching Reshala to tip 15% at Dorms...",
    "Hiring Rogues as QA (they shot the bug report)...",
    "Balancing bosses by giving them feelings...",
    "Adding a 'No Bushes' graphics preset...",
    "Applying thermal paste to your legs for speed...",
    "Crossfading gunfire with whale songs...",
    "Deploying decoy PMC that screams 'Friendly!'",
    "Enchanting Slick with 'Attract Bullets +3'...",
    "Repacking rounds alphabetically...",
    "Converting the hideout into an AirBnB...",
    "Taping a flashlight to a flashlight...",
    "Trying to pet a stray grenade...",
    "Haggling with Therapist using dad jokes...",
    "Teaching grenades to ask consent before bouncing...",
    "Installing recoil dampeners on your eyebrows...",
    "Upgrading VoIP to include sighs in Dolby Atmos...",
    "Replacing Interchange lighting with candles...",
    "Bundling painkillers with existential advice...",
    "Adding a 'No Fall Damage' sticker to reality...",
    "Kicking Factory's door until it opens emotionally...",
    "Convincing Gluhar to start a book club...",
    "Wiring customs extract to a mood ring...",
    "Replacing errors with 'skill issue' popups...",
    "Capping frame drops with duct tape...",
    "Porting scavs to turn-based mode...",
    "Infusing loot crates with Schrödinger's GPU...",
    "Upgrading your stash to a black hole...",
    "Teaching bullets basic conflict resolution...",
    "Summoning a friendly cultist (they waved)...",
    "Burying bitcoins for the winter migration...",
    "Jiggle-peeking imposter syndrome...",
    "Rolling back the wipe you dreamed about...",
    "Compressing mods with dragon breath...",
    "Installing RTX on your soul...",
    "Defragging your backpack in Morse code...",
    "Adding a tooltip: 'Don't stand there.'",
    "Sanitizing shoreline water with hope...",
    "Training AI to miss on purpose (you're welcome)...",
    "Converting ricochets to jazz notes...",
    "Aligning scopes with astrology...",
    "Upgrading the flea to farmer's market status...",
    "Teaching pockets to say “I'm full.”",
    "Bundling stash tabs with therapy sessions...",
    "Rebinding 'Alt+F4' to 'Self Care'...",
    "Replacing shoreline fog with vibes...",
    "Awarding +1 charisma for saying 'Howdy' in Labs...",
    "Installing anti-mosquito suppressors on legs...",
    "Introducing sprint cooldown: 'Out of Cope'",
    "Filing insurance claim under 'bear attack'...",
    "Polishing keys so they feel important...",
    "Turning GPU fans into tiny helicopters...",
    "Rewriting AI pathing to 'anywhere but you'...",
    "Adding a ping counter for your emotions...",
    "Cooking lunch on a barrel at Factory...",
    "Teaching flashbangs to use their indoor light...",
    "Putting wheels on the stash (mobile hoarder)...",
    "Adding ambient noise: 'Anxiety Hum v2'",
    "Consulting Jaeger about salad buffs...",
    "Refitting backpacks with clown car tech...",
    "Replacing ricochet sounds with 'boop'",
    "Granting invisibility when you sneeze IRL...",
    "Offloading recoil to your credit score...",
    "Patching shoreline bugs with beach towels...",
    "Rebalancing hatchets with dad strength...",
    "Teaching lasers to draw smiley faces...",
    "Refactoring code that refactors you back...",
    "Deploying loot that screams when picked up...",
    "Syncing extracts to your horoscope...",
    "Reducing desync by asking nicely...",
    "Replacing stamina with spite...",
    "Looting your own dignity (found 0.001 kg)...",
    "Rerolling AI: now with midlife crisis...",
    "Enabling friendly fire for bad vibes...",
    "Installing NVGs with night light mode...",
    "Auto-sorting stash by chaos theory...",
    "Rewriting pathfinding in crayon...",
    "Applying bugfix: 'Bullets are now polite.'",
    "Spawning a GPU inside another GPU (yo dawg)...",
    "Caffeinating scavs, now they jitter-peek...",
    "Attaching suppressors to your feelings...",
    "Rolling a charisma check on Killa's drip...",
    "Filling your mag with compliments...",
    "Giving Rashala a calendar, to stop double booking Dorms...",
    "Tuning footstep audio to 'paranoia major'...",
    "Adding quest: 'Find Peace (0/1)'",
    "Buffing bandages with glitter healing...",
    "Consulting Therapist: diagnosis 'tarkovitis'...",
    "Importing dragons to balance Labs...",
    "Checking if the wipe wiped your memory...",
    "Deploying a cache that caches caches...",
    "Installing ray tracing on shoreline fog (more fog)...",
    "Rebinding 'Push To Talk' to 'Beg For Mercy'...",
    "Enabling loot to loot you back...",
    "Giving PMCs tiny top hats for accuracy +2...",
    "Embedding patch notes into a matryoshka doll...",
    "Teaching backpacks to say 'one more slot, bro'...",
    "Assigning your stash a union rep...",
    "Patching pain sounds with motivational quotes...",
    "Adding achievement: 'Died With Dignity' (secret)...",
    "Rolling back your last bad decision (fail)..."
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

shuffle(GLOBAL_HINTS);
let __hintIdx = 0;
function nextHint(){
    if (!Array.isArray(GLOBAL_HINTS) || GLOBAL_HINTS.length === 0) return '';
    if (__hintIdx >= GLOBAL_HINTS.length){
        shuffle(GLOBAL_HINTS);
        __hintIdx = 0;
    }
    return GLOBAL_HINTS[__hintIdx++];
}

function showFancyLoader(){
    const el = $loader(); if (!el) return;
    el.classList.remove('is-hidden');
    el.classList.add('is-visible');
    el.classList.remove('is-anim');
    void el.offsetWidth;
    el.classList.add('is-anim');

    const msgEl = el.querySelector('.loader__msg');
    if (msgEl) msgEl.textContent = nextHint();

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

function toAbs(p){
    const b = document.querySelector('base')?.href || location.href;
    return new URL(p.replace(/^\//,''), b).toString();
}

function pageFromPathname(pathname){
    let p = pathname.startsWith(BASE) ? pathname.slice(BASE.length) : pathname;
    if (p.startsWith('/')) p = p.slice(1);
    if (p === '' || p === '/') return 'home';
    p = p.replace(/\/+$/,'');
    return routes.has(p) ? p : 'home';
}
function pathForPage(page){
    return BASE + (page === 'home' ? '/' : '/#' + page);
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

function navigate(page){
    if (location.hash.slice(1) !== page) location.hash = '#'+page;
    else { applyActive(page); load(page); }
}

function onNavClick(e){
    const li = e.target.closest('li[data-page]');
    if (!li) return;
    navigate(li.dataset.page,false);
}

export function startRouter(){
    const first = decodeURIComponent(location.hash.slice(1) || 'home');
    applyActive(first);
    load(first);
    window.addEventListener('hashchange', () => {
        const page = decodeURIComponent(location.hash.slice(1) || 'home');
        applyActive(page);
        load(page);
    });
    document.getElementById('menus').addEventListener('click', onNavClick);
}
window.__DD_NAV = (page) => navigate(page);

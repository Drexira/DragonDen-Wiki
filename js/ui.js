const body    = document.body;
const btn     = document.getElementById('sidebarCollapseBtn');
const hotzone = document.getElementById('sidebarHotzone');

const KEY_SIDEBAR    = 'sidebar-collapsed';
const KEY_DYSLEXIC   = 'pref-dyslexic';
const KEY_MENU_STATE = 'dd_menu_state';

const BREAKPOINT_PX  = 900;
let _wasMobile = window.innerWidth <= BREAKPOINT_PX;

function slugify(s){
    return (s || '')
        .toLowerCase()
        .trim()
        .replace(/[\s_/]+/g, '-')
        .replace(/[^a-z0-9-]/g, '')
        .replace(/-+/g, '-');
}
function readMenuState(){
    try { return JSON.parse(localStorage.getItem(KEY_MENU_STATE) || '{}') || {}; }
    catch { return {}; }
}
function writeMenuState(map){
    try { localStorage.setItem(KEY_MENU_STATE, JSON.stringify(map || {})); }
    catch {}
}

function applySidebar(collapsed){
    body.classList.toggle('sidebar-collapsed', collapsed);
    localStorage.setItem(KEY_SIDEBAR, collapsed ? '1' : '0');
    if (btn){
        btn.setAttribute('aria-label', collapsed ? 'Show sidebar' : 'Hide sidebar');
        btn.title = collapsed ? 'Show sidebar' : 'Hide sidebar';
        btn.setAttribute('aria-expanded', String(!collapsed));
        btn.textContent = collapsed ? '→' : '←';
    }
}
function applyDyslexic(on){
    document.documentElement.classList.toggle('dyslexic', !!on);
    localStorage.setItem(KEY_DYSLEXIC, on ? '1' : '0');
    const b = document.getElementById('dyslexicToggle');
    if (b){
        b.setAttribute('aria-pressed', String(!!on));
        b.textContent = `Dyslexic font ${on ? 'On' : 'Off'}`;
        b.title = `Toggle OpenDyslexic Alt+D currently ${on ? 'On' : 'Off'}`;
    }
}

function toggleGroup(group, toggleEl, groupId){
    const willCollapse = !group.classList.contains('is-collapsed');
    group.classList.toggle('is-collapsed', willCollapse);
    if (toggleEl) toggleEl.setAttribute('aria-expanded', String(!willCollapse));

    const map = readMenuState();
    map[groupId] = willCollapse;
    writeMenuState(map);
}
function initCollapsibleMenus(){
    const state = readMenuState();

    document.querySelectorAll('.menu-group').forEach((group, index) => {
        const titleWrap = group.querySelector('.menu-group__title');
        const list = group.querySelector('.menu-group__list');
        if (!titleWrap || !list) return;

        const titleText = (titleWrap.textContent || '').trim();
        const groupId = slugify(titleText) || `group-${index}`;
        const listId = `menu-list-${groupId}`;
        list.id = listId;

        if (!titleWrap.querySelector('.menu-title-text')){
            const span = document.createElement('span');
            span.className = 'menu-title-text';
            span.textContent = titleText;
            titleWrap.textContent = '';
            titleWrap.appendChild(span);
        }

        let toggle = titleWrap.querySelector('button.menu-toggle');
        if (!toggle){
            toggle = document.createElement('button');
            toggle.type = 'button';
            toggle.className = 'menu-toggle';
            toggle.setAttribute('aria-controls', listId);
            titleWrap.appendChild(toggle);
        }
        toggle.setAttribute('data-group-id', groupId);

        const isCollapsed = !!state[groupId];
        group.classList.toggle('is-collapsed', isCollapsed);
        toggle.setAttribute('aria-expanded', String(!isCollapsed));

        titleWrap.addEventListener('click', () => {
            toggleGroup(group, toggle, groupId);
        });
        toggle.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleGroup(group, toggle, groupId);
        });
    });
}

applySidebar(localStorage.getItem(KEY_SIDEBAR) === '1');
applyDyslexic(localStorage.getItem(KEY_DYSLEXIC) === '1');

function handleResponsive(){
    const isMobile = window.innerWidth <= BREAKPOINT_PX;

    if (isMobile && !_wasMobile){
        applySidebar(true);
        body.classList.remove('sidebar-peek');
    } else if (!isMobile && _wasMobile){
        const saved = localStorage.getItem(KEY_SIDEBAR) === '1';
        applySidebar(saved);
        body.classList.remove('sidebar-peek');
    }

    _wasMobile = isMobile;
}
window.addEventListener('resize', handleResponsive);
window.addEventListener('orientationchange', handleResponsive);
handleResponsive();

if (btn){
    btn.addEventListener('click', () => applySidebar(!body.classList.contains('sidebar-collapsed')));
    btn.setAttribute('aria-expanded', String(!body.classList.contains('sidebar-collapsed')));
}

if (hotzone){
    hotzone.addEventListener('mouseenter', () => {
        if (body.classList.contains('sidebar-collapsed')) body.classList.add('sidebar-peek');
    });
    hotzone.addEventListener('mouseleave', () => body.classList.remove('sidebar-peek'));
    hotzone.addEventListener('click', () => {
        applySidebar(false);
        body.classList.remove('sidebar-peek');
    });
}

const brand = document.getElementById('home-title');
if (brand){
    const goHome = () => {
        const target = 'home';
        const content = document.getElementById('content');

        try { window.scrollTo({ top: 0, behavior: 'instant' }); } catch { window.scrollTo(0, 0); }
        if (content){
            try { content.scrollTo({ top: 0, behavior: 'instant' }); } catch { content.scrollTop = 0; }
        }

        const current = (location.hash.slice(1) || 'home');
        if (current === target){
            const restore = () => { location.hash = target; };
            location.hash = '';
            setTimeout(restore, 0);
        } else {
            location.hash = target;
        }
    };

    brand.addEventListener('click', (e) => { e.preventDefault(); goHome(); });
    brand.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' '){
            e.preventDefault();
            goHome();
        }
    });
}

document.addEventListener('click', e => {
    if (e.target && e.target.id === 'dyslexicToggle'){
        const on = !document.documentElement.classList.contains('dyslexic');
        applyDyslexic(on);
    }
});

document.addEventListener('keydown', e => {
    const tag = document.activeElement?.tagName || '';
    if (e.key.toLowerCase() === 's' && !/input|textarea/i.test(tag)){
        e.preventDefault();
        applySidebar(!body.classList.contains('sidebar-collapsed'));
        return;
    }
    if (e.altKey && (e.key === 'd' || e.key === 'D')){
        e.preventDefault();
        const on = !document.documentElement.classList.contains('dyslexic');
        applyDyslexic(on);
    }
});

if (document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', initCollapsibleMenus, { once:true });
} else {
    initCollapsibleMenus();
}

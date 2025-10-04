const input = document.getElementById('search');
const clearBtn = document.getElementById('searchClear');
const results = document.createElement('div');
results.id = 'search-results';
document.querySelector('.search-container')?.append(results);

const BASE = window.__DD_BASE || ('/' + (location.pathname.split('/').filter(Boolean)[0] || ''));
const toAbs = (p) => `${BASE}/${p.replace(/^\//,'')}`;

const PAGES = [
    { id: 'home',            url: toAbs('pages/home.html'),             title: 'Home' },
    { id: 'about',           url: toAbs('about/index.html'),            title: 'About Me' },
    { id: 'mods',            url: toAbs('mods/index.html'),             title: 'Dragon Den Mods' },
    { id: 'euphoria',        url: toAbs('euphoria/index.html'),         title: 'Dragon Den Euphoria' },
    { id: 'weightsraidtimer',url: toAbs('weightsraidtimer/index.html'), title: 'Weights and Raid Timer' },
    { id: 'thezonemaker',    url: toAbs('thezonemaker/index.html'),     title: 'The Zone Maker' },
    { id: 'questimmersion',  url: toAbs('questimmersion/index.html'),   title: 'Quest Immersion' }
];

const INDEX = new Map();
let LAST_TERM = sessionStorage.getItem('dd_last_search') || '';

const norm = s => s.normalize('NFKD').replace(/[\u0300-\u036f]/g,'').replace(/\s+/g,' ').toLowerCase().trim();
function strip(html){
    const d = new DOMParser().parseFromString(html,'text/html');
    d.querySelectorAll('script,style,noscript').forEach(n=>n.remove());
    return d.body.textContent || '';
}
async function buildIndex(){
    await Promise.all(PAGES.map(async p => {
        if (INDEX.has(p.id)) return;
        try{
            const r = await fetch(p.url, { cache:'no-store' });
            if (!r.ok) return;
            const html = await r.text();
            INDEX.set(p.id, norm(strip(html)));
        } catch {}
    }));
}

function clearHighlights(root){
    if (!root) return root;
    const marks = root.querySelectorAll('mark');
    marks.forEach(mark => {
        const parent = mark.parentNode;
        if (!parent) return;
        parent.replaceChild(document.createTextNode(mark.textContent), mark);
    });
    root.normalize();
    return root;
}
function getTextNodes(el){
    const w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, {
        acceptNode: n => {
            const tag = n.parentNode?.tagName || '';
            if (tag === 'PRE') return NodeFilter.FILTER_REJECT;
            if (!n.nodeValue || !n.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
            return NodeFilter.FILTER_ACCEPT;
        }
    });
    const out=[]; while(w.nextNode()) out.push(w.currentNode); return out;
}
function highlight(root, term){
    if (!root || !term) return 0;
    const safe = term.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
    const re = new RegExp(`(${safe})`,'gi');
    let hits = 0;
    for (const node of getTextNodes(root)){
        const parent = node.parentNode; if (!parent) continue;
        let changed = false;
        const html = node.nodeValue.replace(re, m => { hits++; changed = true; return `<mark>${m}</mark>`; });
        if (!changed) continue;
        const span = document.createElement('span'); span.innerHTML = html;
        parent.replaceChild(span, node);
        while (span.firstChild) parent.insertBefore(span.firstChild, span);
        parent.removeChild(span);
    }
    return hits;
}

function getScrollContainer(el){
    let n = el?.parentElement;
    while (n && n !== document.body){
        const s = getComputedStyle(n);
        const oy = s.overflowY;
        if ((oy === 'auto' || oy === 'scroll') && n.scrollHeight > n.clientHeight) return n;
        n = n.parentElement;
    }
    return document.scrollingElement || document.documentElement;
}
function scrollToInContainer(target, container, align = 'center', offset = 8){
    if (!target || !container) return;
    const cRect = container.getBoundingClientRect();
    const tRect = target.getBoundingClientRect();
    const distTop = tRect.top - cRect.top;
    let top;
    if (align === 'start') top = container.scrollTop + distTop - offset;
    else if (align === 'end') top = container.scrollTop + distTop - (container.clientHeight - tRect.height) + offset;
    else top = container.scrollTop + distTop - (container.clientHeight / 2 - tRect.height / 2);
    container.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
}
function scrollFirst(align = 'center'){
    const first = document.getElementById('content')?.querySelector('mark');
    if (!first) return;
    const scroller = getScrollContainer(first) || document.getElementById('content');
    scrollToInContainer(first, scroller, align, 12);
}

function hideResults(){ results.innerHTML=''; results.style.display='none'; }
function showResults(items){
    results.innerHTML=''; results.style.display='block';
    for (const it of items){
        const div = document.createElement('div'); div.className='search-item';
        const title = document.createElement('div'); title.className='search-title'; title.textContent = it.title;
        const snippet = document.createElement('div'); snippet.className='search-snippet'; snippet.textContent = it.snippet;
        div.append(title, snippet);

        div.addEventListener('click', () => {
            LAST_TERM = (input.value || '').trim();
            sessionStorage.setItem('dd_last_search', LAST_TERM);
            sessionStorage.setItem('dd_nav_from', 'search');
            sessionStorage.setItem('dd_nav_target', it.id);
            sessionStorage.setItem('dd_scroll_first', '1');
            if (typeof window.__DD_NAV === 'function') window.__DD_NAV(it.id);
        });

        results.append(div);
    }
}

function snippetsFor(text, t, maxHits=2){
    const out=[]; let i=0;
    while(out.length<maxHits){
        i = text.indexOf(t,i); if (i===-1) break;
        const s = Math.max(0, i-40), e = Math.min(text.length, i+t.length+60);
        out.push(text.slice(s,e).trim()); i += t.length;
    }
    return out;
}
function searchAll(term){
    const t = norm(term); const hits=[];
    for (const p of PAGES){
        const txt = INDEX.get(p.id) || '';
        if (!txt.includes(t)) continue;
        hits.push({ id:p.id, title:p.title, snippet: snippetsFor(txt,t).join(' ... ') });
    }
    return hits.slice(0,8);
}

async function onInput(){
    const term = (input.value || '').trim();
    LAST_TERM = term;
    sessionStorage.setItem('dd_last_search', LAST_TERM);
    const root = document.getElementById('content');
    if (root) clearHighlights(root);
    if (!term){ hideResults(); return; }
    if (!INDEX.size) await buildIndex();
    const items = searchAll(term);
    if (items.length){
        showResults(items);
        highlight(root, term);
    } else {
        hideResults();
    }
}

function onClear(){
    const root = document.getElementById('content');
    if (root) clearHighlights(root);
    input.value = '';
    LAST_TERM = '';
    sessionStorage.removeItem('dd_last_search');
    hideResults();
}

function onRouteLoaded(){
    const from    = sessionStorage.getItem('dd_nav_from');
    const target  = sessionStorage.getItem('dd_nav_target');
    const scroll  = sessionStorage.getItem('dd_scroll_first') === '1';
    const current = new URL(location.href).pathname.split('/').filter(Boolean).pop() || 'home';

    if (from === 'search' && target === current){
        sessionStorage.removeItem('dd_nav_from');
        sessionStorage.removeItem('dd_nav_target');
        sessionStorage.removeItem('dd_scroll_first');
        const term = LAST_TERM || (input.value || '').trim();
        if (!term) return;

        const root = document.getElementById('content');
        if (!root) return;
        clearHighlights(root);
        const n = highlight(root, term);
        if (n > 0 && scroll) requestAnimationFrame(() => scrollFirst('center'));
    } else {
        onClear();
    }
}

if (input) input.addEventListener('input', onInput);
if (clearBtn) clearBtn.addEventListener('click', onClear);
window.addEventListener('route:loaded', onRouteLoaded);

if (LAST_TERM) input.value = LAST_TERM;
buildIndex();

const API_BASE = 'https://forge.sp-tarkov.com/api/v0'
const API_KEY = 'Z3Eh01aWyCHtvfHtZ8qYUDL6NmmHBRc0Kw9G0wAP9af00640'
const OWN_MOD_IDS = [2330,2304,2335,2336]
const HELPED_MOD_IDS = [2308]
const FIELDS = 'id,name,slug,teaser,thumbnail,detail_url,downloads,featured,updated_at'

async function getMods(ids){
    if (!ids?.length) return []
    const qs = new URLSearchParams()
    qs.set('fields', FIELDS)
    qs.set('filter[id]', ids.join(','))
    qs.set('include', 'versions')
    const r = await fetch(`${API_BASE}/mods?${qs.toString()}`, {
        headers: { Authorization: `Bearer ${API_KEY}`, Accept: 'application/json' }
    })
    const body = await r.json().catch(() => null)
    if (!r.ok || !body || !body.success) return []
    return Array.isArray(body.data) ? body.data : []
}

function buildIconCandidates(mod){
    const api = []
    if (mod.thumbnail && mod.thumbnail.trim()){
        try { api.push(new URL(mod.thumbnail, 'https://forge-static.sp-tarkov.com').href) } catch {}
    }
    return api
}

function latestVersionInfo(mod){
    const list = Array.isArray(mod.versions) ? mod.versions
        : (mod.versions && Array.isArray(mod.versions.data)) ? mod.versions.data
            : []
    let best = null
    let bestV = null
    for (const v of list){
        const cand = v.published_at || v.created_at || v.updated_at
        const d = cand ? new Date(cand) : null
        if (d && (!best || d > best)){ best = d; bestV = v.version || null }
    }
    return { date: best || (mod.updated_at ? new Date(mod.updated_at) : null), version: bestV }
}

function pill(text){
    const s = document.createElement('span')
    s.className = 'mod-pill'
    s.textContent = text
    return s
}

function modCard(m){
    const a = document.createElement('a')
    a.className = 'mod-item'
    a.href = m.detail_url || '#'
    a.target = '_blank'
    a.rel = 'noopener'
    a.style.textDecoration = 'none'
    a.style.color = 'inherit'

    const img = document.createElement('img')
    img.alt = m.name || 'Mod'
    img.loading = 'lazy'
    img.decoding = 'async'
    img.width = 100
    img.height = 100
    const candidates = buildIconCandidates(m)
    let i = 0
    const tryNext = () => { if (i < candidates.length){ img.src = candidates[i++] } }
    img.onerror = () => { img.onerror = null; img.onerror = tryNext; tryNext() }
    tryNext()

    const info = document.createElement('div')
    info.className = 'mod-info'
    const h2 = document.createElement('h2')
    h2.textContent = m.name || 'Untitled Mod'
    const p = document.createElement('p')
    p.textContent = m.teaser || ''

    const meta = document.createElement('div')
    meta.className = 'mod-pills'

    if (typeof m.downloads === 'number') meta.append(pill(`${m.downloads.toLocaleString()} downloads`))

    const { date, version } = latestVersionInfo(m)
    if (date) meta.append(pill(`Updated ${date.toLocaleDateString()}`))
    if (version) meta.append(pill(`v${version}`))
    if (m.featured) meta.append(pill('Featured'))

    info.append(h2, p, meta)
    a.append(img, info)
    return a
}

async function loadMods(ids, container, extraClass){
    const mods = await getMods(ids)
    mods.sort((a,b) => ids.indexOf(a.id) - ids.indexOf(b.id))
    for (const m of mods){
        const el = modCard(m)
        if (extraClass) el.classList.add(extraClass)
        container.append(el)
    }
}

export async function initMods(){
    const ownList = document.getElementById('mods-own')
    const helpedList = document.getElementById('mods-helped')
    if (ownList && OWN_MOD_IDS.length) await loadMods(OWN_MOD_IDS, ownList)
    if (helpedList && HELPED_MOD_IDS.length) await loadMods(HELPED_MOD_IDS, helpedList, 'helped')
}

const API_BASE = 'https://forge.sp-tarkov.com/api/v0'
const API_KEY = 'Z3Eh01aWyCHtvfHtZ8qYUDL6NmmHBRc0Kw9G0wAP9af00640'
const OWN_MOD_IDS = [2330,2304,2335]
const HELPED_MOD_IDS = [2308]
const FIELDS = 'id,name,slug,teaser,thumbnail,detail_url,downloads,featured,updated_at'

async function getMods(ids){
    if (!ids?.length) return []
    const qs = new URLSearchParams()
    qs.set('fields', FIELDS)
    qs.set('filter[id]', ids.join(','))
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
    meta.className = 'mod-meta'
    meta.style.opacity = '0.9'
    meta.style.fontSize = '0.92em'
    const bits = []
    if (typeof m.downloads === 'number') bits.push(`${m.downloads.toLocaleString()} downloads`)
    if (m.featured) bits.push('Featured')
    if (m.updated_at) bits.push('Updated ' + new Date(m.updated_at).toLocaleDateString())
    meta.textContent = bits.join(' • ')
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

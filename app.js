// --- 1. VARIABILE GLOBALE ---
const MIN_SHOWS = 2;
const MAX_SHOWS = 4;
let superstars = [];
let brandsConfig = [];
let draggedData = null;
let isDrafting = false;

// Mobile tap-to-select state (replaces drag-and-drop on touch devices)
let selectedSuperstar = null;
let selectedSource = null;
let selectedElement = null;

function isMobileTapMode() {
    return window.matchMedia && window.matchMedia('(max-width: 768px)').matches;
}

function getDraftMobileOverlay() {
    return document.getElementById('draft-mobile-overlay');
}

function showMobileDraftOverlay(html) {
    const overlay = getDraftMobileOverlay();
    if (!overlay) return;
    overlay.innerHTML = '<div class="draft-mobile-overlay-content">' + html + '</div>';
    overlay.hidden = false;
    overlay.classList.remove('fade-out');
}

function hideMobileDraftOverlay(animateMs) {
    const overlay = getDraftMobileOverlay();
    if (!overlay) return;
    if (animateMs) {
        overlay.classList.add('fade-out');
        setTimeout(function () {
            overlay.hidden = true;
            overlay.innerHTML = '';
            overlay.classList.remove('fade-out');
        }, animateMs);
    } else {
        overlay.hidden = true;
        overlay.innerHTML = '';
        overlay.classList.remove('fade-out');
    }
}

function clearSelection() {
    if (selectedElement) {
        selectedElement.classList.remove('tap-selected');
        selectedElement = null;
    }
    selectedSuperstar = null;
    selectedSource = null;
}

function setSelection(superstar, source, element) {
    clearSelection();
    selectedSuperstar = superstar;
    selectedSource = source;
    selectedElement = element;
    if (element) element.classList.add('tap-selected');
}

// --- IN-SITE NOTIFICATIONS & MODAL ---
function showToast(message, type = 'info') {
    const container = document.getElementById('site-notifications');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = 'toast' + (type !== 'info' ? ' toast-' + type : '');
    toast.textContent = message;
    container.appendChild(toast);
    setTimeout(() => { toast.remove(); }, 3500);
}

function showConfirm(options, onConfirm, onCancel) {
    const modal = document.getElementById('site-modal');
    const titleEl = modal.querySelector('.modal-title');
    const messageEl = modal.querySelector('.modal-message');
    const inputEl = document.getElementById('modal-input');
    const okBtn = modal.querySelector('.btn-modal-ok');
    const cancelBtn = modal.querySelector('.btn-modal-cancel');
    inputEl.style.display = 'none';
    titleEl.textContent = options.title || 'Confirm';
    messageEl.textContent = options.message || '';
    okBtn.textContent = options.okLabel || 'OK';
    cancelBtn.style.display = '';
    const hide = () => { modal.hidden = true; };
    okBtn.onclick = () => { hide(); if (onConfirm) onConfirm(); };
    cancelBtn.onclick = () => { hide(); if (onCancel) onCancel(); };
    modal.querySelector('.modal-backdrop').onclick = () => { hide(); if (onCancel) onCancel(); };
    modal.hidden = false;
}

function showPrompt(options, onOk, onCancel) {
    const modal = document.getElementById('site-modal');
    const titleEl = modal.querySelector('.modal-title');
    const messageEl = modal.querySelector('.modal-message');
    const inputEl = document.getElementById('modal-input');
    const okBtn = modal.querySelector('.btn-modal-ok');
    const cancelBtn = modal.querySelector('.btn-modal-cancel');
    inputEl.style.display = '';
    inputEl.placeholder = options.placeholder || '';
    inputEl.value = options.defaultValue || '';
    titleEl.textContent = options.title || 'Input';
    messageEl.textContent = options.message || '';
    okBtn.textContent = options.okLabel || 'OK';
    cancelBtn.style.display = '';
    const hide = () => { modal.hidden = true; };
    okBtn.onclick = () => { hide(); if (onOk) onOk(inputEl.value.trim()); };
    cancelBtn.onclick = () => { hide(); if (onCancel) onCancel(); };
    modal.querySelector('.modal-backdrop').onclick = () => { hide(); if (onCancel) onCancel(); };
    modal.hidden = false;
    inputEl.focus();
}

// --- 2. INITIALIZARE ---
async function initDraftPage() {
    const rosterSelect = document.getElementById('roster-select');
    const brandCountSelect = document.getElementById('brand-count-select');

    // Roster id: from home (sessionStorage) or from page roster dropdown if present
    let initialRoster = 'wwe2k26';
    if (!rosterSelect && typeof sessionStorage !== 'undefined') {
        initialRoster = sessionStorage.getItem('draftRoster') || 'wwe2k26';
    } else if (rosterSelect) {
        initialRoster = rosterSelect.value || 'wwe2k26';
    }

    await loadGameData(initialRoster);

    // Only force brand count when page has the "Number of shows" dropdown (legacy); otherwise use brands from JSON
    if (brandCountSelect) {
        const initialShows = Math.max(MIN_SHOWS, Math.min(MAX_SHOWS, parseInt(brandCountSelect.value, 10) || 3));
        setBrandCount(initialShows);
        brandCountSelect.addEventListener('change', toggleBrandCount);
    }

    const searchInput = document.getElementById("search-input");
    const sexFilter = document.getElementById("filter-sex");
    const tierFilter = document.getElementById("filter-tier");

    if (searchInput) searchInput.addEventListener("input", renderSuperstarList);
    if (sexFilter) sexFilter.addEventListener("change", renderSuperstarList);
    if (tierFilter) tierFilter.addEventListener("change", renderSuperstarList);

    if (rosterSelect) {
        rosterSelect.addEventListener('change', (e) => {
            showConfirm(
                { title: 'Change roster?', message: 'Changing game will reset everything. Continue?' },
                () => loadGameData(e.target.value),
                () => { e.target.value = localStorage.getItem('lastGame') || 'wwe2k26'; }
            );
        });
    }

    setupAllDropZones();

    // Single delegated listener for mobile tap-to-drop (avoids duplicate handlers)
    document.body.addEventListener('click', (e) => {
        if (!isMobileTapMode() || !selectedSuperstar) return;
        const zone = e.target.closest('.brand-col, .roster-pool');
        if (!zone) return;
        if (e.target.closest('.roster-card') || e.target.closest('.draft-list li')) return;
        processDrop(zone, { superstar: selectedSuperstar, source: selectedSource });
        clearSelection();
    });

    const draftPreviewBackdrop = document.getElementById('draft-preview-backdrop');
    const draftPreviewClose = document.getElementById('draft-preview-close');
    const draftPreviewSave = document.getElementById('draft-preview-save');
    if (draftPreviewBackdrop) draftPreviewBackdrop.onclick = closeDraftPreview;
    if (draftPreviewClose) draftPreviewClose.onclick = closeDraftPreview;
    if (draftPreviewSave) draftPreviewSave.onclick = saveDraftResultsFromPreview;
}

function setBrandCount(n) {
    const target = Math.max(MIN_SHOWS, Math.min(MAX_SHOWS, n));
    while (brandsConfig.length < target) addNewBrand(true);
    while (brandsConfig.length > target) {
        if (brandsConfig.length <= MIN_SHOWS) break;
        const brand = brandsConfig[brandsConfig.length - 1];
        const listEl = document.getElementById(`${brand.id}-list`);
        const toReturn = collectSuperstarsFromList(listEl);
        toReturn.forEach(s => {
            if (!superstars.find(x => x.name === s.name)) superstars.push(s);
        });
        superstars.sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }));
        brandsConfig = brandsConfig.filter(b => b.id !== brand.id);
        const el = document.getElementById(brand.id);
        if (el) el.remove();
    }
    if (brandsConfig.length > 0) {
        renderSuperstarList();
        setupAllDropZones();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    initDraftPage().then(() => {
        var rulesModal = document.getElementById('draft-rules-modal');
        var rulesBtn = document.getElementById('draft-rules-btn');
        var rulesClose = document.getElementById('draft-rules-close');
        var rulesBackdrop = document.getElementById('draft-rules-backdrop');
        if (!rulesModal) return;
        function openRulesModal() { rulesModal.hidden = false; }
        function closeRulesModal() {
            rulesModal.hidden = true;
            if (typeof localStorage !== 'undefined') localStorage.setItem('draftRulesSeen', '1');
        }
        if (rulesBtn) rulesBtn.addEventListener('click', openRulesModal);
        if (rulesClose) rulesClose.addEventListener('click', closeRulesModal);
        if (rulesBackdrop) rulesBackdrop.addEventListener('click', closeRulesModal);
        if (typeof localStorage !== 'undefined' && localStorage.getItem('draftRulesSeen') === null) {
            openRulesModal();
        }
    });
});

// --- 3. LOGICA DE ÎNCĂRCARE (JOCURI & BRANDS) ---

// gameId must match a file in data/ e.g. wwe2k25 → data/wwe2k25.json (contains roster + brands)
async function loadGameData(gameId) {
    try {
        const dataPath = `data/${gameId}.json`;
        console.log(`Loading: ${dataPath}`);
        const response = await fetch(dataPath);
        if (!response.ok) throw new Error("JSON not found");

        const data = await response.json();

        // LOGICA DETECTARE FORMAT (VECHI VS NOU)
        if (Array.isArray(data)) {
            superstars = data;
            // Generăm branduri default pentru compatibilitate
            brandsConfig = [
                { id: 'brand-0', name: 'RAW', color: '#ff2400' },
                { id: 'brand-1', name: 'SmackDown', color: '#005ce6' },
                { id: 'brand-2', name: 'NXT', color: '#e6b800' }
            ];
        } else if (data.brands && data.roster) {
            superstars = data.roster;
            brandsConfig = data.brands.map((b, index) => ({
                id: `brand-${index}`, // ID intern unic
                name: b.name,
                color: b.color
            }));
        } else {
            throw new Error("Format invalid JSON");
        }

        superstars.sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }));
        localStorage.setItem('lastGame', gameId);

        renderBrands();
        renderSuperstarList();
        syncBrandCountSelect();
        setDefaultAnimationState(gameId);

    } catch (e) {
        console.error(e);
        showToast("Error loading data. Check console.", "error");
    }
}

// --- 4. RANDARE BRANDURI (DINAMIC) ---

function renderBrands() {
    const container = document.getElementById("brands-area");
    if (!container) return; // Siguranță
    container.innerHTML = "";

    brandsConfig.forEach(brand => {
        createBrandElement(brand, container);
    });

    // Important: Reactivăm zonele de drop pe elementele noi
    setupAllDropZones();
}

function createBrandElement(brand, container) {
    const col = document.createElement("div");
    col.className = "brand-col animate-in";
    col.id = brand.id;
    const index = container.querySelectorAll('.brand-col').length;
    col.style.animationDelay = `${index * 0.08}s`;
    col.style.borderTopColor = brand.color;
    col.style.setProperty('--brand-color', brand.color);
    col.style.boxShadow = `0 -5px 15px ${brand.color}33`;

    col.innerHTML = `
        <div class="brand-header">
            <input type="text" value="${brand.name}" class="brand-title" 
                   onchange="updateBrandName('${brand.id}', this.value)">
            
            <div class="brand-controls">
                <div class="brand-color-wrap">
                    <input type="color" class="brand-color-input" value="${brand.color}" 
                           onchange="updateBrandColor('${brand.id}', this.value)" title="Brand color">
                </div>
                <button class="btn-close-brand" onclick="deleteBrand('${brand.id}')">×</button>
            </div>
        </div>
        
        <button class="btn-draft-auto" onclick="draftForBrand('${brand.id}')">DRAFT</button>
        <div class="draft-picks-banner">DRAFT PICKS</div>
        <ul id="${brand.id}-list" class="draft-list"></ul>
    `;

    container.appendChild(col);
}

// --- 5. RANDARE ROSTER (CU FILTRE, EDIT, DELETE) ---

function renderSuperstarList() {
    const container = document.getElementById("superstar-list");
    const countSpan = document.getElementById("roster-count");
    if (!container) return;
    if (isMobileTapMode()) clearSelection();
    container.innerHTML = "";

    const tierLabels = { "high": "Main Event", "mid": "Mid Card", "low": "Jobber" };

    // 1. Preluăm valorile filtrelor
    const searchText = document.getElementById("search-input") ? document.getElementById("search-input").value.toLowerCase() : "";
    const sexFilter = document.getElementById("filter-sex") ? document.getElementById("filter-sex").value : "all";
    const tierFilter = document.getElementById("filter-tier") ? document.getElementById("filter-tier").value : "all";

    // 2. Filtrăm lista
    let filtered = superstars.filter(s => {
        return s.name.toLowerCase().includes(searchText) &&
               (sexFilter === "all" || s.sex === sexFilter) &&
               (tierFilter === "all" || s.tier === tierFilter);
    });

    // 3. Sortare alfabetică după nume (case-insensitive)
    filtered = filtered.slice().sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }));

    if(countSpan) countSpan.innerText = filtered.length;

    // 4. Generăm cartonașele
    filtered.forEach((s, index) => {
        const card = document.createElement("div");
        card.className = "roster-card animate-in";
        card.style.animationDelay = `${Math.min(index * 0.02, 0.4)}s`;
        card.draggable = true;

        // Bordură colorată după Tier
        let borderCol = "#555";
        if (s.tier === 'mid') borderCol = "#3498db";
        if (s.tier === 'high') borderCol = "#f1c40f";
        card.style.borderLeft = `4px solid ${borderCol}`;

        // --- DRAG START ---
        card.addEventListener('dragstart', (e) => {
            const payload = { superstar: s, source: 'roster' };
            e.dataTransfer.setData("text/plain", JSON.stringify(payload));
            card.style.opacity = "0.5";
        });
        card.addEventListener('dragend', () => { card.style.opacity = "1"; });

        // On mobile: tap to select; on desktop: click opens draft menu
        card.onclick = (e) => {
            if (e.target.closest('.card-actions')) return;
            if (isMobileTapMode()) {
                setSelection(s, 'roster', card);
                return;
            }
            manualDraftMenu(s);
        };

        const sexDisplay = s.sex.charAt(0).toUpperCase() + s.sex.slice(1);
        const tierDisplay = tierLabels[s.tier] || s.tier;

        card.innerHTML = `
            <img src="${s.img}" loading="lazy">
            <div class="card-info">
                <div class="card-name">${s.name}</div>
                <div class="card-meta">${sexDisplay} • <span style="color:${borderCol}">${tierDisplay}</span></div>
            </div>
            
            <div class="card-actions">
                <button class="action-btn edit-btn" 
                        onclick="event.stopPropagation(); toggleTier('${s.name}')" 
                        title="Change Tier">Edit</button>
                <button class="action-btn delete-btn" 
                        onclick="event.stopPropagation(); removeSuperstar('${s.name}')" 
                        title="Remove">X</button>
            </div>
        `;
        container.appendChild(card);
    });
}

// --- 6. LOGICA DRAG & DROP (BULLETPROOF) ---

function setupAllDropZones() {
    const zones = document.querySelectorAll('.brand-col, .roster-pool');

    zones.forEach(zone => {
        zone.ondragover = (e) => {
            e.preventDefault();
            zone.classList.add('drag-over');
        };

        zone.ondragleave = () => {
            zone.classList.remove('drag-over');
        };

        zone.ondrop = (e) => handleDrop(e, zone);
    });
}

function processDrop(zoneElement, payload) {
    if (!payload || !payload.superstar) return;
    const superstar = payload.superstar;
    const source = payload.source;

    const targetId = zoneElement.id || 'roster-pool';
    const isRosterTarget = zoneElement.classList.contains('roster-pool');

    if (isRosterTarget) {
        if (source === 'roster') return;
        const exists = superstars.find(s => s.name === superstar.name);
        if (!exists) {
            superstars.push(superstar);
            superstars.sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }));
            renderSuperstarList();
            removeFromUI(source, superstar.name);
        }
    } else {
        if (targetId === source) return;
        addToBrandList(targetId, superstar);
        if (source === 'roster') {
            superstars = superstars.filter(s => s.name !== superstar.name);
            renderSuperstarList();
        } else {
            removeFromUI(source, superstar.name);
        }
        showDraftedToGraphic(targetId, superstar);
    }
}

function handleDrop(e, zoneElement) {
    e.preventDefault();
    document.querySelectorAll('.drag-over').forEach(el => el.classList.remove('drag-over'));

    const rawData = e.dataTransfer.getData("text/plain");
    if (!rawData) return;

    const data = JSON.parse(rawData);
    processDrop(zoneElement, data);
}

function addToBrandList(brandId, superstar) {
    const list = document.getElementById(`${brandId}-list`);
    if (!list) return;

    const li = document.createElement("li");
    li.className = "animate-in";
    li.draggable = true;
    li.setAttribute("data-superstar-name", superstar.name);
    li.setAttribute("data-superstar", JSON.stringify(superstar));
    li.innerHTML = `<img src="${superstar.img}" class="list-thumb"> <span>${superstar.name}</span>`;

    li.addEventListener('dragstart', (e) => {
        const payload = { superstar: superstar, source: brandId };
        e.dataTransfer.setData("text/plain", JSON.stringify(payload));
    });

    li.addEventListener('click', (e) => {
        if (isMobileTapMode()) {
            e.stopPropagation();
            setSelection(superstar, brandId, li);
        }
    });

    list.appendChild(li);
}

function removeFromUI(brandId, name) {
    const list = document.getElementById(`${brandId}-list`);
    if (!list) return;
    const li = list.querySelector(`li[data-superstar-name="${name.replace(/"/g, '\\"')}"]`);
    if (li) li.remove();
}


// --- 7. FUNCȚII ACTIUNI (ADD, EDIT, DELETE, BRAND MGMT) ---

// Adăugare Manuală (Custom Superstar)
function addCustomSuperstar() {
    const nameInput = document.getElementById("custom-name");
    const imgInput = document.getElementById("custom-img");
    const sexInput = document.getElementById("custom-sex");
    const tierInput = document.getElementById("custom-tier");

    if (!nameInput.value.trim()) {
        showToast("Name is required.", "warning");
        return;
    }

    const newS = {
        name: nameInput.value.trim(),
        img: imgInput.value.trim() || "https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png",
        tier: tierInput.value,
        sex: sexInput.value
    };

    superstars.push(newS);
    superstars.sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }));
    renderSuperstarList();

    nameInput.value = "";
    imgInput.value = "";
    showToast("Superstar added.", "success");
}

// Ștergere Superstar (no confirmation)
function removeSuperstar(name) {
    superstars = superstars.filter(s => s.name !== name);
    renderSuperstarList();
    showToast("Superstar removed.", "success");
}

// Editare Tier (Creionul)
function toggleTier(name) {
    const s = superstars.find(x => x.name === name);
    if(s) {
        if(s.tier === 'high') s.tier = 'mid';
        else if(s.tier === 'mid') s.tier = 'low';
        else s.tier = 'high';
        renderSuperstarList();
    }
}

// Brand Management
function updateBrandName(id, name) {
    const brand = brandsConfig.find(b => b.id === id);
    if(brand) brand.name = name;
}
function updateBrandColor(id, color) {
    const brand = brandsConfig.find(b => b.id === id);
    if(brand) {
        brand.color = color;
        const col = document.getElementById(id);
        if(col) {
            col.style.borderTopColor = color;
            col.style.setProperty('--brand-color', color);
            col.style.boxShadow = `0 -5px 15px ${color}33`;
        }
    }
}
function deleteBrand(id) {
    if (brandsConfig.length <= MIN_SHOWS) {
        showToast(`Minimum ${MIN_SHOWS} shows required.`, "warning");
        return;
    }
    showConfirm(
        { title: "Delete brand?", message: "Remove this show? All drafted superstars on it will go back to the available roster." },
        () => {
            // Return all drafted superstars from this brand to the available roster
            const list = document.getElementById(`${id}-list`);
            if (list) {
                const items = list.querySelectorAll("li[data-superstar]");
                items.forEach((li) => {
                    try {
                        const data = li.getAttribute("data-superstar");
                        if (data) {
                            const superstar = JSON.parse(data);
                            const exists = superstars.find(s => s.name === superstar.name);
                            if (!exists) {
                                superstars.push(superstar);
                            }
                        }
                    } catch (err) { /* ignore */ }
                });
                if (items.length > 0) {
                    superstars.sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: "base" }));
                    renderSuperstarList();
                }
            }
            brandsConfig = brandsConfig.filter(b => b.id !== id);
            const el = document.getElementById(id);
            if (el) el.remove();
            setupAllDropZones();
            syncBrandCountSelect();
            showToast("Brand deleted. Draft picks returned to roster.", "success");
        }
    );
}
function addNewBrand(skipToast) {
    if (brandsConfig.length >= MAX_SHOWS) {
        if (!skipToast) showToast(`Maximum ${MAX_SHOWS} shows allowed.`, "warning");
        return;
    }
    const newId = `brand-${Date.now()}`;
    const newBrand = { id: newId, name: "New Show", color: "#ffffff" };
    brandsConfig.push(newBrand);
    const container = document.getElementById("brands-area");
    createBrandElement(newBrand, container);
    setupAllDropZones();
    syncBrandCountSelect();
    if (!skipToast) showToast("Brand added.", "success");
}

function syncBrandCountSelect() {
    const sel = document.getElementById("brand-count-select");
    if (sel) sel.value = String(Math.min(MAX_SHOWS, Math.max(MIN_SHOWS, brandsConfig.length)));
}

function collectSuperstarsFromList(listEl) {
    const items = [];
    if (!listEl) return items;
    listEl.querySelectorAll('li').forEach(li => {
        const span = li.querySelector('span');
        const img = li.querySelector('img.list-thumb');
        const name = span ? span.textContent.trim() : '';
        const imgSrc = img && img.src ? img.src : '';
        if (name) items.push({ name, img: imgSrc || 'https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png', tier: 'mid', sex: 'man' });
    });
    return items;
}

function toggleBrandCount() {
    const sel = document.getElementById("brand-count-select");
    if (!sel) return;
    const target = parseInt(sel.value, 10) || MIN_SHOWS;
    const n = Math.max(MIN_SHOWS, Math.min(MAX_SHOWS, target));
    if (brandsConfig.length < n) {
        while (brandsConfig.length < n) addNewBrand(true);
    } else if (brandsConfig.length > n) {
        while (brandsConfig.length > n) {
            if (brandsConfig.length <= MIN_SHOWS) break;
            const brand = brandsConfig[brandsConfig.length - 1];
            const listEl = document.getElementById(`${brand.id}-list`);
            const toReturn = collectSuperstarsFromList(listEl);
            toReturn.forEach(s => {
                if (!superstars.find(x => x.name === s.name)) superstars.push(s);
            });
            superstars.sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }));
            brandsConfig = brandsConfig.filter(b => b.id !== brand.id);
            const el = document.getElementById(brand.id);
            if (el) el.remove();
        }
        setupAllDropZones();
        renderSuperstarList();
    }
    sel.value = String(brandsConfig.length);
}

// Draft Manual (Click pe card)
function manualDraftMenu(s) {
    const brandNames = brandsConfig.map(b => b.name).join(", ");
    showPrompt(
        {
            title: "Draft to brand",
            message: `Draft ${s.name} to which brand?`,
            placeholder: brandNames
        },
        (choice) => {
            if (!choice) return;
            const targetBrand = brandsConfig.find(b => b.name.toLowerCase().includes(choice.toLowerCase()));
            if (targetBrand) {
                addToBrandList(targetBrand.id, s);
                superstars = superstars.filter(x => x.name !== s.name);
                renderSuperstarList();
            } else {
                showToast("Brand not found.", "warning");
            }
        }
    );
}

// Reset Draft
function resetDraft() {
    showConfirm(
        { title: "Reset draft?", message: "Reset entire draft? All superstars will return to the available roster." },
        async () => {
            brandsConfig.forEach(b => {
                const list = document.getElementById(`${b.id}-list`);
                if (list) list.innerHTML = "";
            });
            const selector = document.getElementById('roster-select');
            await loadGameData(selector ? selector.value : 'wwe2k26');
            showToast("Draft reset.", "success");
        }
    );
}

function isDraftEmpty() {
    for (const brand of brandsConfig) {
        const list = document.getElementById(`${brand.id}-list`);
        if (list && list.querySelectorAll('li').length > 0) return false;
    }
    return true;
}

// Export Excel
function exportToExcel() {
    if (typeof XLSX === 'undefined') {
        showToast("XLSX library not loaded!", "error");
        return;
    }
    if (isDraftEmpty()) {
        showToast("Cannot export an empty draft. Draft at least one superstar to a brand.", "warning");
        return;
    }

    const wb = XLSX.utils.book_new();
    brandsConfig.forEach(brand => {
        const list = document.getElementById(`${brand.id}-list`);
        if(!list) return;

        const data = [];
        list.querySelectorAll('li span').forEach(span => data.push([span.textContent]));

        if(data.length > 0) {
            const ws = XLSX.utils.aoa_to_sheet([["Superstar Name"], ...data]);
            XLSX.utils.book_append_sheet(wb, ws, brand.name);
        }
    });
    XLSX.writeFile(wb, 'WWE_Draft_Results.xlsx');
}
// --- LOGICA DE AUTO DRAFT (Butonul din Brand) ---

function draftForBrand(brandId) {
    // Dacă rulează deja o animație, ignorăm click-ul!
    if (isDrafting) return;

    const sexFilter = document.getElementById("filter-sex") ? document.getElementById("filter-sex").value : "all";
    const tierFilter = document.getElementById("filter-tier") ? document.getElementById("filter-tier").value : "all";

    const candidates = superstars.filter(s => {
        return (sexFilter === "all" || s.sex === sexFilter) &&
               (tierFilter === "all" || s.tier === tierFilter);
    });

    if (candidates.length === 0) {
        showToast("No superstars available with the current filters!", "warning");
        return;
    }

    const index = Math.floor(Math.random() * candidates.length);
    const selected = candidates[index];

    superstars = superstars.filter(s => s.name !== selected.name);
    renderSuperstarList();

    // Pornim animația și blocăm alte click-uri
    isDrafting = true;
    startDraftAnimation(brandId, selected);
}
function startDraftAnimation(brandId, selected) {
    const animationArea = document.getElementById("animation-area");
    if (!animationArea) return;

    const useMobileOverlay = isMobileTapMode() && getDraftMobileOverlay();
    if (!useMobileOverlay) animationArea.innerHTML = "";

    let count = 0;
    const maxFlash = 15;
    const speed = 80;

    const tempPool = superstars.length > 0 ? superstars : [selected];

    const interval = setInterval(() => {
        const randomS = tempPool[Math.floor(Math.random() * tempPool.length)];
        const frameHtml = `
            <div class="drafting-state">
                <h3>SELECTING...</h3>
                <img src="${randomS.img}">
            </div>
        `;

        if (useMobileOverlay) {
            showMobileDraftOverlay(frameHtml);
        } else {
            animationArea.innerHTML = frameHtml;
        }

        count++;

        if (count > maxFlash) {
            clearInterval(interval);
            finalizeDraft(brandId, selected);
        }
    }, speed);
}

function getDraftedToGraphicHTML(brandId, superstar) {
    const brandConfig = brandsConfig.find(b => b.id === brandId);
    const brandName = brandConfig ? brandConfig.name : "Brand";
    const brandColor = brandConfig ? brandConfig.color : "#fff";
    const tierLabels = { "high": "MAIN EVENT", "mid": "MID CARD", "low": "JOBBER" };
    const tierDisplay = tierLabels[superstar.tier] || (superstar.tier || "mid").toString().toUpperCase();
    const sexDisplay = (superstar.sex || "man").toUpperCase();

    return `
        <div class="tv-graphic-container" style="box-shadow: inset 0 0 50px ${brandColor}30;">
            <div class="tv-graphic-text">
                <div class="tv-drafted-to">DRAFTED TO</div>
                <div class="tv-brand-name" style="color: ${brandColor};">${brandName}</div>
                <div class="tv-superstar-name">${superstar.name}</div>
                <div class="tv-details">
                    <div>CATEGORY: ${sexDisplay}</div>
                    <div>STATUS: ${tierDisplay}</div>
                </div>
            </div>
            <div class="tv-graphic-image">
                <img src="${superstar.img}">
            </div>
        </div>
    `;
}

function showDraftedToGraphic(brandId, superstar) {
    const animationArea = document.getElementById("animation-area");
    if (!animationArea) return;

    const html = getDraftedToGraphicHTML(brandId, superstar);
    if (isMobileTapMode() && getDraftMobileOverlay()) {
        showMobileDraftOverlay(html);
        setTimeout(function () {
            hideMobileDraftOverlay(400);
            setDefaultAnimationState(localStorage.getItem('lastGame') || 'wwe2k26');
        }, 2000);
    } else {
        animationArea.innerHTML = html;
    }
}

function finalizeDraft(brandId, selected) {
    const html = getDraftedToGraphicHTML(brandId, selected);
    const useMobileOverlay = isMobileTapMode() && getDraftMobileOverlay();

    if (useMobileOverlay) {
        showMobileDraftOverlay(html);
        setTimeout(function () {
            hideMobileDraftOverlay(400);
            setDefaultAnimationState(localStorage.getItem('lastGame') || 'wwe2k26');
        }, 2000);
    } else {
        const animationArea = document.getElementById("animation-area");
        if (animationArea) animationArea.innerHTML = html;
    }

    addToBrandList(brandId, selected);
    isDrafting = false;
}
// --- CONFIGURARE GRAFICĂ IDLE (AȘTEPTARE) ---
const gameGraphics = {
    "wwe2k26": "images/draft2k26.png",
    "aew": "images/aew.png",
    "wwe2k25": "images/draft2k25.png",
    "all_time_roster": "logo.png",
    "wwe2k24": "images/draft2k24.png",
    "wwe2k23": "images/draft2k23.jpg",
    "wwe2k22": "images/draft2k22.jpeg",
    "wwe2k20": "images/draft2k20.jpg",
    "wwe2k19": "images/draft2k20.jpg",
    "wwe2k18": "images/draft2k20.jpg"
};

function setDefaultAnimationState(gameId) {
    const animationArea = document.getElementById("animation-area");
    if (!animationArea) return;

    // Caută imaginea în dicționar. Dacă nu o găsește, pune logo-ul default.
    const logoUrl = gameGraphics[gameId] || gameGraphics["default"];

    animationArea.innerHTML = `
        <div class="idle-state">
            <img src="${logoUrl}" alt="${gameId} Draft" class="idle-logo-custom">
        </div>
    `;
}

// --- DRAFT RESULTS: build HTML (shared by preview and export) ---
function getDraftResultsHTML() {
    const gameId = sessionStorage.getItem('draftRoster') || 'wwe2k26';
    const logoUrl = typeof gameGraphics !== 'undefined' && gameGraphics[gameId]
        ? gameGraphics[gameId]
        : "https://static.wikia.nocookie.net/logopedia/images/3/3b/Wwe_draft_2016_logo_by_sarthakgarg-da7ggc4.png";

    let gameTitle = gameId.toUpperCase() + " DRAFT RESULTS";
    if (gameId.startsWith('wwe2k')) gameTitle = "WWE 2K" + gameId.substring(5) + " DRAFT RESULTS";
    if (gameId.startsWith('svr')) gameTitle = "SVR " + gameId.substring(3) + " DRAFT RESULTS";

    const watermarkLogoUrl = "logo.png";

    let htmlContent = `
        <div class="export-header">
            <div class="logo-wrapper">
                <img src="${logoUrl}" class="export-logo" crossorigin="anonymous">
                <div class="export-watermark-inline">
                    <span>Generated on </span>
                    <img src="${watermarkLogoUrl}" class="watermark-logo-img" crossorigin="anonymous">
                    <span>.info</span>
                </div>
            </div>
            <h1 class="export-title">${gameTitle}</h1>
        </div>
        <div class="export-grid">
    `;

    brandsConfig.forEach(brand => {
        const list = document.getElementById(`${brand.id}-list`);
        const items = list ? list.querySelectorAll('li') : [];

        htmlContent += `
            <div class="export-brand-col" style="border-top-color: ${brand.color}">
                <h2 class="export-brand-title" style="color: ${brand.color}">${brand.name}</h2>
                <div class="export-list">
        `;

        items.forEach(li => {
            const imgEl = li.querySelector('img');
            const spanEl = li.querySelector('span');
            const img = imgEl ? imgEl.src : '';
            const name = spanEl ? spanEl.textContent : '';
            htmlContent += `
                <div class="export-item">
                    <img src="${img}" crossorigin="anonymous">
                    <span>${name}</span>
                </div>
            `;
        });

        htmlContent += `
                </div>
            </div>
        `;
    });

    htmlContent += `</div>`;
    return { html: htmlContent, gameId };
}

// --- Finalize Draft: show preview modal, then Save draft results to download image ---
function openDraftPreview() {
    if (typeof html2canvas === 'undefined') {
        showToast("Image library is loading, please try again!", "error");
        return;
    }
    if (isDraftEmpty()) {
        showToast("Cannot finalize an empty draft. Draft at least one superstar to a brand.", "warning");
        return;
    }

    const previewModal = document.getElementById('draft-preview-modal');
    const previewContent = document.getElementById('draft-preview-content');
    if (!previewModal || !previewContent) return;

    const { html, gameId } = getDraftResultsHTML();
    previewContent.innerHTML = html;
    previewModal.hidden = false;
}

function closeDraftPreview() {
    const modal = document.getElementById('draft-preview-modal');
    if (modal) modal.hidden = true;
}

function saveDraftResultsFromPreview() {
    const exportBoard = document.getElementById('draft-export-board');
    if (!exportBoard || typeof html2canvas === 'undefined') return;

    const { html, gameId } = getDraftResultsHTML();
    exportBoard.innerHTML = html;
    closeDraftPreview();

    showToast("Generating draft image...", "info");

    setTimeout(() => {
        html2canvas(exportBoard, {
            backgroundColor: "#050505",
            scale: 2,
            useCORS: true,
            allowTaint: true
        }).then(canvas => {
            const link = document.createElement('a');
            link.download = `${gameId}_draft_results.png`;
            link.href = canvas.toDataURL("image/png");
            link.click();
            showToast("Image saved to your device!", "success");
        }).catch(err => {
            console.error("Error generating image:", err);
            showToast("An error occurred while saving the image.", "error");
        });
    }, 600);
}
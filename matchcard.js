(function () {
    const rosterListEl = document.getElementById('matchcard-roster-list');
    const rosterCountEl = document.getElementById('matchcard-roster-count');
    const searchInput = document.getElementById('matchcard-search');
    const filterSex = document.getElementById('matchcard-filter-sex');
    const filterTier = document.getElementById('matchcard-filter-tier');
    const ppvSelect = document.getElementById('matchcard-ppv');
    const addMatchBtn = document.getElementById('matchcard-add-match');
    const addMatchBtnBottom = document.getElementById('matchcard-add-match-bottom');
    const eventsContainer = document.getElementById('matchcard-events');
    const downloadBtn = document.getElementById('matchcard-download');
    const exportBoard = document.getElementById('matchcard-export-board');
    const previewModal = document.getElementById('matchcard-preview-modal');
    const modalContent = document.getElementById('matchcard-modal-content');
    const modalClose = document.getElementById('matchcard-modal-close');
    const modalSave = document.getElementById('matchcard-modal-save');
    const modalBackdrop = document.getElementById('matchcard-modal-backdrop');
    const notificationsEl = document.getElementById('matchcard-notifications');
    const rosterOverlayEl = document.getElementById('matchcard-roster-overlay');
    const rosterOverlayBodyEl = rosterOverlayEl && rosterOverlayEl.querySelector('.matchcard-roster-overlay-body');
    const rosterOverlayCloseBtn = document.getElementById('matchcard-roster-overlay-close');
    const rosterSidebarContainerEl = rosterListEl ? rosterListEl.parentElement : null;

    function showNotification(message) {
        if (!notificationsEl) return;
        var toast = document.createElement('div');
        toast.className = 'matchcard-toast';
        toast.textContent = message;
        notificationsEl.appendChild(toast);
        setTimeout(function () {
            if (toast.parentNode) toast.parentNode.removeChild(toast);
        }, 3000);
    }

    // --- Edit these in code: PPV background image for each theme ---
    var PPV_IMAGES = {
        default: '',
        raw: 'images/raw2025.jpg',
        smackdown: 'images/smackdown2025.jpg',
        nxt: 'images/nxt2025.jpg',
        dynamite: 'images/dynamite.png',
        collision: 'images/collision.png',
        rampage: 'images/rampage.png',
        oldnxt: 'images/oldnxt.png',
        mainevent: 'images/mainevent.png',
        snme: 'images/snme.png',
        wm41: 'images/wm41.png',
        royalrumble: 'images/royalrumble.jpg',
        summerslam: 'images/summerslam.jpg',
        ss: 'images/ss.png',
        mitb: 'images/mitb.jpg',
        ec: 'images/ec.png',
        backlash: 'images/backlash.png',
        hiac: 'images/hiac.png',
        bb: 'images/bb.png',
        catc: 'images/catc.png',
        cj: 'images/cj.png',
        bib: 'images/bib.png'
    };

    // --- Edit these in code: championship belt image for each title ---
    var CHAMPIONSHIP_IMAGES = {
    none: '',
    undisputed_wwe: 'belts_images/undisputed_wwe.png',
    whc_modern: 'belts_images/whc_modern.png',
    wwe_womens: 'belts_images/wwe_womens.png',
    womens_world: 'belts_images/womens_world.png',
    ic: 'belts_images/ic.png',
    us: 'belts_images/us.png',
    women_ic: 'belts_images/women_ic.png',
    women_us: 'belts_images/women_us.png',
    world_tag: 'belts_images/world_tag.png',
    wwe_tag: 'belts_images/wwe_tag.png',
    womens_tag: 'belts_images/womens_tag.png',
    wwe_champ_black: 'belts_images/wwe_champ_black.png',
    universal1: 'belts_images/universal1.png',
    universal2: 'belts_images/universal2.png',
    raw_womens: 'belts_images/raw_womens.png',
    sd_womens: 'belts_images/sd_womens.png',
    raw_tag: 'belts_images/raw_tag.png',
    sd_tag: 'belts_images/sd_tag.png',
    wwe_spinner: 'belts_images/wwe_spinner.png',
    whc_classic: 'belts_images/whc_classic.png',
    divas: 'belts_images/divas.png',
    tag_copper: 'belts_images/tag_copper.png',
    nxt_champ: 'belts_images/nxt_champ.png',
    nxt_womens: 'belts_images/nxt_womens.png',
    nxt_na: 'belts_images/nxt_na.png',
    nxt_women_na: 'belts_images/nxt_women_na.png',
    nxt_tag: 'belts_images/nxt_tag.png',
    aew_world: 'belts_images/aew_world.png',
    aew_tnt: 'belts_images/aew_tnt.png',
    aew_int: 'belts_images/aew_int.png',
    aew_cont: 'belts_images/aew_cont.png',
    aew_womens_world: 'belts_images/aew_womens_world.png',
    aew_tbs: 'belts_images/aew_tbs.png',
    aew_tag: 'belts_images/aew_tag.png',
    aew_womens_tag: 'belts_images/aew_womens_tag.png',
    aew_trios: 'belts_images/aew_trios.png',
    aew_nat: 'belts_images/aew_nat.png'
};

    var MATCH_FORMAT = {
        '1v1': { slots: 2, layout: 'team', teamSplit: [1, 1], label: '1 vs 1' },
        '2v2': { slots: 4, layout: 'team', teamSplit: [2, 2], label: '2 vs 2 (Tag Team)' },
        triple: { slots: 3, layout: 'freeforall', label: 'Triple Threat' },
        fatal4: { slots: 4, layout: 'freeforall', label: 'Fatal 4-Way' },
        '5way': { slots: 5, layout: 'freeforall', label: '5-Way' },
        '6way': { slots: 6, layout: 'freeforall', label: '6-Way' },
        handicap1on2: { slots: 3, layout: 'team', teamSplit: [1, 2], label: 'Handicap 1 on 2' },
        handicap1on3: { slots: 4, layout: 'team', teamSplit: [1, 3], label: 'Handicap 1 on 3' },
        handicap2on3: { slots: 5, layout: 'team', teamSplit: [2, 3], label: 'Handicap 2 on 3' },
        '3v3': { slots: 6, layout: 'team', teamSplit: [3, 3], label: '3 vs 3 (6-Man Tag)' },
        '4v4': { slots: 8, layout: 'team', teamSplit: [4, 4], label: '4 vs 4 (8-Man Tag)' }
    };
    var STIPULATION_GROUPS = {
        'Standard Matches': [
            { value: 'normal', label: 'Normal Match' },
            { value: 'submission', label: 'Submission Match' },
            { value: 'ironman', label: 'Iron Man Match' },
            { value: '2of3', label: '2 out of 3 Falls' },
            { value: 'lastman', label: 'Last Man Standing' },
            { value: 'iquit', label: 'I Quit Match' },
            { value: 'firstblood', label: 'First Blood' }
        ],
        'No Disqualification': [
            { value: 'noholds', label: 'No Holds Barred' },
            { value: 'extreme', label: 'Extreme Rules' },
            { value: 'fallsanywhere', label: 'Falls Count Anywhere' },
            { value: 'backstage', label: 'Backstage Brawl' }
        ],
        'Weapon-Based Matches': [
            { value: 'tlc', label: 'TLC Match' },
            { value: 'ladder', label: 'Ladder Match' },
            { value: 'tables', label: 'Table Match' },
            { value: 'chairs', label: 'Chairs Match' }
        ],
        'Enclosed Environments': [
            { value: 'steelcage', label: 'Steel Cage Match' },
            { value: 'hellinacell', label: 'Hell in a Cell' },
            { value: 'chamber', label: 'Elimination Chamber' },
            { value: 'wargames', label: 'WarGames' },
            { value: 'fightpit', label: 'Fight Pit' }
        ],
        'Specialty Matches': [
            { value: 'ambulance', label: 'Ambulance Match' },
            { value: 'casket', label: 'Casket Match' },
            { value: 'guestref', label: 'Special Guest Referee' },
            { value: 'buriedalive', label: 'Buried Alive Match' },
            { value: 'inferno', label: 'Inferno Match' },
            { value: 'lumberjack', label: 'Lumberjack Match' },
            { value: 'scramble', label: 'Championship Scramble' },
            { value: 'gauntlet', label: 'Gauntlet Match' }
        ]
    };
    var STIPULATION_OPTIONS = {};
    (function () {
        var g, i, opt;
        for (g in STIPULATION_GROUPS) {
            for (i = 0; i < STIPULATION_GROUPS[g].length; i++) {
                opt = STIPULATION_GROUPS[g][i];
                STIPULATION_OPTIONS[opt.value] = opt.label;
            }
        }
    })();
    const TIER_LABELS = { high: 'Main Event', mid: 'Mid Card', low: 'Jobber' };
    const WATERMARK_LOGO = 'logo.png';
    var roster = [];
    var nextEventId = 1;
    var events = [{ id: 1, matchType: '1v1', championship: 'none', stipulation: 'normal', slots: [null, null] }];

    var selectedSuperstar = null;
    var selectedElement = null;
    var activeSlotForOverlay = null;

    function isMobileTapMode() {
        return window.matchMedia && window.matchMedia('(max-width: 768px)').matches;
    }

    function clearSelection() {
        if (selectedElement) {
            selectedElement.classList.remove('tap-selected');
            selectedElement = null;
        }
        selectedSuperstar = null;
        document.querySelectorAll('.mc-slot-empty.tap-drop-target').forEach(function (el) { el.classList.remove('tap-drop-target'); });
    }

    function setSelection(superstar, element) {
        clearSelection();
        selectedSuperstar = superstar;
        selectedElement = element;
        if (element) element.classList.add('tap-selected');
        if (isMobileTapMode()) {
            document.querySelectorAll('.mc-slot.mc-slot-empty').forEach(function (el) {
                el.classList.add('tap-drop-target');
            });
        }
    }

    function openRosterOverlayForSlot(slotEl) {
        if (!isMobileTapMode()) return;
        if (!rosterListEl || !rosterOverlayEl || !rosterOverlayBodyEl || !rosterSidebarContainerEl) return;

        // Clear any previous highlight
        document.querySelectorAll('.mc-slot-selecting').forEach(function (el) {
            el.classList.remove('mc-slot-selecting');
        });

        activeSlotForOverlay = slotEl || null;
        if (activeSlotForOverlay) {
            activeSlotForOverlay.classList.add('mc-slot-selecting');
        }

        // Move roster list into the overlay body
        if (rosterListEl.parentElement !== rosterOverlayBodyEl) {
            rosterOverlayBodyEl.appendChild(rosterListEl);
        }

        rosterOverlayEl.hidden = false;
        rosterOverlayEl.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    function closeRosterOverlay() {
        if (!rosterListEl || !rosterOverlayEl || !rosterOverlayBodyEl || !rosterSidebarContainerEl) return;

        if (rosterListEl.parentElement === rosterOverlayBodyEl) {
            rosterSidebarContainerEl.appendChild(rosterListEl);
        }

        rosterOverlayEl.hidden = true;
        rosterOverlayEl.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';

        if (activeSlotForOverlay) {
            activeSlotForOverlay.classList.remove('mc-slot-selecting');
        }
        activeSlotForOverlay = null;
    }

    function assignSuperstarFromOverlay(superstar) {
        if (!activeSlotForOverlay || !superstar) return;
        var eid = parseInt(activeSlotForOverlay.dataset.eventId, 10);
        var idx = parseInt(activeSlotForOverlay.dataset.slotIndex, 10);
        if (isNaN(eid) || isNaN(idx)) return;
        setSlot(eid, idx, superstar);
        closeRosterOverlay();
    }

    function getRosterId() {
        return typeof sessionStorage !== 'undefined' ? (sessionStorage.getItem('draftRoster') || 'wwe2k25') : 'wwe2k25';
    }

    function loadRoster() {
        var rosterId = getRosterId();
        fetch('data/' + rosterId + '.json')
            .then(function (r) {
                if (!r.ok) throw new Error('Failed to load roster');
                return r.json();
            })
            .then(function (data) {
                roster = Array.isArray(data.roster) ? data.roster : [];
                roster.sort(function (a, b) { return (a.name || '').localeCompare(b.name || '', undefined, { sensitivity: 'base' }); });
                renderRosterList();
                renderEvents();
            })
            .catch(function () {
                roster = [];
                if (rosterListEl) rosterListEl.innerHTML = '<p class="matchcard-empty-msg">Could not load roster. Select a roster on Home first.</p>';
                if (rosterCountEl) rosterCountEl.textContent = '0';
                renderEvents();
            });
    }

    function getFilteredRoster() {
        var q = (searchInput ? searchInput.value : '').trim().toLowerCase();
        var sex = filterSex ? filterSex.value : 'all';
        var tier = filterTier ? filterTier.value : 'all';
        return roster.filter(function (s) {
            var nameOk = !q || (s.name || '').toLowerCase().includes(q);
            var sexOk = sex === 'all' || (s.sex || 'man') === sex;
            var tierOk = tier === 'all' || (s.tier || 'mid') === tier;
            return nameOk && sexOk && tierOk;
        });
    }

    function renderRosterList() {
        if (!rosterListEl) return;
        if (isMobileTapMode()) clearSelection();
        var list = getFilteredRoster();
        rosterListEl.innerHTML = '';
        if (rosterCountEl) rosterCountEl.textContent = String(list.length);

        var tierColors = { high: '#f1c40f', mid: '#3498db', low: '#555' };
        list.forEach(function (s, index) {
            var card = document.createElement('div');
            card.className = 'roster-card animate-in';
            card.style.animationDelay = (index * 0.03) + 's';
            var tier = s.tier || 'mid';
            card.style.borderLeftColor = tierColors[tier] || tierColors.mid;
            card.draggable = !isMobileTapMode();

            var sexDisplay = (s.sex || 'man').charAt(0).toUpperCase() + (s.sex || 'man').slice(1);
            var tierDisplay = TIER_LABELS[tier] || tier;
            var imgSrc = s.img || 'https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png';

            card.innerHTML =
                '<img src="' + imgSrc + '" alt="" loading="lazy" onerror="this.src=\'https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png\'">' +
                '<div class="card-info">' +
                '<div class="card-name">' + (s.name || '') + '</div>' +
                '<div class="card-meta">' + sexDisplay + ' • <span style="color:' + (tierColors[tier] || tierColors.mid) + '">' + tierDisplay + '</span></div>' +
                '</div>';

            card.addEventListener('dragstart', function (e) {
                e.dataTransfer.setData('text/plain', JSON.stringify(s));
                e.dataTransfer.effectAllowed = 'copy';
                card.style.opacity = '0.5';
            });
            card.addEventListener('dragend', function () { card.style.opacity = '1'; });
            card.addEventListener('click', function (e) {
                if (isMobileTapMode()) {
                    e.preventDefault();
                    e.stopPropagation();
                    if (activeSlotForOverlay) {
                        assignSuperstarFromOverlay(s);
                    }
                }
            });
            rosterListEl.appendChild(card);
        });
    }

    function getFormatConfig(type) {
        var cfg = MATCH_FORMAT[type];
        return cfg || MATCH_FORMAT['1v1'];
    }
    function getSlotCountForType(type) {
        var cfg = getFormatConfig(type);
        return cfg.slots || 2;
    }
    function getLayoutForType(type) {
        var cfg = getFormatConfig(type);
        return { layout: cfg.layout || 'team', teamSplit: cfg.teamSplit || [1, 1] };
    }

    function addMatch() {
        nextEventId += 1;
        var newEv = { id: nextEventId, matchType: '1v1', championship: 'none', stipulation: 'normal', slots: [null, null] };
        events.push(newEv);
        if (!eventsContainer) return;
        var block = document.createElement('div');
        block.className = 'mc-event-block animate-in';
        block.id = 'mc-event-wrap-' + newEv.id;
        block.style.animationDelay = '0s';
        block.innerHTML = getEventBlockHTML(newEv);
        eventsContainer.appendChild(block);
        attachEventBlockListeners(block, newEv);
        renderEventBlock(newEv);
        showNotification('Match added');
    }

    function removeMatch(eventId) {
        events = events.filter(function (e) { return e.id !== eventId; });
        if (events.length === 0) events = [{ id: ++nextEventId, matchType: '1v1', championship: 'none', stipulation: 'normal', slots: [null, null] }];
        renderEvents();
        showNotification('Match removed');
    }

    function changeEventType(eventId, newType) {
        var ev = events.find(function (e) { return e.id === eventId; });
        if (!ev) return;
        ev.matchType = newType;
        var n = getSlotCountForType(newType);
        while (ev.slots.length < n) ev.slots.push(null);
        while (ev.slots.length > n) ev.slots.pop();
        renderEvents();
    }

    function changeEventChampionship(eventId, championshipId) {
        var ev = events.find(function (e) { return e.id === eventId; });
        if (!ev) return;
        ev.championship = championshipId || 'none';
        renderEventBlock(ev);
    }

    function changeEventStipulation(eventId, stipulationId) {
        var ev = events.find(function (e) { return e.id === eventId; });
        if (!ev) return;
        ev.stipulation = stipulationId || 'normal';
        renderEventBlock(ev);
    }

    function setSlot(eventId, slotIndex, superstar) {
        var ev = events.find(function (e) { return e.id === eventId; });
        if (!ev || slotIndex < 0 || slotIndex >= ev.slots.length) return;
        ev.slots[slotIndex] = superstar;
        renderEventBlock(ev);
        showNotification('Added to match');
    }

    function removeFromSlot(eventId, slotIndex) {
        var ev = events.find(function (e) { return e.id === eventId; });
        if (!ev || slotIndex < 0 || slotIndex >= ev.slots.length) return;
        ev.slots[slotIndex] = null;
        renderEventBlock(ev);
        showNotification('Removed from match');
    }

    function renderOneSlot(ev, slotsEl, slotIndex) {
        var slot = document.createElement('div');
        slot.className = 'mc-slot mc-slot-empty';
        slot.dataset.eventId = String(ev.id);
        slot.dataset.slotIndex = String(slotIndex);
        var filled = ev.slots[slotIndex];
        if (filled) {
            slot.classList.remove('mc-slot-empty');
            slot.classList.add('mc-slot-filled');
            slot.innerHTML = '<img src="' + (filled.img || '') + '" alt=""><span class="mc-slot-name">' + (filled.name || '') + '</span>';
            slot.addEventListener('click', function () {
                var eid = parseInt(this.dataset.eventId, 10);
                var idx = parseInt(this.dataset.slotIndex, 10);
                removeFromSlot(eid, idx);
            });
        } else {
            slot.innerHTML = '<span class="mc-slot-label">Drop superstar</span>';
            slot.addEventListener('dragover', function (e) {
                if (isMobileTapMode()) return;
                e.preventDefault();
                e.stopPropagation();
                e.dataTransfer.dropEffect = 'copy';
                this.classList.add('drag-over');
            });
            slot.addEventListener('dragleave', function () {
                this.classList.remove('drag-over');
            });
            slot.addEventListener('drop', function (e) {
                if (isMobileTapMode()) return;
                e.preventDefault();
                e.stopPropagation();
                this.classList.remove('drag-over');
                var eid = parseInt(this.dataset.eventId, 10);
                var idx = parseInt(this.dataset.slotIndex, 10);
                try {
                    var data = JSON.parse(e.dataTransfer.getData('text/plain'));
                    if (data && data.name) setSlot(eid, idx, data);
                } catch (err) {}
            });
            slot.addEventListener('click', function (e) {
                if (isMobileTapMode()) {
                    e.preventDefault();
                    e.stopPropagation();
                    openRosterOverlayForSlot(this);
                }
            });
        }
        slotsEl.appendChild(slot);
    }

    function renderEventBlock(ev) {
        var wrap = document.getElementById('mc-event-wrap-' + ev.id);
        if (!wrap) return;
        var slotsEl = wrap.querySelector('.mc-event-slots');
        if (!slotsEl) return;
        slotsEl.innerHTML = '';

        var championshipDisplay = wrap.querySelector('.mc-event-championship-display');
        if (championshipDisplay) {
            championshipDisplay.innerHTML = '';
            championshipDisplay.classList.remove('mc-championship-visible');
            if (ev.championship && ev.championship !== 'none' && CHAMPIONSHIP_IMAGES[ev.championship]) {
                var beltImg = document.createElement('img');
                beltImg.src = CHAMPIONSHIP_IMAGES[ev.championship];
                beltImg.alt = '';
                beltImg.className = 'mc-belt-preview';
                var label = document.createElement('span');
                label.className = 'mc-belt-label';
                label.textContent = 'Title match';
                championshipDisplay.appendChild(beltImg);
                championshipDisplay.appendChild(label);
                championshipDisplay.classList.add('mc-championship-visible');
            }
        }

        var layout = getLayoutForType(ev.matchType);
        var leftCount = layout.teamSplit ? layout.teamSplit[0] : 0;
        var rightCount = layout.teamSplit ? layout.teamSplit[1] : 0;

        if (layout.layout === 'team' && leftCount > 0 && rightCount > 0) {
            for (var i = 0; i < leftCount; i++) renderOneSlot(ev, slotsEl, i);
            var vsCenter = document.createElement('div');
            vsCenter.className = 'mc-vs';
            vsCenter.textContent = 'VS';
            slotsEl.appendChild(vsCenter);
            for (var k = leftCount; k < ev.slots.length; k++) renderOneSlot(ev, slotsEl, k);
        } else {
            for (var i = 0; i < ev.slots.length; i++) {
                if (i > 0) {
                    var vs = document.createElement('div');
                    vs.className = 'mc-vs';
                    vs.textContent = 'VS';
                    slotsEl.appendChild(vs);
                }
                renderOneSlot(ev, slotsEl, i);
            }
        }
    }

    function getEventBlockHTML(ev) {
        var stipOptions = '';
        var grp, j, opt;
        for (grp in STIPULATION_GROUPS) {
            stipOptions += '<optgroup label="' + grp + '">';
            for (j = 0; j < STIPULATION_GROUPS[grp].length; j++) {
                opt = STIPULATION_GROUPS[grp][j];
                stipOptions += '<option value="' + opt.value + '"' + (ev.stipulation === opt.value ? ' selected' : '') + '>' + opt.label + '</option>';
            }
            stipOptions += '</optgroup>';
        }
        var formatOptions = '';
        var fmtKey;
        for (fmtKey in MATCH_FORMAT) {
            formatOptions += '<option value="' + fmtKey + '"' + (ev.matchType === fmtKey ? ' selected' : '') + '>' + MATCH_FORMAT[fmtKey].label + '</option>';
        }
        return '<div class="mc-event-header">' +
            '<select class="mc-event-type" data-event-id="' + ev.id + '">' + formatOptions + '</select>' +
            '<select class="mc-event-stipulation" data-event-id="' + ev.id + '">' + stipOptions + '</select>' +
            '<select class="mc-event-championship" data-event-id="' + ev.id + '">' +
            '<option value="none"' + (ev.championship === 'none' ? ' selected' : '') + '>Non-Title Match</option>' +
            '<option value="undisputed_wwe"' + (ev.championship === 'undisputed_wwe' ? ' selected' : '') + '>Undisputed WWE Championship</option>' +
            '<option value="whc_modern"' + (ev.championship === 'whc_modern' ? ' selected' : '') + '>World Heavyweight Championship (Modern)</option>' +
            '<option value="wwe_womens"' + (ev.championship === 'wwe_womens' ? ' selected' : '') + '>WWE Women\'s Championship</option>' +
            '<option value="womens_world"' + (ev.championship === 'womens_world' ? ' selected' : '') + '>Women\'s World Championship</option>' +
            '<option value="ic"' + (ev.championship === 'ic' ? ' selected' : '') + '>Intercontinental Championship</option>' +
            '<option value="us"' + (ev.championship === 'us' ? ' selected' : '') + '>United States Championship</option>' +
            '<option value="women_ic"' + (ev.championship === 'women_ic' ? ' selected' : '') + '>Women\'s Intercontinental Championship</option>' +
            '<option value="women_us"' + (ev.championship === 'women_us' ? ' selected' : '') + '>Women\'s United States Championship</option>' +
            '<option value="world_tag"' + (ev.championship === 'world_tag' ? ' selected' : '') + '>World Tag Team Championship</option>' +
            '<option value="wwe_tag"' + (ev.championship === 'wwe_tag' ? ' selected' : '') + '>WWE Tag Team Championship</option>' +
            '<option value="womens_tag"' + (ev.championship === 'womens_tag' ? ' selected' : '') + '>WWE Women\'s Tag Team Championship</option>' +
            '<option value="wwe_champ_black"' + (ev.championship === 'wwe_champ_black' ? ' selected' : '') + '>WWE Championship (Black Strap)</option>' +
            '<option value="universal1"' + (ev.championship === 'universal1' ? ' selected' : '') + '>WWE Universal Championship (Red)</option>' +
            '<option value="universal2"' + (ev.championship === 'universal2' ? ' selected' : '') + '>WWE Universal Championship (Blue)</option>' +
            '<option value="raw_womens"' + (ev.championship === 'raw_womens' ? ' selected' : '') + '>Raw Women\'s Championship</option>' +
            '<option value="sd_womens"' + (ev.championship === 'sd_womens' ? ' selected' : '') + '>SmackDown Women\'s Championship</option>' +
            '<option value="raw_tag"' + (ev.championship === 'raw_tag' ? ' selected' : '') + '>Raw Tag Team Championship</option>' +
            '<option value="sd_tag"' + (ev.championship === 'sd_tag' ? ' selected' : '') + '>SmackDown Tag Team Championship</option>' +
            '<option value="wwe_spinner"' + (ev.championship === 'wwe_spinner' ? ' selected' : '') + '>WWE Championship (Spinner)</option>' +
            '<option value="whc_classic"' + (ev.championship === 'whc_classic' ? ' selected' : '') + '>World Heavyweight Championship (Big Gold)</option>' +
            '<option value="divas"' + (ev.championship === 'divas' ? ' selected' : '') + '>WWE Divas Championship</option>' +
            '<option value="tag_copper"' + (ev.championship === 'tag_copper' ? ' selected' : '') + '>WWE Tag Team Championship (Copper)</option>' +
            '<option value="nxt_champ"' + (ev.championship === 'nxt_champ' ? ' selected' : '') + '>NXT Championship</option>' +
            '<option value="nxt_womens"' + (ev.championship === 'nxt_womens' ? ' selected' : '') + '>NXT Women\'s Championship</option>' +
            '<option value="nxt_na"' + (ev.championship === 'nxt_na' ? ' selected' : '') + '>NXT North American Championship</option>' +
            '<option value="nxt_women_na"' + (ev.championship === 'nxt_women_na' ? ' selected' : '') + '>NXT Women\'s North American Championship</option>' +
            '<option value="nxt_tag"' + (ev.championship === 'nxt_tag' ? ' selected' : '') + '>NXT Tag Team Championship</option>' +
            '<option value="aew_world"' + (ev.championship === 'aew_world' ? ' selected' : '') + '>AEW World Championship</option>' +
            '<option value="aew_tnt"' + (ev.championship === 'aew_tnt' ? ' selected' : '') + '>AEW TNT Championship</option>' +
            '<option value="aew_int"' + (ev.championship === 'aew_int' ? ' selected' : '') + '>AEW International Championship</option>' +
            '<option value="aew_cont"' + (ev.championship === 'aew_cont' ? ' selected' : '') + '>AEW Continental Championship</option>' +
            '<option value="aew_womens_world"' + (ev.championship === 'aew_womens_world' ? ' selected' : '') + '>AEW Women\'s World Championship</option>' +
            '<option value="aew_tbs"' + (ev.championship === 'aew_tbs' ? ' selected' : '') + '>AEW TBS Championship</option>' +
            '<option value="aew_tag"' + (ev.championship === 'aew_tag' ? ' selected' : '') + '>AEW World Tag Team Championship</option>' +
            '<option value="aew_trios"' + (ev.championship === 'aew_trios' ? ' selected' : '') + '>AEW World Trios Championship</option>' +
            '<option value="aew_womens_tag"' + (ev.championship === 'aew_womens_tag' ? ' selected' : '') + '>AEW Women\'s World Tag Team Championship</option>' +
            '<option value="aew_nat"' + (ev.championship === 'aew_nat' ? ' selected' : '') + '>AEW National Championship</option>' +

            '</select>' +
            '<button type="button" class="btn btn-remove-match" data-event-id="' + ev.id + '">Remove match</button>' +
            '</div>' +
            '<div class="mc-event-championship-display" aria-live="polite"></div>' +
            '<div class="mc-event-slots"></div>';
    }

    function attachEventBlockListeners(block, ev) {
        var eventId = ev.id;
        var typeSelect = block.querySelector('.mc-event-type');
        if (typeSelect) {
            typeSelect.addEventListener('change', function () {
                changeEventType(eventId, typeSelect.value);
            });
        }
        var stipSelect = block.querySelector('.mc-event-stipulation');
        if (stipSelect) {
            stipSelect.addEventListener('change', function () {
                changeEventStipulation(eventId, stipSelect.value);
            });
        }
        var champSelect = block.querySelector('.mc-event-championship');
        if (champSelect) {
            champSelect.addEventListener('change', function () {
                changeEventChampionship(eventId, champSelect.value);
                var wrap = document.getElementById('mc-event-wrap-' + eventId);
                var disp = wrap && wrap.querySelector('.mc-event-championship-display');
                if (disp && disp.classList.contains('mc-championship-visible')) {
                    disp.classList.add('mc-belt-animate');
                    setTimeout(function () { disp.classList.remove('mc-belt-animate'); }, 600);
                }
            });
        }
        var rmBtn = block.querySelector('.btn-remove-match');
        if (rmBtn) rmBtn.addEventListener('click', function () { removeMatch(eventId); });
    }

    function renderEvents() {
        if (!eventsContainer) return;
        eventsContainer.innerHTML = '';

        events.forEach(function (ev) {
            var block = document.createElement('div');
            block.className = 'mc-event-block';
            block.id = 'mc-event-wrap-' + ev.id;
            block.innerHTML = getEventBlockHTML(ev);
            eventsContainer.appendChild(block);
            attachEventBlockListeners(block, ev);
            renderEventBlock(ev);
        });
    }

    function getBgImageUrl() {
        var theme = ppvSelect ? ppvSelect.value : 'raw';
        return (PPV_IMAGES[theme] || '').trim() || null;
    }

    var PPV_TITLE_NAMES = { default: 'Wrestling', raw: 'Raw', smackdown: 'SmackDown', nxt: 'NXT', dynamite: 'Dynamite', collision: 'Collision', rampage:'Rampage', oldnxt: 'Old NXT', mainevent: 'Main Event', snme: 'Saturday Night Main Event', wm41: 'Wrestlemania', royalrumble: 'Royal Rumble', summerslam: 'Summerslam', ss: 'Survivor Series', mitb: 'Money In The Bank', ec: 'Elimination Chamber', backlash: 'Backlash', hiac: 'Hell In A Cell', bb: 'Bad Blood', catc: 'Clash At The Castle', cj: 'Crown Jewel', bib: 'Bash In Berlin'};

    function getMatchcardExportHTML() {
        var theme = ppvSelect ? ppvSelect.value : 'raw';
        var themeClass = 'theme-' + theme;
        var bg = getBgImageUrl();
        var ppvTitle = PPV_TITLE_NAMES[theme] || theme;

        var html = '<div class="matchcard-export-preview ' + themeClass + '" style="';
        if (bg) html += 'background-image: linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(\'' + bg.replace(/'/g, "\\'") + '\'); background-size: cover; background-position: center; background-repeat: no-repeat;';
        html += '">';
        html += '<h2 class="matchcard-export-ppv-title">' + ppvTitle + ' Match Card</h2>';

        events.forEach(function (ev) {
            var stipulation = ev.stipulation && STIPULATION_OPTIONS[ev.stipulation] ? STIPULATION_OPTIONS[ev.stipulation] : 'Normal Match';
            var fmtCfg = getFormatConfig(ev.matchType);
            var matchTypeLabel = fmtCfg.label || ev.matchType || '1 vs 1';
            var layout = getLayoutForType(ev.matchType);
            var leftCount = layout.teamSplit ? layout.teamSplit[0] : 0;
            var rightCount = layout.teamSplit ? layout.teamSplit[1] : 0;

            var hasBelt = ev.championship && ev.championship !== 'none' && CHAMPIONSHIP_IMAGES[ev.championship];
            var isTeam = layout.layout === 'team' && leftCount > 0 && rightCount > 0;

            html += '<div class="matchcard-export-match">';
            html += '<div class="mc-export-title-row">';
            if (hasBelt && !isTeam) {
                html += '<img src="' + CHAMPIONSHIP_IMAGES[ev.championship] + '" alt="" class="mc-export-belt" crossorigin="anonymous">';
            }
            html += '<div class="mc-export-match-type">' + matchTypeLabel + '</div>';
            html += '</div>';
            html += '<div class="mc-export-stipulation">' + stipulation + '</div>';
            html += '<div class="matchcard-export-slots">';

            if (isTeam) {
                for (var i = 0; i < leftCount; i++) {
                    var s = ev.slots[i];
                    if (s) {
                        html += '<div class="matchcard-export-slot"><img src="' + (s.img || '') + '" alt="" crossorigin="anonymous"><span>' + (s.name || '') + '</span></div>';
                    } else {
                        html += '<div class="matchcard-export-slot empty"><span>—</span></div>';
                    }
                }
                html += '<div class="mc-export-vs-block">';
                if (hasBelt) {
                    html += '<img src="' + CHAMPIONSHIP_IMAGES[ev.championship] + '" alt="" class="mc-export-belt" crossorigin="anonymous">';
                }
                html += '<span class="mc-vs">VS</span></div>';
                for (var k = leftCount; k < ev.slots.length; k++) {
                    s = ev.slots[k];
                    if (s) {
                        html += '<div class="matchcard-export-slot"><img src="' + (s.img || '') + '" alt="" crossorigin="anonymous"><span>' + (s.name || '') + '</span></div>';
                    } else {
                        html += '<div class="matchcard-export-slot empty"><span>—</span></div>';
                    }
                }
            } else {
                ev.slots.forEach(function (s, i) {
                    if (i > 0) html += '<span class="mc-vs">VS</span>';
                    if (s) {
                        html += '<div class="matchcard-export-slot"><img src="' + (s.img || '') + '" alt="" crossorigin="anonymous"><span>' + (s.name || '') + '</span></div>';
                    } else {
                        html += '<div class="matchcard-export-slot empty"><span>—</span></div>';
                    }
                });
            }
            html += '</div></div>';
        });

        html += '<div class="matchcard-export-watermark">';
        html += '<span>Generated on </span><img src="' + WATERMARK_LOGO + '" alt="" crossorigin="anonymous"><span>.info</span>';
        html += '</div></div>';
        return html;
    }

    function openMatchcardPreview() {
        if (typeof html2canvas === 'undefined') return;
        if (!previewModal || !modalContent) return;
        modalContent.innerHTML = getMatchcardExportHTML();
        previewModal.hidden = false;
    }

    function closeMatchcardPreview() {
        if (previewModal) previewModal.hidden = true;
    }

    function saveMatchcardFromPreview() {
        if (!exportBoard || typeof html2canvas === 'undefined') return;
        exportBoard.innerHTML = getMatchcardExportHTML();
        exportBoard.style.width = '800px';
        var theme = ppvSelect ? ppvSelect.value : 'raw';
        var bg = getBgImageUrl();
        exportBoard.style.background = bg ? 'transparent' : (theme === 'raw' ? '#0f0f0f' : theme === 'smackdown' ? '#0a0f1a' : theme === 'nxt' ? '#1a1a0a' : theme === 'oldnxt' ? '#1a1a0a' : '#0a151a' );
        closeMatchcardPreview();

        html2canvas(exportBoard, {
            backgroundColor: bg ? null : '#0a0a0a',
            scale: 2,
            useCORS: true,
            allowTaint: true
        }).then(function (canvas) {
            var link = document.createElement('a');
            link.download = 'matchcard.png';
            link.href = canvas.toDataURL('image/png');
            link.click();
            showNotification('Match card downloaded');
        }).catch(function (err) {
            console.error(err);
            showNotification('Download failed');
        });
    }

    if (searchInput) searchInput.addEventListener('input', renderRosterList);
    if (filterSex) filterSex.addEventListener('change', renderRosterList);
    if (filterTier) filterTier.addEventListener('change', renderRosterList);
    if (addMatchBtn) addMatchBtn.addEventListener('click', addMatch);
    if (addMatchBtnBottom) addMatchBtnBottom.addEventListener('click', addMatch);

    if (modalBackdrop) modalBackdrop.addEventListener('click', closeMatchcardPreview);
    if (modalClose) modalClose.addEventListener('click', closeMatchcardPreview);
    if (modalSave) modalSave.addEventListener('click', saveMatchcardFromPreview);

    // Roster overlay close handlers (tap outside / X button / ESC)
    if (rosterOverlayCloseBtn) {
        rosterOverlayCloseBtn.addEventListener('click', function () {
            closeRosterOverlay();
        });
    }
    if (rosterOverlayEl) {
        rosterOverlayEl.addEventListener('click', function (e) {
            if (e.target === rosterOverlayEl) {
                // Click on backdrop
                closeRosterOverlay();
            }
        });
    }
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && rosterOverlayEl && !rosterOverlayEl.hidden) {
            closeRosterOverlay();
        }
    });

    if (downloadBtn) {
        downloadBtn.addEventListener('click', function () {
            openMatchcardPreview();
        });
    }

    loadRoster();
})();

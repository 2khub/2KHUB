// === FIREBASE IMPORTS ===
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getDatabase, ref, set, get, update, onValue, onDisconnect, remove } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-database.js";

// === FIREBASE CONFIG (PLACEHOLDER - Replace with your own keys) ===
const firebaseConfig = {
    apiKey: "AIzaSyBRVYIMTjkrUbm4h92lgc3ATMr44W3Od28",
    authDomain: "khub-multiplayer.firebaseapp.com",
    databaseURL: "https://khub-multiplayer-default-rtdb.firebaseio.com",
    projectId: "khub-multiplayer",
    storageBucket: "khub-multiplayer.firebasestorage.app",
    messagingSenderId: "902192680645",
    appId: "1:902192680645:web:37f5870810fdaa4e6caaac",
    measurementId: "G-XWFE0QTK07"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// === GLOBAL VARIABLES ===
let currentTurn = 1;
let currentBrandIndex = 0;
let superstars = [];
let selectedRoster = 'wwe2k26';
let brandsConfig = [
    { id: 'brand-0', name: 'RAW', color: '#e10600' },
    { id: 'brand-1', name: 'SmackDown', color: '#006bb6' }
];

// Firebase room management
let currentRoomCode = null;
let userId = null;
let isHost = false;

const rosterLogos = {
    "wwe2k26": "images/2k26.png",
    "aew": "images/aew-home.png",
    "wwe2k25": "images/2k25.png",
    "wwe2k24": "images/2k24.png",
    "wwe2k23": "images/2k23.png",
    "wwe2k22": "images/2k22.png",
    "wwe2k20": "images/2k20.png",
    "wwe2k19": "images/2k19.png",
    "wwe2k18": "images/2k18.png",
    "all_time_roster": "icon.png"
};

// === NOTIFICATION HELPERS ===
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
    if (!modal) { if (onConfirm) onConfirm(); return; }
    const titleEl = modal.querySelector('.modal-title');
    const messageEl = modal.querySelector('.modal-message');
    const inputEl = document.getElementById('modal-input');
    const okBtn = modal.querySelector('.btn-modal-ok');
    const cancelBtn = modal.querySelector('.btn-modal-cancel');
    if (inputEl) inputEl.style.display = 'none';
    if (titleEl) titleEl.textContent = options.title || 'Confirm';
    if (messageEl) messageEl.textContent = options.message || '';
    if (okBtn) okBtn.textContent = options.okLabel || 'OK';
    if (cancelBtn) cancelBtn.style.display = '';
    const hide = () => { modal.hidden = true; };
    if (okBtn) okBtn.onclick = () => { hide(); if (onConfirm) onConfirm(); };
    if (cancelBtn) cancelBtn.onclick = () => { hide(); if (onCancel) onCancel(); };
    const backdrop = modal.querySelector('.modal-backdrop');
    if (backdrop) backdrop.onclick = () => { hide(); if (onCancel) onCancel(); };
    modal.hidden = false;
}

// === UTILITY FUNCTIONS ===
function getUserId() {
    let id = localStorage.getItem('multiplayerUserId');
    if (!id) {
        id = 'user_' + Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
        localStorage.setItem('multiplayerUserId', id);
    }
    return id;
}

userId = getUserId();

function switchState(stateId) {
    const allStates = document.querySelectorAll('.screen-state');
    allStates.forEach(state => state.classList.remove('active'));
    
    const targetState = document.getElementById(stateId);
    if (targetState) {
        targetState.classList.add('active');
    }
}

function initCustomRosterSelect() {
    const selectSelected = document.getElementById('mp-select-selected-roster');
    const selectItems = document.getElementById('mp-select-items-roster');
    const rosterInput = document.getElementById('mp-roster-select');

    fetch('data/wwe-rosters.json')
        .then(r => r.ok ? r.json() : [])
        .then(list => {
            if (!selectItems || !rosterInput) return;
            selectItems.innerHTML = '';

            if (!list || list.length === 0) {
                list = [{ id: "wwe2k26", name: "WWE 2K26" }];
            }

            list.forEach(item => {
                const logoUrl = rosterLogos[item.id] || rosterLogos["wwe2k26"];
                const optionDiv = document.createElement('div');
                optionDiv.className = 'select-item';
                optionDiv.innerHTML = `<img src="${logoUrl}" class="roster-select-logo" alt=""> <span class="roster-select-name">${item.name}</span>`;
                optionDiv.addEventListener('click', () => {
                    rosterInput.value = item.id;
                    selectSelected.innerHTML = `<img src="${logoUrl}" class="roster-select-logo" alt=""> <span class="roster-select-name">${item.name}</span>`;
                    selectItems.classList.add('select-hide');
                    loadRosterData(item.id);
                });
                selectItems.appendChild(optionDiv);
            });

            if (list.length > 0) {
                const first = list[0];
                const firstLogo = rosterLogos[first.id] || rosterLogos["wwe2k26"];
                rosterInput.value = first.id;
                selectSelected.innerHTML = `<img src="${firstLogo}" class="roster-select-logo" alt=""> <span class="roster-select-name">${first.name}</span>`;
            }
        })
        .catch(() => {
            console.error('Could not load roster list.');
            if (selectSelected) selectSelected.textContent = 'Error loading rosters';
        });

    if (selectSelected) {
        selectSelected.addEventListener('click', (e) => {
            e.stopPropagation();
            selectItems.classList.toggle('select-hide');
        });
    }

    document.addEventListener('click', () => {
        if (selectItems && !selectItems.classList.contains('select-hide')) {
            selectItems.classList.add('select-hide');
        }
    });
}

async function loadRosterData(rosterId) {
    try {
        const dataPath = `data/${rosterId}.json`;
        console.log(`Loading roster: ${dataPath}`);
        const response = await fetch(dataPath);
        if (!response.ok) throw new Error("Roster JSON not found");

        const data = await response.json();

        if (Array.isArray(data)) {
            superstars = data;
        } else if (data.roster) {
            superstars = data.roster;
        } else {
            throw new Error("Invalid roster format");
        }

        superstars.sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }));
        selectedRoster = rosterId;
        renderSuperstarList();
        
    } catch (e) {
        console.error(e);
        showToast("Error loading roster data. Check console.", "error");
    }
}

function renderBrandsBuilder() {
    const container = document.getElementById('mp-brands-builder');
    if (!container) return;
    
    container.innerHTML = '';
    
    brandsConfig.forEach((brand, index) => {
        const brandItem = document.createElement('div');
        brandItem.className = 'mp-brand-item';
        brandItem.innerHTML = `
            <input type="text" class="mp-brand-name-input" value="${brand.name}" 
                   data-brand-id="${brand.id}" placeholder="Brand Name">
            <input type="color" class="mp-brand-color-input" value="${brand.color}" 
                   data-brand-id="${brand.id}" title="Brand Color">
            ${brandsConfig.length > 2 ? `<button class="mp-brand-remove" data-brand-id="${brand.id}">×</button>` : ''}
        `;
        container.appendChild(brandItem);
    });

    container.querySelectorAll('.mp-brand-name-input').forEach(input => {
        input.addEventListener('change', (e) => {
            const brandId = e.target.dataset.brandId;
            const brand = brandsConfig.find(b => b.id === brandId);
            if (brand) brand.name = e.target.value.trim() || brand.name;
        });
    });

    container.querySelectorAll('.mp-brand-color-input').forEach(input => {
        input.addEventListener('change', (e) => {
            const brandId = e.target.dataset.brandId;
            const brand = brandsConfig.find(b => b.id === brandId);
            if (brand) brand.color = e.target.value;
        });
    });

    container.querySelectorAll('.mp-brand-remove').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const brandId = e.target.dataset.brandId;
            brandsConfig = brandsConfig.filter(b => b.id !== brandId);
            renderBrandsBuilder();
        });
    });
}

function addBrand() {
    const newId = `brand-${brandsConfig.length}`;
    brandsConfig.push({
        id: newId,
        name: `Brand ${brandsConfig.length + 1}`,
        color: '#' + Math.floor(Math.random()*16777215).toString(16)
    });
    renderBrandsBuilder();
}

function renderDraftBrands() {
    const container = document.getElementById('mp-brands-area');
    if (!container) return;
    
    container.innerHTML = '';
    
    brandsConfig.forEach(brand => {
        const col = document.createElement('div');
        col.className = 'brand-col';
        col.id = brand.id;
        col.style.borderTopColor = brand.color;
        col.style.setProperty('--brand-color', brand.color);
        col.style.boxShadow = `0 -5px 15px ${brand.color}33`;
        
        col.innerHTML = `
            <div class="brand-header">
                <input type="text" value="${brand.name}" class="brand-title" readonly>
            </div>
            <div class="draft-picks-banner" style="background: ${brand.color};">DRAFT PICKS</div>
            <ul id="${brand.id}-list" class="draft-list"></ul>
        `;
        
        container.appendChild(col);
    });
}

function renderSuperstarList() {
    const container = document.getElementById("superstar-list");
    const countSpan = document.getElementById("roster-count");
    const searchInput = document.getElementById("search-input");
    
    if (!container) return;
    
    container.innerHTML = "";

    const tierLabels = { "high": "Main Event", "mid": "Mid Card", "low": "Jobber" };
    const searchTerm = searchInput ? searchInput.value.toLowerCase().trim() : "";

    let filtered = superstars.slice();
    
    if (searchTerm) {
        filtered = filtered.filter(s => s.name.toLowerCase().includes(searchTerm));
    }

    filtered.sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }));

    if (countSpan) countSpan.textContent = filtered.length;

    filtered.forEach((s, index) => {
        // ... (rest of the card creation logic)
        const card = document.createElement("div");
        card.className = "roster-card";
        // removed animation delay for smoother search feeling, or keep it
        // card.style.animationDelay = `${Math.min(index * 0.02, 0.4)}s`; 

        let borderCol = "#555";
        if (s.tier === 'mid') borderCol = "#3498db";
        if (s.tier === 'high') borderCol = "#f1c40f";
        card.style.borderLeft = `4px solid ${borderCol}`;

        card.onclick = () => handleCardClick(card, s);

        const sexDisplay = s.sex ? (s.sex.charAt(0).toUpperCase() + s.sex.slice(1)) : '';
        const tierDisplay = tierLabels[s.tier] || s.tier || '';

        card.innerHTML = `
            <img src="${s.img}" loading="lazy" alt="${s.name}" onerror="this.style.display='none'">
            <div class="card-info">
                <div class="card-name">${s.name}</div>
                <div class="card-meta">${sexDisplay}${sexDisplay && tierDisplay ? ' • ' : ''}<span style="color:${borderCol}">${tierDisplay}</span></div>
            </div>
        `;
        container.appendChild(card);
    });
}

function renderSuperstarListFromFirebase(rosterData) {
    // Sync local superstars with firebase data for search to work if we use global superstars
    superstars = rosterData; 
    renderSuperstarList();
}

// ...

function playDraftAnimation(superstarName, brandName, brandColor, imgSrc) {
    const box = document.getElementById('animation-area');
    if (!box) return;
    
    // Structure matching style.css .tv-graphic-container
    box.innerHTML = `
        <div class="tv-graphic-container">
            <div class="tv-graphic-text">
                <span class="tv-drafted-to">DRAFTED TO</span>
                <h2 class="tv-brand-name" style="color: ${brandColor}">${brandName}</h2>
                <h3 class="tv-superstar-name">${superstarName}</h3>
            </div>
            <div class="tv-graphic-image">
                <img src="${imgSrc || 'images/placeholder.png'}" alt="${superstarName}" onerror="this.style.display='none'">
            </div>
        </div>
    `;
    
    // Ensure box is visible
    box.style.display = 'block';
    box.classList.add('show');
    
    // Hide after 2.5 seconds
    setTimeout(() => {
        box.style.display = 'none';
        box.classList.remove('show');
        box.innerHTML = ''; // Clear it out to keep DOM clean
    }, 2500);
}

function addToDraftedList(superstarName, imgSrc, brandId) {
    const list = document.getElementById(`${brandId}-list`);
    if (!list) return;
    
    const li = document.createElement('li');
    li.className = 'animate-in';
    
    const thumb = document.createElement('img');
    thumb.className = 'list-thumb';
    thumb.src = imgSrc || 'images/placeholder.png';
    thumb.alt = superstarName;
    thumb.onerror = function() { this.style.display = 'none'; };
    
    const nameSpan = document.createElement('span');
    nameSpan.textContent = superstarName;
    
    li.appendChild(thumb);
    li.appendChild(nameSpan);
    list.appendChild(li);
    
    const brand = brandsConfig.find(b => b.id === brandId);
    if (brand) {
        if (!brand.picks) brand.picks = [];
        brand.picks.push({ name: superstarName, img: imgSrc });
    }
    
    updateRosterCount();
}

function updateRosterCount() {
    const rosterCount = document.getElementById('roster-count');
    if (!rosterCount) return;
    const remainingCards = document.querySelectorAll('.roster-card:not(.drafted)').length;
    rosterCount.textContent = remainingCards;
}

function simulateTurnChange() {
    const cardsGrid = document.getElementById('superstar-list');
    cardsGrid.classList.add('disabled-turn');
    
    setTimeout(() => {
        currentTurn++;
        currentBrandIndex = (currentBrandIndex + 1) % brandsConfig.length;
        updateTurnBanner();
        cardsGrid.classList.remove('disabled-turn');
    }, 2500);
}

async function handleCardClick(card, superstar) {
    if (card.classList.contains('drafted')) {
        return;
    }
    
    if (!currentRoomCode) {
        return;
    }
    
    const roomRef = ref(db, `rooms/${currentRoomCode}`);
    const snapshot = await get(roomRef);
    const roomData = snapshot.val();
    
    if (!roomData || roomData.currentTurn !== userId) {
        return;
    }
    
    card.classList.add('drafted');
    
    const myPlayerData = roomData.players[userId];
    if (!myPlayerData) return;
    
    const brandId = myPlayerData.brandId || userId;
    const brandConfig = brandsConfig.find(b => b.id === brandId);
    const brandName = brandConfig ? brandConfig.name : myPlayerData.brandName;
    const brandColor = brandConfig ? brandConfig.color : myPlayerData.brandColor;
    
    playDraftAnimation(superstar.name, brandName, brandColor, superstar.img);
    addToDraftedList(superstar.name, superstar.img, brandId);
    
    const updatedDraftedSuperstars = [...(myPlayerData.draftedSuperstars || []), { name: superstar.name, img: superstar.img }];
    const updatedAvailableRoster = (roomData.availableRoster || []).filter(s => s.name !== superstar.name);
    
    const playerIds = Object.keys(roomData.players);
    const currentIndex = playerIds.indexOf(userId);
    const nextIndex = (currentIndex + 1) % playerIds.length;
    const nextTurn = playerIds[nextIndex];
    
    await update(roomRef, {
        [`players/${userId}/draftedSuperstars`]: updatedDraftedSuperstars,
        availableRoster: updatedAvailableRoster,
        currentTurn: nextTurn
    });
}

function hostRoom() {
    isHost = true;
    const selectContainer = document.getElementById('host-roster-select-container');
    if (selectContainer) selectContainer.style.display = 'block';
    switchState('state-brand-setup');
}

function joinRoom(code) {
    if (!code || code.length !== 5) {
        showToast('Please enter a valid 5-character code.', 'warning');
        return;
    }
    currentRoomCode = code.toUpperCase();
    isHost = false;
    
    const selectContainer = document.getElementById('host-roster-select-container');
    if (selectContainer) selectContainer.style.display = 'none';
    
    // Verify room exists before letting them setup brand
    const roomRef = ref(db, `rooms/${currentRoomCode}`);
    get(roomRef).then((snapshot) => {
        if (snapshot.exists()) {
            switchState('state-brand-setup');
        } else {
            showToast('Room not found. Please check the code.', 'error');
            currentRoomCode = null;
        }
    }).catch(err => {
        console.error(err);
        showToast('Error connecting to room.', 'error');
        currentRoomCode = null;
    });
}

async function createRoomInFirebase(brandName, brandColor) {
    const code = Math.random().toString(36).substring(2, 7).toUpperCase();
    currentRoomCode = code;
    
    // Get selected roster
    const rosterSelect = document.getElementById('mp-roster-select');
    const selectedRosterVal = rosterSelect ? rosterSelect.value : 'wwe2k26';
    
    const roomRef = ref(db, `rooms/${code}`);
    
    const playerData = {
        id: userId,
        brandName: brandName,
        brandColor: brandColor,
        isHost: true,
        draftedSuperstars: []
    };

    const initialData = {
        code: code,
        status: 'lobby',
        created: Date.now(),
        hostId: userId,
        selectedRoster: selectedRosterVal,
        players: {
            [userId]: playerData
        },
        currentTurn: userId,
        availableRoster: []
    };
    
    await set(roomRef, initialData);
    onDisconnect(roomRef).remove();
    listenToRoom(code);
    
    const roomCodeEl = document.getElementById('room-code');
    if (roomCodeEl) roomCodeEl.textContent = code;
    
    switchState('state-lobby');
}

function listenToRoom(code) {
    const roomRef = ref(db, `rooms/${code}`);
    
    onValue(roomRef, (snapshot) => {
        const data = snapshot.val();
        if (!data) {
            currentRoomCode = null;
            isHost = false;
            showToast('The Host has left or the room was closed.', 'warning');
            switchState('state-start');
            return;
        }

        // Handle Players Update
        if (data.players) {
            updateLobbyPlayers(data.players);
        }
        
        // Handle Status Change
        const currentStateId = document.querySelector('.screen-state.active')?.id;
        
        if (data.status === 'drafting') {
            if (currentStateId !== 'state-draft') {
                switchState('state-draft');
                if (data.brandsConfig) {
                    brandsConfig = data.brandsConfig;
                    renderDraftBrands();
                }
            }
            
            // ALWAYS update available roster if provided
            if (data.availableRoster) {
                renderSuperstarListFromFirebase(data.availableRoster);
                updateRosterCount();
            }
            
            // ALWAYS sync picks (clearing lists first to avoid duplicates)
            if (data.players && brandsConfig) {
                brandsConfig.forEach(b => {
                    const list = document.getElementById(`${b.id}-list`);
                    if (list) list.innerHTML = '';
                });
                
                Object.values(data.players).forEach(p => {
                    if (p.draftedSuperstars) {
                        p.draftedSuperstars.forEach(s => {
                            addToDraftedList(s.name, s.img, p.brandId || p.id, true);
                        });
                    }
                });
            }
            
        } else if (data.status === 'finished' && currentStateId !== 'state-end') {
            if (data.selectedRoster) selectedRoster = data.selectedRoster;
            switchState('state-end');
            if (data.players) renderEndScreen(data.players);
        }
        
        // Handle Turn Change
        if (data.currentTurn) {
            const isMyTurn = data.currentTurn === userId;
            const turnBanner = document.getElementById('turn-banner');
            if (turnBanner) {
                if (isMyTurn) {
                    turnBanner.textContent = "YOUR PICK!";
                    turnBanner.style.background = "rgba(46, 204, 113, 0.9)";
                } else {
                    const currentPlayer = data.players ? data.players[data.currentTurn] : null;
                    const name = currentPlayer ? currentPlayer.brandName : 'Opponent';
                    turnBanner.textContent = `${name}'s PICK`;
                    turnBanner.style.background = "rgba(15,15,20,0.95)";
                }
            }
            
            const grid = document.getElementById('superstar-list');
            if (grid) {
                if (isMyTurn) grid.classList.remove('disabled-turn');
                else grid.classList.add('disabled-turn');
            }
        }
    });
}

function updateLobbyPlayers(players) {
    const list = document.getElementById('player-list');
    if (!list) return;
    list.innerHTML = '';
    
    Object.values(players).forEach(p => {
        const li = document.createElement('li');
        li.className = 'mp-player-item';
        if (p.isHost) li.classList.add('mp-host');
        li.textContent = `${p.brandName}${p.isHost ? ' (Host)' : ''}`;
        li.style.borderLeft = `4px solid ${p.brandColor}`;
        list.appendChild(li);
    });
}

function updateTurnBanner() {
    const banner = document.getElementById('turn-banner');
    if (banner) banner.textContent = "Waiting for game to start...";
}

const gameGraphics = {
    "wwe2k26": "images/draft2k26.png",
    "aew": "images/aew.png",
    "wwe2k25": "images/draft2k25.png",
    "wwe2k24": "images/draft2k24.png",
    "wwe2k23": "images/draft2k23.png",
    "wwe2k22": "images/draft2k22.png",
    "wwe2k20": "images/draft2k20.png",
    "wwe2k19": "images/draft2k19.png",
    "wwe2k18": "images/draft2k18.png",
    "all_time_roster": "icon.png"
};

// === EXPORT FUNCTIONS ===

function getDraftResultsHTML(players) {
    const gameId = selectedRoster || 'wwe2k26';
    const logoUrl = gameGraphics[gameId] || gameGraphics["wwe2k26"];
    
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
    
    Object.values(players).forEach(player => {
        htmlContent += `
            <div class="export-brand-col" style="border-top-color: ${player.brandColor}">
                <h2 class="export-brand-title" style="color: ${player.brandColor}">${player.brandName}</h2>
                <div class="export-list">
        `;
        
        if (player.draftedSuperstars) {
            player.draftedSuperstars.forEach(s => {
                htmlContent += `
                    <div class="export-item">
                        <img src="${s.img}" crossorigin="anonymous" onerror="this.style.display='none'">
                        <span>${s.name}</span>
                    </div>
                `;
            });
        }
        
        htmlContent += `</div></div>`;
    });
    
    htmlContent += `</div>`;
    return htmlContent;
}

function downloadDraftImage() {
    if (typeof html2canvas === 'undefined') {
        showToast('Image library not loaded!', 'error');
        return;
    }
    if (!currentRoomPlayers) return;
    
    const gameId = selectedRoster || 'wwe2k26';
    
    const exportBoard = document.createElement('div');
    exportBoard.style.cssText = 'position:absolute;left:-9999px;top:-9999px;width:1400px;background:#0a0a0a;padding:50px;box-sizing:border-box;';
    exportBoard.innerHTML = getDraftResultsHTML(currentRoomPlayers);
    document.body.appendChild(exportBoard);
    
    setTimeout(() => {
        html2canvas(exportBoard, {
            useCORS: true,
            allowTaint: true,
            backgroundColor: '#050505',
            scale: 2
        }).then(canvas => {
            const link = document.createElement('a');
            link.download = `${gameId}_multiplayer_draft.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
            document.body.removeChild(exportBoard);
        }).catch(err => {
            console.error(err);
            showToast('Error generating image.', 'error');
            document.body.removeChild(exportBoard);
        });
    }, 600);
}

function exportToExcel() {
    if (typeof XLSX === 'undefined') {
        showToast("XLSX library not loaded!", "error");
        return;
    }
    if (!currentRoomPlayers) return;
    
    const wb = XLSX.utils.book_new();
    
    Object.values(currentRoomPlayers).forEach(player => {
        const data = [];
        if (player.draftedSuperstars) {
            player.draftedSuperstars.forEach(s => data.push([s.name]));
        }
        
        if (data.length > 0) {
            const ws = XLSX.utils.aoa_to_sheet([["Superstar Name"], ...data]);
            XLSX.utils.book_append_sheet(wb, ws, player.brandName);
        }
    });
    
    XLSX.writeFile(wb, 'Multiplayer_Draft_Results.xlsx');
}

let currentRoomPlayers = {};

function renderEndScreen(players) {
    currentRoomPlayers = players;
    
    const container = document.getElementById('mp-final-rosters');
    if (!container) return;
    container.innerHTML = '';
    
    // Export buttons
    const actionsDiv = document.createElement('div');
    actionsDiv.className = 'draft-preview-actions';
    actionsDiv.style.cssText = 'display:flex; gap:14px; justify-content:center; margin-top:40px; margin-bottom:24px;';
    
    const btnImg = document.createElement('button');
    btnImg.className = 'export-action-btn eab-download';
    btnImg.textContent = 'DOWNLOAD IMAGE';
    btnImg.onclick = downloadDraftImage;
    
    const btnXls = document.createElement('button');
    btnXls.className = 'export-action-btn eab-excel';
    btnXls.textContent = 'EXPORT EXCEL';
    btnXls.onclick = exportToExcel;
    
    actionsDiv.appendChild(btnImg);
    actionsDiv.appendChild(btnXls);
    container.appendChild(actionsDiv);
    
    // Styled photo preview (same look as singleplayer export)
    const previewDiv = document.createElement('div');
    previewDiv.className = 'draft-preview-content';
    previewDiv.id = 'mp-draft-preview';
    previewDiv.innerHTML = getDraftResultsHTML(players);
    container.appendChild(previewDiv);
}

async function joinRoomInFirebase(brandName, brandColor) {
    if (!currentRoomCode) return;
    
    const roomRef = ref(db, `rooms/${currentRoomCode}`);
    const snapshot = await get(roomRef);
    if (!snapshot.exists()) {
        showToast('Room no longer exists.', 'error');
        currentRoomCode = null;
        switchState('state-start');
        return;
    }
    
    const roomData = snapshot.val();
    const currentPlayerCount = roomData.players ? Object.keys(roomData.players).length : 0;
    if (currentPlayerCount >= 4) {
        showToast('This room is full (maximum 4 players).', 'error');
        currentRoomCode = null;
        switchState('state-start');
        return;
    }

    const playerData = {
        id: userId,
        brandName: brandName,
        brandColor: brandColor,
        isHost: false,
        draftedSuperstars: []
    };
    
    await update(ref(db, `rooms/${currentRoomCode}/players/${userId}`), playerData);
    onDisconnect(ref(db, `rooms/${currentRoomCode}/players/${userId}`)).remove();
    listenToRoom(currentRoomCode);
    switchState('state-lobby');
    
    const roomCodeEl = document.getElementById('room-code');
    if (roomCodeEl) roomCodeEl.textContent = currentRoomCode;
}

function leaveRoom() {
    if (currentRoomCode) {
        if (isHost) {
            remove(ref(db, `rooms/${currentRoomCode}`)).catch(err => console.error(err));
        } else {
            remove(ref(db, `rooms/${currentRoomCode}/players/${userId}`)).catch(err => console.error(err));
        }
    }
    window.location.reload();
}

document.addEventListener('DOMContentLoaded', async () => {
    
    // Initial load, though btn-start-draft will override if host
    await loadRosterData('wwe2k26');
    
    const btnHost = document.getElementById('btn-host');
    if (btnHost) {
        btnHost.addEventListener('click', () => {
            hostRoom();
        });
    }
    
    const btnJoin = document.getElementById('btn-join');
    if (btnJoin) {
        btnJoin.addEventListener('click', () => {
            const code = document.getElementById('join-code-input').value.trim();
            joinRoom(code);
        });
    }
    
    // Brand setup screen - Enter Lobby button
    const btnEnterLobby = document.getElementById('btn-enter-lobby');
    if (btnEnterLobby) {
        btnEnterLobby.addEventListener('click', async () => {
            const brandName = document.getElementById('setup-brand-name').value.trim();
            const brandColor = document.getElementById('setup-brand-color').value;
            
            if (!brandName) {
                showToast('Please enter a brand name.', 'warning');
                return;
            }
            
            if (isHost) {
                await createRoomInFirebase(brandName, brandColor);
            } else {
                await joinRoomInFirebase(brandName, brandColor);
            }
        });
    }
    
    // Update color preview text when color picker changes
    const colorPicker = document.getElementById('setup-brand-color');
    const colorPreview = document.getElementById('color-preview-text');
    if (colorPicker && colorPreview) {
        colorPicker.addEventListener('input', (e) => {
            colorPreview.textContent = e.target.value;
        });
    }
    
    const btnAddBrand = document.getElementById('btn-add-brand');
    if (btnAddBrand) {
        btnAddBrand.addEventListener('click', addBrand);
    }
    
    const btnStartDraft = document.getElementById('btn-start-draft');
    if (btnStartDraft) {
        btnStartDraft.addEventListener('click', async () => {
            if (!isHost) {
                showToast('Only the host can start the draft.', 'warning');
                return;
            }
            
            if (!currentRoomCode) {
                showToast('Not connected to a room.', 'error');
                return;
            }
            
            // Get current room data
            const roomRef = ref(db, `rooms/${currentRoomCode}`);
            const snapshot = await get(roomRef);
            const roomData = snapshot.val();
            
            const playerCount = roomData.players ? Object.keys(roomData.players).length : 0;
            if (playerCount < 2) {
                showToast('At least 2 players are required to start the draft.', 'warning');
                return;
            }

            // Use selected roster from lobby creation
            const selectedRosterValue = roomData.selectedRoster || 'wwe2k26';
            await loadRosterData(selectedRosterValue);
            
            // Construct brandsConfig from players (each player is a brand)
            const newBrandsConfig = [];
            const updatedPlayers = { ...roomData.players };
            
            Object.entries(updatedPlayers).forEach(([pid, pData]) => {
                newBrandsConfig.push({
                    id: pid, // Use playerId as brandId
                    name: pData.brandName,
                    color: pData.brandColor,
                    picks: []
                });
                
                // Ensure brandId is set on player
                updatedPlayers[pid].brandId = pid;
                // Initialize drafted superstars array if needed
                if (!updatedPlayers[pid].draftedSuperstars) {
                    updatedPlayers[pid].draftedSuperstars = [];
                }
            });
            
            // Update room with drafting status, roster, brands, and player assignments
            await update(roomRef, {
                status: 'drafting',
                selectedRoster: selectedRosterValue,
                brandsConfig: newBrandsConfig,
                availableRoster: superstars,
                currentTurn: userId,
                players: updatedPlayers
            });
            
            // No local state switch here, listenToRoom handles it
        });
    }
    
    const btnLeaveRoom = document.getElementById('btn-leave-room');
    if (btnLeaveRoom) {
        btnLeaveRoom.addEventListener('click', () => {
            showConfirm(
                { title: 'Leave Room', message: 'Are you sure you want to leave the room?', okLabel: 'Leave' },
                leaveRoom
            );
        });
    }
    
    const btnSimulateEnd = document.getElementById('btn-simulate-end');
    if (btnSimulateEnd) {
        btnSimulateEnd.addEventListener('click', async () => {
            if (!isHost) return;
            const roomRef = ref(db, `rooms/${currentRoomCode}`);
            await update(roomRef, { status: 'finished' });
        });
    }
    
    const btnBackLobby = document.getElementById('btn-back-lobby');
    if (btnBackLobby) {
        btnBackLobby.addEventListener('click', () => {
            // Simple reload to reset state
            window.location.reload();
        });
    }
    
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', () => {
            renderSuperstarList();
        });
    }
    
    initCustomRosterSelect();
    updateTurnBanner();
    updateRosterCount();
});

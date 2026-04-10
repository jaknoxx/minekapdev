// ========================================
// MAIN APPLICATION
// ========================================

let players = [];
let filteredPlayers = [];
let currentKit = 'overall';
let currentSort = 'points';
let currentSortDir = 'desc';
let searchTerm = '';
let selectedTier = 'all';

// Helper functions
function getTitle(points) {
    for (const title of TITLES) {
        if (points >= title.min && points < title.max) return title;
    }
    return TITLES[TITLES.length - 1];
}

function calculatePlayerStats(player) {
    let totalPoints = 0;
    KITS.forEach(kit => {
        const tier = player[kit.id];
        if (tier && POINTS_SYSTEM[tier]) {
            player[`${kit.id}Points`] = POINTS_SYSTEM[tier];
            totalPoints += POINTS_SYSTEM[tier];
        } else {
            player[`${kit.id}Points`] = 0;
        }
    });
    player.totalPoints = totalPoints;
    player.title = getTitle(totalPoints);
    return player;
}

function initPlayers() {
    players = PLAYERS_DATA.map(p => calculatePlayerStats({ ...p }));
    filteredPlayers = [...players];
}

function filterPlayers() {
    filteredPlayers = players.filter(player => {
        if (searchTerm && !player.name.toLowerCase().includes(searchTerm.toLowerCase())) return false;
        if (selectedTier !== 'all') {
            if (currentKit === 'overall') {
                let hasTier = false;
                KITS.forEach(kit => {
                    if (player[kit.id] === selectedTier) hasTier = true;
                });
                if (!hasTier) return false;
            } else {
                if (player[currentKit] !== selectedTier) return false;
            }
        }
        return true;
    });
    sortPlayers();
}

function sortPlayers() {
    filteredPlayers.sort((a, b) => {
        let valA, valB;
        if (currentSort === 'name') {
            valA = a.name.toLowerCase();
            valB = b.name.toLowerCase();
        } else {
            valA = a.totalPoints;
            valB = b.totalPoints;
        }
        return currentSortDir === 'asc' ? (valA > valB ? 1 : -1) : (valA < valB ? 1 : -1);
    });
}

function getKitValue(player, kitId) {
    if (kitId === 'overall') return player.totalPoints;
    return player[kitId] || '-';
}

function renderTable() {
    const tbody = document.getElementById('tableBody');
    const kitHeader = document.getElementById('kitHeader');
    const tableTitle = document.getElementById('tableTitle');
    
    if (currentKit === 'overall') {
        kitHeader.textContent = 'Best Kit';
        tableTitle.innerHTML = '<i class="fas fa-chart-line"></i> Overall Rankings';
    } else {
        const kit = KITS.find(k => k.id === currentKit);
        kitHeader.textContent = kit.name;
        tableTitle.innerHTML = `<i class="fas fa-gamepad"></i> ${kit.name} Rankings`;
    }
    
    if (filteredPlayers.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="loading-cell">No players found</td></tr>';
        return;
    }
    
    tbody.innerHTML = filteredPlayers.map((player, idx) => {
        let kitDisplay = '';
        if (currentKit === 'overall') {
            const bestKit = KITS.reduce((best, kit) => {
                const tier = player[kit.id];
                if (tier && POINTS_SYSTEM[tier] && (!best.tier || POINTS_SYSTEM[tier] > POINTS_SYSTEM[best.tier])) {
                    return { tier, name: kit.display };
                }
                return best;
            }, { tier: null, name: '-' });
            kitDisplay = `<span class="tier-badge tier-${bestKit.tier || 'LT5'}">${bestKit.tier || '-'}</span>`;
        } else {
            const tier = player[currentKit] || '-';
            kitDisplay = `<span class="tier-badge tier-${tier}">${tier}</span>`;
        }
        
        return `
            <tr onclick="showPlayerProfile('${player.name}')">
                <td class="rank-cell">#${idx + 1}</td>
                <td class="player-cell">
                    <div class="player-info">
                        <img class="player-avatar" src="https://mc-heads.net/avatar/${player.name}/44" 
                             onerror="this.src='https://mc-heads.net/avatar/Steve/44'">
                        <span class="player-name">${player.name}</span>
                    </div>
                </td>
                <td><span class="title-badge" style="background: ${player.title.color}; color: ${player.title.name.includes('Novice') || player.title.name.includes('Cadet') ? '#0a0c15' : 'white'}">${player.title.name}</span></td>
                <td class="points-cell">${player.totalPoints}</td>
                <td>${kitDisplay}</td>
            </tr>
        `;
    }).join('');
}

function updateStats() {
    document.getElementById('totalPlayers').textContent = filteredPlayers.length;
    if (filteredPlayers.length > 0) {
        document.getElementById('topPlayerName').textContent = filteredPlayers[0].name;
        const total = filteredPlayers.reduce((s, p) => s + p.totalPoints, 0);
        document.getElementById('avgPoints').textContent = Math.round(total / filteredPlayers.length);
        
        let highestTier = 'N/A';
        let highestPoints = -1;
        players.forEach(p => {
            KITS.forEach(kit => {
                const tier = p[kit.id];
                if (tier && POINTS_SYSTEM[tier] && POINTS_SYSTEM[tier] > highestPoints) {
                    highestPoints = POINTS_SYSTEM[tier];
                    highestTier = tier;
                }
            });
        });
        document.getElementById('highestTier').textContent = highestTier;
    } else {
        document.getElementById('topPlayerName').textContent = '-';
        document.getElementById('avgPoints').textContent = '0';
        document.getElementById('highestTier').textContent = '-';
    }
}

function renderNavTabs() {
    const container = document.getElementById('kitTabs');
    container.innerHTML = `
        <button class="nav-tab ${currentKit === 'overall' ? 'active' : ''}" data-kit="overall">🏆 Overall</button>
        ${KITS.map(kit => `<button class="nav-tab ${currentKit === kit.id ? 'active' : ''}" data-kit="${kit.id}">${kit.name}</button>`).join('')}
    `;
    document.querySelectorAll('.nav-tab').forEach(btn => {
        btn.addEventListener('click', () => {
            currentKit = btn.dataset.kit;
            renderNavTabs();
            filterPlayers();
            renderTable();
            updateStats();
        });
    });
}

function renderInfoPanels() {
    const pointsContainer = document.getElementById('pointsList');
    pointsContainer.innerHTML = Object.entries(POINTS_SYSTEM).map(([tier, pts]) => `
        <div class="points-item"><span class="tier-badge tier-${tier}" style="width: auto; padding: 4px 12px;">${tier}</span><span>${pts} pts</span></div>
    `).join('');
    
    const titlesContainer = document.getElementById('titlesList');
    titlesContainer.innerHTML = TITLES.map(title => `
        <div class="title-item"><span class="title-name">${title.name}</span><span class="title-range">${title.min} - ${title.max === Infinity ? '+' : title.max} pts</span></div>
    `).join('');
    
    const kitsContainer = document.getElementById('kitsList');
    kitsContainer.innerHTML = KITS.map(kit => `
        <div class="kit-item"><span>${kit.name}</span><span>Ranked PvP</span></div>
    `).join('');
}

function showPlayerProfile(playerName) {
    const player = players.find(p => p.name === playerName);
    if (!player) return;
    
    const modal = document.getElementById('playerModal');
    const modalBody = document.getElementById('modalBody');
    
    modalBody.innerHTML = `
        <div class="profile-header">
            <img class="profile-avatar" src="https://mc-heads.net/avatar/${player.name}/100" onerror="this.src='https://mc-heads.net/avatar/Steve/100'">
            <div class="profile-info">
                <h2>${player.name}</h2>
                <div class="profile-title" style="background: ${player.title.color}; color: ${player.title.name.includes('Novice') || player.title.name.includes('Cadet') ? '#0a0c15' : 'white'}">${player.title.name}</div>
                <div class="profile-points">${player.totalPoints} Points</div>
            </div>
        </div>
        <div class="kits-grid">
            ${KITS.map(kit => `
                <div class="kit-card">
                    <div class="kit-name">${kit.name}</div>
                    <div class="kit-tier tier-badge tier-${player[kit.id] || 'LT5'}">${player[kit.id] || '-'}</div>
                </div>
            `).join('')}
        </div>
    `;
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    const modal = document.getElementById('playerModal');
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

function setupEventListeners() {
    document.getElementById('searchInput').addEventListener('input', (e) => {
        searchTerm = e.target.value;
        filterPlayers();
        renderTable();
        updateStats();
    });
    
    document.getElementById('tierFilter').addEventListener('change', (e) => {
        selectedTier = e.target.value;
        filterPlayers();
        renderTable();
        updateStats();
    });
    
    document.getElementById('resetBtn').addEventListener('click', () => {
        searchTerm = '';
        selectedTier = 'all';
        document.getElementById('searchInput').value = '';
        document.getElementById('tierFilter').value = 'all';
        filterPlayers();
        renderTable();
        updateStats();
    });
    
    document.querySelectorAll('.sort-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const sort = btn.dataset.sort;
            if (currentSort === sort) {
                currentSortDir = currentSortDir === 'asc' ? 'desc' : 'asc';
            } else {
                currentSort = sort;
                currentSortDir = 'desc';
            }
            document.querySelectorAll('.sort-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            filterPlayers();
            renderTable();
            updateStats();
        });
    });
    
    document.getElementById('closeModalBtn').addEventListener('click', closeModal);
    document.getElementById('playerModal').addEventListener('click', (e) => {
        if (e.target === document.getElementById('playerModal')) closeModal();
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
    });
    
    // Cursor glow effect
    document.addEventListener('mousemove', (e) => {
        const glow = document.querySelector('.cursor-glow');
        if (glow) glow.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
    });
}

function init() {
    initPlayers();
    renderNavTabs();
    renderInfoPanels();
    filterPlayers();
    renderTable();
    updateStats();
    setupEventListeners();
}

document.addEventListener('DOMContentLoaded', init);

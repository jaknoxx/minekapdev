// ========================================
// MAIN.JS - Hlavní inicializace
// ========================================

let allPlayers = [];
let currentFilteredPlayers = [];

// Inicializace hráčů (přidání bodů a titulů)
function initPlayers() {
    console.log('Inicializace hráčů...');
    allPlayers = PLAYERS_DATA.map(player => calculatePlayerStats({ ...player }));
    // Seřazení podle bodů (nejlepší první)
    allPlayers.sort((a, b) => b.totalPoints - a.totalPoints);
    console.log('Načteno hráčů:', allPlayers.length);
    console.log('První hráč:', allPlayers[0]?.name, allPlayers[0]?.totalPoints, 'bodů');
    return allPlayers;
}

// Filtrování hráčů
function filterPlayers(players) {
    let filtered = [...players];
    
    const searchTerm = document.getElementById('searchInput')?.value || '';
    const selectedTier = document.getElementById('tierFilter')?.value || 'all';
    
    // Filtrování podle jména
    if (searchTerm) {
        filtered = filtered.filter(player => 
            player.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }
    
    // Filtrování podle tieru
    if (selectedTier !== 'all') {
        filtered = filtered.filter(player => {
            if (currentKit === 'overall') {
                // Pro overall: hráč musí mít alespoň jeden kit s vybraným tierem
                return GAMEMODES.some(gamemode => player[gamemode.id] === selectedTier);
            } else {
                // Pro konkrétní kit: hráč musí mít v tom kitu vybraný tier
                return player[currentKit] === selectedTier;
            }
        });
    }
    
    return filtered;
}

// Aplikace filtrů a vykreslení
function applyFiltersAndRender() {
    const filtered = filterPlayers(allPlayers);
    const sorted = sortPlayersByKit(filtered, currentKit);
    renderTable(sorted);
    updateStatsDisplay(sorted);
    return sorted;
}

// Vytvoření navigačních tabů
function renderNavTabs() {
    const container = document.getElementById('kitTabs');
    if (!container) return;
    
    container.innerHTML = `
        <button class="nav-tab ${currentKit === 'overall' ? 'active' : ''}" data-kit="overall">
            <i class="fas fa-trophy"></i> Overall
        </button>
        ${GAMEMODES.map(gm => `
            <button class="nav-tab ${currentKit === gm.id ? 'active' : ''}" data-kit="${gm.id}">
                <i class="fas ${gm.icon || 'fa-gamepad'}"></i> ${gm.name}
            </button>
        `).join('')}
    `;
    
    document.querySelectorAll('.nav-tab').forEach(btn => {
        btn.addEventListener('click', () => {
            currentKit = btn.dataset.kit;
            renderNavTabs();
            setActiveSortButton();
            applyFiltersAndRender();
        });
    });
}

// Reset všech filtrů
function resetFilters() {
    const searchInput = document.getElementById('searchInput');
    const tierFilter = document.getElementById('tierFilter');
    
    if (searchInput) searchInput.value = '';
    if (tierFilter) tierFilter.value = 'all';
    
    applyFiltersAndRender();
}

// Nastavení event listenerů
function setupEventListeners() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', () => {
            applyFiltersAndRender();
        });
    }
    
    const tierFilter = document.getElementById('tierFilter');
    if (tierFilter) {
        tierFilter.addEventListener('change', () => {
            applyFiltersAndRender();
        });
    }
    
    const resetBtn = document.getElementById('resetBtn');
    if (resetBtn) {
        resetBtn.addEventListener('click', resetFilters);
    }
    
    // Sort buttons
    document.querySelectorAll('.sort-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const sort = btn.dataset.sort;
            if (currentSort === sort) {
                currentSortDir = currentSortDir === 'asc' ? 'desc' : 'asc';
            } else {
                currentSort = sort;
                currentSortDir = 'desc';
            }
            setActiveSortButton();
            applyFiltersAndRender();
        });
    });
    
    // Modal events
    setupModalEvents();
}

// Inicializace všeho
function init() {
    console.log('Spouštím PvP Tier List...');
    initPlayers();
    renderNavTabs();
    updateInfoPanels();
    setActiveSortButton();
    applyFiltersAndRender();
    setupEventListeners();
    
    // Uložení do window pro přístup z jiných skriptů
    window.allPlayers = allPlayers;
    window.showPlayerProfile = showPlayerProfile;
    console.log('Inicializace dokončena. Hráčů:', allPlayers.length);
}

// Spuštění po načtení DOM
document.addEventListener('DOMContentLoaded', init);

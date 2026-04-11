// ========================================
// MAIN.JS - Hlavní inicializace
// ========================================

let allPlayers = [];
let currentFilteredPlayers = [];

// Inicializace hráčů
function initPlayers() {
    allPlayers = PLAYERS_DATA.map(player => calculatePlayerStats({ ...player }));
    allPlayers.sort((a, b) => b.totalPoints - a.totalPoints);
}

// Vytvoření navigačních tabů
function renderNavTabs() {
    const container = document.getElementById('kitTabs');
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
            currentFilteredPlayers = applyFiltersAndSort(allPlayers);
        });
    });
}

// Nastavení event listenerů
function setupEventListeners() {
    // Vyhledávání
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', (e) => {
        searchTerm = e.target.value;
        currentFilteredPlayers = applyFiltersAndSort(allPlayers);
    });
    
    // Tier filtr
    const tierFilter = document.getElementById('tierFilter');
    tierFilter.addEventListener('change', (e) => {
        selectedTier = e.target.value;
        currentFilteredPlayers = applyFiltersAndSort(allPlayers);
    });
    
    // Reset tlačítko
    document.getElementById('resetBtn').addEventListener('click', () => {
        searchTerm = '';
        selectedTier = 'all';
        searchInput.value = '';
        tierFilter.value = 'all';
        currentFilteredPlayers = applyFiltersAndSort(allPlayers);
    });
    
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
            currentFilteredPlayers = applyFiltersAndSort(allPlayers);
        });
    });
    
    // Modal events
    setupModalEvents();
}

// Inicializace všeho
function init() {
    initPlayers();
    renderNavTabs();
    updateInfoPanels();
    setActiveSortButton();
    currentFilteredPlayers = applyFiltersAndSort(allPlayers);
    setupEventListeners();
    
    // Uložení do window pro přístup z jiných skriptů
    window.allPlayers = allPlayers;
}

// Spuštění po načtení DOM
document.addEventListener('DOMContentLoaded', init);

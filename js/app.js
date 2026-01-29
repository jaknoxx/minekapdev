// Hlavní aplikace
document.addEventListener('DOMContentLoaded', function() {
    // Globální proměnné
    let players = [];
    let filteredPlayers = [];
    let currentSort = 'totalPoints';
    let currentSortDirection = 'desc';
    
    // DOM elementy
    const playersTableBody = document.getElementById('playersTableBody');
    const playerSearch = document.getElementById('playerSearch');
    const kitFilter = document.getElementById('kitFilter');
    const tierFilter = document.getElementById('tierFilter');
    const resetFiltersBtn = document.getElementById('resetFilters');
    const playerCount = document.getElementById('playerCount');
    const topPlayer = document.getElementById('topPlayer');
    const avgPoints = document.getElementById('avgPoints');
    const sortButtons = document.querySelectorAll('.sort-btn');
    const infoToggle = document.getElementById('infoToggle');
    const infoContent = document.getElementById('infoContent');
    const copyIpBtn = document.querySelector('.copy-ip-btn');
    
    // Modal elementy
    const playerModalOverlay = document.getElementById('playerModalOverlay');
    const playerModal = document.getElementById('playerModal');
    const modalCloseBtn = document.getElementById('modalCloseBtn');
    const playerModalContent = document.getElementById('playerModalContent');
    
    // Bodovací systém
    const pointSystem = {
        'LT5': 1,
        'HT5': 2,
        'LT4': 3,
        'HT4': 4,
        'LT3': 10,
        'HT3': 15,
        'LT2': 20,
        'HT2': 30,
        'LT1': 45,
        'HT1': 60,
        // Retier mají stejné body jako normální tier
        'RLT3': 10,
        'RHT3': 15,
        'RLT2': 20,
        'RHT2': 30,
        'RLT1': 45,
        'RHT1': 60
    };
    
    // Title systém
    const titleSystem = [
        { min: 0, max: 10, name: 'Rookie', color: '#95a5a6' },
        { min: 10, max: 15, name: 'Combat Novice', color: '#7bed9f' },
        { min: 15, max: 50, name: 'Combat Cadet', color: '#70a1ff' },
        { min: 50, max: 100, name: 'Combat Specialist', color: '#ff9ff3' },
        { min: 100, max: 250, name: 'Combat Ace', color: '#ff6b6b' },
        { min: 250, max: 350, name: 'Combat Master', color: '#f39c12' },
        { min: 350, max: Infinity, name: 'Combat Grandmaster', color: '#f1c40f' }
    ];
    
    // Kity v pořadí
    const kits = ['sword', 'axe', 'uhc', 'diapot', 'nethpot', 'smp', 'crystal', 'mace', 'spear'];
    const kitNames = {
        'sword': 'Sword',
        'axe': 'Axe', 
        'uhc': 'UHC',
        'diapot': 'DiaPot',
        'nethpot': 'NethPot',
        'smp': 'SMP',
        'crystal': 'Crystal',
        'mace': 'Mace',
        'spear': 'Spear'
    };
    
    // Načtení dat
    async function loadPlayersData() {
        try {
            // Načtení JSON souboru
            const response = await fetch('data/players.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            players = await response.json();
            
            // Výpočet bodů a titlů
            players.forEach(player => {
                calculatePlayerStats(player);
            });
            
            // Inicializace
            filteredPlayers = [...players];
            updatePlayerStats();
            renderPlayersTable();
        } catch (error) {
            console.error('Chyba při načítání dat:', error);
            playersTableBody.innerHTML = `
                <tr>
                    <td colspan="13" style="text-align: center; padding: 40px; color: #e74c3c;">
                        <i class="fas fa-exclamation-triangle" style="font-size: 2rem; margin-bottom: 15px;"></i>
                        <h3>Chyba při načítání dat</h3>
                        <p>Soubor s daty hráčů nemohl být načten.</p>
                    </td>
                </tr>
            `;
        }
    }
    
    // Výpočet statistik hráče
    function calculatePlayerStats(player) {
        let totalPoints = 0;
        
        // Výpočet bodů pro každý kit
        kits.forEach(kit => {
            const tier = player[kit];
            if (tier && pointSystem[tier]) {
                player[`${kit}Points`] = pointSystem[tier];
                totalPoints += pointSystem[tier];
            } else {
                player[`${kit}Points`] = 0;
            }
        });
        
        // Uložení celkových bodů
        player.totalPoints = totalPoints;
        
        // Určení titlu
        player.title = getTitle(totalPoints);
    }
    
    // Získání titlu na základě bodů
    function getTitle(points) {
        for (const title of titleSystem) {
            if (points >= title.min && points < title.max) {
                return title;
            }
        }
        return titleSystem[titleSystem.length - 1]; // Fallback
    }
    
    // Vykreslení tabulky hráčů
    function renderPlayersTable() {
        if (filteredPlayers.length === 0) {
            playersTableBody.innerHTML = `
                <tr>
                    <td colspan="13" style="text-align: center; padding: 40px;">
                        <i class="fas fa-search" style="font-size: 2rem; margin-bottom: 15px; opacity: 0.5;"></i>
                        <h3>Žádní hráči nenalezeni</h3>
                        <p>Zkuste změnit nebo resetovat filtry.</p>
                    </td>
                </tr>
            `;
            return;
        }
        
        let html = '';
        
        filteredPlayers.forEach((player, index) => {
            html += `
                <tr class="player-row" data-player-name="${player.name}">
                    <td class="rank-col">${index + 1}</td>
                    <td class="player-col">
                        <div class="player-info">
                            <div class="player-avatar">
                                <img src="https://mc-heads.net/avatar/${player.name}/50" 
                                     alt="${player.name}" 
                                     class="player-skin"
                                     onerror="this.src='https://mc-heads.net/avatar/Steve/50'">
                            </div>
                            <div>
                                <div class="player-name">${player.name}</div>
                            </div>
                        </div>
                    </td>
                    <td class="title-col">
                        <span class="player-title" style="background-color: ${player.title.color}; color: ${player.title.name.includes('Novice') || player.title.name.includes('Cadet') ? 'black' : 'white'}">
                            ${player.title.name}
                        </span>
                    </td>
                    <td class="points-col">${player.totalPoints}</td>
            `;
            
            // Přidání tierů pro každý kit
            kits.forEach(kit => {
                const tier = player[kit] || '-';
                const tierClass = tier !== '-' ? `tier-${tier}` : '';
                html += `<td class="kit-col"><span class="kit-tier ${tierClass}">${tier}</span></td>`;
            });
            
            html += `</tr>`;
        });
        
        playersTableBody.innerHTML = html;
        
        // Přidání event listenerů pro klikání na hráče
        document.querySelectorAll('.player-row').forEach(row => {
            row.addEventListener('click', function() {
                const playerName = this.getAttribute('data-player-name');
                const player = players.find(p => p.name === playerName);
                if (player) {
                    showPlayerProfile(player);
                }
            });
        });
        
        // Přidání event listenerů pro jména hráčů
        document.querySelectorAll('.player-name').forEach(nameElement => {
            nameElement.addEventListener('click', function(e) {
                e.stopPropagation();
                const row = this.closest('.player-row');
                const playerName = row.getAttribute('data-player-name');
                const player = players.find(p => p.name === playerName);
                if (player) {
                    showPlayerProfile(player);
                }
            });
        });
        
        // Přidání event listenerů pro skiny hráčů
        document.querySelectorAll('.player-skin').forEach(skinElement => {
            skinElement.addEventListener('click', function(e) {
                e.stopPropagation();
                const row = this.closest('.player-row');
                const playerName = row.getAttribute('data-player-name');
                const player = players.find(p => p.name === playerName);
                if (player) {
                    showPlayerProfile(player);
                }
            });
        });
    }
    
    // Zobrazení profilu hráče
    function showPlayerProfile(player) {
        // Vytvoření obsahu modalu
        let modalHTML = `
            <div class="player-profile-header">
                <div class="player-profile-avatar">
                    <img src="https://mc-heads.net/avatar/${player.name}/100" 
                         alt="${player.name}" 
                         class="profile-skin"
                         onerror="this.src='https://mc-heads.net/avatar/Steve/100'">
                </div>
                <div class="player-profile-info">
                    <h2 class="player-profile-name">${player.name}</h2>
                    <div class="profile-title" style="background-color: ${player.title.color}; color: ${player.title.name.includes('Novice') || player.title.name.includes('Cadet') ? 'black' : 'white'}">
                        ${player.title.name}
                    </div>
                    <div class="profile-points">${player.totalPoints} bodů</div>
                </div>
            </div>
            
            <div class="player-profile-details">
                <h3 class="profile-details-title">
                    <i class="fas fa-layer-group"></i> Tiery v kitech
                </h3>
                <div class="kits-grid">
        `;
        
        // Přidání všech kitů
        kits.forEach(kit => {
            const tier = player[kit] || '-';
            const points = player[`${kit}Points`] || 0;
            const tierClass = tier !== '-' ? `tier-${tier}` : '';
            const kitName = kitNames[kit];
            
            modalHTML += `
                <div class="kit-item">
                    <div class="kit-name">
                        <span>${kitName}</span>
                        ${tier !== '-' ? `<span class="kit-tier-display ${tierClass}">${tier}</span>` : ''}
                    </div>
                    <div class="kit-points">${points} bodů</div>
                </div>
            `;
        });
        
        modalHTML += `
                </div>
            </div>
        `;
        
        // Nastavení obsahu modalu
        playerModalContent.innerHTML = modalHTML;
        
        // Zobrazení modalu
        playerModalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden'; // Zamezení scrollování pod modalem
    }
    
    // Zavření modalu
    function closePlayerModal() {
        playerModalOverlay.classList.remove('active');
        document.body.style.overflow = ''; // Obnovení scrollování
    }
    
    // Aktualizace statistik
    function updatePlayerStats() {
        playerCount.textContent = filteredPlayers.length;
        
        if (filteredPlayers.length > 0) {
            // Nejlepší hráč
            const bestPlayer = filteredPlayers.reduce((prev, current) => 
                prev.totalPoints > current.totalPoints ? prev : current
            );
            topPlayer.textContent = bestPlayer.name;
            
            // Průměrný bod
            const totalPoints = filteredPlayers.reduce((sum, player) => sum + player.totalPoints, 0);
            const avg = totalPoints / filteredPlayers.length;
            avgPoints.textContent = Math.round(avg);
        } else {
            topPlayer.textContent = '-';
            avgPoints.textContent = '-';
        }
    }
    
    // Filtrování hráčů
    function filterPlayers() {
        const searchTerm = playerSearch.value.toLowerCase();
        const selectedKit = kitFilter.value;
        const selectedTier = tierFilter.value;
        
        filteredPlayers = players.filter(player => {
            // Vyhledávání podle jména
            if (searchTerm && !player.name.toLowerCase().includes(searchTerm)) {
                return false;
            }
            
            // Filtrování podle kitu
            if (selectedKit !== 'all' && (!player[selectedKit] || player[selectedKit] === '-')) {
                return false;
            }
            
            // Filtrování podle tieru
            if (selectedTier !== 'all') {
                let hasTier = false;
                kits.forEach(kit => {
                    if (player[kit] === selectedTier) {
                        hasTier = true;
                    }
                });
                if (!hasTier) return false;
            }
            
            return true;
        });
        
        // Seřazení
        sortPlayers();
        renderPlayersTable();
        updatePlayerStats();
    }
    
    // Seřazení hráčů
    function sortPlayers() {
        filteredPlayers.sort((a, b) => {
            let aValue, bValue;
            
            if (currentSort === 'name') {
                aValue = a.name.toLowerCase();
                bValue = b.name.toLowerCase();
            } else if (currentSort === 'totalPoints') {
                aValue = a.totalPoints;
                bValue = b.totalPoints;
            } else {
                aValue = a[currentSort] || 0;
                bValue = b[currentSort] || 0;
            }
            
            if (currentSortDirection === 'asc') {
                return aValue > bValue ? 1 : -1;
            } else {
                return aValue < bValue ? 1 : -1;
            }
        });
    }
    
    // Reset filtrů
    function resetFilters() {
        playerSearch.value = '';
        kitFilter.value = 'all';
        tierFilter.value = 'all';
        filteredPlayers = [...players];
        sortPlayers();
        renderPlayersTable();
        updatePlayerStats();
    }
    
    // Události
    playerSearch.addEventListener('input', filterPlayers);
    kitFilter.addEventListener('change', filterPlayers);
    tierFilter.addEventListener('change', filterPlayers);
    resetFiltersBtn.addEventListener('click', resetFilters);
    
    // Události pro řazení
    sortButtons.forEach(button => {
        button.addEventListener('click', function() {
            const sortBy = this.getAttribute('data-sort');
            
            // Pokud už je aktivní, změň směr
            if (this.classList.contains('active')) {
                currentSortDirection = currentSortDirection === 'asc' ? 'desc' : 'asc';
            } else {
                // Odstranit aktivní třídu z ostatních
                sortButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                currentSort = sortBy;
                currentSortDirection = 'desc';
            }
            
            // Aktualizovat ikonu
            const icon = this.querySelector('i');
            icon.className = currentSortDirection === 'asc' ? 'fas fa-sort-amount-up' : 'fas fa-sort-amount-down';
            
            sortPlayers();
            renderPlayersTable();
        });
    });
    
    // Info panel toggle
    infoToggle.addEventListener('click', function() {
        infoContent.classList.toggle('show');
        const icon = this.querySelector('.fa-chevron-down');
        icon.classList.toggle('fa-rotate-180');
    });
    
    // Kopírování IP adresy
    copyIpBtn.addEventListener('click', function() {
        const ip = 'mc.minekap.eu';
        navigator.clipboard.writeText(ip).then(() => {
            const originalIcon = this.innerHTML;
            this.innerHTML = '<i class="fas fa-check"></i>';
            setTimeout(() => {
                this.innerHTML = originalIcon;
            }, 2000);
        });
    });
    
    // Modal události
    modalCloseBtn.addEventListener('click', closePlayerModal);
    
    // Zavření modalu kliknutím mimo obsah
    playerModalOverlay.addEventListener('click', function(e) {
        if (e.target === playerModalOverlay) {
            closePlayerModal();
        }
    });
    
    // Zavření modalu klávesou ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && playerModalOverlay.classList.contains('active')) {
            closePlayerModal();
        }
    });
    
    // Načtení dat
    loadPlayersData();
});

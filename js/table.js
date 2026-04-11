// ========================================
// TABLE.JS - Logika tabulky (Overall x Kity)
// ========================================

// Tyto proměnné jsou definovány v main.js, ale pro jistotu je zkontrolujeme
if (typeof currentKit === 'undefined') var currentKit = 'overall';
if (typeof currentSort === 'undefined') var currentSort = 'points';
if (typeof currentSortDir === 'undefined') var currentSortDir = 'desc';

// Řazení podle tieru (pro jednotlivé kity)
function getTierRank(tier) {
    const tierOrder = ['HT1', 'LT1', 'HT2', 'LT2', 'HT3', 'LT3', 'HT4', 'LT4', 'HT5', 'LT5', ''];
    return tierOrder.indexOf(tier);
}

// Řazení hráčů podle aktuálního kitu
function sortPlayersByKit(players, kitId) {
    if (!players || players.length === 0) return [];
    
    return [...players].sort((a, b) => {
        if (currentSort === 'name') {
            const valA = a.name.toLowerCase();
            const valB = b.name.toLowerCase();
            return currentSortDir === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
        } else if (currentSort === 'points') {
            // Pro overall řazení podle celkových bodů
            if (kitId === 'overall') {
                return currentSortDir === 'asc' ? a.totalPoints - b.totalPoints : b.totalPoints - a.totalPoints;
            }
            // Pro konkrétní kit řazení podle tieru (HT1 nejlepší)
            const tierA = a[kitId] || '';
            const tierB = b[kitId] || '';
            const rankA = getTierRank(tierA);
            const rankB = getTierRank(tierB);
            return currentSortDir === 'asc' ? rankA - rankB : rankB - rankA;
        }
        return 0;
    });
}

// Vytvoření hlavičky tabulky podle aktuálního kitu
function renderTableHeader() {
    const thead = document.getElementById('tableHeader');
    if (!thead) return;
    
    if (currentKit === 'overall') {
        // Overall: zobraz všechny kity
        thead.innerHTML = `
            <tr>
                <th>#</th>
                <th>Player</th>
                <th>Title</th>
                <th>Points</th>
                ${GAMEMODES.map(gm => `<th class="kit-column">${gm.name}</th>`).join('')}
            </tr>
        `;
    } else {
        // Konkrétní kit: zobraz jen jeden sloupec pro tier
        const selectedGamemode = GAMEMODES.find(g => g.id === currentKit);
        thead.innerHTML = `
            <tr>
                <th>#</th>
                <th>Player</th>
                <th>Title</th>
                <th>Points</th>
                <th class="kit-column">${selectedGamemode?.name || currentKit} Tier</th>
            </tr>
        `;
    }
}

// Vykreslení tabulky
function renderTable(players) {
    const tbody = document.getElementById('tableBody');
    const tableTitle = document.getElementById('tableTitle');
    
    if (!tbody) {
        console.error('Tabulka nebyla nalezena!');
        return;
    }
    
    // Kontrola, zda máme data
    if (!players || players.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="20" class="loading-state">
                    <i class="fas fa-search" style="font-size: 32px; margin-bottom: 12px; opacity: 0.5;"></i>
                    <span>No players found</span>
                </td>
            </tr>
        `;
        return;
    }
    
    // Nastavení nadpisu
    if (tableTitle) {
        if (currentKit === 'overall') {
            tableTitle.innerHTML = '<i class="fas fa-trophy"></i> Overall Rankings - All Kits';
        } else {
            const gamemode = GAMEMODES.find(g => g.id === currentKit);
            tableTitle.innerHTML = `<i class="fas fa-gamepad"></i> ${gamemode?.name || currentKit} Rankings - Tier Only`;
        }
    }
    
    // Vygenerování hlavičky
    renderTableHeader();
    
    // Seřazení hráčů podle aktuálního kitu
    const sortedPlayers = sortPlayersByKit(players, currentKit);
    
    tbody.innerHTML = sortedPlayers.map((player, index) => {
        const titleColor = player.title.color;
        const titleTextColor = player.title.textColor || (player.title.name.includes('Novice') || player.title.name.includes('Cadet') ? '#0a0c15' : 'white');
        
        if (currentKit === 'overall') {
            // OVERALL: zobraz všechny kity
            return `
                <tr style="animation-delay: ${index * 0.02}s" onclick="showPlayerProfile('${player.name.replace(/'/g, "\\'")}')">
                    <td class="rank-cell">#${index + 1}</td>
                    <td class="player-cell">
                        <div class="player-info">
                            <img class="player-avatar" 
                                 src="https://mc-heads.net/avatar/${encodeURIComponent(player.name)}/44" 
                                 alt="${player.name}"
                                 onerror="this.src='https://mc-heads.net/avatar/Steve/44'">
                            <span class="player-name">${escapeHtml(player.name)}</span>
                        </div>
                    </td>
                    <td>
                        <span class="title-badge" style="background: ${titleColor}; color: ${titleTextColor}">
                            ${player.title.name}
                        </span>
                    </td>
                    <td class="points-cell">${player.totalPoints}</td>
                    ${GAMEMODES.map(gm => {
                        const tier = player[gm.id] || '-';
                        return `<td class="kit-tier-cell"><span class="tier-badge tier-${tier === '-' ? 'empty' : tier}">${tier}</span></td>`;
                    }).join('')}
                </tr>
            `;
        } else {
            // KONKRÉTNÍ KIT: zobraz jen tier v daném kitu
            const tier = player[currentKit] || '-';
            return `
                <tr style="animation-delay: ${index * 0.02}s" onclick="showPlayerProfile('${player.name.replace(/'/g, "\\'")}')">
                    <td class="rank-cell">#${index + 1}</td>
                    <td class="player-cell">
                        <div class="player-info">
                            <img class="player-avatar" 
                                 src="https://mc-heads.net/avatar/${encodeURIComponent(player.name)}/44" 
                                 alt="${player.name}"
                                 onerror="this.src='https://mc-heads.net/avatar/Steve/44'">
                            <span class="player-name">${escapeHtml(player.name)}</span>
                        </div>
                    </td>
                    <td>
                        <span class="title-badge" style="background: ${titleColor}; color: ${titleTextColor}">
                            ${player.title.name}
                        </span>
                    </td>
                    <td class="points-cell">${player.totalPoints}</td>
                    <td class="kit-tier-cell"><span class="tier-badge tier-${tier === '-' ? 'empty' : tier}">${tier}</span></td>
                </tr>
            `;
        }
    }).join('');
}

// Nastavení aktivního tlačítka řazení
function setActiveSortButton() {
    document.querySelectorAll('.sort-btn').forEach(btn => {
        btn.classList.remove('active');
        if ((currentSort === 'points' && btn.dataset.sort === 'points') ||
            (currentSort === 'name' && btn.dataset.sort === 'name')) {
            btn.classList.add('active');
        }
    });
}

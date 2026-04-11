// ========================================
// TABLE.JS - Logika tabulky
// ========================================

let currentKit = 'overall';
let currentSort = 'points';
let currentSortDir = 'desc';

// Vykreslení tabulky
function renderTable(players) {
    const tbody = document.getElementById('tableBody');
    const kitHeader = document.getElementById('kitHeader');
    const tableTitle = document.getElementById('tableTitle');
    
    // Nastavení nadpisů podle aktuálního kitu
    if (currentKit === 'overall') {
        kitHeader.innerHTML = '<i class="fas fa-star"></i> Best Kit';
        tableTitle.innerHTML = '<i class="fas fa-trophy"></i> Overall Rankings';
    } else {
        const gamemode = GAMEMODES.find(g => g.id === currentKit);
        kitHeader.innerHTML = `<i class="fas ${gamemode.icon || 'fa-gamepad'}"></i> ${gamemode.name} Tier`;
        tableTitle.innerHTML = `<i class="fas fa-gamepad"></i> ${gamemode.name} Rankings`;
    }
    
    if (!players || players.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="5" class="loading-state">
                    <i class="fas fa-search" style="font-size: 32px; margin-bottom: 12px; opacity: 0.5;"></i>
                    <span>No players found</span>
                </td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = players.map((player, index) => {
        let kitDisplay = '';
        
        if (currentKit === 'overall') {
            const bestKit = getBestKit(player);
            kitDisplay = `<span class="tier-badge tier-${bestKit.tier || 'LT5'}">${bestKit.tier || '-'}</span>`;
        } else {
            const tier = player[currentKit] || '-';
            kitDisplay = `<span class="tier-badge tier-${tier}">${tier}</span>`;
        }
        
        const titleColor = player.title.color;
        const titleTextColor = player.title.textColor || (player.title.name.includes('Novice') || player.title.name.includes('Cadet') ? '#0a0c15' : 'white');
        
        return `
            <tr style="animation-delay: ${index * 0.02}s" onclick="showPlayerProfile('${player.name}')">
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
                <td>${kitDisplay}</td>
            </tr>
        `;
    }).join('');
}

// Řazení hráčů
function sortPlayers(players) {
    return [...players].sort((a, b) => {
        let valA, valB;
        
        if (currentSort === 'name') {
            valA = a.name.toLowerCase();
            valB = b.name.toLowerCase();
            return currentSortDir === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
        } else {
            valA = a.totalPoints;
            valB = b.totalPoints;
            return currentSortDir === 'asc' ? valA - valB : valB - valA;
        }
    });
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

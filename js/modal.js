// ========================================
// MODAL.JS - Profilové okno hráče
// ========================================

// Zobrazení profilu hráče
window.showPlayerProfile = function(playerName) {
    const player = window.allPlayers?.find(p => p.name === playerName);
    if (!player) return;
    
    const modal = document.getElementById('playerModal');
    const modalBody = document.getElementById('modalBody');
    
    const titleColor = player.title.color;
    const titleTextColor = player.title.textColor || (player.title.name.includes('Novice') || player.title.name.includes('Cadet') ? '#0a0c15' : 'white');
    
    modalBody.innerHTML = `
        <div class="profile-header">
            <img class="profile-avatar" 
                 src="https://mc-heads.net/avatar/${encodeURIComponent(player.name)}/100" 
                 alt="${player.name}"
                 onerror="this.src='https://mc-heads.net/avatar/Steve/100'">
            <div class="profile-info">
                <h2>${escapeHtml(player.name)}</h2>
                <div class="profile-title" style="background: ${titleColor}; color: ${titleTextColor}">
                    ${player.title.name}
                </div>
                <div class="profile-points">${player.totalPoints} Points</div>
            </div>
        </div>
        <div class="profile-kits">
            <h4><i class="fas fa-layer-group"></i> Kit Tiers</h4>
            <div class="kits-grid">
                ${GAMEMODES.map(gamemode => `
                    <div class="kit-card">
                        <div class="kit-name">${gamemode.name}</div>
                        <div class="kit-tier tier-badge tier-${player[gamemode.id] || 'LT5'}">
                            ${player[gamemode.id] || '-'}
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Zavření modalu
function closeModal() {
    const modal = document.getElementById('playerModal');
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

// Nastavení event listenerů pro modal
function setupModalEvents() {
    document.getElementById('closeModalBtn').addEventListener('click', closeModal);
    document.getElementById('playerModal').addEventListener('click', (e) => {
        if (e.target === document.getElementById('playerModal')) closeModal();
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
    });
}

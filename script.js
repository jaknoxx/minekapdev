document.addEventListener('DOMContentLoaded', function() {
    const tierPoints = {
        'LT5': 1,
        'HT5': 2,
        'LT4': 3,
        'HT4': 4,
        'LT3': 10,
        'HT3': 15,
        'LT2': 20,
        'HT2': 30,
        'LT1': 45,
        'HT1': 60
    };

    const kitEmojis = {
        'CpvP': '⚔️',
        'Axe': '🪓',
        'Sword': '🗡️',
        'UHC': '❤️',
        'Npot': '🚫',
        'Pot': '🧪',
        'SMP': '🌍',
        'DiaSMP': '💎',
        'Mace': '🔨'
    };

    const kitsOrder = ['CpvP', 'Axe', 'Sword', 'UHC', 'Npot', 'Pot', 'SMP', 'DiaSMP', 'Mace'];

    // Načíst data z data.json
    fetch('data.json')
        .then(response => response.json())
        .then(players => {
            // Přidat celkové body
            players.forEach(player => {
                player.totalPoints = 0;
                kitsOrder.forEach(kit => {
                    const tier = player.kits[kit];
                    if (tier && tierPoints[tier]) {
                        player.totalPoints += tierPoints[tier];
                    }
                });
            });

            // Seřadit hráče podle bodů
            players.sort((a, b) => b.totalPoints - a.totalPoints);

            // Vyplnit tabulku
            const tableBody = document.getElementById('table-body');
            tableBody.innerHTML = '';

            players.forEach((player, index) => {
                const row = document.createElement('tr');

                // Pořadí
                const rankCell = document.createElement('td');
                rankCell.className = 'rank-cell';
                rankCell.textContent = `#${index + 1}`;
                row.appendChild(rankCell);

                // Hráč + skin
                const playerCell = document.createElement('td');
                playerCell.className = 'player-cell';
                playerCell.innerHTML = `
                    <img class="skin" src="${player.skin}" alt="${player.name}">
                    <span>${player.name}</span>
                `;
                row.appendChild(playerCell);

                // Kity
                kitsOrder.forEach(kit => {
                    const kitCell = document.createElement('td');
                    kitCell.className = 'kit-cell';
                    const tier = player.kits[kit];
                    if (tier) {
                        kitCell.innerHTML = `
                            <div class="kit-emoji">${kitEmojis[kit]}</div>
                            <div class="kit-tier">${tier}</div>
                        `;
                    } else {
                        kitCell.textContent = '-';
                    }
                    row.appendChild(kitCell);
                });

                // Celkem bodů
                const pointsCell = document.createElement('td');
                pointsCell.className = 'points-cell';
                pointsCell.textContent = player.totalPoints;
                row.appendChild(pointsCell);

                tableBody.appendChild(row);
            });
        })
        .catch(error => console.error('Chyba při načítání dat:', error));
});

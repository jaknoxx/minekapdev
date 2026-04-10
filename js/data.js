// ========================================
// PLAYER DATA & CONFIGURATION
// ========================================

const POINTS_SYSTEM = {
    'HT1': 60, 'LT1': 45,
    'HT2': 30, 'LT2': 20,
    'HT3': 15, 'LT3': 10,
    'HT4': 4,  'LT4': 3,
    'HT5': 2,  'LT5': 1
};

const TITLES = [
    { min: 0, max: 10, name: 'Rookie', color: '#95a5a6' },
    { min: 10, max: 15, name: 'Combat Novice', color: '#7bed9f' },
    { min: 15, max: 50, name: 'Combat Cadet', color: '#70a1ff' },
    { min: 50, max: 100, name: 'Combat Specialist', color: '#ff9ff3' },
    { min: 100, max: 250, name: 'Combat Ace', color: '#ff6b6b' },
    { min: 250, max: 350, name: 'Combat Master', color: '#f39c12' },
    { min: 350, max: Infinity, name: 'Combat Grandmaster', color: '#f1c40f' }
];

const KITS = [
    { id: 'sword', name: '⚔️ Sword', display: 'Sword' },
    { id: 'axe', name: '🪓 Axe', display: 'Axe' },
    { id: 'uhc', name: '🏹 UHC', display: 'UHC' },
    { id: 'diapot', name: '💎 DiaPot', display: 'DiaPot' },
    { id: 'nethpot', name: '🔥 NethPot', display: 'NethPot' },
    { id: 'smp', name: '🌍 SMP', display: 'SMP' },
    { id: 'crystal', name: '🔮 Crystal', display: 'Crystal' },
    { id: 'mace', name: '🔨 Mace', display: 'Mace' },
    { id: 'spear', name: '🏹 Spear', display: 'Spear' }
];

const PLAYERS_DATA = [
    { "name": "jaknox", "sword": "LT3", "axe": "LT3", "uhc": "HT4", "diapot": "HT4", "nethpot": "HT4", "smp": "HT4", "crystal": "HT4", "mace": "LT4", "spear": "LT3" },
    { "name": "YT_lacjim168", "sword": "LT3", "axe": "LT4", "uhc": "", "diapot": "LT5", "nethpot": "LT5", "smp": "", "crystal": "", "mace": "HT5", "spear": "HT5" },
    { "name": "citronyx1", "sword": "HT5", "axe": "LT5", "uhc": "", "diapot": "", "nethpot": "", "smp": "", "crystal": "LT5", "mace": "HT5", "spear": "" },
    { "name": "Jirkafogus", "sword": "HT4", "axe": "HT4", "uhc": "LT3", "diapot": "HT4", "nethpot": "", "smp": "LT3", "crystal": "HT5", "mace": "", "spear": "LT3" },
    { "name": "SetProfile", "sword": "LT3", "axe": "", "uhc": "", "diapot": "", "nethpot": "LT4", "smp": "", "crystal": "LT5", "mace": "HT5", "spear": "LT5" },
    { "name": "FaZeTraRanTula", "sword": "HT3", "axe": "", "uhc": "", "diapot": "", "nethpot": "", "smp": "", "crystal": "", "mace": "HT5", "spear": "" },
    { "name": "ItzLunas", "sword": "LT4", "axe": "", "uhc": "", "diapot": "", "nethpot": "", "smp": "", "crystal": "LT4", "mace": "", "spear": "" },
    { "name": "Vojtas_", "sword": "HT4", "axe": "", "uhc": "HT5", "diapot": "", "nethpot": "", "smp": "HT5", "crystal": "", "mace": "HT5", "spear": "" },
    { "name": "doge_cg", "sword": "", "axe": "LT4", "uhc": "", "diapot": "", "nethpot": "", "smp": "", "crystal": "", "mace": "", "spear": "" },
    { "name": "vlk_1", "sword": "LT5", "axe": "", "uhc": "", "diapot": "", "nethpot": "", "smp": "", "crystal": "", "mace": "", "spear": "" },
    { "name": "Terry885522", "sword": "LT5", "axe": "", "uhc": "", "diapot": "", "nethpot": "", "smp": "", "crystal": "", "mace": "", "spear": "LT5" }
];

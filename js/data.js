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
    { "name": "ItzRealMe", "sword": "HT3", "axe": "HT1", "uhc": "HT1", "diapot": "HT1", "nethpot": "HT1", "smp": "LT2", "crystal": "LT2", "mace": "LT2", "spear": "" },
    { "name": "coldified", "sword": "LT1", "axe": "LT1", "uhc": "LT1", "diapot": "LT1", "nethpot": "LT1", "smp": "HT2", "crystal": "LT3", "mace": "HT1", "spear": "LT2" },
    { "name": "Swight", "sword": "HT1", "axe": "HT1", "uhc": "LT2", "diapot": "LT2", "nethpot": "HT3", "smp": "LT3", "crystal": "HT1", "mace": "LT2", "spear": "" },
    { "name": "janekv", "sword": "HT2", "axe": "LT2", "uhc": "HT3", "diapot": "LT3", "nethpot": "LT3", "smp": "HT1", "crystal": "HT1", "mace": "LT2", "spear": "" },
    { "name": "BlvckWlf", "sword": "HT2", "axe": "LT2", "uhc": "HT3", "diapot": "LT3", "nethpot": "LT3", "smp": "HT1", "crystal": "HT1", "mace": "LT2", "spear": "" },
    { "name": "Kylaz", "sword": "HT1", "axe": "LT1", "uhc": "HT3", "diapot": "LT3", "nethpot": "LT3", "smp": "HT1", "crystal": "LT2", "mace": "", "spear": "" },
    { "name": "jaknox", "sword": "LT3", "axe": "LT3", "uhc": "HT4", "diapot": "HT4", "nethpot": "HT4", "smp": "HT4", "crystal": "HT4",

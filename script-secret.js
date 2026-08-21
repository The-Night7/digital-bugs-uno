// --- CONSTANTS ---
// RATIOS DE STATISTIQUES (Ratio * Niveau = Stat)
const statRatios = {
    power: 1.3,
    defense: 1.1,
    speed: 1,
    recovery: 0.5,
    trick: 1.8
};

// --- NAVIGATION LOGIC ---
function switchView(viewName) {
    const views = {
        profile: document.getElementById('view-profile'),
        deck: document.getElementById('view-deck'),
        history: document.getElementById('view-history')
    };
    const btns = {
        profile: document.getElementById('btn-profile'),
        deck: document.getElementById('btn-deck'),
        history: document.getElementById('btn-history')
    };

    // Reset all
    Object.values(views).forEach(el => el.classList.add('hidden'));
    Object.values(btns).forEach(el => {
        el.classList.remove('active', 'text-black', 'font-bold');
        el.classList.add('text-slate-400');
    });

    // Activate selected
    if (views[viewName]) {
        views[viewName].classList.remove('hidden');
        btns[viewName].classList.add('active');
        btns[viewName].classList.remove('text-slate-400');
    }
}

// --- CARD DATABASE (New Ratios: 0.0 to 1.0 based on Kaito's PWR/DEF/SPD/REC) ---
const cardDatabase = [
    { id: 'm1', name: 'Hivebyte Luxling', type: 'monster', icon: 'fa-lightbulb', levelReq: 1.0, descReal: "Lumière : Invoque un insecte depuis le Cimetière.", descVirtual: "Data Recovery : Restaure des données perdues.", atkRatio: 0.2, defRatio: 0.8, spdRatio: 0.8, recRatio: 0.5 },
    { id: 'm2', name: 'Hivebyte Centipuls', type: 'monster', icon: 'fa-bugs', levelReq: 2.0, descReal: "Mille-pattes : Invoque du deck au changement de mode.", descVirtual: "Search Index : Scanne la base pour un script.", atkRatio: 0.6, defRatio: 0.6, spdRatio: 0.5, recRatio: 0.3 },
    { id: 'm3', name: 'Hivebyte Webforge', type: 'monster', icon: 'fa-spider', levelReq: 2.5, descReal: "Araignée : Change position cible, def à 0.", descVirtual: "Firewall Breach : Force l'ouverture des ports.", atkRatio: 0.3, defRatio: 0.9, spdRatio: 0.3, recRatio: 0.6 },
    { id: 'm4', name: 'Hivebyte Glimmerwing', type: 'monster', icon: 'fa-sun', levelReq: 3.0, descReal: "Coccinelle : Pioche 1 carte.", descVirtual: "Data Mining : Analyse flux pour info bonus.", atkRatio: 0.1, defRatio: 0.2, spdRatio: 0.7, recRatio: 0.2 },
    { id: 'm5', name: 'Hivebyte Ryder-Log', type: 'monster', icon: 'fa-motorcycle', levelReq: 3.5, descReal: "Cavalier : Donne 'Perçant' à l'unité évoluée.", descVirtual: "Rootkit Driver : Contourne protections natives.", atkRatio: 0.8, defRatio: 0.4, spdRatio: 0.9, recRatio: 0.2 },
    { id: 'm6', name: 'Hivebyte Nebulworm', type: 'monster', icon: 'fa-worm', levelReq: 4.0, descReal: "Ver : Invoque Jeton (Clone).", descVirtual: "Worm Replica : Crée copie fantôme.", atkRatio: 0.5, defRatio: 0.5, spdRatio: 0.2, recRatio: 0.8 },
    { id: 'm7', name: 'Hivebyte Sparkwasp', type: 'monster', icon: 'fa-bolt', levelReq: 4.2, descReal: "Guêpe : Donne 'Perçant'.", descVirtual: "Penetration Tester : Diagnostic offensif.", atkRatio: 0.9, defRatio: 0.2, spdRatio: 0.8, recRatio: 0.2 },
    { id: 'e1', name: 'Hivecore Vector-20', type: 'evo', icon: 'fa-star', levelReq: 3.0, descReal: "Fourmi : Boost ATK de 300.", descVirtual: "System Overclock : Boost cadence processus.", atkRatio: 0.8, defRatio: 0.8, spdRatio: 0.7, recRatio: 0.4 },
    { id: 'e2', name: 'Hivecore Scarabank', type: 'evo', icon: 'fa-shield-halved', levelReq: 3.5, descReal: "Scarabée Tank : Annule effet + change position.", descVirtual: "Packet Sniffer : Bloque paquets suspects.", atkRatio: 0.7, defRatio: 1.0, spdRatio: 0.4, recRatio: 0.9 },
    { id: 'e3', name: 'Hivecore Coredrill', type: 'evo', icon: 'fa-dungeon', levelReq: 5.0, descReal: "Foreur : Mélange défenseur dans deck.", descVirtual: "Kernel Panic : Force reboot sous-système.", atkRatio: 0.9, defRatio: 0.7, spdRatio: 0.6, recRatio: 0.5 },
    { id: 'e4', name: 'Hivecore Rhinovault', type: 'evo', icon: 'fa-chess-rook', levelReq: 6.5, descReal: "Colosse : Attaque tout + perçant.", descVirtual: "System Purge : Nettoyage disque complet.", atkRatio: 1.0, defRatio: 1.0, spdRatio: 0.7, recRatio: 1.0 },
    { id: 's1', name: 'Hive Broadcast', type: 'spell', icon: 'fa-tower-broadcast', levelReq: 1.5, descReal: "Activation rapide : évolution instantanée.", descVirtual: "Hotfix Patch : Mise à jour critique instantanée." },
    { id: 's2', name: 'Lag Trip', type: 'spell', icon: 'fa-person-falling', levelReq: 4.0, descReal: "Continu : Invocations passent en Défense.", descVirtual: "Lag Switch : Force mode 'Veille'." },
    { id: 's3', name: 'Cache Purge', type: 'spell', icon: 'fa-tombstone', levelReq: 2.5, descReal: "Envoie monstre au cimetière.", descVirtual: "Cache Dump : Envoie données en cache." },
    { id: 's4', name: 'Signal Squall', type: 'spell', icon: 'fa-wind', levelReq: 3.0, descReal: "Détruit Magie/Piège.", descVirtual: "Process Kill : Termine application." },
    { id: 't1', name: 'Hive Recall', type: 'trap', icon: 'fa-kit-medical', levelReq: 2.0, descReal: "Rappelle 2 insectes.", descVirtual: "Backup Restore : Restauration système." },
    { id: 't2', name: 'Reflect Protocol', type: 'trap', icon: 'fa-mirror', levelReq: 5.0, descReal: "Miroir : Renvoie l'attaque physique.", descVirtual: "DDoS Reflection : Renvoie trafic malveillant." }
];

function renderDeck(currentLevel, kaitoPower, kaitoDefense, kaitoSpeed, kaitoRecovery) {
    const sections = {
        monster: document.getElementById('deck-monsters'),
        evo: document.getElementById('deck-evo'),
        spell: document.getElementById('deck-spells'),
        trap: document.getElementById('deck-traps')
    };
    document.getElementById('total-cards-db').innerText = cardDatabase.length;
    Object.values(sections).forEach(el => el.innerHTML = '');

    cardDatabase.forEach(card => {
        const isLocked = currentLevel < card.levelReq;
        const opacity = isLocked ? 'opacity-50 grayscale' : '';
        const lockIcon = isLocked ? '<div class="absolute inset-0 flex items-center justify-center bg-black/60 z-20"><i class="fa-solid fa-lock text-2xl text-slate-500"></i></div>' : '';
        const reqText = isLocked ? `<span class="text-red-500 font-bold">Lvl ${card.levelReq}</span>` : `<span class="text-green-500">Débloqué</span>`;
        let cardClass = card.type === 'monster' ? 'card-monster' : card.type === 'evo' ? 'card-evo' : card.type === 'spell' ? 'card-spell' : 'card-trap';

        // Calculate Stats for Monsters/Evolutions (Integer, max Kaito's stats)
        let statBlock = '';
        if (card.type === 'monster' || card.type === 'evo') {
            const atk = Math.round(kaitoPower * card.atkRatio);
            const def = Math.round(kaitoDefense * card.defRatio);
            const spd = Math.round(kaitoSpeed * card.spdRatio);
            const rec = Math.round(kaitoRecovery * card.recRatio);
            statBlock = `
            <div class="grid grid-cols-2 gap-x-2 gap-y-0.5 mt-1 pt-1 border-t border-white/20 text-[8px] font-mono">
                <span class="text-orange-300">PWR ${atk}</span>
                <span class="text-blue-300 text-right">DEF ${def}</span>
                <span class="text-yellow-300">SPD ${spd}</span>
                <span class="text-green-300 text-right">REC ${rec}</span>
            </div>`;
        }

        const html = `
            <div class="hive-card ${cardClass} ${opacity}">
                ${lockIcon}
                <div class="flex justify-between items-center mb-1">
                    <span class="text-[10px] font-bold text-white truncate w-2/3">${card.name}</span>
                    <div class="text-[8px] bg-black/50 px-1 rounded text-white border border-white/20">${card.type.toUpperCase().substring(0,3)}</div>
                </div>
                <div class="card-art"><i class="fa-solid ${card.icon} text-4xl text-white/80"></i></div>
                <div class="card-desc-box">
                    <div class="mb-1 border-b border-black/20 pb-1"><strong>[Physique]</strong><br>${card.descReal}</div>
                    <div class="mb-1"><strong>[Virtuel]</strong><br>${card.descVirtual}</div>
                </div>
                ${statBlock}
                <div class="mt-1 text-[8px] text-center bg-black/80 text-white rounded py-0.5">${reqText}</div>
            </div>`;
        if(sections[card.type]) sections[card.type].innerHTML += html;
    });
}

// --- EVOLUTION LORE (COMPLETE & DETAILED) ---
const evolutionLore = [
    {
        min: 1.0, max: 1.9, tier: "Low Tier",
        mastery: "La capacité est embryonnaire. Kaito doit tenir la carte physique en main pour l'activer. L'insecte généré est une simple projection lumineuse sans masse, incapable d'interagir avec la matière. Utilisé pour éclairer ou surprendre.",
        descP: "Négligeable. Aucun impact cinétique, tout juste capable d'éblouir.",
        descD: "La carte en main durcit légèrement, parant à peine une griffure.",
        descT: "Confusion basique. Peut perturber des capteurs optiques très simples.",
        descS: "Aucune amélioration. Vitesse humaine standard."
    },
    {
        min: 2.0, max: 3.4, tier: "Mid Tier",
        mastery: "Matérialisation réussie. Les insectes sortent des cartes et atteignent la taille d'un chat domestique, composés de voxels solides. Kaito peut effectuer des piratages de proximité en posant physiquement une carte sur l'appareil cible (verrou électronique, caméra).",
        descP: "Morsures électriques mineures, capables d'engourdir un membre ou de brûler la peau.",
        descD: "Les carapaces de voxels sont assez dures pour bloquer un coup de poing standard.",
        descT: "Hacking par contact direct. Peut mettre en boucle une caméra de surveillance.",
        descS: "Les insectes sont vifs et autonomes, mais l'utilisateur reste à vitesse humaine.",
    },
    {
        min: 3.5, max: 4.9, tier: "Elite Tier",
        mastery: "Contrôle tactique avancé. Kaito peut changer instantanément le mode de ses insectes (Attaque/Défense). Le hacking devient distant via des micro-insectes espions qui infiltrent les ports de données. Invocations de taille humaine.",
        descP: "Scaradiator peut broyer du métal léger et causer des fractures.",
        descD: "Peut ériger un mur de 'Websolder' résistant à plusieurs assauts physiques.",
        descT: "Hacking avancé : infiltration et neutralisation de systèmes de sécurité proches (caméras, serrures, alarmes).",
        descS: "Mobilité accrue : Peut se faire tracter ou porter par un insecte volant.",
    },
    {
        min: 5.0, max: 5.9, tier: "High Tier",
        mastery: "Dématérialisation du support : les cartes apparaissent comme des hologrammes autour de lui, sans besoin de les tenir en main. Fusion d'insectes pour créer des formes évoluées.",
        descP: "Destruction structurelle. Corebage peut percer des murs en béton armé.",
        descD: "Esquive d'urgence : dématérialisation corporelle d'une seconde pour éviter un coup dangereux, au prix d'un temps de recharge.",
        descT: "Piratage étendu : prise de contrôle de systèmes connectés dans un rayon élargi (caméras, serrures, feux de circulation).",
        descS: "Traitement accéléré de l'information, qui améliore nettement ses réflexes en combat rapproché.",
    },
    {
        min: 6.0, max: 7.9, tier: "God Tier",
        mastery: "Invocation sans limite de mode et piratage renforcé. Kaito peut faire apparaître son Boss 'Rhinovault', une forteresse volante autonome, et prendre le contrôle de systèmes connectés isolés à portée (sécurité, véhicules).",
        descP: "Catastrophique. Rhinovault et les évolutions de rang supérieur peuvent raser un petit bâtiment.",
        descD: "Régénération accélérée : des scripts de réparation referment ses blessures en quelques secondes.",
        descT: "Accès root sur la plupart des systèmes de sécurité et véhicules connectés à portée.",
        descS: "Invocation instantanée : n'importe quelle carte du deck peut être activée sans délai.",
    },
    {
        min: 8.0, max: 10.0, tier: "Max Tier",
        mastery: "Maîtrise complète de l'Arsenal Digital Hive. Kaito peut invoquer et faire agir simultanément plusieurs cartes de son deck, et maintenir une connexion à de nombreux réseaux à portée.",
        descP: "Extrême : invocation simultanée de plusieurs évolutions et monstres de rang supérieur.",
        descD: "Protocoles défensifs multiples actifs en permanence : pièges et scripts de protection se déclenchent automatiquement.",
        descT: "Accès root simultané sur plusieurs systèmes connectés à portée, sans délai entre les cibles.",
        descS: "Activation rapide de plusieurs cartes du deck, sans délai ni limite de mode.",
    }
];

// --- CHART SETUP ---
const ctx = document.getElementById('statsChart').getContext('2d');
let gradient = ctx.createLinearGradient(0, 0, 0, 400);
gradient.addColorStop(0, 'rgba(234, 179, 8, 0.5)'); gradient.addColorStop(1, 'rgba(185, 28, 28, 0.1)'); // Yellow/Red
let radarChart = new Chart(ctx, {
    type: 'radar',
    data: {
        labels: ['POWER', 'DEFENSE', 'SPEED', 'RECOVERY', 'TRICK'],
        datasets: [{ label: 'Stats', data: [1, 1, 1, 1, 1], backgroundColor: gradient, borderColor: '#eab308', borderWidth: 2, pointBackgroundColor: '#fff', pointBorderColor: '#b91c1c' }]
    },
    options: {
        responsive: true, maintainAspectRatio: true,
        scales: {
            r: {
                min: 0,
                max: 10,
                angleLines: { color: 'rgba(255,255,255,0.05)' },
                grid: { color: 'rgba(255,255,255,0.1)' },
                pointLabels: { color: '#fbbf24', font: { family: 'Orbitron', size: 10 } },
                ticks: { display: false, stepSize: 2 }
            }
        },
        plugins: { legend: { display: false } },

        layout: {
            padding: {
                top: 25,
                bottom: 25,
                left: 25,
                right: 25
            }
        }
    }
});

// --- MAIN LOGIC ---
const slider = document.getElementById('level-slider');
const levelDisplay = document.getElementById('level-display');
const tierLabel = document.getElementById('tier-label');
const studentId = document.getElementById('student-id');

function updateUI(levelVal) {
    // Parse input safely
    const level = parseFloat(levelVal) / 10;
    levelDisplay.innerText = level.toFixed(1);
    studentId.innerText = `BUR-${Math.floor(level * 1024 + 500)}-EM`;

    // 1. CALCUL DES STATS (Formule: Max(1, Math.round(Niveau * Ratio)))
    const p = Math.max(1, Math.round(level * statRatios.power));
    const d = Math.max(1, Math.round(level * statRatios.defense));
    const s = Math.max(1, Math.round(level * statRatios.speed));
    const r = Math.max(1, Math.round(level * statRatios.recovery));
    const t = Math.max(1, Math.round(level * statRatios.trick));

    // Update Graph
    radarChart.data.datasets[0].data = [p, d, s, r, t];
    radarChart.update();

    // Update Text
    document.getElementById('val-power').innerText = p;
    document.getElementById('val-defense').innerText = d;
    document.getElementById('val-speed').innerText = s;
    document.getElementById('val-recovery').innerText = r;
    document.getElementById('val-trick').innerText = t;

    // 2. LORE & TIER
    let lore = evolutionLore.find(d => level >= d.min && level <= d.max);
    if (!lore) lore = evolutionLore[evolutionLore.length - 1];

    tierLabel.innerText = lore.tier;
    document.getElementById('rank-label').innerText = lore.tier;
    tierLabel.className = "text-sm font-bold tracking-widest px-2 py-1 rounded border uppercase ";
    if(lore.tier.includes("God") || lore.tier.includes("Max")) tierLabel.className += "bg-pink-950/50 border-pink-500 text-pink-400";
    else if(lore.tier.includes("High")) tierLabel.className += "bg-red-950/50 border-red-500 text-red-400";
    else if(lore.tier.includes("Elite")) tierLabel.className += "bg-cyan-950/50 border-cyan-500 text-cyan-400";
    else if(lore.tier.includes("Mid")) tierLabel.className += "bg-yellow-950/50 border-yellow-500 text-yellow-400";
    else tierLabel.className += "bg-slate-800 border-slate-600 text-slate-400";

    document.getElementById('mastery-content').innerHTML = lore.mastery;
    document.getElementById('desc-power').innerText = lore.descP;
    document.getElementById('desc-defense').innerText = lore.descD;
    document.getElementById('desc-trick').innerText = lore.descT;
    document.getElementById('desc-speed').innerText = lore.descS;

    // 3. EXTRAS (Hacking & Passive)
    let rawHack = (level / 10) * 100;
    if(level > 6.0) rawHack += 20;
    const hackPot = Math.min(100, rawHack).toFixed(1);

    document.getElementById('trick-bar').style.width = hackPot + "%";
    document.getElementById('hack-potential').innerText = hackPot + "%";

    // --- PASSIVE DESCRIPTION UPDATE (REBUILT LOGIC) ---
    const passiveBlock = document.getElementById('passive-block');

    if (level >= 5.0) {
        // UNLOCKED STATE
        const isGod = level >= 6.0;
        // Completely reset class string to ensure no "grayscale" remains
        passiveBlock.className = "bg-slate-900 border border-yellow-500 p-4 rounded relative overflow-hidden transition-all duration-300 shadow-lg shadow-yellow-500/20";

        // Rebuild innerHTML
        passiveBlock.innerHTML = `
            <div class="absolute -right-2 -top-2 text-6xl text-yellow-500/20">
                <i class="fa-solid ${isGod ? 'fa-eye' : 'fa-wifi'}"></i>
            </div>
            <h4 class="text-xs text-yellow-500 font-bold uppercase mb-1 tracking-wider">
                <i class="fa-solid fa-unlock-keyhole mr-1"></i> Passif Éveillé
            </h4>
            <div class="text-sm font-bold text-white mb-2 font-mono">
                ${isGod ? 'Network Root (Accès Racine)' : 'Network Sense (Sens Réseau)'}
            </div>
            <p class="text-xs text-slate-400 leading-relaxed">
                ${isGod ? 'Kaito maintient une connexion à de nombreux réseaux et appareils à portée, ce qui lui permet d\'invoquer rapidement les cartes de son deck, sans limite de mode.' : 'Kaito perçoit les ondes et appareils électroniques actifs dans un rayon de 50m. Aucune embuscade technologique n\'est possible.'}
            </p>
        `;
    } else {
        // LOCKED STATE
        passiveBlock.className = "bg-slate-900/50 border border-slate-700 p-4 rounded relative overflow-hidden transition-all duration-300 opacity-50 grayscale";

        passiveBlock.innerHTML = `
            <div class="absolute -right-2 -top-2 text-6xl text-slate-800/50">
                <i class="fa-solid fa-lock"></i>
            </div>
            <h4 class="text-xs text-slate-500 font-bold uppercase mb-1 tracking-wider">
                <i class="fa-solid fa-lock mr-1"></i> Passif Verrouillé
            </h4>
            <div class="text-sm font-bold text-slate-400 mb-2 font-mono">???</div>
            <p class="text-xs text-slate-500 leading-relaxed italic">
                Niveau 5.0+ requis pour l'éveil.
            </p>
        `;
    }

    renderDeck(level, p, d, s, r);
}

slider.addEventListener('input', (e) => updateUI(e.target.value));

// Initial call
slider.value = 68;
updateUI(68);

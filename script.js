let boldoCount = 0;
let rps = 0;

const upgrades = [
    { name: "Dickling", cost: 15, rps: 1, count: 0, unlockAt: 0, desc: "An average sized dick." },
    { name: "Uncle", cost: 100, rps: 5, count: 0, unlockAt: 100, desc: "Classic uncle molester." },
    { name: "Gang", cost: 1200, rps: 50, count: 0, unlockAt: 1200, desc: "Gang rape." },
    { name: "Prison", cost: 5000, rps: 150, count: 0, unlockAt: 5000, desc: "Don't drop the soap." },
    { name: "Huvita", cost: 10000, rps: 500, count: 0, unlockAt: 10000, desc: "Ultimate diddler." }
];

function initShop() {
    const tableBody = document.getElementById("upgrades-table-body");
    tableBody.innerHTML = "";
    
    upgrades.forEach((up, i) => {
        const row = document.createElement("tr");
        row.id = `row-${i}`;

        row.innerHTML = `
            <td><b>${up.name}</b></td>
            <td>${up.desc} (+${up.rps} RPS)</td>
            <td id="cost-${i}">${up.cost}</td>
            <td id="count-${i}" align="center">0</td>
            <td align="center">
                <button id="btn-${i}" onclick="buyUpgrade(${i})">BUY</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

function clickBoldo() {
    boldoCount++;
    updateUI();
}

function buyUpgrade(i) {
    if (boldoCount >= upgrades[i].cost) {
        boldoCount -= upgrades[i].cost;
        upgrades[i].count++;
        // Increase cost by 15% each time you buy
        upgrades[i].cost = Math.ceil(upgrades[i].cost * 1.15);
        calculateRPS();
        updateUI();
    }
}

function calculateRPS() {
    rps = upgrades.reduce((acc, up) => acc + (up.count * up.rps), 0);
}

function updateUI() {
    document.getElementById("score").innerText = Math.floor(boldoCount);
    document.getElementById("rps").innerText = rps;

    upgrades.forEach((up, i) => {
        const btn = document.getElementById(`btn-${i}`);
        const costTd = document.getElementById(`cost-${i}`);
        const countTd = document.getElementById(`count-${i}`);

        costTd.innerText = up.cost;
        countTd.innerText = up.count;

        // BALANCE-BASED SHOP LOGIC
        if (boldoCount >= up.cost) {
            btn.disabled = false;
            btn.innerText = "BUY";
        } else {
            btn.disabled = true;
            btn.innerText = "NOT ENOUGH RAPES";
        }
    });
}

// SAVE/LOAD LOGIC
function saveGame() {
    const gameState = { 
        boldoCount, 
        upgrades: upgrades.map(u => ({ name: u.name, count: u.count, cost: u.cost })) 
    };
    const blob = new Blob([JSON.stringify(gameState)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "boldo_save.json";
    link.click();
}

function triggerLoad() { document.getElementById('file-selector').click(); }

document.getElementById('file-selector').addEventListener('change', function(event) {
    const reader = new FileReader();
    reader.onload = function(e) {
        const loadedData = JSON.parse(e.target.result);
        boldoCount = loadedData.boldoCount;
        loadedData.upgrades.forEach(savedUp => {
            const gameUp = upgrades.find(u => u.name === savedUp.name);
            if (gameUp) { gameUp.count = savedUp.count; gameUp.cost = savedUp.cost; }
        });
        calculateRPS();
        updateUI();
    };
    reader.readAsText(event.target.files[0]);
});

// Passive generation loop
setInterval(() => {
    if (rps > 0) {
        boldoCount += rps / 10;
        updateUI();
    }
}, 100);

initShop();
updateUI();
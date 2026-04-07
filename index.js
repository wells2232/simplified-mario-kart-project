const characters = [
    { NOME : "Mario", IMAGEM: "./public/mario.gif", VELOCIDADE : 4, MANOBRABILIDADE : 3, PODER : 3, PONTOS : 0 },
    { NOME : "Luigi", IMAGEM: "./public/luigi.gif", VELOCIDADE : 3, MANOBRABILIDADE : 4, PODER : 4, PONTOS : 0 },
    { NOME : "Yoshi", IMAGEM: "./public/yoshi.gif", VELOCIDADE : 2, MANOBRABILIDADE : 4, PODER : 3, PONTOS : 0 },
    { NOME : "Peach", IMAGEM: "./public/peach.gif", VELOCIDADE : 3, MANOBRABILIDADE : 4, PODER : 2, PONTOS : 0 },
    { NOME : "Bowser", IMAGEM: "./public/bowser.gif", VELOCIDADE : 5, MANOBRABILIDADE : 2, PODER : 5, PONTOS : 0 },
    { NOME : "Donkey Kong", IMAGEM: "./public/dk.gif", VELOCIDADE : 2, MANOBRABILIDADE : 2, PODER : 5, PONTOS : 0 }
];

const menu = document.getElementById("menu");
const selectionTitle = document.getElementById("selectionTitle");
const selectionStatus = document.getElementById("selectionStatus");
const selectionScreen = document.getElementById("selectionScreen");
const raceScreen = document.getElementById("raceScreen");
const battleInfo = document.getElementById("battleInfo");
const player1Card = document.getElementById("player1Card");
const logElement = document.getElementById("log");
const restartBtn = document.getElementById("restartBtn");

const player2Card = document.getElementById("player2Card");

let currentIndex = 0;
let firstPlayer = null;
let secondPlayer = null;
let selectionPhase = 1; // 1 para o primeiro jogador, 2 para o segundo
let raceStarted = false;

function cloneCharacter(character) {
    return {
        NOME: character.NOME,
        IMAGEM: character.IMAGEM,
        VELOCIDADE: character.VELOCIDADE,
        MANOBRABILIDADE: character.MANOBRABILIDADE,
        PODER: character.PODER,
        PONTOS: 0
    };
    }

let menuItems = [];

function initializeMenu() {
    menu.innerHTML = "";
    menuItems = [];

    characters.forEach((char, index) => {
        const div = document.createElement("div");
        div.classList.add("menu-item");
        const img = document.createElement("img");
        const name = document.createElement("span");
        img.src = char.IMAGEM;
        name.textContent = char.NOME;
        div.appendChild(img);
        div.appendChild(name);

        div.addEventListener("click", () => {
            currentIndex = index;
            updateMenuSelection();
            confirmSelection();
        }) 

        menu.appendChild(div);
        menuItems.push(div);
    });

    updateMenuSelection();
}

function updateMenuSelection() {
    menuItems.forEach((item, index) => {
        if (index === currentIndex) {
            item.classList.add("active");
        } else {
            item.classList.remove("active");
        }
    });
}

function renderMenu() {
    updateMenuSelection();
}

function confirmSelection() {
    const selected = characters[currentIndex];

    if (selectionPhase === 1) {
        firstPlayer = cloneCharacter(selected);
        selectionPhase = 2;
        updateSelectionUI();
        return;
    } else if (selectionPhase === 2) {
        if (selected.NOME === firstPlayer.NOME) {
            alert("Personagem já selecionado! Escolha outro.");
            return;
        }
        secondPlayer = cloneCharacter(selected);
        updateSelectionUI();
        startRace();
    }
} 

function renderPlayerCards() {
    console.log("First Player:", firstPlayer);
    console.log("Second Player:", secondPlayer);
    player1Card.innerHTML = `
        <img src="${firstPlayer.IMAGEM}" alt="${firstPlayer.NOME}" style="width: 100px; height: 100px;" />
        <div>
            <h3>${firstPlayer.NOME}</h3>
            <div>Velocidade: ${firstPlayer.VELOCIDADE}</div>
            <div>Manobrabilidade: ${firstPlayer.MANOBRABILIDADE}</div>
            <div>Poder: ${firstPlayer.PODER}</div>
            <div><strong>Pontos: ${firstPlayer.PONTOS}</strong></div>
        </div>
    `;

    player2Card.innerHTML = `
        <img src="${secondPlayer.IMAGEM}" alt="${secondPlayer.NOME}" style="width: 100px; height: 100px;" />
        <div>
            <h3>${secondPlayer.NOME}</h3>
            <div>Velocidade: ${secondPlayer.VELOCIDADE}</div>
            <div>Manobrabilidade: ${secondPlayer.MANOBRABILIDADE}</div>
            <div>Poder: ${secondPlayer.PODER}</div>
            <div><strong>Pontos: ${secondPlayer.PONTOS}</strong></div>
        </div>
    `;
}


function addLog(text = "") {
    logElement.textContent += text + "\n";
    logElement.scrollTop = logElement.scrollHeight;
}

function updateSelectionUI() {
    selectionTitle.textContent =
        selectionPhase === 1
        ? "Escolha o primeiro competidor"
        : "Escolha o segundo competidor";

    selectionStatus.innerHTML =
        `Player 1: ${firstPlayer ? firstPlayer.NOME : "não selecionado"}<br>` +
        `Player 2: ${secondPlayer ? secondPlayer.NOME : "não selecionado"}`;
}

function rollDice() {
    return Math.floor(Math.random() * 6) + 1;
}

function getRandomBlock() {
    const random = Math.random();

    if (random < 0.33) return "RETA";
    if (random < 0.66) return "CURVA";
    return "CONFRONTO";
}

function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function logRollResult(characterName, block, diceResult, attribute) {
    addLog(`${characterName} 🎲 rolou em ${block}: ${diceResult} + ${attribute} = ${diceResult + attribute}`);
}

async function playRaceEngine(character1, character2) {
    for (let round = 1; round <= 5; round++) {
        addLog(`🏁 Rodada ${round}`);

        const block = getRandomBlock();
        addLog(`Bloco: ${block}`);

        const diceResult1 = rollDice();
        const diceResult2 = rollDice();

        let totalTestSkill1 = 0;
        let totalTestSkill2 = 0;

        if (block === "RETA") {
        totalTestSkill1 = diceResult1 + character1.VELOCIDADE;
        totalTestSkill2 = diceResult2 + character2.VELOCIDADE;

        logRollResult(character1.NOME, "VELOCIDADE", diceResult1, character1.VELOCIDADE);
        logRollResult(character2.NOME, "VELOCIDADE", diceResult2, character2.VELOCIDADE);
        }

        if (block === "CURVA") {
        totalTestSkill1 = diceResult1 + character1.MANOBRABILIDADE;
        totalTestSkill2 = diceResult2 + character2.MANOBRABILIDADE;

        logRollResult(character1.NOME, "MANOBRABILIDADE", diceResult1, character1.MANOBRABILIDADE);
        logRollResult(character2.NOME, "MANOBRABILIDADE", diceResult2, character2.MANOBRABILIDADE);
        }

        if (block === "CONFRONTO") {
        totalTestSkill1 = diceResult1 + character1.PODER;
        totalTestSkill2 = diceResult2 + character2.PODER;

        addLog(`${character1.NOME} confrontou com ${character2.NOME}! 🥊`);

        logRollResult(character1.NOME, "PODER", diceResult1, character1.PODER);
        logRollResult(character2.NOME, "PODER", diceResult2, character2.PODER);

        if (totalTestSkill1 > totalTestSkill2) {
            if (character2.PONTOS > 0) {
            addLog(`${character1.NOME} venceu o confronto! ${character2.NOME} perdeu 1 ponto. 🐢`);
            character2.PONTOS--;
            } else {
            addLog(`${character2.NOME} está com 0 pontos, não pode ficar negativo.`);
            }
        }

        if (totalTestSkill2 > totalTestSkill1) {
            if (character1.PONTOS > 0) {
            addLog(`${character2.NOME} venceu o confronto! ${character1.NOME} perdeu 1 ponto. 🐢`);
            character1.PONTOS--;
            } else {
            addLog(`${character1.NOME} está com 0 pontos, não pode ficar negativo.`);
            }
        }

        if (totalTestSkill1 === totalTestSkill2) {
            addLog("Confronto empatado! Nenhum ponto perdido!");
        }
        }

        if (block !== "CONFRONTO") {
        if (totalTestSkill1 > totalTestSkill2) {
            addLog(`${character1.NOME} marcou 1 ponto!`);
            character1.PONTOS++;
        } else if (totalTestSkill2 > totalTestSkill1) {
            addLog(`${character2.NOME} marcou 1 ponto!`);
            character2.PONTOS++;
        } else {
            addLog("Rodada empatada!");
        }
        }

        renderPlayerCards();
        addLog("------------------------------------------------");
        await wait(1000);
    }
}

    function declareWinner(character1, character2) {
    addLog("Resultado Final:");
    addLog(`${character1.NOME}: ${character1.PONTOS} ponto(s)`);
    addLog(`${character2.NOME}: ${character2.PONTOS} ponto(s)`);

    if (character1.PONTOS > character2.PONTOS) {
        addLog(`🏆 ${character1.NOME} venceu a corrida!`);
    } else if (character2.PONTOS > character1.PONTOS) {
        addLog(`🏆 ${character2.NOME} venceu a corrida!`);
    } else {
        addLog("EMPATE!");
    }
}   

async function startRace() {
    raceStarted = true;
    selectionScreen.classList.add("hidden");
    raceScreen.classList.remove("hidden");

    battleInfo.innerHTML = `🏁🚨 Corrida entre <strong>${firstPlayer.NOME}</strong> e <strong>${secondPlayer.NOME}</strong> começando...`;

    logElement.textContent = "";
    renderPlayerCards();

    await playRaceEngine(firstPlayer, secondPlayer);
    declareWinner(firstPlayer, secondPlayer);
}

function resetGame() {
    currentIndex = 0;
    firstPlayer = null;
    secondPlayer = null;
    selectionPhase = 1;
    raceStarted = false;

    selectionScreen.classList.remove("hidden");
    raceScreen.classList.add("hidden");

    updateSelectionUI();
    initializeMenu();
}

window.addEventListener("keydown", (e) => {
    if (raceStarted) return;

    console.log("Tecla pressionada:", e.key);

    if (e.key === "ArrowUp" || e.key.toLowerCase() === "w") {
        currentIndex = (currentIndex - 1 + characters.length) % characters.length;
        renderMenu();
    } else if (e.key === "ArrowDown" || e.key.toLowerCase() === "s") {
        currentIndex = (currentIndex + 1) % characters.length;
        renderMenu();
    } else if (e.key === "Enter" || e.key.toLowerCase() === "e") {
        confirmSelection();
    }
});

restartBtn.addEventListener("click", resetGame);

updateSelectionUI();

initializeMenu();
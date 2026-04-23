// ===========================
//  Caça Palavras — game.js
// ===========================

// ---------------------------
// 1. BANCO DE TEMAS
// ---------------------------
const THEMES = [
  {
    name: 'Animais',
    words: ['GATO', 'CACHORRO', 'LEAO', 'TIGRE', 'ZEBRA', 'GIRAFA', 'PATO', 'URSO', 'LOBO', 'COBRA']
  },
  {
    name: 'Frutas',
    words: ['MANGA', 'BANANA', 'ABACAXI', 'UVA', 'LARANJA', 'PERA', 'KIWI', 'COCO', 'LICHIA', 'GOIABA']
  },
  {
    name: 'Países',
    words: ['BRASIL', 'FRANCA', 'JAPAO', 'CANADA', 'EGITO', 'INDIA', 'CHINA', 'CUBA', 'PERU', 'CHILE']
  },
  {
    name: 'Esportes',
    words: ['FUTEBOL', 'TENIS', 'NATACAO', 'VOLEI', 'BOXE', 'GOLF', 'POLO', 'RUGBY', 'SURFE', 'HANDEBOL']
  },
  {
    name: 'Cores',
    words: ['VERMELHO', 'AZUL', 'VERDE', 'AMARELO', 'ROXO', 'LARANJA', 'ROSA', 'BRANCO', 'PRATA', 'DOURADO']
  },
  {
    name: 'Planetas',
    words: ['MERCURIO', 'VENUS', 'TERRA', 'MARTE', 'JUPITER', 'SATURNO', 'URANO', 'NEPTUNO']
  },
  {
    name: 'Profissões',
    words: ['MEDICO', 'PILOTO', 'JUIZ', 'CHEF', 'ATOR', 'PINTOR', 'MUSICO', 'BOMBEIRO', 'POLICIA', 'ARQUITETO']
  },
  {
    name: 'Instrumentos',
    words: ['VIOLAO', 'PIANO', 'FLAUTA', 'TAMBOR', 'HARPA', 'OBOE', 'TUBA', 'VIOLA', 'SAXOFONE']
  },
  {
    name: 'Alimentos',
    words: ['PIZZA', 'SUSHI', 'TACOS', 'CREPE', 'RISOTO', 'PAELLA', 'RAMEN', 'QUICHE', 'PESTO', 'FALAFEL']
  },
  {
    name: 'Tecnologia',
    words: ['INTERNET', 'CODIGO', 'DADOS', 'NUVEM', 'SERVIDOR', 'PIXEL', 'CACHE', 'REDE', 'SCRIPT', 'LOOP']
  },
];

// Cores para as palavras encontradas
const COLORS = ['#6C63FF', '#FF6584', '#43C6AC', '#F7B731', '#a29bfe'];
const FOUND_CLASSES = ['found-0', 'found-1', 'found-2', 'found-3', 'found-4'];

// ---------------------------
// 2. ESTADO DO JOGO
// ---------------------------
let SIZE = 12;        // tamanho do grid (ex: 12x12)
let WORD_COUNT = 6;   // quantidade de palavras por rodada
let grid = [];        // letras do grid [linha][coluna]
let words = [];       // palavras da rodada atual
let found = [];       // palavras já encontradas
let selecting = false;
let startCell = null;
let currentCells = [];
let timerInterval = null;
let timeLeft = 120;
let difficulty = 1;
let placedWords = []; // posições de cada palavra no grid

// ---------------------------
// 3. DIFICULDADE
// ---------------------------
function setDiff(d, btn) {
  difficulty = d;
  document.querySelectorAll('.diff-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');

  if (d === 1) { SIZE = 12; WORD_COUNT = 6;  timeLeft = 120; }
  if (d === 2) { SIZE = 14; WORD_COUNT = 8;  timeLeft = 90;  }
  if (d === 3) { SIZE = 16; WORD_COUNT = 10; timeLeft = 60;  }

  newGame();
}

// ---------------------------
// 4. NOVO JOGO
// ---------------------------
function newGame() {
  clearInterval(timerInterval);
  document.getElementById('timer-fill').style.background = '#6C63FF';

  // Escolhe um tema aleatório
  const theme = THEMES[Math.floor(Math.random() * THEMES.length)];
  document.getElementById('theme-label').textContent = 'Tema: ' + theme.name;

  // Sorteia as palavras do tema
  const shuffled = [...theme.words].sort(() => Math.random() - 0.5);
  words = shuffled.slice(0, Math.min(WORD_COUNT, shuffled.length));

  found = [];
  document.getElementById('found-count').textContent = '0';
  document.getElementById('win-banner').style.display = 'none';
  document.getElementById('hint-txt').textContent = '';

  buildGrid();
  renderWordList();
  startTimer();
}

// ---------------------------
// 5. CONSTRUÇÃO DO GRID
// ---------------------------
function buildGrid() {
  // Inicia o grid vazio
  grid = Array.from({ length: SIZE }, () => Array(SIZE).fill(''));
  placedWords = [];

  // 8 direções possíveis: horizontal, vertical, diagonal
  const dirs = [
    [0, 1], [1, 0], [1, 1], [-1, 1],
    [0, -1], [-1, 0], [-1, -1], [1, -1]
  ];

  // Tenta posicionar cada palavra
  for (const word of words) {
    let placed = false;
    let attempts = 0;

    while (!placed && attempts < 300) {
      attempts++;
      const dir = dirs[Math.floor(Math.random() * dirs.length)];
      const row = Math.floor(Math.random() * SIZE);
      const col = Math.floor(Math.random() * SIZE);
      const cells = [];
      let valid = true;

      // Verifica se a palavra cabe na posição escolhida
      for (let i = 0; i < word.length; i++) {
        const nr = row + dir[0] * i;
        const nc = col + dir[1] * i;

        if (nr < 0 || nr >= SIZE || nc < 0 || nc >= SIZE) { valid = false; break; }
        if (grid[nr][nc] !== '' && grid[nr][nc] !== word[i]) { valid = false; break; }
        cells.push([nr, nc, word[i]]);
      }

      if (valid) {
        cells.forEach(([r, c, ch]) => { grid[r][c] = ch; });
        placedWords.push({ word, cells: cells.map(([r, c]) => [r, c]) });
        placed = true;
      }
    }
  }

  // Preenche os espaços vazios com letras aleatórias
  const alpha = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      if (grid[r][c] === '') {
        grid[r][c] = alpha[Math.floor(Math.random() * alpha.length)];
      }
    }
  }

  renderGrid();
}

// ---------------------------
// 6. RENDERIZAÇÃO DO GRID
// ---------------------------
function renderGrid() {
  const el = document.getElementById('grid');
  el.style.gridTemplateColumns = `repeat(${SIZE}, var(--cell))`;
  el.innerHTML = '';

  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      const cell = document.createElement('div');
      cell.className = 'cell';
      cell.textContent = grid[r][c];
      cell.dataset.r = r;
      cell.dataset.c = c;

      // Eventos de mouse
      cell.addEventListener('mousedown', onMouseDown);
      cell.addEventListener('mouseover', onMouseOver);
      cell.addEventListener('mouseup', onMouseUp);

      // Eventos de toque (mobile)
      cell.addEventListener('touchstart', onTouchStart, { passive: false });
      cell.addEventListener('touchmove', onTouchMove, { passive: false });
      cell.addEventListener('touchend', onTouchEnd);

      el.appendChild(cell);
    }
  }

  // Cancela seleção ao soltar o mouse fora do grid
  document.addEventListener('mouseup', onMouseUp);
}

// Retorna a célula DOM de posição (r, c)
function getCell(r, c) {
  return document.querySelector(`.cell[data-r="${r}"][data-c="${c}"]`);
}

// ---------------------------
// 7. EVENTOS DE SELEÇÃO
// ---------------------------
function onMouseDown(e) {
  selecting = true;
  startCell = [+e.target.dataset.r, +e.target.dataset.c];
  currentCells = [[...startCell]];
  highlightCurrent();
}

function onMouseOver(e) {
  if (!selecting) return;
  buildLine(+e.target.dataset.r, +e.target.dataset.c);
  highlightCurrent();
}

function onMouseUp() {
  if (selecting) {
    checkWord();
    selecting = false;
    clearHighlight();
  }
}

// Touch (mobile)
function onTouchStart(e) {
  e.preventDefault();
  const touch = e.touches[0];
  const el = document.elementFromPoint(touch.clientX, touch.clientY);
  if (el && el.classList.contains('cell')) {
    selecting = true;
    startCell = [+el.dataset.r, +el.dataset.c];
    currentCells = [[...startCell]];
    highlightCurrent();
  }
}

function onTouchMove(e) {
  e.preventDefault();
  const touch = e.touches[0];
  const el = document.elementFromPoint(touch.clientX, touch.clientY);
  if (el && el.classList.contains('cell') && selecting) {
    buildLine(+el.dataset.r, +el.dataset.c);
    highlightCurrent();
  }
}

function onTouchEnd() {
  if (selecting) {
    checkWord();
    selecting = false;
    clearHighlight();
  }
}

// ---------------------------
// 8. LÓGICA DE SELEÇÃO EM LINHA
// ---------------------------
// Cria uma linha reta entre o ponto inicial e o ponto atual
function buildLine(r2, c2) {
  if (!startCell) return;
  const [r1, c1] = startCell;
  const dr = r2 - r1;
  const dc = c2 - c1;
  const steps = Math.max(Math.abs(dr), Math.abs(dc));

  if (steps === 0) { currentCells = [[r1, c1]]; return; }

  const stepR = dr / steps;
  const stepC = dc / steps;

  // Só aceita direções válidas (horizontal, vertical, diagonal exata)
  if (
    !Number.isInteger(stepR * steps) ||
    !Number.isInteger(stepC * steps) ||
    Math.abs(stepR) > 1 ||
    Math.abs(stepC) > 1
  ) {
    currentCells = [[r1, c1]];
    return;
  }

  currentCells = [];
  for (let i = 0; i <= steps; i++) {
    currentCells.push([r1 + Math.round(stepR * i), c1 + Math.round(stepC * i)]);
  }
}

// Destaca as células sendo selecionadas
function highlightCurrent() {
  document.querySelectorAll('.cell.selecting').forEach(c => c.classList.remove('selecting'));
  currentCells.forEach(([r, c]) => {
    const el = getCell(r, c);
    if (el) el.classList.add('selecting');
  });
}

function clearHighlight() {
  document.querySelectorAll('.cell.selecting').forEach(c => c.classList.remove('selecting'));
}

// ---------------------------
// 9. VERIFICAÇÃO DE PALAVRA
// ---------------------------
function checkWord() {
  const str = currentCells.map(([r, c]) => grid[r][c]).join('');
  const rev = str.split('').reverse().join('');
  const match = words.find(w => !found.includes(w) && (w === str || w === rev));

  if (match) {
    const idx = words.indexOf(match);
    found.push(match);

    // Colore as células da palavra encontrada
    currentCells.forEach(([r, c]) => {
      const el = getCell(r, c);
      if (el) {
        FOUND_CLASSES.forEach(fc => el.classList.remove(fc));
        el.classList.add(FOUND_CLASSES[idx % 5]);
      }
    });

    // Atualiza o contador e a lista
    document.getElementById('found-count').textContent = found.length;
    const wordEl = document.querySelector(`.word-item[data-word="${match}"]`);
    if (wordEl) wordEl.classList.add('found');
    document.getElementById('hint-txt').textContent = '';

    // Verifica vitória
    if (found.length === words.length) {
      clearInterval(timerInterval);
      showWin();
    }
  }
}

// ---------------------------
// 10. LISTA DE PALAVRAS
// ---------------------------
function renderWordList() {
  const el = document.getElementById('word-list');
  el.innerHTML = words
    .map((w, i) => `
      <div class="word-item" data-word="${w}">
        <span class="dot" style="background:${COLORS[i % 5]}"></span>
        ${w}
      </div>
    `)
    .join('');
}

// ---------------------------
// 11. TEMPORIZADOR
// ---------------------------
function startTimer() {
  const totalTime = timeLeft;
  let t = totalTime;

  document.getElementById('timer-display').textContent = formatTime(t);
  document.getElementById('timer-fill').style.width = '100%';

  timerInterval = setInterval(() => {
    t--;
    document.getElementById('timer-display').textContent = formatTime(t);
    document.getElementById('timer-fill').style.width = (t / totalTime * 100) + '%';

    // Muda para vermelho nos últimos 10 segundos
    if (t <= 10) {
      document.getElementById('timer-fill').style.background = '#FF6584';
    }

    if (t <= 0) {
      clearInterval(timerInterval);
      timeUp();
    }
  }, 1000);
}

// Formata segundos como MM:SS
function formatTime(s) {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
}

// ---------------------------
// 12. FIM DE JOGO
// ---------------------------
function timeUp() {
  const banner = document.getElementById('win-banner');
  banner.style.display = 'block';
  banner.style.background = 'linear-gradient(135deg, #FF6584, #F7B731)';
  document.getElementById('win-msg').textContent =
    `Tempo esgotado! Você encontrou ${found.length} de ${words.length} palavras.`;
}

function showWin() {
  const banner = document.getElementById('win-banner');
  banner.style.display = 'block';
  banner.style.background = 'linear-gradient(135deg, #6C63FF, #43C6AC)';
  document.getElementById('win-msg').textContent =
    `Incrível! Você encontrou todas as ${words.length} palavras! 🏆`;
}

// ---------------------------
// 13. DICA
// ---------------------------
function giveHint() {
  const remaining = words.filter(w => !found.includes(w));
  if (remaining.length === 0) return;

  const word = remaining[Math.floor(Math.random() * remaining.length)];
  const placed = placedWords.find(p => p.word === word);
  if (!placed) return;

  const [r, c] = placed.cells[0];
  const cell = getCell(r, c);

  if (cell) {
    const originalBg = cell.style.background;
    const originalColor = cell.style.color;
    cell.style.background = '#F7B731';
    cell.style.color = '#fff';
    setTimeout(() => {
      cell.style.background = originalBg;
      cell.style.color = originalColor;
    }, 1500);
  }

  document.getElementById('hint-txt').textContent =
    `Dica: "${word}" começa em linha ${r + 1}, coluna ${c + 1}`;
}

// ---------------------------
// 14. INICIA O JOGO
// ---------------------------
newGame();

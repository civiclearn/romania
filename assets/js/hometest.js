// ----------------------------
// SETTINGS
// ----------------------------
const QUESTIONS_PER_ROW = 3;

// ----------------------------
// FULL QUESTION POOL
// ----------------------------
const INLINE_TEST_QUESTIONS = [
  { q: "Care este durata mandatului unui senator în România?", a: ["6 ani", "3 ani", "4 ani", "5 ani"], correct: 2 },
  { q: "Care este cel mai lung râu care curge integral pe teritoriul României?", a: ["Mureș", "Olt", "Siret", "Argeș"], correct: 1 },
  { q: "Ce oraș a fost capitala Țării Românești înainte de București?", a: ["Târgoviște", "Curtea de Argeș", "Câmpulung", "Giurgiu"], correct: 0 },

  { q: "Cine numește oficial Prim-ministrul României?", a: ["Președintele României", "Senatul", "Curtea Constituțională", "Președintele Camerei Deputaților"], correct: 0 },
  { q: "Care este vârsta minimă pentru a fi ales deputat în România?", a: ["23 de ani", "18 ani", "21 de ani", "25 de ani"], correct: 0 },
  { q: "Din ce masiv face parte cel mai înalt vârf al României?", a: ["Munții Făgăraș", "Munții Apuseni", "Munții Călimani", "Munții Bucegi"], correct: 0 },

  { q: "Care este rolul Consiliului Superior al Magistraturii (CSM)?", a: ["Asigură independența justiției", "Aprobă bugetul național", "Organizează alegerile locale", "Coordonează universitățile publice"], correct: 0 },
  { q: "Ce tratat a confirmat oficial unirea Transilvaniei cu România după Primul Război Mondial?", a: ["Tratatul de la Trianon (1920)", "Tratatul de la Neuilly", "Tratatul de la Sèvres", "Tratatul de la Lausanne"], correct: 0 },
  { q: "Câte județe are România?", a: ["41", "37", "43", "47"], correct: 0 },

  { q: "Cine este autorul poemului „Luceafărul”?", a: ["Mihai Eminescu", "Marin Sorescu", "Tudor Arghezi", "Octavian Goga"], correct: 0 },
  { q: "Care oraș este considerat capitala istorică a Transilvaniei?", a: ["Cluj-Napoca", "Alba Iulia", "Sibiu", "Brașov"], correct: 0 },
  { q: "Ce tip de instanță este Înalta Curte de Casație și Justiție?", a: ["Instanța supremă de justiție ordinară", "Curte constituțională", "Instanță comercială", "Instanță administrativă"], correct: 0 },

  { q: "Pentru ce este recunoscută Delta Dunării de către UNESCO?", a: ["Rezervație de biosferă unică", "Zona cea mai aridă a Europei", "Centru industrial strategic", "Singura deltă vulcanică din lume"], correct: 0 },
  { q: "În ce regiune se află bisericile de lemn incluse în patrimoniul UNESCO?", a: ["Maramureș", "Banat", "Moldova", "Oltenia"], correct: 0 },
  { q: "Care este durata mandatului Președintelui României?", a: ["5 ani", "4 ani", "6 ani", "7 ani"], correct: 0 },

  { q: "Cine a realizat prima unire a Țărilor Române în anul 1600?", a: ["Mihai Viteazul", "Alexandru Ioan Cuza", "Ștefan cel Mare", "Vlad Țepeș"], correct: 0 },
  { q: "În procesul legislativ, care cameră are cel mai des rol de cameră decizională?", a: ["Camera Deputaților", "Senatul", "Curtea Constituțională", "Guvernul"], correct: 0 },
  { q: "Ce oraș găzduiește principalul port comercial maritim al României?", a: ["Constanța", "Galați", "Brăila", "Tulcea"], correct: 0 },

  { q: "Care filozof român este asociat cu „Școala de la Păltiniș”?", a: ["Constantin Noica", "Lucian Blaga", "Nicolae Iorga", "Mircea Vulcănescu"], correct: 0 },
  { q: "În ce an a fost adoptată Constituția României?", a: ["1991", "1990", "1993", "1995"], correct: 0 }
];

// ----------------------------
// STATE
// ----------------------------
let correctCount = 0;
let wrongCount = 0;
let answeredCount = 0;   // FIXED: counts each answered question
let totalQuestions = INLINE_TEST_QUESTIONS.length;

let currentRow = 0;

// ----------------------------
// UI TARGETS
// ----------------------------
const container = document.getElementById("inline-test-questions");
const expandBtn = document.getElementById("inline-test-expand");

// ----------------------------
// PROGRESS DISPLAY
// ----------------------------
function updateProgressDisplay() {
  document.getElementById("inline-progress-text").textContent =
    `Progres: ${answeredCount} / ${totalQuestions} întrebări`;
}

function updateProgressBar() {
  const pct = (answeredCount / totalQuestions) * 100;
  document.getElementById("inline-progressbar").style.width = pct + "%";
}

// ----------------------------
// UTILITIES
// ----------------------------
function shuffleAnswers(question) {
  const combined = question.a.map((opt, index) => ({
    text: opt,
    isCorrect: index === question.correct
  }));

  for (let i = combined.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [combined[i], combined[j]] = [combined[j], combined[i]];
  }

  question.a = combined.map(i => i.text);
  question.correct = combined.findIndex(i => i.isCorrect);
}

function createDonutChart() {
  const pct = Math.round((correctCount / totalQuestions) * 100);
  const C = 2 * Math.PI * 40;

  return `
    <div class="donut-wrapper">
      <svg width="120" height="120" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="40" stroke="#ebe6ff" stroke-width="12" fill="none"></circle>
        <circle cx="50" cy="50" r="40" stroke="#6d4aff" stroke-width="12" fill="none"
          stroke-dasharray="${(pct / 100) * C} ${(1 - pct / 100) * C}"
          transform="rotate(-90 50 50)" stroke-linecap="round"></circle>
      </svg>
      <div class="donut-center">${pct}%</div>
    </div>
  `;
}

function createEndCard() {
  const pct = Math.round((correctCount / totalQuestions) * 100);
  const card = document.createElement("div");
  card.className = "inline-question-card end-card";

  const title =
    pct >= 80 ? "Felicitări!" :
    pct >= 50 ? "Foarte bine!" :
    pct >= 21 ? "Bun început!" :
    "Mai este loc de îmbunătățire";

  card.innerHTML = `
    <h3>${title}</h3>
    ${createDonutChart()}
    <p>Ați parcurs toate întrebările gratuite. În versiunea completă găsiți peste 800 de întrebări reale pentru pregătire completă.</p>
    <a href="https://civiclearn.com/romania/checkout.html" class="hero-primary-btn">Vreau acces complet</a>
  `;

  return card;
}

// ----------------------------
// BUILD ROWS
// ----------------------------
const rows = [];
for (let i = 0; i < totalQuestions; i += QUESTIONS_PER_ROW) {
  rows.push(INLINE_TEST_QUESTIONS.slice(i, i + QUESTIONS_PER_ROW));
}

INLINE_TEST_QUESTIONS.forEach(q => shuffleAnswers(q));

// ----------------------------
// RENDERING
// ----------------------------
function renderRow(rowIndex) {
  if (!rows[rowIndex]) return;

  rows[rowIndex].forEach((q, offset) => {
    const absoluteIndex = rowIndex * QUESTIONS_PER_ROW + offset;
    container.appendChild(createQuestionCard(q, absoluteIndex));
  });
}

function createQuestionCard(questionObj, absoluteIndex) {
  const card = document.createElement("div");
  card.className = "inline-question-card";

  const title = document.createElement("h3");
  title.textContent = questionObj.q;

  const feedback = document.createElement("div");
  feedback.className = "inline-feedback";

  card.append(title);

  questionObj.a.forEach((opt, i) => {
    const btn = document.createElement("button");
    btn.className = "inline-option-btn";
    btn.textContent = opt;

    btn.onclick = () => {
      answeredCount++;                 // FIXED: track per-answer progress
      updateProgressDisplay();
      updateProgressBar();

      if (i === questionObj.correct) {
        correctCount++;
        feedback.textContent = "Corect!";
        feedback.classList.add("inline-correct");
      } else {
        wrongCount++;
        feedback.textContent = "Răspuns corect: " + questionObj.a[questionObj.correct];
        feedback.classList.add("inline-wrong");
      }

      card.querySelectorAll("button").forEach(b => b.disabled = true);
      card.appendChild(feedback);

      const isLastQuestion = (absoluteIndex === totalQuestions - 1);

      if (isLastQuestion) {
        setTimeout(() => container.appendChild(createEndCard()), 300);
      }

      const isLastInRow =
        (absoluteIndex + 1) % QUESTIONS_PER_ROW === 0 &&
        absoluteIndex !== totalQuestions - 1;

      if (isLastInRow) {
        currentRow++;
        renderRow(currentRow);
      }
    };

    card.appendChild(btn);
  });

  return card;
}

// ----------------------------
// INITIAL RENDER
// ----------------------------
renderRow(0);
updateProgressDisplay();
updateProgressBar();

// ----------------------------
// CONTINUE BUTTON
// ----------------------------
expandBtn.onclick = () => {
  currentRow = 1;
  renderRow(currentRow);
  expandBtn.style.display = "none";
};

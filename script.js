// ============================
// Flashcards App - script.js
// ============================

let flashcards = JSON.parse(localStorage.getItem("flashcards")) || [
  { question: "What is the capital of France?", answer: "Paris", category: "Geography" },
  { question: "What is 2 + 2?", answer: "4", category: "Math" },
  { question: "Who wrote '1984'?", answer: "George Orwell", category: "Literature" },
  { question: "What is the largest ocean?", answer: "Pacific Ocean", category: "Geography" },
  { question: "What is the capital of Spain?", answer: "Madrid", category: "Geography" },
  { question: "Which is the best national soccer team in history?", answer: "Brazil", category: "Sports" },
  { question: "Who was the last American Nobel Peace Price winer?", answer: "Barack Obama", category: "Politics" }
];

const flashcardForm = document.getElementById("flashcardForm");
const questionInput = document.getElementById("questionInput");
const answerInput = document.getElementById("answerInput");
const flashcardContainer = document.getElementById("flashcardContainer");
const shuffleButton = document.getElementById("shuffleButton");
const resetButton = document.getElementById("resetButton");
const clearButton = document.getElementById("clearButton");
const exportButton = document.getElementById("exportButton");
const importFile = document.getElementById("importFile");
const themeToggle = document.getElementById("themeToggle");
const categoryDashboard = document.getElementById("categoryDashboard");
const backButton = document.getElementById("backButton");

function saveFlashcards() {
  localStorage.setItem("flashcards", JSON.stringify(flashcards));
}

function createFlashcard(question, answer, category) {
  const flashcard = document.createElement("div");
  flashcard.className = "flashcard";

  const front = document.createElement("div");
  front.className = "front";
  front.innerHTML = `<p>${question}</p>`;

  const back = document.createElement("div");
  back.className = "back";
  back.innerHTML = `<p>${answer}</p>`;

  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "✖";
  deleteBtn.className = "delete-button";
  deleteBtn.addEventListener("click", () => {
    flashcards = flashcards.filter(card => !(card.question === question && card.answer === answer && card.category === category));
    saveFlashcards();
    showCategory(category);
  });

  flashcard.appendChild(front);
  flashcard.appendChild(back);
  flashcard.appendChild(deleteBtn);
  flashcardContainer.appendChild(flashcard);
}

flashcardForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const question = questionInput.value.trim();
  const answer = answerInput.value.trim();
  const category = prompt("Enter category:", "General") || "General";
  if (!question || !answer) return;
  flashcards.push({ question, answer, category });
  saveFlashcards();
  createFlashcard(question, answer, category);
  questionInput.value = "";
  answerInput.value = "";
});

shuffleButton?.addEventListener("click", () => {
  flashcards = flashcards.sort(() => Math.random() - 0.5);
  saveFlashcards();
  showDashboard();
});

resetButton?.addEventListener("click", () => {
  localStorage.removeItem("flashcards");
  location.reload();
});

clearButton?.addEventListener("click", () => {
  flashcards = [];
  saveFlashcards();
  flashcardContainer.innerHTML = "";
});

exportButton?.addEventListener("click", () => {
  const dataStr = JSON.stringify(flashcards, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const downloadLink = document.createElement("a");
  downloadLink.href = url;
  downloadLink.download = "flashcards.json";
  downloadLink.click();
  URL.revokeObjectURL(url);
});

importFile?.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function (event) {
    try {
      const importedData = JSON.parse(event.target.result);
      if (Array.isArray(importedData)) {
        flashcards = flashcards.concat(importedData);
        saveFlashcards();
        flashcardContainer.innerHTML = "";
        flashcards.forEach(card => createFlashcard(card.question, card.answer, card.category));
        alert("Flashcards imported successfully!");
      } else {
        alert("Invalid file format.");
      }
    } catch (error) {
      alert("Error reading file.");
    }
  };
  reader.readAsText(file);
});

// Theme Toggle
const currentTheme = localStorage.getItem("theme") || "light";
document.body.classList.toggle("dark", currentTheme === "dark");
themeToggle.checked = currentTheme === "dark";

themeToggle.addEventListener("change", () => {
  const newTheme = themeToggle.checked ? "dark" : "light";
  document.body.classList.toggle("dark", newTheme === "dark");
  localStorage.setItem("theme", newTheme);
});

// Dashboard Functions
function getCategories() {
  const categories = new Set(flashcards.map(card => card.category || "Uncategorized"));
  return Array.from(categories);
}

function showDashboard() {
  flashcardContainer.innerHTML = "";
  categoryDashboard.innerHTML = "";
  backButton.style.display = "none";
  getCategories().forEach(category => {
    const btn = document.createElement("button");
    btn.textContent = category;
    btn.addEventListener("click", () => showCategory(category));
    categoryDashboard.appendChild(btn);
  });
  categoryDashboard.style.display = "flex";
  flashcardForm.style.display = "none";
}

function showCategory(category) {
  categoryDashboard.style.display = "none";
  flashcardForm.style.display = "block";
  backButton.style.display = "inline-block";
  flashcardContainer.innerHTML = "";
  flashcards.filter(card => (card.category || "Uncategorized") === category)
    .forEach(card => createFlashcard(card.question, card.answer, card.category));
}

backButton.addEventListener("click", showDashboard);

// Initial Load
showDashboard();

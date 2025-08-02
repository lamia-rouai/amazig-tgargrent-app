
const data = JSON.parse(localStorage.getItem("amazighData")) || {};
let quizData = [];

const correctSound = new Audio("correct.mp3");
const wrongSound = new Audio("wrong.mp3");

function startQuiz(type) {
  quizData = [];
  for (const group in data) {
    if (group === "بعض الجمل المتكررة") continue;
    quizData = quizData.concat(data[group]);
  }

  if (quizData.length < 4) {
    document.getElementById("quizContainer").innerHTML = "<p>⚠️ يجب أن تضيف على الأقل 4 كلمات لبدء الاختبار.</p>";
    return;
  }

  const questions = [];
  const usedIndexes = new Set();
  while (questions.length < 10 && usedIndexes.size < quizData.length) {
    const index = Math.floor(Math.random() * quizData.length);
    if (usedIndexes.has(index)) continue;
    usedIndexes.add(index);
    const item = quizData[index];
    const correct = type === "ar-to-ber" ? item.word : item.translation;
    const questionText = type === "ar-to-ber" ? item.translation : item.word;
    let options = [correct];
    while (options.length < 4) {
      const randItem = quizData[Math.floor(Math.random() * quizData.length)];
      const option = type === "ar-to-ber" ? randItem.word : randItem.translation;
      if (!options.includes(option)) options.push(option);
    }
    options.sort(() => Math.random() - 0.5);
    questions.push({ questionText, correct, options });
  }

  renderQuestions(questions);
}

function renderQuestions(questions) {
  const container = document.getElementById("quizContainer");
  container.innerHTML = "";
  let score = 0;
  let current = 0;

  function showQuestion() {
    if (current >= questions.length) {
      container.innerHTML = "";
      document.getElementById("result").textContent = `✅ نتيجتك: ${score} من ${questions.length}`;
      return;
    }

    const q = questions[current];
    container.innerHTML = `
      <div class="question">
        <p><strong>السؤال ${current + 1}:</strong> ${q.questionText}</p>
        ${q.options.map(opt => `<button class="option">${opt}</button>`).join("")}
      </div>
    `;

    const optionButtons = document.querySelectorAll(".option");
    optionButtons.forEach(btn => {
      btn.onclick = () => {
        optionButtons.forEach(b => {
          if (b.textContent === q.correct) {
            b.style.backgroundColor = "#c8f7c5"; // أخضر
            b.style.borderColor = "#4CAF50";
            b.style.fontWeight = "bold";
          } else if (b === btn) {
            b.style.backgroundColor = "#f8d7da"; // أحمر
            b.style.borderColor = "#f44336";
          }
          b.disabled = true;
        });

        if (btn.textContent === q.correct) {
          correctSound.play();
          score++;
        } else {
          wrongSound.play();
        }

        setTimeout(() => {
          current++;
          showQuestion();
        }, 1500);
      };
    });
  }

  document.getElementById("result").textContent = "";
  showQuestion();
}

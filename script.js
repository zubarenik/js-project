const url = "https://api.dictionaryapi.dev/api/v2/entries/en/";
const result = document.getElementById("result");
const sound = document.getElementById("sound");
const btn = document.getElementById("search-btn");
let currentTranslation = '';

btn.addEventListener("click", () => {
  let inpWord = document.getElementById("inp-word").value;

  if (getWord(inpWord)) {
    const value = getWord(inpWord);

    result.innerHTML = `
      <div class="word">
        <h3>${inpWord}</h3>
        <div>
          <button onclick="playSound()" style="cursor: pointer">
            <i class="fas fa-volume-up"></i>
          </button>
          <button onclick="deleteWord()" style="margin-left: 50px; cursor: pointer">
            <i class="fas fa-flag"></i>
          </button>
        </div>
      </div>
      <div class="details">
        <p>${value.meanings[0].partOfSpeech}</p>
        <p>/${value.phonetic}/</p>
      </div>
      <p class="word-meaning">
        ${value.meanings[0].definitions[0].definition}
      </p>
      <p class="word-example">
        ${value.meanings[0].definitions[0].example || ""}
      </p>
    `

    sound.setAttribute("src", `${value.phonetics[0].audio}`);

    return;
  }

  fetch(`${url}${inpWord}`)
    .then((response) => response.json())
    .then((data) => {
      result.innerHTML = `
        <div class="word">
          <h3>${inpWord}</h3>
          <div>
            <button onclick="playSound()" style="cursor: pointer">
              <i class="fas fa-volume-up"></i>
            </button>
            <button onclick="saveWord()" style="margin-left: 50px; cursor: pointer">
              <i class="fas fa-plus"></i>
            </button>
          </div>
        </div>
        <div class="details">
          <p>${data[0].meanings[0].partOfSpeech}</p>
          <p>/${data[0].phonetic}/</p>
        </div>
        <p class="word-meaning">
          ${data[0].meanings[0].definitions[0].definition}
        </p>
        <p class="word-example">
          ${data[0].meanings[0].definitions[0].example || ""}
        </p>
      `;

      sound.setAttribute("src", `${data[0].phonetics[0].audio}`);

      currentTranslation = JSON.stringify(data[0]);
    })
    .catch(() => {
      result.innerHTML = `<h3 class="error">Такого слова нет :(</h3>`;
    });
});

function playSound() {
  sound.play();
}

function getWord(word) {
  const value = localStorage.getItem(word)

  if (value) {
    return JSON.parse(value)
  }
  return false;
}

function saveWord() {
  let inpWord = document.getElementById("inp-word").value;
  const value = localStorage.getItem(inpWord)

  if (!value) {
    localStorage.setItem(inpWord, currentTranslation)
  }
}

function deleteWord() {
  let inpWord = document.getElementById("inp-word").value;
  const value = localStorage.getItem(inpWord)

  if (value) {
    localStorage.removeItem(inpWord)
  }
}
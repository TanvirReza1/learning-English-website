const createElements = (arr) => {
  const htmlElements = arr.map((el) => `<span class='btn'>${el}</span>`);
  return htmlElements.join(" ");
};

function pronounceWord(word) {
  const utterance = new SpeechSynthesisUtterance(word);
  utterance.lang = "en-EN"; // English
  window.speechSynthesis.speak(utterance);
}

const manageSpinner = (status) => {
  if (status === true) {
    document.getElementById("spinner").classList.remove("hidden");
    document.getElementById("word-container").classList.add("hidden");
  } else {
    document.getElementById("word-container").classList.remove("hidden");
    document.getElementById("spinner").classList.add("hidden");
  }
};

const loadLesson = () => {
  fetch("https://openapi.programming-hero.com/api/levels/all")
    .then((res) => res.json())
    .then((data) => displayUi(data.data));
};

const removeActive = () => {
  const lessonButtons = document.querySelectorAll(".lesson-btn");
  lessonButtons.forEach((btn) => btn.classList.remove("active"));
};

const loadLevelWord = (id) => {
  manageSpinner(true);
  const url = `https://openapi.programming-hero.com/api/level/${id}`;
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      removeActive(); //remove all active class
      const clickBtn = document.getElementById(`lesson-btn-${id}`);
      clickBtn.classList.add("active"); //add active class
      displayLevelWord(data.data);
    });
};
const loadWordDetail = async (id) => {
  const url = `https://openapi.programming-hero.com/api/word/${id}`;
  const res = await fetch(url);
  const details = await res.json();
  displayWordDetails(details.data);
};

const displayWordDetails = (word) => {
  console.log(word);
  const detailsBox = document.getElementById("details-container");
  detailsBox.innerHTML = `
          <div class="">
          <h2 class="text-2xl font-bold">${
            word.word
          } (<i class="fa-solid fa-microphone-lines"></i> :${
    word.pronunciation
  })</h2>
        </div>
        <div class="">
          <h2 class="font-bold">Meaning</h2>
          <p>${word.meaning}</p>
        </div>
        <div class="">
          <h2 class="font-bold">Example</h2>
          <p>${word.sentence}</p>
        </div>
        <div class="">
          <h2 class="font-bold">Synonym</h2>
         <div class=''>
         ${createElements(word.synonyms)}
         </div>
        </div>
  `;
  document.getElementById("word_modal").showModal();
};
const displayLevelWord = (words) => {
  const wordContainerParent = document.getElementById("word-container");
  wordContainerParent.innerHTML = "";
  if (words.length == 0) {
    wordContainerParent.innerHTML = ` <div class="text-center  col-span-full rounded-xl py-10 space-y-6">
    <img class='mx-auto' src="./assets/alert-error.png" alt="">
      <p class="text-xl font-medium text-gray-400 font-bangla">এই Lesson এ এখনো কোন Vocabulary যুক্ত করা হয়নি।</p>
      <h2 class="font-bold text-4xl font-bangla">নেক্সট Lesson এ যান</h2>
    </div>`;
    manageSpinner(false);
    return;
  }

  words.forEach((word) => {
    console.log(word);

    const card = document.createElement("div");
    card.innerHTML = `
    
    <div class="bg-white rounded-xl shadow-sm text-center py-10 pz-5 space-y-4">
      <h2 class="font-bold text-2xl">${
        word.word ? word.word : "শব্দ পাওয়া যায় নি"
      }</h2>

      <p class="font-semibold">Meaning /Pronounciation</p>
      <p class="text-2xl font-medium font-bangla">"${
        word.meaning ? word.meaning : "অর্থ পাওয়া যায় নি"
      } / ${
      word.pronunciation ? word.pronunciation : "pronunciation পাওয়া যায় নি"
    }"</p>

      <div class="flex justify-between items-center px-3">
        <button onclick='loadWordDetail(${
          word.id
        })' class="btn bg-[#1A91FF10]   hover:bg-[#1A91FF80]"><i class="fa-solid fa-circle-info"></i></button>
        <button onclick="pronounceWord('${word.word}')"  class="btn bg-[#1A91FF10] hover:bg-[#1A91FF80]"><i class="fa-solid fa-volume-high"></i></button>
      </div>
    </div>
    `;
    wordContainerParent.append(card);
  });
  manageSpinner(false);
};

const displayUi = (lessons) => {
  // 1.get the container
  const parent = document.getElementById("Lesson-container");
  // 2.empty
  parent.innerHTML = "";

  // 3.get into every element
  for (let lesson of lessons) {
    console.log(lesson);
    // 4.create
    const newChild = document.createElement("div");
    // 5..content
    newChild.innerHTML = ` <button id='lesson-btn-${lesson.level_no}' onclick='loadLevelWord(${lesson.level_no})' class="btn btn-outline btn-primary lesson-btn">
    <i class="fa-solid fa-book-open"></i>lesson-${lesson.level_no}
    </button>
    
    `;
    // 6.append
    parent.append(newChild);
  }
};
loadLesson();

document.getElementById("btn-search").addEventListener("click", () => {
  removeActive();
  const input = document.getElementById("input-search");
  const searchValue = input.value.trim().toLowerCase();
  console.log(searchValue);

  fetch("https://openapi.programming-hero.com/api/words/all")
    .then((res) => res.json())
    .then((data) => {
      const allWords = data.data;
      console.log(allWords);
      const filterWords = allWords.filter((word) =>
        word.word.toLowerCase().includes(searchValue)
      );

      displayLevelWord(filterWords);
    });
});

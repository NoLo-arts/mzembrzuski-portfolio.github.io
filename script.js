window.addEventListener("load", () => {
  console.log("Strona się załadowała."); // Debug

  // Pobieramy wszystkie loadery i kontent
  const loaders = document.querySelectorAll(".loader");
  const contents = document.querySelectorAll(".content");

  loaders.forEach(loader => loader.style.display = "none");
  contents.forEach(content => content.style.display = "block");
});

function toggleText() {
  const textElement = document.getElementById("text");
  textElement.classList.toggle("visible");
}


// === Galeria ===


// Pobieramy wszystkie obrazki z galerii
const images = document.querySelectorAll('.gallery-item');
const modal = document.getElementById('myModal');
const modalImage = document.getElementById('modalImage');
const modalText = document.getElementById('modalText');
const closeButton = document.getElementById('closeButton');
const prevButton = document.getElementById('prevButton');
const nextButton = document.getElementById('nextButton');


let currentIndex = 0;

// === Funkcja otwierająca modal ===
function openModal(index) {
  currentIndex = index;
  const image = images[index];

  // 🔥 Wczytujemy całą galerię z data-images
  currentGallery = JSON.parse(image.dataset.images || '[]');
  currentGalleryIndex = 0;

  if (currentGallery.length > 0) {
    modalImage.src = currentGallery[currentGalleryIndex];
    createDots(currentGallery.length);
  }
  else {
    modalImage.src = image.src;
  }

  modalText.innerHTML = image.dataset.description;
  modal.style.display = 'flex';
  history.pushState(null, "", `#image-${index}`);
  showDots();
  hideDots();
}

// === Nawigacja między obrazkami ===
function showNext() {
  currentIndex = (currentIndex + 1) % images.length;
  const image = images[currentIndex];

  currentGallery = JSON.parse(image.dataset.images || '[]');
  currentGalleryIndex = 0;

  if (currentGallery.length > 0) {
    modalImage.src = currentGallery[currentGalleryIndex];
    createDots(currentGallery.length);
    updateDots();
  } else {
    modalImage.src = image.src;
    document.querySelector('.dot-container').innerHTML = ''; // brak kropek
  }

  modalText.innerHTML = image.dataset.description;
  history.pushState(null, "", `#image-${currentIndex}`);
  showDots();
  hideDots();
}

function showPrev() {
  currentIndex = (currentIndex - 1 + images.length) % images.length;
  const image = images[currentIndex];

  currentGallery = JSON.parse(image.dataset.images || '[]');
  currentGalleryIndex = 0;

  if (currentGallery.length > 0) {
    modalImage.src = currentGallery[currentGalleryIndex];
    createDots(currentGallery.length);
    updateDots();
  } else {
    modalImage.src = image.src;
    document.querySelector('.dot-container').innerHTML = ''; // brak kropek
  }

  modalText.innerHTML = image.dataset.description;
  history.pushState(null, "", `#image-${currentIndex}`);
  showDots();
  hideDots();
}

// === Event Listenery ===
images.forEach((img, index) => {
  img.addEventListener('click', (event) => {
    event.preventDefault();
    openModal(index);
  });
});

// zamykanie modala
closeButton.addEventListener('click', () => {
  modal.style.display = 'none';
  history.pushState(null, "", window.location.pathname);
});

nextButton.addEventListener('click', showNext);
prevButton.addEventListener('click', showPrev);

window.addEventListener('click', (event) => {
  if (event.target === modal) {
    modal.style.display = 'none';
    history.pushState(null, "", window.location.pathname);
  }
});

// === Sprawdzenie URL po załadowaniu strony ===
window.addEventListener('DOMContentLoaded', () => {
  const hash = window.location.hash;
  if (hash) {
    const index = parseInt(hash.replace('#image-', ''));
    if (!isNaN(index) && images[index]) {
      openModal(index);
    }
  }
});

// === 🔥 Nasłuchujemy na zmianę hasha (URL po #) ===
window.addEventListener('hashchange', () => {
  const hash = window.location.hash;
  if (hash) {
    const index = parseInt(hash.replace('#image-', ''));
    if (!isNaN(index) && images[index]) {
      openModal(index);
    }
  }
});

const hash = window.location.hash;
if (hash) {
  const index = parseInt(hash.replace('#image-', ''));
  if (!isNaN(index) && images[index]) {
    openModal(index);
  }
}

let currentGallery = [];
let currentGalleryIndex = 0;


// zmienianie zdjęć w modalach
function showNextInGallery() {
  if (currentGallery.length > 0) {
    currentGalleryIndex = (currentGalleryIndex + 1) % currentGallery.length;
    modalImage.src = currentGallery[currentGalleryIndex];
    updateDots();
  }
}

function showPrevInGallery() {
  if (currentGallery.length > 0) {
    currentGalleryIndex = (currentGalleryIndex - 1 + currentGallery.length) % currentGallery.length;
    modalImage.src = currentGallery[currentGalleryIndex];
    updateDots();
  }
}


const nextGalleryButton = document.querySelector('.next-gallery');
nextGalleryButton.addEventListener('click', showPrevInGallery);
nextGalleryButton.innerHTML = "▴";
nextGalleryButton.classList.add('gallery-nav', 'next-gallery');

const prevGalleryButton = document.querySelector('.prev-gallery');
prevGalleryButton.addEventListener('click', showNextInGallery);
prevGalleryButton.innerHTML = "▴";
prevGalleryButton.classList.add('gallery-nav', 'prev-gallery');

const modalContent = document.querySelector('.modal-content');
const buttonContainer = document.createElement('div');

// kropeczki 

function createDots(count) {
  const dotContainer = document.querySelector('.dot-container');
  dotContainer.innerHTML = ''; // usuń stare kropki

  for (let i = 0; i < count; i++) {
    const dot = document.createElement('span');
    dot.classList.add('dot');
    if (i === currentGalleryIndex) dot.classList.add('active');
    dotContainer.appendChild(dot);
  }
}

function updateDots() {
  const dots = document.querySelectorAll('.dot');
  dots.forEach((dot, index) => {
    dot.classList.toggle('active', index === currentGalleryIndex);
  });
}

function hideDots() {
  const container = document.querySelector('.button-container');
  if (currentGallery.length === 0) {
    container.style.display = 'none';
  }
}

function showDots() {
  const container = document.querySelector('.button-container');
  if (currentGallery.length !== 0) {
    container.style.display = 'flex';
  }
}

window.addEventListener('keydown', (event) => {

  if (event.key === 'ArrowRight') {
    showNext();
  }

  if (event.key === 'ArrowLeft') {
    showPrev();
  }

  if (event.key === 'Escape') {
    modal.style.display = 'none';
    history.pushState(null, "", window.location.pathname);
  }

  if (event.key === 'ArrowUp') {
    event.preventDefault();
    showPrevInGallery();
  }

  if (event.key === 'ArrowDown') {
    event.preventDefault();
    showNextInGallery();
  }

});
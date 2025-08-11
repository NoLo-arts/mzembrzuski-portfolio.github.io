document.addEventListener('DOMContentLoaded', function () {
    // --- LOADER I FUNKCJE GLOBALNE ---
    window.onload = function () {
        const loader = document.querySelector('.loader');
        const content = document.querySelector('.content');
        if (loader) {
            loader.style.opacity = '0';
            setTimeout(() => { loader.style.display = 'none'; }, 500);
        }
        if (content) {
            content.style.display = 'block';
            setTimeout(() => { content.style.opacity = '1'; }, 50);
        }
    };
    window.toggleText = function() {
        const textElement = document.getElementById("text");
        if (textElement) textElement.classList.toggle("visible");
    };

    // --- LOGIKA GALERII ---
    const galleryContainer = document.querySelector('.gallery');
    if (galleryContainer) {
        // A. Pobranie elementów
        const images = document.querySelectorAll('.gallery-item');
        const modal = document.getElementById('myModal');
        const modalImage = document.getElementById('modalImage');
        const modalText = document.getElementById('modalText');
        const closeButton = document.getElementById('closeButton');
        const prevButton = document.getElementById('prevButton');
        const nextButton = document.getElementById('nextButton');
        const buttonContainer = document.querySelector('.button-container');
        const prevGalleryButton = document.querySelector('.prev-gallery');
        const nextGalleryButton = document.querySelector('.next-gallery');
        const dotContainer = document.querySelector('.dot-container');

        // B. Zmienne stanu
        let currentIndex = 0;
        let currentSubImageIndex = 0;
        let subImages = [];
        let touchStartX = 0, touchStartY = 0;

        // --- DODAJEMY SYMBOLE STRZAŁEK ---
        if (prevGalleryButton && nextGalleryButton) {
            prevGalleryButton.innerHTML = '▲';
            nextGalleryButton.innerHTML = '▲';
        }
        
        // C. Główne funkcje
        function openModal(index) {
            currentIndex = index;
            const item = images[index];
            
            modalText.innerHTML = item.dataset.description || '';
            subImages = JSON.parse(item.dataset.images || '[]');
            currentSubImageIndex = 0;

            // --- FINALNA POPRAWKA LOGIKI POKAZYWANIA/UKRYWANIA ---
            if (subImages.length > 1) {
                modalImage.src = subImages[0];
                buttonContainer.style.display = 'flex';
                dotContainer.style.display = 'flex'; // Zawsze próbujemy pokazać kropki
                createDots(subImages.length);
            } else {
                modalImage.src = item.src;
                buttonContainer.style.display = 'none';
                dotContainer.style.display = 'none';
            }
            
            modal.style.display = 'flex';
            history.pushState(null, null, `#image-${index}`);
        }

        function closeModal() {
            modal.style.display = 'none';
            history.pushState(null, null, window.location.pathname);
        }

        function changeImage(direction) {
            openModal((currentIndex + direction + images.length) % images.length);
        }

        function changeSubImage(direction) {
            if (subImages.length <= 1) return;
            currentSubImageIndex = (currentSubImageIndex + direction + subImages.length) % subImages.length;
            modalImage.src = subImages[currentSubImageIndex];
            updateActiveDots();
        }

        function createDots(count) {
            dotContainer.innerHTML = '';
            for (let i = 0; i < count; i++) {
                const dot = document.createElement('span');
                dot.className = 'dot';
                dot.addEventListener('click', () => {
                    currentSubImageIndex = i;
                    modalImage.src = subImages[i];
                    updateActiveDots();
                });
                dotContainer.appendChild(dot);
            }
            updateActiveDots();
        }

        function updateActiveDots() {
            Array.from(dotContainer.children).forEach((dot, i) => {
                dot.classList.toggle('active', i === currentSubImageIndex);
            });
        }
        
        function handleTouchStart(e) { touchStartX = e.changedTouches[0].screenX; touchStartY = e.changedTouches[0].screenY; }
        function handleTouchEnd(e) {
            const touchEndX = e.changedTouches[0].screenX;
            const touchEndY = e.changedTouches[0].screenY;
            const diffX = touchEndX - touchStartX;
            const diffY = touchEndY - touchStartY;
            if (Math.abs(diffX) > Math.abs(diffY)) {
                if (Math.abs(diffX) > 50) changeImage(diffX > 0 ? -1 : 1);
            } else {
                if (Math.abs(diffY) > 50) changeSubImage(diffY > 0 ? -1 : 1);
            }
        }

        // D. Event Listenery
        images.forEach((img, index) => img.addEventListener('click', (e) => { e.preventDefault(); openModal(index); }));
        closeButton.addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
        prevButton.addEventListener('click', () => changeImage(-1));
        nextButton.addEventListener('click', () => changeImage(1));
        prevGalleryButton.addEventListener('click', () => changeSubImage(1));
        nextGalleryButton.addEventListener('click', () => changeSubImage(-1));
        modal.addEventListener('touchstart', handleTouchStart);
        modal.addEventListener('touchend', handleTouchEnd);

        document.addEventListener('keydown', (e) => {
            if (modal.style.display !== 'flex') return;
            const keyMap = { 'Escape': closeModal, 'ArrowLeft': () => changeImage(-1), 'ArrowRight': () => changeImage(1), 'ArrowUp': () => changeSubImage(-1), 'ArrowDown': () => changeSubImage(1) };
            if (keyMap[e.key]) { e.preventDefault(); keyMap[e.key](); }
        });
        
        // E. Obsługa URL po załadowaniu
        const hash = window.location.hash;
        if (hash.startsWith('#image-')) {
            const index = parseInt(hash.substring(7));
            if (!isNaN(index) && index >= 0 && index < images.length) {
                setTimeout(() => openModal(index), 100);
            }
        }
    }
});
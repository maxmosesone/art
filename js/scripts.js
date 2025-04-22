document.addEventListener("DOMContentLoaded", function () {
    // Переключение выпадающего меню
    const menuToggle = document.getElementById("menu-toggle");
    const menu = document.getElementById("menu");
    let scrollPosition = 0;

    if (menuToggle && menu) {
        menuToggle.addEventListener("click", function () {
            if (menu.classList.contains("hidden")) {
                // Открываем меню: сохраняем позицию прокрутки
                scrollPosition = window.scrollY;
                menu.classList.remove("hidden");
                document.documentElement.classList.add("no-scroll");
                document.body.classList.add("no-scroll");
            } else {
                // Закрываем меню: восстанавливаем позицию прокрутки
                menu.classList.add("hidden");
                document.documentElement.classList.remove("no-scroll");
                document.body.classList.remove("no-scroll");
                window.scrollTo(0, scrollPosition);
            }
        });
    } else {
        console.error("Menu or Menu Toggle button not found!");
    }

    // Pull-to-Refresh для мобильных устройств
    let touchStartY = 0;
    let touchCurrentY = 0;
    let isPulling = false;

    window.addEventListener("touchstart", function (e) {
        if (window.scrollY <= 50) {
            touchStartY = e.touches[0].clientY;
            isPulling = true;
        }
    });

    window.addEventListener("touchmove", function (e) {
        if (!isPulling) return;
        touchCurrentY = e.touches[0].clientY;
        const pullDistance = touchCurrentY - touchStartY;

        if (pullDistance > 150) {
            document.body.style.transition = "margin-top 0.3s ease";
            document.body.style.marginTop = `${pullDistance - 150}px`;
        }
    });

    window.addEventListener("touchend", function () {
        if (!isPulling) return;
        const pullDistance = touchCurrentY - touchStartY;

        if (pullDistance > 150) {
            window.location.reload();
        }

        document.body.style.marginTop = "0";
        isPulling = false;
        touchStartY = 0;
        touchCurrentY = 0;
    });

    // Логика слайд-шоу на главной странице
    const slideshowImage = document.getElementById("slideshow-image");
    if (slideshowImage) {
        const images = [
            { src: "images/LemonTree.jpg", page: "/paintings" },
            { src: "images/Wave-III.jpg", page: "/paintings" },
            { src: "images/DirtyMonk.jpg", page: "/paintings" },
            { src: "images/art1.jpg", page: "/paintings" },
            { src: "images/art2.jpg", page: "/paintings" },
            { src: "images/Wave_3.jpg", page: "/paintings" },
            { src: "images/Simulation_V.jpg", page: "/digital" },
            { src: "images/Simulation_IV.jpg", page: "/digital" },
            { src: "images/Simulation_III.jpg", page: "/digital" },
            { src: "images/Simulation_III.II.jpg", page: "/digital" },
            { src: "images/Simulation_IV.I.jpg", page: "/digital" },
            { src: "images/Simulation.jpg", page: "/digital" },
            { src: "images/Good_Thoughts.jpg", page: "/digital" },
            { src: "images/Simulation_II.I.jpg", page: "/digital" },
            { src: "images/Simulation_II.jpg", page: "/digital" }
        ];

        let currentIndexPosition = 0;
        let imageIndices = [];
        let preloadedImages = [];

        function preloadImages() {
            images.forEach((imageObj, index) => {
                const img = new Image();
                img.src = imageObj.src;
                preloadedImages[index] = img;
            });
        }

        function shuffleArray(array) {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
            return array;
        }

        function createShuffledIndices() {
            imageIndices = Array.from({ length: images.length }, (_, index) => index);
            shuffleArray(imageIndices);
            currentIndexPosition = 0;
        }

        function changeImage() {
            slideshowImage.classList.remove("active");
            slideshowImage.addEventListener(
                "transitionend",
                function handler() {
                    slideshowImage.removeEventListener("transitionend", handler);
                    if (currentIndexPosition >= imageIndices.length) {
                        createShuffledIndices();
                    }
                    const currentImageIndex = imageIndices[currentIndexPosition];
                    slideshowImage.src = images[currentImageIndex].src;
                    slideshowImage.classList.add("active");
                    slideshowImage.onclick = function () {
                        window.location.href = images[currentImageIndex].page;
                    };
                    currentIndexPosition++;
                },
                { once: true }
            );
        }

        preloadImages();
        createShuffledIndices();
        const initialImageIndex = imageIndices[currentIndexPosition];
        slideshowImage.src = images[initialImageIndex].src;
        slideshowImage.classList.add("active");
        slideshowImage.onclick = function () {
            window.location.href = images[initialImageIndex].page;
        };
        currentIndexPosition++;
        setInterval(changeImage, 5000);
    }

    // Логика для галерей на странице Digital (с добавлением свайпов)
    const galleries = document.querySelectorAll(".work-item.has-gallery");
    galleries.forEach(function (gallery) {
        let images, captions;
        try {
            images = JSON.parse(gallery.getAttribute("data-images"));
            captions = JSON.parse(gallery.getAttribute("data-captions"));
        } catch (e) {
            console.error("Ошибка в данных галереи:", gallery, e);
            return;
        }

        if (!images || !captions || images.length !== captions.length || images.length === 0) {
            console.error("Некорректные данные в галерее:", gallery);
            return;
        }

        const imgElement = gallery.querySelector("img");
        const captionElement = gallery.querySelector(".info h3");
        let currentIndex = 0;
        let isThrottled = false; // Для защиты от двойного клика

        function updateGallery() {
            imgElement.src = images[currentIndex];
            captionElement.textContent = captions[currentIndex];
        }

        const prevArrow = gallery.querySelector(".prev-arrow");
        const nextArrow = gallery.querySelector(".next-arrow");

        if (images.length <= 1) {
            prevArrow.style.display = "none";
            nextArrow.style.display = "none";
        }

        // Обработчики кликов с защитой от двойного срабатывания
        prevArrow.addEventListener("click", function () {
            if (isThrottled) return;
            isThrottled = true;
            currentIndex = (currentIndex - 1 + images.length) % images.length;
            updateGallery();
            setTimeout(() => { isThrottled = false; }, 300); // Задержка 300 мс
        });

        nextArrow.addEventListener("click", function () {
            if (isThrottled) return;
            isThrottled = true;
            currentIndex = (currentIndex + 1) % images.length;
            updateGallery();
            setTimeout(() => { isThrottled = false; }, 300); // Задержка 300 мс
        });

        // Добавляем поддержку свайпов (влево/вправо)
        let touchStartX = 0;
        let touchEndX = 0;
        let touchTarget = null; // Для хранения элемента, на котором началось касание
        const swipeThreshold = 50; // Минимальная дистанция для свайпа (в пикселях)

        gallery.addEventListener("touchstart", function (e) {
            touchStartX = e.touches[0].clientX;
            touchTarget = e.target; // Сохраняем элемент, на котором началось касание
        });

        gallery.addEventListener("touchmove", function (e) {
            touchEndX = e.touches[0].clientX;
        });

        gallery.addEventListener("touchend", function () {
            // Проверяем, началось ли касание на стрелке
            const isArrowTouch = touchTarget && (touchTarget.closest(".prev-arrow") || touchTarget.closest(".next-arrow"));
            if (isArrowTouch) {
                // Если касание началось на стрелке, игнорируем свайп
                touchStartX = 0;
                touchEndX = 0;
                touchTarget = null;
                return;
            }

            const swipeDistance = touchEndX - touchStartX;

            // Если свайп влево (больше 50px) — переключаем на следующее изображение
            if (swipeDistance < -swipeThreshold) {
                nextArrow.click();
            }
            // Если свайп вправо (больше 50px) — переключаем на предыдущее изображение
            else if (swipeDistance > swipeThreshold) {
                prevArrow.click();
            }

            // Сбрасываем координаты и цель касания
            touchStartX = 0;
            touchEndX = 0;
            touchTarget = null;
        });

        // Инициализация: показываем первое изображение
        updateGallery();
    });

    // Плавное появление изображений
    const images = document.querySelectorAll('.work-item img');
    images.forEach(img => {
        if (img.complete) {
            // Если изображение уже загружено (например, из кэша)
            img.classList.add('loaded');
        } else {
            // Если изображение ещё загружается
            img.addEventListener('load', () => {
                setTimeout(() => img.classList.add('loaded'), 50);
            });
        }
    });

    // Кнопка "Наверх"
    const scrollToTopBtn = document.querySelector('.scroll-to-top');
    if (scrollToTopBtn) {
        // Показываем/скрываем кнопку при прокрутке
        window.addEventListener('scroll', () => {
            if (window.scrollY > 1000) { // Показываем после прокрутки на 1000px (~2-3 картины)
                scrollToTopBtn.classList.remove('hidden');
                scrollToTopBtn.classList.add('visible');
            } else {
                scrollToTopBtn.classList.remove('visible');
                scrollToTopBtn.classList.add('hidden');
            }
        });

        // Плавная прокрутка наверх при клике
        scrollToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
});
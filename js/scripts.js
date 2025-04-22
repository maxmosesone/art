document.addEventListener("DOMContentLoaded", function () {
    // Переключение выпадающего меню
    const menuToggle = document.getElementById("menu-toggle");
    const menu = document.getElementById("menu");
    let scrollPosition = 0;

    if (menuToggle && menu) {
        menuToggle.addEventListener("click", function () {
            if (menu.classList.contains("hidden")) {
                scrollPosition = window.scrollY;
                menu.classList.remove("hidden");
                document.documentElement.classList.add("no-scroll");
                document.body.classList.add("no-scroll");
            } else {
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
            { src: "images/Alpha.jpg", page: "/paintings/2025" },
            { src: "images/DirtyMonk.jpg", page: "/paintings/2024" },
            { src: "images/art1.jpg", page: "/paintings/2025" },
            { src: "images/art2.jpg", page: "/paintings/2024" },
            { src: "images/Simulation_V.jpg", page: "/digital" },
            { src: "images/Simulation_verse.jpg", page: "/digital" },
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
                        console.log(`Redirecting to: ${images[currentImageIndex].page}`); // Для отладки
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
            console.log(`Initial redirect to: ${images[initialImageIndex].page}`); // Для отладки
            window.location.href = images[initialImageIndex].page;
        };
        currentIndexPosition++;
        setInterval(changeImage, 4000);
    }

    // Логика для галерей на странице Digital
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
        let isThrottled = false;

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

        prevArrow.addEventListener("click", function () {
            if (isThrottled) return;
            isThrottled = true;
            currentIndex = (currentIndex - 1 + images.length) % images.length;
            updateGallery();
            setTimeout(() => { isThrottled = false; }, 300);
        });

        nextArrow.addEventListener("click", function () {
            if (isThrottled) return;
            isThrottled = true;
            currentIndex = (currentIndex + 1) % images.length;
            updateGallery();
            setTimeout(() => { isThrottled = false; }, 300);
        });

        let touchStartX = 0;
        let touchEndX = 0;
        let touchTarget = null;
        const swipeThreshold = 50;

        gallery.addEventListener("touchstart", function (e) {
            touchStartX = e.touches[0].clientX;
            touchTarget = e.target;
        });

        gallery.addEventListener("touchmove", function (e) {
            touchEndX = e.touches[0].clientX;
        });

        gallery.addEventListener("touchend", function () {
            const isArrowTouch = touchTarget && (touchTarget.closest(".prev-arrow") || touchTarget.closest(".next-arrow"));
            if (isArrowTouch) {
                touchStartX = 0;
                touchEndX = 0;
                touchTarget = null;
                return;
            }

            const swipeDistance = touchEndX - touchStartX;

            if (swipeDistance < -swipeThreshold) {
                nextArrow.click();
            } else if (swipeDistance > swipeThreshold) {
                prevArrow.click();
            }

            touchStartX = 0;
            touchEndX = 0;
            touchTarget = null;
        });

        updateGallery();
    });

    // Плавное появление изображений
    const images = document.querySelectorAll('.work-item img');
    images.forEach(img => {
        if (img.complete) {
            img.classList.add('loaded');
        } else {
            img.addEventListener('load', () => {
                setTimeout(() => img.classList.add('loaded'), 50);
            });
        }
    });

    // Кнопка "Наверх"
    const scrollToTopBtn = document.querySelector('.scroll-to-top');
    if (scrollToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 800) {
                scrollToTopBtn.classList.remove('hidden');
                scrollToTopBtn.classList.add('visible');
            } else {
                scrollToTopBtn.classList.remove('visible');
                scrollToTopBtn.classList.add('hidden');
            }
        });

        scrollToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
});
document.addEventListener("DOMContentLoaded", function () {
    // Переключение выпадающего меню
    const menuToggle = document.getElementById("menu-toggle");
    const menu = document.getElementById("menu");

    if (menuToggle && menu) {
        menuToggle.addEventListener("click", function () {
            menu.classList.toggle("hidden");
        });
    } else {
        console.error("Menu or Menu Toggle button not found!");
    }

    // Pull-to-Refresh для мобильных устройств
    let touchStartY = 0;
    let touchCurrentY = 0;
    let isPulling = false;

    window.addEventListener("touchstart", function (e) {
        if (window.scrollY === 0) { // Только если в самом верху страницы
            touchStartY = e.touches[0].clientY;
            isPulling = true;
        }
    });

    window.addEventListener("touchmove", function (e) {
        if (!isPulling) return;
        touchCurrentY = e.touches[0].clientY;
        const pullDistance = touchCurrentY - touchStartY;

        // Убираем transform с body, чтобы не ломать position: fixed
        if (pullDistance > 150) {
            // Можно добавить визуальный индикатор, если нужно
        }
    });

    window.addEventListener("touchend", function () {
        if (!isPulling) return;
        const pullDistance = touchCurrentY - touchStartY;

        if (pullDistance > 150 && window.scrollY === 0) {
            window.location.reload();
        }

        isPulling = false;
        touchStartY = 0;
        touchCurrentY = 0;
    });

    // Логика слайд-шоу на главной странице
    const slideshowImage = document.getElementById("slideshow-image");
    if (slideshowImage) {
        const images = [
            { src: "images/LemonTree.jpg", page: "paintings.html" },
            { src: "images/Wave-III.jpg", page: "paintings.html" },
            { src: "images/DirtyMonk.jpg", page: "paintings.html" },
            { src: "images/art1.jpg", page: "paintings.html" },
            { src: "images/art2.jpg", page: "paintings.html" },
            { src: "images/Wave_3.jpg", page: "paintings.html" },
            { src: "images/Simulation_V.jpg", page: "digital.html" },
            { src: "images/Simulation_IV.jpg", page: "digital.html" },
            { src: "images/Simulation_III.jpg", page: "digital.html" },
            { src: "images/Simulation_III.II.jpg", page: "digital.html" },
            { src: "images/Simulation_IV.I.jpg", page: "digital.html" },
            { src: "images/Simulation.jpg", page: "digital.html" },
            { src: "images/Good_Thoughts.jpg", page: "digital.html" },
            { src: "images/Simulation_II.I.jpg", page: "digital.html" },
            { src: "images/Simulation_II.jpg", page: "digital.html" }
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
});
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

    // Логика слайд-шоу на главной странице
    const slideshowImage = document.getElementById("slideshow-image");
    if (slideshowImage) {
        // Массив объектов: путь к изображению и целевая страница
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

        let currentIndexPosition = 0; // Позиция в массиве индексов 
        let imageIndices = []; // Массив индексов для текущего цикла
        let preloadedImages = []; // Массив для предзагруженных изображений

        // Предзагрузка всех изображений
        function preloadImages() {
            images.forEach((imageObj, index) => {
                const img = new Image();
                img.src = imageObj.src;
                preloadedImages[index] = img;
            });
        }

        // Функция для перемешивания массива (алгоритм Фишера-Йетса)
        function shuffleArray(array) {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
            return array;
        }

        // Функция для создания нового перемешанного массива индексов
        function createShuffledIndices() {
            imageIndices = Array.from({ length: images.length }, (_, index) => index);
            shuffleArray(imageIndices);
            currentIndexPosition = 0;
        }

        // Функция для смены изображения
        function changeImage() {
            // Убираем класс active (исчезновение)
            slideshowImage.classList.remove("active");

            // Ждём завершения анимации исчезновения через событие transitionend
            slideshowImage.addEventListener(
                "transitionend",
                function handler() {
                    // Удаляем обработчик после срабатывания
                    slideshowImage.removeEventListener("transitionend", handler);

                    // Если достигли конца массива индексов, создаём новый
                    if (currentIndexPosition >= imageIndices.length) {
                        createShuffledIndices();
                    }

                    // Получаем текущий индекс изображения
                    const currentImageIndex = imageIndices[currentIndexPosition];
                    slideshowImage.src = images[currentImageIndex].src;
                    slideshowImage.classList.add("active");

                    // Обновляем обработчик клика для текущего изображения
                    slideshowImage.onclick = function () {
                        window.location.href = images[currentImageIndex].page;
                    };

                    // Переходим к следующему индексу
                    currentIndexPosition++;
                },
                { once: true } // Событие сработает только один раз
            );
        }

        // Инициализация
        preloadImages(); // Предзагружаем изображения
        createShuffledIndices(); // Создаём первый перемешанный массив индексов

        // Показываем первое изображение
        const initialImageIndex = imageIndices[currentIndexPosition];
        slideshowImage.src = images[initialImageIndex].src;
        slideshowImage.classList.add("active");

        // Устанавливаем обработчик клика для первого изображения
        slideshowImage.onclick = function () {
            window.location.href = images[initialImageIndex].page;
        };

        // Увеличиваем currentIndexPosition сразу после инициализации
        currentIndexPosition++;

        // Меняем картинку каждые 5 секунд (1 секунда на исчезновение + 4 секунды отображения)
        setInterval(changeImage, 5000);
    }

    // Логика для галерей на странице Digital
    const galleries = document.querySelectorAll(".work-item.has-gallery");
    galleries.forEach(function (gallery) {
        // Получаем данные из атрибутов
        let images, captions;
        try {
            images = JSON.parse(gallery.getAttribute("data-images"));
            captions = JSON.parse(gallery.getAttribute("data-captions"));
        } catch (e) {
            console.error("Ошибка в данных галереи:", gallery, e);
            return;
        }

        // Проверяем корректность данных
        if (!images || !captions || images.length !== captions.length || images.length === 0) {
            console.error("Некорректные данные в галерее:", gallery);
            return;
        }

        const imgElement = gallery.querySelector("img");
        const captionElement = gallery.querySelector(".info h3");
        let currentIndex = 0;

        // Функция обновления изображения и подписи
        function updateGallery() {
            imgElement.src = images[currentIndex];
            captionElement.textContent = captions[currentIndex];
        }

        // Обработчики для стрелок
        const prevArrow = gallery.querySelector(".prev-arrow");
        const nextArrow = gallery.querySelector(".next-arrow");

        // Скрываем стрелки, если только одно изображение
        if (images.length <= 1) {
            prevArrow.style.display = "none";
            nextArrow.style.display = "none";
        }

        prevArrow.addEventListener("click", function () {
            currentIndex = (currentIndex - 1 + images.length) % images.length;
            updateGallery();
        });

        nextArrow.addEventListener("click", function () {
            currentIndex = (currentIndex + 1) % images.length;
            updateGallery();
        });

        // Инициализация: показываем первое изображение
        updateGallery();
    });
});
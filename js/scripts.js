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
            { src: "images/Simulation.jpg", page: "digital.html" },
            { src: "images/Simulation_II.jpg", page: "digital.html" }
        ];

        let currentIndexPosition = 0; // Позиция в массиве индексов
        let imageIndices = []; // Массив индексов для текущего цикла

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

            // Ждём завершения анимации исчезновения (1 секунда)
            setTimeout(() => {
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
            }, 1000);
        }

        // Инициализация: создаём первый перемешанный массив индексов
        createShuffledIndices();

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
});
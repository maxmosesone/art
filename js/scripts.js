document.addEventListener("DOMContentLoaded", function () {
    // Переключение выпадающего меню
    const menuToggle = document.getElementById("menu-toggle");
    const menu = document.getElementById("menu");

    if (menuToggle && menu) {
        menuToggle.addEventListener("click", function () {
            menu.classList.toggle("hidden"); // Переключаем класс hidden
        });
    } else {
        console.error("Menu or Menu Toggle button not found!");
    }

    // Логика слайд-шоу на главной странице
    const slideshowImage = document.getElementById("slideshow-image");
    if (slideshowImage) { // Проверяем, что элемент существует (слайд-шоу есть только на главной странице)
        // Массив с путями к картинкам
        const images = [
            "images/art1.jpg",
            "images/art2.jpg",
            "images/Wave_3.jpg",
            "images/Simulation_III.jpg",
            "images/Simulation_II.jpg"
        ];

        let currentImageIndex = 0;

        // Функция для выбора случайного изображения
        function getRandomImageIndex(currentIndex) {
            let newIndex;
            do {
                newIndex = Math.floor(Math.random() * images.length);
            } while (newIndex === currentIndex); // Убедимся, что не выберем ту же картинку
            return newIndex;
        }

        // Функция для смены изображения
        function changeImage() {
            // Убираем класс active (исчезновение)
            slideshowImage.classList.remove("active");

            // Ждём завершения анимации исчезновения (1 секунда)
            setTimeout(() => {
                currentImageIndex = getRandomImageIndex(currentImageIndex);
                slideshowImage.src = images[currentImageIndex];
                slideshowImage.classList.add("active"); // Появление
            }, 1000);
        }

        // Инициализация: показываем первую картинку
        slideshowImage.src = images[currentImageIndex];
        slideshowImage.classList.add("active");

        // Меняем картинку каждые 3 секунды (1 секунда на исчезновение + 2 секунды отображения)
        setInterval(changeImage, 5000);
    }
});
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
    if (slideshowImage) {
        // Массив объектов: путь к изображению и целевая страница
        const images = [
            { src: "images/art1.jpg", page: "paintings.html" },
            { src: "images/art2.jpg", page: "paintings.html" },
            { src: "images/Wave_3.jpg", page: "paintings.html" },
            { src: "images/Simulation_III.jpg", page: "digital.html" },
            { src: "images/Simulation_II.jpg", page: "digital.html" }
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
                slideshowImage.src = images[currentImageIndex].src;
                slideshowImage.classList.add("active"); // Появление
            }, 1000);
        }

        // Инициализация: показываем первую картинку
        slideshowImage.src = images[currentImageIndex].src;
        slideshowImage.classList.add("active");

        // Добавляем обработчик клика
        slideshowImage.addEventListener("click", function () {
            const currentImage = images[currentImageIndex];
            window.location.href = currentImage.page; // Перенаправляем на соответствующую страницу
        });

        // Меняем картинку каждые 3 секунды (1 секунда на исчезновение + 2 секунды отображения)
        setInterval(changeImage, 5000);
    }
});
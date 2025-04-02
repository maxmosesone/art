// Переключение выпадающего меню
document.addEventListener('DOMContentLoaded', function () {
    const menuToggle = document.getElementById('menu-toggle');
    const menu = document.getElementById('menu');

    if (menuToggle && menu) {
        menuToggle.addEventListener('click', function () {
            menu.classList.toggle('hidden'); // Переключаем класс hidden
        });
    } else {
        console.error('Menu or Menu Toggle button not found!');
    }
});
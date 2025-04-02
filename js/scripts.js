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

// Появление футера при прокрутке до конца страницы
window.addEventListener('scroll', () => {
    const footer = document.querySelector('footer');
    if (footer) {
        const scrollPosition = window.scrollY + window.innerHeight;
        const pageHeight = document.documentElement.scrollHeight;

        if (scrollPosition >= pageHeight) {
            footer.style.opacity = '1'; // Показываем футер
        } else {
            footer.style.opacity = '0'; // Скрываем футер
        }
    } else {
        console.error('Footer not found!');
    }
});
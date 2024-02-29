

document.addEventListener('DOMContentLoaded', function () {
    // Получаем элементы меню и кнопки
    var menuButton = document.querySelector('.menu__x');
    var menuBlock = document.querySelector('.menu');

    // Устанавливаем начальное состояние
    var isMenuVisible = false;

    // Добавляем слушатель события на кнопку
    menuButton.addEventListener('click', function () {
        // Изменяем состояние меню
        isMenuVisible = !isMenuVisible;

        // Применяем стили в зависимости от состояния
        if (isMenuVisible) {
            menuBlock.style.display = 'flex';
        } else {
            menuBlock.style.display = 'none';
        }
    });
});

document.addEventListener("click", function (event) {
    var buySelect = document.querySelector(".buy__select");
    var options = document.getElementById("options");

    if (event.target !== buySelect && !buySelect.contains(event.target)) {
        options.style.display = "none";
    }
});

function toggleOptions(event) {
    event.stopPropagation(); // Остановка всплытия события
    var options = document.getElementById("options");
    options.style.display = (options.style.display === "block") ? "none" : "block";
}

function selectOption(option) {
    var selectedOption = document.getElementById("selectedOption");
    selectedOption.innerText = option.innerText;

    var options = document.getElementById("options");
    options.style.display = "none";
}



// Изменено начальное состояние для первой вкладки
document.addEventListener("DOMContentLoaded", function () {
	changeTab(1);
  });
  
  function changeTab(tabNumber) {
	// Скрыть все вкладки
	const tabs = document.querySelectorAll('.content__tab');
	tabs.forEach(tab => tab.style.display = 'none');
  
	// Убрать класс active у всех вкладок
	const tabItems = document.querySelectorAll('.tabs__item');
	tabItems.forEach(item => item.classList.remove('active'));
  
	// Показать выбранную вкладку
	const selectedTab = document.getElementById(`tab${tabNumber}`);
	selectedTab.style.display = 'block';
  
	// Добавить класс active к выбранной вкладке
	const selectedTabItem = document.querySelector(`.tabs__item:nth-child(${tabNumber})`);
	selectedTabItem.classList.add('active');
  }
  
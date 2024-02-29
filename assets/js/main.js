function increaseQuantity() {
	var quantityInput = document.getElementById('quantity');
	var currentQuantity = parseInt(quantityInput.value);
	quantityInput.value = currentQuantity + 1;
}

function decreaseQuantity() {
	var quantityInput = document.getElementById('quantity');
	var currentQuantity = parseInt(quantityInput.value);
	
	if (currentQuantity > 1) {
		quantityInput.value = currentQuantity - 1;
	}
}


// document.addEventListener('DOMContentLoaded', function() {
//     const faqItems = document.querySelectorAll('.faq__item');

//     faqItems.forEach(item => {
//         const question = item.querySelector('.faq__question');

//         question.addEventListener('click', function() {
//             faqItems.forEach(otherItem => {
//                 if (otherItem !== item) {
//                     otherItem.classList.remove('active');
//                 }
//             });

//             item.classList.toggle('active');
//         });
//     });
// });

document.addEventListener('DOMContentLoaded', function() {
  const faqItems = document.querySelectorAll('.faq__item');

  faqItems.forEach(item => {
      item.addEventListener('click', function() {
          faqItems.forEach(otherItem => {
              if (otherItem !== item) {
                  otherItem.classList.remove('active');
              }
          });

          item.classList.toggle('active');
      });
  });
});


document.addEventListener('DOMContentLoaded', function() {
    // Получаем кнопку "Купить" по классу
    var buyBtn = document.querySelector('.buy__btn');
    // Получаем модальное окно "Купить" по id
    var modalBuy = document.getElementById('modal__buy');

    // Получаем кнопку "Помощь" по классу
    var helpBtn = document.querySelector('.help__btn');
    // Получаем модальное окно "Помощь" по id
    var modalHelp = document.getElementById('modal__help');

    // При нажатии на кнопку "Купить"
    buyBtn.addEventListener('click', function(event) {
      // Отменяем стандартное поведение кнопки (предотвращаем переход по ссылке)
      event.preventDefault();
      // Делаем блок #modal__buy видимым
      modalBuy.style.display = 'flex';
      // Добавляем класс для блокировки прокрутки страницы
      document.body.classList.add('modal-open');
    });

    // При нажатии на кнопку "Помощь"
    helpBtn.addEventListener('click', function(event) {
      // Отменяем стандартное поведение кнопки (предотвращаем переход по ссылке)
      event.preventDefault();
      // Делаем блок #modal__help видимым
      modalHelp.style.display = 'flex';
      // Добавляем класс для блокировки прокрутки страницы
      document.body.classList.add('modal-open');
    });

    // При клике вне блока modal__block для "Купить"
    document.addEventListener('click', function(e) {
      if (e.target === modalBuy) {
        closeModal(modalBuy);
      }
    });

    // При клике вне блока modal__block для "Помощь"
    document.addEventListener('click', function(e) {
      if (e.target === modalHelp) {
        closeModal(modalHelp);
      }
    });

    // Предотвращаем закрытие модального окна при клике внутри блока modal__block
    modalBuy.querySelector('.modal__block').addEventListener('click', function(e) {
      e.stopPropagation();
    });

    // Предотвращаем закрытие модального окна при клике внутри блока modal__block
    modalHelp.querySelector('.modal__block').addEventListener('click', function(e) {
      e.stopPropagation();
    });

    // При нажатии на любую кнопку "Закрыть" внутри модального окна "Купить"
    modalBuy.querySelectorAll('.modal__close').forEach(function(btn) {
      btn.addEventListener('click', function() {
        closeModal(modalBuy);
      });
    });

    // При нажатии на любую кнопку "Закрыть" внутри модального окна "Помощь"
    modalHelp.querySelectorAll('.modal__close').forEach(function(btn) {
      btn.addEventListener('click', function() {
        closeModal(modalHelp);
      });
    });

    // Функция для закрытия модального окна
    function closeModal(modal) {
      // Скрываем модальное окно
      modal.style.display = 'none';
      // Убираем класс для разблокировки прокрутки страницы
      document.body.classList.remove('modal-open');
    }
  });


  document.addEventListener("DOMContentLoaded", function () {
	const container = document.querySelector('.benefit__container');
	const indicatorsContainer = document.querySelector('.benefit__indicators');

	let currentIndex = 0;

	// Добавляем индикаторы
	for (let i = 0; i < container.children.length; i++) {
		const indicator = document.createElement('div');
		indicator.classList.add('indicator');
		indicator.addEventListener('click', () => goToSlide(i));
		indicatorsContainer.appendChild(indicator);
	}

	indicatorsContainer.children[0].classList.add('active');


	// Переключение слайдов по свайпу
	

	// Функция для переключения на указанный слайд
	function goToSlide(index) {
		currentIndex = index;
		currentTranslateX = -index * 100;
		container.style.transform = `translateX(${currentTranslateX}%)`;

		// Обновляем активный индикатор
		updateIndicators();
	}

	// Обновление активного индикатора
	function updateIndicators() {
		const indicators = document.querySelectorAll('.indicator');
		indicators.forEach((indicator, index) => {
			indicator.classList.toggle('active', index === currentIndex);
		});
	}
});


document.addEventListener('DOMContentLoaded', function () {
    // Получаем элементы меню и кнопки
    var menuButton = document.querySelector('.menu-toggle');
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

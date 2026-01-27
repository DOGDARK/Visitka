/* Открытие модального окна */
let selectedTariffPrice = 0;
let orderSent = false;


function openTariff(title, desc, price) {
    console.log("FRONT VERSION 2026-01-20");
    document.getElementById("modalTitle").textContent = title;
    document.getElementById("modalDesc").textContent = desc;

    selectedTariffPrice = price;

    document.getElementById("tariffModal").classList.add("active");

    updatePrice();
}


/* Закрытие модального окна */
function closeModal() {
    document.getElementById("tariffModal").classList.remove("active");
}

/* Всплывающее уведомление */
function showMessage(msg, duration = 3000) {
    const div = document.createElement("div");
    div.className = "message";
    div.textContent = msg;
    document.body.appendChild(div);
    setTimeout(() => div.remove(), duration);
}

/* Отправка формы */
// function sendOrder() {
//     const initData = "user={\"id\":1212333}&auth_date=1234567890";

//     const name = document.getElementById("name").value.trim();
//     const username = document.getElementById("username").value.trim();
//     const description = document.getElementById("description").value.trim();

//     if (!name || !description) {
//         showMessage("Пожалуйста, заполните все обязательные поля");
//         return;
//     }

//     const payload = {
//         init_data: initData,
//         first_name: name || null,
//         last_name: username || null
//     };

//     fetch("http://185.200.241.236:8000/users", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload)
//     })
//     .then(response => {
//         if (!response.ok) throw new Error("Ошибка сети");
//         return response.json();
//     })
//     .then(data => {
//         showMessage("Заявка отправлена!");
//         document.getElementById("name").value = "";
//         document.getElementById("username").value = "";
//         document.getElementById("description").value = "";
//         closeModal();
//     })
//     .catch(error => {
//         console.error(error);
//         showMessage("Ошибка при отправке!");
//     });
// }

function sendOrder() {
    const name = document.getElementById("name").value.trim();
    const username = document.getElementById("username").value.trim();
    const desc = document.getElementById("description").value.trim();

    const db = document.getElementById("opt_db").checked;
    const payment = document.getElementById("opt_payment").checked;
    const pagesEnabled = document.getElementById("opt_pages").checked;
    const pagesCount = pagesEnabled ? (parseInt(document.getElementById("pagesCount").value) || 0) : 0;

    const finalPriceText = document.getElementById("priceDisplay").textContent;
    const finalPrice = parseInt(finalPriceText.replace(/\D/g, ""));

    const initData = window.Telegram.WebApp.initData || "";

    const tariff = document.getElementById("modalTitle").textContent;

    if (!name || !description) {
    showMessage("Пожалуйста, заполните все обязательные поля");
    return;
    };

    const payload_user = {
        init_data: initData,
        first_name: name || null,
        last_name: username || null
    };

    fetch("https://l-dev.tech/api/users", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload_user)
    })
    .then(res => res.json())
    .then(data => console.log("Данные отправлены:", data))
    .catch(err => console.error("Ошибка отправки данных:", err));

    const payload_order = {
        description: desc,
        tariff,
        db,
        payment,
        pagesEnabled,
        pagesCount,
        finalPrice,
        init_data: initData
    };

    console.log("Отправка:", payload_order);

    // отправляем в бэк
    fetch("https://l-dev.tech/api/orders", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload_order)
    })
    .then(response => {
        if (!response.ok) throw new Error("Ошибка сети");
        return response.json();
    })
    .then(data => {
        showMessage("Заявка отправлена!");

        orderSent = true; 
        closeTariffModal();
        resetForm();
    })
    .catch(error => {
        console.error(error);
        showMessage("Ошибка при отправке!");
    });
}


function closeTariffModal() {
    const name = document.getElementById("name").value.trim();
    const username = document.getElementById("username").value.trim();
    const desc = document.getElementById("description").value.trim();

    const db = document.getElementById("opt_db").checked;
    const payment = document.getElementById("opt_payment").checked;
    const pagesEnabled = document.getElementById("opt_pages").checked;
    const pagesCount = pagesEnabled ? (parseInt(document.getElementById("pagesCount").value) || 0) : 0;

    const finalPriceText = document.getElementById("priceDisplay").textContent;
    const finalPrice = parseInt(finalPriceText.replace(/\D/g, ""));

    // initData от Telegram WebApp
    const initData = window.Telegram.WebApp.initData || "";

    const tariff = document.getElementById("modalTitle").textContent;

    document.getElementById("tariffModal").classList.remove("active");
    resetForm();

    // Отправка только если заказ ещё не был отправлен
    if (!orderSent && (db || payment || pagesEnabled || name || username || desc)) {
        const payload_user = {
        init_data: initData,
        first_name: name || null,
        last_name: username || null
        };

        fetch("https://l-dev.tech/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload_user)
        })
        .then(res => res.json())
        .then(data => console.log("Данные отправлены:", data))
        .catch(err => console.error("Ошибка отправки данных:", err));


        const payload_order = {
            description: desc,
            tariff,
            db,
            payment,
            pagesEnabled,
            pagesCount,
            finalPrice,
            init_data: initData
        };

        fetch("https://l-dev.tech/api/orders", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload_order)
        })
        .then(res => res.json())
        .then(data => console.log("Данные отправлены:", data))
        .catch(err => console.error("Ошибка отправки данных:", err));
    }

    orderSent = false;
}




function resetForm() {
    // Сброс текстовых полей
    document.getElementById("name").value = "";
    document.getElementById("username").value = "";
    document.getElementById("description").value = "";

    // Чекбоксы
    document.getElementById("opt_db").checked = false;
    document.getElementById("opt_payment").checked = false;
    document.getElementById("opt_pages").checked = false;

    // Доп страницы
    document.getElementById("pagesCount").value = "";
    document.getElementById("pagesCountBlock").classList.add("hidden");

    // Сброс выбранного тарифа и цены
    selectedTariffPrice = 0;
    selectedTariffName = null;

    updatePrice();
}


function togglePagesInput() {
    const checkbox = document.getElementById("opt_pages");
    const block = document.getElementById("pagesCountBlock");

    if (checkbox.checked) {
        block.classList.remove("hidden");
    } else {
        block.classList.add("hidden");
        document.getElementById("pagesCount").value = "";
    }
}

function updatePrice() {
    let price = selectedTariffPrice;

    const db = document.getElementById("opt_db").checked;
    const payment = document.getElementById("opt_payment").checked;
    const pagesEnabled = document.getElementById("opt_pages").checked;
    const pagesCount = parseInt(document.getElementById("pagesCount").value) || 0;

    if (db) price += 10000;
    if (payment) price += 10000;

    if (pagesEnabled && pagesCount > 0) {
        price += pagesCount * 2000;
    }

    document.getElementById("priceDisplay").textContent =
        `Цена: ${price.toLocaleString("ru-RU")} ₽`;
}


function togglePagesInput() {
    const checkbox = document.getElementById("opt_pages");
    const block = document.getElementById("pagesCountBlock");

    if (checkbox.checked) {
        block.classList.remove("hidden");
    } else {
        block.classList.add("hidden");
        document.getElementById("pagesCount").value = "";
    }

    updatePrice();
}


/* ================= STORIES ================= */

/*
  Каждая группа = 1 сторис
  Внутри массив экранов (частей)
*/

const STORIES = [
    // ===== СТОРИС 1: СФЕРЫ =====
    [
        "В каких сферах может быть полезно мини-приложение",

        "Личный бренд\n\nИдеальная цифровая визитка:\nконтакты, ссылки,\nпортфолио, услуги —\nвсё в одном месте.",

        "Бизнес-услуги\n\nЮристы, маркетологи,\nSMM-специалисты,\nпсихологи, репетиторы.\n\nОписание услуг,\nцены и способы связи.",

        "Кафе, рестораны, бары\n\nМеню, акции,\nотзывы и кнопки\nдля бронирования.",

        "Бьюти-мастера\n\nПрайс услуг,\nонлайн-запись,\nгалерея работ\nи кнопки связи.",

        "Фитнес-тренеры и нутрициологи\n\nПрограммы,\nрасписание,\nформы записи\nи полезные материалы.",

        "Магазины и онлайн-продажи\n\nКаталог товаров,\nкарточки позиций,\nоформление заявок\nи переход к оплате.",

        "Мероприятия\n\nАнонсы,\nрасписание,\nкарта локаций\nи регистрация.",

        "Строительные и ремонтные услуги\n\nОписание работ,\nпримеры проектов,\nстоимость\nи обратная связь.",

        "Автосфера\n\nСТО,\nшиномонтаж,\nмойки.\n\nПрайс,\nакции\nи запись.",

        "Медицинская сфера\n\nОбщие сведения,\nнаправления работы,\nформы заявки\nи контакты."
    ],

    // ===== СТОРИС 2: ПОЧЕМУ МИНИ-ПРИЛОЖЕНИЕ =====
    [
        "Почему именно мини-приложение,\nа не бот",

        "Приятный визуальный интерфейс\n\nНе сообщения,\nа полноценные страницы,\nкарточки и кнопки.\n\nКак мини-сайт\nв Telegram.",

        "Никакой лишней переписки\n\nПользователь сразу\nвидит меню и разделы.\n\nНе нужно искать\nинформацию в чате.",

        "Быстрая навигация\n\nВсе важные элементы\nдоступны одним касанием\nбез длинных диалогов.",

        "Больше возможностей\n\nГалереи,\nтаблицы,\nкарточки,\nформы,\nгибкий дизайн\nи расширенный функционал.\n\nБот этим ограничен."
    ],

    // ===== СТОРИС 3: ПРОЦЕСС РАБОТЫ =====
    [
        "Наш процесс работы",

        "1. Обсуждаем задачу\n\nСозваниваемся,\nобсуждаем нюансы\nи формируем\nидею проекта.",

        "2. Предлагаем структуру\n\nПродумываем навигацию,\nблоки,\nкнопки\nи логику переходов.",

        "3. Создаём дизайн\n\nПодбираем стиль,\nцвета,\nиконки\nи аккуратное оформление.",

        "4. Наполняем контентом\n\nТексты,\nфото,\nссылки,\nконтакты\nи прайсы.",

        "5. Запуск в Telegram\n\nНастраиваем WebApp,\nпривязываем к боту\nи проверяем отображение.",

        "6. Финальная проверка\n\nВы тестируете,\nмы вносим правки\nи дополняем блоки.",

        "7. Передаём проект\n\nГотовое мини-приложение\nстановится вашим\nинструментом\nдля работы."
    ]
];




let groupIndex = 0;
let partIndex = 0;
let timer = null;
const DURATION = 5000;

const overlay = document.getElementById("storiesOverlay");
const textEl = document.getElementById("storyText");
const progressContainer = document.querySelector(".stories-progress");

let activeTimeoutId = null;
let isPaused = false;
let remainingTime = 0;
let startTime = 0;



function openStoryGroup(index) {
    groupIndex = index;
    partIndex = 0;
    overlay.classList.remove("hidden");
    buildProgress();
    showPart();
}

function closeStories() {
    overlay.classList.add("hidden");
    clearTimeout(timer);
}

function buildProgress() {
    progressContainer.innerHTML = "";
    STORIES[groupIndex].forEach(() => {
        const bar = document.createElement("div");
        const span = document.createElement("span");
        bar.appendChild(span);
        progressContainer.appendChild(bar);
    });
}

function showPart() {
    // стоп всего
    if (activeTimeoutId) {
        clearTimeout(activeTimeoutId);
        activeTimeoutId = null;
    }

    isPaused = false;

    if (partIndex < 0) partIndex = 0;
    if (partIndex >= STORIES[groupIndex].length) {
        closeStories();
        return;
    }

    textEl.innerText = STORIES[groupIndex][partIndex];

    remainingTime = DURATION;
    startTime = Date.now();

    resetAndAnimateProgress();

    activeTimeoutId = setTimeout(nextPart, remainingTime);
}




// Тапы
document.querySelector(".story-tap.left").onclick = () => {
    if (partIndex > 0) {
        if (activeTimeoutId) clearTimeout(activeTimeoutId);
        activeTimeoutId = null;
        partIndex--;
        showPart();
    }
};

document.querySelector(".story-tap.right").onclick = () => {
    if (activeTimeoutId) clearTimeout(activeTimeoutId);
    activeTimeoutId = null;
    partIndex++;
    showPart();
};


// Свайп вниз
let startY = 0;
overlay.addEventListener("touchstart", e => {
    startY = e.touches[0].clientY;
});
overlay.addEventListener("touchend", e => {
    if (e.changedTouches[0].clientY - startY > 80) {
        closeStories();
    }
});

function pauseStory() {
    if (isPaused || !activeTimeoutId) return;

    isPaused = true;

    clearTimeout(activeTimeoutId);
    activeTimeoutId = null;

    const elapsed = Date.now() - startTime;
    remainingTime = Math.max(0, remainingTime - elapsed);

    const currentSpan =
        progressContainer.children[partIndex].querySelector("span");

    const width = getComputedStyle(currentSpan).width;
    currentSpan.style.transition = "none";
    currentSpan.style.width = width;
}



function resumeStory() {
    if (!isPaused || remainingTime <= 0) return;

    isPaused = false;

    const currentSpan =
        progressContainer.children[partIndex].querySelector("span");

    requestAnimationFrame(() => {
        currentSpan.style.transition = `width ${remainingTime}ms linear`;
        currentSpan.style.width = "100%";
    });

    startTime = Date.now();
    activeTimeoutId = setTimeout(nextPart, remainingTime);
}



function nextPart() {
    if (isPaused) return;

    activeTimeoutId = null;
    partIndex++;
    showPart();
}


const windowEl = document.querySelector(".stories-window");

windowEl.addEventListener("mousedown", pauseStory);
windowEl.addEventListener("mouseup", resumeStory);
windowEl.addEventListener("mouseleave", resumeStory);

windowEl.addEventListener("touchstart", pauseStory);
windowEl.addEventListener("touchend", resumeStory);

storiesOverlay.addEventListener("click", e => {
    if (e.target === storiesOverlay) {
        closeStories();
    }
});


if (activeTimeoutId) {
    clearTimeout(activeTimeoutId);
    activeTimeoutId = null;
}
isPaused = false;

function resetAndAnimateProgress() {
    const bars = progressContainer.children;

    for (let i = 0; i < bars.length; i++) {
        const bar = bars[i];

        bar.innerHTML = "";

        const span = document.createElement("span");

        if (i < partIndex) {
            span.style.width = "100%";
        } else {
            span.style.width = "0";
        }

        bar.appendChild(span);
    }

    const currentSpan = bars[partIndex].querySelector("span");

    requestAnimationFrame(() => {
        currentSpan.style.transition = `width ${remainingTime}ms linear`;
        currentSpan.style.width = "100%";
    });
}



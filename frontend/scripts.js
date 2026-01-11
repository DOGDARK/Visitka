let imgIndex = 0;
const images = ["images/site1.png","images/site2.png","images/site3.png"];

let mediaIndex = 0;

let selectedTariffPrice = 0;
let orderSent = false;

const tariffOptions = {
    "Plan 1": { db: false, payment: false, pagesEnabled: false },
    "Plan 2": { db: true,  payment: false, pagesEnabled: true, pagesCount: 3 },
    "Plan 3": { db: true,  payment: true,  pagesEnabled: true, pagesCount: 5 }
};



const mediaSequence = [
    { type: "video", src: "media/demo.mp4" },
    { type: "image", src: "images/site1.png" },
    { type: "image", src: "images/site2.png" },
    { type: "image", src: "images/site3.png" }
];

function changeMedia() {
    const img = document.getElementById("dynamicImg");
    const video = document.getElementById("dynamicVideo");

    mediaIndex = (mediaIndex + 1) % mediaSequence.length;
    const current = mediaSequence[mediaIndex];

    if (current.type === "image") {
        video.pause();
        video.classList.add("hidden");

        img.src = current.src;
        img.classList.remove("hidden");
    } else {
        img.classList.add("hidden");

        video.src = current.src;
        video.classList.remove("hidden");
        video.play();
    }
}

function openTariff(title, desc, price) {
    document.getElementById("modalTitle").textContent = title;
    document.getElementById("modalDesc").textContent = desc;

    selectedTariffPrice = price;

    const options = tariffOptions[title] || {};
    document.getElementById("opt_db").checked = options.db || false;
    document.getElementById("opt_payment").checked = options.payment || false;

    if (options.pagesEnabled) {
        document.getElementById("opt_pages").checked = true;
        document.getElementById("pagesCountBlock").classList.remove("hidden");
        document.getElementById("pagesCount").value = options.pagesCount || 0;
    } else {
        document.getElementById("opt_pages").checked = false;
        document.getElementById("pagesCountBlock").classList.add("hidden");
        document.getElementById("pagesCount").value = "";
    }

    updatePrice();

    document.getElementById("tariffModal").classList.add("active");
}


function showMessage(msg, duration = 3000) {
    const div = document.createElement("div");
    div.className = "message";
    div.textContent = msg;
    document.body.appendChild(div);
    setTimeout(() => div.remove(), duration);
}

function sendOrder() {
    if (!validateForm()) return;

    const name = document.getElementById("name").value.trim();
    const username = document.getElementById("username").value.trim();
    const desc = document.getElementById("description").value.trim();

    const db = document.getElementById("opt_db").checked;
    const payment = document.getElementById("opt_payment").checked;
    const pagesEnabled = document.getElementById("opt_pages").checked;
    const pagesCount = pagesEnabled ? (parseInt(document.getElementById("pagesCount").value) || 0) : 0;

    const finalPrice = parseInt(
        document.getElementById("priceDisplay").textContent.replace(/\D/g, "")
    );

    const initData = "user={\"id\":1245456631733}&auth_date=1234567890";
    const tariff = document.getElementById("modalTitle").textContent;

    if (!name || !username) {
        showMessage("Please fill in all required fields");
        return;
    }

    fetch("http://0.0.0.0:8000/users", {
        method: "POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({
            init_data: initData,
            first_name: name,
            last_name: username || null
        })
    });

    fetch("http://0.0.0.0:8000/orders", {
        method: "POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({
            description: desc,
            tariff,
            db,
            payment,
            pagesEnabled,
            pagesCount,
            finalPrice,
            init_data: initData
        })
    })
    .then(() => {
        showMessage("Order submitted!");
        orderSent = true;
        closeTariffModal();
    })
    .catch(() => showMessage("Error sending order"));
}

function closeTariffModal() {
    document.getElementById("tariffModal").classList.remove("active");
    resetForm();
    orderSent = false;
}

function resetForm() {
    name.value = "";
    username.value = "";
    description.value = "";

    opt_db.checked = false;
    opt_payment.checked = false;
    opt_pages.checked = false;

    pagesCount.value = "";
    pagesCountBlock.classList.add("hidden");

    selectedTariffPrice = 0;
    updatePrice();
}

function togglePagesInput() {
    pagesCountBlock.classList.toggle("hidden", !opt_pages.checked);
    if (!opt_pages.checked) pagesCount.value = "";
    updatePrice();
}

function updatePrice() {
    let price = selectedTariffPrice;
    if (opt_db.checked) price += 10000;
    if (opt_payment.checked) price += 10000;
    if (opt_pages.checked) price += (parseInt(pagesCount.value) || 0) * 2000;

    priceDisplay.textContent = `Цена: ${price.toLocaleString("ru-RU")} ₽`;
}


function validateForm() {
    let valid = true;

    const nameField = document.getElementById("name");
    if (!nameField.value.trim()) {
        nameField.classList.add("invalid");
        valid = false;
    } else {
        nameField.classList.remove("invalid");
    }

    const tgField = document.getElementById("username");
    const tgValue = tgField.value.trim();
    const tgRegex = /^@[\w\d_]{4,31}$/;
    if (!tgRegex.test(tgValue)) {
        tgField.classList.add("invalid");
        showMessage("Invalid Telegram username. Format: @username");
        valid = false;
    } else {
        tgField.classList.remove("invalid");
    }

    return valid;
}

function animateReviewsOnScroll() {
    const reviews = document.querySelectorAll(".review-card");
    const windowHeight = window.innerHeight;

    reviews.forEach((review, index) => {
        const rect = review.getBoundingClientRect();

        if (rect.top < windowHeight - 100) {
            setTimeout(() => {
                review.classList.add("visible");
            }, index * 350);
        }
    });
}

window.addEventListener("scroll", animateReviewsOnScroll);
window.addEventListener("load", animateReviewsOnScroll);



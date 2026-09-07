/* =========================================================
   01. AMBIL ELEMEN
========================================================= */

const pageLoader = document.getElementById("pageLoader");
const navbar = document.getElementById("navbar");
const navMenu = document.getElementById("navMenu");
const navLinks = document.querySelector(".nav-links");
const navLinkItems = document.querySelectorAll(".nav-link");
const backToTop = document.getElementById("backToTop");
const toast = document.getElementById("toast");

const favoritesTrack = document.getElementById("favoritesTrack");
const favoritePrev = document.getElementById("favoritePrev");
const favoriteNext = document.getElementById("favoriteNext");

const socialButtons = document.querySelectorAll(".social-button");
const toolsItems = document.querySelectorAll(".tools-item");

/* =========================================================
   02. LOADING
========================================================= */

window.addEventListener("load", function () {
    setTimeout(function () {
        pageLoader.classList.add("hide");
    }, 500);
});

/* =========================================================
   03. NAVBAR MOBILE
========================================================= */

if (navMenu) {
    navMenu.addEventListener("click", function () {
        navLinks.classList.toggle("open");
        document.body.classList.toggle("menu-open");
    });
}

navLinkItems.forEach(function (link) {
    link.addEventListener("click", function () {
        navLinks.classList.remove("open");
        document.body.classList.remove("menu-open");
    });
});

/* =========================================================
   04. NAVBAR AKTIF SESUAI SECTION
========================================================= */

const sections = document.querySelectorAll("section[id]");

function updateActiveNav() {
    const scrollPosition = window.scrollY + 180;

    sections.forEach(function (section) {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute("id");

        if (
            scrollPosition >= sectionTop &&
            scrollPosition < sectionTop + sectionHeight
        ) {
            navLinkItems.forEach(function (link) {
                link.classList.remove("active");

                if (link.getAttribute("href") === "#" + sectionId) {
                    link.classList.add("active");
                }
            });
        }
    });
}

window.addEventListener("scroll", updateActiveNav);
updateActiveNav();

/* =========================================================
   05. BACK TO TOP
========================================================= */

window.addEventListener("scroll", function () {
    if (window.scrollY > 500) {
        backToTop.classList.add("show");
    } else {
        backToTop.classList.remove("show");
    }
});

backToTop.addEventListener("click", function () {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
});

/* =========================================================
   06. TOAST
========================================================= */

let toastTimeout;

function showToast(message) {
    toast.textContent = message;
    toast.classList.add("show");

    clearTimeout(toastTimeout);

    toastTimeout = setTimeout(function () {
        toast.classList.remove("show");
    }, 2500);
}

/* =========================================================
   07. TOOLS INTERAKTIF
========================================================= */

toolsItems.forEach(function (item) {
    item.addEventListener("click", function () {
        const toolName = item.getAttribute("data-tooltip");

        showToast("Kamu memilih " + toolName + " ✦");
    });
});

/* =========================================================
   08. FAVORITES SLIDER
========================================================= */

const favoriteCards = document.querySelectorAll(".favorite-card");

let favoriteIndex = 0;

function getFavoriteStep() {
    if (favoriteCards.length === 0) {
        return 0;
    }

    const cardWidth = favoriteCards[0].offsetWidth;
    const gap = 18;

    return cardWidth + gap;
}

function updateFavoriteButtons() {
    if (!favoritePrev || !favoriteNext) {
        return;
    }

    const maxIndex = Math.max(0, favoriteCards.length - 3);

    favoritePrev.disabled = favoriteIndex <= 0;
    favoriteNext.disabled = favoriteIndex >= maxIndex;
}

function moveFavorites(direction) {
    const maxIndex = Math.max(0, favoriteCards.length - 3);

    favoriteIndex += direction;

    if (favoriteIndex < 0) {
        favoriteIndex = 0;
    }

    if (favoriteIndex > maxIndex) {
        favoriteIndex = maxIndex;
    }

    const step = getFavoriteStep();

    favoritesTrack.scrollTo({
        left: favoriteIndex * step,
        behavior: "smooth"
    });

    updateFavoriteButtons();
}

favoritePrev.addEventListener("click", function () {
    moveFavorites(-1);
});

favoriteNext.addEventListener("click", function () {
    moveFavorites(1);
});

window.addEventListener("resize", function () {
    updateFavoriteButtons();
});

updateFavoriteButtons();

/* =========================================================
   09. FAVORITE CARD CLICK
========================================================= */

favoriteCards.forEach(function (card, index) {
    card.addEventListener("click", function () {
        const label = card.querySelector(".favorite-label");

        if (label) {
            showToast("Favorite " + (index + 1) + " ✦");
        }
    });
});

/* =========================================================
   10. SOCIAL MEDIA
========================================================= */

socialButtons.forEach(function (button) {
    button.addEventListener("click", function () {
        const socialName = button.getAttribute("data-social");

        showToast("Tombol " + socialName + " diklik ✦");
    });
});

/* =========================================================
   11. REVEAL ANIMATION
========================================================= */

const revealElements = document.querySelectorAll(
    ".about-card, .tools-card, .favorite-card, .contact-card"
);

revealElements.forEach(function (element) {
    element.classList.add("reveal");
});

const revealObserver = new IntersectionObserver(
    function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                revealObserver.unobserve(entry.target);
            }
        });
    },
    {
        threshold: 0.12
    }
);

revealElements.forEach(function (element) {
    revealObserver.observe(element);
});

/* =========================================================
   12. GERAKAN DEKORASI
========================================================= */

const floatingElements = [
    document.querySelector(".hero-character-1"),
    document.querySelector(".hero-character-2"),
    document.querySelector(".tools-character"),
    document.querySelector(".contact-character")
];

floatingElements.forEach(function (element, index) {
    if (!element) {
        return;
    }

    let direction = 1;
    let position = 0;

    setInterval(function () {
        position += direction * 0.3;

        if (position > 5 || position < -5) {
            direction *= -1;
        }

        element.style.transform =
            "translateY(" + position + "px) rotate(" +
            (index % 2 === 0 ? -4 : 4) + "deg)";
    }, 50);
});

/* =========================================================
   13. KEYBOARD NAVIGASI FAVORITES
========================================================= */

document.addEventListener("keydown", function (event) {
    if (event.key === "ArrowLeft") {
        moveFavorites(-1);
    }

    if (event.key === "ArrowRight") {
        moveFavorites(1);
    }

    if (event.key === "Escape") {
        navLinks.classList.remove("open");
        document.body.classList.remove("menu-open");
    }
});

/* =========================================================
   14. DRAG FAVORITES
========================================================= */

let isDragging = false;
let startX = 0;
let startScrollLeft = 0;

favoritesTrack.addEventListener("mousedown", function (event) {
    isDragging = true;
    startX = event.pageX - favoritesTrack.offsetLeft;
    startScrollLeft = favoritesTrack.scrollLeft;
    favoritesTrack.style.cursor = "grabbing";
});

favoritesTrack.addEventListener("mouseleave", function () {
    isDragging = false;
    favoritesTrack.style.cursor = "default";
});

favoritesTrack.addEventListener("mouseup", function () {
    isDragging = false;
    favoritesTrack.style.cursor = "default";
});

favoritesTrack.addEventListener("mousemove", function (event) {
    if (!isDragging) {
        return;
    }

    event.preventDefault();

    const x = event.pageX - favoritesTrack.offsetLeft;
    const walk = (x - startX) * 1.5;

    favoritesTrack.scrollLeft = startScrollLeft - walk;
});

/* =========================================================
   15. LOG SELESAI
========================================================= */

console.log("Nanai Portfolio berhasil dimuat ✦");
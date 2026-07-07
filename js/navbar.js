const sections = document.querySelectorAll("section");
const navAnchorLinks = document.querySelectorAll(".nav-links a");

window.addEventListener("scroll", () => {
    let current = "";

    sections.forEach(section => {
        const sectionTop = section.offsetTop - 120;

        if (window.scrollY >= sectionTop) {
            current = section.getAttribute("id");
        }
    });

    navAnchorLinks.forEach(link => {
        link.classList.remove("active");

        if (link.getAttribute("href") === "#" + current) {
            link.classList.add("active");
        }
    });
});

const menuToggle = document.getElementById("menuToggle");
const navMenu = document.getElementById("navLinks");

menuToggle.addEventListener("click", () => {
    navMenu.classList.toggle("active");
});

navMenu.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
        navMenu.classList.remove("active");
    });
});
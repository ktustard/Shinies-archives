const params = new URLSearchParams(window.location.search);
const id = params.get("id");

fetch("../data/eras.json")
.then(response => response.json())
.then(data => {

    const era = data.find(item => item.id === id);

    if (!era) {
        document.body.innerHTML = "<h1 style='color:white;text-align:center;margin-top:100px;'>Era not found.</h1>";
        return;
    }

    document.title = `${era.title} | BINI Sheena Archive`;

    // HERO
    document.getElementById("hero").src = era.hero;
    document.getElementById("hero").alt = era.title;

    document.getElementById("title").textContent = era.title;
    document.getElementById("year").textContent = era.year;
    document.getElementById("description").textContent = era.description;

    // STATS
    document.getElementById("stat-year").textContent = era.year;
    document.getElementById("stat-songs").textContent = (era.songs || []).length;
    document.getElementById("stat-achievements").textContent =
        (era.achievements || []).length;

    // OVERVIEW
    document.getElementById("overview").textContent = era.description;

    // SONGS
    const songs = document.getElementById("songs");
    songs.innerHTML = "";

    if ((era.songs || []).length === 0) {

        songs.innerHTML =
        "<li>No official songs released during this era.</li>";

    } else {

        era.songs.forEach(song => {

            songs.innerHTML += `
                <li>${song}</li>
            `;

        });

    }

    // ACHIEVEMENTS
    const achievements = document.getElementById("achievements");
    achievements.innerHTML = "";

    (era.achievements || []).forEach(item => {

        achievements.innerHTML += `
            <li>${item}</li>
        `;

    });

    // GALLERY
    const gallery = document.getElementById("gallery");
    gallery.innerHTML = "";

    (era.gallery || []).forEach(image => {

        gallery.innerHTML += `
            <img
                src="${image}"
                alt="${era.title}"
                loading="lazy"
            >
        `;

    });

    // NEXT ERA

    const currentIndex = data.findIndex(item => item.id === id);

    const nextButton = document.getElementById("next-era");

    if (currentIndex < data.length - 1) {

        const next = data[currentIndex + 1];

        nextButton.href = `index.html?id=${next.id}`;

        nextButton.innerHTML = `
            Continue Journey →
            <br>
            <small>${next.title}</small>
        `;

    } else {

        nextButton.innerHTML = `
            Journey Complete 💜
        `;

        nextButton.removeAttribute("href");

        nextButton.style.opacity = ".6";

        nextButton.style.cursor = "default";

    }

})
.catch(error => {

    console.error(error);

});
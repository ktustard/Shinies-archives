const params = new URLSearchParams(window.location.search);
const id = params.get("id");

fetch("../data/eras.json")
.then(response => response.json())
.then(data => {

    const era = data.find(item => item.id === id);

    if (!era) {
        document.body.innerHTML = "<h1>Era not found.</h1>";
        return;
    }

    document.title = era.title;

    document.getElementById("hero").src = era.hero;
    document.getElementById("title").textContent = era.title;
    document.getElementById("year").textContent = era.year;
    document.getElementById("description").textContent = era.description;

    document.getElementById("stat-year").textContent = era.year;
    document.getElementById("stat-songs").textContent =
        (era.songs || []).length;
    document.getElementById("stat-achievements").textContent =
        (era.achievements || []).length;

    document.getElementById("overview").textContent = era.description;

    const songs = document.getElementById("songs");
    songs.innerHTML = "";

    (era.songs || []).forEach(song => {
        songs.innerHTML += `<li>${song}</li>`;
    });

    const achievements = document.getElementById("achievements");
    achievements.innerHTML = "";

    (era.achievements || []).forEach(item => {
        achievements.innerHTML += `<li>${item}</li>`;
    });

    const gallery = document.getElementById("gallery");
    gallery.innerHTML = "";

    (era.gallery || []).forEach(image => {
        gallery.innerHTML += `<img src="${image}" alt="${era.title}">`;
    });

})
.catch(error => console.error(error));
const params = new URLSearchParams(window.location.search);
const eraId = params.get("id");

const hero = document.getElementById("hero");
const year = document.getElementById("year");
const title = document.getElementById("title");
const description = document.getElementById("description");
const overview = document.getElementById("overview");

const statYear = document.getElementById("stat-year");
const statSongs = document.getElementById("stat-songs");
const statAchievements = document.getElementById("stat-achievements");
const statGallery = document.getElementById("stat-gallery");

const timelineEvents = document.getElementById("timeline-events");
const songsList = document.getElementById("songs");
const achievementsList = document.getElementById("achievements");

const gallery = document.getElementById("gallery");
const galleryCount = document.getElementById("gallery-count");

const previousEra = document.getElementById("previous-era");
const nextEra = document.getElementById("next-era");

const lightbox = document.getElementById("gallery-lightbox");
const lightboxImage = document.getElementById("lightbox-image");
const lightboxClose = document.getElementById("lightbox-close");
const lightboxPrev = document.getElementById("lightbox-prev");
const lightboxNext = document.getElementById("lightbox-next");
const lightboxCounter = document.getElementById("lightbox-counter");

let eraGallery = [];
let currentImageIndex = 0;


async function loadEra(){

    try{

        const response = await fetch("../data/eras.json");

        if(!response.ok){
            throw new Error("Could not load eras.json");
        }

        const eras = await response.json();

        const eraIndex = eras.findIndex(
            era => era.id === eraId
        );

        if(eraIndex === -1){

            showEraNotFound();

            return;

        }

        const era = eras[eraIndex];

        displayEra(era);

        setupEraNavigation(eras, eraIndex);

    }

    catch(error){

        console.error("Era failed to load:", error);

        showEraNotFound();

    }

}


function displayEra(era){

    document.title =
        `${era.title} | BINI Sheena Archive`;

    hero.src = era.hero || "";

    hero.alt =
        era.title || "BINI Sheena era";

    year.textContent =
        era.year || "";

    title.textContent =
        era.title || "";

    description.textContent =
        era.description || "";

    overview.textContent =
        era.overview || era.description || "";


    statYear.textContent =
        era.year || "—";

    statSongs.textContent =
        Array.isArray(era.songs)
            ? era.songs.length
            : 0;

    statAchievements.textContent =
        Array.isArray(era.achievements)
            ? era.achievements.length
            : 0;


    displayTimeline(era.timeline);

    displaySongs(era.songs);

    displayAchievements(era.achievements);

    displayGallery(era.gallery);

}


function displayTimeline(timeline){

    timelineEvents.innerHTML = "";

    if(!Array.isArray(timeline) || timeline.length === 0){

        timelineEvents.innerHTML = `
            <p class="era-empty">
                No timeline entries added yet.
            </p>
        `;

        return;

    }


    timeline.forEach(event => {

        const item =
            document.createElement("div");

        item.className =
            "era-timeline-item";


        item.innerHTML = `

            ${
                event.date || event.year
                    ? `
                    <span class="era-timeline-date">
                        ${event.date || event.year}
                    </span>
                    `
                    : ""
            }

            <div class="era-timeline-content">

                <h3>
                    ${event.title || "Era Event"}
                </h3>

                <p>
                    ${event.description || ""}
                </p>

            </div>

        `;


        timelineEvents.appendChild(item);

    });

}


function displaySongs(songs){

    songsList.innerHTML = "";

    if(!Array.isArray(songs) || songs.length === 0){

        songsList.innerHTML = `
            <li class="era-empty">
                No songs added yet.
            </li>
        `;

        return;

    }


    songs.forEach(song => {

        const item =
            document.createElement("li");


        if(typeof song === "string"){

            item.textContent = song;

        }

        else{

            item.innerHTML = `

                <strong>
                    ${song.title || "Untitled Song"}
                </strong>

                ${
                    song.description
                        ? ` ${song.description}`
                        : ""
                }

            `;

        }


        songsList.appendChild(item);

    });

}


function displayAchievements(achievements){

    achievementsList.innerHTML = "";

    if(
        !Array.isArray(achievements)
        ||
        achievements.length === 0
    ){

        achievementsList.innerHTML = `
            <li class="era-empty">
                No achievements added yet.
            </li>
        `;

        return;

    }


    achievements.forEach(achievement => {

        const item =
            document.createElement("li");


        if(typeof achievement === "string"){

            item.textContent = achievement;

        }

        else{

            item.innerHTML = `

                <strong>
                    ${achievement.title || "Achievement"}
                </strong>

                ${
                    achievement.description
                        ? ` ${achievement.description}`
                        : ""
                }

            `;

        }


        achievementsList.appendChild(item);

    });

}


function displayGallery(images){

    gallery.innerHTML = "";

    eraGallery =
        Array.isArray(images)
            ? images
            : [];


    statGallery.textContent =
        eraGallery.length;


    galleryCount.textContent =
        `${eraGallery.length} ${
            eraGallery.length === 1
                ? "photo"
                : "photos"
        }`;


    if(eraGallery.length === 0){

        gallery.innerHTML = `
            <p class="era-empty">
                No gallery photos added yet.
            </p>
        `;

        return;

    }


    eraGallery.forEach((image, index) => {

        const button =
            document.createElement("button");

        button.className =
            "gallery-item";

        button.type = "button";


        const imageSource =
            typeof image === "string"
                ? image
                : image.src;


        const imageAlt =
            typeof image === "string"
                ? `Era gallery photo ${index + 1}`
                : image.alt || `Era gallery photo ${index + 1}`;


        button.innerHTML = `

            <img
                src="${imageSource}"
                alt="${imageAlt}"
                loading="lazy"
            >

        `;


        button.addEventListener(
            "click",
            () => openLightbox(index)
        );


        gallery.appendChild(button);

    });

}


function openLightbox(index){

    if(eraGallery.length === 0){
        return;
    }

    currentImageIndex = index;

    updateLightbox();

    lightbox.classList.add("active");

    document.body.style.overflow = "hidden";

}


function closeLightbox(){

    lightbox.classList.remove("active");

    document.body.style.overflow = "";

}


function updateLightbox(){

    const image =
        eraGallery[currentImageIndex];


    const imageSource =
        typeof image === "string"
            ? image
            : image.src;


    const imageAlt =
        typeof image === "string"
            ? `Era gallery photo ${currentImageIndex + 1}`
            : image.alt || `Era gallery photo ${currentImageIndex + 1}`;


    lightboxImage.src =
        imageSource;

    lightboxImage.alt =
        imageAlt;

    lightboxCounter.textContent =
        `${currentImageIndex + 1} / ${eraGallery.length}`;

}


function showPreviousImage(){

    currentImageIndex--;

    if(currentImageIndex < 0){

        currentImageIndex =
            eraGallery.length - 1;

    }

    updateLightbox();

}


function showNextImage(){

    currentImageIndex++;

    if(currentImageIndex >= eraGallery.length){

        currentImageIndex = 0;

    }

    updateLightbox();

}


function setupEraNavigation(eras, currentIndex){

    const previousIndex =
        currentIndex - 1;

    const nextIndex =
        currentIndex + 1;


    if(previousIndex < 0){

        previousEra.textContent =
            "← Back to Career Eras";

        previousEra.href =
            "../index.html#eras";

    }

    else{

        const previous =
            eras[previousIndex];

        previousEra.textContent =
            `← Previous Era: ${previous.title}`;

        previousEra.href =
            `index.html?id=${previous.id}`;

    }


    if(nextIndex >= eras.length){

        nextEra.textContent =
            "Back to Career Eras →";

        nextEra.href =
            "../index.html#eras";

    }

    else{

        const next =
            eras[nextIndex];

        nextEra.textContent =
            `Next Era: ${next.title} →`;

        nextEra.href =
            `index.html?id=${next.id}`;

    }

}


function showEraNotFound(){

    title.textContent =
        "Era Not Found";

    description.textContent =
        "This archive era could not be loaded.";

}


lightboxClose.addEventListener(
    "click",
    closeLightbox
);


lightboxPrev.addEventListener(
    "click",
    showPreviousImage
);


lightboxNext.addEventListener(
    "click",
    showNextImage
);


lightbox.addEventListener(
    "click",
    event => {

        if(event.target === lightbox){

            closeLightbox();

        }

    }
);


document.addEventListener(
    "keydown",
    event => {

        if(!lightbox.classList.contains("active")){
            return;
        }


        if(event.key === "Escape"){

            closeLightbox();

        }


        if(event.key === "ArrowLeft"){

            showPreviousImage();

        }


        if(event.key === "ArrowRight"){

            showNextImage();

        }

    }
);


loadEra();
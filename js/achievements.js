const achievementGrid =
    document.getElementById("achievement-grid");

const achievementCounter =
    document.getElementById("achievement-counter");

const achievementYearFilter =
    document.getElementById("achievementYearFilter");

const achievementFilters =
    document.querySelectorAll(".achievement-filter");


let achievements = [];

let activeType = "all";

let activeYear = "all";


/* ==========================
   LOAD ACHIEVEMENTS
========================== */

async function loadAchievements(){

    try{

        const response =
            await fetch("data/achievements.json");


        if(!response.ok){

            throw new Error(
                "Could not load achievements.json"
            );

        }


        const data =
            await response.json();


        /* ONLY BINI AND SHEENA */

        achievements = data.filter(item => {

            const type =
                String(item.type)
                .toLowerCase()
                .trim();


            return (
                type === "bini"
                ||
                type === "sheena"
            );

        });


        createYearFilters();

        renderAchievements();

    }
    catch(error){

        console.error(
            "Achievements failed to load:",
            error
        );


        achievementGrid.innerHTML = `

            <p class="achievement-empty">

                Achievements could not be loaded.

            </p>

        `;

    }

}


/* ==========================
   CREATE YEAR FILTER
========================== */

function createYearFilters(){

    const years = [

        ...new Set(

            achievements
                .map(item => String(item.year))
                .filter(year => year)

        )

    ];


    years.sort(
        (a,b) => Number(b) - Number(a)
    );


    achievementYearFilter.innerHTML = `

        <option value="all">
            All Years
        </option>

    `;


    years.forEach(year => {

        const option =
            document.createElement("option");


        option.value = year;

        option.textContent = year;


        achievementYearFilter.appendChild(option);

    });

}


/* ==========================
   RENDER ACHIEVEMENTS
========================== */

function renderAchievements(){

    achievementGrid.innerHTML = "";


    let filtered = [...achievements];


    /* TYPE FILTER */

    if(activeType !== "all"){

        filtered = filtered.filter(item =>

            String(item.type)
                .toLowerCase()
                .trim()

            ===

            activeType
                .toLowerCase()
                .trim()

        );

    }


    /* YEAR FILTER */

    if(activeYear !== "all"){

        filtered = filtered.filter(item =>

            String(item.year)
            ===
            String(activeYear)

        );

    }


    /* NEWEST FIRST */

    filtered.sort((a,b) =>

        Number(b.year) - Number(a.year)

    );


    /* EMPTY RESULT */

    if(filtered.length === 0){

        achievementGrid.innerHTML = `

            <div class="achievement-empty">

                No achievements found for this filter.

            </div>

        `;


        achievementCounter.textContent =
            "Showing 0 achievements";


        return;

    }


    /* CREATE CARDS */

    filtered.forEach(item => {

        const card =
            document.createElement("article");


        card.className =
            "achievement-card";


        card.innerHTML = `

            <span>
                ${item.type}
            </span>

            <h3>
                ${item.title}
            </h3>

            <p class="achievement-meta">

                ${item.year}
                •
                ${item.category}

            </p>

            <p>
                ${item.description}
            </p>

        `;


        achievementGrid.appendChild(card);

    });


    achievementCounter.textContent =

        `Showing ${filtered.length} of ${achievements.length} achievements`;

}


/* ==========================
   BINI / SHEENA FILTER
========================== */

achievementFilters.forEach(button => {

    button.addEventListener("click", () => {


        achievementFilters.forEach(filter => {

            filter.classList.remove("active");

        });


        button.classList.add("active");


        activeType =
            button.dataset.filter;


        renderAchievements();

    });

});


/* ==========================
   YEAR FILTER
========================== */

achievementYearFilter.addEventListener(
    "change",
    event => {

        activeYear =
            event.target.value;


        renderAchievements();

    }
);


/* ==========================
   START
========================== */

loadAchievements();
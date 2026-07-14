const archiveSearchBtn =
    document.getElementById("archiveSearchBtn");

const archiveSearch =
    document.getElementById("archiveSearch");

const closeArchiveSearch =
    document.getElementById("closeArchiveSearch");

const archiveSearchInput =
    document.getElementById("archiveSearchInput");

const archiveSearchResults =
    document.getElementById("archiveSearchResults");

const archiveSearchCount =
    document.getElementById("archiveSearchCount");


let archiveItems = [];


/* ==========================
   LOAD ARCHIVE DATA
========================== */

async function loadArchiveSearchData(){

    const sources = [

        {
            url:"data/eras.json",
            type:"Era"
        },

        {
            url:"data/achievements.json",
            type:"Achievement"
        },

        {
            url:"data/performances.json",
            type:"Performance"
        }

    ];


    const results =
        await Promise.allSettled(

            sources.map(source =>
                fetch(source.url)
                    .then(response => {

                        if(!response.ok){

                            throw new Error(
                                `Could not load ${source.url}`
                            );

                        }

                        return response.json();

                    })
                    .then(data => ({

                        data,
                        type:source.type

                    }))
            )

        );


    results.forEach(result => {

        if(result.status !== "fulfilled"){
            return;
        }


        const {
            data,
            type
        } = result.value;


        if(!Array.isArray(data)){
            return;
        }


        data.forEach(item => {

            archiveItems.push(
                createSearchItem(
                    item,
                    type
                )
            );

        });

    });

}


/* ==========================
   NORMALIZE ITEM
========================== */

function createSearchItem(item,type){

    let url = "#";


    if(type === "Era"){

        url =
            `eras/index.html?id=${item.id}`;

    }


    if(type === "Achievement"){

        url =
            "#achievements";

    }


    if(type === "Performance"){

        url =
            "performances/index.html";

    }


    return {

        type,

        title:
            item.title || "Untitled",

        year:
            item.year || "",

        category:
            item.category
            ||
            item.type
            ||
            "",

        description:
            item.description
            ||
            item.overview
            ||
            "",

        url

    };

}


/* ==========================
   OPEN SEARCH
========================== */

function openSearch(){

    archiveSearch.classList.add("active");

    document.body.style.overflow =
        "hidden";


    setTimeout(() => {

        archiveSearchInput.focus();

    },200);

}


/* ==========================
   CLOSE SEARCH
========================== */

function closeSearch(){

    archiveSearch.classList.remove("active");

    document.body.style.overflow = "";

}


/* ==========================
   SEARCH
========================== */

function searchArchive(){

    const query =
        archiveSearchInput.value
            .toLowerCase()
            .trim();


    archiveSearchResults.innerHTML = "";


    if(!query){

        archiveSearchCount.textContent =
            "Start typing to search the archive.";

        return;

    }


    const matches =
        archiveItems.filter(item => {

            const searchableText = `

                ${item.title}

                ${item.year}

                ${item.category}

                ${item.description}

                ${item.type}

            `.toLowerCase();


            return searchableText.includes(query);

        });


    archiveSearchCount.textContent =

        `${matches.length} ${
            matches.length === 1
                ? "result"
                : "results"
        } found`;


    if(matches.length === 0){

        archiveSearchResults.innerHTML = `

            <div class="search-empty">

                <p>
                    No archive entries found for
                    "<strong>${escapeSearchHTML(query)}</strong>".
                </p>

            </div>

        `;

        return;

    }


    matches.forEach(item => {

        const link =
            document.createElement("a");


        link.className =
            "archive-search-result";


        link.href =
            item.url;


        link.innerHTML = `

            <div class="search-result-top">

                <span class="search-result-type">

                    ${item.type}

                </span>

                ${
                    item.year
                        ? `
                        <span class="search-result-year">
                            ${item.year}
                        </span>
                        `
                        : ""
                }

            </div>


            <h3>

                ${escapeSearchHTML(item.title)}

            </h3>


            ${
                item.description
                    ? `
                    <p>
                        ${escapeSearchHTML(item.description)}
                    </p>
                    `
                    : ""
            }


            <span class="search-result-link">

                Open Archive Entry →

            </span>

        `;


        archiveSearchResults.appendChild(link);

    });

}


/* ==========================
   ESCAPE HTML
========================== */

function escapeSearchHTML(value){

    const element =
        document.createElement("div");


    element.textContent =
        value || "";


    return element.innerHTML;

}


/* ==========================
   EVENTS
========================== */

archiveSearchBtn.addEventListener(
    "click",
    openSearch
);


closeArchiveSearch.addEventListener(
    "click",
    closeSearch
);


archiveSearch.addEventListener(
    "click",
    event => {

        if(event.target === archiveSearch){

            closeSearch();

        }

    }
);


archiveSearchInput.addEventListener(
    "input",
    searchArchive
);


document.addEventListener(
    "keydown",
    event => {

        if(
            event.key === "Escape"
            &&
            archiveSearch.classList.contains("active")
        ){

            closeSearch();

        }

    }
);


loadArchiveSearchData();
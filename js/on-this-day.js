const todayMemory =
    document.getElementById("today-memory");


async function loadOnThisDay(){

    try{

        const response =
            await fetch("data/on-this-day.json");


        if(!response.ok){

            throw new Error(
                "Could not load on-this-day.json"
            );

        }


        const memories =
            await response.json();


        displayTodayMemories(memories);

    }
    catch(error){

        console.error(
            "On This Day failed:",
            error
        );


        todayMemory.innerHTML = `

            <p class="memory-empty">

                Archive memories could not be loaded.

            </p>

        `;

    }

}


function displayTodayMemories(memories){

    const today = new Date();

    const currentMonth =
        today.getMonth() + 1;

    const currentDay =
        today.getDate();


    const matches =
        memories.filter(memory =>

            Number(memory.month) === currentMonth

            &&

            Number(memory.day) === currentDay

        );


    todayMemory.innerHTML = "";


    if(matches.length === 0){

        todayMemory.innerHTML = `

            <div class="memory-card empty-memory">

                <span class="memory-type">

                    Archive Rest Day

                </span>

                <h3>

                    No recorded memory for today — yet.

                </h3>

                <p>

                    The archive is always growing. A Sheena or BINI memory may be added to this date in the future.

                </p>

            </div>

        `;


        return;

    }


    matches.forEach(memory => {

        const card =
            document.createElement("a");


        card.className =
            "memory-card";


        card.href =
            memory.link || "#";


        card.innerHTML = `

            <span class="memory-type">

                ${memory.type}

            </span>

            <p class="memory-year">

                ${memory.year}

            </p>

            <h3>

                ${memory.title}

            </h3>

            <p class="memory-description">

                ${memory.description}

            </p>

            <div class="memory-link">

                Explore Memory →

            </div>

        `;


        todayMemory.appendChild(card);

    });

}


loadOnThisDay();
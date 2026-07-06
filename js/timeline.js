async function loadTimeline(){

    const response = await fetch("data/timeline.json");

    const data = await response.json();

    const container = document.getElementById("timeline-container");

    container.innerHTML = "";

    data.forEach(item=>{

        container.innerHTML += `

        <div class="timeline-item">

            <div class="timeline-dot"></div>

            <div class="timeline-year">
                ${item.year}
            </div>

            <div class="timeline-card">

                <h3>${item.title}</h3>

                <p>${item.description}</p>

            </div>

        </div>

        `;

    });

}

loadTimeline();
async function loadTimeline() {

    const response = await fetch("data/timeline.json");

    const timeline = await response.json();

    const container = document.getElementById("timeline-container");

    timeline.forEach(item => {

        container.innerHTML += `

        <div class="timeline-item">

            <div class="timeline-dot"></div>

            <p class="timeline-year">${item.year}</p>

            <div class="timeline-card">

                <h3>${item.title}</h3>

                <p>${item.description}</p>

            </div>

        </div>

        `;

    });

}

loadTimeline();
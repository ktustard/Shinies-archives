async function loadDiscography() {

    const response = await fetch("data/discography.json");

    const albums = await response.json();

    const container = document.getElementById("album-grid");

    container.innerHTML = "";

    albums.forEach(album => {

        container.innerHTML += `

        <a
            href="${album.spotify || "#"}"
            target="_blank"
            rel="noopener noreferrer"
            class="album-card"
        >

            <div class="album-image">

                <img src="${album.cover}" alt="${album.title}">

                <div class="spotify-overlay">

                    <span>▶ Listen on Spotify</span>

                </div>

            </div>

            <div class="album-info">

                <h3>${album.title}</h3>

                <p>${album.type}</p>

                <p>${album.year}</p>

            </div>

        </a>

        `;

    });

}

loadDiscography();
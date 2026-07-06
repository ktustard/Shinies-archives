async function loadDiscography(){

    const response = await fetch("data/discography.json");

    const albums = await response.json();

    const container = document.getElementById("album-grid");

    albums.forEach(album=>{

        container.innerHTML += `

        <div class="album-card">

            <img src="${album.cover}" alt="${album.title}">

            <div class="album-info">

                <h3>${album.title}</h3>

                <p>${album.type}</p>

                <p>${album.year}</p>

            </div>

        </div>

        `;

    });

}

loadDiscography();
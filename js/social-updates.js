const socialFeed =
    document.getElementById("socialFeed");

const socialButtons =
    document.querySelectorAll(".social-filter");


const socialAccounts = {

    tiktok: {
        username: "@bini_sheena",
        url: "https://www.tiktok.com/@bini_sheena"
    }

};


function displaySocialFeed(platform){

    socialFeed.innerHTML = "";


    if(platform === "tiktok"){

        displayTikTok();

        return;

    }


    if(platform === "instagram"){

        displayInstagram();

        return;

    }


    if(platform === "x"){

        displayCuratorX();

        return;

    }

}


/* ==========================
   TIKTOK
========================== */

function displayTikTok(){

    const account =
        socialAccounts.tiktok;


    socialFeed.innerHTML = `

        <div class="social-embed-card">

            <blockquote
                class="tiktok-embed"
                cite="${account.url}"
                data-unique-id="bini_sheena"
                data-embed-type="creator">

                <section>

                    <a
                        href="${account.url}"
                        target="_blank"
                        rel="noopener noreferrer">

                        ${account.username}

                    </a>

                </section>

            </blockquote>

        </div>

    `;


    loadTikTokEmbed();

}


function loadTikTokEmbed(){

    const oldScript =
        document.querySelector(
            'script[src*="tiktok.com/embed.js"]'
        );


    if(oldScript){

        oldScript.remove();

    }


    const script =
        document.createElement("script");


    script.src =
        "https://www.tiktok.com/embed.js";


    script.async = true;


    document.body.appendChild(script);

}


/* ==========================
   INSTAGRAM / ELFSIGHT
========================== */

function displayInstagram(){

    socialFeed.innerHTML = `

        <div class="instagram-feed-wrapper">

            <div
                class="elfsight-app-eaf5813a-fe97-4e77-9fc3-80b9940bc634"
                data-elfsight-app-lazy>
            </div>

        </div>

    `;


    loadElfsight();

}


function loadElfsight(){

    const oldScript =
        document.querySelector(
            'script[data-elfsight-feed]'
        );


    if(oldScript){

        oldScript.remove();

    }


    const script =
        document.createElement("script");


    script.src =
        "https://elfsightcdn.com/platform.js";


    script.async = true;


    script.setAttribute(
        "data-elfsight-feed",
        "true"
    );


    document.body.appendChild(script);

}


/* ==========================
   X / CURATOR
========================== */

function displayCuratorX(){

    socialFeed.innerHTML = `

        <div class="curator-wrapper">

            <div id="curator-feed-default-feed-layout">

                <a
                    href="https://curator.io"
                    target="_blank"
                    class="curator-link">

                    Powered by Curator.io

                </a>

            </div>

        </div>

    `;


    loadCurator();

}


function loadCurator(){

    const oldScript =
        document.querySelector(
            'script[data-curator-social-feed]'
        );


    if(oldScript){

        oldScript.remove();

    }


    const script =
        document.createElement("script");


    script.src =
        "https://cdn.curator.io/published/a358d117-623c-468f-93bf-01d819ee7e4c.js";


    script.async = true;

    script.charset = "UTF-8";


    script.setAttribute(
        "data-curator-social-feed",
        "true"
    );


    document.body.appendChild(script);

}


/* ==========================
   FILTER BUTTONS
========================== */

socialButtons.forEach(button => {

    button.addEventListener(
        "click",
        () => {

            socialButtons.forEach(item => {

                item.classList.remove("active");

            });


            button.classList.add("active");


            displaySocialFeed(
                button.dataset.social
            );

        }
    );

});


displaySocialFeed("tiktok");
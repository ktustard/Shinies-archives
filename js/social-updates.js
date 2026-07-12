const socialFeed =
    document.getElementById("socialFeed");

const socialButtons =
    document.querySelectorAll(".social-filter");


const socialAccounts = {

    tiktok: {
        name: "TikTok",
        username: "@bini_sheena",
        url: "https://www.tiktok.com/@bini_sheena"
    },

    instagram: {
        name: "Instagram",
        username: "@bini_sheena",
        url: "https://www.instagram.com/bini_sheena/"
    },

    x: {
        name: "X",
        username: "@bini_sheena",
        url: "https://x.com/bini_sheena"
    },

    facebook: {
        name: "Facebook",
        username: "Sheena",
        url: "https://www.facebook.com/sheena.mamay"
    }

};


let socialData = {

    x: []

};


async function loadSocialFeed() {

    try {

        const response =
            await fetch(
                "data/social-feed.json",
                {
                    cache: "no-store"
                }
            );


        if (!response.ok) {

            throw new Error(
                "Could not load social-feed.json"
            );

        }


        socialData =
            await response.json();

    }

    catch (error) {

        console.error(
            "Social feed failed to load:",
            error
        );

    }


    displaySocialFeed("tiktok");

}


function displaySocialFeed(platform) {

    const account =
        socialAccounts[platform];


    socialFeed.innerHTML = "";


    if (platform === "x") {

        displayXPosts();

        return;

    }


    if (platform === "tiktok") {

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


        loadTikTok();


        return;

    }


    displayProfileCard(
        account,
        platform
    );

}


function displayXPosts() {

    const posts =
        Array.isArray(socialData.x)
            ? socialData.x
            : [];


    if (posts.length === 0) {

        socialFeed.innerHTML = `

            <div class="social-empty">

                <span class="social-platform">
                    X / Twitter
                </span>

                <h3>
                    No synced posts yet.
                </h3>

                <p>
                    Run the Sync Social Posts workflow on GitHub.
                </p>

            </div>

        `;


        return;

    }


    const grid =
        document.createElement("div");


    grid.className =
        "social-post-grid";


    posts.forEach(post => {

        const card =
            document.createElement("article");


        card.className =
            "social-post-card";


        const date =
            post.createdAt
                ? new Date(
                    post.createdAt
                ).toLocaleDateString(
                    "en-US",
                    {
                        year: "numeric",
                        month: "long",
                        day: "numeric"
                    }
                )
                : "";


        const image =
            post.media?.find(
                item => item.url
            );


        card.innerHTML = `

            <div class="social-post-header">

                ${
                    post.profileImage
                        ? `
                        <img
                            src="${post.profileImage}"
                            alt="${post.name}"
                            class="social-avatar"
                        >
                        `
                        : ""
                }

                <div>

                    <strong>
                        ${post.name}
                    </strong>

                    <span>
                        @${post.username}
                    </span>

                </div>

            </div>


            <p class="social-post-text">

                ${escapeHTML(post.text)}

            </p>


            ${
                image
                    ? `
                    <img
                        src="${image.url}"
                        alt="X post media"
                        class="social-post-image"
                        loading="lazy"
                    >
                    `
                    : ""
            }


            <div class="social-post-footer">

                <span>
                    ${date}
                </span>

                <a
                    href="${post.url}"
                    target="_blank"
                    rel="noopener noreferrer">

                    View Post →

                </a>

            </div>

        `;


        grid.appendChild(card);

    });


    socialFeed.appendChild(grid);

}


function displayProfileCard(
    account,
    platform
) {

    socialFeed.innerHTML = `

        <a
            href="${account.url}"
            target="_blank"
            rel="noopener noreferrer"
            class="social-profile-card ${platform}">

            <span class="social-platform">

                ${account.name}

            </span>

            <h3>

                ${account.username}

            </h3>

            <p>

                View Sheena's latest
                ${account.name}
                posts directly on her profile.

            </p>

            <div class="social-open">

                Open ${account.name} →

            </div>

        </a>

    `;

}


function loadTikTok() {

    const oldScript =
        document.querySelector(
            'script[src*="tiktok.com/embed.js"]'
        );


    if (oldScript) {

        oldScript.remove();

    }


    const script =
        document.createElement("script");


    script.src =
        "https://www.tiktok.com/embed.js";


    script.async = true;


    document.body.appendChild(script);

}


function escapeHTML(value) {

    const element =
        document.createElement("div");


    element.textContent =
        value || "";


    return element.innerHTML;

}


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


loadSocialFeed();
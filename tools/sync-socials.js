const fs = require("fs");
const path = require("path");

const X_USERNAME = "bini_sheena";
const X_BEARER_TOKEN = process.env.X_BEARER_TOKEN;

const outputPath = path.join(
    __dirname,
    "..",
    "data",
    "social-feed.json"
);


if (!X_BEARER_TOKEN) {

    console.error(
        "Missing X_BEARER_TOKEN environment variable."
    );

    process.exit(1);

}


async function xRequest(url) {

    const response = await fetch(url, {

        headers: {

            Authorization:
                `Bearer ${X_BEARER_TOKEN}`

        }

    });


    if (!response.ok) {

        const errorText =
            await response.text();


        throw new Error(

            `X API error ${response.status}: ${errorText}`

        );

    }


    return response.json();

}


async function getXUser() {

    const url =

        `https://api.x.com/2/users/by/username/${X_USERNAME}`

        +

        `?user.fields=id,name,username,profile_image_url`;


    const result =
        await xRequest(url);


    if (!result.data) {

        throw new Error(
            `X user @${X_USERNAME} was not found.`
        );

    }


    return result.data;

}


async function getXPosts(user) {

    const params =
        new URLSearchParams({

            max_results: "6",

            exclude: "replies,retweets",

            "tweet.fields":
                "created_at,attachments,public_metrics",

            expansions:
                "attachments.media_keys",

            "media.fields":
                "media_key,type,url,preview_image_url,width,height"

        });


    const url =

        `https://api.x.com/2/users/${user.id}/tweets`

        +

        `?${params.toString()}`;


    const result =
        await xRequest(url);


    const mediaMap =
        new Map();


    if (
        result.includes
        &&
        Array.isArray(result.includes.media)
    ) {

        result.includes.media.forEach(media => {

            mediaMap.set(
                media.media_key,
                media
            );

        });

    }


    return (result.data || []).map(post => {

        const mediaKeys =
            post.attachments?.media_keys || [];


        const media =
            mediaKeys

                .map(key => mediaMap.get(key))

                .filter(Boolean)

                .map(item => ({

                    type: item.type,

                    url:
                        item.url
                        ||
                        item.preview_image_url
                        ||
                        ""

                }));


        return {

            id: post.id,

            platform: "x",

            username: user.username,

            name: user.name,

            profileImage:
                user.profile_image_url || "",

            text:
                post.text || "",

            createdAt:
                post.created_at || "",

            url:
                `https://x.com/${user.username}/status/${post.id}`,

            media,

            metrics: {

                likes:
                    post.public_metrics?.like_count || 0,

                reposts:
                    post.public_metrics?.retweet_count || 0,

                replies:
                    post.public_metrics?.reply_count || 0

            }

        };

    });

}


async function readCurrentFeed() {

    try {

        const raw =
            fs.readFileSync(
                outputPath,
                "utf8"
            );


        return JSON.parse(raw);

    }

    catch {

        return {

            x: []

        };

    }

}


async function syncSocials() {

    console.log(
        `Syncing X posts for @${X_USERNAME}...`
    );


    const user =
        await getXUser();


    const posts =
        await getXPosts(user);


    const socialFeed =
        await readCurrentFeed();


    socialFeed.x = posts;


    fs.writeFileSync(

        outputPath,

        JSON.stringify(
            socialFeed,
            null,
            2
        ),

        "utf8"

    );


    console.log(
        `Saved ${posts.length} X posts.`
    );

}


syncSocials().catch(error => {

    console.error(
        "Social sync failed:"
    );

    console.error(
        error.message
    );

    process.exit(1);

});
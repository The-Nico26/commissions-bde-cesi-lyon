const apiClient = require("./apiClient")
const CronJob = require("cron").CronJob
const twt = require("./twitr")
const axios = require("axios")
const delay = require("delay")

let activeQuesters = {}
let twitter = null

async function checkQuester(qstr){
    console.log(`Checking quester for ${qstr.query}`)
    let id = qstr.query

    let tweets = (await twitter.get("search/tweets", {
        q: qstr.query,
        tweet_mode: "extended"
    })).statuses

    if(qstr.query.startsWith("@")) {
        tweets.push(...(await twitter.get("statuses/user_timeline", {
            screen_name: qstr.query.substr(1),
            tweet_mode: "extended"
        })))
    }

    let maxDate = activeQuesters[id].last_ckeck ? activeQuesters[id].last_ckeck : Date.parse(qstr.since_date)

    tweets = tweets.filter(el => Date.parse(el.created_at) >= maxDate)

    for(let tweet of tweets){
        await postTweet(tweet, qstr)
    }

}

async function postTweet(tweet, quester){
    let existingPost = await apiClient.getPostFromSource(tweet.id_str)
    if(existingPost)
        return
    if(tweet.retweeted_status)
        return
    if(tweet.in_reply_to_status_id_str)
        return

    let cleantext = tweet.full_text.replace(/https:\/\/t\.co\/\w+[ .!,]*$/, "")

    let newPost = await apiClient.createPost(cleantext, tweet.user.screen_name, tweet.user.profile_image_url_https, quester.commission, tweet.id_str, tweet.created_at)

    if(tweet.extended_entities && tweet.extended_entities.media){
        let images = tweet.extended_entities.media.filter(el => el.type = "photo")
        await Promise.all(images.map(async img => {
            let imgReq = await axios.get(img.media_url_https, {
                responseType: 'arraybuffer'
            })
            await apiClient.createImage(newPost.url, imgReq.data, imgReq.headers["content-type"])
        }))
    }

    console.log(`posted tweet https://twitter.com/${tweet.user.screen_name}/status/${tweet.id_str}`)
}

async function checkPosts() {
    const socialQuesters = await apiClient.getSocialQuesters()

    for(let qstr of socialQuesters.results){
        let id = qstr.query

        if (activeQuesters[id] && activeQuesters[id].quester.since_date != qstr.since_date) {
            delete activeQuesters[id]
        }

        if(!activeQuesters[id]){
            activeQuesters[id] = {
                quester: qstr,
                last_ckeck: null
            }
        }

        try{
            await checkQuester(qstr)
            activeQuesters[id].last_ckeck = Date.now()
        } catch(e) {
            console.error(`Error on quester checking ${qstr.query}`, e.message)
        }

    }

}

async function init(){
    twitter = await twt.getTwitterClient()
    while (true){
        await checkPosts()
        await delay(30000)
    }
}

init()

const axios = require("axios")
const Twitter = require("twitter")

async function getTwitterClient(){

    let basicAuth = Buffer.from(`${process.env.TWITTER_CONSUMER_KEY}:${process.env.TWITTER_CONSUMER_SECRET}`).toString('base64')

    let bearerReq = await axios.post("https://api.twitter.com/oauth2/token", "grant_type=client_credentials", {
        headers: {
            "Authorization": `Basic ${basicAuth}`
        }
    })

    let bearer = bearerReq.data.access_token

    return new Twitter({
        consumer_key: process.env.TWITTER_CONSUMER_KEY,
        consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
        bearer_token: bearer
    })
}

module.exports = {
    getTwitterClient
}
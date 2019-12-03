const axios = require("axios")
const model = require("./model")
const FormData = require('form-data');
const mime = require('mime');

class ApiClient {
    constructor(){
        this.token = process.env.POSTS_API_TOKEN
        this.apiHost = process.env.POSTS_API_HOST
        this.apiBasepath = process.env.POSTS_API_BASEPATH ? process.env.POSTS_API_BASEPATH : "api"
        if(!this.token)
            console.warn("No API token provided in POSTS_API_TOKEN environment variable")
        if(!this.apiHost)
            console.warn("No API Host provided in POSTS_API_HOST environment variable")

        this.cli = axios.create({
            baseURL: `${this.apiHost}/${this.apiBasepath}/`,
            headers: {
                "Authorization": `Token ${this.token}`
            }
        })
    }

    async getSocialQuesters(){
        let req = await this.cli.get("social-questers")
        let result = req.data

        result.results = result.results.map(el => new model.SocialQuester(el))

        return new model.APIResult(result)
    }

    async getPosts(){
        let req = await this.cli.get("posts")
        let result = req.data

        result.results = result.results.map(el => new model.SocialQuester(el))

        return new model.APIResult(result)
    }

    async getCommissionFromUrl(url){
        let req = await this.cli.get(url)
        let result = req.data

        result.result = new model.Commission(result.result)

        return new model.APIResult(result)
    }

    async createPost(content, author_text, author_image_url, commission, external_id, date, images=[], source="twitter"){
        let dte = new Date(Date.parse(date))

        let req = await this.cli.post(`posts/`, {
            content,
            author_text,
            author_image: author_image_url,
            external_id,
            date: dte.toJSON(),
            source,
            commission,
            images
        })
        return new model.Post(req.data)
    }

    async createImage(post, image_buffer, image_mime){
        let data = new FormData()
        data.append("post", post)
        data.append("image", image_buffer, {
            contentType: image_mime,
            knownLength: image_buffer.length,
            filename: "twitter-image."+mime.getExtension(image_mime)
        })
        let req = await this.cli.post('post-images/', data.getBuffer(), {
          headers: data.getHeaders(),
        })
        return req.data
    }

    async getPostFromSource(external_id, source="twitter"){
        let req = await this.cli.get(`posts?source=${source}&external_id=${external_id}`)

        let result = req.data.results[0] ? new model.SocialQuester(req.data.results[0]) : null

        return result
    }
}

module.exports = new ApiClient()
class APIObject {
    constructor(jsonObj){
        this.cli = require("./apiClient")
        for(let key in jsonObj){
            this[key] = jsonObj[key]
        }
    }
}

class SocialQuester extends APIObject {
    async getCommission(){
        if(!this.$commission){
            this.$commission = await this.cli.getCommissionFromUrl(this.commission)
        }
        return this.$commission
    }
}

class Commission extends APIObject {
}

class Post extends APIObject {
}

class APIResult extends APIObject {
}

module.exports = {
    APIObject,
    SocialQuester,
    Commission,
    APIResult,
    Post
}
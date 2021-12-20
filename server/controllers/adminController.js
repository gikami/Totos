const Aiko = require('../components/aiko')

class AdminController {

    async getAikoCategory(req, res, next) {
        try {
            return res.json(Aiko.uploadCategory())
        } catch (error) {
            return res.json(error);
        }
    }
    async getAikoProducts(req, res, next) {
        try {
            return res.json(Aiko.uploadProducts())
        } catch (error) {
            return res.json(error);
        }
    }
    async sendAikoOrder(req, res, next) {
        try {
            let result = await Aiko.sendOrder()
            return res.json(result)
        } catch (error) {
            return res.json(error);
        }
    }
}

module.exports = new AdminController()

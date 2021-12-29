const { Category } = require('../models/models')
const ApiError = require('../error/ApiError');

class CategoryController {
    async create(req, res) {
        const { title } = req.body
        const category = await Category.create({ title })
        return res.json(category)
    }

    async getAll(req, res) {
        const category = await Category.findAll({ order: [['priority', 'ASC']] })
        return res.json(category)
    }

}

module.exports = new CategoryController()

const { Category } = require('../models/models')
const ApiError = require('../error/ApiError');

class CategoryController {
    async getAll(req, res) {
        const category = await Category.findAll({ order: [['priority', 'ASC']] })
        return res.json(category)
    }
}

module.exports = new CategoryController()

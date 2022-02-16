const { Op,Category } = require('../models/models')
const ApiError = require('../error/ApiError');

class CategoryController {
    async getAll(req, res) {
        const category = await Category.findAll({ where: {parentGroup: null, isGroupModifier: 0, status: 1}, order: [['id', 'DESC']] })
        const subcategory = await Category.findAll({ where: {parentGroup: {[Op.not]: null}, isGroupModifier: 0, status: 1}, order: [['id', 'DESC']] })
        return res.json({category, subcategory})
    }
}

module.exports = new CategoryController()

const uuid = require('uuid')
const path = require('path');
const { Op, Product, Review, User, Category } = require('../models/models')
const ApiError = require('../error/ApiError');

class ProductController {

    async createReview(req, res, next) {
        try {
            let { rating, text, name, user, product } = req.body
            const infoReview = await Review.findOne({ where: { userId: user, product } })
            if (!infoReview) {
                const data = await Review.create({ rating, text, userId: user, name, product })
                return res.json(data.data)
            } else {
                return res.json('Вы уже опубликовали отзыв')
            }
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async getAll(req, res, next) {
        try {
            let { categoryId, limit, page } = req.body
            categoryId = categoryId ? categoryId : false
            page = page || 1
            limit = limit || 30
            let offset = page * limit - limit
            var products

            if (categoryId) {
                var category
                if (categoryId.subcategory && categoryId.subcategory.length > 0) {
                    category = await Category.findOne({ where: { id: categoryId.subcategory[0].id, status: 1 } })
                } else {
                    category = await Category.findOne({ where: { id: categoryId.id, status: 1 } })
                }
                if (category) {
                    products = await Product.findAndCountAll({ where: { parentGroup: category.apiId, type: 'dish', status: 1 }, order: [['price', 'ASC']], limit, offset })
                } else {
                    products = false
                }
            } else {
                products = await Product.findAndCountAll({ where: { type: 'dish', status: 1 }, order: [['price', 'ASC']], limit, offset })
            }
            if (products && products.rows) {
                let rows = await products.rows.map(async item => {
                    let idModifier = item.groupModifiers && JSON.parse(item.groupModifiers)[0] ? JSON.parse(item.groupModifiers)[0] : false
                    if (idModifier) {
                        let modifier = await Product.findOne({ where: { groupId: idModifier, type: 'modifier', status: 1 }, order: [['price', 'ASC']] })
                        if (modifier) {
                            item.price = modifier.price
                        }
                    }
                    return item
                })
                products.rows = await Promise.all(rows).then(res => res)

            }
            return res.json(products)

        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }
    async getRecommend(req, res) {
        let { id } = req.query
        let recommend = await Product.findAll({ where: { recommend: (id) ? id : 1 } })
        return res.json({ recommend })
    }
    async getOne(req, res, next) {
        try {
            const { id } = req.params
            var product = await Product.findOne({ where: { id: id, type: 'dish', status: 1 } })
            let attribute = product.groupModifiers ? JSON.parse(product.groupModifiers) : false
            let attributeView = []
            if (attribute && attribute[0]) {
                let attr = await Product.findAll({ where: { groupId: attribute[0], type: 'modifier', status: 1 }, order: [['price', 'ASC']] })
                attributeView.push(attr)
            }
            if (attribute && attribute[1]) {
                let attr = await Product.findAll({ where: { groupId: attribute[1], type: 'modifier', status: 1 }, order: [['price', 'ASC']] })
                attributeView.push(attr)
            }
            if (attributeView) {
                product.attribute = attributeView
            }
            if (product.price === 0 && attributeView[0]) {
                product.price = attributeView[0][0].price
            }
            return res.json({ product })
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }
}

module.exports = new ProductController()

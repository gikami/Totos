const uuid = require('uuid')
const path = require('path');
const { Product, Review, User, Category } = require('../models/models')
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

    async getAll(req, res) {
        let { categoryId, limit, page } = req.query
        categoryId = categoryId || null
        page = page || 1
        limit = limit || 30
        let offset = page * limit - limit
        let products

        if (categoryId) {
            let category = await Category.findOne({ where: { id: categoryId, status: 1 } })
            if(category){
                products = await Product.findAndCountAll({ where: { parentGroup: category.apiId, type: 'dish', status: 1 }, order: [['price', 'ASC']], limit, offset })
            }else{
                products = false
            }
        } else {
            products = await Product.findAndCountAll({ where: { type: 'dish', status: 1 }, order: [['price', 'ASC']], limit, offset })
        }

        return res.json(products)
    }
    async getRecommend(req, res) {
        let { id } = req.query
        let recommend = await Product.findAll({ where: { recommend: (id) ? id : 1 } })
        return res.json({ recommend })
    }
    async getOne(req, res) {
        const { id } = req.params
        var product = await Product.findOne({ where: { id, type: 'dish', status: 1 } })
        // let review = await Review.findAll({ include: User, where: { product: id } })
        let size = await Product.findAll({ where: { groupId: product.groupModifiers, type: 'modifier', status: 1 }, order: [['price', 'ASC']] })
        if(size){
            product.attribute = size
        }
        // let dop = await Product.findAll({ where: { type: 'dop', status: 1 } })
        // let rating = []
        // if (review && review.length > 0) {
        //     rating.push(
        //         {
        //             total: (review.length > 1) ? review.reduce((a, b) => a.rating + b.rating, 0) / review.length : review[0].rating,
        //             count: review.length
        //         }
        //     )
        // }
        return res.json({ product })
    }
}

module.exports = new ProductController()

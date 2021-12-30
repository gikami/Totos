const uuid = require('uuid')
const path = require('path');
const { Product, Review, User } = require('../models/models')
const ApiError = require('../error/ApiError');

class ProductController {
    async createProduct(req, res, next) {
        try {
            let { name, price, typeId } = req.body
            const { image } = req.files
            let fileName = uuid.v4() + ".jpg"
            image.mv(path.resolve(__dirname, '..', 'static', fileName))
            const product = await Product.create({ name, price, typeId, image: fileName })

            return res.json(product)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async createReview(req, res, next) {
        try {
            let { rating, text, user, product } = req.body
            const infoReview = await Review.findOne({ where: { userId: user, product } })
            if (!infoReview) {
                const data = await Review.create({ rating, text, userId: user, product })
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
            products = await Product.findAndCountAll({ where: { category: categoryId, type: 'product', status: 1 }, order: [['price', 'ASC']], limit, offset })
        } else {
            products = await Product.findAndCountAll({ where: { type: 'product', status: 1 }, order: [['price', 'ASC']], limit, offset })
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
        let product = await Product.findOne({ where: { id, type: 'product', status: 1 } })
        let review = await Review.findAll({ include: User, where: { product: id } })
        let dop = await Product.findAll({ where: { type: 'dop', status: 1 } })
        let rating = []
        if (review && review.length > 0) {
            rating.push(
                {
                    total: (review.length > 1) ? review.reduce((a, b) => a.rating + b.rating, 0) / review.length : review[0].rating,
                    count: review.length
                }
            )
        }
        return res.json({ product, review, rating, dop })
    }
}

module.exports = new ProductController()

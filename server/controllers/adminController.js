const Aiko = require('../components/aikoTransport')
const uuid = require('uuid')
const path = require('path')
const { unlink } = require('fs')
const { Product, Category, User, Order } = require('../models/models')
const ApiError = require('../error/ApiError')

class AdminController {
    
    async getAikoCompany(req, res, next) {
        try {
            let data = await Aiko.getCompany()
            return res.json(data)
        } catch (error) {
            return res.json(error)
        }
    }
    async getAikoStreets(req, res, next) {
        try {
            let data = await Aiko.getStreets()
            return res.json(data)
        } catch (error) {
            return res.json(error)
        }
    }
    async getAikoCategories(req, res, next) {
        try {
            let data = await Aiko.getCategories()
            return res.json(data)
        } catch (error) {
            return res.json(error)
        }
    }
    async getAikoProducts(req, res, next) {
        try {
            let data = await Aiko.getProducts()
            return res.json(data)
        } catch (error) {
            return res.json(error)
        }
    }
    async sendAikoOrder(req, res, next) {
        try {
            let result = await Aiko.sendOrder()
            return res.json(result)
        } catch (error) {
            return res.json(error)
        }
    }

    async getCategories(req, res) {
        let { limit, page } = req.query
        page = page || 1
        limit = limit || 30
        let offset = page * limit - limit
        let categories = await Category.findAndCountAll({ order: [['id', 'ASC']], limit, offset })
        return res.json(categories)
    }
    async getCategory(req, res) {
        let { id } = req.query
        let category = await Category.findOne({ where: { id } })
        return res.json({ category })
    }
    async createCategory(req, res) {
        const data = req.body
        const category = await Category.create(data)
        return res.json(category)
    }
    async deleteCategory(req, res) {
        let data = req.body
        const category = await Category.findOne({ where: { id: data.id } })
        if (!category) {
            return next(ApiError.internal('Такой категории не существует'))
        }
        await category.destroy()

        return res.json(true)
    }
    async editCategory(req, res) {
        const data = req.body
        let category = await Category.findOne({ where: { id: data.id } })
        if (!category) {
            return next(ApiError.internal('Такой категории не существует'))
        }
        await category.update(data)
        await category.save()

        return res.json(category)
    }

    async getProducts(req, res) {
        let { limit, page } = req.query
        page = page || 1
        limit = limit || 30
        let offset = page * limit - limit
        let products = await Product.findAndCountAll({ order: [['id', 'ASC']], limit, offset })
        return res.json(products)
    }
    async getProduct(req, res) {
        let { id } = req.query
        let product = await Product.findOne({ where: { id } })
        return res.json({ product })
    }
    async createProduct(req, res, next) {
        const data = req.body

        if (data) {
            const { image } = req.files
            const product = await Product.create(data)
            if (image) {
                let fileName = uuid.v4() + ".jpg"
                image.mv(path.resolve(__dirname, '..', 'static/products', fileName))
                product.update({ image: fileName })
                product.save()
            }
            return res.json(product)
        } else {
            return next(ApiError.internal('Заполнены не все поля'))
        }
    }
    async deleteProduct(req, res) {
        let data = req.body
        const product = await Product.findOne({ where: { id: data.id } })
        if (!product) {
            return next(ApiError.internal('Такого товара не существует'))
        }
        await product.destroy()

        return res.json(true)
    }
    async editProduct(req, res) {
        const data = req.body
        const file = req.files

        const product = await Product.findOne({ where: { id: data.id } })
        if (!product) {
            return next(ApiError.internal('Такого товара не существует'))
        }
        await product.update(data)
        await product.save()
        if (file && file.image) {
            if (product.image) {
                unlink('static/products/' + product.image, (err) => {
                    if (err) throw err
                })
            }
            let fileName = uuid.v4() + ".jpg"
            file.image.mv(path.resolve(__dirname, '..', 'static/products', fileName))

            await product.update({ image: fileName })
            await product.save()
        }
        return res.json(product)
    }



    async getOrders(req, res) {
        let { limit, page } = req.query
        page = page || 1
        limit = limit || 30
        let offset = page * limit - limit
        let orders = await Order.findAndCountAll({ order: [['id', 'ASC']], limit, offset })
        return res.json(orders)
    }
    async getOrder(req, res) {
        let { id } = req.query
        let order = await Order.findOne({ where: { id } })
        return res.json({ order })
    }
    async createOrder(req, res, next) {
        let { name, price, category, sale } = req.body
        const { image } = req.files
        let fileName = uuid.v4() + ".jpg"
        image.mv(path.resolve(__dirname, '..', 'static', fileName))
        const order = await Order.create({ name, price, sale, category, image: fileName })
        return res.json(order)
    }
    async deleteOrder(req, res) {
        let data = req.body
        const order = await Order.findOne({ where: { id: data.id } })
        if (!order) {
            return next(ApiError.internal('Такого заказа не существует'))
        }
        await order.destroy()

        return res.json(true)
    }
    async editOrder(req, res) {
        const data = req.body
        let order = await Order.findOne({ where: { id: data.id } })
        if (!order) {
            return next(ApiError.internal('Такого заказа не существует'))
        }
        await order.update(data)
        await order.save()
        return res.json(order)
    }



    async getUsers(req, res) {
        let { limit, page } = req.query
        page = page || 1
        limit = limit || 30
        let offset = page * limit - limit
        let users = await User.findAndCountAll({ order: [['id', 'ASC']], limit, offset })
        return res.json(users)
    }
    async getUser(req, res) {
        let { id } = req.query
        let user = await User.findOne({ where: { id } })
        return res.json({ user })
    }
    async createUser(req, res, next) {
        let { name, price, category, sale } = req.body
        const { image } = req.files
        let fileName = uuid.v4() + ".jpg"
        image.mv(path.resolve(__dirname, '..', 'static', fileName))
        const user = await User.create({ name, price, sale, category, image: fileName })
        return res.json(user)
    }
    async deleteUser(req, res) {
        let data = req.body
        const user = await User.findOne({ where: { id: data.id } })
        if (!user) {
            return next(ApiError.internal('Такого пользователя не существует'))
        }
        await user.destroy()

        return res.json(true)
    }
    async editUser(req, res) {
        var data = req.body
        const user = await User.findOne({ where: { id: data.id } })

        if (!user) {
            return next(ApiError.internal('Пользователь не найден'))
        }
        if (data.phone) {
            data.phone = data.phone.replace(/[^\d]/g, '')
        }
        await user.update(data)
        await user.save()

        return res.json(user)
    }
}

module.exports = new AdminController()

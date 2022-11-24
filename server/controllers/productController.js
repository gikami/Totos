const uuid = require('uuid')
const path = require('path')
const {Op, Product, Review, User, Category} = require('../models/models')
const ApiError = require('../error/ApiError')

class ProductController {
    async createReview(req, res, next) {
        try {
            let {rating, text, name, user, product} = req.body
            const infoReview = await Review.findOne({where: {userId: user, product}})
            if (!infoReview) {
                const data = await Review.create({rating, text, userId: user, name, product})
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
            let {categoryId, limit, page} = req.body
            categoryId = categoryId ? categoryId : false
            page = page || 1
            limit = limit || 30
            let offset = page * limit - limit
            var products = []
            var category

            if (categoryId) {
                if (categoryId.subcategory && categoryId.subcategory.length > 0) {
                    category = await Category.findOne({where: {id: categoryId.subcategory[0].id, status: 1}})
                } else {
                    category = await Category.findOne({where: {id: categoryId.id, status: 1}})
                }
                if (category) {
                    products = await Product.findAll({
                        where: {parentGroup: category.apiId, type: 'dish', status: 1},
                        order: [['price', 'ASC']],
                        limit,
                        offset,
                    })
                    if (products) {
                        let productsData = await products.map(async (item) => {
                            let idModifier =
                                item.groupModifiers && JSON.parse(item.groupModifiers)[0]
                                    ? JSON.parse(item.groupModifiers)[0]
                                    : false
                            if (idModifier) {
                                let modifier = await Product.findOne({
                                    where: {groupId: idModifier, type: 'modifier', status: 1},
                                    order: [['price', 'ASC']],
                                })
                                if (modifier) {
                                    item.price = modifier.price
                                }
                            }
                            return item
                        })
                        products = await Promise.all(productsData).then((res) => res)
                    }
                } else {
                    products = false
                }
            } else {
                category = await Category.findAll({
                    where: {parentGroup: null, isGroupModifier: 0, status: 1},
                    order: [['priority', 'ASC']],
                })
                if (category) {
                    products = category.map(async (item) => {
                        var rows = []
                        let subcategoryData = await Category.findAll({
                            where: {parentGroup: item.apiId, isGroupModifier: 0, status: 1},
                            order: [['priority', 'ASC']],
                        })
                        if (subcategoryData) {
                            rows['subCategory'] = subcategoryData.map(async (itemSubCategory) => {
                                let subProductsData = await Product.findAll({
                                    where: {parentGroup: itemSubCategory.apiId, type: 'dish', status: 1},
                                    order: [
                                        ['title', 'ASC'],
                                        ['price', 'DESC'],
                                    ],
                                })

                                if (subProductsData) {
                                    let subProducts = subProductsData.map(async (item) => {
                                        let idModifier =
                                            item.groupModifiers && JSON.parse(item.groupModifiers)[0]
                                                ? JSON.parse(item.groupModifiers)[0]
                                                : false
                                        if (idModifier) {
                                            let modifier = await Product.findOne({
                                                where: {groupId: idModifier, type: 'modifier', status: 1},
                                                order: [
                                                    ['title', 'ASC'],
                                                    ['price', 'DESC'],
                                                ],
                                            })
                                            if (modifier) {
                                                item.price = modifier.price
                                            }
                                        }
                                        return item
                                    })
                                    let array = [
                                        {
                                            title: itemSubCategory.title,
                                            products: await Promise.all(subProducts).then((res) => res),
                                        },
                                    ]
                                    return array
                                }
                            })
                        }
                        let productsData = await Product.findAll({
                            where: {parentGroup: item.apiId, type: 'dish', status: 1},
                            order: [
                                ['title', 'ASC'],
                                ['price', 'DESC'],
                            ],
                        })
                        rows['products'] = productsData.map(async (item) => {
                            let idModifier =
                                item.groupModifiers && JSON.parse(item.groupModifiers)[0]
                                    ? JSON.parse(item.groupModifiers)[0]
                                    : false
                            if (idModifier) {
                                let modifier = await Product.findOne({
                                    where: {groupId: idModifier, type: 'modifier', status: 1},
                                    order: [
                                        ['title', 'ASC'],
                                        ['price', 'DESC'],
                                    ],
                                })
                                if (modifier) {
                                    item.price = modifier.price
                                }
                            }
                            return item
                        })

                        let products = await Promise.all(rows['products']).then((res) => res)
                        products = products.sort(function (a, b) {
                            return a.price - b.price
                        })
                        let subProducts = await Promise.all(rows['subCategory']).then((res) => res)
                        subProducts = subProducts.sort(function (a, b) {
                            return a.price - b.price
                        })
                        return {item, products, subProducts}
                    })

                    let data = await Promise.all(products).then((res) => res)

                    return res.json(data)
                }
            }
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }
    async getRecommend(req, res) {
        let {id} = req.query
        let recommend = await Product.findAll({where: {recommend: id ? id : 1}})
        return res.json({recommend})
    }
    async getOne(req, res, next) {
        try {
            const {id} = req.params
            var product = await Product.findOne({where: {id: id, type: 'dish', status: 1}})
            let attribute = product.groupModifiers ? JSON.parse(product.groupModifiers) : false
            let attributeView = []
            if (attribute && attribute[0]) {
                let attr = await Product.findAll({
                    where: {groupId: attribute[0], type: 'modifier', status: 1},
                    order: [['price', 'ASC']],
                })
                attributeView.push(attr)
                if (attr[0].weight) {
                    product.weight = attr[0].weight
                }
            }
            if (attribute && attribute[1]) {
                let attr = await Product.findAll({
                    where: {groupId: attribute[1], type: 'modifier', status: 1},
                    order: [['price', 'ASC']],
                })
                attributeView.push(attr)
                // if (attr[0].weight) {
                //     product.weight = attr[0].weight
                // }
            }

            if (attributeView) {
                product.attribute = attributeView
            }
            if (product.price === 0 && attributeView[0]) {
                product.price = attributeView[0][0].price
            }
            return res.json({product})
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }
}

module.exports = new ProductController()

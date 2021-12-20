const sequelize = require('../db')
const { DataTypes } = require('sequelize')
const User = sequelize.define('user', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    email: { type: DataTypes.STRING, unique: true, },
    firstname: { type: DataTypes.STRING },
    lastname: { type: DataTypes.STRING },
    phone: { type: DataTypes.STRING },
    birthday_day: { type: DataTypes.INTEGER },
    birthday_month: { type: DataTypes.INTEGER },
    sex: { type: DataTypes.INTEGER, defaultValue: 0 },
    point: { type: DataTypes.INTEGER, defaultValue: 0 },
    date: { type: DataTypes.DATEONLY },
    status: { type: DataTypes.INTEGER, defaultValue: 1 },
    password: { type: DataTypes.STRING },
    role: { type: DataTypes.STRING, defaultValue: "USER" },
})
const Address = sequelize.define('address', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    user: { type: DataTypes.INTEGER },
    name: { type: DataTypes.STRING },
    region: { type: DataTypes.STRING },
    street: { type: DataTypes.STRING },
    home: { type: DataTypes.STRING },
    floor: { type: DataTypes.INTEGER },
    apartment: { type: DataTypes.STRING },
    entrance: { type: DataTypes.INTEGER },
    code: { type: DataTypes.STRING },
    status: { type: DataTypes.INTEGER, defaultValue: 0 },
})
const Cart = sequelize.define('cart', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
})

const CartProduct = sequelize.define('cart_product', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    productId: { type: DataTypes.INTEGER, allowNull: false },
    count: { type: DataTypes.INTEGER, allowNull: false },
})
const Order = sequelize.define('order', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING },
    phone: { type: DataTypes.STRING },
    user: { type: DataTypes.INTEGER },
    products: { type: DataTypes.STRING(10000) },
    total: { type: DataTypes.INTEGER, defaultValue: 0 },
    paymentId: { type: DataTypes.STRING },
    payment: { type: DataTypes.STRING, defaultValue: 'card' },
    address: { type: DataTypes.STRING },
    delivery: { type: DataTypes.STRING, defaultValue: 1 },
    time: { type: DataTypes.STRING },
    street: { type: DataTypes.STRING },
    home: { type: DataTypes.STRING },
    floor: { type: DataTypes.STRING },
    code: { type: DataTypes.STRING },
    entrance: { type: DataTypes.STRING },
    apartment: { type: DataTypes.STRING },
    point: { type: DataTypes.INTEGER, defaultValue: 0 },
    status: { type: DataTypes.INTEGER, defaultValue: 0 }
})
const Product = sequelize.define('product', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    api_id: { type: DataTypes.STRING },
    category_mogifier: { type: DataTypes.STRING },
    title: { type: DataTypes.STRING(500) },
    price: { type: DataTypes.INTEGER, defaultValue: 0 },
    sale: { type: DataTypes.INTEGER, defaultValue: 0 },
    category: { type: DataTypes.STRING },
    rating: { type: DataTypes.FLOAT, defaultValue: 0 },
    weight: { type: DataTypes.FLOAT, defaultValue: 0 },
    description: { type: DataTypes.STRING(2500) },
    info: { type: DataTypes.STRING },
    tags: { type: DataTypes.STRING },
    //type: { type: DataTypes.STRING,  allowNull: false },
    image: { type: DataTypes.STRING },
    status: { type: DataTypes.INTEGER, defaultValue: 1 },
    createdAt: {
        type: 'TIMESTAMP',
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false
    },
    updatedAt: {
        type: 'TIMESTAMP',
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false
    }
})

const Category = sequelize.define('category', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    api_id: { type: DataTypes.STRING, allowNull: false },
    priority: { type: DataTypes.INTEGER },
    title: { type: DataTypes.STRING(500) },
    image: { type: DataTypes.STRING },
    status: { type: DataTypes.INTEGER, defaultValue: 1 },
    createdAt: {
        type: 'TIMESTAMP',
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false
    },
    updatedAt: {
        type: 'TIMESTAMP',
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false
    }
})

const Rating = sequelize.define('rating', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    rate: { type: DataTypes.INTEGER, allowNull: false },
})

User.hasOne(Cart)
Cart.belongsTo(User)

User.hasMany(Rating)
Rating.belongsTo(User)

Cart.hasMany(CartProduct)
CartProduct.belongsTo(Cart)

module.exports = {
    User,
    Cart,
    CartProduct,
    Product,
    Category,
    Rating,
    Address,
    Order
}
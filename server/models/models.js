const sequelize = require('../db')
const { DataTypes } = require('sequelize')
const User = sequelize.define('user', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    email: { type: DataTypes.STRING },
    firstname: { type: DataTypes.STRING },
    lastname: { type: DataTypes.STRING },
    phone: { type: DataTypes.STRING, unique: true },
    birthday_day: { type: DataTypes.INTEGER },
    birthday_month: { type: DataTypes.INTEGER },
    sex: { type: DataTypes.INTEGER, defaultValue: 0 },
    point: { type: DataTypes.INTEGER, defaultValue: 0 },
    status: { type: DataTypes.INTEGER, defaultValue: 1 },
    password: { type: DataTypes.STRING(500) },
    role: { type: DataTypes.STRING, defaultValue: "USER" },
})
const Address = sequelize.define('address', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    user: { type: DataTypes.INTEGER },
    name: { type: DataTypes.STRING },
    full: { type: DataTypes.STRING },
    street: { type: DataTypes.STRING },
    home: { type: DataTypes.STRING },
    floor: { type: DataTypes.STRING },
    apartment: { type: DataTypes.STRING },
    entrance: { type: DataTypes.STRING },
    code: { type: DataTypes.STRING },
    status: { type: DataTypes.INTEGER, defaultValue: 0 },
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
    comment: { type: DataTypes.STRING(1500) },
    point: { type: DataTypes.INTEGER, defaultValue: 0 },
    status: { type: DataTypes.INTEGER, defaultValue: 0 },
    sale: { type: DataTypes.STRING(500) },
    promo: { type: DataTypes.STRING }
})

const Product = sequelize.define('product', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    category_mogifier: { type: DataTypes.STRING },
    title: { type: DataTypes.STRING(500) },
    price: { type: DataTypes.INTEGER, defaultValue: 0 },
    sale: { type: DataTypes.INTEGER, defaultValue: 0 },
    category: { type: DataTypes.STRING },
    rating: { type: DataTypes.FLOAT, defaultValue: 0 },
    weight: { type: DataTypes.FLOAT, defaultValue: 0 },
    mini_description: { type: DataTypes.STRING(2500) },
    description: { type: DataTypes.STRING(5000) },
    attribute: { type: DataTypes.STRING(2000) },
    param: { type: DataTypes.STRING },
    recommend: { type: DataTypes.STRING },
    tags: { type: DataTypes.STRING(2000) },
    type: { type: DataTypes.STRING, defaultValue: 'product' },
    image: { type: DataTypes.STRING },
    status: { type: DataTypes.INTEGER, defaultValue: 1 }
})
const Review = sequelize.define('review', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    userId: { type: DataTypes.INTEGER },
    name: { type: DataTypes.INTEGER },
    text: { type: DataTypes.STRING(5000) },
    rating: { type: DataTypes.INTEGER, defaultValue: 0 },
    product: { type: DataTypes.INTEGER, defaultValue: 0 },
    status: { type: DataTypes.INTEGER, defaultValue: 1 }
})
const Sale = sequelize.define('sale', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING(250) },
    desc: { type: DataTypes.TEXT },
    image: { type: DataTypes.STRING(250) },
    price: {type: DataTypes.INTEGER},
    procent: {type: DataTypes.INTEGER},
    category: {type: DataTypes.INTEGER},
    product: {type: DataTypes.INTEGER},
    day: {type: DataTypes.INTEGER},
    dateEnd: { type: DataTypes.DATEONLY },
    status: { type: DataTypes.INTEGER, defaultValue: 1 }
})
const Category = sequelize.define('category', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    priority: { type: DataTypes.INTEGER },
    title: { type: DataTypes.STRING(500) },
    image: { type: DataTypes.STRING },
    status: { type: DataTypes.INTEGER, defaultValue: 1 }
})
const Promo = sequelize.define('promo', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    code: { type: DataTypes.STRING },
    price: { type: DataTypes.INTEGER, defaultValue: 0 },
    dateEnd: { type: DataTypes.DATEONLY },
    minTotal: { type: DataTypes.INTEGER, defaultValue: 0 },
    maxTotal: { type: DataTypes.INTEGER, defaultValue: 0 },
    products: { type: DataTypes.STRING(5000) },
    text: { type: DataTypes.STRING(1500) },
    maxOrder: { type: DataTypes.INTEGER, defaultValue: 0 },
    minOrder: { type: DataTypes.INTEGER, defaultValue: 0 },
    saleActive: { type: DataTypes.INTEGER, defaultValue: 1 },
    authUser: { type: DataTypes.INTEGER, defaultValue: 0 },
    status: { type: DataTypes.INTEGER, defaultValue: 1 }
})


User.hasMany(Review);
Review.belongsTo(User);

module.exports = {
    User,
    Product,
    Category,
    Address,
    Order,
    Review,
    Promo, 
    Sale
}
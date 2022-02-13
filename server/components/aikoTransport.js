const axios = require('axios')
const fs = require('fs')
const path = require('path')
const { Category, Product, City, Street } = require('../models/models')

class Aiko {
    constructor() {
        this.url = 'https://api-ru.iiko.services/api/1/'
        this.apiLogin = '7d87398c'
        this.token = false
        this.org = false
        this.city = []
        this.streets = []
        this.auth()
    }
    async auth() {
        //Авторизация и получение (token)
        await axios({
          method: 'post',
          url: this.url + 'access_token',
          data: {
            'apiLogin': this.apiLogin
          },
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        })
        .then(response => {
          this.token = response.data.token
        })
        
        //Получение данных организации (id)
        await axios({
          method: 'post',
          url: this.url + 'organizations',
          data: {
            'apiLogin': this.apiLogin
          },
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.token}`
          }
        })
        .then(response => {
           this.org = response.data.organizations[0].id
        })
        if(!this.org || !this.token){
            return 'Ошибка нет данные организации или ключа'
        }
    }
    async getStreets() {
        //Полученние списка городов (id)
        await axios({
          method: 'post',
          url: this.url + 'cities',
          data: {
            'organizationIds': [this.org]
          },
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.token}`
          }
        })
        .then(response => {
          this.city = response.data.cities[0].items[0]
        })
        
        if(!this.city){
            return 'Ошибка при получении городов'
        }
        //Получение улиц города
        await axios({
          method: 'post',
          url: this.url + 'streets/by_city',
          data: {
            'organizationId': this.org,
            'cityId': this.city.id
          },
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.token}`
          }
        })
        .then(response => {
          this.streets = response.data.streets
        })
        if(!this.streets){
            return 'Ошибка при получении улиц'
        }
        await City.destroy({ where: {}, truncate : true, cascade: false, restartIdentity: true })
        await Array(this.city).map(item => City.create({apiId: item.id, title: item.name, classifierId: (item.classifierId) ? item.classifierId : '', externalRevision: (item.externalRevision) ? item.externalRevision : 0, status: (item.isDeleted) ? 0 : 1}))
        await Street.destroy({ where: {}, truncate : true, cascade: false, restartIdentity: true })
        await this.streets.map(item => Street.create({apiId: item.id, title: item.name, classifierId: (item.classifierId) ? item.classifierId : '', externalRevision: (item.externalRevision) ? item.externalRevision : 0, status: (item.isDeleted) ? 0 : 1}))
        
        return {count: this.streets.length, city: this.city}
    }
    async getCategories() {
        //Получение категорий
        await axios({
          method: 'post',
          url: this.url + 'nomenclature',
          data: {
            'organizationId': this.org
          },
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.token}`
          }
        })
        .then(response => {
          this.categories = response.data.groups
        })
        if(!this.categories){
            return 'Ошибка при получении категорий'
        }
        Category.destroy({ where: {}, truncate : true, cascade: false, restartIdentity: true })
        this.categories.map(item => 
            Category.create({
                apiId: item.id, 
                title: item.name.replace(/(<([^>]+)>)/ig,''),
                parentGroup: item.parentGroup,
                isGroupModifier: (item.isGroupModifier) ? 1 : 0,
                status: (item.isDeleted) ? 0 : 1
            })
        )

        return {count: this.categories.length, categories: this.categories}
    }
    async getProducts() {
        //Получение улиц города
        await axios({
          method: 'post',
          url: this.url + 'nomenclature',
          data: {
            'organizationId': this.org
          },
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.token}`
          }
        })
        .then(response => {
          this.products = response.data.products
        })
        if(!this.products){
            return 'Ошибка при получении товаров'
        }
        
        Product.destroy({ where: {}, truncate: true, cascade: false, restartIdentity: true })

        this.products.map(item => {
            if(item.type.toLowerCase() === 'dish'){
                let fileName = false
                if (item.imageLinks && item.imageLinks[0]) {
                    const fileUrl = item.imageLinks[0]
                    fileName = path.basename(fileUrl)
                    const localFilePath = path.resolve(__dirname, '..', 'static/products', fileName)
                    axios({
                        method: 'GET',
                        url: fileUrl,
                        responseType: 'stream'
                    }).then(response => {
                        response.data.pipe(fs.createWriteStream(localFilePath))
                    }).catch(error => {
                        console.log(error)
                    })
                }
                Product.create({
                    apiId: item.id,
                    title: (item.name) ? item.name.replace(/(<([^>]+)>)/ig,'') : '',
                    description: (item.description) ? item.description.replace(/(<([^>]+)>)/ig,'') : '',
                    price: (item.sizePrices[0] && item.sizePrices[0].price.currentPrice > 0) ? item.sizePrices[0].price.currentPrice : 0,
                    groupId: (item.groupId) ? item.groupId : '',
                    parentGroup: (item.parentGroup) ? item.parentGroup : '',
                    productCategoryId: (item.productCategoryId) ? item.productCategoryId : '',
                    groupModifiers: (item.groupModifiers && item.groupModifiers[0]) ? item.groupModifiers[0].id : '',
                    weight: (item.weight) ? item.weight : 0,
                    type: 'dish',
                    tags: JSON.stringify([
                        {
                            title: 'Калорийность',
                            value: (item.energyFullAmount) ? item.energyFullAmount : 0
                        }
                    ]),
                    image: (fileName) ? fileName : ''
                })
            }
        })
        this.products.map( async item => {
            if(item.type.toLowerCase() === 'modifier'){

                Product.update({price: (item.sizePrices[0] && item.sizePrices[0].price.currentPrice > 0) ? item.sizePrices[0].price.currentPrice : 0},{where:{groupModifiers: item.groupId, price: 0}})

                Product.create({
                    apiId: item.id,
                    title: (item.name) ? item.name.replace(/(<([^>]+)>)/ig,'') : '',
                    description: (item.description) ? item.description.replace(/(<([^>]+)>)/ig,'') : '',
                    price: (item.sizePrices[0] && item.sizePrices[0].price.currentPrice > 0) ? item.sizePrices[0].price.currentPrice : 0,
                    groupId: (item.groupId) ? item.groupId : '',
                    parentGroup: (item.parentGroup) ? item.parentGroup : '',
                    productCategoryId: (item.productCategoryId) ? item.productCategoryId : '',
                    weight: (item.weight) ? item.weight : 0,
                    type: 'modifier',
                    tags: JSON.stringify([
                        {
                            title: 'Калорийность',
                            value: (item.energyFullAmount) ? item.energyFullAmount : 0
                        }
                    ])
                })
            }
        })
        return {count: this.products.length, products: this.products}
        
    }
 
    async sendOrder(order) {
        if (!order) {
            return 'Нет данных о заказе'
        }
        const payment = await axios.get(this.url + "rmsSettings/getPaymentTypes?access_token=" + this.token.data + "&organization=" + this.org.data[0].id)
        if (!payment) {
            return 'Ошибка при получении типа оплаты'
        }
        let matches = payment.data.paymentTypes.filter(pay => pay.code === order.payment.toUpperCase() && pay);
        if (matches && matches[0]) {
            var productsData = []
            order.products.map(item => {
                productsData.push(
                    {
                        "id": item.api_id,
                        "name": item.title,
                        "amount": item.count,
                        "code": 31,
                        "sum": item.price,
                    }
                )
            })
            await axios.post(this.url + "orders/add?access_token=" + this.token.data + "&organization=" + this.org.data[0].id,
                JSON.stringify({
                    "organization": this.org.data[0].id,
                    "order": {
                        "phone": order.phone,
                        "isSelfService": false,
                        "address": {
                            "street": (order.street) ? order.street : 'ул 1 мая',
                            "home": (order.home) ? order.home : 5,
                            "apartment": order.apartment,
                            "comment": order.comment
                        },
                        //"date": order.date,
                        "personsCount": 1,
                        "items": productsData,
                        "paymentItems": [
                            {
                                "sum": order.total,
                                "paymentType": matches[0],
                                "isProcessedExternally": false,
                            }
                        ]
                    }
                }), {
                headers: {
                    'Content-Type': 'application/json',
                    "access_token": this.token.data,
                    "organization": this.org.data[0].id,
                }
            }).then(result => {
                console.log(result)
            }).catch(error => {
                console.log(error)
            })
        }
    }
}

module.exports = new Aiko()
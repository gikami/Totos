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
    this.terminal = false
    this.payment = []
    this.order = false
    this.city = []
    this.streets = []
    this.modifiers = []
    this.header = {}
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
      .catch(error => console.error(error))

    if (!this.token) {
      return 'Ошибка нет данные организации или ключа'
    }

    this.header = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.token}`
    }
    //Получение данных организации (id)
    await axios({
      method: 'post',
      url: this.url + 'organizations',
      data: {
        'apiLogin': this.apiLogin
      },
      headers: this.header
    })
      .then(response => {
        this.org = response.data.organizations[0].id
      })
      .catch(error => console.error(error))

    if (!this.org) {
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
      headers: this.header
    })
      .then(response => {
        this.city = response.data.cities[0].items[0]
      })
      .catch(error => console.error(error))

    if (!this.city) {
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
      headers: this.header
    })
      .then(response => {
        this.streets = response.data.streets
      })
      .catch(error => console.error(error))

    if (!this.streets) {
      return 'Ошибка при получении улиц'
    }
    City.destroy({ where: {}, truncate: true, cascade: false, restartIdentity: true })
    Array(this.city).map(item => City.create({ apiId: item.id, title: item.name, classifierId: (item.classifierId) ? item.classifierId : '', externalRevision: (item.externalRevision) ? item.externalRevision : 0, status: (item.isDeleted) ? 0 : 1 }))
    Street.destroy({ where: {}, truncate: true, cascade: false, restartIdentity: true })
    this.streets.map(item => Street.create({ apiId: item.id, title: item.name, classifierId: (item.classifierId) ? item.classifierId : '', externalRevision: (item.externalRevision) ? item.externalRevision : 0, status: (item.isDeleted) ? 0 : 1 }))

    return { count: this.streets.length, city: this.city }
  }
  async getCategories() {
    //Получение категорий
    await axios({
      method: 'post',
      url: this.url + 'nomenclature',
      data: {
        'organizationId': this.org
      },
      headers: this.header
    })
      .then(response => {
        this.categories = response.data.groups
      })
      .catch(error => console.error(error))

    if (!this.categories) {
      return 'Ошибка при получении категорий'
    }
    Category.destroy({ where: {}, truncate: true, cascade: false, restartIdentity: true })
    this.categories.map((item, i) => {
      Category.create({
        apiId: item.id,
        title: item.name.replace(/(<([^>]+)>)/ig, ''),
        priority: i,
        parentGroup: item.parentGroup,
        isGroupModifier: (item.isGroupModifier) ? 1 : 0,
        status: (item.isDeleted) ? 0 : 1
      })
    })

    return { count: this.categories.length, categories: this.categories }
  }
  async getProducts() {
    //Получение улиц города
    await axios({
      method: 'post',
      url: this.url + 'nomenclature',
      data: {
        'organizationId': this.org
      },
      headers: this.header
    })
      .then(response => {
        console.log(response)
        this.products = response.data.products
      })
      .catch(error => console.error(error))

    if (!this.products) {
      return 'Ошибка при получении товаров'
    }

    Product.destroy({ where: {}, truncate: true, cascade: false, restartIdentity: true })

    this.products.map(item => {
      if (item.type.toLowerCase() === 'dish') {
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
          title: (item.name) ? item.name.replace(/(<([^>]+)>)/ig, '') : '',
          description: (item.description) ? item.description.replace(/(<([^>]+)>)/ig, '') : '',
          price: (item.sizePrices[0] && item.sizePrices[0].price.currentPrice) ? item.sizePrices[0].price.currentPrice : 0,
          groupId: (item.groupId) ? item.groupId : '',
          parentGroup: (item.parentGroup) ? item.parentGroup : '',
          productCategoryId: (item.productCategoryId) ? item.productCategoryId : '',
          groupModifiers: (item.groupModifiers && item.groupModifiers[0]) ? JSON.stringify(item.groupModifiers.map(item => item.id)) : '',
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
    this.products.map(async item => {
      if (item.type.toLowerCase() === 'modifier' && item.groupId) {
        Product.create({
          apiId: item.id,
          title: (item.name) ? item.name.replace(/(<([^>]+)>)/ig, '') : '',
          description: (item.description) ? item.description.replace(/(<([^>]+)>)/ig, '') : '',
          price: (item.sizePrices[0] && item.sizePrices[0].price.currentPrice) ? item.sizePrices[0].price.currentPrice : 0,
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
    return { count: this.products.length, products: this.products }

  }

  async sendOrder(order, address) {
    if (!order) {
      return 'Нет данных о заказе'
    }
    //Получение типы оплат
    await axios({
      method: 'post',
      url: this.url + 'payment_types',
      data: {
        'organizationIds': [this.org]
      },
      headers: this.header
    })
      .then(response => {
        let pay = response.data.paymentTypes.filter(item => item.code.toUpperCase() == order.payment.toUpperCase() && item)[0]
        if (!pay) {
          return 'Не удалось определить тип платежа'
        }
        this.payment = {
          'paymentTypeKind': pay.paymentTypeKind,
          'paymentTypeId': pay.id,
          'sum': order.total
        }
        let terminal = pay.terminalGroups.filter(item => item.name.toUpperCase().indexOf(order.terminalAddress.toUpperCase()) > -1 && item)[0]
        this.terminal = terminal ? terminal.id : false
      })
      .catch(error => console.error(error))

    if (!this.payment || !this.terminal) {
      console.error('Нет типа оплаты иди идентификатора терминала')
      return 'Нет типа оплаты иди идентификатора терминала'
    }
    let products = order.products && order.products.map(item => {
      let dop = item.attribute ?
        item.size ?
          item.attribute[0].filter(e => e.id == item.size.id && e).map(modifer => ({
            'productId': modifer.apiId,
            'amount': modifer.count ? modifer.count : 1,
            'productGroupId': modifer.groupId ? modifer.groupId : '',
            'price': modifer.price ? modifer.price : 0,
          }))
          : [{
            'productId': item.attribute[0][0].apiId,
            'amount': item.attribute[0][0].count ? item.attribute[0][0].count : 1,
            'productGroupId': item.attribute[0][0].groupId ? item.attribute[0][0].groupId : '',
            'price': item.attribute[0][0].price ? item.attribute[0][0].price : 0,
          }]
        : []

      if (item.dop) {
        item.dop.map(e => dop.push({
          'productId': e.apiId,
          'amount': e.count ? e.count : 1,
          'productGroupId': e.groupId ? e.groupId : '',
          'price': e.price ? e.price : 0,
        }))
      }

      return {
        'productId': item.apiId,
        'type': 'Product',
        'price': item.attribute ? 0 : item.price ? item.price : 0,
        'amount': item.count,
        'modifiers': dop
      }
    })

    //Отправка заявки
    await axios({
      method: 'post',
      url: this.url + 'deliveries/create',
      data: {
        'organizationId': this.org,
        'terminalGroupId': this.terminal,
        'order': {
          'phone': '+' + order.phone,
          'orderServiceType': order.delivery == 1 ? 'DeliveryByClient' : 'DeliveryByCourier',
          'customer': {
            'name': order.name ? order.name : '',
            'comment': order.comment ? order.comment : ''
          },
          'items': products,
          'payments': [
            this.payment
          ],
          'deliveryPoint': {
            'address': {
              'street': {
                'id': order.streetId ? order.streetId : '',
                'name': address.street ? address.street : '',
                'city': 'Казань',
              },
              'house': address.home ? address.home : '',
              'flat': address.apartment ? address.apartment : '',
              'entrance': address.entrance ? address.entrance : '',
              'floor': address.floor ? address.floor : '',
            },
            'comment': order.comment
          }
        }
      },
      headers: this.header
    })
      .then(response => console.log(response))
      .catch(error => console.error(error))
  }
}

module.exports = new Aiko()
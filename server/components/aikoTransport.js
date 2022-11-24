const axios = require('axios')
const fs = require('fs')
const path = require('path')
const {Category, Product, City, Street, User} = require('../models/models')

class Aiko {
    constructor() {
        this.url = 'https://api-ru.iiko.services/api/1/'
        this.apiLogin = '7d87398c'
    }
    async auth() {
        //Авторизация и получение (token)
        let token
        let org
        let header

        await axios({
            method: 'post',
            url: this.url + 'access_token',
            data: {
                apiLogin: this.apiLogin,
            },
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
        })
            .then((response) => {
                token = response.data.token
            })
            .catch((error) => {
                console.error(error.data)
                return {status: false, message: 'Ошибка нет ключа'}
            })

        header = {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        }
        //Получение данных организации (id)
        await axios({
            method: 'post',
            url: this.url + 'organizations',
            data: {
                apiLogin: this.apiLogin,
            },
            headers: header,
        })
            .then((response) => {
                org = response.data.organizations[0].id
            })
            .catch((error) => {
                console.error(error.data)
                return {status: false, message: 'Ошибка нет данные организации или ключа'}
            })

        return {header, token, org}
    }
    async getStreets() {
        //Полученние списка городов (id)
        let config = await this.auth()
        let city
        let streets
        await axios({
            method: 'post',
            url: this.url + 'cities',
            data: {
                organizationIds: [config.org],
            },
            headers: config.header,
        })
            .then((response) => {
                console.log(response.data.cities[0])
                city = response.data.cities[0].items[1]
                console.log(city)
                if (!city) {
                    return 'Ошибка при получении улиц'
                }
            })
            .catch((error) => {
                console.error(error.data)
                return 'Ошибка при получении улиц'
            })

        //Получение улиц города
        await axios({
            method: 'post',
            url: this.url + 'streets/by_city',
            data: {
                organizationId: config.org,
                cityId: city.id,
            },
            headers: config.header,
        })
            .then((response) => {
                streets = response.data.streets
                if (!streets) {
                    return 'Ошибка при получении улиц'
                }
            })
            .catch((error) => {
                console.error(error.data)
                return 'Ошибка при получении улиц'
            })

        City.destroy({where: {}, truncate: true, cascade: false, restartIdentity: true})
        Array(city).map((item) =>
            City.create({
                apiId: item.id,
                title: item.name,
                classifierId: item.classifierId ? item.classifierId : '',
                externalRevision: item.externalRevision ? item.externalRevision : 0,
                status: item.isDeleted ? 0 : 1,
            })
        )
        Street.destroy({where: {}, truncate: true, cascade: false, restartIdentity: true})
        streets.map(
            (item) =>
                !item.isDeleted &&
                Street.create({
                    apiId: item.id,
                    title: item.name,
                    classifierId: item.classifierId ? item.classifierId : '',
                    externalRevision: item.externalRevision ? item.externalRevision : 0,
                    status: item.isDeleted ? 0 : 1,
                })
        )

        return {count: streets.length, city: city, streets: streets}
    }
    async getCategories() {
        let config = await this.auth()
        let categories

        //Получение категорий
        await axios({
            method: 'post',
            url: this.url + 'nomenclature',
            data: {
                organizationId: config.org,
            },
            headers: config.header,
        })
            .then((response) => {
                categories = response.data.groups
            })
            .catch((error) => console.error(error.data))

        if (!categories) {
            return 'Ошибка при получении категорий'
        }
        Category.destroy({where: {}, truncate: true, cascade: false, restartIdentity: true})
        categories.map((item, i) => {
            Category.create({
                apiId: item.id,
                title: item.name.replace(/(<([^>]+)>)/gi, ''),
                priority: item.order,
                parentGroup: item.parentGroup,
                isGroupModifier: item.isGroupModifier ? 1 : 0,
                status: item.isDeleted ? 0 : 1,
            })
        })

        return {count: categories.length, categories: categories}
    }
    async getProducts() {
        let config = await this.auth()
        let products
        //Получение улиц города
        await axios({
            method: 'post',
            url: this.url + 'nomenclature',
            data: {
                organizationId: config.org,
            },
            headers: config.header,
        })
            .then((response) => {
                products = response.data.products
            })
            .catch((error) => console.error(error.data))

        if (!products) {
            return 'Ошибка при получении товаров'
        }

        Product.destroy({where: {}, truncate: true, cascade: false, restartIdentity: true})

        products.map((item) => {
            if (item.type.toLowerCase() === 'dish') {
                let fileName = false
                if (item.imageLinks && item.imageLinks[0]) {
                    const fileUrl = item.imageLinks[0]
                    fileName = path.basename(fileUrl)
                    const localFilePath = path.resolve(__dirname, '..', 'static/products', fileName)
                    axios({
                        method: 'GET',
                        url: fileUrl,
                        responseType: 'stream',
                    })
                        .then((response) => {
                            response.data.pipe(fs.createWriteStream(localFilePath))
                        })
                        .catch((error) => console.error(error.data))
                }
                Product.create({
                    apiId: item.id,
                    title: item.name ? item.name : '',
                    description: item.description ? item.description.replace(/(<([^>]+)>)/gi, '') : '',
                    price:
                        item.sizePrices[0] && item.sizePrices[0].price.currentPrice
                            ? item.sizePrices[0].price.currentPrice
                            : 0,
                    groupId: item.groupId ? item.groupId : '',
                    parentGroup: item.parentGroup ? item.parentGroup : '',
                    productCategoryId: item.productCategoryId ? item.productCategoryId : '',
                    groupModifiers:
                        item.groupModifiers && item.groupModifiers[0]
                            ? JSON.stringify(item.groupModifiers.map((item) => item.id))
                            : '',
                    weight: item.weight ? item.weight : 0,
                    type: 'dish',
                    tags: JSON.stringify([
                        {
                            title: 'Калорийность',
                            value: item.energyFullAmount ? item.energyFullAmount : 0,
                        },
                    ]),
                    image: fileName ? fileName : '',
                })
            }
        })
        products.map(async (item) => {
            if (item.type.toLowerCase() === 'modifier' && item.groupId) {
                let image = /<id>(.*?)<\/id>/.exec(item.name) ? /<id>(.*?)<\/id>/.exec(item.name)[1] : false
                Product.create({
                    apiId: item.id,
                    title: item.name ? item.name.replace(/<([^\/>]+)>.*?<.*?\/.*?>/gi, '') : '',
                    description: item.description ? item.description.replace(/(<([^>]+)>)/gi, '') : '',
                    price:
                        item.sizePrices[0] && item.sizePrices[0].price.currentPrice
                            ? item.sizePrices[0].price.currentPrice
                            : 0,
                    groupId: item.groupId ? item.groupId : '',
                    parentGroup: item.parentGroup ? item.parentGroup : '',
                    productCategoryId: item.productCategoryId ? item.productCategoryId : '',
                    weight: item.weight ? item.weight : 0,
                    type: 'modifier',
                    tags: JSON.stringify([
                        {
                            title: 'Калорийность',
                            value: item.energyFullAmount ? item.energyFullAmount : 0,
                        },
                    ]),
                    image: image ? image + '.jpg' : '',
                })
            }
        })
        return {count: products.length, products: products}
    }
    async getUser(phone) {
        if (!phone) {
            console.error('Нет номера телефона')
            return {status: false, message: 'Нет номера телефона'}
        }
        let config = await this.auth()
        let user = false

        await axios({
            method: 'post',
            url: this.url + 'loyalty/iiko/customer/info',
            data: {
                organizationId: config.org,
                phone: phone,
                type: 'phone',
            },
            headers: config.header,
        })
            .then((response) => {
                user = response.data.walletBalances[1]
            })
            .catch((error) => console.error(error, 'Ошибка в aikoTransport'))

        if (user) {
            return {status: true, data: user}
        }
    }

    async sendOrder(order, address, check = false) {
        if (!order) {
            return {status: false, message: 'Нет данных о заказе'}
        }

        let config = await this.auth()
        let user
        let terminal
        let orderTypes
        let payment = []
        let status
        let deliveryStatus

        if (order.delivery === 2) {
            await axios({
                method: 'post',
                url: this.url + 'delivery_restrictions/allowed',
                data: {
                    organizationIds: [config.org],
                    deliveryAddress: {
                        city: 'Казань',
                        streetName: address.street,
                        house: address.home,
                    },
                    isCourierDelivery: true,
                },
                headers: config.header,
            })
                .then((response) => {
                    deliveryStatus = response.data
                })
                .catch((error) => {
                    console.error(error)
                    deliveryStatus = false
                })
            console.log(deliveryStatus)
            if (deliveryStatus && deliveryStatus.isAllowed) {
            } else {
                return {
                    status: false,
                    message: 'Приносим наши извинения, но Ваш адрес пока не входит в зону доставки нашего заведения',
                }
            }
        }
        // await axios({
        //   method: 'post',
        //   url: this.url + 'loyalty/iiko/customer/info',
        //   data: {
        //     'organizationId': config.org,
        //     'phone': order.phone,
        //     'type': 'phone'
        //   },
        //   headers: config.header
        // })
        //   .then(response => {
        //     user = response.data.walletBalances[1]
        //   })
        //   .catch(error => {
        //     return { status: false, message: 'Ошибка при отправке заявки. Код ошибки 2', data: error.data }
        //   })

        //Получение типы оплат
        await axios({
            method: 'post',
            url: this.url + 'payment_types',
            data: {
                organizationIds: [config.org],
            },
            headers: config.header,
        })
            .then((response) => {
                let pay = response.data.paymentTypes.filter(
                    (item) => item.code.toUpperCase() == order.payment.toUpperCase() && item
                )[0]
                if (!pay) {
                    return {status: false, message: 'Не удалось определить тип платежа'}
                }
                payment.push({
                    paymentTypeKind: pay.paymentTypeKind,
                    paymentTypeId: pay.id,
                    sum: order.total,
                })
                // if (order.point > 0 && user.balance > 0 && user.balance >= order.point) {
                //   let payPoints = response.data.paymentTypes.filter(item => item.code.toUpperCase() == 'INET' && item)[0]
                //   if (payPoints) {
                //     payment.push({
                //       'paymentTypeKind': payPoints.paymentTypeKind,
                //       'paymentTypeId': payPoints.id,
                //       'sum': Number(order.point),
                //       'paymentAdditionalData': {
                //         'credential': '+' + order.phone,
                //         'searchScope': 'Phone',
                //         'type': payPoints.paymentTypeKind
                //       }
                //     })
                //     User.update({ point: user.balance - Number(order.point) }, { where: { phone: order.phone } })
                //   } else {
                //     return { status: false, message: 'Ошибка при получении данных о пользователе' }
                //   }
                // } else if (order.point > 0 && user.balance < order.point) {
                //   return { status: false, message: 'У вас недостаточно баллов' }
                // }
                if (order.delivery === 1) {
                    let terminalInfo = pay.terminalGroups.filter(
                        (item) => item.name.toUpperCase().indexOf(order.terminalAddress.toUpperCase()) > -1 && item
                    )[0]
                    if (!terminalInfo) {
                        return {status: false, message: 'Не удалось определить терминал'}
                    }
                    terminal = terminalInfo ? terminalInfo.id : false
                }
            })
            .catch((error) => {
                return {status: false, message: 'Ошибка при отправке заявки. Код ошибки 3', data: error.data}
            })

        //Получение типов доставок
        await axios({
            method: 'post',
            url: this.url + 'deliveries/order_types',
            data: {
                organizationIds: [config.org],
            },
            headers: config.header,
        })
            .then((response) => {
                let nameDelivery = 'Доставка Самовывоз Патент'
                if (order.delivery == 1) {
                    nameDelivery = 'Доставка Самовывоз Патент'
                } else if (order.delivery == 2) {
                    if (order.payment == 'ecard') {
                        nameDelivery = 'Доставка курьером'
                    } else {
                        nameDelivery = 'Доставка Курьером Патент'
                    }
                }
                orderTypes = response.data.orderTypes[0].items.filter(
                    (item) => item.name.toUpperCase().indexOf(nameDelivery.toUpperCase()) > -1 && item
                )[0]
            })
            .catch((error) => {
                return {status: false, message: 'Ошибка при отправке заявки. Код ошибки 4', data: error.data}
            })

        let productData =
            order.products && typeof order.products == 'string' ? JSON.parse(order.products) : order.products
        let products = productData.map((item) => {
            let dop = item.attribute
                ? item.size
                    ? item.attribute[0]
                          .filter((e) => e.id == item.size.id && e)
                          .map((modifer) => ({
                              productId: modifer.apiId,
                              amount: modifer.count ? modifer.count : 1,
                              productGroupId: modifer.groupId ? modifer.groupId : '',
                              price: modifer.price ? modifer.price : 0,
                          }))
                    : [
                          {
                              productId:
                                  item.attribute && item.attribute[0][0].apiId ? item.attribute[0][0].apiId : 0,
                              amount: item.attribute[0][0].count ? item.attribute[0][0].count : 1,
                              productGroupId: item.attribute[0][0].groupId ? item.attribute[0][0].groupId : '',
                              price: item.attribute[0][0].price ? item.attribute[0][0].price : 0,
                          },
                      ]
                : []

            if (item.dop) {
                item.dop.map((e) =>
                    dop.push({
                        productId: e.apiId,
                        amount: e.count ? e.count : 1,
                        productGroupId: e.groupId ? e.groupId : '',
                        price: e.price ? e.price : 0,
                    })
                )
            }

            return {
                productId: item.apiId,
                type: 'Product',
                price: item.attribute ? 0 : item.price ? item.price : 0,
                amount: item.count,
                modifiers: dop,
            }
        })
        if (!check) {
            //Отправка заявки
            await axios({
                method: 'post',
                url: this.url + 'deliveries/create',
                data: {
                    organizationId: config.org,
                    terminalGroupId: order.delivery == 1 ? terminal : null,
                    order: {
                        completeBefore:
                            order.time == 1
                                ? null
                                : order.timevalue && order.datevalue
                                ? order.datevalue + ' ' + order.timevalue + ':00.123'
                                : '',
                        phone: '+' + order.phone,
                        orderTypeId: orderTypes ? orderTypes.id : null,
                        orderServiceType: orderTypes
                            ? null
                            : order.delivery == 1
                            ? 'DeliveryByClient'
                            : 'DeliveryByCourier',
                        customer: {
                            name: order.name ? order.name : '',
                            comment: order.comment ? order.comment : '',
                        },
                        items: products,
                        payments: payment,
                        deliveryPoint:
                            order.delivery == 2
                                ? {
                                      address: {
                                          street: {
                                              name: address.street ? address.street : '',
                                              city: 'Казань',
                                          },
                                          house: address.home ? address.home : '',
                                          flat: address.apartment ? address.apartment : '',
                                          entrance: address.entrance ? address.entrance : '',
                                          floor: address.floor ? address.floor : '',
                                      },
                                      comment: order.comment,
                                  }
                                : null,
                    },
                },
                headers: config.header,
            })
                .then((response) => {
                    console.log(response.data)
                    console.log(response.data.orderInfo.errorInfo)
                    status = {status: true, message: 'Заявка успешно отправлена', data: response.data}
                })
                .catch((error) => {
                    console.error(error)
                    status = {status: false, message: 'На данный адрес не производится доставка', data: error.data}
                })
            if (status) {
                return status
            }
        } else {
            console.log('Отправлено на оплату, ожидание оплаты...')
            return {status: true, message: 'Заявка будет отправлена после оплаты...'}
        }
    }
}
module.exports = new Aiko()

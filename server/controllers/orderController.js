const axios = require('axios')
const {Order, Address, Promo, Street} = require('../models/models')
const Mail = require('../components/mail')
const Aiko = require('../components/aikoTransport')
const ApiError = require('../error/ApiError')

class OrderController {
    async create(req, res, next) {
        try {
            var data = req.body

            if (!data) {
                return res.json({status: false, message: 'Нет данных для заказа'})
            }
            if (!data.phone || data.phone.length < 10) {
                return res.json({status: false, message: 'Введите номер телефона'})
            }
            var address = {
                street: data.address && data.address.street ? data.address.street : data.street,
                home: data.address && data.address.home ? data.address.home : data.home,
                entrance: data.address && data.address.entrance ? data.address.entrance : data.entrance,
                code: data.address && data.address.code ? data.address.code : data.code,
                floor: data.address && data.address.floor ? data.address.floor : data.floor,
                apartment: data.address && data.address.apartment ? data.address.apartment : data.apartment,
            }
            data.phone = data.phone.replace(/[^\d]/g, '')

            var payment = ''
            if (data.payment == 'card') {
                payment = 'Банковской картой'
            } else if (data.payment == 'ecard') {
                payment = 'Онлайн'
            } else {
                payment = 'Наличными'
            }
            var text =
                'Имя: <b>' +
                data.name +
                '</b><br />' +
                'Телефон: <b>+' +
                data.phone +
                '</b><br />' +
                'Оплаты: <b>' +
                payment +
                '</b><br />' +
                'Доставка/Самовывоз: <b>' +
                (data.delivery == 1 ? 'Самовывоз' : 'Доставка') +
                '</b><br />' +
                (data.delivery == 2
                    ? 'Адрес: <b>' +
                      address.street +
                      ' ' +
                      address.home +
                      (address.entrance ? ' подъезд ' + address.entrance : '') +
                      (address.floor ? ' этаж ' + address.floor : '') +
                      (address.apartment ? ' кв ' + address.apartment : '') +
                      (address.code ? ' код ' + address.code : '') +
                      '</b><br />'
                    : '') +
                'Время готовки: <b>' +
                (data.time == 1 || !data.time
                    ? 'Сейчас'
                    : (data.datevalue ? 'К ' + data.datevalue : '') + ' ' + (data.timevalue ? data.timevalue : '')) +
                '</b><br />' +
                (data.comment ? 'Комментарий: ' + data.comment + '<br />' : '') +
                'Товары:' +
                data.products.map(
                    (item) =>
                        '<br /><b>' +
                        item.title +
                        '</b> - <b>' +
                        item.count +
                        '</b> шт - <b>' +
                        item.price * item.count +
                        '</b> р' +
                        (item.dop
                            ? '<br />(' +
                              item.dop.map(
                                  (dop) =>
                                      '<b>' + dop.title + '</b> - <b>' + 1 + '</b> шт - <b>' + dop.price + '</b> р'
                              ) +
                              ')'
                            : '')
                ) +
                (data.sale && data.sale.total > 0
                    ? '<br />' + (data.sale.text ? data.sale.text : 'Скидка: ') + ' -' + data.sale.total + ' руб'
                    : '') +
                '<br />Итого: <b>' +
                data.total +
                ' руб</b>'

            if (data.payment == 'ecard') {
                await Aiko.sendOrder(data, address, true).then(async (aikoStatus) => {
                    if (aikoStatus && aikoStatus.status) {
                        await Order.create({
                            name: data.name,
                            phone: data.phone,
                            user: data.user ? data.user : 0,
                            payment: data.payment,
                            delivery: data.delivery,
                            time:
                                data.time == 1 || !data.time
                                    ? ''
                                    : data.timevalue && data.datevalue
                                    ? data.datevalue + ' ' + data.timevalue + ':00'
                                    : '',
                            products: JSON.stringify(data.products),
                            size: data.size ? data.size : '',
                            street: address.street ? address.street : '',
                            home: address.home ? address.home : '',
                            entrance: address.entrance ? address.entrance : '',
                            code: address.code ? address.code : '',
                            floor: address.floor ? address.floor : '',
                            apartment: address.apartment ? address.apartment : '',
                            total: data.total,
                            comment: data.comment ? data.comment : '',
                            sale: data.sale ? JSON.stringify(data.sale) : '',
                        })
                            .then(async (result) => {
                                if (result && result.id) {
                                    if (data.saveaddress && data.user && data.delivery == 2) {
                                        await data.create({
                                            user: data.user,
                                            name: address.street ? address.street : '',
                                            street: address.street ? address.street : '',
                                            home: address.home ? address.home : '',
                                            entrance: address.entrance ? address.entrance : '',
                                            code: address.code ? address.code : '',
                                            floor: address.floor ? address.floor : '',
                                            apartment: address.apartment ? address.apartment : '',
                                        })
                                    }
                                    let products = []
                                    data.products &&
                                        data.products.map((item) => {
                                            item.attribute && item.size
                                                ? item.attribute[0]
                                                      .filter((e) => e.id == item.size.id && e)
                                                      .map((modifer) => {
                                                          products.push({
                                                              Name:
                                                                  item.title +
                                                                  (modifer.title ? ' ' + modifer.title : ''),
                                                              Quantity: Number(modifer.count)
                                                                  ? Number(modifer.count)
                                                                  : 1,
                                                              Amount:
                                                                  Number(modifer.price) *
                                                                  (item.count ? Number(item.count) : 1) *
                                                                  100,
                                                              Price: modifer.price * 100,
                                                              Tax: 'none',
                                                          })
                                                      })
                                                : products.push({
                                                      Name:
                                                          item.title +
                                                          (item.attribute != null &&
                                                          item.attribute.length > 0 &&
                                                          item.attribute[0][0] &&
                                                          item.attribute[0][0].title
                                                              ? ' ' + item.attribute[0][0].title
                                                              : ' '),
                                                      Quantity: Number(item.count) ? Number(item.count) : 1,
                                                      Amount:
                                                          item.attribute != null &&
                                                          item.attribute.length > 0 &&
                                                          item.attribute[0][0]
                                                              ? Number(item.attribute[0][0].price) *
                                                                (item.count ? Number(item.count) : 1) *
                                                                100
                                                              : item.price *
                                                                (item.count ? Number(item.count) : 1) *
                                                                100,
                                                      Price:
                                                          item.attribute != null &&
                                                          item.attribute.length > 0 &&
                                                          item.attribute[0][0]
                                                              ? Number(item.attribute[0][0].price) * 100
                                                              : item.price * 100,
                                                      Tax: 'none',
                                                  })

                                            if (item.dop) {
                                                item.dop.map((e) =>
                                                    products.push({
                                                        Name: e.title,
                                                        Quantity: e.count ? Number(e.count) : 1,
                                                        Amount:
                                                            Number(e.price) * (e.count ? Number(e.count) : 1) * 100,
                                                        Price: e.price * 100,
                                                        Tax: 'none',
                                                    })
                                                )
                                            }
                                        })
                                    if (data.delivery == 2 && data.total < 700) {
                                        products.push({
                                            Name: 'Доставка',
                                            Quantity: 1,
                                            Amount: 150 * 100,
                                            Price: 150 * 100,
                                            Tax: 'none',
                                        })
                                    }

                                    const send = JSON.stringify({
                                        TerminalKey: process.env.TINKOFF_KEY,
                                        OrderId: result.id,
                                        Amount: data.total * 100,
                                        SuccessURL: process.env.TINKOFF_SUCCESS,
                                        FailURL: process.env.TINKOFF_ERROR,
                                        Description: 'Заказ на сайте Totos',
                                        PayType: 'O',
                                        Receipt: {
                                            Phone: data.phone,
                                            Taxation: 'patent',
                                            Items: products ? products : [],
                                        },
                                    })

                                    await axios
                                        .post('https://securepay.tinkoff.ru/v2/Init', send, {
                                            headers: {
                                                'Content-Type': 'application/json',
                                            },
                                        })
                                        .then((response) => {
                                            if (response.data) {
                                                console.log(response.data)
                                                Order.update(
                                                    {paymentId: response.data.PaymentId},
                                                    {where: {id: result.id}}
                                                )

                                                return res.json({
                                                    status: true,
                                                    message: 'Оплатите заказ',
                                                    data: response.data,
                                                })
                                            } else {
                                                return res.json({status: false, message: 'Неизвестная ошибка'})
                                            }
                                        })
                                        .catch((e) => res.json({status: false, message: 'Неизвестная ошибка'}))
                                }
                            })
                            .catch((err) => res.json({status: false, message: 'Неизвестная ошибка'}))
                    }
                })
            } else {
                await Aiko.sendOrder(data, address, false)
                    .then(async (aikoStatus) => {
                        if (aikoStatus && aikoStatus.status) {
                            await Order.create({
                                name: data.name,
                                phone: data.phone,
                                user: data.user ? data.user : 0,
                                payment: data.payment,
                                delivery: data.delivery,
                                time:
                                    data.time == 1
                                        ? ''
                                        : data.timevalue && data.datevalue
                                        ? data.datevalue + ' ' + data.timevalue + ':00'
                                        : '',
                                products: JSON.stringify(data.products),
                                size: data.size ? data.size : '',
                                street: address.street ? address.street : '',
                                home: address.home ? address.home : '',
                                entrance: address.entrance ? address.entrance : '',
                                code: address.code ? address.code : '',
                                floor: address.floor ? address.floor : '',
                                apartment: address.apartment ? address.apartment : '',
                                total: data.total,
                                comment: data.comment ? data.comment : '',
                                sale: data.sale ? JSON.stringify(data.sale) : '',
                            })
                                .then(async (result) => {
                                    if (result && result.id) {
                                        // if (data.saveaddress && data.user && data.delivery == 2) {
                                        //     await Address.create({
                                        //         user: data.user,
                                        //         name: (address.street) ? address.street : '',
                                        //         street: (address.street) ? address.street : '',
                                        //         home: (address.home) ? address.home : '',
                                        //         entrance: (address.entrance) ? address.entrance : '',
                                        //         code: (address.code) ? address.code : '',
                                        //         floor: (address.floor) ? address.floor : '',
                                        //         apartment: (address.apartment) ? address.apartment : '',
                                        //     });
                                        // }

                                        await Mail.send(text)

                                        if (data.email) {
                                            await Mail.send(text, data.email)
                                        }

                                        return res.json({status: true, message: 'Заявка успешно отправлена'})
                                    }
                                })
                                .catch((err) => console.error(err))
                        } else if (aikoStatus) {
                            return res.json({
                                status: false,
                                message: aikoStatus.message ? aikoStatus.message : 'Ошибка при создании заказа',
                            })
                        }
                    })
                    .catch((error) => {
                        console.error(error)
                        return res.json({status: false, message: 'Ошибка при создании заказа', data: error})
                    })
            }
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async webhook(req, res, next) {
        var body = req.body
        if (body && body.OrderId && body.PaymentId && body.Status == 'CONFIRMED') {
            var data = await Order.findOne({where: {paymentId: String(body.PaymentId)}})
            if (data && data.status === 0) {
                await Order.update(
                    {status: 1, sale: JSON.stringify(body)},
                    {where: {paymentId: String(body.PaymentId)}}
                )

                var address = {
                    street: data.street ? data.street : '',
                    home: data.home ? data.home : '',
                    entrance: data.entrance ? data.entrance : '',
                    code: data.code ? data.code : '',
                    floor: data.floor ? data.floor : '',
                    apartment: data.apartment ? data.apartment : '',
                }

                await Aiko.sendOrder(data, address, false)
                    .then((e) => console.log(e))
                    .catch((e) => console.error(e))

                var payment = ''
                if (data.payment == 'card') {
                    payment = 'Банковской картой'
                } else if (data.payment == 'ecard') {
                    payment = 'Онлайн'
                } else {
                    payment = 'Наличными'
                }
                var text =
                    'Имя: <b>' +
                    data.name +
                    '</b><br />' +
                    'Телефон: <b>+' +
                    data.phone +
                    '</b><br />' +
                    'Оплаты: <b>' +
                    payment +
                    '</b><br />' +
                    'Доставка/Самовывоз: <b>' +
                    (data.delivery == 1 ? 'Самовывоз' : 'Доставка') +
                    '</b><br />' +
                    (data.delivery == 2
                        ? 'Адрес: <b>' +
                          address.street +
                          ' ' +
                          address.home +
                          (address.entrance ? ' подъезд ' + address.entrance : '') +
                          (address.floor ? ' этаж ' + address.floor : '') +
                          (address.apartment ? ' кв ' + address.apartment : '') +
                          (address.code ? ' код ' + address.code : '') +
                          '</b><br />'
                        : '') +
                    'Время готовки: <b>' +
                    (data.time == 1 || !data.time
                        ? 'Сейчас'
                        : (data.datevalue ? 'К ' + data.datevalue : '') +
                          ' ' +
                          (data.timevalue ? data.timevalue : '')) +
                    '</b><br />' +
                    (data.comment ? 'Комментарий: ' + data.comment + '<br />' : '') +
                    'Товары:' +
                    (data.products && data.products.length > 0
                        ? JSON.parse(data.products).map(
                              (item) =>
                                  '<br /><b>' +
                                  item.title +
                                  '</b> - <b>' +
                                  item.count +
                                  '</b> шт - <b>' +
                                  item.price * item.count +
                                  '</b> р' +
                                  (item.dop
                                      ? '<br />(' +
                                        item.dop.map(
                                            (dop) =>
                                                '<b>' +
                                                dop.title +
                                                '</b> - <b>' +
                                                1 +
                                                '</b> шт - <b>' +
                                                dop.price +
                                                '</b> р'
                                        ) +
                                        ')'
                                      : '')
                          )
                        : null) +
                    (data.sale && data.sale.total > 0
                        ? '<br />' + (data.sale.text ? data.sale.text : 'Скидка: ') + ' -' + data.sale.total + ' руб'
                        : '') +
                    '<br />Итого: <b>' +
                    data.total +
                    ' руб</b>'

                await Mail.send(text)
                    .then((e) => console.log(e))
                    .catch((e) => console.error(e))
                if (data.email) {
                    await Mail.send(text, data.email)
                }
                console.log('Оплата прошла успешно, заявка отправлена')
            }
        }
        return res.json('OK')
    }
    async getOrders(req, res) {
        const {user} = req.body
        if (user) {
            const orders = await Order.findAll({where: {user}})
            return res.json(orders)
        } else {
            return res.json('Ошибка при получении истории заказов')
        }
    }
    async promo(req, res) {
        const {user, code, total} = req.body
        if (code) {
            const info = await Promo.findOne({where: {code, status: 1}})
            if (info) {
                if (info.authUser === 1 && !user) {
                    return res.json({status: 0, text: 'Сначала авторизуйтесь'})
                }
                if (info.minTotal > total) {
                    return res.json({status: 0, text: 'Минимальная сумма заказа ' + info.minTotal})
                }
                if (info.maxTotal !== 0 && info.maxTotal < total) {
                    return res.json({status: 0, text: 'Максимальная сумма заказа ' + info.minTotal})
                }
                if (info.maxOrder !== 0) {
                    const orderPromo = await Order.findOne({where: {user, promo: code}})
                    if (orderPromo) {
                        return res.json({status: 0, text: 'Вы уже использовали данный промокод'})
                    }
                }
                return res.json({status: 1, text: 'Промокод применен', data: info})
            } else {
                return res.json({status: 0, text: 'Промокода не существует'})
            }
        } else {
            return res.json({status: 0, text: 'Введите промокод'})
        }
    }
    async getStreets(req, res) {
        let streets = await Street.findAndCountAll({where: {status: 1}, order: [['id', 'ASC']]})
        return res.json(streets)
    }
}

module.exports = new OrderController()

const axios = require('axios')
const { Order, Address, Promo, Street } = require('../models/models')
const Telegram = require('../components/telegram')
const ApiError = require('../error/ApiError')

class OrderController {
    async create(req, res, next) {
        try {
            var data = req.body
            if (!data) {
                return res.json('Нет данных для заказа')
            }
            if (!data.phone || data.phone.length < 10) {
                return res.json('Введите номер телефона')
            }
            var address = {
                full: (data.address && data.address.full) ? data.address.full : data.full,
                street: (data.address && data.address.street) ? data.address.street : data.street,
                home: (data.address && data.address.home) ? data.address.home : data.home,
                entrance: (data.address && data.address.entrance) ? data.address.entrance : data.entrance,
                code: (data.address && data.address.code) ? data.address.code : data.code,
                floor: (data.address && data.address.floor) ? data.address.floor : data.floor,
                apartment: (data.address && data.address.apartment) ? data.address.apartment : data.apartment
            }

            data.phone = data.phone.replace(/[^\d]/g, '')

            await Order.create({
                name: data.name,
                phone: data.phone,
                user: (data.user) ? data.user : 0,
                payment: data.payment,
                delivery: data.delivery,
                time: data.time == 1 ? 'Как можно скорее' : 'Приготовить к ' + data.timevalue ? data.timevalue : '',
                products: JSON.stringify(data.products),
                street: (address.street) ? address.street : '',
                home: (address.home) ? address.home : '',
                entrance: (address.entrance) ? address.entrance : '',
                code: (address.code) ? address.code : '',
                floor: (address.floor) ? address.floor : '',
                apartment: (address.apartment) ? address.apartment : '',
                total: data.total,
                comment: (data.comment) ? data.comment : '',
                sale: (data.sale) ? JSON.stringify(data.sale) : ''
            }).then(async result => {
                if (result && result.id) {
                    if (data.saveaddress && data.user && data.delivery == 2) {
                        await Address.create({
                            user: data.user,
                            name: (address.street) ? address.street : '',
                            full: (address.full) ? address.full : '',
                            street: (address.street) ? address.street : '',
                            home: (address.home) ? address.home : '',
                            entrance: (address.entrance) ? address.entrance : '',
                            code: (address.code) ? address.code : '',
                            floor: (address.floor) ? address.floor : '',
                            apartment: (address.apartment) ? address.apartment : '',
                        });
                    }
                    var payment = ''
                    if (data.payment == 'card') {
                        payment = 'Банковской картой'
                    } else if (data.payment == 'online') {
                        payment = 'Онлайн'
                    } else {
                        payment = 'Наличными'
                    }
                    let text = '<b>№' + result.id + '</b>\n' +
                        'Имя: <b>' + data.name + '</b>\n' +
                        'Телефон: <b>' + data.phone + '</b>\n' +
                        'Оплаты: <b>' + payment + '</b>\n' +
                        'Доставка/Самовывоз: <b>' + (data.delivery == 1 ? 'Самовывоз' : 'Доставка') + '</b>\n' +
                        (data.delivery == 2 ? 'Адрес: <b>' + address.street + ' ' + address.home + ((address.entrance) ? ' подъезд ' + address.entrance : '') + ((address.floor) ? ' этаж ' + address.floor : '') + ((address.apartment) ? ' кв ' + address.apartment : '') + ((address.code) ? ' код ' + address.code : '') + '</b>\n' : '') +
                        'Время готовки: <b>' + ((data.time == 1) ? 'Сейчас' : 'К ' + (data.timevalue ? data.timevalue : '')) + '</b>\n' +
                        ((data.comment) ? 'Комментарий: ' + data.comment + '\n' : '') +
                        'Товары:' +
                        data.products.map(item => '\n<b>' + item.title + '</b> - <b>' + item.count + '</b> шт - <b>' + (item.price * item.count) + '</b> р' + ((item.dop) ? '\n(' + item.dop.map(dop => '<b>' + dop.title + '</b> - <b>' + 1 + '</b> шт - <b>' + dop.price + '</b> р') + ')' : '')) +
                        ((data.sale && data.sale.total > 0) ? '\n' + ((data.sale.text) ? data.sale.text : 'Скидка: ') + ' -' + data.sale.total + ' руб' : '') +
                        '\nИтого: <b>' + data.total + ' руб</b>';

                    if (data.payment == 'online') {

                        const send = JSON.stringify({
                            TerminalKey: process.env.TINKOFF_KEY,
                            OrderId: result.id,
                            Amount: data.total * 100,
                            SuccessURL: process.env.TINKOFF_SUCCESS,
                            FailURL: process.env.TINKOFF_ERROR,
                            Description: 'Заказ на сайте Bizon food',
                            PayType: 'O'
                        })

                        await axios.post('https://securepay.tinkoff.ru/v2/Init', send, {
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        })
                            .then(response => {
                                if (response.data) {

                                    Order.update({ paymentId: response.data.PaymentId }, { where: { id: result.id } })

                                    res.json(response.data)
                                } else {
                                    res.json('Неизвестная ошибка')
                                }
                            })
                            .catch(e => res.json(e))
                    } else {
                        Telegram.send(text)
                        //Aiko.sendOrder(data)

                        return res.json(true)
                    }
                } else {
                    return res.json('Ошибка при создании заявки')
                }
            })
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }
    async webhook(req, res) {
        var body = req.body
        if (body.OrderId && body.PaymentId && body.Status == 'CONFIRMED') {
            var data = await Order.findOne({ where: { paymentId: String(body.PaymentId) } })
            if (data && data.status === 0) {
                await Order.update({ status: 1, sale: JSON.stringify(body) }, { where: { paymentId: String(body.PaymentId) } })

                var address = {
                    full: (data.full) ? data.full : '',
                    street: (data.street) ? data.street : '',
                    home: (data.home) ? data.home : '',
                    entrance: (data.entrance) ? data.entrance : '',
                    code: (data.code) ? data.code : '',
                    floor: (data.floor) ? data.floor : '',
                    apartment: (data.apartment) ? data.apartment : ''
                }
                var payment = ''
                if (data.payment == 'card') {
                    payment = 'Банковской картой'
                } else if (data.payment == 'online') {
                    payment = 'Онлайн'
                } else {
                    payment = 'Наличными'
                }
                let text = '<b>№' + data.id + '</b>\n' +
                    'Имя: <b>' + data.name + '</b>\n' +
                    'Телефон: <b>' + data.phone + '</b>\n' +
                    'Оплаты: <b>' + payment + '</b>\n' +
                    'Доставка/Самовывоз: <b>' + (data.delivery == 1 ? 'Самовывоз' : 'Доставка') + '</b>\n' +
                    (data.delivery == 2 ? 'Адрес: <b>' + address.street + ' ' + address.home + (address.entrance ? ' подъезд ' + address.entrance : '') + (address.floor ? ' этаж ' + address.floor : '') + (address.apartment ? ' кв ' + address.apartment : '') + (address.code ? ' код ' + address.code : '') + '</b>\n' : '') +
                    'Время готовки: <b>' + (data.time ? data.time : '') + '</b>\n' +
                    (data.comment ? 'Комментарий: ' + data.comment + '\n' : '') +
                    'Товары:' +
                    JSON.parse(data.products).map(item => '\n<b>' + item.title + '</b> - <b>' + item.count + '</b> шт - <b>' + (item.price * item.count) + '</b> р' + (item.dop ? '\n(' + item.dop.map(dop => '<b>' + dop.title + '</b> - <b>' + 1 + '</b> шт - <b>' + dop.price + '</b> р') + ')' : '')) +
                    ((data.sale && data.sale.total > 0) ? '\n' + (data.sale.text ? data.sale.text : 'Скидка: ') + ' -' + data.sale.total + ' руб' : '') +
                    '\nИтого: <b>' + data.total + ' руб</b>';

                Telegram.send(text)

                return res.json('OK')
            }
        }
    }
    async getOrders(req, res) {
        const { user } = req.body
        if (user) {
            const orders = await Order.findAll({ where: { user } })
            return res.json(orders)
        } else {
            return res.json('Ошибка при получении истории заказов')
        }
    }
    async promo(req, res) {
        const { user, code, total } = req.body
        if (code) {
            const info = await Promo.findOne({ where: { code, status: 1 } })
            if (info) {
                if (info.authUser === 1 && !user) {
                    return res.json({ status: 0, text: 'Сначала авторизуйтесь' })
                }
                if (info.minTotal > total) {
                    return res.json({ status: 0, text: 'Минимальная сумма заказа ' + info.minTotal })
                }
                if (info.maxTotal !== 0 && info.maxTotal < total) {
                    return res.json({ status: 0, text: 'Максимальная сумма заказа ' + info.minTotal })
                }
                if (info.maxOrder !== 0) {
                    const orderPromo = await Order.findOne({ where: { user, promo: code } })
                    if (orderPromo) {
                        return res.json({ status: 0, text: 'Вы уже использовали данный промокод' })
                    }
                }
                return res.json({ status: 1, text: 'Промокод применен', data: info })
            } else {
                return res.json({ status: 0, text: 'Промокода не существует' })
            }
        } else {
            return res.json({ status: 0, text: 'Введите промокод' })
        }
    }
    async getStreets(req, res) {
        let streets = await Street.findAndCountAll({ order: [['id', 'ASC']] })
        return res.json(streets)
    }
}

module.exports = new OrderController()

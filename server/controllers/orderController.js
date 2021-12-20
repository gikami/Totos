const axios = require('axios')
const { Order } = require('../models/models')
const Telegram = require('../components/telegram')
const ApiError = require('../error/ApiError')

class OrderController {
    async create(req, res, next) {
        try {
            const data = req.body
            if (!data) {
                return res.json('Нет данных для заказа')
            }
            await Order.create({
                name: data.name,
                phone: data.phone,
                payment: data.payment,
                delivery: data.delivery,
                time: data.time == 1 ? 'Как можно скорее' : 'Приготовить к ' + data.timevalue ? data.timevalue : '',
                products: JSON.stringify(data.products),
                street: data.street,
                home: data.home,
                entrance: data.entrance,
                code: data.code,
                floor: data.floor,
                apartment: data.apartment,
                total: data.total,
                comment: data.comment
            }).then(async result => {
                if (result && result.id) {
                    if (data.payment == 'online') {
                        const login = process.env.SBERBANK_LOGIN
                        const password = process.env.SBERBANK_PASSWORD
                        const url_success = process.env.SBERBANK_SUCCESS
                        const url_serror = process.env.SBERBANK_ERROR
                        var send = new URLSearchParams({
                            userName: login,
                            password: password,
                            orderNumber: result.id,
                            amount: data.total * 100,
                            returnUrl: url_success,
                            failUrl: url_serror,
                            description: 'Заказ на сайте Bizon food'
                        })
                        const sendData = await axios.get('https://3dsec.sberbank.ru/payment/rest/register.do?' + send.toString())
                        if (sendData && sendData.data.orderId) {
                            await result.update({ paymentId: sendData.data.orderId })
                            return res.json(sendData.data)
                        }

                    } else {

                        if (data.payment == 'card') {
                            var payment = 'Банковской картой'
                        } else {
                            var payment = 'Наличными'
                        }
                        let text = 'Номер заказа: <b>' + result.id + '</b>\n' +
                            'Имя клиента: <b>' + data.name + '</b>\n' +
                            'Номер телефона: <b>' + data.phone + '</b>\n' +
                            'Тип оплаты: <b>' + payment + '</b>\n' +
                            'Тип (Доставка/Самовывоз): <b>' + (data.delivery == 1 ? 'Самовывоз' : 'Доставка') + '</b>\n' +
                            (data.delivery == 2 ? 'Адрес доставки: <b>' + data.street + ' ' + data.home + ((data.entrance) ? ' подъезд ' + data.entrance : '') + ((data.floor) ? ' этаж ' + data.floor : '') + ((data.apartment) ? ' кв ' + data.apartment : '') + ((data.code) ? ' код ' + data.code : '') + '</b>\n' : '') +
                            'Время приготовления: <b>' + ((data.time == 1) ? 'Как можно скорее' : 'Приготовить к ' + (data.timevalue ? data.timevalue : '')) + '</b>\n' +
                            'Товары:' +
                            data.products.map(item => '\n<b>' + item.title + '</b> кол-во: <b>' + item.count + '</b> сумма: <b>' + (item.price * item.count) + ' руб</b>') +
                            '\nИтого: <b>' + data.total + ' руб</b>';

                        Telegram.send(text)
                        Aiko.sendOrder(data)

                        return res.json((send) ? send : false)
                    }
                } else {
                    return res.json('Ошибка при создании заявки')
                }
            })
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }

    }
    async webhook(req, res, next) {
        let body = req.query
        if (body.status == 1 && body.operation == 'deposited') {
            await Order.update({ status: 1 }, { where: { id: body.orderNumber } })
            return res.json('Данные обновлены')
        } else {
            return res.json('Ошибка')
        }
    }
}

module.exports = new OrderController()

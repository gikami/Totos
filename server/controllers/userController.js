const ApiError = require('../error/ApiError')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
var https = require('https')
var querystring = require('querystring')
const {User, Address, Order} = require('../models/models')
const Aiko = require('../components/aikoTransport')

const generateJwt = (user, address = false, order = false) => {
    return jwt.sign(
        {
            id: user.id,
            email: user.email,
            password: user.password,
            firstname: user.firstname,
            lastname: user.lastname,
            phone: user.phone,
            birthday_day: user.birthday_day,
            birthday_month: user.birthday_month,
            sex: user.sex,
            point: user.point,
            date: user.date,
            status: user.status,
            role: user.role,
            address: address,
            order: order,
        },
        process.env.SECRET_KEY,
        {expiresIn: '365d'}
    )
}
const sendSms = (phone, text) => {
    if (text.length > 0 && phone.length > 10) {
        var from = 'TotosPizza'
        var apikey = 'TIG3TH7716Q0WP1861K53Q347PT3B6ZFH3W58YIEHQL0918EBS2M38X4Q6LNGCXN'
        var uri = [
            'https://smspilot.ru/api.php',
            '?send=',
            querystring.escape(text),
            '&to=',
            phone,
            '&from=',
            from,
            '&apikey=',
            apikey,
            '&format=json',
        ].join('')

        https
            .get(uri, (res) => {
                var str = ''
                res.on('data', (chunk) => {
                    str += chunk
                })

                res.on('end', () => {
                    var parsedData = JSON.parse(str)
                    return true
                })
            })
            .on('error', (err) => {
                console.log('ошибка сети ' + err)
                return false
            })
    } else {
        return false
    }
}

class UserController {
    async registration(req, res, next) {
        try {
            var {phone} = req.body

            if (!phone && phone.length < 10) {
                return next(ApiError.badRequest('Введите номер телефона'))
            }
            phone = phone.replace(/[^\d]/g, '')

            const user = await User.findOne({where: {phone}})

            if (user) {
                return next(ApiError.badRequest('Пользователь с таким номером уже существует'))
            }

            var chars = '0123456789abcdefghijklmnopqrstuvwxyz'
            var passwordLength = 5
            var password = ''

            for (var i = 0; i <= passwordLength; i++) {
                var randomNumber = Math.floor(Math.random() * chars.length)
                password += chars.substring(randomNumber, randomNumber + 1)
            }

            const heshPassword = await bcrypt.hash(password, 5)
            const getUser = await User.create({phone, password: heshPassword})

            if (getUser) {
                sendSms(phone, 'Ваш пароль ' + password + ' от профиля на сайте totospizza.ru')
            }

            const token = generateJwt(getUser)

            return res.json(token)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }
    async newPassword(req, res, next) {
        try {
            var {phone} = req.body

            if (!phone && phone.length < 10) {
                return next(ApiError.badRequest('Введите номер телефона'))
            }
            phone = phone.replace(/[^\d]/g, '')

            const user = await User.findOne({where: {phone}})

            if (!user) {
                return next(ApiError.badRequest('Пользователя с таким номером не существует'))
            }

            var chars = '0123456789abcdefghijklmnopqrstuvwxyz'
            var passwordLength = 5
            var password = ''

            for (var i = 0; i <= passwordLength; i++) {
                var randomNumber = Math.floor(Math.random() * chars.length)
                password += chars.substring(randomNumber, randomNumber + 1)
            }

            const heshPassword = await bcrypt.hash(password, 5)

            await user.update({password: heshPassword})
            await user.save()

            sendSms(phone, 'Ваш новый пароль ' + password + ' от профиля на сайте totospizza.ru')

            return res.json(true)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }
    async addAddress(req, res, next) {
        try {
            let {name, full, street, home, floor, apartment, entrance, code} = req.body
            await Address.create({user: req.user.id, name, full, street, home, floor, apartment, entrance, code})
            const addressAll = await Address.findAll({where: {user: req.user.id}})
            const token = generateJwt(req.user, addressAll)
            return res.json({token})
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }
    async editAddress(req, res, next) {
        try {
            let data = req.body
            const address = await Address.findOne({where: {id: data.id, user: req.user.id}})
            if (!address) {
                return next(ApiError.internal('Такого адреса нет'))
            }
            await address.update(data)
            await address.save()
            const addressAll = await Address.findAll({where: {user: req.user.id}})
            const token = generateJwt(req.user, addressAll)
            return res.json({token})
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }
    async deleteAddress(req, res, next) {
        try {
            let data = req.body
            const address = await Address.findOne({where: {id: data.id, user: req.user.id}})
            if (!address) {
                return next(ApiError.internal('Такого адреса нет'))
            }
            await address.destroy()
            const addressAll = await Address.findAll({where: {user: req.user.id}})
            const token = generateJwt(req.user, addressAll)
            return res.json({token})
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }
    async login(req, res, next) {
        var {phone, password} = req.body
        if (!phone || !password) {
            return next(ApiError.internal('Введите номер телефона и пароль'))
        }
        phone = phone.replace(/[^\d]/g, '')
        const user = await User.findOne({where: {phone}})
        if (!user) {
            return next(ApiError.internal('Пользователь не найден'))
        }

        let comparePassword = bcrypt.compareSync(password, user.password)
        if (!comparePassword) {
            return next(ApiError.internal('Указан неверный пароль'))
        }
        const address = await Address.findAll({where: {user: user.id}})
        const token = generateJwt(user, address ? address : false)
        return res.json({token})
    }
    async edit(req, res, next) {
        try {
            var data = req.body
            const user = await User.findOne({where: {id: data.id, password: data.password}})

            if (!user) {
                return next(ApiError.internal('Пользователь не найден'))
            }
            if (data.phone) {
                data.phone = data.phone.replace(/[^\d]/g, '')
            }
            await user.update(data)
            await user.save()

            const address = await Address.findAll({where: {user: user.id}})
            const token = generateJwt(user, address)
            return res.json({token})
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }
    async updatePoint(req, res) {
        const {id} = req.user
        const user = await User.findOne({where: {id}})
        if (user) {
            let data = await Aiko.getUser(user.phone)
            if (data && data.status) {
                await User.update({point: Number(data.data.balance)}, {where: {id}})
            }
            const address = await Address.findAll({where: {user: user.id}})
            const token = generateJwt(user, address)
            return res.json({token})
        }
    }
    async check(req, res) {
        const {id} = req.user
        const address = await Address.findAll({where: {user: id}})
        const order = await Order.findOne({where: {user: id}})
        const token = generateJwt(req.user, address ? address : false, order ? order : false)
        return res.json({token})
    }
}

module.exports = new UserController()

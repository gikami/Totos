const ApiError = require('../error/ApiError');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { User, Cart, Address } = require('../models/models')

const generateJwt = (user, address = false) => {
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
            address: address
        },
        process.env.SECRET_KEY,
        { expiresIn: '24h' }
    )
}

class UserController {
    async registration(req, res, next) {
        const { email, password, role } = req.body
        if (!email || !password) {
            return next(ApiError.badRequest('Некорректный email или password'))
        }
        const candidate = await User.findOne({ where: { email } })
        if (candidate) {
            return next(ApiError.badRequest('Пользователь с таким email уже существует'))
        }
        const hashPassword = await bcrypt.hash(password, 5)
        const user = await User.create({ email, role, password: hashPassword })
        const cart = await Cart.create({ userId: user.id })
        const token = generateJwt(user)
        return res.json({ token })
    }
    async addAddress(req, res, next) {
        try {
            let { name, region, street, home, floor, apartament, entrance, code } = req.body
            const address = await Address.create({ user: req.user.id, name, region, street, home, floor, apartament, entrance, code });
            const addressAll = await Address.findAll({ where: { user: req.user.id } })
            const token = generateJwt(req.user, addressAll)
            return res.json({ token })
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }
    async editAddress(req, res, next) {
        try {
            let data = req.body
            const address = await Address.findOne({ where: { id: data.id, user: req.user.id } })
            if (!address) {
                return next(ApiError.internal('Такого адреса нет'))
            }
            await address.update(data)
            await address.save()
            const addressAll = await Address.findAll({ where: { user: req.user.id } })
            const token = generateJwt(req.user, addressAll)
            return res.json({ token })

        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }
    async deleteAddress(req, res, next) {
        try {
            let data = req.body
            const address = await Address.findOne({ where: { id: data.id, user: req.user.id } })
            if (!address) {
                return next(ApiError.internal('Такого адреса нет'))
            }
            await address.destroy();
            const addressAll = await Address.findAll({ where: { user: req.user.id } })
            const token = generateJwt(req.user, addressAll)
            return res.json({ token })

        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }
    async login(req, res, next) {
        const { email, password } = req.body
        const user = await User.findOne({ where: { email } })
        const address = await Address.findAll({ where: { user: user.id } })
        if (!user) {
            return next(ApiError.internal('Пользователь не найден'))
        }
        let comparePassword = bcrypt.compareSync(password, user.password)
        if (!comparePassword) {
            return next(ApiError.internal('Указан неверный пароль'))
        }
        const token = generateJwt(user, (address) ? address : false)
        return res.json({ token })
    }
    async edit(req, res, next) {
        try {
            const data = req.body
            const user = await User.findOne({ where: { email: data.email, password: data.password } })

            if (!user) {
                return next(ApiError.internal('Пользователь не найден'))
            }
            await user.update(data)
            await user.save()

            const address = await Address.findAll({ where: { user: user.id } })
            const token = generateJwt(user, address)
            return res.json({ token })
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async check(req, res) {
        const { id } = req.user
        const address = await Address.findAll({ where: { user: id } })
        const token = generateJwt(req.user, (address) ? address : false)
        return res.json({ token })
    }
}

module.exports = new UserController()

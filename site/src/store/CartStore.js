import { makeAutoObservable } from 'mobx'

export default class CartStore {
    constructor() {
        this._cart = []
        this._total = 0
        this._size = 1
        this._sale = { text: '', total: 0 }
        this._promo = { text: '', total: 0 }
        this._deliveryMinDelivery = 700
        this._deliveryMinPrice = 450
        this._deliveryPrice = 150
        this._giftMinPrice = []
        this._gift = []
        makeAutoObservable(this)
        this.totalSum()
    }
    totalSum() {
        let data = localStorage.getItem('cart')
        if (data) {
            this._total = 0
            this._cart = JSON.parse(data)
            this._cart.map((item) => {
                if (item) {
                    this._total += item.price * item.count
                }
            })
        }
    }
    setCart(product) {
        if (!product || 0 === product.length) {
            return false
        }
        product.count = 1
        let id_yes = Object.keys(this._cart).find((ids) => {
            let cart = this._cart[ids]
            cart.count = 1
            return JSON.stringify(cart) === JSON.stringify(product)
        })

        if (product.gift) {
            if (id_yes) {
                this._cart.splice(id_yes, 1)
            } else {
                product.count = 1
                this._cart.push(product)
            }
        } else {
            if (id_yes) {
                this._cart[id_yes].count += 1
            } else if (product) {
                this._cart.push(product)
            }
        }

        localStorage.setItem('cart', JSON.stringify(this._cart))
        this.totalSum()
    }
    setPromo(promo) {
        if (promo) {
            this._promo = promo
            localStorage.setItem('promo', JSON.stringify(this._promo))
            this.totalSum()
        }
    }
    removePromo() {
        this._promo = { text: '', total: 0 }
        localStorage.removeItem('promo')
        this.totalSum()
    }
    addGift(id) {
        this.setCart(this._gift[id])
    }
    getSize(product) {
        if (product) {
            let id_yes = Object.keys(this._cart).find((ids) => this._cart[ids].id === product.id)
            return id_yes && this._cart[id_yes].size ? this._cart[id_yes].size : 1
        }
    }
    setSize(product) {
        if (product) {
            let id_yes = Object.keys(this._cart).find((ids) => this._cart[ids].id === product.id)
            if (id_yes) {
                this._cart[id_yes].size = product.size
                this._cart[id_yes].price = product.price
                localStorage.setItem('cart', JSON.stringify(this._cart))
            }
            this.totalSum()
        }
    }
    getCartProductCount(product) {
        if (product) {
            let id_yes = Object.keys(this._cart).find(
                (ids) => this._cart[ids].id === product.id && this._cart[ids].price === product.price
            )
            if (id_yes) {
                return this._cart[id_yes].count
            }
        }
    }
    setCartCountPlus(product) {
        if (product) {
            let id_yes = Object.keys(this._cart).find(
                (ids) => this._cart[ids].id === product.id && this._cart[ids].price === product.price
            )
            if (id_yes) {
                this._cart[id_yes].count += 1
                localStorage.setItem('cart', JSON.stringify(this._cart))
            }
            this.totalSum()
        }
    }
    setCartCountMinus(product) {
        if (product) {
            let id_yes = Object.keys(this._cart).find(
                (ids) => this._cart[ids].id === product.id && this._cart[ids].price === product.price
            )
            if (id_yes) {
                if (this._cart[id_yes].count > 1) {
                    this._cart[id_yes].count -= 1
                } else if (this._cart.length > 0) {
                    this._cart.splice(id_yes, 1)
                }
                localStorage.setItem('cart', JSON.stringify(this._cart))
            }
            this.totalSum()
        }
    }
    setCartCount(product, num) {
        if (product && num) {
            product.count = num
            this._cart.push(product)
            localStorage.setItem('cart', JSON.stringify(this._cart))
            this.totalSum()
        }
    }
    checkCart(product, dop = false) {
        let id_yes =
            product && product.id ? Object.keys(this._cart).find((ids) => this._cart[ids].id === product.id) : false
        if (id_yes && dop) {
            let dop_yes = this._cart[id_yes].dop
                ? Object.keys(this._cart[id_yes].dop).find((ids) => this._cart[id_yes].dop[ids].id === dop.id)
                : false
            return {
                status: dop_yes ? true : false,
                count: id_yes && this._cart[id_yes] ? this._cart[id_yes].count : 1,
            }
        } else if (id_yes) {
            return {
                status: id_yes ? true : false,
                count: id_yes && this._cart[id_yes] ? this._cart[id_yes].count : 1,
            }
        } else {
            return { status: false, count: 1 }
        }
    }
    removeCartProduct(product) {
        if (product) {
            product.count = 1
            let id_yes = Object.keys(this._cart).find((ids) => {
                let cart = this._cart[ids]
                cart.count = 1
                return JSON.stringify(cart) === JSON.stringify(product)
            })
            if (id_yes) {
                this._cart.splice(id_yes, 1)
                localStorage.setItem('cart', JSON.stringify(this._cart))
            }
            this.totalSum()
        }
    }
    removeCartDop(product, dop) {
        if (product && dop) {
            product.count = 1
            let id_yes = Object.keys(this._cart).find((ids) => {
                let cart = this._cart[ids]
                cart.count = 1
                return JSON.stringify(cart) === JSON.stringify(product)
            })
            if (id_yes) {
                let dop_yes = this._cart[id_yes].dop
                    ? Object.keys(this._cart[id_yes].dop).find((ids) => this._cart[id_yes].dop[ids].id === dop.id)
                    : false
                if (dop_yes) {
                    this._cart[id_yes].dop.splice(dop_yes, 1)
                    localStorage.setItem('cart', JSON.stringify(this._cart))
                }
            }
            this.totalSum()
        }
    }
    removeAllCart() {
        this._cart = []
        localStorage.removeItem('cart')
        this.totalSum()
    }
    get cart() {
        return this._cart
    }
    get deliveryMinDelivery() {
        return this._deliveryMinDelivery
    }
    get deliveryMinPrice() {
        return this._deliveryMinPrice
    }
    get deliveryPrice() {
        return this._deliveryPrice
    }
    get total() {
        return this._total
    }
    get sale() {
        return this._sale
    }
    get promo() {
        return this._promo
    }
    giftMinPrice(id) {
        return this._giftMinPrice[id]
    }
    gift(id) {
        return this._gift[id]
    }
}

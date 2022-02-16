import { makeAutoObservable } from "mobx";

export default class CartStore {
    constructor() {
        this._cart = []
        this._total = 0
        this._size = 1
        this._sale = { text: '', total: 0 }
        this._promo = { text: '', total: 0 }
        this._deliveryMinPrice = 700
        this._deliveryPrice = 100
        this._giftMinPrice = [1000, 2500]
        this._gift = [
            {   
                "id": 1,
                "gift": true,
                "api_id": "4e542b7f-c7f7-4028-80cd-d698c1e0bc46",
                "title": "Подарок Пицца Маргарита",
                "price": 0,
                "category": "ad96ecc9-6f7a-4d71-8f11-19d87e883428",
                "param": '[{"gramm":false,"dopview":true,"type": "pizza"}]',
                "type": "gift",
                "weight": 0.556,
                "mini_descripion": "тесто, томатный соус,  сыр моцарелла, черные томаты, зелёный базелик, пармезан",
                "description": "Тонокое итальянское тесто с хрустящим бортиком, мой фирменный томаный соус, много нежной моцареллы, спелые сочные томаты черри и конечно же свежий зеленый базелик. Классика Италии, её стоит попробовать! P.S Твой 'Bizon'",
                "image": "63581e5d-e207-4976-a862-537e7f31a936.png",
                "count": 1
            },
            {
                "id": 2,
                "gift": true,
                "api_id": "25792c22-16f1-4519-ab3e-6c44533378f3",
                "title": "Подарок Ролл Филадельфия с авокадо",
                "price": 0,
                "category": "9502a4a8-31b8-4175-8f8c-baf3d45058bf",
                "param": '[{"gramm":true,"dopview":false,"type": "roll"}]',
                "type": "gift",
                "weight": 0.387,
                "mini_descripion": "Рис, сыр сливочный, лосось, авокадо, листья нори",
                "description": "Классический ролл, нежный сливочно-творожный сыр, спелый авокадо, свежий лосось. Ничего лишнего, это, то, что ты любишь! Простая и лучшая классика, спелый авокадо и рис. Ничего лишнего. P.S. Твой 'Bizon'",
                "image": "e3bb0358-f45c-4b9e-b087-0dc444174fb0.jpg",
                "count": 1
            },
            {
                "id": 3,
                "gift": true,
                "api_id": "9a2dae36-b05d-4e9b-9007-89a8942d7a71",
                "title": "Подарок Пицца ветчина с вешанками",
                "price": 0,
                "category": "ad96ecc9-6f7a-4d71-8f11-19d87e883428",
                "param": "[{\"gramm\":false,\"dopview\":true,\"type\": \"pizza\"}]",
                "type": "gift",
                "weight": 0.527,
                "mini_description": "тесто томаный соус,сыр моцарелла, ветчина из индейки, рваные вешенки. тимьяна, послевкусие",
                "description": "Тонокое итальянское тесто с хрустящим бортиком, мой фирменный томаный соус,нежнейшая моцарелла, ломтики ветчины из индейки, рваные вешенки. Сверху я решил кинуть пару ароматных веточек тимьяна, и несколько капель зеленого масла. Да ты прав аромат тимьяна придаст легкий шлейф и красочное послевкусие привычных ингридиентов. P.S Твой Bizon",
                "image": "1eb7e06a-b8fa-4d15-9d46-9ac894d05434.png",
                "count": 1
            },
        ]
        makeAutoObservable(this)
        this.totalSum()
    }
    totalSum() {
        let data = localStorage.getItem('cart')
        let pizza = { product: [], count: 0 }
        if (data) {
            this._total = 0
            this._cart = JSON.parse(data);
            this._cart.map(item => {
                if (item) {
                    let param = (item.param) ? JSON.parse(item.param)[0].type : false
                    if (param === 'pizza' && pizza.count < 3 && item.type !== 'gift') {
                        let id_yes = Object.keys(pizza.product).find(ids => pizza.product[ids].id === item.id)
                        if (id_yes) {
                            pizza.product.count = pizza.product.count + this._cart[id_yes].count
                        } else {
                            pizza.product.push(item)
                            pizza.count = pizza.count + item.count
                        }
                    }
                    this._total += item.price * item.count
                    if (item.dop) {
                        item.dop.map(dop => this._total += dop.price)
                    }
                }
            })
            if (pizza.count >= 3 && !Object.keys(this._cart).find(ids => this._cart[ids].type === 'gift')) {
                this._sale = { text: 'Скидка по акции - Третья пицца в подарок', total: Math.min(...pizza.product.map(item => item.price)) }
                this._total = this._total - this._sale.total
            } else {
                this._sale = { text: '', total: 0 }
            }
            let promo = localStorage.getItem('promo')
            if (promo) {
                this._promo = JSON.parse(promo)
                this._total = this._total - this._promo.price
            }
        }
    }
    setCart(product, dop = false) {
        if (!product || 0 === product.length) {
            return false
        }
        let id_yes = Object.keys(this._cart).find(ids => this._cart[ids].id === product.id);

        if (product.gift) {
            if (id_yes) {
                this._cart.splice(id_yes, 1);
            } else {
                product.count = 1
                this._cart.push(product)
            }
        } else if (dop) {
            if (id_yes) {
                if (this._cart[id_yes].dop) {
                    if (this._cart[id_yes].dop.length > 0) {
                        var dop_yes = Object.keys(this._cart[id_yes].dop).find(ids => this._cart[id_yes].dop[ids].id === dop.id)
                        if (dop_yes) {
                            this._cart[id_yes].dop = this._cart[id_yes].dop.filter((item) => item.id !== dop.id)
                        } else {
                            this._cart[id_yes].dop.push(dop)
                        }
                    } else {
                        this._cart[id_yes].dop = [dop]
                    }
                } else {
                    this._cart[id_yes].dop = [dop]
                }
            }
        } else {
            if (id_yes) {
                this._cart[id_yes].count += 1
            } else if (product) {
                product.count = 1
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
            let id_yes = Object.keys(this._cart).find(ids => this._cart[ids].id === product.id);
            return (id_yes && this._cart[id_yes].size) ? this._cart[id_yes].size : 1
        }
    }
    setSize(product) {
        if (product) {
            let id_yes = Object.keys(this._cart).find(ids => this._cart[ids].id === product.id);
            if (id_yes) {
                this._cart[id_yes].size = product.size
                this._cart[id_yes].price = product.price
                localStorage.setItem('cart', JSON.stringify(this._cart))
            }
            this.totalSum()
        }
    }
    setCartCountPlus(product) {
        if (product) {
            let id_yes = Object.keys(this._cart).find(ids => this._cart[ids].id === product.id);
            if (id_yes) {
                this._cart[id_yes].count += 1
                localStorage.setItem('cart', JSON.stringify(this._cart))
            }
            this.totalSum()
        }
    }
    setCartCountMinus(product) {
        if (product) {
            let id_yes = Object.keys(this._cart).find(ids => this._cart[ids].id === product.id);
            if (id_yes) {
                if (this._cart[id_yes].count > 1) {
                    this._cart[id_yes].count -= 1
                } else if (this._cart.length > 0) {
                    this._cart.splice(id_yes, 1);
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
        let id_yes = (product && product.id) ? Object.keys(this._cart).find(ids => this._cart[ids].id === product.id) : false
        if (id_yes && dop) {
            let dop_yes = (this._cart[id_yes].dop) ? Object.keys(this._cart[id_yes].dop).find(ids => this._cart[id_yes].dop[ids].id === dop.id) : false
            return { status: (dop_yes) ? true : false, count: (id_yes && this._cart[id_yes]) ? this._cart[id_yes].count : 1 }
        } else if (id_yes) {
            return { status: (id_yes) ? true : false, count: (id_yes && this._cart[id_yes]) ? this._cart[id_yes].count : 1 }
        } else {
            return { status: false, count: 1 }
        }
    }
    removeCartProduct(product) {
        if (product) {
            let id_yes = Object.keys(this._cart).find(ids => this._cart[ids].id === product.id);
            if (id_yes) {
                this._cart.splice(id_yes, 1);
                localStorage.setItem('cart', JSON.stringify(this._cart))
            }
            this.totalSum()
        }
    }
    removeCartDop(product, dop) {
        if (product && dop) {
            let id_yes = Object.keys(this._cart).find(ids => this._cart[ids].id === product.id);
            if (id_yes) {
                let dop_yes = (this._cart[id_yes].dop) ? Object.keys(this._cart[id_yes].dop).find(ids => this._cart[id_yes].dop[ids].id === dop.id) : false;
                if (dop_yes) {
                    this._cart[id_yes].dop.splice(dop_yes, 1);
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

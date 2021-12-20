import { makeAutoObservable } from "mobx";

export default class CartStore {
    constructor() {
        this._cart = []
        this._total = 0
        this._deliveryMinPrice = 700
        this._deliveryPrice = 100
        this._giftMinPrice = 800
        this._gift = {
            "id": 'gift',
            "gift": true,
            "api_id": "4e542b7f-c7f7-4028-80cd-d698c1e0bc46",
            "title": "Подарок Пицца Маргарита",
            "price": 0,
            "category": "ad96ecc9-6f7a-4d71-8f11-19d87e883428",
            "weight": 0.556,
            "description": "Тонокое итальянское тесто с хрустящим бортиком, мой фирменный томаный соус, много нежной моцареллы, спелые сочные томаты черри и конечно же свежий зеленый базелик. Классика Италии, её стоит попробовать!\nP.S Твой \"Bizon\"",
            "image": "63581e5d-e207-4976-a862-537e7f31a936.jpg",
            "count": 1
        }
        makeAutoObservable(this)
        this.totalSum()
    }
    totalSum() {
        let data = localStorage.getItem('cart');
        if (data) {
            this._total = 0
            this._cart = JSON.parse(data);
            this._cart.map(item => {
                this._total += item.price * item.count
            })
        }
    }
    setCart(product) {
        if(!product || 0 === product.length){
            return false
        }
        let id_yes = Object.keys(this._cart).find(ids => this._cart[ids].id === product.id);
        
        if(product.gift){
            if (id_yes) {
                this._cart.splice(id_yes, 1);
            }else{
                product.count = 1
                this._cart.push(product)
            }
        }else{
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
    addGift(){
        this.setCart(this._gift)
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
    checkCart(product) {
        var id_yes = (product && product.id) ? Object.keys(this._cart).find(ids => this._cart[ids].id === product.id) : false;
        return { status: (id_yes) ? true : false, count: (id_yes && this._cart[id_yes]) ? this._cart[id_yes].count : 1 }
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
    get giftMinPrice() {
        return this._giftMinPrice
    }
    get gift() {
        return this._gift
    }
}

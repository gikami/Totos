import { makeAutoObservable } from "mobx";

export default class ProductStore {
    constructor() {
        this._category = []
        this._products = []
        this._selectedCategory = {}
        this._page = 1
        this._totalCount = 0
        this._limit = 3
        makeAutoObservable(this)
    }

    setCategory(category) {
        this._category = category
    }
    setProducts(products) {
        this._products = products
    }

    setSelectedCategory(category) {
        this._selectedCategory = category
    }
    setPage(page) {
        this._page = page
    }
    setTotalCount(count) {
        this._totalCount = count
    }

    get category() {
        return this._category
    }
    get products() {
        return this._products
    }
    get selectedCategory() {
        return this._selectedCategory
    }
    get totalCount() {
        return this._totalCount
    }
    get page() {
        return this._page
    }
    get limit() {
        return this._limit
    }
}

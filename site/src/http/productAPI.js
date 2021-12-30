import { $authHost, $host } from "./index";

export const createCategory = async (category) => {
    const { data } = await $authHost.post('api/category', category)
    return data
}

export const fetchCategory = async () => {
    const { data } = await $host.get('api/category')
    return data
}

export const createProduct = async (product) => {
    const { data } = await $host.post('api/product/createProduct', product)
    return data
}

export const fetchProducts = async (categoryId, page, limit = 20) => {
    const { data } = await $host.get('api/product', {
        params: {
            categoryId, page, limit
        }
    })
    return data
}

export const fetchRecommed = async (param) => {

    let id = 1
    if (param) {
        let array = JSON.parse(param)[0]
        if (array.type == 'poke' || array.type == 'sup' || array.type == 'napitki') {
            id = 2
        }

    }

    const { data } = await $host.get('api/product/getrecommend', {
        params: {
            id
        }
    })
    return data
}

export const fetchOneProduct = async (id) => {
    const { data } = await $host.get('api/product/' + id)
    return data
}

export const createReview = async (array) => {
    const { data } = await $host.post('api/product/createReview', array)
    return data
}
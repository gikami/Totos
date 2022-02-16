import { $authHost, $host } from "./index";

export const getAikoStreets = async () => {
    const data = await $authHost.get('api/admin/getAikoStreets')
    if (data) {
        return data.data
    } else {
        return false
    }
}
export const getAikoCategories = async () => {
    const data = await $authHost.get('api/admin/getAikoCategories')
    if (data) {
        return data.data
    } else {
        return false
    }
}
export const getAikoProducts = async () => {
    const data = await $authHost.get('api/admin/getAikoProducts')
    if (data) {
        return data.data
    } else {
        return false
    }
}
export const sendAikoOrder = async () => {
    const data = await $authHost.post('api/admin/sendAikoOrder')
    if (data) {
        return data.data
    } else {
        return false
    }
}
export const getCategories = async (page = 1, limit = 20) => {
    const { data } = await $host.get('api/admin/getCategories', {
        params: {
            page, limit
        }
    })
    return data
}
export const getCategory = async (id) => {
    const { data } = await $host.get('api/admin/getCategory', {
        params: {
            id
        }
    })
    return data
}
export const editCategory = async (category) => {
    const { data } = await $authHost.post('api/admin/editCategory', category)
    return data
}
export const deleteCategory = async (category) => {
    const { data } = await $authHost.post('api/admin/deleteCategory', category)
    return data
}
export const createCategory = async (category) => {
    const { data } = await $authHost.post('api/admin/createCategory', category)
    return data
}





export const getProducts = async (page = 1, limit = 20) => {
    const { data } = await $host.get('api/admin/getProducts', {
        params: {
            page, limit
        }
    })
    return data
}
export const getProduct = async (id) => {
    const { data } = await $host.get('api/admin/getProduct', {
        params: {
            id
        }
    })
    return data
}
export const editProduct = async (product) => {
    const { data } = await $authHost.post('api/admin/editProduct', product)
    return data
}
export const deleteProduct = async (product) => {
    const { data } = await $authHost.post('api/admin/deleteProduct', product)
    return data
}
export const createProduct = async (product) => {
    const { data } = await $authHost.post('api/admin/createProduct', product)
    return data
}





export const getOrders = async (page = 1, limit = 20) => {
    const { data } = await $host.get('api/admin/getOrders', {
        params: {
            page, limit
        }
    })
    return data
}
export const getOrder = async (id) => {
    const { data } = await $host.get('api/admin/getOrder', {
        params: {
            id
        }
    })
    return data
}
export const editOrder = async (order) => {
    const { data } = await $authHost.post('api/admin/editOrder', order)
    return data
}
export const deleteOrder = async (order) => {
    const { data } = await $authHost.post('api/admin/deleteOrder', order)
    return data
}
export const createOrder = async (order) => {
    const { data } = await $authHost.post('api/admin/createOrder', order)
    return data
}
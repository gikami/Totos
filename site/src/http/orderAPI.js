import { $authHost, $host } from "./index";
import jwt_decode from "jwt-decode";

export const setOrder = async (array) => {
    const { data } = await $host.post('api/order', array)
    if (data) {
        return data
    } else {
        return false
    }
}
export const getOrder = async (array) => {
    const { data } = await $authHost.post('api/user/getorder', array)
    if (data) {
        return jwt_decode(data)
    } else {
        return false
    }
}
export const deleteOrder = async (id) => {
    const { data } = await $authHost.post('api/user/deleteorder', { id })
    if (data) {
        return jwt_decode(data)
    } else {
        return false
    }
}
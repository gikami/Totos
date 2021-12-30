import { $authHost, $host } from "./index";
import jwt_decode from "jwt-decode";

export const registration = async (phone) => {
    const { data } = await $host.post('api/user/registration', { phone })
    //localStorage.setItem('token', data.token)
    return jwt_decode(data)
}

export const login = async (phone, password) => {
    const { data } = await $host.post('api/user/login', { phone, password })
    localStorage.setItem('token', data.token)
    return jwt_decode(data.token)
}
export const edit = async (array) => {
    const { data } = await $authHost.post('api/user/edit', array)
    if (data) {
        localStorage.setItem('token', data.token)
        return jwt_decode(data.token)
    } else {
        return false
    }
}
export const addAddress = async (array) => {
    const { data } = await $authHost.post('api/user/address', array)
    if (data) {
        localStorage.setItem('token', data.token)
        return jwt_decode(data.token)
    } else {
        return false
    }
}
export const editAddress = async (array) => {
    const { data } = await $authHost.post('api/user/editaddress', array)
    if (data) {
        localStorage.setItem('token', data.token)
        return jwt_decode(data.token)
    } else {
        return false
    }
}
export const deleteAddress = async (id) => {
    const { data } = await $authHost.post('api/user/deleteaddress', { id })
    if (data) {
        localStorage.setItem('token', data.token)
        return jwt_decode(data.token)
    } else {
        return false
    }
}
export const check = async () => {
    const { data } = await $authHost.get('api/user/auth')
    localStorage.setItem('token', data.token)
    return jwt_decode(data.token)
}
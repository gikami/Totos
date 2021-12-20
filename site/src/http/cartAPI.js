import { $authHost, $host } from "./index";
import jwt_decode from "jwt-decode";


export const fetchCart = async () => {
    const { data } = await $authHost.get('api/cart')
    return jwt_decode(data)
}

export const createCart = async (product) => {
    const { data } = await $authHost.post('api/cart', product)
    return jwt_decode(data)
}
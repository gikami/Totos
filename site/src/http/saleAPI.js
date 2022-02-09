import { $host } from "./index"

export const fetchSale = async () => {
    const { data } = await $host.get('api/sale')
    return data
}

export const fetchOneSale = async (id) => {
    const { data } = await $host.get('api/sale/' + id)
    return data
}
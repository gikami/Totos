import { $host } from "./index";
export const getAikoCategory = async () => {
    const data = await $host.get('api/admin/getaikocategory')
    if (data) {
        return data.data
    } else {
        return false
    }
}
export const getAikoProducts = async () => {
    const data = await $host.get('api/admin/getaikoproducts')
    if (data) {
        return data.data
    } else {
        return false
    }
}
export const sendAikoOrder = async () => {
    const data = await $host.post('api/admin/sendaikoorder')
    if (data) {
        return data.data
    } else {
        return false
    }
}
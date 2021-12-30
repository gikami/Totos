import React, { useState, useEffect } from 'react'
import CreateProduct from "../components/modals/CreateProduct"
import CreateCategory from "../components/modals/CreateCategory"
import { getAikoCategory, getAikoProducts, sendAikoOrder } from "../http/adminAPI"

const Admin = () => {
    const [categoryVisible, setCategoryVisible] = useState(false)
    const [productVisible, setDeviceVisible] = useState(false)
    useEffect(() => {
        document.title = "Панель администратора"
    }, [])
    const aikoLoadCategory = () => {
        let data = getAikoCategory()
        data.then(result => {
            console.log(result)
        }).catch(e => console.log(e))
    }
    const aikoLoadProducts = () => {
        let data = getAikoProducts()
        data.then(result => {
            console.log(result)
        }).catch(e => console.log(e))
    }
    const aikoSendOrder = () => {
        let data = sendAikoOrder()
        data.then(result => {
            console.log(result)
        }).catch(e => console.log(e))
    }
    return (
        <div className="container pb-4 pt-4">
            <h5>Панель администратора</h5>
            <button
                className="btn btn-primary mb-4"
                onClick={() => setCategoryVisible(true)}
            >
                Добавить категорию
            </button>
            <button
                className="btn btn-primary mb-4"
                onClick={() => setDeviceVisible(true)}
            >
                Добавить товар
            </button>
            <CreateProduct show={productVisible} onHide={() => setDeviceVisible(false)} />
            <CreateCategory show={categoryVisible} onHide={() => setCategoryVisible(false)} />
        </div>
    );
};

export default Admin;

{/* <h5>Айко</h5>
<button
    className="btn btn-primary mt-4"
    onClick={() => aikoLoadCategory()}
>
    Выгрузить категории
</button>
<button
    className="btn btn-primary mt-4"
    onClick={() => aikoLoadProducts()}
>
    Выгрузить товары
</button>
<button
    className="btn btn-primary mt-4"
    onClick={() => aikoSendOrder()}
>
    Отправить тестовую заявку
</button> */}

import React, { useState, useContext } from 'react'
import { observer } from "mobx-react-lite"
import { Context } from "./../index"
import { LazyLoadImage } from 'react-lazy-load-image-component'

const DopItem = observer(({ product, dop }) => {
    const { cart } = useContext(Context)
    const [updateState, setUpdateState] = useState(false)
    const dataCart = cart.checkCart(product, dop)
    const btnAdd = (dataCart) ? dataCart.status : false

    const addCart = () => {
        cart.setCart(product, dop)
        setUpdateState(!updateState)
    }
    return (
        <div className="ingredient">
            <LazyLoadImage src={process.env.REACT_APP_API_URL + '/' + dop.image} effect="blur" alt={dop.title} />
            <div>
                <div className="title">{dop.title}<small> ({dop.weight * 1000}г)</small></div>
                <div className="mt-1 d-sm-flex justify-content-between align-items-center">
                    <div className="gray">{dop.price} ₽</div>
                    <button type="button" className="btn" onClick={addCart}>{(updateState || btnAdd) ? 'Добавлено' : 'Добавить'}</button>
                </div>
            </div>
        </div>
    )
})

export default DopItem

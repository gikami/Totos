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
        <div onClick={addCart} className={(updateState || btnAdd) ? 'ingredient active' : 'ingredient'}>
            <LazyLoadImage src={(dop.image) ? process.env.REACT_APP_API_URL + '/' + dop.image : '/images/no-image.jpg'} effect="blur" alt={dop.title} />
            <div>
                <div className="title">{dop.title}<small> ({dop.weight * 1000}г)</small></div>
                <div className="mt-1 gray fw-6">{dop.price} ₽</div>
            </div>
        </div>
    )
})

export default DopItem

import React, { useState, useContext } from 'react'
import { useHistory } from "react-router-dom"
import { observer } from "mobx-react-lite"
import { Context } from "./../index"
import { PRODUCT_ROUTE } from "../utils/consts"
import Radio from "./../components/Radio"

const ProductItem = observer(({ product }) => {
    const { cart, favorite } = useContext(Context)
    const history = useHistory()
    const [updateState, setUpdateState] = useState(false);
    const [updateFavorite, setUpdateFavorite] = useState(false);
    const sizeList = [
        { id: 1, group: 1, title: '25 см' },
        { id: 2, group: 1, title: '30 см' },
        { id: 3, group: 1, title: '35 см' }
    ]
    const dataCart = cart.checkCart(product)
    const dataFavorite = favorite.checkFavorite(product)
    const btnAdd = (dataCart) ? dataCart.status : false
    const btnFavoriteAdd = (dataFavorite) ? dataFavorite.status : false
    const count = (dataCart) ? dataCart.count : 0

    const addFavorite = () => {
        favorite.setFavorite(product)
        setUpdateFavorite(!updateFavorite)
    }
    const addCart = () => {
        cart.setCart(product)
        setUpdateState(!updateState)
    }
    const plusCount = () => {
        cart.setCartCountPlus(product)
        setUpdateState(!updateState)
    }
    const minusCount = () => {
        cart.setCartCountMinus(product)
        setUpdateState(!updateState)
    }
    const changeCount = ({ num }) => {
        cart.setCartCount(product, num)
        setUpdateState(!updateState)
    }
    return (
        <div>
            <div className="product-preview">
                <div>
                    <a onClick={() => history.push(PRODUCT_ROUTE + '/' + product.id)}>
                        <img src={process.env.REACT_APP_API_URL + '/' + product.image} alt="" />
                        <h5>{product.title}</h5>
                    </a>
                    <div className="ingredients">{product.description}</div>
                </div>
                <div className="d-md-flex justify-content-between align-items-center">
                    <div className="price d-flex flex-row flex-md-column align-items-center align-items-md-start justify-content-between mb-2 mb-md-0">
                        <div className="primary sec-font">{product.weight * 1000} грамм</div>
                        <div className="sec-font d-flex flex-wrap flex-row-reverse flex-md-row align-items-center">
                            <span className="fw-5 fs-15 align-middle">{product.price} ₽</span>
                            {product.sale && product.sale > 0 ? <span className="gray-3 text-decoration-line-through align-middle me-1 me-md-0 ms-1">{product.sale} ₽</span> : null}
                        </div>
                    </div>
                    <div className="add-to-cart">
                        <div className="add-count" style={{ top: (btnAdd) ? "0%" : "-100%" }}>
                            <button className="btn-mini" type="button" onClick={minusCount}>
                                <img src="/images//icons/minus2.svg" alt="" />
                            </button>
                            <input type="number" placeholder="1" value={count} onChange={changeCount} readOnly={true} />
                            <button className="btn-mini" type="button" onClick={plusCount}>
                                <img src="/images//icons/plus2.svg" alt="" />
                            </button>
                        </div>
                        <button type="button" className="add-prod" onClick={addCart}>{(updateState || btnAdd) ? 'Добавлено' : 'Добавить'}</button>
                    </div>
                </div>
                <button type="button" className="btn-icon favorite" onClick={addFavorite} data-state={btnFavoriteAdd ? 'on' : 'off'} ></button>
            </div>
        </div>
    )
})

export default ProductItem

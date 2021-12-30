import React, { useState, useContext } from 'react'
import { useHistory } from "react-router-dom"
import { observer } from "mobx-react-lite"
import { Context } from "./../index"
import { PRODUCT_ROUTE } from "../utils/consts"
import Radio from "./../components/Radio"

const ProductItem = observer(({ product }) => {
    const { cart, favorite } = useContext(Context)
    const history = useHistory()
    const [updateState, setUpdateState] = useState(false)
    const [updateFavorite, setUpdateFavorite] = useState(false)
    let param = (product.param) ? JSON.parse(product.param)[0] : false
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
        <>
            <div className="product-preview">
                <div class="row m-0 w-100">
                    <div class="col-5 col-md-12 p-0">
                        <a onClick={() => history.push(PRODUCT_ROUTE + '/' + product.id)}>
                            {(product.image) ? <img key={product.id} src={process.env.REACT_APP_API_URL + '/' + product.image} effect="blur" /> : null}
                        </a>
                    </div>
                    <div className="col-7 col-md-12 pl-2 pe-0 p-md-0">
                        <a onClick={() => history.push(PRODUCT_ROUTE + '/' + product.id)}>
                            <h5>{product.title}</h5>
                        </a>
                        <div className="ingredients">{(product.mini_description) ? product.mini_description : product.description}</div>
                        <div class="row m-0 justify-content-between align-items-center">
                            <div className="col p-0 d-none d-md-block">
                                <div class="price mb-2 mb-md-0">
                                    <div className="sec-font d-flex flex-wrap flex-row-reverse flex-md-row align-items-center">
                                        <span className="fw-5 fs-15 align-middle">{product.price} ₽</span>
                                        {product.sale && product.sale > 0 ? <span className="gray-3 text-decoration-line-through align-middle me-1 me-md-0 ms-1">{product.sale} ₽</span> : null}
                                    </div>
                                </div>
                            </div>
                            <div className="col p-0">
                                <div class="add-to-cart">
                                    <div className="add-count" style={{ top: (btnAdd) ? "0%" : "-100%" }}>
                                        <button className="btn-mini" type="button" onClick={minusCount}>
                                            <img src="/images/icons/minus2.svg" alt="" />
                                        </button>
                                        <input type="number" placeholder="1" value={count} onChange={changeCount} readOnly={true} />
                                        <button className="btn-mini" type="button" onClick={plusCount}>
                                            <img src="/images/icons/plus2.svg" alt="" />
                                        </button>
                                    </div>
                                    <button type="button" className="add-prod d-none d-md-block" onClick={addCart}>{(updateState || btnAdd) ? 'Добавлено' : 'Добавить'}</button>
                                    <button type="button" className="add-prod d-block d-md-none" onClick={addCart}>от {product.price} ₽</button>
                                </div>
                            </div>
                        </div>
                        <button type="button" className="btn-icon favorite" onClick={addFavorite} data-state={btnFavoriteAdd ? 'on' : 'off'} ></button>
                    </div>
                </div>
            </div>
        </>
    )
})

export default ProductItem

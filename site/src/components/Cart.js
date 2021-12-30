import React, { useContext, useState, useEffect } from 'react'
import { Context } from "../index"
import { Link } from "react-router-dom"
import { CART_ROUTE, CHECKOUT_ROUTE, SHOP_ROUTE } from "../utils/consts"
import { observer } from "mobx-react-lite"

const CartContent = observer(({ type }) => {
    const { user, cart, favorite } = useContext(Context)
    const [updateState, setUpdateState] = useState(false);
    const [updateFavorite, setUpdateFavorite] = useState(false);

    const addFavorite = (product) => {
        favorite.setFavorite(product)
        setUpdateFavorite(!updateFavorite)
    }
    const plusCount = (product) => {
        cart.setCartCountPlus(product)
        setUpdateState(!updateState)
    }
    const minusCount = (product) => {
        cart.setCartCountMinus(product)
        setUpdateState(!updateState)
    }
    const changeCount = ({ product, num }) => {
        cart.setCartCount(product, num)
        setUpdateState(!updateState)
    }
    const removeProduct = (product) => {
        cart.removeCartProduct(product)
        setUpdateState(!updateState)
    }
    const removeDop = (product, dop) => {
        cart.removeCartDop(product, dop)
        setUpdateState(!updateState)
    }
    const removeAllProduct = (product) => {
        cart.removeAllCart(product)
        setUpdateState(!updateState)
    }
    const addGift = (id) => {
        cart.addGift(id)
        setUpdateState(!updateState)
    }
    useEffect(() => {
        if (cart.total < cart.giftMinPrice[0]) {
            Object.keys(cart.cart).find(ids => (cart.cart[ids] && cart.cart[ids].gift) && addGift(0));
        }
        if (cart.total < cart.giftMinPrice[1]) {
            Object.keys(cart.cart).find(ids => (cart.cart[ids] && cart.cart[ids].gift) && addGift(1));
        }
        if (user.isAuth && user.user.order) {
            Object.keys(cart.cart).find(ids => (cart.cart[ids] && cart.cart[ids].gift) && addGift(2));
        }
    }, [updateState])
    if (type == 'mini') {
        return (
            (cart.cart && cart.cart.length > 0) ?
                cart.cart.map((cart, i) => {
                    var param = (cart.param) ? JSON.parse(cart.param)[0] : false
                    var total = cart.price * cart.count
                    if (cart.dop) {
                        cart.dop.map(dop => total += dop.price)
                    }
                    return (
                        <div key={i} className="item p-4">
                            <div className="d-flex align-items-start">
                                <img src={process.env.REACT_APP_API_URL + cart.image} alt={cart.title} className="me-3" />
                                <div className="text">
                                    <div className="title">{cart.title}</div>
                                    <div className="ingredients">{cart.description}</div>
                                </div>
                                <button type="button" className="btn-del ms-3" onClick={() => removeProduct(cart)}>
                                    <img src="/images//icons/delete.svg" alt="удалить" />
                                </button>
                            </div>
                            <div className="d-flex align-items-center mt-2">
                                {
                                    (param && param.gramm) && <div className="weight primary text-center me-3">{cart.weight * 1000} г</div>
                                }
                                <div className="d-flex align-items-center flex-grow-1">
                                    <button className="btn-mini" type="button" onClick={() => minusCount(cart)}>
                                        <svg width="9" height="2" viewBox="0 0 9 2" fill="none"
                                            xmlns="http://www.w3.org/2000/svg">
                                            <path d="M8.875 1.625H0.125V0.375H8.875V1.625Z" fill="#323232" />
                                        </svg>
                                    </button>
                                    <input type="number" placeholder="0" value={cart.count} onChange={() => changeCount(cart)} readOnly={true} />
                                    <button className="btn-mini" type="button" onClick={() => plusCount(cart)}>
                                        <svg width="9" height="10" viewBox="0 0 9 10" fill="none"
                                            xmlns="http://www.w3.org/2000/svg">
                                            <path
                                                d="M8.875 5.625H5.125V9.375H3.875V5.625H0.125V4.375H3.875V0.625H5.125V4.375H8.875V5.625Z"
                                                fill="#454545" />
                                        </svg>
                                    </button>
                                </div>
                                <div className="text-end sec-font fs-11 fw-5 ms-3">
                                    {total} ₽
                                </div>
                            </div>
                            {
                                (cart.dop && cart.dop.length > 0) && <div class="product-dop mt-2"> {
                                    cart.dop.map(dop => (
                                        <div className='d-flex align-items-center pb-2'>
                                            <div className='flex-1'>{dop.title}</div>
                                            <div className='fw-5'>{dop.price} ₽</div>
                                            <div class="ms-2">
                                                <button type="button" className="btn-del" onClick={() => removeDop(cart, dop)}>
                                                    <svg viewBox="0 0 16 20" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M1.14286 17.5556C1.14286 18.7429 2.17143 19.7143 3.42857 19.7143H12.5714C13.8286 19.7143 14.8571 18.7429 14.8571 17.5556V4.60317H1.14286V17.5556ZM16 1.36508H12L10.8571 0.285713H5.14286L4 1.36508H0V3.52381H16V1.36508Z" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                }
                                </div>
                            }
                        </div>
                    )
                })
                : <div className="pb-4 pt-4 text-center">Корзина пуста</div>
        )
    } else if (type == 'checkout') {
        return (
            (cart.cart && cart.cart.length > 0) ?
                <div className="table-resposive">
                    <table className="table table-borderless mb-0 title-font fw-6">
                        <tbody>
                            {
                                cart.cart.map((cart, i) => {
                                    var param = (cart.param) ? JSON.parse(cart.param)[0] : false
                                    var total = cart.price * cart.count
                                    if (cart.dop) {
                                        cart.dop.map(dop => total += dop.price)
                                    }
                                    return (
                                        <>
                                            <tr>
                                                <td>
                                                    <div className="primary">{cart.title}</div>
                                                    <div className="gray-3">{(cart.count) ? cart.count : 1} шт</div>
                                                </td>
                                                <td>
                                                    <div className="gray-1 fs-12 text-end">{total} ₽</div>
                                                </td>
                                            </tr>
                                            {
                                                (cart.dop && cart.dop.length > 0) &&
                                                cart.dop.map(dop => (
                                                    <tr class="table-dop">
                                                        <td>
                                                            <div className="primary fw-light"><small>{dop.title}</small></div>
                                                            <div className="gray-3 fw-light"><small>{(dop.count) ? dop.count : 1} шт</small></div>
                                                        </td>
                                                        <td>
                                                            <div className="gray-1 fs-12 text-end fw-light"><small>{dop.price} ₽</small></div>
                                                        </td>
                                                    </tr>
                                                ))
                                            }
                                        </>
                                    )
                                })

                            }
                        </tbody>
                    </table>
                </div>
                : <div className="pb-4 pt-4 text-center">Корзина пуста</div>
        )

    } else {
        return (
            <div className="row flex-lg-row-reverse gx-xxl-5">
                <div className="col-lg-4 pt-5">
                    <div className="row row-cols-md-2 row-cols-lg-1">
                        <div>
                            <div className="bonus">
                                <div>
                                    <div className="gray-1 title-font fw-7 fs-12 lh-15 text-center">Бесплатная доставка при заказе от 700 ₽</div>
                                </div>
                            </div>
                        </div>
                        {
                            (user.isAuth && !user.user.order) &&
                            <div>
                                <div className="bonus food">
                                    <img src="/images/gift-3.png" alt="" />
                                    <div>
                                        <h5>Пицца в подарок при первом заказе!</h5>
                                        {
                                            <div class="pt-2"><a class="btn btn-1" onClick={() => addGift(2)}>{(Object.keys(cart.cart).find(ids => cart.cart[ids].id === cart.gift(2).id)) ? 'Убрать подарок' : 'Добавить подарок'}</a></div>
                                        }
                                    </div>
                                </div>
                            </div>
                        }
                        <div>
                            <div className="bonus food">
                                <img src="/images/products/margarita.png" alt="" />
                                <div>
                                    <h5>Пицца даром!</h5>
                                    <div className="gray-1 lh-15">При заказе от 1000 руб пицца Маргарита в подарок</div>
                                    {
                                        (cart.total >= cart.giftMinPrice(0)) && <div class="pt-2"><a class="btn btn-1" onClick={() => addGift(0)}>{(Object.keys(cart.cart).find(ids => cart.cart[ids].id === cart.gift(0).id)) ? 'Убрать подарок' : 'Добавить подарок'}</a></div>
                                    }
                                </div>
                            </div>
                        </div>
                        <div>
                            <div className="bonus food">
                                <img src="/images/sale1.png" alt="" />
                                <div>
                                    <h5>Ролл в подарок!</h5>
                                    <div className="gray-1 lh-15">При заказе от 2500 руб. Ролл Филадельфия в подарок</div>
                                    {
                                        (cart.total >= cart.giftMinPrice(1)) && <div class="pt-2"><a class="btn btn-1" onClick={() => addGift(1)}>{(Object.keys(cart.cart).find(ids => cart.cart[ids].id === cart.gift(1).id)) ? 'Убрать подарок' : 'Добавить подарок'}</a></div>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-lg-8">
                    <button type="button" className="gray-3 ms-auto me-0 mb-4" onClick={removeAllProduct}>Очистить корзину</button>
                    {
                        cart.cart.map((cart, i) => {
                            var dataFavorite = favorite.checkFavorite(cart)
                            var btnFavoriteAdd = (dataFavorite) ? dataFavorite.status : false
                            var param = (cart.param) ? JSON.parse(cart.param)[0] : false
                            var total = cart.price * cart.count
                            if (cart.dop) {
                                cart.dop.map(dop => total += dop.price)
                            }
                            return (
                                <div key={i} className="item mb-4">
                                    <div className="img">
                                        <img src={process.env.REACT_APP_API_URL + '/' + cart.image} alt={cart.title} />
                                        <button type="button" className="btn-icon favorite" onClick={() => addFavorite(cart)} data-state={btnFavoriteAdd ? 'on' : 'off'} ></button>
                                    </div>
                                    <div className="text">
                                        <h5>{cart.title}</h5>
                                        <div className="ingredients">{cart.description}</div>
                                        {
                                            (param && param.gramm) && <div className="primary sec-font mb-2 mb-sm-3">{cart.weight * 1000} г</div>
                                        }
                                        <div className="sec-font d-flex align-items-center">
                                            <span className="fw-5 fs-15">{total} ₽</span>
                                            {cart.sale && cart.sale > 0 ? <span className="gray-3 text-decoration-line-through ms-3">{cart.sale} ₽</span> : null}
                                        </div>
                                    </div>

                                    <div className="btns">
                                        <div className='d-flex justify-content-between align-items-center'>
                                            {!cart.gift &&
                                                <div className="input-box">
                                                    <button type="button" onClick={() => minusCount(cart)}>
                                                        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M5 12H19" />
                                                        </svg>
                                                    </button>
                                                    <input type="number" placeholder="1" value={cart.count} min={1} className="fs-12 fw-5" readOnly={true} />
                                                    <button type="button" onClick={() => plusCount(cart)}>
                                                        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M12 4.99992V18.9999" />
                                                            <path d="M5 12H19" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            }
                                            <div className="sec-font fs-15 fw-5">{cart.price} ₽</div>
                                            <button type="button" className="btn-del" onClick={() => removeProduct(cart)}>
                                                <svg viewBox="0 0 16 20" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M1.14286 17.5556C1.14286 18.7429 2.17143 19.7143 3.42857 19.7143H12.5714C13.8286 19.7143 14.8571 18.7429 14.8571 17.5556V4.60317H1.14286V17.5556ZM16 1.36508H12L10.8571 0.285713H5.14286L4 1.36508H0V3.52381H16V1.36508Z" />
                                                </svg>
                                            </button>
                                        </div>
                                        {
                                            (cart.dop && cart.dop.length > 0) && <div class="product-dop mt-2"> {
                                                cart.dop.map(dop => (
                                                    <div className='d-flex align-items-center pb-2'>
                                                        <div className='flex-1'>{dop.title}</div>
                                                        <div className='fw-5'>{dop.price} ₽</div>
                                                        <div class="ms-2">
                                                            <button type="button" className="btn-del" onClick={() => removeDop(cart, dop)}>
                                                                <svg viewBox="0 0 16 20" xmlns="http://www.w3.org/2000/svg">
                                                                    <path d="M1.14286 17.5556C1.14286 18.7429 2.17143 19.7143 3.42857 19.7143H12.5714C13.8286 19.7143 14.8571 18.7429 14.8571 17.5556V4.60317H1.14286V17.5556ZM16 1.36508H12L10.8571 0.285713H5.14286L4 1.36508H0V3.52381H16V1.36508Z" />
                                                                </svg>
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))
                                            }
                                            </div>
                                        }
                                    </div>
                                </div>
                            )
                        })

                    }
                    <div className="row justify-content-end mb-4 mb-lg-0">
                        <div className="col-md-6 col-lg-5">
                            <table className="table table-sm table-borderless title-font">
                                <tbody>
                                    {
                                        (cart.sale.total > 0) &&
                                        <tr className="fs-14">
                                            <td><small>{cart.sale.text ? cart.sale.text : 'Скидка: '}</small></td>
                                            <td className="primary text-end">-{cart.sale.total} ₽</td>
                                        </tr>
                                    }
                                    <tr className="fs-20 fw-7">
                                        <td>К оплате:</td>
                                        <td className="primary text-end">{(cart.total) ? cart.total : 0} ₽</td>
                                    </tr>
                                </tbody>
                            </table>
                            <Link to={CHECKOUT_ROUTE} className="btn btn-1 mt-3 w-100 fs-11">Оформить заказ</Link>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
})

export default CartContent
import React, { useContext, useEffect } from 'react'
import { Context } from "../index"
import { HOME_ROUTE, CHECKOUT_ROUTE } from "../utils/consts"
import { Link } from "react-router-dom"
import CartContent from "../components/Cart"
import { observer } from "mobx-react-lite"

const Cart = observer(() => {
    const { cart } = useContext(Context)

    useEffect(() => {
        document.title = "Корзина"
    }, [])

    return (
        <main>
            <div className="container mb-4 mb-md-5">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb mb-0">
                        <li className="breadcrumb-item"><Link to={HOME_ROUTE}>Главная</Link></li>
                        <li className="breadcrumb-item"><a>Корзина</a></li>
                    </ol>
                </nav>
            </div>

            <section id="sec-14" className="mb-8">
                <div className="container">
                    {
                        (cart.cart && cart.cart.length > 0) ?
                            <>
                                <div className="d-flex justify-content-between align-items-center mb-4">
                                    <div className="d-flex align-items-baseline">
                                        <h1 className="mb-0">Корзина {(cart.cart.length > 0) && '(' + cart.cart.length + ')'}</h1>
                                    </div>
                                </div>
                                <form action="">
                                    <CartContent />
                                </form>
                            </>
                            :
                            <div className="row gx-xxl-5">
                                <div className="col-lg-8">
                                    <img src="/images/icons/shopping-bag.svg" alt="" className="d-block mx-auto mb-4" />
                                    <h1 className="text-center mb-4">Корзина пуста</h1>
                                    <div className="sec-font text-center mb-4">Посмотрите наше меню и добавьте <br /> понравившиеся товары</div>
                                    <Link to={HOME_ROUTE} className="btn btn-1 mx-auto py-md-3 mb-5 text-uppercase">Перейти к меню</Link>
                                </div>
                                <div className="col-lg-4">
                                    <div className="row row-cols-md-2 row-cols-lg-1">
                                        <div>
                                            <div className="bonus">
                                                <div>
                                                    <div className="gray-1 title-font fw-7 fs-12 lh-15 text-center">Бесплатная доставка при заказе от 700 ₽</div>
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <div className="bonus food">
                                                <img src="/images/products/margarita.png" alt="" />
                                                <div>
                                                    <h5>Пицца даром!</h5>
                                                    <div className="gray-1 lh-15">При заказе от 800 руб пицца Маргарита в подарок</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                    }
                </div>
            </section>
        </main>
    )
})

export default Cart

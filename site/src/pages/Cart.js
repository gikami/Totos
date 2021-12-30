import React, { useContext, useState, useEffect } from 'react'
import { Context } from "../index"
import { HOME_ROUTE, SHOP_ROUTE, CHECKOUT_ROUTE } from "../utils/consts"
import { Link } from "react-router-dom"
import CartContent from "../components/Cart"
import RecommendList from "../components/RecommendList"
import { fetchRecommed } from "../http/productAPI"
import { observer } from "mobx-react-lite"

const Cart = observer(() => {
    const { cart } = useContext(Context)
    const [recommend, setRecommend] = useState(false)

    useEffect(() => {
        document.title = "Корзина"
        fetchRecommed().then(data => {
            if (data) {
                setRecommend(data.recommend)
            }
        }).catch(e => console.log(e))
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
                                <form>
                                    <CartContent />
                                </form>
                                <h3 class="fw-7 mb-3 mt-4">Вам может понравится</h3>
                                <RecommendList list={recommend} />
                            </>
                            :
                            <div className="gx-xxl-5">
                                <img src="/images/icons/shopping-bag.svg" alt="" className="d-block mx-auto mb-4" />
                                <h1 className="text-center mb-4">Корзина пуста</h1>
                                <div className="sec-font text-center mb-4">Посмотрите наше меню и добавьте <br /> понравившиеся товары</div>
                                <Link to={SHOP_ROUTE} className="btn btn-1 mx-auto py-md-3 mb-5 text-uppercase">Перейти к меню</Link>
                            </div>
                    }
                </div>
            </section>
        </main>
    )
})

export default Cart

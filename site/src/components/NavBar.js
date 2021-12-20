import React, { useContext, useState, useEffect } from 'react'
import { Context } from "../index"
import { NavLink, Link } from "react-router-dom"
import { PROFILE_ROUTE, HOME_ROUTE, SHOP_ROUTE, ABOUT_ROUTE, DELIVERY_ROUTE, CART_ROUTE, FAVORITES_ROUTE, CHECKOUT_ROUTE } from "../utils/consts"
import { observer } from "mobx-react-lite"
import CartContent from "./Cart"
const NavBar = observer(() => {
    const { user, cart } = useContext(Context)
    const [isShown, setIsShown] = useState(false);
   
    return (
        <header>
            <div className="container">
                <Link to={HOME_ROUTE} className="logo"><img src='/images/whitelogo.svg' alt="bizon food" /></Link>
                <nav className="d-none d-lg-block">
                    <ul>
                        <li><Link to={HOME_ROUTE}>Главная</Link></li>
                        <li><NavLink to={SHOP_ROUTE}>Меню</NavLink></li>
                        <li><NavLink to={ABOUT_ROUTE}>О нас</NavLink></li>
                        <li><NavLink to={DELIVERY_ROUTE}>Доставка и оплата</NavLink></li>
                        <li><NavLink to={FAVORITES_ROUTE}>Избранное</NavLink></li>
                    </ul>
                </nav>
                <div className="sec-font white">
                    <div className="mb-md-2">
                        <a href="tel:+78432555133" className="d-flex align-items-center">
                            <img src="/images/icons/phone-white.svg" alt="телефон" className="icon me-2" />
                            <span className="fs-12 fw-5">+7 (843) 2-555-133</span>
                        </a>
                    </div>
                    <div className="d-none d-md-flex align-items-center">
                        <img src="/images/icons/clock-white.svg" alt="время" className="icon me-2" />
                        <span className="fs-12 fw-5">с 10:00 до 23:00</span>
                    </div>
                </div>
                <div className="d-none d-md-flex">
                    {
                        (user.isAuth) ?
                            <Link to={PROFILE_ROUTE} type="button" className="d-none d-md-flex btn-svg ms-3">
                                <svg viewBox="0 0 38 39" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M19 19.5C20.8897 19.5 22.7019 18.7296 24.0381 17.3582C25.3743 15.9869 26.125 14.1269 26.125 12.1875C26.125 10.2481 25.3743 8.38814 24.0381 7.01678C22.7019 5.64542 20.8897 4.875 19 4.875C17.1103 4.875 15.2981 5.64542 13.9619 7.01678C12.6257 8.38814 11.875 10.2481 11.875 12.1875C11.875 14.1269 12.6257 15.9869 13.9619 17.3582C15.2981 18.7296 17.1103 19.5 19 19.5ZM23.75 12.1875C23.75 13.4804 23.2496 14.7204 22.3588 15.6346C21.468 16.5489 20.2598 17.0625 19 17.0625C17.7402 17.0625 16.532 16.5489 15.6412 15.6346C14.7504 14.7204 14.25 13.4804 14.25 12.1875C14.25 10.8946 14.7504 9.65459 15.6412 8.74035C16.532 7.82611 17.7402 7.3125 19 7.3125C20.2598 7.3125 21.468 7.82611 22.3588 8.74035C23.2496 9.65459 23.75 10.8946 23.75 12.1875ZM33.25 31.6875C33.25 34.125 30.875 34.125 30.875 34.125H7.125C7.125 34.125 4.75 34.125 4.75 31.6875C4.75 29.25 7.125 21.9375 19 21.9375C30.875 21.9375 33.25 29.25 33.25 31.6875ZM30.875 31.6778C30.8726 31.0781 30.5093 29.2744 28.899 27.6217C27.3505 26.0325 24.4364 24.375 19 24.375C13.5612 24.375 10.6495 26.0325 9.101 27.6217C7.49075 29.2744 7.12975 31.0781 7.125 31.6778H30.875Z" />
                                </svg>
                            </Link>
                            :
                            <button type="button" data-bs-toggle="modal" data-bs-target="#entrance" className="d-none d-md-flex btn-svg ms-3">
                                <svg viewBox="0 0 38 39" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M19 19.5C20.8897 19.5 22.7019 18.7296 24.0381 17.3582C25.3743 15.9869 26.125 14.1269 26.125 12.1875C26.125 10.2481 25.3743 8.38814 24.0381 7.01678C22.7019 5.64542 20.8897 4.875 19 4.875C17.1103 4.875 15.2981 5.64542 13.9619 7.01678C12.6257 8.38814 11.875 10.2481 11.875 12.1875C11.875 14.1269 12.6257 15.9869 13.9619 17.3582C15.2981 18.7296 17.1103 19.5 19 19.5ZM23.75 12.1875C23.75 13.4804 23.2496 14.7204 22.3588 15.6346C21.468 16.5489 20.2598 17.0625 19 17.0625C17.7402 17.0625 16.532 16.5489 15.6412 15.6346C14.7504 14.7204 14.25 13.4804 14.25 12.1875C14.25 10.8946 14.7504 9.65459 15.6412 8.74035C16.532 7.82611 17.7402 7.3125 19 7.3125C20.2598 7.3125 21.468 7.82611 22.3588 8.74035C23.2496 9.65459 23.75 10.8946 23.75 12.1875ZM33.25 31.6875C33.25 34.125 30.875 34.125 30.875 34.125H7.125C7.125 34.125 4.75 34.125 4.75 31.6875C4.75 29.25 7.125 21.9375 19 21.9375C30.875 21.9375 33.25 29.25 33.25 31.6875ZM30.875 31.6778C30.8726 31.0781 30.5093 29.2744 28.899 27.6217C27.3505 26.0325 24.4364 24.375 19 24.375C13.5612 24.375 10.6495 26.0325 9.101 27.6217C7.49075 29.2744 7.12975 31.0781 7.125 31.6778H30.875Z" />
                                </svg>
                            </button>
                    }
                    <div className="ms-3" id="toggle-cart">
                        <Link to={CART_ROUTE} onMouseEnter={() => setIsShown(true)} onMouseLeave={() => setIsShown(false)} className="btn-svg position-relative">
                            <svg viewBox="0 0 41 41" xmlns="http://www.w3.org/2000/svg">
                                <path d="M20.4997 3.84375C16.9813 3.84375 14.0934 6.73169 14.0934 10.25V11.5312H7.7666L7.68716 12.7331L6.40591 35.7956L6.3252 37.1562H34.6728L34.5934 35.7943L33.3122 12.7318L33.2314 11.5312H26.9059V10.25C26.9059 6.73169 24.018 3.84375 20.4997 3.84375ZM20.4997 6.40625C21.5191 6.40625 22.4968 6.81122 23.2176 7.53206C23.9384 8.2529 24.3434 9.23057 24.3434 10.25V11.5312H16.6559V10.25C16.6559 9.23057 17.0609 8.2529 17.7817 7.53206C18.5026 6.81122 19.4802 6.40625 20.4997 6.40625ZM10.1689 14.0938H14.0934V17.9375H16.6559V14.0938H24.3434V17.9375H26.9059V14.0938H30.8304L31.9515 34.5938H9.04913L10.1689 14.0938Z" />
                            </svg>
                            {(cart.cart.length > 0) && <div className="count">{cart.cart.length}</div>}
                        </Link>
                        {isShown ?
                            <div className="cart-preview" onMouseEnter={() => setIsShown(true)} onMouseLeave={() => setIsShown(false)}>
                                <div className="cart-scroll">
                                    <CartContent type={'mini'}/>

                                </div>
                                {
                                    (cart.cart && cart.cart.length > 0) &&
                                    <>
                                        <div className="px-4 pt-3 pb-1">
                                            <Link to={CART_ROUTE} className="btn btn-2 w-100">В корзину</Link>
                                        </div>
                                        <div className="px-4 pt-2 pb-2">
                                            <Link to={CHECKOUT_ROUTE} className="btn btn-1 w-100">Оформить заказ {cart.total} ₽</Link>
                                        </div>
                                    </>
                                }

                            </div>
                            : null
                        }
                    </div>
                </div>
            </div>
        </header>
    );
})

export default NavBar;
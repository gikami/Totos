import React, { useContext, useState } from 'react';
import { Context } from "../index";
import { Link, NavLink } from "react-router-dom";
import { HOME_ROUTE, PROFILE_ROUTE, SHOP_ROUTE, DELIVERY_ROUTE, ABOUT_ROUTE, POLICY_ROUTE, CART_ROUTE, FAVORITES_ROUTE } from "../utils/consts";
import { observer } from "mobx-react-lite";
import { login, registration } from "../http/userAPI";

const Footer = observer(() => {
    const { user, cart } = useContext(Context)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const formLogin = async (e) => {
        try {
            e.preventDefault();
            let data;
            data = await login(email, password);
            user.setUser(data)
            user.setIsAuth(true)
            window.location.reload();
        } catch (e) {
            if (e.response && e.response.data) {
                alert(e.response.data.message)
            } else {
                alert('Неверный логин или пароль')
            }
        }
    }
    const formReg = async (e) => {
        try {
            e.preventDefault();
            let data;
            let password;
            password = 121212;
            data = await registration(email, password);
            user.setUser(data)
            user.setIsAuth(true)
            window.location.href = PROFILE_ROUTE;
        } catch (e) {
            alert(e.response.data.message)
        }
    }
    return (
        <>
            <footer className="d-none d-md-block">
                <div className="container">
                    <div className="row justify-content-between">
                        <div className="col-4 col-xl-3">
                            <div className="row gx-2 gx-lg-4">
                                <div className="col-6">
                                    <nav>
                                        <ul>
                                            <li><Link to={SHOP_ROUTE}>Роллы холодные</Link></li>
                                            <li><Link to={SHOP_ROUTE}>Роллы запеченые</Link></li>
                                            <li><Link to={SHOP_ROUTE}>Роллы жареные</Link></li>
                                            <li><Link to={SHOP_ROUTE}>Супы</Link></li>
                                            <li><Link to={SHOP_ROUTE}>Поке</Link></li>
                                            <li><Link to={SHOP_ROUTE}>Пиццы</Link></li>
                                        </ul>
                                    </nav>
                                </div>
                                <div className="col-6">
                                    <nav>
                                        <ul>
                                            <li><Link to={SHOP_ROUTE}>Напитки</Link></li>
                                            <li><Link to={ABOUT_ROUTE}>О нас</Link></li>
                                            <li><Link to={DELIVERY_ROUTE}>Доставка и оплата</Link></li>
                                        </ul>
                                    </nav>
                                </div>
                            </div>
                        </div>
                        <div className="col-4 col-xl-3 text-center d-flex flex-column justify-content-between">
                            <div className="mb-3 mb-lg-0">
                                <Link to={HOME_ROUTE} className="d-block mb-2 mb-lg-4"><img src="/images/whitelogo.svg" alt="bizon food" className="img-fluid footer-logo" /></Link>
                                <div className="sec-font fs-12"><Link to={POLICY_ROUTE} className="white">Политика конфиденциальности</Link></div>
                            </div>
                            <div>
                                <div className="sec-font mb-2 mb-lg-3">Мы в социальных сетях:</div>
                                <div className="d-flex justify-content-center">
                                    <a href="https://www.instagram.com/bizon_street_food/" className="social" target="_blank">
                                        <img src="/images/icons/instagram.svg" alt="" />
                                    </a>
                                    <a href="tel:+78432555133" className="social" target="_blank">
                                        <img src="/images/icons/phone-white-bold.svg" alt="" />
                                    </a>
                                </div>
                            </div>
                        </div>
                        <div className="col-4 col-xl-3 d-flex flex-column justify-content-between">
                            <div>
                                <div className="sec-font d-flex align-items-start mb-3">
                                    <img src="/images/icons/map-pin3.svg" alt="адрес" className="icon me-2" />
                                    <div>Мы находимся по адресу: <br />
                                        г. Казань, улица 1 мая, дом 5</div>
                                </div>
                                <div className="sec-font d-flex align-items-start">
                                    <img src="/images/icons/phone-white-bold.svg" alt="телефон" className="icon me-2" />
                                    <div><a href="tel:+78432555133">+7 (843) 2-555-133</a></div>
                                </div>
                            </div>
                            <div>
                                <a href="http://asmpromo.ru/" alt="Создание и продвижение сайтов"
                                    title="Создание и продвижение сайтов" target="_blank"
                                    className="d-flex justify-content-end align-items-center">
                                    <div className="sec-font text-end">Создание и продвижение сайтов</div>
                                    <img src="/images/asm.svg" alt="" className="ms-3" />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>

            <footer className="mobile d-flex d-md-none">
                <Link to={HOME_ROUTE} className="link">
                    <svg viewBox="0 0 30 30" xmlns="http://www.w3.org/2000/svg">
                        <path d="M15 7.1125L21.25 12.7375V22.5H18.75V15H11.25V22.5H8.75V12.7375L15 7.1125ZM15 3.75L2.5 15H6.25V25H13.75V17.5H16.25V25H23.75V15H27.5L15 3.75Z" />
                    </svg>
                </Link>
                <Link to={SHOP_ROUTE} className="link">
                    <svg viewBox="0 0 30 30" xmlns="http://www.w3.org/2000/svg">
                        <path d="M11.875 3.75C14.0299 3.75 16.0965 4.60602 17.6202 6.12976C19.144 7.65349 20 9.72012 20 11.875C20 13.8875 19.2625 15.7375 18.05 17.1625L18.3875 17.5H19.375L25.625 23.75L23.75 25.625L17.5 19.375V18.3875L17.1625 18.05C15.6882 19.3085 13.8134 19.9999 11.875 20C9.72012 20 7.65349 19.144 6.12976 17.6202C4.60602 16.0965 3.75 14.0299 3.75 11.875C3.75 9.72012 4.60602 7.65349 6.12976 6.12976C7.65349 4.60602 9.72012 3.75 11.875 3.75ZM11.875 6.25C8.75 6.25 6.25 8.75 6.25 11.875C6.25 15 8.75 17.5 11.875 17.5C15 17.5 17.5 15 17.5 11.875C17.5 8.75 15 6.25 11.875 6.25Z" />
                    </svg>
                </Link>
                <Link to={CART_ROUTE} className="btn-svg position-relative">
                    <svg viewBox="0 0 41 41" xmlns="http://www.w3.org/2000/svg">
                        <path d="M20.4997 3.84375C16.9813 3.84375 14.0934 6.73169 14.0934 10.25V11.5312H7.7666L7.68716 12.7331L6.40591 35.7956L6.3252 37.1562H34.6728L34.5934 35.7943L33.3122 12.7318L33.2314 11.5312H26.9059V10.25C26.9059 6.73169 24.018 3.84375 20.4997 3.84375ZM20.4997 6.40625C21.5191 6.40625 22.4968 6.81122 23.2176 7.53206C23.9384 8.2529 24.3434 9.23057 24.3434 10.25V11.5312H16.6559V10.25C16.6559 9.23057 17.0609 8.2529 17.7817 7.53206C18.5026 6.81122 19.4802 6.40625 20.4997 6.40625ZM10.1689 14.0938H14.0934V17.9375H16.6559V14.0938H24.3434V17.9375H26.9059V14.0938H30.8304L31.9515 34.5938H9.04913L10.1689 14.0938Z" />
                    </svg>
                    {(cart.cart.length > 0) && <div className="count">{cart.cart.length}</div>}
                </Link>
                <button className="btn-svg ms-3 link btn-svg-2 ms-3 d-block d-lg-none" type="button" data-bs-toggle="offcanvas"
                    data-bs-target="#right-menu">
                    <svg viewBox="0 0 33 33" xmlns="http://www.w3.org/2000/svg">
                        <path d="M4.125 16.5H28.875" />
                        <path d="M4.125 8.25H28.875" />
                        <path d="M4.125 24.75H28.875" />
                    </svg>
                </button>
            </footer>

            <div className="offcanvas offcanvas-end" tabIndex="-1" id="right-menu">
                <div className="offcanvas-body">
                    <nav>
                        <ul data-bs-dismiss="offcanvas">
                            <li><Link to={HOME_ROUTE}>Главная</Link></li>
                            <li><NavLink to={SHOP_ROUTE}>Меню</NavLink></li>
                            <li><NavLink to={ABOUT_ROUTE}>О нас</NavLink></li>
                            <li><NavLink to={DELIVERY_ROUTE}>Доставка и оплата</NavLink></li>
                            <li><NavLink to={FAVORITES_ROUTE}>Избранное</NavLink></li>
                        </ul>
                    </nav>
                    <div className="mt-5 d-block d-md-none">
                        <div className="mb-2">
                            <a href="tel:+78432555133" className="d-flex align-items-center">
                                <img src="/images/icons/phone-black.svg" alt="телефон" className="icon me-2" />
                                <span className="fs-12 fw-5">+7 (843) 2-555-133</span>
                            </a>
                        </div>
                        <div className="d-flex align-items-center">
                            <img src="/images/icons/clock-black.svg" alt="время" className="icon me-2" />
                            <span className="fs-12 fw-5">с 10:00 до 23:00</span>
                        </div>
                    </div>
                    <button type="button" className="btn-close" data-bs-dismiss="offcanvas">
                        <svg viewBox="0 0 26 26" xmlns="http://www.w3.org/2000/svg">
                            <path d="M23.0001 2.99995L13.345 12.9999L23.0001 22.9999"></path>
                            <path d="M2.99997 22.9999L13.3447 13L2.99997 3"></path>
                        </svg>
                    </button>
                </div>

            </div>

            <div id="cookie" className="toast hide" role="alert" aria-live="assertive" aria-atomic="true">
                <p className="gray-1 lh-15 mb-4">Мы используем файлы cookie, чтобы помочь персонализировать контент, адаптировать и оценивать рекламу, а также повысить безопасность. Оставаясь на этом веб-сайте, вы соглашаетесь на использование файлов cookie в соответствии с нашей Политикой использования файлов cookie.</p>
                <div className="d-flex">
                    <button type="button" className="btn btn-1">Согласен</button>
                    <button type="button" className="btn gray-3 ms-sm-4" data-bs-dismiss="toast" aria-label="Закрыть">Закрыть окно</button>
                </div>
            </div>

            <div className="modal fade" id="entrance" tabIndex="-1" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                    <div className="modal-content">
                        <button type="button" className="btn-close" data-bs-dismiss="modal">
                            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M18 6L6 18" />
                                <path d="M6 6L18 18" />
                            </svg>
                        </button>
                        <div className="modal-body">
                            <h5 className="text-center mb-4 mb-md-5">Вход</h5>
                            <form onSubmit={formLogin}>
                                <div className="mb-2 mb-md-3">Номер телефона</div>
                                <input type="text" placeholder="+7 000 000 00 00" className="mb-3 mb-md-4" onChange={e => setEmail(e.target.value)} />
                                <div className="mb-2 mb-md-3">Пароль</div>
                                <div className="password mb-3 mb-md-4">
                                    <input type="password" name="password" autoComplete="current-password" minLength="4" maxLength="8" placeholder="Пароль" data-state="invisible" onChange={e => setPassword(e.target.value)} />
                                    <button type="button" data-state="invisible" className="pass_btn" onclick="change_state(this);"></button>
                                </div>
                                <div className="d-flex flex-column flex-sm-row align-items-center my-4 my-md-5">
                                    <button type="submit" className="btn btn-1 px-5 py-sm-3 me-sm-3 me-md-4 mb-3 mb-sm-0">Войти</button>
                                    <button type="button" className="blue" data-bs-toggle="modal" data-bs-target="#password-recovery-1" data-bs-dismiss="modal">Забыли пароль?</button>
                                </div>
                                <div className="d-flex flex-wrap align-items-center">
                                    <span>У вас ещё нет учётной записи?</span>
                                    <button type="button" className="blue ms-1" data-bs-toggle="modal" data-bs-target="#registration" data-bs-dismiss="modal">Регистрация</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            <div className="modal fade" id="password-recovery-1" tabIndex="-1" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                    <div className="modal-content">
                        <button type="button" className="btn-close" data-bs-dismiss="modal">
                            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M18 6L6 18" />
                                <path d="M6 6L18 18" />
                            </svg>
                        </button>
                        <div className="modal-body">
                            <h5 className="text-center">Восстановление пароля</h5>
                            <div className="text-center mb-3 mb-md-5">Введите номер телефона, на который вы регистрировались.</div>
                            <form>
                                <input type="text" placeholder="+7 000 000 00 00" className="mb-3 mb-md-5" />
                                <button type="submit" data-bs-toggle="modal" data-bs-target="#password-recovery-2" data-bs-dismiss="modal" className="btn btn-1 py-sm-3 mb-3 mb-md-4">Выслать код</button>
                                <button type="button" className="blue ms-1" data-bs-toggle="modal" data-bs-target="#entrance" data-bs-dismiss="modal">Я вспомнил пароль</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            <div className="modal fade" id="password-recovery-2" tabIndex="-1" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                    <div className="modal-content">
                        <button type="button" className="btn-close" data-bs-dismiss="modal">
                            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M18 6L6 18" />
                                <path d="M6 6L18 18" />
                            </svg>
                        </button>
                        <div className="modal-body">
                            <h5 className="text-center">Восстановление пароля</h5>
                            <div className="text-center mb-3 mb-md-5">На номер +7 (987) 897-67-67 выслано СМС-сообщение с кодом подтверждения.</div>
                            <form>
                                <input type="text" placeholder="Код подтверждения" className="mb-3 mb-md-5" />
                                <button type="submit" data-bs-toggle="modal" data-bs-target="#password-recovery-3" data-bs-dismiss="modal" className="btn btn-1 py-sm-3 mb-3 mb-md-4">Подтвердить</button>
                                <button type="button" className="blue ms-1" data-bs-toggle="modal" data-bs-target="#entrance" data-bs-dismiss="modal">Я вспомнил пароль</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            <div className="modal fade" id="password-recovery-3" tabIndex="-1" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                    <div className="modal-content">
                        <button type="button" className="btn-close" data-bs-dismiss="modal">
                            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M18 6L6 18" />
                                <path d="M6 6L18 18" />
                            </svg>
                        </button>
                        <div className="modal-body">
                            <h5 className="text-center mb-5">Восстановление пароля</h5>
                            <form>
                                <div className="mb-2 mb-md-3">Новый пароль</div>
                                <div className="password mb-4 mb-md-5">
                                    <input type="password" name="password" autoComplete="current-password" minLength="4" maxLength="8" placeholder="Пароль" data-state="invisible" />
                                    <button type="button" data-state="invisible" className="pass_btn" onclick="change_state(this);"></button>
                                </div>
                                <button type="submit" className="btn btn-1 py-sm-3 mb-3 mb-md-4">Далее</button>
                                <button type="button" className="blue ms-1" data-bs-toggle="modal" data-bs-target="#entrance" data-bs-dismiss="modal">Я вспомнил пароль</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            <div className="modal fade" id="registration" tabIndex="-1" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                    <div className="modal-content">
                        <button type="button" className="btn-close" data-bs-dismiss="modal">
                            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M18 6L6 18" />
                                <path d="M6 6L18 18" />
                            </svg>
                        </button>
                        <div className="modal-body">
                            <h5 className="text-center mb-4 mb-md-5">Регистрация</h5>
                            <form onSubmit={formReg}>
                                <div className="mb-2 mb-md-3">Номер телефона</div>
                                <input type="text" placeholder="+7 000 000 00 00" className="mb-3 mb-md-5" onChange={e => setEmail(e.target.value)} />
                                <button type="submit" data-bs-toggle="modal" data-bs-target="#confirmation" data-bs-dismiss="modal" className="btn btn-1 py-sm-3 mb-4 mb-md-5">Выслать код</button>
                                <div className="d-flex flex-wrap align-items-center">
                                    <span>У вас уже есть учётная запись?</span>
                                    <button type="button" className="blue ms-1" data-bs-toggle="modal" data-bs-target="#entrance" data-bs-dismiss="modal">Вход</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            <div className="modal fade" id="confirmation" tabIndex="-1" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                    <div className="modal-content">
                        <button type="button" className="btn-close" data-bs-dismiss="modal">
                            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M18 6L6 18" />
                                <path d="M6 6L18 18" />
                            </svg>
                        </button>
                        <div className="modal-body">
                            <h5 className="text-center">Подтвердите номер телефона</h5>
                            <div className="text-center mb-3 mb-md-5">На номер +7 (987) 897-67-67 выслано СМС-сообщение с кодом подтверждения.</div>
                            <form>
                                <input type="text" placeholder="Код подтверждения" className="mb-4 mb-md-5" />
                                <button type="submit" data-bs-toggle="modal" data-bs-target="#pick-password" data-bs-dismiss="modal" className="btn btn-1 py-sm-3 mb-4 mb-md-5">Подтвердить</button>
                                <div className="d-flex flex-wrap align-items-center">
                                    <span>У вас уже есть учётная запись?</span>
                                    <button type="button" className="blue ms-1" data-bs-toggle="modal" data-bs-target="#entrance" data-bs-dismiss="modal">Вход</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            <div className="modal fade" id="pick-password" tabIndex="-1" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                    <div className="modal-content">
                        <button type="button" className="btn-close" data-bs-dismiss="modal">
                            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M18 6L6 18" />
                                <path d="M6 6L18 18" />
                            </svg>
                        </button>
                        <div className="modal-body">
                            <h5 className="text-center">Придумайте пароль</h5>
                            <form>
                                <div className="password mb-4 mb-md-5">
                                    <input type="password" name="password" autoComplete="current-password" minLength="4" maxLength="8" placeholder="Пароль" data-state="invisible" />
                                    <button type="button" data-state="invisible" className="pass_btn" onclick="change_state(this);"></button>
                                </div>
                                <button type="submit" className="btn btn-1 py-sm-3 mb-4 mb-md-5">Регистрация</button>
                                <div className="d-flex flex-wrap align-items-center">
                                    <span>У вас уже есть учётная запись?</span>
                                    <button type="button" className="blue ms-1" data-bs-toggle="modal" data-bs-target="#entrance" data-bs-dismiss="modal">Вход</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            <div className="modal fade" id="write-feedback" tabIndex="-1" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                    <div className="modal-content">
                        <button type="button" className="btn-close" data-bs-dismiss="modal">
                            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M18 6L6 18" />
                                <path d="M6 6L18 18" />
                            </svg>
                        </button>
                        <div className="modal-body">
                            <h5 className="text-center">Отправка отзыва</h5>
                            <form>
                                <div className="mb-2">Имя и Фамилия: </div>
                                <input type="text" className="mb-4" placeholder="Иван Иванов" />
                                <div className="mb-2">Ваша оценка: </div>
                                <div className="leave-rating mb-4">
                                    <input type="radio" name="rating" value="5" />
                                    <input type="radio" name="rating" value="4" />
                                    <input type="radio" name="rating" value="3" />
                                    <input type="radio" name="rating" value="2" />
                                    <input type="radio" name="rating" value="1" />
                                </div>

                                <div className="mb-2">Ваш отзыв</div>
                                <textarea className="mb-4" rows="5" placeholder="Начните вводить текст…"></textarea>

                                <button type="submit" className="btn btn-1 py-sm-3">Отправить отзыв</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            <div className="modal fade" id="account-delete" tabIndex="-1" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                    <div className="modal-content">
                        <button type="button" className="btn-close" data-bs-dismiss="modal">
                            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M18 6L6 18" />
                                <path d="M6 6L18 18" />
                            </svg>
                        </button>
                        <div className="modal-body">
                            <div className="row justify-content-center">
                                <div className="col-md-9">
                                    <h5 className="text-center">Удаление аккаунта</h5>
                                    <div className="text-center gray-3 mb-4">Все ваши данные, история заказов, бонусы и скидки будут утеряны.</div>
                                    <div className="d-flex justify-content-center align-items-center">
                                        <button type="button" className="btn btn-2 px-5">Удалить</button>
                                        <button type="button" data-bs-dismiss="modal" className="gray-2 ms-4">Отменить</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
});

export default Footer;
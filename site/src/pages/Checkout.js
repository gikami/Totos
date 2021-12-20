import React, { useContext, useState, useEffect } from 'react'
import { Context } from "../index"
import { HOME_ROUTE, CART_ROUTE, PROFILE_ROUTE } from "../utils/consts"
import { Link } from "react-router-dom"
import { observer } from "mobx-react-lite"
import { setOrder } from "../http/orderAPI"

const Checkout = observer(() => {
    const { user, cart } = useContext(Context)
    const [sendOrder, setSendOrder] = useState(false);
    const timeNew = new Date()
    const timeNow = new Date()
    timeNew.setTime(timeNew.getTime() + 90 * 60 * 1000)
    const time = timeNew.getHours() + ':' + (timeNew.getMinutes() < 10 ? '0' : '') + timeNew.getMinutes()
    const [checkout, setCheckout] = useState({
        name: (user.isAuth && user.user.firstname) ? user.user.firstname : '',
        phone: (user.isAuth && user.user.phone) ? user.user.phone : '',
        time: 1,
        timevalue: time,
        payment: 'card',
        delivery: 1,
        total: cart.total,
        products: cart.cart,
        street: '', home: '', entrance: '', code: '', floor: '', apartment: '',
        comment: '',
    })

    useEffect(() => {
        document.title = "Оформление заказа"
    }, [])

    const updateTotal = () => {
        if (cart.total < cart.deliveryMinPrice && checkout.delivery == 2) {
            checkout.total = cart.total + cart.deliveryPrice
        } else {
            checkout.total = cart.total
        }
        setCheckout({ ...checkout, total: checkout.total })
    }
    useEffect(() => {
        updateTotal()
    }, [checkout.delivery, cart.total])

    const submit = (e) => {
        e.preventDefault()
        let data = setOrder(checkout)

        cart.removeAllCart()
        setCheckout({})
        setSendOrder(!sendOrder)
        data.then(result => {
            console.log(result)
        }).catch(e => console.log(e))

    }
    const change = (e) => {
        setCheckout({ ...checkout, [e.target.name]: e.target.value })
    }
    if (sendOrder) {
        return (
            <main>
                <section className="mt-5 mb-5">
                    <div className="container">
                        <div className="row justify-content-center">
                            <div className="col-md-7 col-lg-6 col-xl-5">
                                <h2 className="text-center">Заявка успешно отправлена!</h2>
                                <div className="text-center mb-4 mb-sm-5">Ожидайте ответа консультанта для подтверждения заказа</div>
                                <Link to={HOME_ROUTE} className="btn btn-2 mx-auto py-md-3">В каталог</Link>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        )
    }
    return (
        <main>
            <div className="container mb-4 mb-md-5">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb mb-0">
                        <li className="breadcrumb-item"><Link to={HOME_ROUTE}>Главная</Link></li>
                        <li className="breadcrumb-item"><a>Оформление заказа</a></li>
                    </ol>
                </nav>
            </div>
            {
                (timeNow.getHours() === 23 || timeNow.getHours() < 10) ?
                    <section className="mb-8">
                        <div className="container">
                            <div className="row justify-content-center">
                                <div className="col-md-7 col-lg-6 col-xl-5">
                                    <h2 className="text-center">Мы работает с 10:00 до 23:00</h2>
                                    <div className="text-center mb-4 mb-sm-5">Вы можете пока собрать свой заказ в корзине и когда мы откроемся, оформить заказ.</div>
                                    <Link to={HOME_ROUTE} className="btn btn-2 mx-auto py-md-3">В каталог</Link>
                                </div>
                            </div>
                        </div>
                    </section>
                    :
                    <section id="sec-15" className="mb-8">
                        <div className="container">
                            <form onSubmit={submit} onChange={change} className="mb-4 mb-sm-5">
                                <h1>Оформление</h1>
                                <div className="row justify-content-between gx-4 gx-xl-5">
                                    <div className="col-md-7 col-xl-8 col-xxl-7">
                                        <fieldset className="mb-4 mb-sm-5">
                                            <legend className="title-font gray-1 fs-15 fw-7 mb-3">Контактные данные</legend>
                                            <div className="box sec-font px-lg-5">
                                                <div className="gray-1 mb-3">Имя</div>
                                                <input type="text" placeholder="Имя" name="name" defaultValue={checkout.name} className="mb-3" />
                                                <div className="gray-1 mb-3">Телефон</div>
                                                <input type="text" placeholder="Номер телефона" name="phone" defaultValue={checkout.phone} className="mb-3" />
                                            </div>
                                        </fieldset>
                                        <fieldset className="mb-4 mb-sm-5">
                                            <legend className="title-font gray-1 fs-15 fw-7 mb-3">Получение заказа</legend>
                                            <div className="box px-lg-5">
                                                <div className="switch fs-12 mb-4">
                                                    <a className={checkout.delivery === 1 ? "switch-option fw-7 active" : "switch-option fw-7"} onClick={() => setCheckout({ ...checkout, delivery: 1 })}>Самовывоз</a>
                                                    <a className={checkout.delivery === 2 ? "switch-option fw-7 active" : "switch-option fw-7"} onClick={() => setCheckout({ ...checkout, delivery: 2 })}>Доставка</a>
                                                </div>

                                                {checkout.delivery === 1 ?
                                                    <div className="row g-2 g-lg-3 sec-font pl-2 pr-2 pt-2">
                                                        Адрес Ресторана: г. Казань, улица 1 мая, дом 5<br />
                                                        Время работы: 10:00 - 23:00
                                                    </div>
                                                    :
                                                    (user.isAuth && user.user.address && user.user.address.length > 0) ?
                                                        <>
                                                            <div className="fs-09 gray-1 mb-4">Выберите адрес для доставки по умолчанию.</div>
                                                            {
                                                                user.user.address.map((item, i) =>
                                                                    <div key={i} className="d-flex align-items-start mb-4">
                                                                        <input type="radio" name="address" value="Адрес Работа" id={"address-" + i} defaultChecked={(i === 0) ?? true} />
                                                                        <div className="ms-2">
                                                                            <label for={"address-" + i} className="gray-1 fw-5">{item.name}</label>
                                                                            <div className="d-flex mt-2">
                                                                                <Link to={PROFILE_ROUTE + '/address/edit/' + item.id} className="fs-09 gray-1 me-3">Редактировать</Link>
                                                                                <button type="button" className="fs-09 gray-4">Удалить</button>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                )
                                                            }
                                                            <Link to={PROFILE_ROUTE + '/address/add'} className="d-flex align-items-center">
                                                                <img src="/images/icons/plus3.svg" alt="Добавить" className="me-2" />
                                                                <span className="primary">Добавить адрес</span>
                                                            </Link>
                                                        </>
                                                        :
                                                        <div className="row g-2 g-lg-3 sec-font">
                                                            <div className="col-sm-8">
                                                                <input type="text" name="street" placeholder="Улица" />
                                                            </div>
                                                            <div className="col-sm-4">
                                                                <input type="text" name="home" placeholder="Дом" />
                                                            </div>
                                                            <div className="col-6 col-sm-3">
                                                                <input type="text" name="entrance" placeholder="Подъезд" />
                                                            </div>
                                                            <div className="col-6 col-sm-3">
                                                                <input type="text" name="code" placeholder="Код двери" />
                                                            </div>
                                                            <div className="col-6 col-sm-3">
                                                                <input type="text" name="floor" placeholder="Этаж" />
                                                            </div>
                                                            <div className="col-6 col-sm-3">
                                                                <input type="text" name="apartment" placeholder="Квартира" />
                                                            </div>
                                                            <div className="col-12">
                                                                <textarea rows="3" name="comment" placeholder="Комментарий к адресу"></textarea>
                                                            </div>
                                                            <div className="col-12">
                                                                <div className="d-flex align-items-center">
                                                                    <input type="checkbox" name="saveaddress" value="save-address" id="save-address" defaultChecked />
                                                                    <label for="save-address" className="ms-3">Сохранить адрес доставки в личном кабинете</label>
                                                                </div>
                                                            </div>
                                                        </div>
                                                }
                                            </div>
                                        </fieldset>
                                        <fieldset className="mb-4 mb-sm-5">
                                            <legend className="title-font gray-1 fs-15 fw-7 mb-3">Время получения</legend>
                                            <div className="box sec-font px-lg-5">
                                                <div className="d-flex align-items-center mb-2">
                                                    <input type="radio" name="time" value={1} id="sooner" defaultChecked />
                                                    <label for="sooner" className="flex-1 ms-2">Как можно скорее</label>
                                                </div>
                                                <div className="d-flex align-items-center">
                                                    <input type="radio" name="time" value={2} id="in-time" />
                                                    <label for="in-time" className="ms-2">Приготовить к </label>
                                                    <input type="time" name="timevalue" className="ms-2 w-fit py-2" defaultValue={time} />
                                                </div>
                                            </div>
                                        </fieldset>
                                        <fieldset>
                                            <legend className="title-font gray-1 fs-15 fw-7 mb-3">Способ оплаты:</legend>
                                            <div className="box sec-font px-lg-5">
                                                <div>
                                                    <div className="title-font gray-1 fs-11 fw-7 mb-3">Выберите способ оплаты:</div>
                                                    <div className="d-flex align-items-center mb-3">
                                                        <input type="radio" name="payment" value="card" id="card" defaultChecked />
                                                        <label for="card" className="ms-2">Банковской картой</label>
                                                    </div>
                                                    <div className="d-flex align-items-center mb-3">
                                                        <input type="radio" name="payment" value="cash" id="cash" />
                                                        <label for="cash" className="ms-2">Наличными</label>
                                                    </div>
                                                    <div className="d-flex align-items-center">
                                                        <input type="radio" name="payment" value="online" id="online" />
                                                        <label for="online" className="ms-2">Онлайн оплата</label>
                                                    </div>
                                                </div>
                                            </div>
                                        </fieldset>
                                    </div>
                                    <div className="col-md-5 col-xl-4 position-relative pt-4 pt-sm-5">
                                        <div className="outcome">
                                            <div className="box mb-4">
                                                <div className="title-font gray-1 fs-15 fw-7 mb-3">Ваша корзина:</div>
                                                <div className="table-resposive">
                                                    <table className="table table-borderless mb-0 title-font fw-6">
                                                        <tbody>
                                                            {
                                                                (cart.cart && cart.cart.length > 0) ?
                                                                    cart.cart.map((cart, i) => {
                                                                        return (
                                                                            <tr>
                                                                                <td>
                                                                                    <div className="primary">{cart.title}</div>
                                                                                    <div className="gray-3">{cart.count} шт</div>
                                                                                </td>
                                                                                <td>
                                                                                    <div className="gray-1 fs-12 text-end">{cart.price * cart.count} ₽</div>
                                                                                </td>
                                                                            </tr>
                                                                        )
                                                                    })
                                                                    : 'Ваша корзина пуста'
                                                            }
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                            <div className="box">
                                                <table className="table table-sm table-borderless title-font">
                                                    <tbody>
                                                        <tr className="fs-12">
                                                            <td className="fw-5">Сумма:</td>
                                                            <td className="fw-6 text-end">{cart.total} ₽</td>
                                                        </tr>
                                                        <tr className="fs-12">
                                                            <td className="fw-5">Доставка:</td>
                                                            <td className="fw-6 text-end">{(cart.total > cart.deliveryMinPrice || checkout.delivery == 1) ? 'Бесплатно' : cart.deliveryPrice + ' ₽'}</td>
                                                        </tr>
                                                        <tr className="fs-20 fw-7">
                                                            <td>К оплате:</td>
                                                            <td className="primary text-end">{(checkout.total) ? checkout.total : 0} ₽</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                                <button disabled={(cart.cart && cart.cart.length > 0 && checkout.phone.length > 7) ? false : true} type="submit" className="btn btn-1 mt-3 w-100 fs-11">Оформить заказ</button>
                                            </div>
                                            <div className="text-center fs-09 gray-3 mt-2">Нажимая на кнопку “Оформить заказ”, вы даете согласие на обработку персональных данных</div>
                                        </div>
                                    </div>
                                </div>
                            </form>
                            <Link to={CART_ROUTE} className="btn btn-2">
                                <img src="/images/icons/chevron-left-2.svg" alt="Вернуться назад" />
                                <span className="ms-2">Вернуться в корзину</span>
                            </Link>
                        </div>
                    </section>
            }
        </main>
    )
})

export default Checkout

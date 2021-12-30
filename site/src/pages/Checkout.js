import React, { useContext, useState, useEffect } from 'react'
import { Context } from "../index"
import { HOME_ROUTE, SHOP_ROUTE, CART_ROUTE, PROFILE_ROUTE } from "../utils/consts"
import { Link } from "react-router-dom"
import { observer } from "mobx-react-lite"
import { setOrder } from "../http/orderAPI"
import CartContent from "../components/Cart"
import InputMask from 'react-input-mask'
import { AddressSuggestions } from 'react-dadata'
import { NotificationManager } from 'react-notifications'
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
        user: (user.isAuth) ? user.user.id : '',
        time: 1,
        timevalue: time,
        payment: 'card',
        delivery: 1,
        total: cart.total,
        products: cart.cart,
        full: '', street: '', home: '', entrance: '', code: '', floor: '', apartment: '',
        address: (user.user.address && user.user.address[0]) ? user.user.address[0] : '',
        saveaddress: true,
        comment: '',
        sale: cart.sale
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

    const submit = async (e) => {
        e.preventDefault()
        if (checkout.delivery == 2) {
            if (checkout.street.length < 1) {
                NotificationManager.error('Заполинте поле Улица')
                return
            }
            if (checkout.home.length < 1) {
                NotificationManager.error('Заполинте поле Дом')
                return
            }
            if (checkout.apartment.length < 1) {
                NotificationManager.error('Заполинте поле Квартира')
                return
            }
        }
        let data = await setOrder(checkout)
        if (data && data.Success && data.PaymentURL) {
            setSendOrder(true)
            cart.removeAllCart()
            window.location = data.PaymentURL
        } else if (data) {
            setSendOrder(true)
            cart.removeAllCart()
        } else {
            NotificationManager.error('Произошла неизвестная ошибка, повторите попытку позже')
        }
    }
    const change = (e) => {
        if (e.target.name === 'address') {
            setCheckout({ ...checkout, [e.target.name]: user.user.address[e.target.value] })
        } else if (e.target.name === 'saveaddress') {
            setCheckout({ ...checkout, [e.target.name]: e.target.checked })
        } else {
            setCheckout({ ...checkout, [e.target.name]: e.target.value })
        }
    }
    const changeAddress = (data) => {
        if (data) {
            setCheckout({
                ...checkout,
                full: (data.value) ? data.value : '',
                street: (data.data.street_with_type) ? data.data.street_with_type : '', //Улица
                home: (data.data.house) ? data.data.house : '', //Дом
                entrance: (data.data.entrance) ? data.data.entrance : '', //Подъезд
                apartment: (data.data.flat) ? data.data.flat : '' //Квартира
            })
        }
    }
    if (sendOrder) {
        return (
            <main>
                <section className="mt-5 mb-5">
                    <div className="container">
                        <div className="row justify-content-center">
                            <div className="col-md-7 col-lg-6 col-xl-5">
                                <h2 className="text-center">Заявка успешно отправлена!</h2>
                                <div className="text-center mb-4 mb-sm-5">Ожидайте звонка оператора от 2 до 15 минут. Мы свяжемся с вами для подтверждения заказа.</div>
                                <Link to={SHOP_ROUTE} className="btn btn-2 mx-auto py-md-3">В каталог</Link>
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
                (timeNow.getHours() === 23 || timeNow.getHours() < 11) ?
                    <section className="mb-8">
                        <div className="container">
                            <div className="row justify-content-center">
                                <div className="col-md-7 col-lg-6 col-xl-5">
                                    <h2 className="text-center">Мы работаем с 11:00 до 23:00</h2>
                                    <div className="text-center mb-4 mb-sm-5">Вы можете пока собрать свой заказ в корзине и когда мы откроемся, оформить заказ.</div>
                                    <Link to={SHOP_ROUTE} className="btn btn-2 mx-auto py-md-3">В каталог</Link>
                                </div>
                            </div>
                        </div>
                    </section>
                    :
                    <section id="sec-15" className="mb-8">
                        <div className="container">
                            <form onSubmit={submit} className="mb-4 mb-sm-5">
                                <h1>Оформление</h1>
                                <div className="row justify-content-between gx-4 gx-xl-5">
                                    <div className="col-md-7 col-xl-8 col-xxl-7">
                                        <fieldset className="mb-4 mb-sm-5">
                                            <legend className="title-font gray-1 fs-15 fw-7 mb-3">Контактные данные</legend>
                                            <div className="box sec-font px-lg-5">
                                                <div className="gray-1 mb-2">Имя</div>
                                                <input type="text" placeholder="Имя" name="name" defaultValue={checkout.name} onChange={change} className="mb-3" />
                                                <div className="gray-1 mb-2">Телефон</div>
                                                <InputMask mask="+7 999 999 99 99" placeholder="+7 000 000 00 00" name="phone" maskChar="" defaultValue={checkout.phone} onChange={change} className="mb-3" />
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
                                                                        <input type="radio" name="address" value={i} id={"address-" + i} onClick={change} defaultChecked={(i === 0) ?? true} />
                                                                        <div className="ms-2">
                                                                            <label for={"address-" + i} className="gray-1 fw-5">{item.name}</label>
                                                                            <div className="d-flex mt-2">
                                                                                <Link to={PROFILE_ROUTE + '/address/edit/' + item.id} className="fs-09 gray-4">Редактировать</Link>
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
                                                            <div className="col-sm-10">
                                                                <div class="gray-1 mb-2">Улица <span className="text-danger">*</span></div>
                                                                <AddressSuggestions inputProps={{ autoComplete: "new-address", placeholder: "Улица" }} name="street" token={process.env.REACT_APP_DADATA_API} filterLocations={[{ "kladr_id": "16" }]} count={6} minChars={1} delay={500} selectOnBlur={true} defaultQuery={checkout.full} onChange={changeAddress} />
                                                            </div>
                                                            <div className="col-2">
                                                                <div class="gray-1 mb-2">Дом <span className="text-danger">*</span></div>
                                                                <input type="text" name="home" placeholder="Дом" onChange={change} value={checkout.home} />
                                                            </div>
                                                            <div className="col-3">
                                                                <div class="gray-1 mb-2">Квартира <span className="text-danger">*</span></div>
                                                                <input type="text" name="apartment" placeholder="Квартира" onChange={change} value={checkout.apartment} />
                                                            </div>
                                                            <div className="col-3">
                                                                <div class="gray-1 mb-2">Подъезд</div>
                                                                <input type="text" name="entrance" placeholder="Подъезд" onChange={change} value={checkout.entrance} />
                                                            </div>
                                                            <div className="col-3">
                                                                <div class="gray-1 mb-2">Этаж</div>
                                                                <input type="text" name="floor" placeholder="Этаж" onChange={change} value={checkout.floor} />
                                                            </div>
                                                            <div className="col-3">
                                                                <div class="gray-1 mb-2">Код двери</div>
                                                                <input type="text" name="code" placeholder="Код двери" onChange={change} value={checkout.code} />
                                                            </div>
                                                            <div className="col-12">
                                                                <div class="gray-1 mb-2">Комментарий</div>
                                                                <textarea rows="3" name="comment" placeholder="Комментарий к заказу" onChange={change} value={checkout.comment}></textarea>
                                                                <div class="mt-2"><span className="text-danger">*</span> - поля обязательные для заполнения</div>
                                                            </div>
                                                            {
                                                                (user.isAuth) ?
                                                                    <div className="col-12">
                                                                        <div className="d-flex align-items-center">
                                                                            <input type="checkbox" name="saveaddress" id="save-address" checked={checkout.saveaddress} onChange={change} />
                                                                            <label for="save-address" className="ms-3">Сохранить адрес доставки в личном кабинете</label>
                                                                        </div>
                                                                    </div>
                                                                    : null
                                                            }

                                                        </div>
                                                }
                                            </div>
                                        </fieldset>
                                        <fieldset className="mb-4 mb-sm-5">
                                            <legend className="title-font gray-1 fs-15 fw-7 mb-3">Время получения</legend>
                                            <div className="box sec-font px-lg-5">
                                                <div className="d-flex align-items-center mb-2">
                                                    <input type="radio" name="time" value={1} id="sooner" onClick={change} defaultChecked />
                                                    <label for="sooner" className="flex-1 ms-2">Как можно скорее</label>
                                                </div>
                                                <div className="d-flex align-items-center">
                                                    <input type="radio" name="time" value={2} onClick={change} id="in-time" />
                                                    <label for="in-time" className="ms-2">Приготовить к </label>
                                                    <input type="time" name="timevalue" className="ms-2 w-fit py-2" onChange={change} defaultValue={time} />
                                                </div>
                                            </div>
                                        </fieldset>
                                        <fieldset>
                                            <legend className="title-font gray-1 fs-15 fw-7 mb-3">Способ оплаты:</legend>
                                            <div className="box sec-font px-lg-5">
                                                <div>
                                                    <div className="title-font gray-1 fs-11 fw-7 mb-3">Выберите способ оплаты:</div>
                                                    <div className="d-flex align-items-center mb-3">
                                                        <input type="radio" name="payment" value="card" id="card" onClick={change} defaultChecked />
                                                        <label for="card" className="ms-2">Банковской картой</label>
                                                    </div>
                                                    <div className="d-flex align-items-center mb-3">
                                                        <input type="radio" name="payment" value="cash" onClick={change} id="cash" />
                                                        <label for="cash" className="ms-2">Наличными</label>
                                                    </div>
                                                    <div className="d-flex align-items-center">
                                                        <input type="radio" name="payment" onClick={change} value="online" id="online" />
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
                                                <CartContent type="checkout" />
                                            </div>
                                            <div className="box">
                                                <table className="table table-sm table-borderless title-font">
                                                    <tbody>
                                                        <tr className="fs-12">
                                                            <td className="fw-5">Сумма:</td>
                                                            <td className="fw-6 text-end">{cart.total + ((cart.sale.total) ? cart.sale.total : 0)} ₽</td>
                                                        </tr>
                                                        {
                                                            (cart.sale.total > 0) &&
                                                            <tr className="fs-12">
                                                                <td><small>{cart.sale.text ? cart.sale.text : 'Скидка: '}</small></td>
                                                                <td className="fw-6 text-end">-{cart.sale.total} ₽</td>
                                                            </tr>
                                                        }
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
                                                <button disabled={(cart.cart && cart.cart.length > 0 && checkout.phone && checkout.phone.length > 7) ? false : true} type="submit" className="btn btn-1 mt-3 w-100 fs-11">Оформить заказ</button>
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

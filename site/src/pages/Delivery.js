import React, { useEffect } from 'react'

const About = () => {
    useEffect(() => {
        document.title = "Доставка и оплата"
    }, [])
    return (
        <main>
            <div className="container mb-4 mb-md-5">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb mb-0">
                        <li className="breadcrumb-item"><a href="index.html">Главная</a></li>
                        <li className="breadcrumb-item"><a href="delivery.html">Доставка и оплата</a></li>
                    </ol>
                </nav>
            </div>

            <section id="sec-8" className="mb-8">
                <div className="container">
                    <h2 className="text-start">Доставка и оплата</h2>
                    <div className="row mb-5">
                        <div className="col-xl-9 col-xxl-7">
                            <p>Бесплатная доставка при заказе от 700 ₽ в черте города.</p>
                            <p>Среднее время доставки 1ч — 1ч 20м.</p>
                            <p>Время доставки может меняться в зависимости от количества заказов.</p>
                            <p>Скидки и акции на доставку не распространяются.</p>
                            <p>Важно понимать, что наш курьер терпеливо подождёт вас 10 минут у входа, если вы вдруг перестанете выходить на связь или не откроете дверь. Но затем ему придётся уезжать к другим Клиентам, чтобы вовремя доставить свежую еду. В этом случае вам будет необходимо повторно связаться с Администратором.</p>
                            <p>Доставку осуществляем в <b>Новосавиновский</b>, <b>Московский</b>, <b>Кировский</b>, <b>Авиастроительный</b>, <b>Центр</b></p>
                        </div>
                    </div>
                    <h5>Способы доставки:</h5>
                    <div className="row row-cols-md-2 row-cols-lg-3 gx-xl-5 mb-5">
                        <div className="d-flex align-items-start mb-4 mb-md-0">
                            <img src="/images/icons/icon-delivery.svg" alt="Доставка курьером" className="icon" />
                            <div className="ms-2 ms-md-3">
                                <div className="fw-5 mb-2">Доставка курьером</div>
                                <p>Бесплатная доставка. Минимальная сумма заказа 700 ₽</p>
                            </div>
                        </div>
                        <div className="d-flex align-items-start">
                            <img src="/images/icons/icon-pickup.svg" alt="Самовывоз" className="icon" />
                            <div className="ms-2 ms-md-3">
                                <div className="fw-5 mb-2">Самовывоз</div>
                                <p>Забрать заказ можно по адресу г. Казань, улица 1 мая, дом 5</p>
                            </div>
                        </div>
                    </div>
                    <h5>Способы оплаты:</h5>
                    <div className="row row-cols-md-2 row-cols-lg-3 gx-xl-5">
                        <div className="d-flex align-items-start mb-4 mb-md-0">
                            <img src="/images/icons/icon-online.svg" alt="Онлайн оплата" className="icon" />
                            <div className="ms-2 ms-md-3">
                                <div className="fw-5 mb-2">Онлайн оплата</div>
                                <p>Принимаются карты Mastercard, Maestro, Visa и МИР.</p>
                            </div>
                        </div>
                        <div className="d-flex align-items-start mb-4 mb-md-0">
                            <img src="/images/icons/icon-courier.svg" alt="Оплата картой курьеру" className="icon" />
                            <div className="ms-2 ms-md-3">
                                <div className="fw-5 mb-2">Оплата картой курьеру</div>
                                <p>Курьер привезёт с собой мобильный платёжный терминал. Принимаются карты Mastercard, Maestro, Visa и МИР.</p>
                            </div>
                        </div>
                        <div className="d-flex align-items-start">
                            <img src="/images/icons/icon-cash.svg" alt="Оплата наличными" className="icon" />
                            <div className="ms-2 ms-md-3">
                                <div className="fw-5 mb-2">Оплата наличными</div>
                                <p>Вы можете оплатить заказ наличными нашему курьеру или при самовывозе</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default About;

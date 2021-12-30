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
                        <div className="col-md-4">
                            <div id="map"></div>
                        </div>
                        <div className="col-md-8">
                            <ul class="ul-style-default">
                                <li>Принятие заказов ежедневно (пн-вс) с 10:00 до 21:45</li>
                                <li>При доставке на расстояние менее 9 км</li>
                                <ul>
                                    <li>Минимальный заказ 450 р</li>
                                    <li>Бесплатная достовка при заказе от 700 р</li>
                                </ul>
                                <li>При доставке на расстояние более 9 км</li>
                                <ul>
                                    <li>Минимальный заказ 1000 р</li>
                                    <li>Бесплатная достовка при заказе от 1500 р</li>
                                </ul>
                                <li>Среднее время доставки составляет от 45 минут. Максимальное время доставки заказа от 60 до 90 минут.</li>
                            </ul>
                            <a>Подробнее о доставке</a>
                        </div>
                    </div>
                    <h2 className="text-start">Варианты оплаты</h2>
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
                </div>
            </section>
        </main>
    );
};

export default About;

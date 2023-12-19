import React, { useEffect } from 'react'
import { OFFER_ROUTE } from "../utils/consts"
import { HashLink as Link } from 'react-router-hash-link';

const About = () => {
    useEffect(() => {
        document.title = "Доставка и оплата"
    }, [])
    return (
        <main>
            <section id="sec-8" className="mb-8">
                <div className="container">
                    <h1 className="h3 fw-6 mb-4 text-center text-md-start">Доставка и оплата</h1>
                    <div className="row mb-5">
                        <div className="col-md-4">
                            <div id="map">
                                <iframe src="https://yandex.ru/map-widget/v1/?from=mapframe&ll=49.187931%2C55.788927&mode=usermaps&source=mapframe&um=constructor%3A7f2814a79acdeedc82b7b4a20adcaf85b6f8d4a0742f360318785ccbb0095946&utm_source=mapframe&z=11" width="100%" height="400"></iframe>
                            </div>
                        </div>
                        <div className="col-md-8">
                            <ul className="ul-style-default">
                                <li>Принятие заказов ежедневно (пн-вс) с 10:00 до 21:00</li>
                                <li>При доставке на расстояние менее 9-13 км</li>
                                <ul className="my-2 my-md-0">
                                    <li>Минимальный заказ 650 р</li>
                                    <li>Бесплатная достовка при заказе от 850 р</li>
                                    <li>При заказе до 850 рублей стоимость доставки составляет 200 рублей.</li>
                                </ul>
                                <li>При доставке на расстояние более 9-13 км</li>
                                <ul className="my-2 my-md-0">
                                    <li>Минимальный заказ 1300 р</li>
                                    <li>Бесплатная достовка при заказе от 1900 р</li>
                                    <li>При заказе до 1900 рублей стоимость доставки составляет 200 рублей.</li>
                                </ul>
                                <li>Среднее время доставки составляет от 45 минут. Максимальное время доставки заказа от 60 до 90 минут.<br />
                                    <Link to={OFFER_ROUTE + '/#delivery'} className="text-success fw-6 d-inline-block color-green mt-3">Подробнее о доставке</Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <h2 className="h3 fw-6 mb-4 text-center text-md-start">Варианты оплаты</h2>
                    <div className="row row-cols-md-3 row-cols-lg-3 mb-5">
                        <div>
                            <div className="text-center card card-body">
                                <h5 className="fw-6 text-center">Курьеру</h5>
                                <div className="d-flex justify-content-center align-items-center mb-3">
                                    <img className="mx-2" src="/images/nal.png" height="35" />
                                    <img className="mx-2" src="/images/visa.png" height="20" />
                                    <img className="mx-2" src="/images/mastercard.png" height="25" />
                                    <img className="mx-2" src="/images/mir.png" height="20" />
                                </div>
                                <p>Наличными или банковской картой через платежный терминал курьеру</p>
                            </div>
                        </div>
                        <div>
                            <div className="text-center card card-body">
                                <h5 className="fw-6 text-center">В ресторане</h5>
                                <div className="d-flex justify-content-center align-items-center mb-3">
                                    <img className="mx-2" src="/images/nal.png" height="35" />
                                    <img className="mx-2" src="/images/visa.png" height="20" />
                                    <img className="mx-2" src="/images/mastercard.png" height="25" />
                                    <img className="mx-2" src="/images/mir.png" height="20" />
                                </div>
                                <p>Наличными или банковской картой через платежный терминал в ресторане</p>
                            </div>
                        </div>
                        <div>
                            <div className="text-center card card-body">
                                <h5 className="fw-6 text-center">На сайте</h5>
                                <div className="d-flex justify-content-center align-items-center mb-3">
                                    <img className="mx-2" src="/images/visa.png" height="20" />
                                    <img className="mx-2" src="/images/mastercard.png" height="25" />
                                    <img className="mx-2" src="/images/mir.png" height="20" />
                                </div>
                                <p>Банковской картой через безопасный платежный сервис веб-сайта</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default About;

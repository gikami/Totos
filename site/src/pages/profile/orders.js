import React from 'react';
import { Link, useParams } from "react-router-dom";
import { PROFILE_ROUTE, SHOP_ROUTE, HOME_ROUTE } from "../../utils/consts";
import SideBar from "./components/menu";

const Orders = () => {
    const { id } = useParams()
    return (
        <main>
            <div className="container mb-4 mb-md-5">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb mb-0">
                        <li className="breadcrumb-item"><Link to={HOME_ROUTE}>Главная</Link></li>
                        <li className="breadcrumb-item"><a>История заказов</a></li>
                    </ol>
                </nav>
            </div>

            <section id="sec-13" className="mb-8">
                <div className="container">
                    <div className="row">
                        <SideBar />
                        <div className="col-md-8 col-xl-7 col-xxl-6 offset-xl-1">
                            <h5>История заказов</h5>
                            <div className="gray-2 text-start mb-4">У вас пока не было ни одного заказа. Добавляйте <br /> товары и оформите свой первый заказ.</div>
                            <Link to={SHOP_ROUTE} className="btn btn-2 mb-5">В каталог</Link>

                            <h5>История заказов</h5>
                            <div className="order-history mt-4 mt-lg-5 mb-5">
                                <div className="head">
                                    <div>Состав</div>
                                    <div>Адрес доставки</div>
                                    <div>Дата заказа</div>
                                    <div>Сумма</div>
                                </div>
                                <div className="body">
                                    <div className="order">
                                        <div>
                                            <div className="gray-1 fw-5">Заказ № 67</div>
                                            <div className="gray-2 mt-2">Пицца «Маргарита»</div>
                                        </div>
                                        <div>
                                            <div className="gray-1 fw-5">Самовывоз</div>
                                            <div className="gray-2 mt-2">ТЦ Олимп, ул. Бутлерова, 30</div>
                                        </div>
                                        <div>
                                            <div className="gray-1">23.09.2021</div>
                                        </div>
                                        <div>
                                            <div className="gray-1 fw-5">3 800 ₽</div>
                                        </div>
                                    </div>
                                    <div className="order">
                                        <div>
                                            <div className="gray-1 fw-5">Заказ 23</div>
                                            <div className="gray-2 mt-2">Пицца «Маргарита»</div>
                                            <div className="gray-2 mt-2">Пицца «Фрутти ди Маро»</div>
                                            <div className="gray-2 mt-2">Пицца «Маргарита»</div>
                                        </div>
                                        <div>
                                            <div className="gray-1 fw-5">Доставка</div>
                                            <div className="gray-2 mt-2">г. Казань, Вахитовский р-н, ул. Большая Красная, д. 48, кв. 7</div>
                                        </div>
                                        <div>
                                            <div className="gray-1">18.09.2021</div>
                                        </div>
                                        <div>
                                            <div className="gray-1 fw-5">1 200 ₽</div>
                                        </div>
                                    </div>
                                    <div className="order">
                                        <div>
                                            <div className="gray-1 fw-5">Заказ № 1</div>
                                            <div className="gray-2 mt-2">Пицца «Маргарита»</div>
                                            <div className="gray-2 mt-2">Пицца «Фрутти ди Маро»</div>
                                        </div>
                                        <div>
                                            <div className="gray-1 fw-5">Самовывоз</div>
                                            <div className="gray-2 mt-2">Парк Хаус, пр-т. Хусаина Ямашева</div>
                                        </div>
                                        <div>
                                            <div className="gray-1">12.09.2021</div>
                                        </div>
                                        <div>
                                            <div className="gray-1 fw-5">900 ₽</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <Link to={PROFILE_ROUTE} className="gray-3 d-flex align-items-center">
                                <img src="/images/icons/chevron-left.svg" alt="Вернуться назад" className="me-1" />
                                Вернуться назад
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    )
};

export default Orders;

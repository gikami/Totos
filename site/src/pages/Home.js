import React, { useContext, useEffect } from 'react';
import { observer } from "mobx-react-lite";
import { Link } from "react-router-dom";
import { SHOP_ROUTE } from "../utils/consts";
import CategoryBar from "../components/CategoryBar";
import ProductList from "../components/ProductList";
import { Context } from "../index";
import { fetchProducts, fetchCategory } from "../http/productAPI";
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, { Navigation, Pagination } from 'swiper';
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';
SwiperCore.use([Navigation, Pagination]);
const Home = observer(() => {
    const { product } = useContext(Context)

    useEffect(() => {
        document.title = "Доставка вкуснейших роллов и пиццы на дом и в офис по Казани."
        fetchCategory().then(data => {
            product.setCategory(data)
            if (!product.selectedCategory.api_id) {
                product.setSelectedCategory(data[0])
            }
            fetchProducts((product.selectedCategory.api_id) ? product.selectedCategory.api_id : data[0].api_id, 1, 40).then(data => {
                if (data) {
                    product.setProducts(data.rows)
                    product.setTotalCount(data.count)
                }
            })
        })
    }, [])
    useEffect(() => {
        if (product.selectedCategory) {
            fetchProducts(product.selectedCategory.api_id, product.page, 8).then(data => {
                product.setProducts(data.rows)
                product.setTotalCount(data.count)
            })
        }
    }, [product.page, product.selectedCategory])

    return (
        <div>
            <section id="sec-1" className="d-none d-md-block mb-5">
                <div className="container">
                    <div id="main-slider" className="carousel slide" data-bs-ride="carousel" data-bs-interval="15000">
                        <div className="carousel-indicators">
                            <button type="button" data-bs-target="#main-slider" data-bs-slide-to="0" className="active"
                                aria-current="true" aria-label="Slide 1"></button>
                            <button type="button" data-bs-target="#main-slider" data-bs-slide-to="1"
                                aria-label="Slide 2"></button>
                            <button type="button" data-bs-target="#main-slider" data-bs-slide-to="2"
                                aria-label="Slide 3"></button>
                        </div>
                        <div className="carousel-inner">
                            <div className="carousel-item active">
                                <div className="row align-items-center">
                                    <div className="offset-xl-1 col-5 col-xl-4">
                                        <h3 className="text-start text-uppercase mb-3">При заказе от 800 рублей пицца Маргарита в подарок</h3>
                                        <Link to={SHOP_ROUTE} className="btn btn-1 btn-shad fs-17 mt-5">Перейти в меню</Link>
                                    </div>
                                    <div className="col-7">
                                        <img src="/images/img-1.png" alt="" className="img-slider" />
                                    </div>
                                </div>
                            </div>
                            <div className="carousel-item">
                                <div className="row align-items-center">
                                    <div className="offset-1 col-4">
                                        <h3 className="text-start text-uppercase mb-3">Сладкий подарок к каждому заказу!</h3>
                                        <Link to={SHOP_ROUTE} className="btn btn-1 btn-shad fs-17 mt-5">Перейти в меню</Link>
                                    </div>
                                    <div className="col-7">
                                        <img src="/images/img-1.png" alt="" className="img-slider" />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <button className="carousel-control-prev" type="button" data-bs-target="#main-slider"
                            data-bs-slide="prev">
                            <img src="/images/icons/prev-white.svg" alt="" />
                        </button>
                        <button className="carousel-control-next" type="button" data-bs-target="#main-slider"
                            data-bs-slide="next">
                            <img src="/images/icons/next-white.svg" alt="" />
                        </button>
                    </div>
                </div>
            </section>
            <main>
                <section className="sec-2">
                    <div className="container">
                        <h2>Наше меню</h2>
                    </div>
                </section>
                <CategoryBar />
                <section className="sec-2 mb-8">
                    <div className="container">
                        <ProductList />
                        <div className='d-flex justify-content-center'>
                            <Link to={SHOP_ROUTE} className="btn btn-1 fs-14 mt-5 mb-3">Все меню</Link>
                        </div>
                    </div>
                </section>

                <section id="sec-4" className="position-relative mb-8">
                    <div className="container">
                        <h2 className="text-center">Мы – профессионалы своего дела</h2>
                        <div className="row flex-md-row-reverse">
                            <div className="col-md-6 col-xxl-7">
                                <div className="about-collage">
                                    <img src="/images/img-2.jpg" alt="Только свежие ингредиенты" id="img-1" className="round-img" />
                                    <img src="/images/img-3.jpg" alt="Готовим пиццу в печи" id="img-2" className="round-img" />
                                    <img src="/images/img-4.jpg" alt="Доставим за 60 минут" id="img-3" className="round-img" />
                                </div>
                            </div>
                            <div className="col-md-6 col-xxl-5 py-lg-5">
                                <h4 className="text-start mb-3">Качественные ингредиенты</h4>
                                <div className="fs-11">Мы используем только проверенных поставщиков, и отслеживаем качество продукции на всех этапах производства! Что гарантирует вам не только вкусный а главное полезный продукт ! Мы используем только охлажденную рыбу для наших роллов! Попробовав один раз, ты останешься с нами навсегда!</div>

                                <h4 className="text-start mb-3 mt-4 mt-lg-5">Проще простого</h4>
                                <div className="fs-11">У вас намечается вечеринка с множеством гостей? Хотите устроить своей половинке романтический ужин при свечах? Или планируете полностью расслабиться и вкусно поесть в кругу семьи? Вам не нужно проводить часы на кухне. Просто закажите суши — их любят многие! Профессиональные повара сделают все за вас, а курьеры доставят свежеприготовленную еду в кратчайший срок.</div>
                                <h4 className="text-start mb-3 mt-4 mt-lg-5">Как мы работаем</h4>
                                <div className="fs-11">Повара начинают готовить еду только после вашего звонка.<br />
                                    Готовим суши по фирменной рецептуре.<br />
                                    Недорогие, но щедрые порции свежих блюд.<br />
                                    Регулярно проводим акции.<br />
                                    Гарантируем доставку еды с соблюдением всех технологий транспортировки, чтобы вы всегда получали свежие и теплые блюда.<br />
                                    При покупке от 700 рублей доставляем еду за свой счет.<br />
                                    Возможен самовывоз из удобного для вас ресторана нашей сети.
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section id="sec-5" className="mb-8">
                    <div className="container">
                        <h2>Акции <span className="d-none d-sm-inline">и спецпредложения</span></h2>
                        <div className="position-relative">
                            <Swiper
                                className="swiper-offers"
                                slidesPerView={2}
                                spaceBetween={4}
                                breakpoints={{
                                    767: {
                                        slidesPerView: 2,
                                        spaceBetween: 16,
                                    },
                                    992: {
                                        slidesPerView: 3,
                                        spaceBetween: 16,
                                    }
                                }}
                                navigation={{
                                    nextEl: '.swiper-button-next',
                                    prevEl: '.swiper-button-prev',
                                }}
                            >
                                <SwiperSlide>
                                    <div className="offer">
                                        <div className="visual">
                                            <img src="/images/sale1.png" alt="" />
                                        </div>
                                    </div>
                                </SwiperSlide>
                                <SwiperSlide>
                                    <div className="offer">
                                        <div className="visual">
                                            <img src="/images/sale2.png" alt="" />
                                        </div>
                                    </div>
                                </SwiperSlide>
                                <SwiperSlide>
                                    <div className="offer">
                                        <div className="visual">
                                            <img src="/images/sale3.png" alt="" />
                                        </div>
                                    </div>
                                </SwiperSlide>
                            </Swiper>
                        </div>
                    </div>
                </section>

                <section id="sec-6" className="d-none d-md-block">
                    <div className="container">
                        <h2>Контакты</h2>
                        <div className="row g-0">
                            <div className="col-5 px-4 px-xl-5">
                                <h5>Телефоны: </h5>
                                <div className="fs-15 mb-2"><a href="tel:+7(843)255-51-33">+7 (843) 255-51-33</a></div>
                                <h5 className="mt-4 mt-xl-5">Время работы: </h5>
                                <div className="fs-15 mb-2">Заказы на доставку <br />принимаются с 10:00 до 23:00</div>
                                <h5 className="mt-4 mt-xl-5">Адрес: </h5>
                                <div className="fs-15 mb-2">г. Казань, улица 1 мая, дом 5</div>
                                <h5 className="mt-4 mt-xl-5">Вопросы и предложения: </h5>
                                <div className="fs-15">
                                    <a href="mailto:Lesha.samatov.94@mail.ru">Lesha.samatov.94@mail.ru</a>
                                </div>
                            </div>
                            <div className="col-7">
                                <div id="map">

                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div >
    );
});

export default Home;

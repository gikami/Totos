import React, { useEffect } from 'react'

import { Swiper, SwiperSlide } from 'swiper/react';

const About = () => {
    useEffect(() => {
        document.title = "О нас"
    }, [])
    return (
        <main>

            <div className="container mb-4 mb-md-5">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb mb-0">
                        <li className="breadcrumb-item"><a href="index.html">Главная</a></li>
                        <li className="breadcrumb-item"><a href="about.html">О нас</a></li>
                    </ol>
                </nav>
            </div>

            <section id="sec-12" className="mb-8">
                <div className="container">
                    <h1>О нас</h1>
                    <div className="row mb-5">
                        <div className="col-xl-9">
                            <p className="fs-12 lh-15">Мы небольшая стабильно развивающаяся компания по доставке еды. Чтобы радовать наших клиентов, мы используем только высококачественные ингредиенты, а наши повара отдают частичку своей души в процессе приготовления наших блюд. Находимся мы по адресу г. Казань, улица 1 мая, дом 5</p>
                        </div>
                    </div>
                </div>
                <div className="container-left">

                    <div className="swiper-gallery">
                        <Swiper
                            spaceBetween={16}
                            slidesPerView={'auto'}
                            freeMode={true}
                            breakpoints={{
                                992: {
                                    spaceBetween: 24,
                                }
                            }}
                            onSlideChange={() => console.log('slide change')}
                            onSwiper={(swiper) => console.log(swiper)}
                        >
                            <SwiperSlide><img src="/images/img-13.jpg" alt="" /></SwiperSlide>
                            <SwiperSlide><img src="/images/img-14.jpg" alt="" /></SwiperSlide>
                            <SwiperSlide><img src="/images/img-15.jpg" alt="" /></SwiperSlide>
                            <SwiperSlide><img src="/images/img-16.jpg" alt="" /></SwiperSlide>
                            <SwiperSlide><img src="/images/img-17.jpg" alt="" /></SwiperSlide>
                            <SwiperSlide><img src="/images/img-9.jpg" alt="" /></SwiperSlide>
                        </Swiper>
                        <div className="swiper-pagination"></div>
                    </div>
                </div>
            </section>

            <section className="mb-8">
                <div className="container">
                    <div className="row justify-content-center text-center">
                        <div className="col-sm-4 col-md-3 col-lg-2 mb-4 mb-sm-0">
                            <div className="primary fs-20 title-font fw-7">400+</div>
                            <div className="fs-12 sec-font mt-2 mt-sm-3">позиций в меню</div>
                        </div>
                        <div className="col-sm-4 col-md-3 col-lg-2 mb-4 mb-sm-0">
                            <div className="primary fs-20 title-font fw-7">20</div>
                            <div className="fs-12 sec-font mt-2 mt-sm-3">сотрудников</div>
                        </div>
                        <div className="col-sm-4 col-md-3 col-lg-2">
                            <div className="primary fs-20 title-font fw-7">3</div>
                            <div className="fs-12 sec-font mt-2 mt-sm-3">пиццерии</div>
                        </div>
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

            <section id="sec-6" className="d-none d-md-block">
                <div className="container">
                    <h2>Контакты</h2>
                    <div className="row g-0">
                        <div className="col-6">
                            <h5>Телефоны:</h5>
                            <div className="fs-15 mb-2"><a href="tel:+78432555133">+7 (843) 2-555-133</a></div>
                            <h5 className="mt-4 mt-xl-5">Время работы:</h5>
                            <div className="fs-15 mb-2">Заказы на доставку <br />принимаются с 10:00 до 23:00</div>
                            <h5 className="mt-4 mt-xl-5">Адрес:</h5>
                            <div className="fs-15 mb-2">г. Казань, улица 1 мая, дом 5</div>
                        </div>
                        <div className="col-6">
                            <h5>Реквезиты:</h5>
                            <div className="fs-15 mb-2">ИП Алексеев А.В.</div>
                            <div className="fs-15 mb-2">460511, Оренбургская область, Оренбургский район, село Павловка, улица Парковая, дом 21</div>
                            <div className="fs-15 mb-2">ИНН: 564202694872</div>
                            <div className="fs-15 mb-2">Расчетный счет: 40802810902500119126</div>
                            <div className="fs-15 mb-2">Корреспондентский счет: 30101810845250000999</div>
                            <div className="fs-15 mb-2">БИК: 044525999</div>
                            <div className="fs-15"><a href="mailto:Lesha.samatov.94@mail.ru">E-mail: Lesha.samatov.94@mail.ru</a></div>
                        </div>
                    </div>
                </div>
            </section>
        </main >
    );
};

export default About;

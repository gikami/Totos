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

            <section id="sec-about" className="position-relative mb-8">
                <div className="container">
                    <h2 class="text-start">О нас</h2>
                    <div className="row">
                        <div className="col-md-4">
                            <div className="about-collage">
                                <img src="/images/about-1.png" alt="Только свежие ингредиенты" id="img-1" className="round-img w-100" />
                            </div>
                        </div>
                        <div className="col-md-8 py-md-5">
                            <div className="fs-15 mb-3"><b>TOTO’S PIZZA</b> - компания и пиццерия, основанная в 2016 году под руководством итальянского Шефа ТОТО, который является главным наставником и вдохновителем кулинарных идей. Каждый раз приезжая в Россию, он бережно передаёт свои знания и многолетний опыт команде <b>TOTO'S PIZZA</b> и постоянно привносит новые идеи.</div>
                            <div className="fs-15"><b>TOTO’S PIZZA</b> – интернациональный кулинарный проект Италия-Россия. Главная миссия компании - предоставить возможность наслаждаться итальянской пиццей и другими блюдами итальянской кухни превосходного качества по доступной цене. А непринужденная дружеская атмосфера в пиццериях будет переносить вас в солнечную приветливую Италию</div>
                        </div>
                    </div>
                </div>
            </section>
            <section id="sec-about" className="position-relative mb-8">
                <div className="container">
                    <div className="row flex-md-row-reverse">
                        <div className="col-md-4 d-md-flex justify-content-end">
                            <div className="about-collage">
                                <img src="/images/about-2.png" alt="Только свежие ингредиенты" id="img-1" className="round-img w-100" />
                            </div>
                        </div>
                        <div className="col-md-8 py-md-5">
                            <div className="fs-15 mb-3">Пицца, изготовленная в «<b>TOTO'S PIZZA</b>», отличается непревзойденным вкусом. Выпеченная из тонкого хрустящего теста, аккуратно украшенная нарезанными овощами и мясом, она станет настоящим украшением любого стола в кругу семьи, друзей и коллег. А разнообразие вкусов Вас приятно удивит!</div>
                            <div className="fs-15">– «А те, кто говорят, что счастье не купишь за деньги, просто еще не пробовали пиццы от <b>TOTO'S PIZZA</b>». Наша пицца особенная благодаря тесту, которое делается исключительно на оливковом масле первого отжима, муки лучшего качества, при долгой холодной ферментации теста, благодаря чему из него извлекаются вредные сахара и крахмал.</div>
                        </div>
                    </div>
                </div>
            </section>
            <section id="sec-about" className="position-relative mb-8">
                <div className="container">
                    <div className="row">
                        <div className="col-md-4">
                            <div className="about-collage">
                                <img src="/images/about-3.png" alt="Только свежие ингредиенты" id="img-1" className="round-img w-100" />
                            </div>
                        </div>
                        <div className="col-md-8 py-md-5">
                            <div className="fs-15 mb-3"><b>TOTO'S PIZZA</b> – компания, для которой гастрономическое и эмоциональное удовольствие клиента стоят на первом месте. Наши неоспоримые преимущества: высокое качество, непревзойденный вкус, разнообразный ассортимент, авторские рецепты, доступные цены, возможность доставки.</div>
                            <div className="fs-15">Высшая награда для команды <b>TOTO'S PIZZA</b> - чтобы наш клиент был доволен сделанным выбором и непременно вернулся к нам за новой порцией своего счастья, ведь быть счастливым – это наслаждаться жизнью в её полном многообразии проявлений, а вкусная еда – одна из них!</div>
                        </div>
                    </div>
                </div>
            </section>
        </main >
    );
};

export default About;

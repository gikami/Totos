import React, { useContext, useEffect } from 'react'
import ProductList from "../components/ProductList"
import { observer } from "mobx-react-lite"
import { Context } from "../index"
import { fetchProducts, fetchCategory } from "../http/productAPI"

import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, { Navigation, Pagination } from 'swiper'
SwiperCore.use([Navigation, Pagination])

const Home = observer(() => {
    const { product } = useContext(Context)
    useEffect(() => {
        document.title = "Доставка вкуснейшей пиццы на дом и в офис по Казани."
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
        <main>
            <section id="sec-12">
                <Swiper
                    loop={true}
                    className="swiper-gallery"
                    slidesPerView={1}
                    centeredSlides={true}
                    spaceBetween={20}
                    modules={[Navigation, Pagination]}
                    navigation
                    pagination={{ clickable: true }}
                    breakpoints={{
                        767: {
                            slidesPerView: 2,
                            spaceBetween: 20,
                        },
                        992: {
                            slidesPerView: 2,
                            spaceBetween: 20,
                        }
                    }}
                >
                    <SwiperSlide><img src="/images/homeslider1.png" alt="" className='img-fluid' /></SwiperSlide>
                    <SwiperSlide><img src="/images/homeslider1.png" alt="" className='img-fluid' /></SwiperSlide>
                    <SwiperSlide><img src="/images/homeslider1.png" alt="" className='img-fluid' /></SwiperSlide>
                    <SwiperSlide><img src="/images/homeslider1.png" alt="" className='img-fluid' /></SwiperSlide>
                    <SwiperSlide><img src="/images/homeslider1.png" alt="" className='img-fluid' /></SwiperSlide>
                </Swiper>
            </section>
            <section className="sec-2 mb-8 mt-3 mt-md-5">
                <div className="container">
                    <div class="p-2">
                        <div class="fs-15"><b>{product.selectedCategory.title}</b></div>
                    </div>
                    <ProductList />
                </div>
            </section>
        </main>
    );
});

export default Home;
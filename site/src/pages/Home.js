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
        document.title = "Меню БизонФуд. Доставка вкуснейших роллов и пиццы на дом и в офис по Казани."
        fetchCategory().then(data => {
            if (data) {
                product.setCategory(data)
                if (!product.selectedCategory.api_id) {
                    product.setSelectedCategory(data[0])
                }
                fetchProducts((product.selectedCategory) ? product.selectedCategory.api_id : (data[0]) && data[0].api_id, 1, 40).then(data => {
                    if (data) {
                        product.setProducts(data.rows)
                        product.setTotalCount(data.count)
                    }
                })
            }
        })
    }, [])

    useEffect(() => {
        if (product.selectedCategory && product.selectedCategory.api_id) {
            fetchProducts(product.selectedCategory.api_id, product.page, 40).then(data => {
                product.setProducts(data.rows)
                product.setTotalCount(data.count)
            })
        }
    }, [product.page, product.selectedCategory])

    return (
        <main>
            <div className="swiper-gallery">
                <Swiper
                    loop={true}
                    slidesPerView={2}
                    centeredSlides={true}
                    spaceBetween={20}
                >
                    <SwiperSlide><img src="/images/homeslider1.png" alt="" className='img-fluid' /></SwiperSlide>
                    <SwiperSlide><img src="/images/homeslider1.png" alt="" className='img-fluid' /></SwiperSlide>
                    <SwiperSlide><img src="/images/homeslider1.png" alt="" className='img-fluid' /></SwiperSlide>
                    <SwiperSlide><img src="/images/homeslider1.png" alt="" className='img-fluid' /></SwiperSlide>
                    <SwiperSlide><img src="/images/homeslider1.png" alt="" className='img-fluid' /></SwiperSlide>
                </Swiper>
            </div>
            <section className="sec-2 mb-8 mt-5">
                <div className="container">
                    <div class="p-2">
                        <h6><b>{product.selectedCategory.title}</b></h6>
                    </div>
                    <ProductList />
                </div>
            </section>
        </main>
    );
});

export default Home;
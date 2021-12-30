import React, { useContext, useState } from 'react'
import { observer } from "mobx-react-lite"
import { Context } from "./../index"
import DopItem from "./../components/DopItem"
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, { Navigation, Pagination } from 'swiper';
SwiperCore.use([Navigation, Pagination]);
const DopList = observer(({ product, dop }) => {
    if (product && dop) {
        return (
            <>
                <h3 class="fw-7 mb-4">Добавить ингредиент</h3>
                <Swiper
                    className="swiper-6 mb-5"
                    slidesPerView={2}
                    spaceBetween={4}
                    breakpoints={{
                        767: {
                            slidesPerView: 3,
                            spaceBetween: 16,
                        },
                        992: {
                            slidesPerView: 5,
                            spaceBetween: 16,
                        }
                    }}
                    navigation={{
                        nextEl: '.swiper-button-next',
                        prevEl: '.swiper-button-prev',
                    }}
                >
                    {
                        dop.map(item => {
                            return (
                                <SwiperSlide key={item.id}>
                                    <DopItem product={product} dop={item} />
                                </SwiperSlide>
                            )
                        })
                    }
                </Swiper>
            </>
        )
    } else {
        return false
    }
})

export default DopList

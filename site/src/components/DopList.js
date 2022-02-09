import React from 'react'
import { observer } from "mobx-react-lite"
import DopItem from "./../components/DopItem"
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, { Navigation, Pagination } from 'swiper';
SwiperCore.use([Navigation, Pagination]);

const DopList = observer(({ product, dop }) => {
    if (product && dop) {
        return (
            <>
                <Swiper
                    className="swiper-6 mb-5"
                    slidesPerView={2}
                    spaceBetween={5}
                    breakpoints={{
                        767: {
                            slidesPerView: 3,
                            spaceBetween: 5,
                        },
                        992: {
                            slidesPerView: 3,
                            spaceBetween: 5,
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
                                <SwiperSlide className="p-2" key={item.id}>
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

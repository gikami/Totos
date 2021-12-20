import React, { useContext, useRef } from 'react'
import { observer } from "mobx-react-lite"
import { Context } from "../index"
import { Swiper, SwiperSlide } from 'swiper/react'
const CategoryBar = observer(() => {
    const { product } = useContext(Context)
    const myRef = useRef()
    const scrollTo = () => myRef.current.scrollIntoView({ behavior: 'smooth' })

    return (
        <>
            <div ref={myRef}></div>
            <section className="sec-2 mb-3 mb-sm-5 mb-md-5" id="soop-menu">
                <div className="container p-0">
                    <Swiper
                        className="soops"
                        slidesPerView={'auto'}
                        freeMode={true}
                    >
                        {product.category.map(category =>
                            <SwiperSlide>
                                <a key={category.id} onClick={() => { product.setSelectedCategory(category); scrollTo() }} className={(category.id === product.selectedCategory.id) ? 'btn soop active' : 'btn soop'}>{category.title}</a>
                            </SwiperSlide>
                        )}
                    </Swiper>
                </div>
            </section>
        </>
    );
});

export default CategoryBar;

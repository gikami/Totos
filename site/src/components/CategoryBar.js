import React, { useContext } from 'react'
import { Context } from "../index"
import { observer } from "mobx-react-lite"
import { Swiper, SwiperSlide } from 'swiper/react'

const CategoryBar = observer(() => {
    const { product } = useContext(Context)

    return (
        <>
            <div className="sec-2" id="soop-menu">
                <div className="container p-0">
                    <div class="d-flex">
                        <div class="w-100">
                            <Swiper
                                className="soops"
                                slidesPerView={'auto'}
                                freeMode={true}
                            >
                                {product.category.map((category, i) =>
                                    <SwiperSlide>
                                        <a key={category.id} onClick={() => product.setSelectedCategory(category)} className={(category.id === product.selectedCategory.id) ? 'btn soop active' : 'btn soop'}>{category.title}</a>
                                    </SwiperSlide>
                                )}
                            </Swiper>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
});

export default CategoryBar;

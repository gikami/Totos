import React, { useContext, useEffect } from 'react'
import CategoryBar from "../components/CategoryBar"
import ProductList from "../components/ProductList"
import { observer } from "mobx-react-lite"
import { Context } from "../index"
import { Link } from "react-router-dom";
import { HOME_ROUTE } from "../utils/consts";
import { fetchProducts, fetchCategory } from "../http/productAPI"
import Pages from "../components/Pages"
import { Swiper, SwiperSlide } from 'swiper/react'
import SwiperCore, { Navigation, Pagination } from 'swiper'
SwiperCore.use([Navigation, Pagination])

const Shop = observer(() => {
    const { product } = useContext(Context)

    useEffect(() => {
        document.title = "Меню БизонФуд. Доставка вкуснейших роллов и пиццы на дом и в офис по Казани."
        fetchCategory().then(data => {
            product.setCategory(data)
            product.setSelectedCategory(data[0])
        })
        fetchProducts(null, 1, 40).then(data => {
            if (data) {
                product.setProducts(data.rows)
                product.setTotalCount(data.count)
            }
        })
    }, [])

    useEffect(() => {
        fetchProducts(product.selectedCategory.api_id, product.page, 40).then(data => {
            product.setProducts(data.rows)
            product.setTotalCount(data.count)
        })

    }, [product.page, product.selectedCategory])

    return (
        <main>
            <div className="container mb-4 mb-md-5">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb mb-0">
                        <li className="breadcrumb-item"><Link to={HOME_ROUTE}>Главная</Link></li>
                        <li className="breadcrumb-item"><a>Меню</a></li>
                    </ol>
                </nav>
            </div>
            <section className="sec-2">
                <div className="container d-flex justify-content-between justify-content-md-center">
                    <h2>Наше меню</h2>
                </div>
            </section>

            <CategoryBar />

            <section className="sec-2 mb-8">
                <div className="container">
                    <ProductList />
                </div>
            </section>
        </main>
    );
});

export default Shop;
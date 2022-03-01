import React, { useContext, useEffect, useState } from 'react'
import MetaTags from 'react-meta-tags'
import ProductList from "../components/ProductList"
import { observer } from "mobx-react-lite"
import { Context } from "../index"
import Radio from "./../components/Radio"
import DopList from "./../components/DopList"
import { Modal, CloseButton } from "react-bootstrap"
import { useParams, useHistory, Link } from "react-router-dom"
import { fetchProducts, fetchOneProduct } from "../http/productAPI"
import { HOME_ROUTE } from "../utils/consts"
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, { Navigation, Pagination } from 'swiper'
SwiperCore.use([Navigation, Pagination])

const Home = observer(() => {
    const { product, cart } = useContext(Context)
    const { productId, catalogId } = useParams()
    const [dop, setDop] = useState(false)
    const history = useHistory();
    const [show, setShow] = useState(true)
    const [btnAdd, setBtnAdd] = useState({ status: false, count: 1 })

    const handleClose = () => history.push(HOME_ROUTE)

    const addCart = () => {
        cart.setCart(product.product)
        setBtnAdd(cart.checkCart(product.product))
    }
    const subCategory = (selectCategory) => {
        fetchProducts(selectCategory, product.page, 30).then(data => {
            product.setProducts(data.rows)
            product.setTotalCount(data.count)
        })
    }

    useEffect(() => {
        document.title = "Доставка вкуснейших роллов и пиццы на дом и в офис по Казани."
    }, [])

    useEffect(() => {
        if (catalogId) {
            let selectCategory = product.category.find(el => el.id == catalogId)
            if (selectCategory) {
                product.setSelectedCategory(selectCategory)
            }
        }
        if (product.selectedCategory) {
            fetchProducts(product.selectedCategory, product.page, 30).then(data => {
                product.setProducts(data.rows)
                product.setTotalCount(data.count)
            })
        }
    }, [product.page, product.selectedCategory, product.category])

    useEffect(() => {
        if (productId) {
            fetchOneProduct(productId).then(data => {
                if (data) {
                    if (data.product.attribute && data.product.attribute[1]) {
                        setDop(data.product.attribute[1])
                    }
                    product.setProduct(data.product)
                }
            })
        }
    }, [productId])

    return (
        <>
            {
                (productId) &&
                <>
                    <MetaTags>
                        <title>{product.product.title}</title>
                        <meta name="description" content={product.product.title} />
                        <meta property="og:title" content={product.product.title} />
                        <meta property="og:image" content={process.env.REACT_APP_API_URL + '/' + product.product.image} />
                    </MetaTags>
                    <Modal show={show} onHide={handleClose} dialogClassName="modal-90w product-modal">
                        <CloseButton aria-label="Hide" onClick={handleClose} />
                        <Modal.Body>
                            {
                                product.product ?
                                    <div className="short-info row">
                                        <div className="col-md-5">
                                            <div className="img-prod mb-5 mb-md-0">
                                                {(product.product.image) ? <img className="w-100" src={process.env.REACT_APP_API_URL + '/products/' + product.product.image} alt={product.product.title} /> : null}
                                            </div>
                                        </div>
                                        <div className="col-md-7">
                                            <div className="d-flex justify-content-between align-items-center mb-3">
                                                <h1 className="h2 fw-6 mb-0">{product.product.title}</h1>
                                                {
                                                    <div className="fs-14 fw-5 text-secondary">{product.product.weight * 1000} г</div>
                                                }
                                            </div>
                                            <div className="text-secondary fs-14 mb-4"><span className="me-2">{(product.product.mini_description) ? product.product.mini_description : (product.product.description) ? product.product.description : 'Нет состава'}</span></div>
                                            {
                                                (product.product.attribute && product.product.attribute[0]) && <Radio />
                                            }
                                            {
                                                (dop) ?
                                                    <>
                                                        <h5 className="fw-6">Дополнительные ингредиенты:</h5>
                                                        <div className="dop-scroll">
                                                            <DopList product={product.product} dop={dop} />
                                                        </div>
                                                    </>
                                                    : <div className="dop-scroll"></div>
                                            }
                                            {/* <div className="add-to-cart">
                                                <div className="add-count justify-content-evenly" style={{ top: (btnAdd) ? "0%" : "-100%" }}>
                                                    <button className="btn-mini" type="button" onClick={minusCount}>
                                                        <img src="/images/icons/minus2.svg" alt="" />
                                                    </button>
                                                    <input type="number" placeholder="1" value={count} onChange={changeCount} readOnly={true} />
                                                    <button className="btn-mini" type="button" onClick={plusCount}>
                                                        <img src="/images/icons/plus2.svg" alt="" />
                                                    </button>
                                                </div>
                                            </div> */}
                                            <div className="d-none d-md-flex justify-content-between align-items-center mt-4">
                                                <button type="button" onClick={addCart} className="btn btn-1 fs-12 py-lg-3 px-4 px-sm-5">{(btnAdd.status) ? 'Добавлено' : 'В корзину'}</button>
                                                <div className="sec-font ms-2 ms-sm-4">
                                                    <div className="fs-20 fw-5">{product.product.price} ₽</div>
                                                    {(product.product.sale > 0) && <div className="gray-3 text-decoration-line-through align-middle me-1 me-md-0 ms-1">{product.product.sale} ₽</div>}
                                                </div>
                                            </div>
                                            <div className="position-fixed d-md-none py-3">
                                                <button type="button" onClick={addCart} className="btn btn-1 w-100 fs-12 py-lg-3 px-4 px-sm-5">{(btnAdd.status) ? 'Добавлено за ' + product.product.price + '₽' : 'В корзину за ' + product.product.price + '₽'}</button>
                                            </div>
                                        </div>
                                    </div>
                                    : <div className="loading loading-absolute"><img src="/images/loader.png" /></div>
                            }
                        </Modal.Body>
                    </Modal>
                </>
            }
            <main>
                <section id="sec-12">
                    <Swiper
                        loop={true}
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
                        className="home-slider swiper-gallery"
                    >
                        <SwiperSlide className="px-2"><img src="/images/home-slide-1.jpg" alt="" className='img-fluid' /></SwiperSlide>
                        <SwiperSlide className="px-2"><img src="/images/home-slide-2.jpg" alt="" className='img-fluid' /></SwiperSlide>
                        <SwiperSlide className="px-2"><img src="/images/home-slide-3.jpg" alt="" className='img-fluid' /></SwiperSlide>
                    </Swiper>
                </section>
                <section className="sec-2 mb-8 mt-3 mt-md-5">
                    <div className="container">
                        {
                            product.selectedCategory.subcategory ?
                                <div className="row">{product.selectedCategory.subcategory.map(item => <div className="col-auto mb-2"><a className="btn btn-2 d-flex" onClick={() => subCategory(item)}>{item.title}</a></div>)}</div>
                                :
                                <h1 className="h3 fw-6 mb-4 text-center text-md-start">{product.selectedCategory && product.selectedCategory.title ? product.selectedCategory.title : 'Меню'}</h1>
                        }
                        <ProductList />
                    </div>
                </section>
            </main>
        </>
    );
});

export default Home;
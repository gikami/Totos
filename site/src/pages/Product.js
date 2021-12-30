import React, { useEffect, useState, useContext } from 'react'
import { Context } from "./../index"
import { observer } from "mobx-react-lite"
import Radio from "./../components/Radio"
import DopList from "./../components/DopList"
import RecommendList from "./../components/RecommendList"
import { Link } from "react-router-dom"
import { HOME_ROUTE, SHOP_ROUTE } from "../utils/consts"
import { useParams } from 'react-router-dom'
import { fetchOneProduct, createReview, fetchRecommed } from "../http/productAPI"

const Product = observer(() => {
    const { id } = useParams()
    const { cart, favorite, user } = useContext(Context)
    const [product, setProduct] = useState({})
    const [review, setReview] = useState({})
    const [dop, setDop] = useState(false)
    const [param, setParam] = useState(false)
    const [rating, setRating] = useState({ total: 0, count: 0 })
    const [reviewForm, setReviewForm] = useState({ user: (user.isAuth) ? user.user.id : 0, product: id, rating: 0, text: '' })
    const [reviewStatus, setReviewStatus] = useState(false)
    const [btnAdd, setBtnAdd] = useState({ status: false, count: 1 })
    const [updateFavorite, setUpdateFavorite] = useState(false)
    const [recommend, setRecommend] = useState(false)

    useEffect(() => {
        fetchOneProduct(id).then(data => {
            document.title = (data.title) ? data.title : 'Доставка вкуснейших роллов и пиццы на дом и в офис по Казани.'
            if (data) {
                console.log(data)
                setProduct(data.product)
                if (data.product.param) {
                    setParam(JSON.parse(data.product.param)[0])
                }
            }
            if (data.review) {
                setReview(data.review)
            }
            if (data.rating && data.rating.length > 0) {
                setRating(data.rating[0])
            }
            if (data.dop) {
                setDop(data.dop)
            }
            setBtnAdd(cart.checkCart(data.product))

            fetchRecommed((data.product.param) ? data.product.param : false).then(data => {
                if (data) {
                    setRecommend(data.recommend)
                }
            }).catch(e => console.log(e))
        })
    }, [])
    useEffect(() => {
        setBtnAdd(cart.checkCart(product))
    }, [cart.cart])
    const dataFavorite = favorite.checkFavorite(product)
    const btnFavoriteAdd = (dataFavorite) ? dataFavorite.status : false

    const addFavorite = () => {
        favorite.setFavorite(product)
        setUpdateFavorite(!updateFavorite)
    }
    const addCart = () => {
        cart.setCart(product)
        setBtnAdd(cart.checkCart(product))
    }
    const Rating = (props) => {
        const getRating = (value) => {
            var maxValue = 6
            var items = []
            for (var i = 1; i < maxValue; i++) {
                if (props.type && props.type == 'radio') {
                    items.push(<input type="radio" name="rating" value={i} checked={Number(reviewForm.rating) === i} />)
                } else {
                    items.push(<svg class={(i <= value && 'grade')} viewBox="0 0 22 22" xmlns="http://www.w3.org/2000/svg"><path d="M11 1L14.09 7.26L21 8.27L16 13.14L17.18 20.02L11 16.77L4.82 20.02L6 13.14L1 8.27L7.91 7.26L11 1Z"></path></svg>)
                }
            }
            if (props.type && props.type == 'radio') {
                items.reverse()
            }
            return items.map(item => item)
        }
        return getRating(props.value)
    }
    const submitReview = async (e) => {
        try {
            e.preventDefault()
            let data
            data = await createReview(reviewForm)
            setRating({ ...rating, count: rating.count + 1 })
            setReviewStatus(true)
            setReviewForm({ ...reviewForm, rating: 0, text: '' })
        } catch (e) {
            if (e.response && e.response.data) {
                alert(e.response.data.message)
            } else {
                alert(e)
            }
        }
    }
    const changeReview = (e) => {
        setReviewForm({ ...reviewForm, [e.target.name]: e.target.value })
    }
    return (
        <main>
            <div className="container mb-4 mb-md-5">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb mb-0">
                        <li className="breadcrumb-item"><Link to={HOME_ROUTE}>Главная</Link></li>
                        <li className="breadcrumb-item"><Link to={SHOP_ROUTE}>Меню</Link></li>
                        <li className="breadcrumb-item"><a>{product.title}</a></li>
                    </ol>
                </nav>
            </div>
            <section id="sec-11" className="mb-8">
                <div className="container">
                    <div className="short-info row mb-5">
                        <div className="col-md-5 col-xxl-4">
                            <div className="img-prod mb-5 mb-md-0">
                                {(product.image) ? <img src={process.env.REACT_APP_API_URL + '/' + product.image} alt={product.title} /> : null}
                                <button type="button" className="btn-icon favorite" onClick={addFavorite} data-state={btnFavoriteAdd ? 'on' : 'off'}></button>
                            </div>
                        </div>
                        <div className="col-md-7 col-xl-6 offset-xl-1">
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <h1 className="mb-0">{product.title}</h1>
                                <div className="dropdown">
                                    <button type="button" className="dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                                        <img src="/images/icons/info2.svg" alt="" />
                                    </button>
                                    {/* <div className="dropdown-menu dropdown-menu-end">
                                        <div className="fs-09 mb-1">Пищевая ценность на 100 г</div>
                                        {
                                            (product && product.tags) &&
                                            JSON.parse(product.tags).map(item => (
                                                <div className="d-flex justify-content-between fs-09 mb-1">
                                                    <span className="fw-5">{item.title}</span>
                                                    <span>{item.value} г</span>
                                                </div>
                                            ))
                                        }
                                    </div> */}
                                </div>
                            </div>
                            <div class="d-flex align-items-center mb-4">
                                <div class="rating">
                                    <Rating value={(rating.total) ? rating.total : 0} />
                                </div>
                                <div class="fs-15 fw-5 ms-2 ms-sm-4">({(rating.count) ? rating.count : 0})</div>
                            </div>
                            <div className="dark fs-15 mb-4"><span className="me-2">{(product.mini_description) ? product.mini_description : 'Нет состава'}</span></div>
                            {
                                (product && product.attribute) && JSON.parse(product.attribute).map(item => <Radio list={item} />)
                            }
                            <div className="d-flex align-items-center mt-4">
                                <button type="button" onClick={addCart} className="btn btn-1 fs-20 py-lg-3 px-4 px-sm-5">{(btnAdd.status) ? 'Добавлено х' + btnAdd.count : 'В корзину'}</button>
                                <div className="sec-font ms-2 ms-sm-4">
                                    {
                                        (param.gramm || !param) && <div className="fs-15 fw-5 primary">{product.weight * 1000} грамм</div>
                                    }
                                    <div className="fs-20 fw-5">{product.price} ₽</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {((param.dopview || !param) && btnAdd.status) && <DopList product={product} dop={dop} />}
                    <div class="row">
                        <div class="col-xl-9 col-xxl-7">
                            <ul class="nav nav-tabs" id="myTab" role="tablist">
                                <li class="nav-item" role="presentation">
                                    <button class="nav-link active" data-bs-toggle="tab" data-bs-target="#desc" type="button" role="tab" aria-selected="true">Описание</button>
                                </li>
                                <li class="nav-item" role="presentation">
                                    <button class="nav-link" data-bs-toggle="tab" data-bs-target="#reviews" type="button" role="tab" aria-selected="false">
                                        Отзывы <small>({review.length})</small>
                                    </button>
                                </li>
                            </ul>
                            <div class="tab-content" id="myTabContent">
                                <div class="tab-pane fs-12 fade show active" id="desc" role="tabpanel">
                                    {(product.description) ? product.description : 'Нет описания'}
                                </div>
                                <div class="tab-pane fade" id="reviews" role="tabpanel">
                                    {
                                        (reviewStatus) && <div className="alert alert-success">Ваш отзыв успешно опубликован</div>
                                    }
                                    {
                                        (review && review.length > 0) ?
                                            review.map(item => (
                                                <div key={item.id} class="review">
                                                    <div class="rating mb-3">
                                                        <Rating value={item.rating} />
                                                    </div>
                                                    <div class="pe-xl-5">
                                                        <p>{item.text}</p>
                                                    </div>
                                                    <div class="dark fw-5 mt-2">{(item.user && item.user.firstname) ? item.user.firstname : 'Гость'}</div>
                                                </div>
                                            ))
                                            : <p class="mb-4">Отзывов пока нет! Будьте первым и напишите свой отзыв об этом товаре.</p>
                                    }
                                    {
                                        (user.isAuth) && <button type="button" data-bs-toggle="modal" data-bs-target="#write-feedback" class="btn btn-1 mt-5">Написать отзыв</button>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section className="mb-8">
                <div className="container">
                    <h2>Рекомендуем к заказу</h2>
                    <RecommendList list={recommend} />
                </div>
            </section>
            <div className="modal fade" id="write-feedback" tabIndex="-1" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                    <div className="modal-content">
                        <button type="button" className="btn-close" data-bs-dismiss="modal">
                            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M18 6L6 18" />
                                <path d="M6 6L18 18" />
                            </svg>
                        </button>
                        <div className="modal-body">
                            <h5 className="text-center">Отправка отзыва</h5>
                            <form onSubmit={submitReview} onChange={changeReview}>
                                <div className="mb-2">Ваша оценка: </div>
                                <div className="leave-rating mb-4">
                                    <Rating value={0} type={'radio'} />
                                </div>
                                <div className="mb-2">Ваш отзыв</div>
                                <textarea value={reviewForm.text} className="mb-4" rows="5" name="text" placeholder="Начните вводить текст…" />
                                <button data-bs-dismiss="modal" disabled={(reviewForm.rating > 0 && reviewForm.text.length > 10) ? false : true} type="submit" className="btn btn-1 py-sm-3">Отправить отзыв</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </main >
    )
})

export default Product

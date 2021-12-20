import React, { useEffect, useState, useContext } from 'react'
import { Context } from "./../index"
import { observer } from "mobx-react-lite"
import Radio from "./../components/Radio"
import { Link } from "react-router-dom"
import { HOME_ROUTE, SHOP_ROUTE } from "../utils/consts"
import { useParams } from 'react-router-dom'
import { fetchOneProduct } from "../http/productAPI"
import Select from "./../components/Select"

const Product = observer(() => {
    const { id } = useParams()
    const { cart, favorite } = useContext(Context)
    const [product, setProduct] = useState({ info: [] })
    // const [sizeList, setSizeList] = useState([
    //     { id: 1, group: 1, title: '25 см' },
    //     { id: 2, group: 1, title: '30 см' },
    //     { id: 3, group: 1, title: '35 см' }
    // ])
    // const [widthList, setWidthList] = useState([
    //     { value: 1, group: 2, label: 'Обычное' },
    //     { value: 2, group: 2, label: 'Тонкое' }
    // ])
    const [btnAdd, setBtnAdd] = useState({ status: false, count: 1 })
    const [updateFavorite, setUpdateFavorite] = useState(false);
    useEffect(() => {
        fetchOneProduct(id).then(data => {
            document.title = (data.title) ? data.title : 'Доставка вкуснейших роллов и пиццы на дом и в офис по Казани.'
            setProduct(data);
            setBtnAdd(cart.checkCart(data))
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
                                <img src={process.env.REACT_APP_API_URL + '/' + product.image} alt={product.title} />
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
                                    <div className="dropdown-menu dropdown-menu-end">
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
                                    </div>
                                </div>
                            </div>
                            <div className="dark fs-15 mb-4"><span className="me-2">{product.description}</span></div>

                            <div className="d-flex align-items-center mt-4">
                                <button type="button" onClick={addCart} className="btn btn-1 fs-20 py-lg-3 px-4 px-sm-5">{(btnAdd.status) ? 'Добавлено х' + btnAdd.count : 'В корзину'}</button>
                                <div className="sec-font ms-2 ms-sm-4">
                                    <div className="fs-15 fw-5 primary">{product.weight * 1000} грамм</div>
                                    <div className="fs-20 fw-5">{product.price} ₽</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    )
})

export default Product

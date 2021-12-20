import React, { useContext, useState } from 'react';
import { Link, useParams } from "react-router-dom";
import { PROFILE_ROUTE, HOME_ROUTE } from "../../utils/consts";
import { Context } from "../../index";
import { addAddress, editAddress, deleteAddress } from "../../http/userAPI";
import SideBar from "./components/menu";
const Address = () => {
    const { id, action, actionId } = useParams()
    const { user } = useContext(Context)
    const [update, setUpdate] = useState(1)
    const [address, setAddress] = useState((user.user.address && user.user.address.find(ids => ids.id == actionId)) ? user.user.address.find(ids => ids.id == actionId) : {})
    const deleteSubmit = async (id) => {
        try {
            let data;
            data = await deleteAddress(id);
            if (data) {
                user.setUser(data)
                setUpdate(update + 1)
            }
        } catch (e) {
            if (e.response && e.response.data) {
                alert(e.response.data.message)
            } else {
                alert(e)
            }
        }
    }
    if (action == 'add') {
        const submit = async (e) => {
            try {
                e.preventDefault();
                let data;
                data = await addAddress(address);
                if (data) {
                    setAddress({})
                    user.setUser(data)
                }
            } catch (e) {
                if (e.response && e.response.data) {
                    alert(e.response.data.message)
                } else {
                    alert(e)
                }
            }
        }
        const change = (e) => {
            setAddress({ ...address, [e.target.name]: e.target.value })
        }
        return (
            <main>
                <div className="container mb-4 mb-md-5">
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb mb-0">
                            <li className="breadcrumb-item"><Link to={HOME_ROUTE}>Главная</Link></li>
                            <li className="breadcrumb-item"><a>Добавить адрес</a></li>
                        </ol>
                    </nav>
                </div>
                <section id="sec-13" className="mb-8">
                    <div className="container">
                        <div className="row">
                            <SideBar />
                            <div className="col-md-8 col-xl-7 col-xxl-6 offset-xl-1">
                                <form onSubmit={submit} onChange={change} className="mb-4 mb-sm-5">
                                    <h5 className="gray-1">Добавить адрес</h5>
                                    <div className="gray-1 mb-2">Название адреса</div>
                                    <input type="text" name="name" placeholder="Например, Работа" className="mb-3" />
                                    <div className="gray-1 mb-2">Район</div>
                                    <select className="mb-3" name="region">
                                        <option value="" selected disabled className="gray-4">Выберите район</option>
                                        <option value="Район 1">Район 1</option>
                                        <option value="Район 2">Район 2</option>
                                        <option value="Район 3">Район 3</option>
                                    </select>
                                    <div className="gray-1 mb-2">Улица</div>
                                    <input type="text" name="street" placeholder="Улица" className="mb-3" />
                                    <div className="row row-cols-1 row-cols-sm-3 gx-2 gx-md-4">
                                        <div>
                                            <div className="gray-1 mb-2">Дом</div>
                                            <input type="text" name="home" placeholder="Дом" className="mb-4" />
                                        </div>
                                        <div>
                                            <div className="gray-1 mb-2">Этаж</div>
                                            <input type="text" name="floor" placeholder="Этаж" className="mb-4" />
                                        </div>
                                        <div>
                                            <div className="gray-1 mb-2">Квартира</div>
                                            <input type="text" name="apartment" placeholder="Квартира" className="mb-4" />
                                        </div>
                                    </div>
                                    <div className="row row-cols-2 gx-2 gx-md-4">
                                        <div>
                                            <div className="gray-1 mb-2">Подъезд</div>
                                            <input type="text" name="entrance" placeholder="Подъезд" className="mb-4" />
                                        </div>
                                        <div>
                                            <div className="gray-1 mb-2">Код двери</div>
                                            <input type="text" name="code" placeholder="Код двери" className="mb-4" />
                                        </div>
                                    </div>
                                    <button type="submit" className="btn btn-2">Сохранить</button>
                                </form>
                                <Link to={PROFILE_ROUTE + '/address'} className="gray-3 d-flex align-items-center">
                                    <img src="/images/icons/chevron-left.svg" alt="Вернуться назад" className="me-1" />
                                    Вернуться назад
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        )
    } else if (action == 'edit' && actionId) {
        const submit = async (e) => {
            try {
                e.preventDefault();
                let data;
                data = await editAddress(address);
                if (data) {
                    user.setUser(data)
                }
            } catch (e) {
                if (e.response && e.response.data) {
                    alert(e.response.data.message)
                } else {
                    alert(e)
                }
            }
        }
        const change = (e) => {
            setAddress({ ...address, [e.target.name]: e.target.value })
        }
        return (
            <main>
                <div className="container mb-4 mb-md-5">
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb mb-0">
                            <li className="breadcrumb-item"><Link to={HOME_ROUTE}>Главная</Link></li>
                            <li className="breadcrumb-item"><a>Редактировать адрес</a></li>
                        </ol>
                    </nav>
                </div>
                <section id="sec-13" className="mb-8">
                    <div className="container">
                        <div className="row">
                            <SideBar />
                            <div className="col-md-8 col-xl-7 col-xxl-6 offset-xl-1">
                                {(address) ?
                                    <form onSubmit={submit} onChange={change} className="mb-4 mb-sm-5">
                                        <h5 className="gray-1">Редактировать адрес</h5>
                                        <div className="gray-1 mb-2">Название адреса</div>
                                        <input type="text" name="name" placeholder="Например, Работа" className="mb-3" defaultValue={address.name} />
                                        <div className="gray-1 mb-2">Район</div>
                                        <select className="mb-3" name="region">
                                            <option value="" selected disabled className="gray-4">Выберите район</option>
                                            <option value="Район 1">Район 1</option>
                                            <option value="Район 2">Район 2</option>
                                            <option value="Район 3">Район 3</option>
                                        </select>
                                        <div className="gray-1 mb-2">Улица</div>
                                        <input type="text" name="street" placeholder="Улица" className="mb-3" defaultValue={address.street} />
                                        <div className="row row-cols-1 row-cols-sm-3 gx-2 gx-md-4">
                                            <div>
                                                <div className="gray-1 mb-2">Дом</div>
                                                <input type="text" name="home" placeholder="Дом" className="mb-4" defaultValue={address.home} />
                                            </div>
                                            <div>
                                                <div className="gray-1 mb-2">Этаж</div>
                                                <input type="text" name="floor" placeholder="Этаж" className="mb-4" defaultValue={address.floor} />
                                            </div>
                                            <div>
                                                <div className="gray-1 mb-2">Квартира</div>
                                                <input type="text" name="apartment" placeholder="Квартира" className="mb-4" defaultValue={address.apartment} />
                                            </div>
                                        </div>
                                        <div className="row row-cols-2 gx-2 gx-md-4">
                                            <div>
                                                <div className="gray-1 mb-2">Подъезд</div>
                                                <input type="text" name="entrance" placeholder="Подъезд" className="mb-4" defaultValue={address.entrance} />
                                            </div>
                                            <div>
                                                <div className="gray-1 mb-2">Код двери</div>
                                                <input type="text" name="code" placeholder="Код двери" className="mb-4" defaultValue={address.code} />
                                            </div>
                                        </div>
                                        <button type="submit" className="btn btn-2">Сохранить</button>
                                    </form>
                                    : <div>Такого адреса нет</div>
                                }
                                <Link to={PROFILE_ROUTE + '/address'} className="gray-3 d-flex align-items-center">
                                    <img src="/images/icons/chevron-left.svg" alt="Вернуться назад" className="me-1" />
                                    Вернуться назад
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        )
    } else {
        return (
            <main>
                <div className="container mb-4 mb-md-5">
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb mb-0">
                            <li className="breadcrumb-item"><Link to={HOME_ROUTE}>Главная</Link></li>
                            <li className="breadcrumb-item"><a>Адрес доставки</a></li>
                        </ol>
                    </nav>
                </div>

                <section id="sec-13" className="mb-8">
                    <div className="container">
                        <div className="row">
                            <SideBar />
                            <div className="col-md-8 col-xl-7 col-xxl-6 offset-xl-1">
                                <form action="" className="mb-4 mb-sm-5">
                                    <h5 className="gray-1">Адрес доставки</h5>
                                    {
                                        (user.user.address && user.user.address.length > 0) ?
                                            <>
                                                <div className="fs-09 gray-1 mb-4">Выберите адрес для доставки по умолчанию.</div>
                                                {
                                                    user.user.address.map((item, i) =>
                                                        <div key={i} className="d-flex align-items-start mb-4">
                                                            <input type="radio" name="address" value="Адрес Работа" id={"address-" + i} defaultChecked={(i === 0) ?? true} />
                                                            <div className="ms-2">
                                                                <label for={"address-" + i} className="gray-1 fw-5">{item.name}</label>
                                                                <div className="d-flex mt-2">
                                                                    <Link to={PROFILE_ROUTE + '/address/edit/' + item.id} className="fs-09 gray-1 me-3">Редактировать</Link>
                                                                    <button type="button" onClick={() => deleteSubmit(item.id)} className="fs-09 gray-4">Удалить</button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )
                                                }
                                            </>
                                            : <div className="fs-09 gray-1 mb-4">Добавьте адрес для доставки по умолчанию.</div>
                                    }
                                    <Link to={PROFILE_ROUTE + '/address/add'} className="d-flex align-items-center">
                                        <img src="/images/icons/plus3.svg" alt="Добавить" className="me-2" />
                                        <span className="primary">Добавить адрес</span>
                                    </Link>
                                </form>
                                <Link to={PROFILE_ROUTE} className="gray-3 d-flex align-items-center">
                                    <img src="/images/icons/chevron-left.svg" alt="Вернуться назад" className="me-1" />
                                    Вернуться назад
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        )
    }
};

export default Address;

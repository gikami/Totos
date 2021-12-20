import React, { useContext, useState } from 'react';
import { Link } from "react-router-dom";
import { PROFILE_ROUTE, HOME_ROUTE } from "../../utils/consts";
import { Context } from "../../index";
import { edit } from "../../http/userAPI";
import SideBar from "./components/menu";
const ProfileEdit = () => {
    const { user } = useContext(Context)
    const birthday = new Date(user.user.birthday).toLocaleDateString("ru-RU")
    const [userArray, setUserArray] = useState({
        id: user.user.id,
        email: user.user.email,
        password: user.user.password,
        firstname: user.user.firstname,
        lastname: user.user.lastname,
        phone: user.user.phone,
        birthday_day: String(user.user.birthday_day),
        birthday_month: String(user.user.birthday_month),
        sex: String(user.user.sex)
    })
    const submit = async (e) => {
        try {
            e.preventDefault();
            let data;
            data = await edit(userArray);
            user.setUser(userArray)
        } catch (e) {
            if (e.response && e.response.data) {
                alert(e.response.data.message)
            } else {
                alert(e)
            }
        }
    }
    const change = (e) => {
        setUserArray({ ...userArray, [e.target.name]: e.target.value })
    }
    return (
        <main>
            <div className="container mb-4 mb-md-5">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb mb-0">
                        <li className="breadcrumb-item"><Link to={HOME_ROUTE}>Главная</Link></li>
                        <li className="breadcrumb-item"><a>Редактировать</a></li>
                    </ol>
                </nav>
            </div>

            <section id="sec-13" className="mb-8">
                <div className="container">
                    <div className="row">
                        <SideBar />
                        <div className="col-md-8 col-xl-7 col-xxl-6 offset-xl-1">
                            <form onSubmit={submit} onChange={change} >
                                <h5 className="mb-3">Редактировать профиль</h5>
                                <fieldset className="mb-4 mb-sm-5">
                                    <div className="sec-font mb-2">Имя</div>
                                    <input type="text" placeholder="Имя" name="firstname" value={userArray.firstname} className="mb-3" />
                                    <div className="sec-font mb-2">Фамилия</div>
                                    <input type="text" placeholder="Фамилия" name="lastname" value={userArray.lastname} className="mb-3" />
                                    <div className="sec-font mb-2">Телефон</div>
                                    <input type="tel" placeholder="+7 (000) 000-00-00" name="phone" value={userArray.phone} />
                                </fieldset>
                                <fieldset className="mb-4 mb-sm-5">
                                    <legend className="gray-1 fw-5 fs-11 mb-3">День рождения</legend>
                                    <div className="row gx-xl-5">
                                        <div className="col-sm-6 col-lg-5">
                                            <div className="row row-cols-2 gx-2 gx-lg-4">
                                                <div>
                                                    <select name="birthday_day">
                                                        <option className="gray-4" value="День" selected disabled>День</option>
                                                        <option value="1" selected={userArray.birthday_day === "1" && 'true'}>1</option>
                                                        <option value="2" selected={userArray.birthday_day === "2" && 'true'}>2</option>
                                                        <option value="3" selected={userArray.birthday_day === "3" && 'true'}>3</option>
                                                        <option value="4" selected={userArray.birthday_day === "4" && 'true'}>4</option>
                                                        <option value="5" selected={userArray.birthday_day === "5" && 'true'}>5</option>
                                                        <option value="6" selected={userArray.birthday_day === "6" && 'true'}>6</option>
                                                        <option value="7" selected={userArray.birthday_day === "7" && 'true'}>7</option>
                                                        <option value="8" selected={userArray.birthday_day === "8" && 'true'}>8</option>
                                                        <option value="9" selected={userArray.birthday_day === "9" && 'true'}>9</option>
                                                        <option value="10" selected={userArray.birthday_day === "10" && 'true'}>10</option>
                                                        <option value="11" selected={userArray.birthday_day === "11" && 'true'}>11</option>
                                                        <option value="12" selected={userArray.birthday_day === "12" && 'true'}>12</option>
                                                        <option value="13" selected={userArray.birthday_day === "13" && 'true'}>13</option>
                                                        <option value="14" selected={userArray.birthday_day === "14" && 'true'}>14</option>
                                                        <option value="15" selected={userArray.birthday_day === "15" && 'true'}>15</option>
                                                        <option value="16" selected={userArray.birthday_day === "16" && 'true'}>16</option>
                                                        <option value="17" selected={userArray.birthday_day === "17" && 'true'}>17</option>
                                                        <option value="18" selected={userArray.birthday_day === "18" && 'true'}>18</option>
                                                        <option value="19" selected={userArray.birthday_day === "19" && 'true'}>19</option>
                                                        <option value="20" selected={userArray.birthday_day === "20" && 'true'}>20</option>
                                                        <option value="21" selected={userArray.birthday_day === "21" && 'true'}>21</option>
                                                        <option value="22" selected={userArray.birthday_day === "22" && 'true'}>22</option>
                                                        <option value="23" selected={userArray.birthday_day === "23" && 'true'}>23</option>
                                                        <option value="24" selected={userArray.birthday_day === "24" && 'true'}>24</option>
                                                        <option value="25" selected={userArray.birthday_day === "25" && 'true'}>25</option>
                                                        <option value="26" selected={userArray.birthday_day === "26" && 'true'}>26</option>
                                                        <option value="27" selected={userArray.birthday_day === "27" && 'true'}>27</option>
                                                        <option value="28" selected={userArray.birthday_day === "28" && 'true'}>28</option>
                                                        <option value="29" selected={userArray.birthday_day === "29" && 'true'}>29</option>
                                                        <option value="30" selected={userArray.birthday_day === "30" && 'true'}>30</option>
                                                        <option value="31" selected={userArray.birthday_day === "31" && 'true'}>31</option>
                                                    </select>
                                                </div>
                                                <div>
                                                    <select name="birthday_month">
                                                        <option className="gray-4" value="Месяц" selected disabled>Месяц</option>
                                                        <option value="1" selected={userArray.birthday_month === "1" && 'true'}>январь</option>
                                                        <option value="2" selected={userArray.birthday_month === "2" && 'true'}>февраль</option>
                                                        <option value="3" selected={userArray.birthday_month === "3" && 'true'}>март</option>
                                                        <option value="4" selected={userArray.birthday_month === "4" && 'true'}>апрель</option>
                                                        <option value="5" selected={userArray.birthday_month === "5" && 'true'}>май</option>
                                                        <option value="6" selected={userArray.birthday_month === "6" && 'true'}>июнь</option>
                                                        <option value="7" selected={userArray.birthday_month === "7" && 'true'}>июль</option>
                                                        <option value="8" selected={userArray.birthday_month === "8" && 'true'}>август</option>
                                                        <option value="9" selected={userArray.birthday_month === "9" && 'true'}>сентябрь</option>
                                                        <option value="10" selected={userArray.birthday_month === "10" && 'true'}>октябрь</option>
                                                        <option value="11" selected={userArray.birthday_month === "11" && 'true'}>ноябрь</option>
                                                        <option value="12" selected={userArray.birthday_month === "12" && 'true'}>декабрь</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-sm-6 col-lg-7 mt-2 mt-sm-0">
                                            <div className="gray-3 mb-1">Дарим 10% скидки в день рождения</div>
                                            <div className="gray-3">Можно указать только один раз</div>
                                        </div>
                                    </div>
                                </fieldset>

                                <fieldset className="mb-4 mb-sm-5">
                                    <legend className="gray-1 fw-5 fs-11 mb-3">Мой пол</legend>
                                    <div className="d-sm-flex">
                                        <div className="d-flex align-items-center mt-3 mt-sm-0">
                                            <input type="radio" name="sex" value="1" id="male" defaultChecked={userArray.sex === "1" ? true : false} />
                                            <label for="male" className="ms-2">Мужской</label>
                                        </div>
                                        <div className="d-flex align-items-center mt-3 mt-sm-0 ms-sm-4">
                                            <input type="radio" name="sex" value="2" id="female" defaultChecked={userArray.sex === "2" ? true : false} />
                                            <label for="female" className="ms-2">Женский</label>
                                        </div>
                                    </div>
                                </fieldset>
                                <button type="submit" className="btn btn-2 mx-auto my-4 my-sm-5">Сохранить изменения</button>
                                <div className="d-flex justify-content-between">
                                    <Link to={PROFILE_ROUTE} className="gray-3 d-flex align-items-center">
                                        <img src="/images/icons/chevron-left.svg" alt="Вернуться назад" className="me-1" />
                                        Вернуться назад
                                    </Link>
                                    <button type="button" className="primary ms-auto" data-bs-toggle="modal" data-bs-target="#account-delete">Удалить аккаунт</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    )
}
export default ProfileEdit;
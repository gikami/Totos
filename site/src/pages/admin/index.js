import React, { useState, useEffect, useContext } from 'react'
import { Link, useParams } from "react-router-dom"
import Menu from "./components/Menu"
import Categories from "./Categories"
import Products from "./Products"
import Orders from "./Orders"
import { Context } from "../../index"

const Admin = () => {
    const { user } = useContext(Context)
    const { id } = useParams()

    useEffect(() => {
        if(!user.isAuth || user.user.role != 'ADMIN'){
            window.location.href = '/'
        }
        document.title = "Панель администратора"
    }, [])

    return (
        <div id="sec-13" className="admin-page container pb-5 pt-5">
            <div className="row">
                <div className="col-md-4 col-xl-3">
                    <Menu />
                </div>
                <div className="col-md-8 col-xl-9">
                {
                    (id === 'categories') ? 
                    <Categories />
                    : (id === 'products') ?
                    <Products />
                    : (id === 'orders') ?
                    <Orders />
                    :
                    <>
                        <h5>Панель администратора</h5>
                    </>
                }
                </div>
            </div>
        </div>
    )
}

export default Admin
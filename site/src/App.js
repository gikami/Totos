import React, { useContext, useEffect, useState } from 'react';
import { BrowserRouter } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import AppRouter from "./components/AppRouter";
import NavBar from "./components/NavBar";
import CategoryBar from "./components/CategoryBar";
import Footer from "./components/Footer";
import { observer } from "mobx-react-lite";
import { Context } from "./index";
import { check } from "./http/userAPI";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import 'swiper/swiper-bundle.min.css'
import "./fonts.css";
import "./style.css";

const App = observer(() => {
    const { user, cart, favorite } = useContext(Context)
    const [loading, setLoading] = useState(true)
    useEffect(() => {
        check().then(data => {
            user.setUser(data)
            user.setIsAuth(true)
        }).finally(() => setLoading(false))
    }, [])

    if (loading) {
        return <div className="loading"><img src="/images/loader.png" /></div>
    }
    return (
        <BrowserRouter>
            <ScrollToTop />
            <NavBar />
            <CategoryBar />
            <AppRouter />
            <Footer />
        </BrowserRouter>
    );
});

export default App;

import React, { useContext, useEffect, useState } from 'react';
import { BrowserRouter } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import AppRouter from "./components/AppRouter";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import { observer } from "mobx-react-lite";
import { Context } from "./index";
import { check } from "./http/userAPI";
import { NotificationContainer } from 'react-notifications'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'swiper/swiper-bundle.min.css'
import "./fonts.css";
import "./style.css";
import 'bootstrap/dist/js/bootstrap.min.js';

const App = observer(() => {
    const { user } = useContext(Context)
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
            <NotificationContainer />
            <NavBar />
            <AppRouter />
            <Footer />
        </BrowserRouter>
    );
});

export default App;

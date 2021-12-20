import Admin from "./pages/Admin";
import { HOME_ROUTE, ADMIN_ROUTE, CART_ROUTE, CHECKOUT_ROUTE, PRODUCT_ROUTE, SHOP_ROUTE, PROFILE_ROUTE, DELIVERY_ROUTE, ABOUT_ROUTE, FAVORITES_ROUTE, POLICY_ROUTE } from "./utils/consts";
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Shop from "./pages/Shop";
import Profile from "./pages/profile/index";
import Product from "./pages/Product";
import About from "./pages/About";
import Delivery from "./pages/Delivery";
import Policy from "./pages/Policy";
import Favorites from "./pages/Favorites";

export const authRoutes = [
    {
        path: ADMIN_ROUTE,
        Component: Admin
    },
    {
        path: PROFILE_ROUTE,
        Component: Profile
    },
    {
        path: PROFILE_ROUTE + '/:id',
        Component: Profile
    },
    {
        path: PROFILE_ROUTE + '/:id/:action',
        Component: Profile
    },
    {
        path: PROFILE_ROUTE + '/:id/:action/:actionId',
        Component: Profile
    },
]

export const publicRoutes = [
    {
        path: HOME_ROUTE,
        Component: Home
    },
    {
        path: SHOP_ROUTE,
        Component: Shop
    },
    {
        path: ABOUT_ROUTE,
        Component: About
    },
    {
        path: DELIVERY_ROUTE,
        Component: Delivery
    },
    {
        path: PRODUCT_ROUTE + '/:id',
        Component: Product
    },
    {
        path: CART_ROUTE,
        Component: Cart
    },
    {
        path: CHECKOUT_ROUTE,
        Component: Checkout
    },
    {
        path: FAVORITES_ROUTE,
        Component: Favorites
    },
    {
        path: POLICY_ROUTE,
        Component: Policy
    },
]
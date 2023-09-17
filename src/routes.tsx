
import React from "react";
import { createBrowserRouter } from "react-router-dom";
import Login from "./Page/Authenticator/Login/Login";
import Home from "./Page/Authenticator/Home/Home";
import Product from "./Page/Authenticator/Product/Product";
import PageNotFound from "./Page/Authenticator/404/PageNotFound";
import CreateProduct    from "./Page/Authenticator/CreateProduct/CreateProduct";
import Reissue from "./Page/Authenticator/Reissue/Reissue";




export const routers = createBrowserRouter(
    [

        {
            path: "*",
            element: <PageNotFound/>
        },
        {
            path: "/",
            element: <Home/>
        },
        {
            path: "/login",
            element: <Login/>
        },
        {
            path: "/reissue",
            element: <Reissue/>
        },
        {
            path: "/product/:slug",
            element: <Product/>
        },
        {
            path: "/createProduct",
            element: <CreateProduct   />
        },


    ]
)
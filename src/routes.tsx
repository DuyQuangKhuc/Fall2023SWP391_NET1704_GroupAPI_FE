import React from "react";
import { createBrowserRouter } from "react-router-dom";
import Login from "./Page/Authenticator/Login/Login";
import Home from "./Page/Authenticator/Home/Home";
import Product from "./Page/Authenticator/Product/Product";
import PageNotFound from "./Page/Authenticator/404/PageNotFound";
import Reissue from "./Page/Authenticator/Reissue/Reissue";
import PaymentPage from "./Page/Authenticator/Payment/Payment";
import TableProduct from "./Page/admin/TableProduct";
import CreateProduct from "./Page/admin/CreateProduct";
import AccountManage from "./Page/admin/AccountManage";
export const routers = createBrowserRouter([
  {
    path: "*",
    element: <PageNotFound />,
  },
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/reissue",
    element: <Reissue />,
  },
  {
    path: "/Product/Product/:slug",
    element: <Product />,
  },
  {
    path: "/createProduct",
    element: <CreateProduct />,
  },
  {
    path: "/accountManage",
    element: <AccountManage />,
  },
  {
    path: "/tableProduct",
    element: <TableProduct />,
  },

  {
    path: "/payment",
    element: <PaymentPage />,
  },
]);

import { apiSlice } from './apiSlice';
import { ORDERS_URL, PAYPAL_URL } from '../constants';

export const orderApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        createOrder: builder.mutation({
            query: (order) => ({
                url: `/api/Order/Add-Order`,
                method: 'POST',
                body: order,
            }),
        }),
        getOrderDetails: builder.query({
            query: (orderId) => ({
                url: `/api/Order/Order-By-OrderId?id=${orderId}`,
            }),
            keepUnusedDataFor: 5,
        }),
        payOrder: builder.mutation({
            query: ({ orderId, details }) => ({
                url: `/api/Order/Update-Order?id=${orderId}`,
                method: 'PUT',
                body: details,
            }),
        }),
        getPaypalClientId: builder.query({
            query: () => ({
                url: PAYPAL_URL,
            }),
            keepUnusedDataFor: 5,
        }),
        getMyOrders: builder.query({
            query: (accountId) => ({
                url: `/api/Order/List-Orders-By-AccountId?id=${accountId}`,
            }),
            keepUnusedDataFor: 5,
        }),
        getOrders: builder.query({
            query: () => ({
                url: ORDERS_URL,
            }),
            keepUnusedDataFor: 5,
        }),
        deliverOrder: builder.mutation({
            query: (orderId) => ({
                url: `${ORDERS_URL}/${orderId}/deliver`,
                method: 'PUT',
            }),
        }),
    }),
});

export const {
    useCreateOrderMutation,
    useGetOrderDetailsQuery,
    usePayOrderMutation,
    useGetPaypalClientIdQuery,
    useGetMyOrdersQuery,
    useGetOrdersQuery,
    useDeliverOrderMutation,
} = orderApiSlice;
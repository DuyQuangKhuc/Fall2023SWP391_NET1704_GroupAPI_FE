import { apiSlice } from './apiSlice';
import { ORDERS_URL, PAYPAL_URL } from '../constants';

export const orderApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        createOrder: builder.mutation({
            query: (accountId) => ({
                url: `/api/Order/Add-Order-Automatic?AccountId=${accountId}`,
                method: 'POST',
            }),
        }),
        getOrderDetails: builder.query({
            query: (orderId) => ({
                url: `/api/Order/Order-By-OrderId?id=${orderId}`,
            }),
            keepUnusedDataFor: 5,
            refetchInterval: 1000,
        }),
        payOrder: builder.mutation({
            query: ({ orderId, details }) => ({
                url: `/api/Order/Change-Status-Order?OrderId=${orderId}&status=1`,
                method: 'PUT',
                body: orderId,
            }),
            refetchInterval: 1000,
        }),
        getPaypalClientId: builder.query({
            query: () => ({
                url: PAYPAL_URL,
            }),
            keepUnusedDataFor: 5,
            refetchInterval: 1000,
        }),
        getMyOrders: builder.query({
            query: (accountId) => ({
                url: `/api/Order/List-Orders-By-AccountId?id=${accountId}`,
            }),
            keepUnusedDataFor: 5,
            refetchInterval: 1000,
        }),
        getOrders: builder.query({
            query: () => ({
                url: ORDERS_URL,
            }),
            keepUnusedDataFor: 5,
            refetchInterval: 1000,
        }),

        getOrderIsUsingByAccountId: builder.query({
            query: (accountId) => ({
                url: `/api/Order/Order-Is-Using-By-AccountId?accountId=${accountId}`,
            }),
            keepUnusedDataFor: 5,
            refetchInterval: 1000,
        }),

        addOrderDetailByAccountIdProductIdQuantity: builder.mutation({
            query: (data) => ({
                url: `/api/Order/Add-Order-Detail-By-AccountId-ProductId-Quantity?AccountId=${data.accountId}&ProductId=${data.productId}&Quantity=${data.quantity}`,
                method: 'POST',
                body: data,
            }),
            refetchInterval: 1000,
        }),

        getAddProductUserAutomatic: builder.mutation({
            query: (accountId) => ({
                url: `/api/Product/Add-Product-User-Automatic?accountId=${accountId}`,
                method: 'POST',
                body: accountId,
            }),
            refetchInterval: 1000,
        }),    

        getListOrderDetailCloneByOrderIdorderId : builder.query({
            query: (orderId) => ({
                url: `/api/Order/List-Order-Detail-Clone-By-OrderId?orderId=${orderId}`,
            }),
            refetchInterval: 1000,
        }),
   
        deleteOrderDetail: builder.mutation({
            query: (orderDetailId) => ({
                url: `/api/Order/Delete-Order-Detail?orderDetailId=${orderDetailId}`,
                method: 'DELETE',
            }),
            refetchInterval: 1000,
        }),
        deliverOrder: builder.mutation({
            query: (orderId) => ({
                url: `${ORDERS_URL}/${orderId}/deliver`,
                method: 'PUT',
            }),
        }),

        deleteAllOrderDetailInOrder : builder.mutation({
            query: (orderId) => ({
                url: `/api/Order/Delete-All-Order-Detail-In-Order?orderId=${orderId}`,
                method: 'DELETE',
                body: orderId,
            }),
        }),

        getListPaymentMethod: builder.query({
            query: (name) => ({
                url: `/api/Payment/List-Payment-Method`,
                body: name,
            }),
            refetchInterval: 1000,
        }),

        addPaymentPromax: builder.mutation({
            query: (data) => ({
                url: `/api/Payment/Add-Payment-Promax?orderId=${data.orderId}&paymentMethodId=${data.paymentMethodId}&voucherId=${data.voucherId}&address=${data.address}`,
                method: 'POST',
                body: data,
            }),
            refetchInterval: 1000,
        }), 
        
        getListOrderOfUser: builder.query({
            query: (accountId) => ({
                url: `/api/Order/List-Order-Of-User?accountId=${accountId}`,
                body: accountId,
            }),
            refetchInterval: 1000,
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
    useGetOrderIsUsingByAccountIdQuery,
    useAddOrderDetailByAccountIdProductIdQuantityMutation,
    useGetListOrderDetailCloneByOrderIdorderIdQuery,
    useDeleteOrderDetailMutation,
    useGetAddProductUserAutomaticMutation,
    useDeleteAllOrderDetailInOrderMutation,
    useGetListPaymentMethodQuery,
    useAddPaymentPromaxMutation,
    useGetListOrderOfUserQuery
} = orderApiSlice;
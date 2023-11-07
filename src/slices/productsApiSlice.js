import { apiSlice } from './apiSlice';

export const productsApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getProducts: builder.query({
            query: (data) => ({
                url: `/api/Product/List-Product`,
                params: data,
            }),
            keepUnusedDataFor: 5,
            //providesTags: ['Products'],
            refetchInterval: 1000,
        }),

        getProducts1: builder.query({
            query: (data) => ({
                url: `/api/Product/List-Product-Paging?page=${data.page}&size=12`,
                params: data,
            }),
            keepUnusedDataFor: 5,
            //providesTags: ['Products'],
            refetchInterval: 1000,
        }),

        getProducts2: builder.query({
            query: (data) => ({
                url: `/api/Product/List-Product-Paging-Top?page=${data.page}&size=4`,
                params: data,
            }),
            keepUnusedDataFor: 5,
            //providesTags: ['Products'],
            refetchInterval: 1000,
        }),

        getProductSize: builder.query({
            query: (data) => ({
                url: `/api/Product/PagesNumber?size=12`,
                params: data,
            }),
            keepUnusedDataFor: 5,
            //providesTags: ['Products'],
            refetchInterval: 1000,
        }),
        getProductDetails: builder.query({
            query: (productId) => ({
                url: `/api/Product/Product?id=${productId}`,
            }),
            keepUnusedDataFor: 5,
            refetchInterval: 1000,
        }),
        createProduct: builder.mutation({
            query: () => ({
                url: `/api/Product/Add-Product`,
                method: 'POST',
            }),
            invalidatesTags: ['Product'],
            refetchInterval: 1000,
        }),

        AddProductDetailClone: builder.mutation({
            query: (data) => ({
                url: `/api/Product/Add-Product-Detail-Manual?accountId=${data.accountId}&name=${data.name}&material=${data.material}&description=${data.description}&color=${data?.color}&isReplacable=${data.isReplacable}&quantity=${data.quantity}`,
                method: 'POST',
            }),
            //  invalidatesTags: ['Product'],
            refetchInterval: 1000,
        }),




        updateProduct: builder.mutation({
            query: (data) => ({
                url: `/api/Product/Update-Product?id=${data.productId}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ['Products'],
        }),
        uploadProductImage: builder.mutation({
            query: (data) => ({
                url: `/api/Product/Add-Image-Into-FireBase-And-DataBase-Not-Id`,
                method: 'POST',
                body: data,
            }),
            refetchInterval: 1000,
        }),

        addComponent: builder.mutation({
            query: (data) => ({
                url: `/api/Product/Add-Component`,
                method: 'POST',
                body: data,
            }),
            refetchInterval: 1000,
        }),

        getListComponentCreatedBySystem: builder.query({
            query: () => ({
                url: `/api/Product/List-Component-Created-By-System`,
            }),
            refetchInterval: 1000,
        }),
        deleteProduct: builder.mutation({
            query: (productId) => ({
                url: `/api/Product/Delete-Product?id=${productId}`,
                method: 'DELETE',
            }),
            providesTags: ['Product'],
            refetchInterval: 1000,
        }),
        createReview: builder.mutation({
            query: (data) => ({
                url: `/api/Feedback/Add-Feedback?accountId=${data.accountId}&productId=${data.productId}&rating=${data.rating}&comment=${data.comment}`,
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Product'],
            refetchInterval: 1000,
        }),
        getTopProducts: builder.query({
            query: () => `/api/Product/List-Product`,
            keepUnusedDataFor: 5,
            refetchInterval: 1000,
        }),

        getListComponentOfProductUserCreating: builder.query({
            query: (accountId) => ({
                url: `/api/Product/List-Component-Of-Product-User-Creating?accountId=${accountId}`,
            }),
            refetchInterval: 1000,
        }),

        getCompleteProduct: builder.mutation({
            query: (data) => ({
                url: `/api/Product/Complete-Product?accountId=${data.accountId}&imagePath=${data.imagePath}&description=${data.description}`,
                method: 'POST',
            }),
            refetchInterval: 1000,
        }),

        getListProductCreatedByUser: builder.query({
            query: (accountId) => ({
                url: `/api/Product/List-Product-Created-By-User?AccountId=${accountId}`,
            }),
            refetchInterval: 1000,
        }),

        getListComponentOfProduct: builder.query({
            query: (productId) => ({
                url: `/api/Product/List-Component-Of-Product?productId=${productId}`,
            }),
        }),
        getListAllComponent: builder.query({
            query: () => ({
                url: `/api/Product/List-All-Component`,
            }),
            refetchInterval: 1000,
        }),
        getListFeedbackByProduct: builder.query({
            query: (productId) => ({
                url: `/api/Feedback/List-Feedback-By-Product?productId=${productId}`,
            }),
            refetchInterval: 1000,
        }),

        addComponentIntoProduct: builder.mutation({
            query: (data) => ({
                url: `/api/Product/Add-Component-Into-Product?productId=${data.productId}&componentId=${data.componentId}&quantity=${data.quantity}`,
                method: 'POST',
            }),
            refetchInterval: 1000,
        }),

        acceptProductOfUserFromAdmin: builder.mutation({
            query: (data) => ({
                url: `/api/Product/Accept-Product-Of-User-From-Admin?productId=${data.productId}&price=${data.price}`,
                method: 'PUT',
                body: data,
            }),
            refetchInterval: 1000,
            invalidatesTags: ['Products'],
        }),

        cancelProductOfUser: builder.mutation({
            query: (data) => ({
                url: `/api/Product/Cancel-Product-Of-User?productId=${data.productId}`,
                method: 'PUT',
                body: data,
            }),
            providesTags: ['Product'],
            refetchInterval: 1000,
        }),

        acceptProductOfUserFromUser: builder.mutation({
            query: (data) => ({
                url: `/api/Product/Accept-Product-Of-User-From-User?productId=${data.productId}&price=${data.price}`,
                method: 'PUT',
                body: data,
            }),
            refetchInterval: 1000,
            invalidatesTags: ['Products'],
        }),

        acceptProductOfUser: builder.mutation({
            query: (data) => ({
                url: `/api/Product/Accept-Product-Of-User?productId=${data.productId}`,
                method: 'PUT',
                body: data,
            }),
            refetchInterval: 1000,
        }),

        getVoucher: builder.query({
            query: () => ({
                url: `/api/Voucher/List-Voucher`,
            }),
            keepUnusedDataFor: 5,
            refetchInterval: 1000,
        }),

        buyVoucher: builder.mutation({
            query: (data) => ({
                url: `/api/Voucher/Buy-Voucher?accountId=${data.accountId}&voucherId=${data.voucherId}&quantity=${data.quantity}`,
                method: 'POST',
                body: data,
            }),
            refetchInterval: 1000,
        }),

        getVoucherOfUser: builder.query({
            query: (accountId) => ({
                url: `/api/Voucher/List-Voucher-Of-User?accountId=${accountId}`,
            }),
            keepUnusedDataFor: 5,
            refetchInterval: 1000,
        }),

        deleteComponentOfProduct: builder.mutation({
            query: (productDetailId) => ({
                url: `/api/Product/Delete-Component-Of-Product?productDetailId=${productDetailId}`,
                method: 'DELETE',
            }),
            refetchInterval: 1000,
        }),

        deleteAllComponentOfProduct: builder.mutation({
            query: (accountId) => ({
                url: `/api/Product/Delete-All-Component-Of-Product-Of-Account?accountId=${accountId}`,
                method: 'DELETE',
            }),
            refetchInterval: 1000,
        }),

        addProductAutomatic : builder.mutation({
            query: (data) => ({
                url: `/api/Product/Add-Product-Automatic`,
                method: 'POST',
                body: data,
            }),
            refetchInterval: 1000,
        }),

        addComponentIntoProductCreating: builder.mutation({
            query: (data) => ({
                url: `/api/Product/Add-Component-Into-Product-Creating?componentId=${data.componentId}&quantity=${data.quantity}`,
                method: 'POST',
            }),
            refetchInterval: 1000,
        }),

        getListComponentOfProductCreating : builder.query({
            query: () => ({
                url: `/api/Product/List-Component-Of-Product-Creating`,
            }),
            refetchInterval: 1000,
        }),

    }),
});

export const {
    useGetProductsQuery,
    useGetProducts1Query,
    useGetProducts2Query,
    useGetProductSizeQuery,
    useGetProductDetailsQuery,
    useCreateProductMutation,
    useUpdateProductMutation,
    useUploadProductImageMutation,
    useDeleteProductMutation,
    useCreateReviewMutation,
    useGetTopProductsQuery,
    useAddComponentMutation,
    useGetListComponentCreatedBySystemQuery,
    useAddProductDetailCloneMutation,
    useGetListComponentOfProductUserCreatingQuery,
    useGetCompleteProductMutation,
    useGetListProductCreatedByUserQuery,
    useGetListComponentOfProductQuery,
    useGetListAllComponentQuery,
    useGetListFeedbackByProductQuery,
    useAddComponentIntoProductMutation,
    useAcceptProductOfUserFromAdminMutation,
    useCancelProductOfUserMutation,
    useAcceptProductOfUserFromUserMutation,
    useAcceptProductOfUserMutation,
    useGetVoucherQuery,
    useBuyVoucherMutation,
    useGetVoucherOfUserQuery,
    useDeleteComponentOfProductMutation,
    useDeleteAllComponentOfProductMutation,
    useAddProductAutomaticMutation,
    useAddComponentIntoProductCreatingMutation,
    useGetListComponentOfProductCreatingQuery
} = productsApiSlice;
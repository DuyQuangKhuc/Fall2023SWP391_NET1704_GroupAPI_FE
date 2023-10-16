import { PRODUCTS_URL } from '../constants';
import { apiSlice } from './apiSlice';

export const productsApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getProducts: builder.query({
            query: ({ keyword, pageNumber }) => ({
                url: `/api/Product/List-Product`,
                params: { keyword, pageNumber },
            }),
            keepUnusedDataFor: 5,
            providesTags: ['Products'],
        }),
        getProductDetails: builder.query({
            query: (productId) => ({
                url: `/api/Product/Product?id=${productId}`,
            }),
            keepUnusedDataFor: 5,
        }),
        createProduct: builder.mutation({
            query: () => ({
                url: `/api/Product/Add-Product`,
                method: 'POST',
            }),
            invalidatesTags: ['Product'],
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
        }),

        addComponent: builder.mutation({
            query: (data) => ({
                url: `/api/Product/Add-Component`,
                method: 'POST',
                body: data,
            }),
        }),

        getListComponent: builder.query({
            query: () => ({
                url: `/api/Product/List-Component`,
            }),
        }),
        deleteProduct: builder.mutation({
            query: (productId) => ({
                url: `/api/Product/Delete-Product?id=${productId}`,
                method: 'DELETE',
            }),
            providesTags: ['Product'],
        }),
        createReview: builder.mutation({
            query: (data) => ({
                url: `${PRODUCTS_URL}/${data.productId}/reviews`,
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Product'],
        }),
        getTopProducts: builder.query({
            query: () => `/api/Product/List-Product`,
            keepUnusedDataFor: 5,
        }),
    }),
});

export const {
    useGetProductsQuery,
    useGetProductDetailsQuery,
    useCreateProductMutation,
    useUpdateProductMutation,
    useUploadProductImageMutation,
    useDeleteProductMutation,
    useCreateReviewMutation,
    useGetTopProductsQuery,
    useAddComponentMutation,
    useGetListComponentQuery,
} = productsApiSlice;
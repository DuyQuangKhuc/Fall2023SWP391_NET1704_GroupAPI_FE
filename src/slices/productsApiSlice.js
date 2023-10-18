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
                url: `/api/Product/Add-Product-Detail-Manual?accountId=${data.accountId}&name=${data.name}&material=${data.material}&description=${data.description}&color=${data.color}&isReplacable=${data.isReplacable}&quantity=${data.quantity}`,
                method: 'POST',
                body: data,
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

        getListComponent: builder.query({
            query: () => ({
                url: `/api/Product/List-Component`,
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
                url: `${PRODUCTS_URL}/${data.productId}/reviews`,
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
            query: (accountId) => ({
                url: `/api/Product/Complete-Product?accountId=${accountId}`,
                method: 'POST',
            }),
            refetchInterval: 1000,
        }),

        getListProductCreatedByUser : builder.query({
            query: (accountId) => ({
                url: `/api/Product/List-Product-Created-By-User?AccountId=${accountId}`,
            }),
            refetchInterval: 1000,
        }),

        getListComponentOfProduct : builder.query({
            query: (productId) => ({
                url: `/api/Product/List-Component-Of-Product?productId=${productId}`,
            }),
            refetchInterval: 1000,
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
    useAddProductDetailCloneMutation,
    useGetListComponentOfProductUserCreatingQuery,
    useGetCompleteProductMutation,
    useGetListProductCreatedByUserQuery,
    useGetListComponentOfProductQuery
} = productsApiSlice;
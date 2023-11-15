import { apiSlice } from './apiSlice';

export const userApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation({
            query: (data) => ({
                url: `/api/LoginAndRegister/Check-Login-Promax?email=${data.email}&password=${data.password}`,
                method: 'POST',
                body: data,
            }),
        }),
        register: builder.mutation({
            query: (data) => ({
                url: `/api/LoginAndRegister/Add-Account?email=${data.email}&name=${data.name}&phone_number=${data.phone}&password=${data.password}`,
                method: 'POST',
                body: data,
            }),
        }),
        logout: builder.mutation({
            query: () => ({
                url: `/logout`,
                method: 'POST',
            }),
        }),
        profile: builder.mutation({
            query: (data) => ({
                url: `/api/Account/Update-Account?id=${data.id}`,
                method: 'PUT',
                body: data,
            }),
        }),
        getUsers: builder.query({
            query: (accountId) => ({
                url: `/api/Account/Get-All-Account-Have-Lower-Role?accountId=${accountId}`,
            }),
            providesTags: ['User'],
            keepUnusedDataFor: 5,
        }),
        deleteUser: builder.mutation({
            query: (accountId) => ({
                url: `/api/Account/Delete-Account?id=${accountId}`,
                method: 'DELETE',
            }),
        }),
        getUserDetails: builder.query({
            query: (accountId) => ({
                url: `/api/Account/Get-Account-By-Id?id=${accountId}`,
            }),
            keepUnusedDataFor: 5,
        }),
        updateUser: builder.mutation({
            query: (data) => ({
                url: `/api/Account/Update-Account?id=${data.accountId}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ['User'],
        }),

        getAccountById : builder.query({
            query: (accountId) => ({
                url: `/api/Account/Get-Account-By-Id?id=${accountId}`,
            }),
        }),

        updateChangeRole: builder.mutation({
            query: (data) => ({
                url: `/api/Account/ChangeRole?AccountId=${data.accountId}&Role=${data.role}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ['User'],
        }),

        unBanUser: builder.mutation({
            query: (accountId) => ({
                url: `/api/Account/Undelete-Account?id=${accountId}`,
                method: 'PUT',
            }),
            invalidatesTags: ['User'],
        })

    }),
});

export const {
    useLoginMutation,
    useLogoutMutation,
    useRegisterMutation,
    useProfileMutation,
    useGetUsersQuery,
    useDeleteUserMutation,
    useUpdateUserMutation,
    useGetUserDetailsQuery,
    useGetAccountByIdQuery,
    useUpdateChangeRoleMutation,
    useUnBanUserMutation
} = userApiSlice;
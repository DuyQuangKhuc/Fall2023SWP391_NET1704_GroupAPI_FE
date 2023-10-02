import React, { useState } from 'react';
import ComHeaderAdmin from '../Components/ComHeaderAdmin/ComHeaderAdmin';
import { notification, Modal } from 'antd';
import { textApp } from '../../TextContent/textApp'
import * as yup from "yup"
import { useFormik } from 'formik';
export default function AccountManage() {
    const accounts = [
        { id: 1, name: 'Tài khoản 1' },
        { id: 2, name: 'Tài khoản 2' },
        { id: 3, name: 'Tài khoản 3' },
    ];

    const AccountSchema = yup.object().shape({
        updatedName: yup.string().required('Vui lòng nhập tên tài khoản'),
        updatedPhone: yup.string().required('Vui lòng nhập số điện thoại'),
    });

    const formik = useFormik({
        initialValues: {
            updatedName: '',
            updatedPhone: '',
        },
        validationSchema: AccountSchema,
        onSubmit: (values) => {
            console.log('Dữ liệu cập nhật:', values);
            handleConfirmUpdate();
        },
    });

    const [selectedAccount, setSelectedAccount] = useState(null);
    const [api, contextHolder] = notification.useNotification();

    const [deleteAccount, setDeleteAccount] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const [updateAccount, setUpdateAccount] = useState(null);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

    const [updatedName, setUpdatedName] = useState('');
    const [updatedPhone, setUpdatedPhone] = useState('');

    //update
    const handleConfirmUpdate = () => {
        if (updateAccount) {
            console.log('Cập nhật tài khoản:', updateAccount.id);
            console.log('Tên mới:', updatedName);
            console.log('Số điện thoại mới:', updatedPhone);
        }

        setIsUpdateModalOpen(false);
        setUpdateAccount(null);
        setUpdatedName('');
        setUpdatedPhone('');
        api.success({
            message: 'Cập nhật thành công',
            description: 'Tài khoản đã được cập nhật thành công.',
            duration: 2,
        });
    };

    const handleUpdate = (accountId) => {
        const account = accounts.find((account) => account.id === accountId);
        setSelectedAccount(account);
        console.log(selectedAccount)
        setUpdateAccount(accountId);
        setIsUpdateModalOpen(true);
    };

    //delete
    const handleDelete = (accountId) => {
        setDeleteAccount(accountId);
        setIsDeleteModalOpen(true);
    };


    const handleConfirmDelete = () => {
        setIsDeleteModalOpen(false);
        setDeleteAccount(null);
        api.success({
            message: 'Xóa thành công',
            description: 'Tài khoản đã được xóa thành công.',
            duration: 2,
        });
    };

    //close popup
    const handleDeleteClose = () => {
        setIsDeleteModalOpen(false)
    }

    const handleUpdateClose = () => {
        setIsUpdateModalOpen(false)
    }


    const handleCreate = () => {
        // tạo tài khoản mới
    };

    return (
        <div>
            {contextHolder}
            <ComHeaderAdmin />
            <div className="isolate bg-white px-6 py-10 sm:py-10 lg:px-8">
                <div className="mx-auto max-w-2xl text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                        {textApp.HeaderAdmin.pageTitle}
                    </h2>

                </div>
                <div className="mx-auto max-w-screen-lg">
                    <table className="min-w-full border border w-100">
                        <thead>
                            <tr>
                                <th className="py-2 px-4 border text-center">ID</th>
                                <th className="py-2 px-4 border text-center">Tên tài khoản</th>
                                <th className="py-2 px-4 border text-center">Số điện thoại</th>
                                <th className="py-2 px-4 border text-center">Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {accounts.map((account) => (
                                <tr key={account.id}>
                                    <td className="py-2 px-4 border text-center">{account.id}</td>
                                    <td className="py-2 px-4 border text-center">{account.name}</td>
                                    <td className="py-2 px-4 border text-center">số điện thoại</td>
                                    <td className="py-2 px-4 border text-center">
                                        <button
                                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 mr-2 rounded"
                                            onClick={() => handleDelete(account.id)}
                                        >
                                            Xóa
                                        </button>
                                        <button
                                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                            onClick={() => handleUpdate(account.id)}
                                        >
                                            Cập nhật
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <button
                    className="rounded bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 mt-4"
                    onClick={handleCreate}
                >
                    Tạo tài khoản mới
                </button>




                {/* Thông báo delete */}
                <Modal
                    title="Xác nhận xóa"
                    open={isDeleteModalOpen}
                    onCancel={handleDeleteClose}
                >
                    <p>Bạn có chắc chắn muốn xóa tài khoản này?</p>

                    <div className="flex justify-end mt-4">
                        <button
                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 mr-2 rounded"
                            onClick={handleConfirmDelete}
                        >
                            Xác nhận
                        </button>
                        <button
                            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                            onClick={handleDeleteClose}
                        >
                            Hủy bỏ
                        </button>
                    </div>
                </Modal>

                {/* Thông báo cập nhật  */}

                <Modal
                    title="Cập nhật tài khoản"
                    open={isUpdateModalOpen}
                    onCancel={handleUpdateClose}
                >

                    <form onSubmit={formik.handleSubmit}>
                        <div className="mb-4">
                            <label htmlFor="updatedName" className="block text-gray-700 text-sm font-bold mb-2">
                                Tên tài khoản
                            </label>
                            <input
                                id="updatedName"
                                name="updatedName"
                                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${formik.touched.updatedName && formik.errors.updatedName ? 'border-red-500' : ''
                                    }`}
                                type="text"
                                value={formik.values.updatedName}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                            {formik.touched.updatedName && formik.errors.updatedName && (
                                <p className="text-red-500 text-xs italic">{formik.errors.updatedName}</p>
                            )}
                        </div>

                        <div className="mb-4">
                            <label htmlFor="updatedPhone" className="block text-gray-700 text-sm font-bold mb-2">
                                Số điện thoại
                            </label>
                            <input
                                id="updatedPhone"
                                name="updatedPhone"
                                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${formik.touched.updatedPhone && formik.errors.updatedPhone ? 'border-red-500' : ''
                                    }`}
                                type="text"
                                value={formik.values.updatedPhone}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                            {formik.touched.updatedPhone && formik.errors.updatedPhone && (
                                <p className="text-red-500 text-xs italic">{formik.errors.updatedPhone}</p>
                            )}
                        </div>

                        <div className="flex justify-end mt-4">
                            <button
                                type="submit"
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mr-2 rounded"
                            >
                                Xác nhận
                            </button>
                            <button
                                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                                onClick={handleUpdateClose}
                            >
                                Hủy bỏ
                            </button>
                        </div>
                    </form>
                </Modal>

            </div>
        </div>
    );
}
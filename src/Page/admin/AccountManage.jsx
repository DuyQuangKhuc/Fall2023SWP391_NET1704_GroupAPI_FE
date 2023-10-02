import React, { useState } from 'react';
import ComHeaderAdmin from '../Components/ComHeaderAdmin/ComHeaderAdmin';
import { notification, Modal } from 'antd';
import { textApp } from '../../TextContent/textApp'

export default function AccountManage() {
    const accounts = [
        { id: 1, name: 'Tài khoản 1' },
        { id: 2, name: 'Tài khoản 2' },
        { id: 3, name: 'Tài khoản 3' },
    ];

    const [api, contextHolder] = notification.useNotification();
    const [deleteAccount, setDeleteAccount] = useState(null);
    const [isOpen, setisOpen] = useState(false);

    const handleDelete = (accountId) => {
        setDeleteAccount(accountId);
        setisOpen(true);
    };

    const handleCancel = () => {
        setisOpen(false);
    };

    const handleConfirmDelete = () => {
        // Xử lý xóa tài khoản với ID được cung cấp
        setisOpen(false);
        setDeleteAccount(null);
        // Hiển thị thông báo xóa thành công
        api.success({
            message: 'Xóa thành công',
            description: 'Tài khoản đã được xóa thành công.',
            duration: 3,
        });
    };

    const handleUpdate = (accountId) => {
        // cập nhật 
    };

    const handleCreate = () => {
        // tạo tài khoản mới
    };

    return (
        <div>
            {contextHolder}
            <ComHeaderAdmin />
            <div className="mx-auto max-w-2xl text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                        {textApp.HeaderAdmin.pageTitle}
                    </h2>

                </div>
            <table className="min-w-full border">
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

            <button
                className="rounded bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 mt-4"
                onClick={handleCreate}
            >
                Tạo tài khoản mới
            </button>

            <Modal
                title="Xác nhận xóa"
                visible={isOpen}
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
                        onClick={handleCancel}
                    >
                        Hủy bỏ
                    </button>
                </div>
            </Modal>
        </div>
    );
}
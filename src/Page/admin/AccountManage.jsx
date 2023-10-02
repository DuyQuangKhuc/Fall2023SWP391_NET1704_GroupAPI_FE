import React from 'react';
import ComHeaderAdmin from '../Components/ComHeaderAdmin/ComHeaderAdmin';
import { notification } from 'antd'

export default function AccountManage() {
    const accounts = [
        { id: 1, name: 'Tài khoản 1' },
        { id: 2, name: 'Tài khoản 2' },
        { id: 3, name: 'Tài khoản 3' },
    ];

    const [api, contextHolder] = notification.useNotification();

    const handleDelete = (accountId) => {
        // xóa
    };

    const handleUpdate = (accountId) => {
        // cập nhật
    };

    const handleCreate = () => {
        // tạo 
    };

    return (
        <div>
            {contextHolder}
            <ComHeaderAdmin />
            <table className="min-w-full border">
                <thead>
                    <tr>
                        <th className="py-2 px-4 border text-center">ID</th>
                        <th className="py-2 px-4 border text-center">Tên tài khoản</th>
                        <th className="py-2 px-4 border text-center">Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {accounts.map((account) => (
                        <tr key={account.id}>
                            <td className="py-2 px-4 border text-center">{account.id}</td>
                            <td className="py-2 px-4 border text-center">{account.name}</td>
                            <td className="py-2 px-4 border text-center">
                                <button
                                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 mr-2"
                                    onClick={() => handleDelete(account.id)}
                                >
                                    Xóa
                                </button>
                                <button
                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4"
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
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 mt-4"
                onClick={handleCreate}
            >
                Tạo tài khoản mới
            </button>
        </div>
    );
}
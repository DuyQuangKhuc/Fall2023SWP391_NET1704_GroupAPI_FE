import React, { useEffect, useState } from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { Table, Button, Container, ListGroup } from 'react-bootstrap';
import { FaTrash, FaEdit, FaCheck, FaTimes } from 'react-icons/fa';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import {
    useDeleteUserMutation,
    useGetUsersQuery,
    useUpdateChangeRoleMutation,
} from '../../slices/usersApiSlice';
import { toast } from 'react-toastify';
import { Box, Dialog, DialogActions, DialogContent, DialogTitle } from '@material-ui/core';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { Col, Image, Row } from 'antd';
import { useDispatch } from 'react-redux';

const VISIBLE_FIELDS = ['email', 'phone', 'address', 'point', 'role', 'isDeleted'];

const UserListScreen = () => {
    const { data: users, refetch, isLoading, error } = useGetUsersQuery();

    const roleMapping = {
        1: "Admin",
        2: "Manager",
        3: "Staff",
        4: "User",
    };
    const [role, setRole] = useState('');
    const [updateChangeRole] = useUpdateChangeRoleMutation();

    useEffect(() => {
        setRole(role);     
    }, []);


    const submitHandler = async (e, accountId) => {
        e.preventDefault();
        try {
            const res = await updateChangeRole({
                accountId,
                role
            }).unwrap();
            toast.success('Cập nhập thành công');
        } catch (err) {
            toast.error("lỗi");
        }
    };

    const [deleteUser] = useDeleteUserMutation();

    const deleteHandler = async (accountId) => {
        if (window.confirm('Are you sure')) {
            try {
                await deleteUser(accountId);
                refetch();
            } catch (err) {
                toast.error(err?.data?.message || err.error);
            }
        }
    };

    return (
        <Container >
            <h1>Users</h1>
            {isLoading ? (
                <Loader />
            ) : error ? (
                <Message variant='danger'>
                    {error?.data?.message || error.error}
                </Message>
            ) : (
                <Table striped bordered hover responsive className='table-sm'>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Tên</th>
                            <th>Địa chỉ</th>
                            <th>EMAIL</th>
                            <th>Vai trò</th>
                            <th>Hoạt động</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.accountId}>
                                <td>{user.accountId}</td>
                                <td>{user.name}</td>
                                <td>{user.address}</td>
                                <td>
                                    <a href={`mailto:${user.email}`}>{user.email}</a>
                                </td>
                                <td>{user.role && user.role === 1 ? 'Admin' : user.role === 2 ? 'Manager' : user.role === 3 ? 'Staff' : user.role === 4 ? 'User' : ''}</td>
                                <td>
                                    {user.isDeleted === 0 ? (
                                        <FaCheck style={{ color: 'green' }} />
                                    ) : (
                                        <FaTimes style={{ color: 'red' }} />
                                    )}
                                </td>
                                <td>
                                    {user.role === 4 && (
                                        <>
                                            <form onSubmit={(e) => submitHandler(e, user.accountId)}>
                                                <select value={role} onChange={(e) => setRole(e.target.value)}>
                                                    <option value="">Select Role</option>
                                                    <option value="1">Admin</option>
                                                    <option value="2">Manager</option>
                                                    <option value="3">Staff</option>
                                                    <option value="4">User</option>
                                                </select>
                                                <button type="submit">Change Role</button>
                                            </form>
                                            <Button
                                                variant='danger'
                                                className='btn-sm'
                                                onClick={() => deleteHandler(user._id)}
                                            >
                                                <FaTrash style={{ color: 'white' }} />
                                            </Button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}
        </Container>
    );
};

export default UserListScreen;
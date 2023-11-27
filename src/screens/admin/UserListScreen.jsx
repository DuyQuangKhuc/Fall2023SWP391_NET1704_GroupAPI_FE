import React, { useEffect, useState } from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { Table, Button, Container, ListGroup, Form, Dropdown } from 'react-bootstrap';
import { FaTrash, FaEdit, FaCheck, FaTimes, FaBan, FaExchangeAlt, FaEllipsisV, FaUnlock } from 'react-icons/fa';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import {
    useDeleteUserMutation,
    useGetUsersQuery,
    useUnBanUserMutation,
    useUpdateChangeRoleMutation,
} from '../../slices/usersApiSlice';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';

const VISIBLE_FIELDS = ['email', 'phone', 'address', 'point', 'role', 'isDeleted'];

const UserListScreen = () => {

    const { userInfo } = useSelector((state) => state.auth);
    const roleMapping = {
        1: "Admin",
        2: "Manager",
        3: "Staff",
        4: "User",
    };

    const { data: users, refetch, isLoading, error } = useGetUsersQuery(userInfo?.accountId);
    const [role, setRole] = useState('');
    const [updateChangeRole] = useUpdateChangeRoleMutation();



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
        if (window.confirm('Ban tài khoản này?')) {
            try {
                await deleteUser(accountId);
                refetch();
            } catch (err) {
                toast.error(err?.data?.message || err.error);
            }
        }
    };

    const [unBanUser] = useUnBanUserMutation();

    const handlerUnBanUser = async (accountId) => {
        if (window.confirm('Ngừng ban tài khoản này?')) {
            try {
                await unBanUser(accountId);
                refetch();
            } catch (err) {
                toast.error(err?.data?.message || err.error);
            }
        }
    };

    const [open, setOpen] = React.useState(false);


    const handleClickOpen = () => {
        setOpen(true);
    };

    const [filter, setFilter] = useState('');

    return (
        <Container >
            <h1 className='table-sm mt-4'>Quản lí tài khoản</h1>
            {isLoading ? (
                <Loader />
            ) : error ? (
                <Message variant='danger'>
                    {error?.data?.message || error.error}
                </Message>
            ) : (
                <>
                    <Dropdown>
                        <Dropdown.Toggle variant="light" id="dropdown-filter">
                            {filter}
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item onClick={() => setFilter('All')}>All</Dropdown.Item>
                            {/* <Dropdown.Item onClick={() => setFilter('admin')}>Admin</Dropdown.Item> */}
                            <Dropdown.Item onClick={() => setFilter('Manager')}>Manager</Dropdown.Item>
                            <Dropdown.Item onClick={() => setFilter('Staff')}>Staff</Dropdown.Item>
                            <Dropdown.Item onClick={() => setFilter('user')}>User</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                    <Table striped bordered hover responsive className='table-sm mt-4'>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Tên</th>
                                <th>Địa chỉ</th>
                                <th>Email</th>
                                <th>Vai trò</th>
                                <th>Trạng thái</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {users
                                .filter((user) => {
                                    if (filter === 'Manager') {
                                        return user.role === 2;
                                    } else if (filter === 'Staff') {
                                        return user.role === 3;
                                    } else if (filter === 'user') {
                                        return user.role === 4;
                                    } else {
                                        return true;
                                    }
                                })
                                .map((user) => (
                                    <tr key={user.accountId}>
                                        <td>{user.accountId}</td>
                                        <td>{user.name}</td>
                                        <td>{user.address}</td>
                                        <td >
                                            <a href={`mailto:${user.email}`} style={{ display: 'flex', justifyItems: 'start' }}>{user.email}</a>
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
                                            {userInfo.role === 1 ? (
                                                <div style={{ display: 'flex', justifyContent: 'center' }}>

                                                    <Dropdown >
                                                        <Dropdown.Toggle variant='dark' className='btn-sm'>
                                                            <FaExchangeAlt />
                                                        </Dropdown.Toggle>
                                                        <Dropdown.Menu size="sm">
                                                            <form style={{ display: 'flex' }} onSubmit={(e) => submitHandler(e, user.accountId)}>
                                                                <select value={role} onChange={(e) => setRole(e.target.value)} style={{ marginInlineStart: 10 }}>
                                                                    <option value="">Đổi vai trò</option>
                                                                    {/* <option value="1">Admin</option> */}
                                                                    <option value="2">Manager</option>
                                                                    <option value="3">Staff</option>
                                                                    <option value="4">User</option>
                                                                </select>
                                                                <Button className='btn-sm' type="submit" style={{ marginInlineStart: 10 }}>Lưu</Button>
                                                            </form>
                                                        </Dropdown.Menu>
                                                    </Dropdown>
                                                    {user.isDeleted === 0 ? (
                                                        <Button
                                                            style={{ marginInlineStart: 10 }}
                                                            variant='danger'
                                                            className='btn-sm'
                                                            onClick={() => deleteHandler(user.accountId)}
                                                        >
                                                            <FaBan style={{ color: 'white' }} />
                                                        </Button>
                                                    ) : (
                                                        <Button
                                                            style={{ marginInlineStart: 10 }}
                                                            variant='dark'
                                                            className='btn-sm'
                                                            onClick={() => handlerUnBanUser(user.accountId)}
                                                        >
                                                            <FaUnlock style={{ color: 'white' }} />
                                                        </Button>
                                                    )}
                                                </div>
                                            ) : (
                                                userInfo?.role === 2 ? (
                                                    <div style={{ display: 'flex', justifyContent: 'center' }}>

                                                        <Dropdown >
                                                            <Dropdown.Toggle variant='dark' className='btn-sm'>
                                                                <FaExchangeAlt />
                                                            </Dropdown.Toggle>
                                                            <Dropdown.Menu size="sm">
                                                                <form style={{ display: 'flex' }} onSubmit={(e) => submitHandler(e, user.accountId)}>
                                                                    <select value={role} onChange={(e) => setRole(e.target.value)} style={{ marginInlineStart: 10 }}>
                                                                        <option value="">Đổi vai trò</option>
                                                                        {/* <option value="1">Admin</option> */}
                                                                        {/* <option value="2">Manager</option> */}
                                                                        <option value="3">Staff</option>
                                                                        <option value="4">User</option>
                                                                    </select>
                                                                    <Button className='btn-sm' type="submit" style={{ marginInlineStart: 10 }}>Lưu</Button>
                                                                </form>
                                                            </Dropdown.Menu>
                                                        </Dropdown>

                                                        {user.isDeleted === 0 ? (
                                                            <Button
                                                                style={{ marginInlineStart: 10 }}
                                                                variant='danger'
                                                                className='btn-sm'
                                                                onClick={() => deleteHandler(user.accountId)}
                                                            >
                                                                <FaBan style={{ color: 'white' }} />
                                                            </Button>
                                                        ) : (
                                                            <Button
                                                                style={{ marginInlineStart: 10 }}
                                                                variant='dark'
                                                                className='btn-sm'
                                                                onClick={() => handlerUnBanUser(user.accountId)}
                                                            >
                                                                <FaUnlock style={{ color: 'white' }} />
                                                            </Button>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <div style={{ display: 'flex', justifyContent: 'center' }}>

                                                        {user.isDeleted === 0 ? (
                                                            <Button
                                                                style={{ marginInlineStart: 10 }}
                                                                variant='danger'
                                                                className='btn-sm'
                                                                onClick={() => deleteHandler(user.accountId)}
                                                            >
                                                                <FaBan style={{ color: 'white' }} />
                                                            </Button>
                                                        ) : (
                                                            <Button
                                                                style={{ marginInlineStart: 10 }}
                                                                variant='dark'
                                                                className='btn-sm'
                                                                onClick={() => handlerUnBanUser(user.accountId)}
                                                            >
                                                                <FaUnlock style={{ color: 'white' }} />
                                                            </Button>
                                                        )}
                                                    </div>
                                                )
                                            )}
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </Table>
                </>
            )}
        </Container>
    );
};

export default UserListScreen;
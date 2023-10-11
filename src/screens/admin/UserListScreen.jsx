import React, { useState } from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { Table, Button, Container, ListGroup } from 'react-bootstrap';
import { FaTrash, FaEdit, FaCheck, FaTimes } from 'react-icons/fa';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import {
    useDeleteUserMutation,
    useGetUsersQuery,
} from '../../slices/usersApiSlice';
import { toast } from 'react-toastify';
import { Box, Dialog, DialogActions, DialogContent, DialogTitle } from '@material-ui/core';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { Col, Image, Row } from 'antd';

const VISIBLE_FIELDS = ['email', 'phone', 'address', 'point', 'role', 'status'];

const UserListScreen = () => {
    const { data: users, refetch, isLoading, error } = useGetUsersQuery();

    const getRowId = (row) => row.accountId;

    const roleMapping = {
        1: "Admin",
        2: "Manager",
        3: "Staff",
        4: "User",
    };
    // Otherwise filter will be applied on fields such as the hidden column id
    const columns = React.useMemo(
        () =>
            VISIBLE_FIELDS.map((field) => {
                if (field === 'role') {
                    return {
                        field,
                        headerName: field.toUpperCase(),
                        width: 150,
                        sortable: true,
                        filterable: true,
                        renderCell: (params) => (
                            <div onClick={() => handleCellClick(params)}>
                                {roleMapping[params?.role] || ''}
                            </div>

                        ),
                    };
                } else {
                    return {
                        field,
                        headerName: field.toUpperCase(),
                        width: 170,
                        sortable: true,
                        filterable: true,
                        renderCell: (params) => (
                            <div onClick={() => handleCellClick(params)}>
                                {roleMapping[params?.role] || ''}
                            </div>
                        ),
                    };
                }
            }),
        []
    );

    const [selectedRow, setSelectedRow] = useState(null);

    function handleCellClick(params) {
        // Set the selected row to the clicked row
        setSelectedRow(params.row);
    }

    function handleCloseDialog() {
        // Clear the selected row when the dialog is closed
        setSelectedRow(null);
    }


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

                <Box sx={{ height: 600, width: 1 }}>
                    <DataGrid
                        rows={users}
                        getRowId={getRowId}
                        disableColumnFilter
                        disableColumnSelector
                        disableDensitySelector
                        columns={columns}
                        slots={{ toolbar: GridToolbar }}
                        slotProps={{
                            toolbar: {
                                showQuickFilter: true,
                            },
                        }}
                        onCellClick={handleCellClick}
                    />
                    {selectedRow && (
                        <Dialog open={Boolean(selectedRow)} onClose={handleCloseDialog}>
                            <DialogTitle>{selectedRow.name}</DialogTitle>
                            <DialogContent>
                                <Row>
                                    {/* <Col md={6}>
                                                <Image src={selectedRow.imagePath1} alt={selectedRow.name} fluid />
                                            </Col> */}
                                    <Col >
                                        <ListGroup variant='flush'>
                                            <ListGroup.Item>ID: {selectedRow.accountId}</ListGroup.Item>
                                            <ListGroup.Item>
                                                Email: {selectedRow.email}
                                            </ListGroup.Item>
                                            <ListGroup.Item>
                                                Địa chỉ: {selectedRow.address}
                                            </ListGroup.Item>
                                            <ListGroup.Item>
                                                Số điện thoại: {selectedRow.phone}
                                            </ListGroup.Item>
                                            <ListGroup.Item>
                                                Điểm: {selectedRow.point}
                                            </ListGroup.Item>
                                            <ListGroup.Item>
                                                Role: {selectedRow.role === 1 ? "Admin" : selectedRow.role === 2 ? "Manager" : selectedRow.role === 3 ? "Staff" : selectedRow.role === 4 ? "User" : ''}
                                            </ListGroup.Item>
                                            <ListGroup.Item>
                                                Status: {selectedRow.status}
                                            </ListGroup.Item>
                                        </ListGroup>
                                    </Col>
                                </Row>
                            </DialogContent>
                            <DialogActions style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Button onClick={handleCloseDialog}>Close</Button>
                                <div style={{ display: 'flex' }}>
                                    <LinkContainer to={`/admin/product/${selectedRow.accountId}/edit`}>
                                        <Button variant='light' className='btn-sm mx-2'>
                                            <FaEdit />
                                        </Button>
                                    </LinkContainer>
                                    <Button
                                        variant='danger'
                                        className='btn-sm'
                                        onClick={() => deleteHandler(selectedRow.accountId)}
                                    >
                                        <FaTrash style={{ color: 'white' }} />
                                    </Button>
                                </div>
                            </DialogActions>
                        </Dialog>
                    )}
                </Box>
                /* <Table striped bordered hover responsive className='table-sm'>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>NAME</th>
                            <th>EMAIL</th>
                            <th>ADMIN</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user._id}>
                                <td>{user._id}</td>
                                <td>{user.name}</td>
                                <td>
                                    <a href={`mailto:${user.email}`}>{user.email}</a>
                                </td>
                                <td>
                                    {user.isAdmin ? (
                                        <FaCheck style={{ color: 'green' }} />
                                    ) : (
                                        <FaTimes style={{ color: 'red' }} />
                                    )}
                                </td>
                                <td>
                                    {!user.isAdmin && (
                                        <>
                                            <LinkContainer
                                                to={`/admin/user/${user._id}/edit`}
                                                style={{ marginRight: '10px' }}
                                            >
                                                <Button variant='light' className='btn-sm'>
                                                    <FaEdit />
                                                </Button>
                                            </LinkContainer>
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
                </Table> */
            )}
        </Container>
    );
};

export default UserListScreen;
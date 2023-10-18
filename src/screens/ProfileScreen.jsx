import React, { useEffect, useState } from 'react';
import { Table, Form, Button, Row, Col, Container } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { FaCheck, FaTimes, AiOutlinePlusCircle, FaPlus, FaWindowMinimize } from 'react-icons/fa';

import { toast } from 'react-toastify';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { useProfileMutation } from '../slices/usersApiSlice';
import { useGetMyOrdersQuery, useGetOrderIsUsingByAccountIdQuery } from '../slices/ordersApiSlice';
import { setCredentials } from '../slices/authSlice';
import { useParams } from 'react-router-dom';
import { Tabs } from 'antd';
import TabPane from 'antd/es/tabs/TabPane';
import { useGetListProductCreatedByUserQuery } from '../slices/productsApiSlice';
import ButtonGroup from 'antd/es/button/button-group';

const ProfileScreen = () => {

    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const { userInfo } = useSelector((state) => state.auth);

    // Define useState hook to track the expanded rows
    const [expandedRows, setExpandedRows] = useState([]);

    // Function to toggle the expanded state of a row
    const toggleRow = (index) => {
        // Check if the row is already expanded
        if (expandedRows.includes(index)) {
            // Remove the row index from the expanded rows array
            setExpandedRows(expandedRows.filter((row) => row !== index));
        } else {
            // Add the row index to the expanded rows array
            setExpandedRows([...expandedRows, index]);
        }
    };

    // Function to check if a row is expanded
    const isRowExpanded = (index) => expandedRows.includes(index);

    const { id: accountId } = useParams();

    const { data: orders, isLoading, error } = useGetMyOrdersQuery(accountId);


    const { data: getListProductCreatedByUser } = useGetListProductCreatedByUserQuery(accountId);

    const [updateProfile, { isLoading: loadingUpdateProfile }] =
        useProfileMutation();

    useEffect(() => {
        setPhone(userInfo.phone);
        setEmail(userInfo.email);
    }, [userInfo.email, userInfo.phone]);

    const dispatch = useDispatch();

    const submitHandler = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            toast.error('Passwords do not match');
        } else {
            try {
                const res = await updateProfile({
                    accountId: userInfo.accountId,
                    phone,
                    email,
                    password,
                }).unwrap();
                dispatch(setCredentials({ ...res }));
                toast.success('Profile updated successfully');
            } catch (err) {
                toast.error(err?.data?.message || err.error);
            }
        }
    };
    console.log('orders:', orders);
    return (
        <Container className='my-3'>
            <Row>
                <Col md={3}>
                    <h2>User Profile</h2>

                    <Form onSubmit={submitHandler}>

                        <Form.Group className='my-2' controlId='email'>
                            <Form.Label>Email Address</Form.Label>
                            <Form.Control
                                type='email'
                                placeholder='Enter email'
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            ></Form.Control>
                        </Form.Group>

                        <Form.Group className='my-2' controlId='phone'>
                            <Form.Label>Phone</Form.Label>
                            <Form.Control
                                type='phone'
                                placeholder='Enter phone'
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                            ></Form.Control>
                        </Form.Group>

                        <Form.Group className='my-2' controlId='password'>
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type='password'
                                placeholder='Enter password'
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            ></Form.Control>
                        </Form.Group>

                        <Form.Group className='my-2' controlId='confirmPassword'>
                            <Form.Label>Confirm Password</Form.Label>
                            <Form.Control
                                type='password'
                                placeholder='Confirm password'
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            ></Form.Control>
                        </Form.Group>

                        <Button type='submit' variant='primary'>
                            Update
                        </Button>
                        {loadingUpdateProfile && <Loader />}
                    </Form>
                </Col>
                <Col md={9}>
                    <Tabs defaultActiveKey='1'>
                        <TabPane tab=<h4>Đơn hàng</h4> key='1'>
                            
                            {isLoading ? (
                                <Loader />
                            ) : (

                                <Table striped hover responsive className='table-sm'>
                                    <thead>
                                        <tr>
                                            <th>Mã đơn hàng</th>
                                            <th>Ngày tạo đơn</th>
                                            <th>Tổng số tiền</th>
                                            <th>Thanh toán</th>
                                            {/* <th>DELIVERED</th> */}
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>

                                        {orders && orders?.map((order, index) => (
                                            <tr key={index}>
                                                <td>{order.orderId}</td>
                                                <td>{order.orderDate}</td>
                                                <td>${order.totalPrice}</td>
                                                <td>
                                                    {order.status && order.status === 1 ? (
                                                        <FaCheck style={{ color: 'green' }} />
                                                    ) : (
                                                        <FaTimes style={{ color: 'red' }} />
                                                    )}
                                                </td>
                                                {/* <td>
                                        {order.isDelivered ? (
                                            order.deliveredAt.substring(0, 10)
                                        ) : (
                                            <FaTimes style={{ color: 'red' }} />
                                        )}
                                    </td> */}
                                                <td>
                                                    <LinkContainer to={`/order/${order.orderId}`}>
                                                        <Button className='btn-sm' variant='light'>
                                                            Details
                                                        </Button>
                                                    </LinkContainer>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            )}
                        </TabPane>
                        <TabPane tab=<h4>Lịch sử đặt hàng</h4> key='2'>
                            <Table striped hover responsive className='table-sm'>
                                <thead>
                                    <tr>
                                        <th></th>
                                        <th>Mã đơn hàng</th>
                                        <th>Ngày tạo đơn</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>

                                    {getListProductCreatedByUser && getListProductCreatedByUser?.map((order, index) => (
                                        <React.Fragment key={index}>
                                            <tr>
                                                <td>
                                                    <ButtonGroup onClick={() => toggleRow(index)}>
                                                        {isRowExpanded(index) ? <FaWindowMinimize /> : <FaPlus />}
                                                    </ButtonGroup>
                                                </td>
                                                <td>{order.productId}</td>
                                                <td>{order.uploadDate}</td>
                                            </tr>
                                            {isRowExpanded(index) && (
                                                
                                                <tr>
                                                    <td colSpan="3">
                                                        <td>{order.productId}</td>
                                                        <td>{order.uploadDate}</td>
                                                    </td>
                                                </tr>
                                            )}
                                        </React.Fragment>
                                    ))}
                                </tbody>
                            </Table>
                        </TabPane>
                    </Tabs>
                </Col>
            </Row>
        </Container>
    );
};

export default ProfileScreen;
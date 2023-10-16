import React, { useEffect, useState } from 'react';
import { Table, Form, Button, Row, Col, Container } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { FaCheck, FaTimes } from 'react-icons/fa';

import { toast } from 'react-toastify';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { useProfileMutation } from '../slices/usersApiSlice';
import { useGetMyOrdersQuery, useGetOrderIsUsingByAccountIdQuery } from '../slices/ordersApiSlice';
import { setCredentials } from '../slices/authSlice';
import { useParams } from 'react-router-dom';

const ProfileScreen = () => {

    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const { userInfo } = useSelector((state) => state.auth);

    const { id: accountId } = useParams();

    const { data: orders, isLoading, error } = useGetMyOrdersQuery(accountId);

    
    

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
                    <h2>My Orders</h2>
                    {isLoading ? (
                        <Loader />
                    ) : error ? (
                        <Message variant='danger'>
                            {error?.data?.message || error.error}
                        </Message>
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
                </Col>
            </Row>
        </Container>
    );
};

export default ProfileScreen;
import React, { useEffect, useState } from 'react';
import { Table, Form, Button, Row, Col, Container } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { FaCheck, FaTimes, FaPlus, FaWindowMinimize } from 'react-icons/fa';
import { toast } from 'react-toastify';
import Loader from '../components/Loader';
import { useProfileMutation, useUpdateUserMutation } from '../slices/usersApiSlice';
import { useGetListOrderOfUserQuery, useGetMyOrdersQuery } from '../slices/ordersApiSlice';
import { setCredentials } from '../slices/authSlice';
import { useParams } from 'react-router-dom';
import { Tabs } from 'antd';
import TabPane from 'antd/es/tabs/TabPane';
import { useGetListAllComponentQuery, useGetListComponentOfProductQuery, useGetListProductCreatedByUserQuery } from '../slices/productsApiSlice';
import ButtonGroup from 'antd/es/button/button-group';

const ProfileScreen = () => {
    const [name, setUser] = useState('');
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
    useEffect(() => {
        if (getListProductCreatedByUser) {
            localStorage.setItem('ListProductCreatedByUser', JSON.stringify(getListProductCreatedByUser));
        }
    }, [getListProductCreatedByUser]);

    const { data: getListOrderOfUser } = useGetListOrderOfUserQuery(accountId);


    const [product] = useState(JSON.parse(localStorage.getItem('ListProductCreatedByUser')));

    const { data: getListAllComponent } = useGetListAllComponentQuery();
    // const filteredComponents = getListAllComponent?.filter(component => component.productId === product.productId);

    

    const [updateUser, { isLoading: loadingUpdateProfile }] = useUpdateUserMutation(accountId);
    

    useEffect(() => {
        setPhone(userInfo.phone);
        setEmail(userInfo.email);
        setUser(userInfo.name)
    }, [userInfo.email, userInfo.phone, userInfo.name]);

    const dispatch = useDispatch();

    const submitHandler = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            toast.error('sai mật khẩu');
        } else {
            try {
                const res = await updateUser({
                    accountId,
                    name,
                    phone,
                    email,
                    password,
                }).unwrap();
                dispatch(setCredentials({ ...res }));
                toast.success('Cập nhập thành công');
            } catch (err) {
                toast.error("lỗi");
            }
        }
    };

    return (
        <Container className='my-3'>
            <Row>
                <Col md={3}>
                    <h2>User Profile</h2>

                    <Form onSubmit={submitHandler}>
                        <Form.Group className='my-2' controlId='user'>
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                type='user'
                                placeholder='Enter user'
                                value={name}
                                onChange={(e) => setUser(e.target.value)}
                            ></Form.Control>
                        </Form.Group>

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
                                required
                            ></Form.Control>
                        </Form.Group>

                        <Form.Group className='my-2' controlId='confirmPassword'>
                            <Form.Label>New Password</Form.Label>
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
                        <TabPane tab=<h4>Lịch sử đặt hàng</h4> key='1'>
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
                                    {getListProductCreatedByUser?.map((order, index) => (
                                        <React.Fragment key={index}>
                                            <tr>
                                                <td>
                                                    <ButtonGroup onClick={() => toggleRow(index)}>
                                                        {isRowExpanded(index) ? <FaWindowMinimize /> : <FaPlus />}
                                                    </ButtonGroup>
                                                </td>
                                                <td>{order?.productId}</td>
                                                <td>{order.uploadDate}</td>
                                            </tr>
                                            {isRowExpanded(index) && (
                                                getListAllComponent
                                                    .filter((id) => id.componentId === order?.productId)
                                                    .map((id, subIndex) => (
                                                        <div key={subIndex}>
                                                            <td>{id?.name}</td>
                                                            <td>{id?.material}</td>
                                                            <td>{id?.description}</td>
                                                            <td>{id?.color}</td>
                                                            <td>{id?.isReplacable}</td>
                                                        </div>
                                                    ))
                                            )}
                                        </React.Fragment>
                                    ))}
                                </tbody>
                            </Table>
                        </TabPane>
                        <TabPane tab=<h4>Lịch sử mua hàng</h4> key='2'>
                            <Table striped hover responsive className='table-sm'>
                                <thead>
                                    <tr>
                                        <th>Mã đơn hàng</th>
                                        <th>Ngày mua hàng</th>
                                        <th>Tổng số tiền</th>
                                        <th>Thanh toán</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {getListOrderOfUser && getListOrderOfUser?.map((order, index) => (
                                        <tr key={index}>
                                            <td>{order.orderId}</td>
                                            <td>{order.orderDate}</td>
                                            <td>${order.totalPrice}</td>
                                            <td>
                                                {order.status === 1 ? (
                                                    <FaCheck style={{ color: 'green' }} />
                                                ) : (
                                                    <FaTimes style={{ color: 'red' }} />
                                                )}
                                            </td>
                                        </tr>
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
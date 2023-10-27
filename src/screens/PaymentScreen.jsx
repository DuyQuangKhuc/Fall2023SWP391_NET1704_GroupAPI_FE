import { useState, useEffect } from 'react';
import { Form, Button, Col, Row, Card, ListGroup, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import FormContainer from '../components/FormContainer';
import CheckoutSteps from '../components/CheckoutSteps';
import { useAddPaymentPromaxMutation, useGetListOrderDetailCloneByOrderIdorderIdQuery, useGetListPaymentMethodQuery } from '../slices/ordersApiSlice';
import { toast } from 'react-toastify';
import { useGetVoucherOfUserQuery } from '../slices/productsApiSlice';
import { Box, CardContent, CardMedia, Grid, IconButton, MenuItem, Select, Typography } from '@material-ui/core';
import VoucherUser from '../components/VoucherUser';

const PaymentScreen = () => {
    const navigate = useNavigate();
    const { userInfo } = useSelector((state) => state.auth);
    const [voucherId, setVoucherId] = useState('');

    const [paymentMethodId, setPaymentMethod] = useState('');
    const [address, setAddress] = useState('');

    const [order] = useState(JSON.parse(localStorage.getItem('getOrder')));

    const { data: getListPaymentMethod } = useGetListPaymentMethodQuery();

    const [addPaymentPromax] = useAddPaymentPromaxMutation();

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            const res = await addPaymentPromax({
                orderId: order.orderId,
                paymentMethodId,
                address,
                voucherId: 1,
            }).unwrap()
            navigate('/');
            toast.success("Thanh toán thành công");
        } catch (err) {
            console.log(err);
        }
    };

    const { data: getListOrderDetailCloneByOrderIdorderId, refetch } = useGetListOrderDetailCloneByOrderIdorderIdQuery(order?.orderId);
    useEffect(() => {
        if (getListOrderDetailCloneByOrderIdorderId) {
            const intervalId = setInterval(refetch, 1000); // Refresh every 1 seconds
            return () => clearInterval(intervalId); // Cleanup the interval on component unmount or 'order' change
        }
    }, [getListOrderDetailCloneByOrderIdorderId, refetch]);


    function formatCurrency(number) {
        // Sử dụng hàm toLocaleString() để định dạng số thành chuỗi với ngăn cách hàng nghìn và mặc định là USD.
        return number?.toLocaleString('en-US', {
            style: 'currency',
            currency: 'VND',
        });
    }

    const { data: getVoucherOfUser, refetch: getVoucherOfUserRefetch } = useGetVoucherOfUserQuery(userInfo?.accountId);
    useEffect(() => {
        if (getVoucherOfUser) {
            const intervalId = setInterval(getVoucherOfUserRefetch, 1000); // Refresh every 1 seconds
            return () => clearInterval(intervalId); // Cleanup the interval on component unmount or 'order' change
        }
    }, [getVoucherOfUser, getVoucherOfUserRefetch]);


    

    return (
        <Container>
            <Row>
                <CheckoutSteps step1 step3 />
                <h1>Hình thức thanh toán</h1>
                <Form onSubmit={submitHandler}>

                    <Form.Group style={{ display: 'flex', justifyContent: 'space-between' }} >
                        <Col md={3}>
                            <Form.Label as='legend' className='mt-5' >Thông tin địa chỉ nhận hàng</Form.Label>
                            <Form.Group className='my-2' controlId='address'>
                                <Form.Label>Địa chỉ</Form.Label>
                                <Form.Control
                                    type='text'
                                    placeholder='Enter address'
                                    value={address}
                                    required
                                    onChange={(e) => setAddress(e.target.value)}
                                ></Form.Control>
                            </Form.Group>

                        </Col>
                        <Col md={3}>
                            <Form.Label as='legend' className='mt-5'>Lựa chọn thanh toán</Form.Label>
                            {getListPaymentMethod && Array?.isArray(getListPaymentMethod) && getListPaymentMethod?.map((payment) => (
                                <Form.Check
                                    key={payment.paymentMethodId}
                                    className='my-2'
                                    type='radio'
                                    label={payment.name}
                                    name='paymentMethod'
                                    checked={paymentMethodId === payment.paymentMethodId}
                                    onChange={() => setPaymentMethod(payment.paymentMethodId)}
                                />
                            ))}
                        </Col>
                        <Col md={5}>
                            <Card>
                                <ListGroup variant='flush'>
                                    <ListGroup.Item>
                                        <h2>Đơn hàng</h2>
                                    </ListGroup.Item>

                                    <ListGroup.Item>
                                        <Row>
                                            <Col>Tổng</Col>
                                            <Col>{formatCurrency(getListOrderDetailCloneByOrderIdorderId?.reduce((acc, item) => acc + item.quantity * item.price, 0))}</Col>
                                        </Row>
                                    </ListGroup.Item>
                                    <ListGroup.Item>
                                        <Row>
                                            <Col className='mt-2'>Dùng phiếu giảm giá: </Col>
                                            <Col>
                                                {getVoucherOfUser ? (
                                                    <Select defaultValue="1" value={voucherId} onChange={(e) => setVoucherId(e.target.value)}>
                                                        <MenuItem value="1" ><Col><h5 className='mt-2'>▻ Không sử dụng phiếu giảm giá</h5></Col></MenuItem> {/* "None" option */}
                                                        {getVoucherOfUser?.map((voucher) => (
                                                            <MenuItem md={4} key={voucher.voucherId} value={voucher.voucherId}>
                                                                <Grid className='my-1'>
                                                                    <VoucherUser voucher={voucher} />
                                                                </Grid>
                                                            </MenuItem>
                                                        ))}
                                                    </Select>
                                                ) : (
                                                    <p>Bạn không có phiếu giảm giá nào</p>
                                                )}

                                            </Col>
                                        </Row>
                                    </ListGroup.Item>
                                    <ListGroup.Item>
                                        <Row>
                                            <Col>Giảm còn</Col>
                                            <Col>{formatCurrency((getListOrderDetailCloneByOrderIdorderId?.reduce((acc, item) => acc + item.quantity * item.price, 0)) * (1 - (getVoucherOfUser?.filter((voucher) => voucher.voucherId === voucherId))/100 ))}</Col>
                                        </Row>
                                    </ListGroup.Item>
                                </ListGroup>
                            </Card>
                        </Col>
                    </Form.Group>

                    <Button type='submit' variant='primary'>
                        Thanh toán
                    </Button>
                </Form>

            </Row>
        </Container>
    );
};

export default PaymentScreen;
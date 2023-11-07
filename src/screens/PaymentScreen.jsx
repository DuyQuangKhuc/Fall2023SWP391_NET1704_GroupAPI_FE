import { useState, useEffect } from 'react';
import { Form, Button, Col, Row, Card, ListGroup, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import FormContainer from '../components/FormContainer';
import CheckoutSteps from '../components/CheckoutSteps';
import { useAddPaymentPromaxMutation, useGetListOrderDetailCloneByOrderIdorderIdQuery, useGetListPaymentMethodQuery } from '../slices/ordersApiSlice';
import { toast } from 'react-toastify';
import { useGetVoucherOfUserQuery } from '../slices/productsApiSlice';
import { Box, CardContent, CardMedia, Grid, IconButton, InputLabel, MenuItem, Select, Typography } from '@material-ui/core';
import VoucherUser from '../components/VoucherUser';
import { useFormContext } from 'react-hook-form';

const PaymentScreen = () => {
    const navigate = useNavigate();
    const { userInfo } = useSelector((state) => state.auth);
    const [voucherId, setVoucherId] = useState(1);
    const [paymentMethodId, setPaymentMethod] = useState(1)

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
                voucherId,
            }).unwrap()
            navigate('/');
            
            toast.success("Thanh toán thành công");
            window.location.reload();
        } catch (err) {
            toast.error("Thất bại, hãy nhập đủ thông tin");
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
                <Form novalidate onSubmit={submitHandler}>
                    <Form.Group style={{ display: 'flex', justifyContent: 'space-between' }} >
                        <Col md={3}>
                            <Form.Label as='legend' className='mt-5' >Thông tin địa chỉ nhận hàng</Form.Label>
                            <Form.Group className='my-2' controlId='address'>
                                <Form.Label>Địa chỉ</Form.Label>
                                <Form.Control    
                                    type='text'
                                    placeholder='Enter address'
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    required
                                ></Form.Control>
                                <Form.Control.Feedback type='invalid'>
                                    Please enter a valid address.
                                </Form.Control.Feedback>
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
                                    required
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
                                            <Form.Check
                                                type='radio'
                                                label='Không sử dụng phiếu giảm giá'
                                                checked={voucherId === 1}
                                                name='radioOptions'
                                                onChange={() => setVoucherId(1)}
                                            />

                                            <Form.Check
                                                type='radio'
                                                label='Dùng phiếu giảm giá'
                                                name='radioOptions'
                                                checked={voucherId !== 1}
                                            />
                                            <Col>
                                                <label htmlFor="voucherId" className='ms-2 me-3 mt-1'>▻ Lựa chọn phiếu giảm giá: </label>
                                                {getVoucherOfUser?.length > 0 ? (
                                                    <Select value={voucherId} onChange={(e) => setVoucherId(e.target.value)}>
                                                        {/* <MenuItem value="1" ><Col><h5 className='mt-2'>▻ Không sử dụng phiếu giảm giá</h5></Col></MenuItem>  */}
                                                        {getVoucherOfUser?.map((voucher) => (
                                                            <MenuItem md={4} key={voucher.voucherId} value={voucher.voucherId}>
                                                                <Grid className='my-1'>
                                                                    <VoucherUser voucher={voucher} />
                                                                </Grid>
                                                            </MenuItem>
                                                        ))}
                                                    </Select>

                                                ) : (
                                                    <p className='ms-2 me-3 mt-1'>Bạn không có phiếu giảm giá nào</p>
                                                )}
                                            </Col>
                                        </Row>
                                    </ListGroup.Item>
                                    <ListGroup.Item>
                                        {/* <Row>
                                           
                                            <Col>Giảm còn</Col>
                                            <Col>{formatCurrency((getListOrderDetailCloneByOrderIdorderId?.reduce((acc, item) => acc + item.quantity * item.price, 0)) * (1 - voucher.voucherId / 100))}</Col> 
                                        </Row> 
                                        */}
                                    </ListGroup.Item>

                                    <Button type='submit' variant='primary'>
                                        Thanh toán
                                    </Button>
                                </ListGroup>
                            </Card>
                        </Col>
                    </Form.Group>


                </Form>

            </Row>
        </Container>
    );
};

export default PaymentScreen;
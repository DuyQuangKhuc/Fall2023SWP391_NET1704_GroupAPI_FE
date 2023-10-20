import { useState, useEffect } from 'react';
import { Form, Button, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import FormContainer from '../components/FormContainer';
import CheckoutSteps from '../components/CheckoutSteps';
import { useAddPaymentPromaxMutation, useGetListPaymentMethodQuery } from '../slices/ordersApiSlice';

const PaymentScreen = () => {
    const navigate = useNavigate();
    const cart = useSelector((state) => state.cart);
    //const { shippingAddress } = cart;

    // useEffect(() => {
    //     if (!shippingAddress.address) {
    //         navigate('/shipping');
    //     }
    // }, [navigate, shippingAddress]);

    const [paymentMethodId, setPaymentMethod] = useState('');
    const [address, setAddress] = useState('');

    const [order] = useState(JSON.parse(localStorage.getItem('getOrder')));

    const { data: getListPaymentMethod } = useGetListPaymentMethodQuery();

    const [addPaymentPromax ] = useAddPaymentPromaxMutation();

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
        } catch (err) {
            console.log(err);
        }
    };

    // const submitHandler = (e) => {
    //     e.preventDefault();
    //     dispatch(savePaymentMethod(paymentMethod));
    //     navigate('/placeorder');
    // };

    return (
        <FormContainer>
            <CheckoutSteps step1 step3 />
            <h1>Hình thức thanh toán</h1>
            <Form onSubmit={submitHandler}>
                <Form.Group style={{ display: 'flex', justifyContent: 'space-between' }} >
                    <Col md={6}>
                        <Form.Label as='legend' >Thông tin địa chỉ giao hàng</Form.Label>
                        <Form.Group className='my-2' controlId='address'>
                            <Form.Label>Address</Form.Label>
                            <Form.Control
                                type='text'
                                placeholder='Enter address'
                                value={address}
                                required
                                onChange={(e) => setAddress(e.target.value)}
                            ></Form.Control>
                        </Form.Group>

                    </Col>
                    <Col md={5}>
                        <Form.Label as='legend' >Lựa chọn thanh toán</Form.Label>
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
                </Form.Group>

                <Button type='submit' variant='primary'>
                    Thanh toán
                </Button>
            </Form>
        </FormContainer>
    );
};

export default PaymentScreen;
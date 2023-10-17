import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
    Row,
    Col,
    ListGroup,
    Image,
    Form,
    Button,
    Card,
    Container,
} from 'react-bootstrap';
import { FaTrash } from 'react-icons/fa';
import Message from '../components/Message';
import { addToCart, removeFromCart } from '../slices/cartSlice';

import { useState } from 'react';
import { useDeleteOrderDetailMutation, useGetListOrderDetailCloneByOrderIdorderIdQuery } from '../slices/ordersApiSlice';
import { toast } from 'react-toastify';

const CartScreen = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const cart = useSelector((state) => state.cart);
    const { cartItems } = cart;
    const [order] = useState(JSON.parse(localStorage.getItem('getOrder')));

    const { data: getListOrderDetailCloneByOrderIdorderId, refetch } = useGetListOrderDetailCloneByOrderIdorderIdQuery(order?.orderId);

    // const removeFromCartHandler = (id) => {
    //     dispatch(removeFromCart(id));
    // };

    const [deleteOrderDetail, { isLoading: loadingDelete }] =
        useDeleteOrderDetailMutation();

    const deleteHandler = async (orderDetailId) => {
        if (window.confirm('Are you sure ?')) {
            try {
                await deleteOrderDetail(orderDetailId);
                refetch();
            } catch (err) {
                toast.error(err?.data?.message || err.error);
            }
        }
    };

    const checkoutHandler = () => {
        navigate('/login?redirect=/payment');
    };
    console.log(getListOrderDetailCloneByOrderIdorderId)
    return (
        <Container>
            <Row className='py-3'>
                <Col md={8}>
                    <h1 style={{ marginBottom: '20px' }}>Shopping Cart</h1>
                    {getListOrderDetailCloneByOrderIdorderId && getListOrderDetailCloneByOrderIdorderId.error ? (
                        <Message>
                            Your cart is empty <Link to='/'>Go Back</Link>
                        </Message>
                    ) : (
                        <ListGroup variant='flush'>
                                {getListOrderDetailCloneByOrderIdorderId?.map((item) => (
                                <ListGroup.Item key={item.productId}  >
                                    <Row>
                                        <Col md={2}>

                                            <Image src={item.image} alt={item.name} fluid rounded />
                                        </Col>
                                        <Col md={3} className='mt-2'>
                                                <Link to={`/product/${item.productId}`}>{item.name}</Link>
                                        </Col>
                                        <Col md={2} className='mt-2'>${item.price}</Col>
                                        <Col md={2} className='mt-2'>Số lượng: {item.quantity}</Col>
                                        <Col md={2}>
                                            <Button
                                                type='button'
                                                variant='light'
                                                onClick={() => deleteHandler(item.orderDetailId)}
                                            >
                                                <FaTrash />
                                            </Button>
                                        </Col>
                                    </Row>
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    )}
                </Col>
                <Col md={4}>
                    <Card>
                        <ListGroup variant='flush'>
                            <ListGroup.Item>
                                <h2>
                                    Subtotal ({cartItems.reduce((acc, item) => acc + item.qty, 0)})
                                    items
                                </h2>
                                $
                                {cartItems
                                    .reduce((acc, item) => acc + item.qty * item.price, 0)
                                }
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Button
                                    type='button'
                                    className='btn-block'
                                    disabled={cartItems.length === 0}
                                    onClick={checkoutHandler}
                                >
                                    Proceed To Checkout
                                </Button>
                            </ListGroup.Item>
                        </ListGroup>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default CartScreen;
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

import { useEffect, useState } from 'react';
import { useDeleteAllOrderDetailInOrderMutation, useDeleteOrderDetailMutation, useGetListOrderDetailCloneByOrderIdorderIdQuery } from '../slices/ordersApiSlice';
import { toast } from 'react-toastify';

const CartScreen = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const cart = useSelector((state) => state.cart);
    const { cartItems } = cart;
    const [order] = useState(JSON.parse(localStorage.getItem('getOrder')));

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

    const [deleteOrderDetail, { isLoading: loadingDelete, }] = useDeleteOrderDetailMutation();


    const deleteHandler = async (orderDetailId) => {
        if (window.confirm('Bạn muốn xóa sản phẩm khỏi giỏ hàng?')) {
            try {
                await deleteOrderDetail(orderDetailId);
            } catch (err) {
                toast.error(err?.data?.message || err.error);
            }
        }
    };

    const [deleteAllOrderDetailInOrder] = useDeleteAllOrderDetailInOrderMutation();


    const deleteAllHandler = async (orderId) => {
        if (window.confirm('Bạn muốn xóa sản phẩm khỏi giỏ hàng?')) {
            try {
                await deleteAllOrderDetailInOrder(orderId);
            } catch (err) {
                toast.error(err?.data?.message || err.error);
            }
        }
    };

    const checkoutHandler = () => {
        navigate('/login?redirect=/payment');
    };

    return (
        <Container>
            <Row className='py-3'>
                <Col md={8}>
                    <h1 style={{ marginBottom: '20px' }}>Giỏ hàng</h1>
                    {(getListOrderDetailCloneByOrderIdorderId?.length === 0 || getListOrderDetailCloneByOrderIdorderId === undefined) ? (
                        <Message>
                            Giỏ hàng đang trống <Link to='/'>Quay lại</Link>
                        </Message>
                    ) : (

                        <ListGroup variant='flush'>
                            <Col md={8}>
                                <Button
                                    className='mb-3'
                                    type='button'
                                    variant='light'
                                    onClick={() => deleteAllHandler(order?.orderId)}
                                >
                                    <FaTrash /> Xóa tất cả sản phẩm đã thêm
                                </Button>
                            </Col>
                            <div>
                                {getListOrderDetailCloneByOrderIdorderId?.map((item) => (
                                    <ListGroup.Item key={item.productId}  >
                                        <Row>
                                            <Col md={2}>
                                                <Image src={item.image} alt={item.name} fluid rounded />
                                            </Col>
                                            <Col md={3} className='mt-2'>
                                                <Link to={`/product/${item.productId}`}>{item.name}</Link>
                                            </Col>
                                            <Col md={2} className='mt-2'>{formatCurrency(item.price)}</Col>
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
                            </div>
                        </ListGroup>
                    )}
                </Col>
                <Col md={4}>
                    <Card>
                        <ListGroup variant='flush'>
                            <ListGroup.Item>
                                <h2>
                                    Tổng {getListOrderDetailCloneByOrderIdorderId?.reduce((acc, item) => acc + item.quantity, 0)} đơn hàng
                                </h2>
                                Số tiền : {formatCurrency(getListOrderDetailCloneByOrderIdorderId?.reduce((acc, item) => acc + item.quantity * item.price, 0))}
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Button
                                    type='button'
                                    className='btn-block'
                                    disabled={getListOrderDetailCloneByOrderIdorderId?.length === 0}
                                    onClick={checkoutHandler}
                                >
                                    Đặt hàng
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
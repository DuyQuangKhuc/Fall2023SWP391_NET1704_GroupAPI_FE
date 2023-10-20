import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
    Row,
    Col,
    Image,
    ListGroup,
    Card,
    Button,
    Form,
    Container,
    Table,
} from 'react-bootstrap';
import { toast } from 'react-toastify';
import {
    useGetProductDetailsQuery,
    useCreateReviewMutation,
    useGetListAllComponentQuery,
    useGetListFeedbackByProductQuery,
} from '../slices/productsApiSlice';
import Rating from '../components/Rating';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Meta from '../components/Meta';
import { addToCart } from '../slices/cartSlice';
import { Tabs } from 'antd/lib';
import { Timeline } from 'antd';
import { useAddOrderDetailByAccountIdProductIdQuantityMutation } from '../slices/ordersApiSlice';

const ProductScreen = () => {
    const { productId } = useParams();
    const { TabPane } = Tabs;

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [quantity, setquantity] = useState(1);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [order] = useState(JSON.parse(localStorage.getItem('getOrder')));
    const [addOrderDetailByAccountIdProductIdQuantity] = useAddOrderDetailByAccountIdProductIdQuantityMutation();

    const addToCartHandler = async () => {
        try {
            const res = await addOrderDetailByAccountIdProductIdQuantity({
                accountId: order.accountId,
                productId: product?.productId,
                quantity: quantity,
            }).unwrap();
            console.log(res)
            //dispatch(addToCart({ ...product, quantity }));
            navigate('/cart', { replace: true });
        } catch (err) {
            toast.error(err);
        }
    };


    const {
        data: product,
        isLoading,
        error,
    } = useGetProductDetailsQuery(productId);

    const { userInfo } = useSelector((state) => state.auth);

    const [createReview, { isLoading: loadingProductReview }] = useCreateReviewMutation();

    const submitHandler = async (e) => {
        e.preventDefault();

        try {
            await createReview({
                accountId: order.accountId,
                productId: product?.productId,
                rating,
                comment,
            }).unwrap();
            toast.success('Đánh giá thành công');
        } catch (err) {
            toast.error("Bạn phải mua sản phẩm");
        }
    };

    const { data: getListFeedbackByProduct, refetch } = useGetListFeedbackByProductQuery(product?.productId);
    useEffect(() => {
        if (getListFeedbackByProduct) {
            const intervalId = setInterval(refetch, 1000); // Refresh every 1 seconds
            return () => clearInterval(intervalId); // Cleanup the interval on component unmount or 'order' change
        }
    }, [getListFeedbackByProduct, refetch]);

    const { data: getListAllComponent } = useGetListAllComponentQuery();

    const filteredComponents = getListAllComponent?.filter(component => component.productId === product?.productId);

    console.log(getListFeedbackByProduct);
    return (
        <Container >
            <>
                <Link className='btn btn-light my-3' to='/'>
                    Go Back
                </Link>
                {isLoading ? (
                    <Loader />
                ) : error ? (
                    <Message variant='danger'>
                        {error?.data?.message || error.error}
                    </Message>
                ) : (
                    <>
                        <Meta title={product.name} description={product.description} />
                        <Row>
                            <Col md={6}>
                                <Image src={product.imagePath1} alt={product.name} style={{ height: "400px" }} className='mb-3' fluid />
                            </Col>
                            <Col md={3}>
                                <ListGroup variant='flush'>
                                    <ListGroup.Item>
                                        <h3>{product.name}</h3>
                                    </ListGroup.Item>
                                    <ListGroup.Item>
                                        <Rating
                                            value={product.rating}
                                            text={`${product.numReviews} reviews`}
                                        />
                                    </ListGroup.Item>
                                    <ListGroup.Item>Giá: ${product.price}</ListGroup.Item>
                                    <ListGroup.Item>
                                        Mô tả: {product.description}
                                    </ListGroup.Item>
                                </ListGroup>
                            </Col>
                            <Col md={3}>
                                <Card>
                                    <ListGroup variant='flush'>
                                        <ListGroup.Item>
                                            <Row>
                                                <Col>Giá:</Col>
                                                <Col>
                                                    <strong>${product.price}</strong>
                                                </Col>
                                            </Row>
                                        </ListGroup.Item>
                                        <ListGroup.Item>
                                            <Row>
                                                <Col>Tình trạng:</Col>
                                                <Col>
                                                    {product.quantity > 0 ? `Còn ${product.quantity} sản phẩm` : 'Hết hàng'}
                                                </Col>
                                            </Row>
                                        </ListGroup.Item>

                                        {/* quantity Select */}
                                        {product.quantity > 0 && (
                                            <ListGroup.Item>
                                                <Row>
                                                    <Col>Số lượng mua:</Col>
                                                    <Col>
                                                        <Form.Control
                                                            as='select'
                                                            value={quantity}
                                                            onChange={(e) => setquantity(Number(e.target.value))}
                                                        >
                                                            {[...Array(product.quantity).keys()].map(
                                                                (x) => (
                                                                    <option key={x + 1} value={x + 1}>
                                                                        {x + 1}
                                                                    </option>
                                                                )
                                                            )}
                                                        </Form.Control>
                                                    </Col>
                                                </Row>
                                            </ListGroup.Item>
                                        )}

                                        <ListGroup.Item>
                                            <Button
                                                className='btn-block'
                                                type='button'
                                                disabled={product.quantity === 0}
                                                onClick={addToCartHandler}
                                            >
                                                Add To Cart
                                            </Button>
                                        </ListGroup.Item>
                                    </ListGroup>
                                </Card>
                            </Col>
                        </Row>
                        <Tabs defaultActiveKey='1'>
                            <TabPane tab=<h5>Chi tiết sản phẩm</h5> key='1' >
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Timeline className='review'
                                        items={[
                                            {
                                                color: 'green',
                                                children: `Màu sắc: ${product.color} `,
                                            },
                                            {
                                                color: 'green',
                                                children: `Kích cỡ: ${product.size} `,
                                            },
                                            {
                                                color: 'green',
                                                children: `Vật liệu: ${product.material} `,
                                            },
                                            {
                                                color: 'gray',
                                                children: (
                                                    <>
                                                        <p>Độ bền: {product.durability}</p>
                                                    </>
                                                ),
                                            },
                                            {
                                                color: '#00CCFF',
                                                //dot: <SmileOutlined />,
                                                children: <p>NSX:  {product.uploadDate}</p>,
                                            },
                                        ]}
                                    />

                                    <Table striped hover responsive className='table-auto'>
                                        <thead>
                                            <tr>
                                                <th>Tên thành phần</th>
                                                <th>Số lượng</th>
                                                <th>Chất liệu</th>
                                                <th>Màu sắc</th>
                                                <th>Mô tả</th>
                                                <th>Trạng thái</th>

                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredComponents?.map((component, index) => (
                                                <tr key={index}>
                                                    <td>{component?.name}</td>
                                                    <td>{component?.quantity}</td>
                                                    <td>{component?.material}</td>
                                                    <td>{component?.color}</td>
                                                    <td>{component?.description}</td>
                                                    <td>{component?.isReplacable}</td>

                                                </tr>
                                            ))}
                                        </tbody>
                                    </Table>
                                </div>
                            </TabPane>
                            <TabPane tab=<h5>Phản hồi</h5> key='2'>
                                <Row className='review'>
                                    <Col md={6}>
                                        <ListGroup.Item>
                                            <h2>Write a Customer Review</h2>

                                            {loadingProductReview && <Loader />}

                                            {userInfo ? (
                                                <Form onSubmit={submitHandler}>
                                                    <Form.Group className='my-2' controlId='rating'>
                                                        <Form.Label>Rating</Form.Label>
                                                        <Form.Control
                                                            as='select'
                                                            required
                                                            value={rating}
                                                            onChange={(e) => setRating(e.target.value)}
                                                        >
                                                            <option value=''>Select...</option>
                                                            <option value='1'>1 - Poor</option>
                                                            <option value='2'>2 - Fair</option>
                                                            <option value='3'>3 - Good</option>
                                                            <option value='4'>4 - Very Good</option>
                                                            <option value='5'>5 - Excellent</option>
                                                        </Form.Control>
                                                    </Form.Group>
                                                    <Form.Group className='my-2' controlId='comment'>
                                                        <Form.Label>Comment</Form.Label>
                                                        <Form.Control
                                                            as='textarea'
                                                            row='3'
                                                            required
                                                            value={comment}
                                                            onChange={(e) => setComment(e.target.value)}
                                                        ></Form.Control>
                                                    </Form.Group>
                                                    <Button
                                                        disabled={loadingProductReview}
                                                        type='submit'
                                                        variant='primary'
                                                    >
                                                        Submit
                                                    </Button>
                                                </Form>
                                            ) : (
                                                <Message>
                                                    Please <Link to='/login'>sign in</Link> to write a review
                                                </Message>
                                            )}
                                        </ListGroup.Item>
                                    </Col>
                                    <Col md={6}>
                                        <h2>Reviews</h2>
                                        {/* {getListFeedbackByProduct?.length === 0 && <Message>No Reviews</Message>} */}
                                        <ListGroup variant='flush'>
                                            {getListFeedbackByProduct?.map((review) => (
                                                <ListGroup.Item key={review}>
                                                    <strong>{review.name}</strong>
                                                    <Rating value={review.rating} />
                                                    {/* <p>{review?.createdAt.substring(0, 10)}</p> */}
                                                    <p>{review.comment}</p>
                                                </ListGroup.Item>
                                            ))}
                                        </ListGroup>
                                    </Col>

                                </Row>
                            </TabPane>
                        </Tabs>
                    </>
                )}
            </>
        </Container>

    );
};

export default ProductScreen;
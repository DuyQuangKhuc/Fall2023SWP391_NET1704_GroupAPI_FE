import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
    Row,
    Col,
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
import { Image } from 'antd';
import { Tabs } from 'antd/lib';
import { Timeline } from 'antd';
import { useAddOrderDetailByAccountIdProductIdQuantityMutation } from '../slices/ordersApiSlice';

const ProductScreen = () => {
    const { productId } = useParams();
    const { TabPane } = Tabs;

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [quantity, setquantity] = useState(1);
    const [rating, setRating] = useState();
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

    function formatCurrency(number) {
        // Sử dụng hàm toLocaleString() để định dạng số thành chuỗi với ngăn cách hàng nghìn và mặc định là USD.
        return number.toLocaleString('en-US', {
            style: 'currency',
            currency: 'VND',
        });
    }

    const {
        data: product,
        isLoading,
        error,
        refetch: productRefetch
    } = useGetProductDetailsQuery(productId);
    useEffect(() => {
        if (product) {
            const intervalId = setInterval(productRefetch, 1000); // Refresh every 1 seconds
            return () => clearInterval(intervalId); // Cleanup the interval on component unmount or 'order' change
        }
    }, [product, productRefetch]);

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

    console.log(getListFeedbackByProduct?.rating);
    return (
        <div className=" max-w-full  bg-repeat" style={{
            backgroundImage: "url('https://img.rawpixel.com/s3fs-private/rawpixel_images/website_content/v1016-a-02-ksh6oqdp.jpg?w=800&dpr=1&fit=default&crop=default&q=65&vib=3&con=3&usm=15&bg=F4F4F3&ixlib=js-2.2.1&s=8bf67d33cc68e3f340e23db016c234dd')",
            backgroundSize: 'cover',
            backgroundPosition: 'center center',
            backgroundRepeat: 'no-repeat',

        }}>
            <Container >
                <>
                    <Link className='btn btn-light my-3' to='/'>
                        Quay lại
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
                                                value={product.ratingAverage}
                                                text={`${product.feedBackQuantity && product.feedBackQuantity > 0 ? product.feedBackQuantity : '0'} đánh giá`}
                                            />
                                        </ListGroup.Item>
                                        <ListGroup.Item>Giá: {formatCurrency(product.price)}</ListGroup.Item>
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
                                                        <strong>{formatCurrency(product.price)}</strong>
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

                                            {/* {product.quantity > 0 && (
                                                <ListGroup.Item>
                                                    <Row>
                                                        <Col>Số lượng mua:</Col>
                                                        <Col>
                                                            <Form.Control
                                                                type='number'
                                                                value={quantity}
                                                                onChange={(e) => {
                                                                    const newValue = Number(e.target.value);
                                                                    if (newValue <= product.quantity) {
                                                                        setquantity(newValue);
                                                                    }
                                                                }}
                                                            />
                                                        </Col>
                                                        <Col>
                                                            <Button variant="outline-primary" onClick={() => setquantity(quantity + 1)} disabled={quantity >= product.quantity}>+</Button>
                                                            <Button variant="outline-primary" onClick={() => setquantity(quantity - 1)} disabled={quantity <= 1}>-</Button>
                                                        </Col>
                                                    </Row>
                                                </ListGroup.Item>
                                            )} */}

                                            <ListGroup.Item>
                                                <Button
                                                    className='btn-block'
                                                    type='button'
                                                    disabled={product?.quantity === 0}
                                                    onClick={addToCartHandler}
                                                >
                                                    Thêm vào giỏ hàng
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
                                                    children: `Kích cỡ: ${product.size} `,
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
                                                    children: <p>NSX:  {new Date(product.uploadDate).toLocaleDateString('en-GB')}</p>,
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
                                                    <th>Bộ phận</th>

                                                </tr>
                                            </thead>
                                            <tbody>
                                                {filteredComponents?.map((component, index) => (
                                                    <tr key={index}>
                                                        <td>{component?.name}</td>
                                                        <td>{component?.quantity}</td>
                                                        <td>{component?.material}</td>
                                                        <td> <div
                                                            style={{
                                                                marginLeft: '10px',
                                                                backgroundColor: `${component.color}`,
                                                                width: 50,
                                                                height: 28,
                                                            }}
                                                        ></div></td>
                                                        <td>{component?.description}</td>
                                                        <td>{component?.isReplacable && component?.isReplacable === 1 ? "Tháo rời" : component?.isReplacable === 0 ? "Cố định" : ""}</td>

                                                    </tr>
                                                ))}
                                            </tbody>
                                        </Table>
                                    </div>
                                            <Row className='review'>
                                                <Col md={6}>
                                                    <ListGroup.Item>
                                                        <h2>Đánh giá sản phẩm</h2>

                                                        {loadingProductReview && <Loader />}

                                                        {userInfo ? (
                                                            <Form onSubmit={submitHandler}>
                                                                <Form.Group className='my-2' controlId='rating'>
                                                                    <Form.Label>Đánh giá</Form.Label>
                                                                    <Form.Control
                                                                        as='select'
                                                                        required
                                                                        value={rating}
                                                                        onChange={(e) => setRating(e.target.value)}
                                                                    >
                                                                        <option value=''>Chọn...</option>
                                                                        <option value='1'>1 - Tệ</option>
                                                                        <option value='2'>2 - Ổn</option>
                                                                        <option value='3'>3 - Tốt</option>
                                                                        <option value='4'>4 - Rất tốt</option>
                                                                        <option value='5'>5 - Chất lượng cao</option>
                                                                    </Form.Control>
                                                                </Form.Group>
                                                                <Form.Group className='my-2' controlId='comment'>
                                                                    <Form.Label>Viết bình luận</Form.Label>
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
                                                                    Gửi bài
                                                                </Button>
                                                            </Form>
                                                        ) : (
                                                            <Message>
                                                                Hãy <Link to='/login'>Đăng nhập</Link> để viết bình luận
                                                            </Message>
                                                        )}
                                                    </ListGroup.Item>
                                                </Col>
                                                <Col md={6}>
                                                    <h2>Xem bình luận</h2>
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
                                {/* <TabPane tab=<h5>Phản hồi</h5> key='2'>
                                    
                                </TabPane> */}
                            </Tabs>
                        </>
                    )}
                </>
            </Container>
        </div >
    );
};

export default ProductScreen;
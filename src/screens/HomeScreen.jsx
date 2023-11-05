import { Row, Col, Container } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { useGetProductSizeQuery, useGetProducts1Query, useGetProducts2Query, useGetProductsQuery } from '../slices/productsApiSlice';
import { Link } from 'react-router-dom';
import Product from '../components/Product';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Paginate from '../components/Paginate';
import ProductCarousel from '../components/ProductCarousel';
import Meta from '../components/Meta';
import { useGetOrderIsUsingByAccountIdQuery } from '../slices/ordersApiSlice';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Carousel, Image } from 'react-bootstrap';

const HomeScreen = () => {
    const { pageNumber, keyword } = useParams();
    const [page, setPage] = useState(1);
    const [totalPage, setTotalPage] = useState(1);

    const { data, isLoading, error, } = useGetProducts1Query({
        page
    });
    const { data: GetProducts2 } = useGetProducts2Query({
        page
    });

    const { data: GetProducts, } = useGetProductsQuery();

    const { data: GetProductSize, } = useGetProductSizeQuery();
    useEffect(() => {
        setTotalPage(GetProductSize)
    }, [GetProductSize]);
    const { userInfo } = useSelector((state) => state.auth);
    const { data: getOrder } = useGetOrderIsUsingByAccountIdQuery(userInfo?.accountId);
    useEffect(() => {
        if (getOrder) {
            localStorage.setItem('getOrder', JSON.stringify(getOrder));
        }
    }, [getOrder]);


    return (
        <div className=" max-w-full  bg-repeat" style={{
            backgroundImage: "url('https://img.rawpixel.com/s3fs-private/rawpixel_images/website_content/v1016-a-02-ksh6oqdp.jpg?w=800&dpr=1&fit=default&crop=default&q=65&vib=3&con=3&usm=15&bg=F4F4F3&ixlib=js-2.2.1&s=8bf67d33cc68e3f340e23db016c234dd')",
            backgroundSize: 'cover',
            backgroundPosition: 'center center',
            backgroundRepeat: 'no-repeat',

        }}>
            <Container>
                <>
                    {!keyword ? (
                        <>
                            <ProductCarousel />
                            <h1>Sản phẩm mới cập nhập</h1>
                            <Row>
                                {GetProducts2?.map((product) => (
                                    <Col key={product.productId} sm={12} md={6} lg={4} xl={3}>
                                        <Product product={product} />
                                    </Col>
                                ))}
                            </Row>
                        </>
                    ) : (
                        <Link to='/' className='btn btn-light mb-4 mt-4'>
                            Quay lại
                        </Link>
                    )}
                    {isLoading ? (
                        <Loader />
                    ) : error ? (
                        <Message variant='danger'>
                            {error?.data?.message || error.error}
                        </Message>
                    ) : (
                        <>
                            <Meta />
                            {/* <Carousel showThumbs={false} showStatus={false} infiniteLoop useKeyboardArrows autoPlay>
                                {data.slice(0, 8).map((product) => (
                                    <div key={product.productId}>
                                        <Product product={product} />
                                    </div>
                                ))}
                            </Carousel> */}

                            <h1 className='mt-4'>Tất cả sản phẩm</h1>
                            <Row>
                                {/* {data.products.map((product) => ( */}
                                {data.map((product) => (
                                    <Col key={product.productId} sm={12} md={6} lg={4} xl={3}>
                                        <Product product={product} />
                                    </Col>
                                ))}
                            </Row>
                            <Paginate page={page} setPage={setPage} totalPage={totalPage} />
                        </>
                    )}
                </>
            </Container>
        </div>
    );
};

export default HomeScreen;
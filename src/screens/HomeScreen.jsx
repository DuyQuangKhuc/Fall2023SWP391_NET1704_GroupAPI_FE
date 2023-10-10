import { Row, Col, Container } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { useGetProductsQuery } from '../slices/productsApiSlice';
import { Link } from 'react-router-dom';
import Product from '../components/Product';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Paginate from '../components/Paginate';
import ProductCarousel from '../components/ProductCarousel';
import Meta from '../components/Meta';

const HomeScreen = () => {
    const { pageNumber, keyword } = useParams();

    const { data, isLoading, error } = useGetProductsQuery({
        keyword,
        pageNumber,
    });

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
                        <ProductCarousel />
                    ) : (
                        <Link to='/' className='btn btn-light mb-4'>
                            Go Back
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
                            <h1>Latest Products</h1>
                            <Row>
                                {/* {data.products.map((product) => ( */}
                                {data.map((product) => (
                                    <Col key={product.productId} sm={12} md={6} lg={4} xl={3}>
                                        <Product product={product} />
                                    </Col>
                                ))}
                            </Row>
                            <Paginate
                                pages={data.pages}
                                page={data.page}
                                keyword={keyword ? keyword : ''}
                            />
                        </>
                    )}
                </>
            </Container>
        </div>
    );
};

export default HomeScreen;
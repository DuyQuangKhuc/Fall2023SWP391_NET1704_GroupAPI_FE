import { Link } from 'react-router-dom';
import { Carousel, Image } from 'react-bootstrap';
import Message from './Message';
import { useGetTopProductsQuery } from '../slices/productsApiSlice';

const ProductCarousel = () => {
    const { data: products, isLoading, error } = useGetTopProductsQuery();

    return isLoading ? null : error ? (
        <Message variant='danger'>{error?.data?.message || error.error}</Message>
    ) : (
        <Carousel pause='hover' className='bg-primary mb-4'>
            {products?.map((product, index) => (
                <Carousel.Item key={index}>
                    <Link to={`/product/${product.productId}`}>
                        <Image src={product.imagePath1} alt={product.name} fluid style={{ width: '510px', height: '510px' }} />
                        <Carousel.Caption className='carousel-caption'>
                            <h2 className='text-white text-right'>
                                {product.name} (${product.price})
                            </h2>
                        </Carousel.Caption>
                    </Link>
                    <span> Shop Now</span>
                </Carousel.Item>
            ))}
        </Carousel>
    );
};

export default ProductCarousel;
import { Link } from 'react-router-dom';
import { Carousel, Image } from 'react-bootstrap';
import Message from './Message';
import { useGetTopProductsQuery } from '../slices/productsApiSlice';
import { assets } from '../../src/assets/videoplayback.mp4'

const ProductCarousel = () => {
    const { data: products, isLoading, error } = useGetTopProductsQuery();

    function formatCurrency(number) {
        // Sử dụng hàm toLocaleString() để định dạng số thành chuỗi với ngăn cách hàng nghìn và mặc định là USD.
        return number.toLocaleString('en-US', {
            style: 'currency',
            currency: 'VND',
        });
    }

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
                                {product.name} - {formatCurrency(product.price)}
                            </h2>
                        </Carousel.Caption>
                        <Image src='https://i0.wp.com/www.petmania.ie/wp-content/uploads/2022/12/birdCare_mobile.webp?fit=612%2C435&ssl=1' fluid style={{ width: '786px', height: '510px' }} />
                        {/* <video className='videoTag' autoPlay loop muted>
                            <source src={assets} type='video/mp4' style={{ width: '786px', height: '510px' }} />
                        </video> */}
                    </Link>
                    
                    

                </Carousel.Item>
            ))}
        </Carousel>
    );
};

export default ProductCarousel;
import { Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Rating from './Rating';

const Product = ({ product }) => {

    function formatCurrency(number) {
        // Sử dụng hàm toLocaleString() để định dạng số thành chuỗi với ngăn cách hàng nghìn và mặc định là USD.
        return number.toLocaleString('en-US', {
            style: 'currency',
            currency: 'VND',
        });
    }
    return (
        <Card className='my-3 p-3 rounded'>
            <Link to={`/product/${product.productId}`}>
                <Card.Img src={product.imagePath1} variant='top' />
            </Link>

            <Card.Body>
                <Link to={`/product/${product.productId}`}>
                    <Card.Title as='div' className='product-title'>
                        <strong>{product.name}</strong>
                    </Card.Title>
                </Link>

                <Card.Text as='div'>
                    <Rating
                        value={product.rating}
                        text={`${product.numReviews} reviews`}
                    />
                </Card.Text>

                <Card.Text as='h3'>{formatCurrency(product.price)}</Card.Text>
            </Card.Body>
        </Card>
    );
};

export default Product;
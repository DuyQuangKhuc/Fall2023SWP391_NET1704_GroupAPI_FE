import { Button, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Rating from './Rating';
import { FaShoppingCart } from 'react-icons/fa';

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
                <Card.Img src={product.imagePath1} style={{ width : 266 , height : 300 }} variant='top' />
            </Link>

            <Card.Body>
                <Link to={`/product/${product.productId}`}>
                    <Card.Title as='div' className='product-title'>
                        <strong>{product.name}</strong>
                    </Card.Title>
                </Link>

                <Card.Text as='div'>
                    <Rating
                        value={product.ratingAverage}
                        text={`${product.feedBackQuantity && product.feedBackQuantity > 0 ? product.feedBackQuantity : '0' } đánh giá`}
                    />
                </Card.Text>
                
                    <Card.Text as='h3' className='mt-3'>Giá :  {formatCurrency(product.price)}</Card.Text>
                <div style={{ display: 'flex', }}>
                    <Card.Text as='div'>Số lượng: {product.quantity && product.quantity > 0 ? product.quantity : <span style={{ color: 'red', }}>Hết hàng</span>}</Card.Text>
                    <Link to={`/product/${product.productId}`}>
                        <FaShoppingCart as='div' style={{ height: 20, width: 38, marginInlineStart: '50px', }} />
                    </Link>
                </div>
            </Card.Body>
        </Card>
    );
};

export default Product;
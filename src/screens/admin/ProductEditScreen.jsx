import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Form, Button, Container } from 'react-bootstrap';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import FormContainer from '../../components/FormContainer';
import { toast } from 'react-toastify';
import {
    useGetProductDetailsQuery,
    useUpdateProductMutation,
    useUploadProductImageMutation,
} from '../../slices/productsApiSlice';
import Dasboard from '../../dasboard/Dasboard';
import ComUpImg from '../../components/Input/ComUpImg';
import { Image } from 'antd';

const ProductEditScreen = () => {
    const { id: productId } = useParams();

    const [name, setName] = useState('');
    const [price, setPrice] = useState(0);
    const [imagePath1, setImage] = useState('');
    const [durability, setDurability] = useState('');
    const [description, setDescription] = useState('');

    const {
        data: product,
        isLoading,
        refetch,
        error,
    } = useGetProductDetailsQuery(productId);

    const [updateProduct, { isLoading: loadingUpdate }] =
        useUpdateProductMutation();

    const [uploadProductImage, { isLoading: loadingUpload }] =
        useUploadProductImageMutation();

    const navigate = useNavigate();

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            await updateProduct({
                productId,
                name,
                price,
                imagePath1,
                durability,
                description,
            }).unwrap(); // NOTE: here we need to unwrap the Promise to catch any rejection in our catch block
            toast.success('Sản phẩm đã cập nhập thành công');
            refetch();
            navigate('/admin/productlist');
        } catch (err) {
            toast.error("Sản phẩm này đã có khách hàng mua nên không thể thay đổi");
        }
    };

    useEffect(() => {
        if (product) {
            setName(product.name);
            setPrice(product.price);
            setImage(product.imagePath1);
            setDurability(product.durability);
            setDescription(product.description);
        }
    }, [product]);

    const uploadFileHandler = async (e) => {
        const formData = new FormData();
        formData.append('imagePath1', e.target.files[0]);
        try {
            const res = await uploadProductImage(formData).unwrap();
            toast.success(res.message);
            setImage(res.imagePath1);
        } catch (err) {
            toast.error(err?.data?.message || err.error);
        }
    };

    return (
        <Container>

            <Link to='/admin/productlist' className='btn btn-light my-3'>
                Quay lại
            </Link>
            <FormContainer>
                <h1>Chỉnh sửa sản phẩm</h1>
                {loadingUpdate && <Loader />}
                {isLoading ? (
                    <Loader />
                ) : error ? (
                    <Message variant='danger'>{error.data.message}</Message>
                ) : (
                    <Form onSubmit={submitHandler}>
                        <Form.Group controlId='name' className='my-3'>
                            <Form.Label>Tên</Form.Label>
                            <Form.Control
                                type='name'
                                placeholder='Enter name'
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            ></Form.Control>
                        </Form.Group>

                        <Form.Group controlId='price' className='my-3'>
                            <Form.Label>Giá</Form.Label>
                            <Form.Control
                                type='number'
                                placeholder='Enter price'
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                            ></Form.Control>
                        </Form.Group>

                        <Form.Group controlId='image' className='my-3'>
                            <Form.Label>Ảnh</Form.Label>
                            {/* <Image src={product.imagePath1 || imagePath1} /> */}
                            <ComUpImg
                                value={imagePath1}
                                onChange={setImage}
                            ></ComUpImg>
                            {/* <Form.Control
                                label='Choose File'
                                onChange={uploadFileHandler}
                                type='file'
                            ></Form.Control> */}
                            {loadingUpload && <Loader />}
                        </Form.Group>


                        <Form.Group controlId='material' className='my-3'>
                            <Form.Label>Độ bền</Form.Label>
                            <Form.Control
                                type='text'
                                placeholder='Enter material'
                                value={durability}
                                onChange={(e) => setDurability(e.target.value)}
                            ></Form.Control>
                        </Form.Group>

                        <Form.Group controlId='description' >
                            <Form.Label>Mô tả</Form.Label>
                            <Form.Control
                                type='text'
                                placeholder='Enter description'
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            ></Form.Control>
                        </Form.Group>

                        <Button
                            type='submit'
                            variant='primary'
                            style={{ marginTop: '1rem' }}
                        >
                            Cập nhập
                        </Button>
                    </Form>
                )}
            </FormContainer>
        </Container>
    );
};

export default ProductEditScreen;
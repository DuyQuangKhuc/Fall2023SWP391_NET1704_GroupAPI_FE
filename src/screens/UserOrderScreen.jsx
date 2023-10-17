/* eslint-disable no-unused-vars */
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
    Row,
    Container,
    Form,
    Button,
    Col,
} from 'react-bootstrap';
import { useAddProductDetailCloneMutation, useGetCompleteProductMutation, useGetListComponentOfProductUserCreatingQuery } from '../slices/productsApiSlice';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import FormContainer from '../components/FormContainer';
import Loader from '../components/Loader';
import { Card } from 'antd';
import { useGetAddProductUserAutomaticMutation } from '../slices/ordersApiSlice';


const UserOrderScreen = () => {
    const [material, setMaterial] = useState('');
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [color, setColor] = useState("");
    const [isReplacable, setIsReplacable] = useState('');
    const [quantity, setQuantity] = useState('');

    const { userInfo } = useSelector((state) => state.auth);

    const [AddProductDetailClone, { isLoading: loadingaddComponent }] = useAddProductDetailCloneMutation();

    console.log(userInfo?.accountId)

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            if (userInfo?.accountId) {
                const res = await AddProductDetailClone({
                    accountId: userInfo.accountId,
                    material,
                    quantity,
                    name,
                    description,
                    color,
                    isReplacable,
                }).unwrap();
                toast.success("Tạo thành công");
            }
        } catch (err) {
            toast.error("Hãy đăng nhập ");

        }
    };

    const [getCompleteProduct, refetch] = useGetCompleteProductMutation()

    const Handler = async () => {
        try {
            const res = await getCompleteProduct(userInfo.accountId);
            toast.success("Thành công");
        } catch (err) {
            // Handle error
        }
    };

    const { data: listComponent, isLoading, error } = useGetListComponentOfProductUserCreatingQuery(userInfo.accountId);
    return (
        <Container>
            <Row className='py-3'>
                <Col md={6}>
                    <FormContainer>
                        <Form onSubmit={submitHandler}>
                            <Form.Group className='my-3' controlId='name'>
                                <Form.Label className="font-semibold">Tên thành phần</Form.Label>
                                <Form.Control
                                    type='name'
                                    placeholder='Enter name'
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                ></Form.Control>
                            </Form.Group>
                            <Form.Group className='my-3' controlId='quantity'>
                                <Form.Label>Số lượng</Form.Label>
                                <Form.Control
                                    type='quantity'
                                    placeholder='Enter quantity'
                                    value={quantity}
                                    onChange={(e) => setQuantity(e.target.value)}
                                    required
                                ></Form.Control>
                            </Form.Group>

                            <Form.Group className='my-3' controlId='material'>
                                <Form.Label>Chất liệu</Form.Label>
                                <Form.Control
                                    type='material'
                                    placeholder='Enter material'
                                    value={material}
                                    onChange={(e) => setMaterial(e.target.value)}
                                    required
                                ></Form.Control>
                            </Form.Group>


                            <Form.Group className='my-3' controlId='color' style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <div >
                                    <Form.Label >Màu sắc</Form.Label>
                                    <Form.Control
                                        style={{ display: 'flex' }}
                                        type='color'
                                        placeholder='Confirm color'
                                        value={color}
                                        onChange={(e) => setColor(e.target.value)}
                                    ></Form.Control>
                                </div>

                                <div >
                                    <Form.Label className='my-1'>Trạng thái</Form.Label>
                                    <Form.Check
                                        type='radio'
                                        label='Thay đổi'
                                        checked={isReplacable === 1}
                                        name='radioOptions'
                                        onChange={() => setIsReplacable(1)}
                                    />
                                    <Form.Check
                                        type='radio'
                                        label='Cố định'
                                        checked={isReplacable === 0}
                                        name='radioOptions'
                                        onChange={() => setIsReplacable(0)}
                                    />
                                </div>

                            </Form.Group>
                            <Form.Group className='my-3' controlId='text-area'>
                                <Form.Label>Mô tả</Form.Label>
                                <Form.Control
                                    as='textarea'
                                    placeholder='Enter description'
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                ></Form.Control>
                            </Form.Group>

                            <Button disabled={loadingaddComponent} type='submit' variant='primary'>
                                Tạo
                            </Button>
                            {loadingaddComponent && <Loader />}
                        </Form>
                    </FormContainer>
                </Col>
                <Col >
                    <Card title="Danh sách đã tạo"
                        extra={
                            <Button onClick={Handler} >
                                Tạo
                            </Button>
                        }
                    >
                        {listComponent?.map((component) => (
                            <Card
                                style={{
                                    marginTop: 16,
                                }}
                                type="inner"
                                title={component.name}
                                // extra={<a href="#">More</a>}
                            >
                                <div style={{ display: 'flex' }}>
                                    <p>▣ Chất liệu: {component.material}</p>
                                    <p>▣ Mô tả: {component.description}</p>
                                    {/* Add more properties as needed */}
                                </div>
                            </Card>
                        ))}
                    </Card>
                </Col>
            </Row>

        </Container>
    );
};

export default UserOrderScreen;
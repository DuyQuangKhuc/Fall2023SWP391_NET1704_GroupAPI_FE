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
import { Card, Select } from 'antd';
import { ColorPicker, theme } from 'antd';

const UserOrderScreen = () => {
    const { token } = theme.useToken();
    const [material, setMaterial] = useState('');
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [color, setColor] = useState(token.colorPrimary);
    const [isReplacable, setIsReplacable] = useState('');
    const [quantity, setQuantity] = useState('');
    const navigate = useNavigate();
    const { userInfo } = useSelector((state) => state.auth);
    console.log(token.colorPrimary)

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
                }).unwrap()
                toast.success("Tạo thành công");
            }
        } catch (err) {
            toast.error("Lỗi");

        }
    };

    const [getCompleteProduct] = useGetCompleteProductMutation()

    const Handler = async () => {
        try {
            const res = await getCompleteProduct(userInfo.accountId);
            toast.success("Tạo thành công");
            navigate('/')
        } catch (err) {
            // Handle error
        }
    };

    const { data: listComponent,  refetch } = useGetListComponentOfProductUserCreatingQuery(userInfo.accountId);
    useEffect(() => {
        if (listComponent) {
            const intervalId = setInterval(refetch, 1000); // Refresh every 1 seconds
            return () => clearInterval(intervalId); // Cleanup the interval on component unmount or 'order' change
        }
    }, [listComponent, refetch]);


    return (
        <Container>
            <Row className='py-3'>
                <Col md={6}>
                    <FormContainer>
                        <Form onSubmit={submitHandler}>
                            <Form.Group className='my-3' controlId='name'>
                                <Form.Label className="font-semibold">Tên thành phần</Form.Label>
                                {/* <Form.Control
                                    type='name'
                                    placeholder='Enter name'
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                >
                                </Form.Control> */}
                                <Select
                                    showSearch
                                    style={{
                                        width: 295,
                                    }}
                                    placeholder="Search to Select"
                                    optionFilterProp="children"
                                    filterOption={(input, option) => (option?.label ?? '').includes(input)}
                                    filterSort={(optionA, optionB) =>
                                        (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                                    } 
                                    options={[
                                        {
                                            value: 'Cửa',
                                            label: 'Cửa',
                                        },
                                        {
                                            value: 'Đáy',
                                            label: 'Đáy',
                                        },
                                        {
                                            value: 'Khung',
                                            label: 'Khung',
                                        },
                                        {
                                            value: 'Khay đựng',
                                            label: 'Khay đựng',
                                        },
                                        {
                                            value: 'Móc treo',
                                            label: 'Móc treo',
                                        },
                    
                                    ]}
                                    value={name}
                                    onChange={(value) => setName(value)}
                                    />
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
                                    {/* <Form.Control
                                        style={{ display: 'flex' }}
                                        type='color'
                                        placeholder='Confirm color'
                                        value={color}
                                        onChange={(e) => setColor(e.target.value)}
                                    ></Form.Control> */}
                                    <ColorPicker style={{ display: 'flex' }} size="large" value={color} onChange={setColor} />
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
                                <Button onClick={Handler}  >
                                    Hoàn thiện sản phẩm
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
                                    <div style={{ display: 'flex' , justifyContent: 'space-between'}}>
                                        <p>▣ Chất liệu: {component.material}</p>
                                        <p>▣ Số lượng: {component.quantity}</p>
                                        <p>▣ Màu sắc: {component.color}</p>
                                        <p>▣ Trạng thái: {component.isReplacable}</p>
                                       
                                    </div>
                                    <p>▣ Mô tả: {component.description}</p>
                                </Card>
                            ))}

                        </Card>
                
                </Col>
            </Row>

        </Container>
    );
};

export default UserOrderScreen;
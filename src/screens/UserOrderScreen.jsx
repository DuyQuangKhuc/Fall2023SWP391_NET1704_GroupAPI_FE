/* eslint-disable no-unused-vars */
import React from 'react';
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
import { Option } from 'antd/es/mentions';
import { BlockPicker } from 'react-color';
import { ButtonBase, ButtonGroup, TextField } from '@material-ui/core';
import { Autocomplete } from '@mui/lab';
import { createFilterOptions } from '@mui/base';

const UserOrderScreen = () => {

    const [material, setMaterial] = useState('');
    const [name, setName] = useState('');
    const [description, setDescription] = useState('không');
    const [color, setColor] = React.useState('#555555');
    const [isReplacable, setIsReplacable] = useState(1);
    const [quantity, setQuantity] = useState('');
    const navigate = useNavigate();
    const { userInfo } = useSelector((state) => state.auth);
    const [showPicker, setShowPicker] = React.useState(false);

    const handleTogglePicker = () => {
        setShowPicker(!showPicker);
    };
    const handleChangeColor = (selectedColor) => {
        setColor(selectedColor.hex);
    };

    const [AddProductDetailClone, { isLoading: loadingaddComponent }] = useAddProductDetailCloneMutation();

    console.log(userInfo?.accountId)

    const encodedColor = encodeURIComponent(color);

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            if (userInfo?.accountId) {
                const res = await AddProductDetailClone({
                    accountId: userInfo?.accountId,
                    material,
                    quantity,
                    name,
                    description,
                    color: encodedColor,
                    isReplacable,
                }).unwrap()
                toast.success("Tạo thành công");
                console.log(color)
            }
        } catch (err) {
            toast.error("Lỗi");

        }
    };

    const [getCompleteProduct] = useGetCompleteProductMutation()

    const Handler = async () => {
        try {
            const res = await getCompleteProduct(userInfo?.accountId);
            toast.success("Tạo thành công");
            navigate('/')
        } catch (err) {
            // Handle error
        }
    };

    const { data: listComponent, refetch } = useGetListComponentOfProductUserCreatingQuery(userInfo?.accountId);
    useEffect(() => {
        if (listComponent) {
            const intervalId = setInterval(refetch, 1000); // Refresh every 1 seconds
            return () => clearInterval(intervalId); // Cleanup the interval on component unmount or 'order' change
        }
    }, [listComponent, refetch]);

    const [nameCustom, setCustom] = useState(null);
    const [customValue, setCustomValue] = useState(null);

    const handleSelectChange = (value) => {
        // Check if the selected value is the custom value
        if (value === 'custom') {
            // Enable custom value input mode
            setCustom(null);
            setCustomValue('');
        } else {
            // Disable custom value input mode and set the selected value
            setCustom(value);
            setCustomValue(null);
        }
    };

    const handleCustomValueChange = (event) => {
        setCustomValue(event.target.value);
    };

    const handleCustomValueBlur = () => {
        // Set the custom value as the selected value
        setCustom(customValue);
        setCustomValue(null);
    };

    const [suggestions, setSuggestions] = useState([]);

    const handleMaterialChange = (e) => {
        const value = e.target.value;
        setMaterial(value);
        setSuggestions(getFilteredOptions(value));
    };

    const handleSuggestionClick = (option) => {
        setMaterial(option);
        setSuggestions([]);
    };

    const getFilteredOptions = (value) => {
        const filteredOptions = ['gỗ', 'sắc', 'nhôm'].filter((option) =>
            option.toLowerCase().includes(value.toLowerCase())
        );
        return filteredOptions;
    };

    return (
        <div className=" max-w-full  bg-repeat" style={{
            backgroundImage: "url('https://img.rawpixel.com/s3fs-private/rawpixel_images/website_content/v1016-a-02-ksh6oqdp.jpg?w=800&dpr=1&fit=default&crop=default&q=65&vib=3&con=3&usm=15&bg=F4F4F3&ixlib=js-2.2.1&s=8bf67d33cc68e3f340e23db016c234dd')",
            backgroundSize: 'cover',
            backgroundPosition: 'center center',
            backgroundRepeat: 'no-repeat',

        }}>
            <Container>
                <Row className='py-3'>
                    <Col md={6}>
                        <FormContainer>
                            <Form onSubmit={submitHandler}>
                                <Form.Group className='my-3' controlId='name'>
                                    <Form.Label className="font-semibold">Tên bộ phận</Form.Label>
                                    <Select
                                        showSearch
                                        style={{
                                            width: 295,
                                        }}
                                        size="large"
                                        placeholder="Chọn"
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
                                        type='number'
                                        placeholder='Nhập số lượng'
                                        value={quantity}
                                        min={1}
                                        onChange={(e) => setQuantity(e.target.value)}
                                        required
                                        autoComplete="off"
                                    ></Form.Control>


                                </Form.Group>

                                <Form.Group className='my-3' controlId='material'>
                                    <Form.Label>Chất liệu</Form.Label>
                                    {/* <Form.Control
                                        type='material'
                                        placeholder='Ví dụ như gỗ, sắc, nhôm, ....'
                                        value={material}
                                        onChange={(e) => setMaterial(e.target.value)}
                                        required
                                    ></Form.Control> */}
                                    <Form.Control
                                        type="text"
                                        placeholder="Ví dụ như gỗ, sắc, nhôm, ...."
                                        value={material}
                                        onChange={handleMaterialChange}
                                        required
                                        autoComplete="off"
                                    />
                                    {suggestions.length > 0 && (
                                        <ul className="autocomplete-options">
                                            {suggestions.map((option, index) => (
                                                <li key={index} onClick={() => handleSuggestionClick(option)}>
                                                    {option}
                                                </li>
                                            ))}
                                        </ul>
                                    )}


                                </Form.Group>


                                <Form.Group className='my-3' controlId='color' style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <div >
                                        <Form.Label >Màu sắc</Form.Label>
                                        {/* <input
                                            style={{ display: 'flex' }}
                                            type='color'
                                            value={color}
                                            onChange={(e) => setColor(e.target.value)}>
                                        </input> */}
                                        <div
                                            style={{
                                                backgroundColor: `${color}`,
                                                width: 100,
                                                height: 50,
                                                border: "2px solid white",
                                            }}
                                            onClick={handleTogglePicker}
                                        ></div>
                                        <p></p>
                                        {showPicker && (
                                            <BlockPicker
                                                color={color}
                                                onChange={handleChangeColor}
                                            />
                                        )}
                                        {/* <ColorPicker style={{ display: 'flex' }} size="large" value={color} onChange={setColor} /> */}
                                    </div>

                                    <div >
                                        <Form.Label className='my-1'>Bộ phận</Form.Label>
                                        <Form.Check
                                            type='radio'
                                            label='Tháo rời'
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
                                        placeholder=''
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                    ></Form.Control>
                                </Form.Group>

                                <Button disabled={loadingaddComponent} type='submit' variant='primary'>
                                    Thêm
                                </Button>
                                {loadingaddComponent && <Loader />}
                            </Form>
                        </FormContainer>
                    </Col>
                    <Col >

                        <Card title="Danh sách đã thêm"
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
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <p>▣ Chất liệu: {component.material}</p>
                                        <p>▣ Số lượng: {component.quantity}</p>
                                        <p style={{ display: 'flex' }}>▣ Màu sắc: <div
                                            style={{
                                                marginLeft: '10px',
                                                backgroundColor: `${component.color}`,
                                                width: 50,
                                                height: 28,
                                            }}
                                        ></div></p>
                                        <p>▣ Bộ phận: {component?.isReplacable && component?.isReplacable === 1 ? "Tháo rời" : component?.isReplacable === 0 ? "Cố định" : ""}</p>

                                    </div>
                                    <p>▣ Mô tả: {component.description}</p>
                                </Card>
                            ))}

                        </Card>

                    </Col>
                </Row>

            </Container>
        </div>
    );
};

export default UserOrderScreen;
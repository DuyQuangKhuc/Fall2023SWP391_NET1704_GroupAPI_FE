/* eslint-disable no-lone-blocks */
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
import { useAddProductDetailCloneMutation, useDeleteAllComponentOfProductMutation, useDeleteComponentOfProductMutation, useGetCompleteProductMutation, useGetListComponentOfProductUserCreatingQuery } from '../slices/productsApiSlice';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import FormContainer from '../components/FormContainer';
import Loader from '../components/Loader';
import { Card, Select } from 'antd';
import { ColorPicker, theme } from 'antd';
import { Option } from 'antd/es/mentions';
import { BlockPicker } from 'react-color';
import { Box, ButtonBase, ButtonGroup, TableBody, TableCell, TableHead, TableRow, TextField } from '@material-ui/core';
import { Autocomplete } from '@mui/lab';
import { createFilterOptions } from '@mui/base';
import ComUpImg from '../components/Input/ComUpImg';
import ComInput from '../components/Input/ComInput';
import { firebaseImgs } from '../upImgFirebase/firebaseImgs';
import { FaTrash } from 'react-icons/fa';
import Message from '../components/Message';

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
    const [description1, setDescription1] = useState('không');
    const [imagePath, setImages] = useState('');


    const onChange = (data) => {
        const selectedImages = data;
        // Tạo một mảng chứa đối tượng 'originFileObj' của các tệp đã chọn
        const newImages = selectedImages.map((file) => file.originFileObj);
        // Cập nhật trạng thái 'image' bằng danh sách tệp mới
        setImages(newImages);
        console.log(imagePath);
        // setFileList(data);
    }
    const [getCompleteProduct] = useGetCompleteProductMutation()

    const Handler = async (e) => {
        const requiredComponents = ['Cửa', 'Đáy', 'Khung', 'Móc treo'];
        const hasAllComponents = requiredComponents.every(component => listComponentData.map(item => item.name).includes(component));

        if (hasAllComponents) {
            try {
                const dataImg = await firebaseImgs(imagePath);
                const encoded = encodeURIComponent(dataImg[0]);
                const res = await getCompleteProduct({
                    accountId: userInfo?.accountId,
                    imagePath: encoded,
                    description: description1,
                });
                toast.success("Tạo thành công");
                navigate('/');
                console.log(encoded);
            } catch (error) {
                toast.error('Hãy thêm ảnh');
            }
        } else {
            const missingComponents = requiredComponents.filter(component => !listComponentData.map(item => item.name).includes(component));
            const missingComponentsString = missingComponents.join(', ');
            toast.error(`Bạn chưa chọn ${missingComponentsString}`);
        }
    }
    const [listComponentData, setListComponentData] = useState([]);
    console.log("dâ", listComponentData.map(item => item.name));
    const { data: listComponent, refetch } = useGetListComponentOfProductUserCreatingQuery(userInfo?.accountId);
    useEffect(() => {
        if (listComponent) {
            const intervalId = setInterval(refetch, 1000);
            setListComponentData(listComponent); // Refresh every 1 seconds
            return () => clearInterval(intervalId); // Cleanup the interval on component unmount or 'order' change
        }
    }, [listComponent, listComponentData, refetch]);

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

    const [deleteComponentOfProduct, { isLoading: loadingDelete, }] = useDeleteComponentOfProductMutation();

    const deleteHandler = async (productDetailId) => {
        if (window.confirm('Bạn có muốn xóa ?')) {
            try {
                await deleteComponentOfProduct(productDetailId);
                toast.success('Xóa thành công');
            } catch (err) {
                toast.error(err?.data?.message || err.error);
            }
        }
    };

    const [deleteAllComponentOfProduct] = useDeleteAllComponentOfProductMutation();


    const deleteAllHandler = async (accountId) => {
        if (window.confirm('Bạn muốn xóa tât cả ?')) {
            try {
                await deleteAllComponentOfProduct(accountId);
                toast.success('Xóa thành công');
            } catch (err) {
                toast.error(err?.data?.message || err.error);
            }
        }
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
                                    <Form.Label className="font-semibold">Tên bộ phận <span style={{ color: 'red' }}>*</span></Form.Label>
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
                                            String(optionA?.label ?? '').toLowerCase().localeCompare(String(optionB?.label ?? '').toLowerCase())
                                        }
                                        options={[
                                            {
                                                value: 'Cửa',
                                                label: <span>Cửa <span style={{ color: 'red' }}>*</span></span>,
                                            },
                                            {
                                                value: 'Đáy',
                                                label: <span>Đáy <span style={{ color: 'red' }}>*</span></span>,
                                            },
                                            {
                                                value: 'Khung',
                                                label: <span>Khung <span style={{ color: 'red' }}>*</span></span>,
                                            },
                                            {
                                                value: 'Móc treo',
                                                label: <span>Móc treo <span style={{ color: 'red' }}>*</span></span>,
                                            },
                                            {
                                                value: 'Khay đựng',
                                                label: 'Khay đựng',
                                            },


                                        ]}
                                        value={name}
                                        onChange={(value) => setName(value)}

                                    />
                                </Form.Group>

                                <Form.Group className='my-3' controlId='quantity'>
                                    <Form.Label>Số lượng <span style={{ color: 'red' }}>*</span></Form.Label>
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
                                    <Form.Label>Chất liệu <span style={{ color: 'red' }}>*</span></Form.Label>
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

                        <Card title=<span> Danh sách đã thêm (Yêu cầu phải tạo đủ những bộ phận có <span style={{ color: 'red' }}>*</span> )</span>

                        >
                            <div >
                                <Button onClick={Handler} >
                                    Hoàn thiện đơn đặt riêng lồng chim
                                </Button>
                                <div className='mt-4' style={{ display: 'flex', }}>
                                    <Form.Group controlId='text-area'>
                                        <Form.Label>Thêm ảnh</Form.Label>
                                        <ComUpImg onChange={onChange} />
                                    </Form.Group>
                                    <Form.Group controlId='text-area'>
                                        <Form.Label>Mô tả</Form.Label>
                                        <Form.Control
                                            style={{ width: '300px', }}
                                            as='textarea'
                                            placeholder=''
                                            value={description1}
                                            onChange={(e) => setDescription1(e.target.value)}
                                        ></Form.Control>
                                    </Form.Group>
                                </div>
                                {(listComponent?.length === 0 || listComponent === undefined) ? (
                                    <Message>
                                        Danh sách trống
                                    </Message>
                                ) : (
                                    <>
                                        <Button
                                            style={{ justifyContent: 'end' }}
                                            className='mb-2 mt-2'
                                            type='button'
                                            variant='light'
                                            onClick={() => deleteAllHandler(userInfo?.accountId)}
                                        >
                                            <FaTrash /> Xóa tất cả danh sách đã tạo
                                        </Button>
                                        <Box sx={{ margin: 1 }}>
                                            <table class="table table-bordered ">
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell>Tên</TableCell>
                                                        <TableCell>Chất liệu</TableCell>
                                                        <TableCell>Số lượng</TableCell>
                                                        <TableCell>Màu sắc</TableCell>
                                                        <TableCell>Mô tả</TableCell>
                                                        <TableCell>Trạng thái</TableCell>
                                                        <TableCell></TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {listComponent?.map((component, index) => (
                                                        <TableRow key={index}>
                                                            <TableCell>{component.name}</TableCell>
                                                            <TableCell>{component.material}</TableCell>
                                                            <TableCell>{component.quantity}</TableCell>
                                                            <TableCell>
                                                                <div style={{
                                                                    backgroundColor: `${component.color}`,
                                                                    
                                                                    height: 28,
                                                                    borderRadius: '5px',
                                                                    padding: '5px',
                                                                }}></div>
                                                            </TableCell>
                                                            <TableCell>{component.description}</TableCell>
                                                            <TableCell>{component?.isReplacable && component?.isReplacable === 1 ? "Tháo rời" : component?.isReplacable === 0 ? "Cố định" : ""}</TableCell>
                                                            <TableCell>
                                                                <Button
                                                                    style={{ color: '' }}
                                                                    type='button'
                                                                    variant='light'
                                                                    onClick={() => deleteHandler(component.productDetailId)}
                                                                >
                                                                    <FaTrash />
                                                                </Button>
                                                            
                                                            </TableCell>
                                                        </TableRow>
                                                    ))
                                                    }
                                                </TableBody>
                                            </table>
                                        </Box>
                                    </>
                                )}

                            </div>
                            {/* {listComponent?.map((component) => (
                                <Card
                                    style={{
                                        marginTop: 16,
                                    }}
                                    type="inner"
                                    title={<span style={{ color: 'Green' }}>▻ {component.name}</span>}
                                    extra={
                                        <Col md={2}>
                                            <Button
                                                style={{ color: '' }}
                                                type='button'
                                                variant='light'
                                                onClick={() => deleteHandler(component.productDetailId)}
                                            >
                                                <FaTrash />
                                            </Button>
                                        </Col>
                                    }
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <p>• Chất liệu: {component.material}</p>
                                        <p>• Số lượng: {component.quantity}</p>
                                        <p style={{ display: 'flex' }}>• Màu sắc: <div
                                            style={{
                                                marginLeft: '10px',
                                                backgroundColor: `${component.color}`,
                                                width: 50,
                                                height: 28,
                                            }}
                                        ></div></p>
                                        <p>• Bộ phận: {component?.isReplacable && component?.isReplacable === 1 ? "Tháo rời" : component?.isReplacable === 0 ? "Cố định" : ""}</p>

                                    </div>
                                    <p>• Mô tả: {component.description}</p>

                                </Card>
                            ))} */}

                        </Card>

                    </Col>
                </Row>

            </Container>
        </div>
    );
};

export default UserOrderScreen;

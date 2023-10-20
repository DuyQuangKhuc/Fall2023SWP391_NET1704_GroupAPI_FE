/* eslint-disable react/jsx-no-duplicate-props */
import { LinkContainer } from 'react-router-bootstrap';
import { Row, Col, ListGroup, Image, Button, Container, Form, Table } from 'react-bootstrap';
import { FaEdit, FaPlus, FaTrash } from 'react-icons/fa';
import { useNavigate, useParams } from 'react-router-dom';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import { Alert, Paper } from "@mui/material";
import {
    useGetProductsQuery,
    useDeleteProductMutation,
    useCreateProductMutation,
    useAddComponentMutation,
    useGetListComponentQuery,
} from '../../slices/productsApiSlice';
import { toast } from 'react-toastify';
import { Modal, notification } from 'antd';
import Box from '@mui/material/Box';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import * as yup from "yup"
import React, { useEffect } from 'react';
import { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, MenuItem, Select } from '@material-ui/core';
import Rating from '../../components/Rating';
import { textApp } from '../../components/textApp';
import { yupResolver } from '@hookform/resolvers/yup'
import { FormProvider, useForm } from 'react-hook-form'
import ComInput from '../../components/Input/ComInput';
import ComNumber from '../../components/Input/ComNumber';
import ComSelect from '../../components/Input/ComSelect';
import ComTextArea from '../../components/Input/ComTextArea';
import { postData } from '../../api/api';
import { firebaseImgs } from '../../upImgFirebase/firebaseImgs'
import ComUpImg from '../../components/Input/ComUpImg';
import FormContainer from '../../components/FormContainer';

const VISIBLE_FIELDS = [ 'productId', 'name', 'imagePath1', 'price', 'uploadDate', 'quantity', 'status'];

const options = [
    {
        label: "Gỗ",
        value: "Gỗ"
    },
    {
        label: "Nhựa",
        value: "Nhựa"
    },
    {
        label: "Kim Loại",
        value: "Kim loại"
    },
];

function ProductListScreen(props) {
    const { pageNumber } = useParams();

    const { data, isLoading, error, refetch } = useGetProductsQuery({
        pageNumber,
    });
    useEffect(() => {
        if (data) {
            const intervalId = setInterval(refetch, 1000); // Refresh every 1 seconds
            return () => clearInterval(intervalId); // Cleanup the interval on component unmount or 'order' change
        }
    }, [data, refetch]);

    const getRowId = (row) => row.productId;

    // Otherwise filter will be applied on fields such as the hidden column id
    const columns = React.useMemo(
        () =>
            VISIBLE_FIELDS.map((field) => {
                if (field === 'imagePath1') {
                    return {
                        field,
                        headerName: field.toUpperCase(),
                        width: 150,
                        sortable: true,
                        filterable: true,
                        renderCell: (params) => (
                            <div onClick={() => handleCellClick(params)}>
                                <img src={params.value} alt={params.value} style={{ width: '50px', height: '50px' }} />
                            </div>

                        ),
                    };
                } else {
                    return {
                        field,
                        headerName: field.toUpperCase(),
                        width: 170,
                        sortable: true,
                        filterable: true,
                        renderCell: (params) => (
                            <div onClick={() => handleCellClick(params)}>
                                {params.value}
                            </div>
                        ),
                    };
                }
            }),
        []
    );

    const [selectedRow, setSelectedRow] = useState(null);

    function handleCellClick(params) {
        // Set the selected row to the clicked row
        setSelectedRow(params.row);
    }

    function handleCloseDialog() {
        // Clear the selected row when the dialog is closed
        setSelectedRow(null);
    }


    const [deleteProduct, { isLoading: loadingDelete }] =
        useDeleteProductMutation();

    const deleteHandler = async (productId) => {
        if (window.confirm('Are you sure')) {
            try {
                await deleteProduct(productId);
                refetch();
            } catch (err) {
                toast.error(err?.data?.message || err.error);
            }
        }
    };

    const [createProduct, { isLoading: loadingCreate }] =
        useCreateProductMutation();

    const createProductHandler = async () => {
        if (window.confirm('Are you sure you want to create a new product?')) {
            try {
                await createProduct();
                refetch();
            } catch (err) {
                toast.error(err?.data?.message || err.error);
            }
        }
    };

    const [isModalOpen, setIsModalOpen] = useState(false);
    const showModal = () => {
        setIsModalOpen(true);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const [isModalOpen2, setIsModalOpen2] = useState(false);
    const showModal2 = () => {
        setIsModalOpen2(true);
    };
    const handleCancel2 = () => {
        setIsModalOpen2(false);
    };

    const [disabled, setDisabled] = useState(false);
    const [imagePath1, setImages] = useState([]);
    const [api, contextHolder] = notification.useNotification();

    const CreateProductMessenger = yup.object({
        name: yup.string().required(textApp.CreateProduct.message.name),
        price: yup.number().min(1, textApp.CreateProduct.message.priceMin).typeError(textApp.CreateProduct.message.price),
        //price1: yup.string().required(textApp.CreateProduct.message.price).min(1, textApp.CreateProduct.message.priceMin).test('no-dots', textApp.CreateProduct.message.priceDecimal, value => !value.includes('.')),
        //reducedPrice: yup.number().min(1, textApp.CreateProduct.message.priceMin).typeError(textApp.CreateProduct.message.price),
        //reducedPrice1: yup.string().required(textApp.CreateProduct.message.price).min(1, textApp.CreateProduct.message.priceMin).test('no-dots', textApp.CreateProduct.message.priceDecimal, value => !value.includes('.')),
        quantity: yup.number().min(1, textApp.CreateProduct.message.quantityMin).typeError(textApp.CreateProduct.message.quantity),
        size: yup.string().required(textApp.CreateProduct.message.size),
        durability: yup.string().required(textApp.CreateProduct.message.durability),
        //material: yup.array().required(textApp.CreateProduct.message.material),
        description: yup.string().required(textApp.CreateProduct.message.description),
        //imagePath: yup.array().required(textApp.CreateProduct.message.imagePath),
    })
    const createProductRequestDefault = {
        price: "",
        //reducedPrice: 0,  
    };
    const methods = useForm({
        resolver: yupResolver(CreateProductMessenger),
        defaultValues: {
            name: "",
            quantity: 1,
            //material: "",
            size: "",
            durability: "",
            imagePath1: "",
            description: "",
        },
        values: createProductRequestDefault
    })
    const { handleSubmit, register, setFocus, watch, setValue } = methods

    function isInteger(number) {
        return typeof number === 'number' && isFinite(number) && Math.floor(number) === number;
    }
    const onSubmit = (data) => {
        console.log(data);
        if (!isInteger(data.price)) {

            api["error"]({
                message: textApp.CreateProduct.Notification.m1.message,
                description:
                    textApp.CreateProduct.Notification.m1.description
            });
            return
        }

        // if (data.material.length === 0) {
        //     api["error"]({
        //         message: textApp.CreateProduct.Notification.m4.message,
        //         description:
        //             textApp.CreateProduct.Notification.m4.description
        //     });
        //     return
        // }
        if (imagePath1.length === 0) {
            api["error"]({
                message: textApp.CreateProduct.Notification.m5.message,
                description:
                    textApp.CreateProduct.Notification.m5.description
            });
            return
        }
        if (data.price <= data.reducedPrice) {
            api["error"]({
                message: textApp.CreateProduct.Notification.m6.message,
                description:
                    textApp.CreateProduct.Notification.m6.description
            });
            return
        }

        setDisabled(true)

        firebaseImgs(imagePath1)
            .then((dataImg) => {
                console.log(dataImg[0]);
                const post = { ...data, imagePath1: dataImg[0], };
                console.log(post);
                postData('/Product/Add-Product', post)
                    .then((data) => {
                        console.log(data);
                        setIsModalOpen(false);
                        setDisabled(false)
                        toast.success('Sản phẩm đã được tạo thành công');
                    })
                    .catch((err) => {
                        toast.error('Tạo sản phẩm thất bại');
                        console.error("Error fetching items:", error);
                        setDisabled(false)
                    });
            })
            .catch((error) => {
                console.log(error)
            });


    }
    const onChange = (data) => {
        const selectedImages = data;
        // Tạo một mảng chứa đối tượng 'originFileObj' của các tệp đã chọn
        const newImages = selectedImages.map((file) => file.originFileObj);
        // Cập nhật trạng thái 'image' bằng danh sách tệp mới
        setImages(newImages);
        console.log(imagePath1);
        // setFileList(data);
    }
    const handleValueChange = (e, value) => {

        setValue("price", value, { shouldValidate: true });
    };

    const handleValueChange1 = (e, value) => {
        console.log(value);
        setValue("reducedPrice", value, { shouldValidate: true });
    };

    const handleValueChangeSelect = (e, value) => {
        if (value.length === 0) {
            setValue("material", null, { shouldValidate: true });
        } else {
            setValue("material", value, { shouldValidate: true });
        }
    };


    const MySelectComponent = () => {
        const [selectedOption, setSelectedOption] = useState('');
        const { data1 } = useGetListComponentQuery();

        const handleOptionChange = (event) => {
            setSelectedOption(event.target.value);
        };

        console.log(data1);

        return (
            <>
                {data1 ? (
                    <Select value={selectedOption} onChange={handleOptionChange}>
                        {data1.map((components) => (
                            <MenuItem key={components.componentId} value={components.componentId}>
                                {components.name}
                            </MenuItem>
                        ))}
                    </Select>
                ) : (
                    <p>Loading...</p>
                )}

                {isLoading ? (
                    <Loader />
                ) : error ? (
                    <Message variant='danger'>
                        {error?.data?.message || error.error}
                    </Message>
                ) : (
                    <Table>
                        <tbody>
                            {data1 && data1
                                .filter((data) => data.componentId === selectedOption) // Filter the data based on the selected option
                                .map((data, index) => (
                                    <tr key={index}>
                                        <td>{data.color}</td>
                                        <td>{data.name}</td>
                                        <td></td>
                                    </tr>
                                ))}
                        </tbody>
                    </Table>
                )}
            </>
        );
    };

    const [material, setMaterial] = useState('');
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [color, setColor] = useState('');
    const [isReplacable, setIsReplacable] = useState('');
    const [addComponent, { isLoading: loadingaddComponent }] = useAddComponentMutation();


    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            const res = await addComponent({
                material,
                name,
                description,
                color,
                isReplacable,
            }).unwrap();
            setIsModalOpen2(false);
            toast.success("Tạo thành công");
        } catch (err) {
            toast.error("đã tồn tại");

        }
    };

    return (
        <Container >
            <Row className='align-items-center'>
                <Col>
                    <h1>Products</h1>
                </Col>

                <Col className='text-'>

                </Col>
                <Col className='text-end'>
                    <Button className='my-3' onClick={showModal}>
                        <FaPlus />Tạo sản phẩm
                    </Button>

                    <Button className='mx-3' onClick={showModal2}>
                        <FaPlus />Thêm thành phần
                    </Button>
                </Col>
            </Row>

            <Modal
                title={
                    <Col>
                        <h1>Tạo sản phẩm</h1>
                    </Col>
                }
                // okType="primary text-black border-gray-700"
                open={isModalOpen}

                width={800}
                style={{ top: 10 }}

                onCancel={handleCancel}

                footer={[

                ]}
            >
                <FormProvider {...methods} >
                    <Form onSubmit={handleSubmit(onSubmit)} className="mx-auto mt-4 max-w-xl sm:mt-8">
                        <div className=' overflow-y-auto p-4'>
                            <div className="grid"
                                style={{ height: "62vh" }}>
                                <Form.Group className="">
                                    <Form.Label>Tên sản phẩm</Form.Label>
                                    <ComInput
                                        type="text"
                                        // label={textApp.CreateProduct.label.name}
                                        placeholder={textApp.CreateProduct.placeholder.name}
                                        {...register("name")}
                                        required
                                    />

                                </Form.Group>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Form.Group className=' mt-4 sm:mt-8'>
                                        <Form.Label>Giá tiền</Form.Label>
                                        <ComNumber
                                            //label={textApp.CreateProduct.label.price}
                                            placeholder={textApp.CreateProduct.placeholder.price}
                                            // type="money"
                                            defaultValue={0}
                                            min={0}
                                            money
                                            onChangeValue={handleValueChange}
                                            {...register("price")}
                                            required
                                        />

                                    </Form.Group>


                                    <Form.Group className='mx-auto mt-4 max-w-xl sm:mt-8'>
                                        <Form.Label>Số lượng sản phẩm</Form.Label>
                                        <ComNumber
                                            placeholder={textApp.CreateProduct.placeholder.quantity}
                                            type="numbers"
                                            min={1}
                                            {...register("quantity")}
                                            required
                                        />

                                    </Form.Group>
                                </div>
                                
                                <Form.Group className='mx-auto mt-4 max-w-xl mb-3'>
                                    <ComInput
                                        label={textApp.CreateProduct.label.size}
                                        placeholder={textApp.CreateProduct.placeholder.size}
                                        required
                                        type="text"
                                        {...register("size")}
                                    />
                                </Form.Group>

                                <ComInput className='mx-auto mt-4 max-w-xl mb-3'
                                    label={textApp.CreateProduct.label.durability}
                                    placeholder={textApp.CreateProduct.placeholder.durability}
                                    rows={4}
                                    defaultValue={''}
                                    required
                                    maxLength={1000}
                                    {...register("durability")}
                                />

                                <ComTextArea
                                    label={textApp.CreateProduct.label.description}
                                    placeholder={textApp.CreateProduct.placeholder.description}
                                    rows={4}
                                    defaultValue={''}
                                    required
                                    type="text"
                                    maxLength={1000}
                                    {...register("description")}
                                />


                                <div className='mx-auto mt-4 max-w-xl mb-3'>
                                    <ComUpImg onChange={onChange} />
                                </div>
                            </div>
                        </div>
                        <Col className='text-end'>
                            <Button
                                disabled={disabled}
                                htmlType="submit"
                                type="primary"

                            >
                                {textApp.common.button.createProduct}
                            </Button>
                        </Col>
                    </Form>
                </FormProvider>
            </Modal>

            <Modal
                title={
                    <Col>
                        <h1>Thêm thành phần</h1>
                    </Col>
                }
                // okType="primary text-black border-gray-700"
                open={isModalOpen2}

                width={800}
                style={{ top: 10 }}

                onCancel={handleCancel2}

                footer={[

                ]}
            >
                <Container className='my-3'>
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


                </Container>
            </Modal>

            {loadingCreate && <Loader />}
            {loadingDelete && <Loader />}
            {isLoading ? (
                <Loader />
            ) : error ? (
                <Message variant='danger'>{error?.data?.message}</Message>
            ) : (
                <>

                    <Box sx={{ height: 600, width: 1 }}>
                        <DataGrid
                            rows={data}
                            getRowId={getRowId}
                            disableColumnFilter
                            disableColumnSelector
                            disableDensitySelector
                            columns={columns}
                            slots={{ toolbar: GridToolbar }}
                            slotProps={{
                                toolbar: {
                                    showQuickFilter: true,
                                },
                            }}
                            onCellClick={handleCellClick}
                        />

                        {selectedRow && (
                            <Dialog open={Boolean(selectedRow)} onClose={handleCloseDialog} >
                                <DialogTitle>{selectedRow.name}</DialogTitle>
                                <DialogContent >
                                    <Row>
                                        <Col md={6}>
                                            <Image src={selectedRow.imagePath1} alt={selectedRow.name} fluid />
                                        </Col>
                                        <Col md={6}>
                                            <ListGroup variant='flush'>
                                                <ListGroup.Item>
                                                    <Rating
                                                        value={selectedRow.rating}
                                                        text={`${selectedRow.numReviews} reviews`}
                                                    />
                                                </ListGroup.Item>
                                                <ListGroup.Item>Giá: ${selectedRow.price}</ListGroup.Item>
                                                <ListGroup.Item>
                                                    Mô tả: {selectedRow.description}
                                                </ListGroup.Item>
                                                <ListGroup.Item>
                                                    Kích cỡ: {selectedRow.size}
                                                </ListGroup.Item>
                                                <ListGroup.Item>
                                                    Độ bền: {selectedRow.durability}
                                                </ListGroup.Item>
                                                <ListGroup.Item>
                                                    NSX: {selectedRow.uploadDate}
                                                </ListGroup.Item>
                                            </ListGroup>

                                        </Col>

                                    </Row>


                                    Thêm: <MySelectComponent />


                                </DialogContent>



                                <DialogActions style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Button onClick={handleCloseDialog}>Close</Button>
                                    <div style={{ display: 'flex' }}>
                                        <LinkContainer to={`/admin/product/${selectedRow.productId}/edit`}>
                                            <Button variant='dark' className='mx-2'>
                                                <FaEdit />
                                            </Button>
                                        </LinkContainer>
                                        <Button
                                            variant='danger'
                                            className=''
                                            onClick={() => deleteHandler(selectedRow.productId)}
                                        >
                                            <FaTrash style={{ color: 'white' }} />
                                        </Button>
                                    </div>
                                </DialogActions>
                            </Dialog>
                        )}
                    </Box>
                    {/* <Table striped bordered hover responsive className='table-sm'>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>NAME</th>
                                <th>PRICE</th>
                                <th>CATEGORY</th>
                                <th>BRAND</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((product) => (
                                <tr key={product._id}>
                                    <td>{product._id}</td>
                                    <td>{product.name}</td>
                                    <td>${product.price}</td>
                                    <td>{product.category}</td>
                                    <td>{product.brand}</td>
                                    <td>
                                        <LinkContainer to={`/admin/product/${product._id}/edit`}>
                                            <Button variant='light' className='btn-sm mx-2'>
                                                <FaEdit />
                                            </Button>
                                        </LinkContainer>
                                        <Button
                                            variant='danger'
                                            className='btn-sm'
                                            onClick={() => deleteHandler(product._id)}
                                        >
                                            <FaTrash style={{ color: 'white' }} />
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody> 
                    </Table> */}


                    {/* <div className='flex p-5 justify-center'>
                        <Table
                            {...props}
                            columns={columns}
                            dataSource={data?.data}

                            scroll={{
                                x: 1520,
                                // y: 500,
                            }}

                            pagination={{
                                showSizeChanger: true, // Hiển thị dropdown cho phép chọn số lượng dữ liệu
                                pageSizeOptions: ['10', '20', '50', '100'], // Các tùy chọn số lượng dữ liệu
                            }}
                        />
                        
                    </div> */}

                    {/* <Paginate pages={data.pages} page={data.page} isAdmin={true} /> */}
                </>
            )}
        </Container>
    );
};
export default ProductListScreen
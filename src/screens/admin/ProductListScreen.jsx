/* eslint-disable react/jsx-no-duplicate-props */
import { LinkContainer } from 'react-router-bootstrap';
import { Table, Row, Col, ListGroup, Image, Button, Container, Form } from 'react-bootstrap';
import { FaEdit, FaPlus, FaTrash } from 'react-icons/fa';
import { useParams } from 'react-router-dom';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import Paginate from '../../components/Paginate';
import {
    useGetProductsQuery,
    useDeleteProductMutation,
    useCreateProductMutation,
} from '../../slices/productsApiSlice';
import { toast } from 'react-toastify';
import { Dropdown, Menu, Modal, Typography, notification } from 'antd';
import { DeleteForeverTwoTone, EditNoteTwoTone } from '@mui/icons-material';
import Box from '@mui/material/Box';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import * as yup from "yup"
import React from 'react';
import { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions } from '@material-ui/core';
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

const VISIBLE_FIELDS = ['productId', 'name', 'imagePath1', 'price', 'uploadDate', 'quantity', 'status'];

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

    // const { data: demoData } = useDemoData({
    //     dataSet: 'ProductListScreen',
    //     visibleFields: VISIBLE_FIELDS,
    //     rowLength: 100,
    // });
    // const row = {
    //     productId: "",
    //     name: 'string',
    //     description: 'string',
    //     size: 'string',
    //     color: 'string',
    //     material: 'string',
    //     floorQuantity: 0,
    //     gateQuantity: 0,
    //     durability: 'string',
    //     uploadDate: '2023-10-10T00:00:00',
    //     price: 0,
    //     quantity: 0,
    //     imagePath: "",
    //     status: ""
    // };
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
    // const handleOk = () => {
    //     setIsModalOpen(false);
    // };
    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const [disabled, setDisabled] = useState(false);
    const [imagePath, setImages] = useState([{}]);
    const [api, contextHolder] = notification.useNotification();


    const CreateProductMessenger = yup.object({
        name: yup.string().required(textApp.CreateProduct.message.name),
        price: yup.number().min(1, textApp.CreateProduct.message.priceMin).typeError(textApp.CreateProduct.message.price),
        //price1: yup.string().required(textApp.CreateProduct.message.price).min(1, textApp.CreateProduct.message.priceMin).test('no-dots', textApp.CreateProduct.message.priceDecimal, value => !value.includes('.')),
        //reducedPrice: yup.number().min(1, textApp.CreateProduct.message.priceMin).typeError(textApp.CreateProduct.message.price),
        //reducedPrice1: yup.string().required(textApp.CreateProduct.message.price).min(1, textApp.CreateProduct.message.priceMin).test('no-dots', textApp.CreateProduct.message.priceDecimal, value => !value.includes('.')),
        quantity: yup.number().min(1, textApp.CreateProduct.message.quantityMin).typeError(textApp.CreateProduct.message.quantity),
        size: yup.string().required(textApp.CreateProduct.message.size),
        material: yup.array().required(textApp.CreateProduct.message.material),
        description: yup.string().required(textApp.CreateProduct.message.description),
        //imagePath: yup.array().required(textApp.CreateProduct.message.imagePath),
    })
    const createProductRequestDefault = {
        price: 0,
        //reducedPrice: 0,
    };
    const methods = useForm({
        resolver: yupResolver(CreateProductMessenger),
        defaultValues: {
            name: "",
            quantity: 1,
            material: "",
            size: "",
            accessory: "",
            imagePath: "",
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

        // if (data.price % 1000 !== 0) {
        //     api["error"]({
        //         message: textApp.CreateProduct.Notification.m7.message,
        //         description:
        //             textApp.CreateProduct.Notification.m7.description
        //     });
        //     return
        // }
        // if (data.reducedPrice % 1000 !== 0) {
        //     api["error"]({
        //         message: textApp.CreateProduct.Notification.m8.message,
        //         description:
        //             textApp.CreateProduct.Notification.m8.description
        //     });
        //     return
        // }
        if (!isInteger(data.price)) {

            api["error"]({
                message: textApp.CreateProduct.Notification.m1.message,
                description:
                    textApp.CreateProduct.Notification.m1.description
            });
            return
        }

        if (data.material.length === 0) {
            api["error"]({
                message: textApp.CreateProduct.Notification.m4.message,
                description:
                    textApp.CreateProduct.Notification.m4.description
            });
            return
        }
        if (imagePath.length === 0) {
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

        firebaseImgs(imagePath)
            .then((dataImg) => {
                // console.log(dataImg);
                // const updatedData = {
                //     ...data, // Giữ lại các trường dữ liệu hiện có trong data
                //     imagePath: dataImg, // Thêm trường images chứa đường dẫn ảnh

                // };
                console.log(dataImg[0]);
                const post = { ...data, material: `${data.material[0]} ${data?.material[1] ? (',', data?.material[1]) : ''} ${data?.material[2] ? (',', data?.material[2]) : ''} `, imagePath: dataImg[0], };
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
        console.log(imagePath);
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

    return (
        <Container >
            <Row className='align-items-center'>
                <Col>
                    <h1>Products</h1>
                </Col>
                <Col className='text-end'>
                    <Button className='my-3' onClick={showModal}>
                        <FaPlus /> Create Product
                    </Button>
                </Col>
            </Row>

            <Modal
                title={
                    <Col>
                        <h1>Create Product</h1>
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
                                    <Form.Label>Name</Form.Label>                                
                                        <ComInput
                                            type="text"
                                            // label={textApp.CreateProduct.label.name}
                                            placeholder={textApp.CreateProduct.placeholder.name}
                                            {...register("name")}
                                            required
                                        />
                                
                                </Form.Group>
                               
                                <Form.Group className='mx-auto mt-4 max-w-xl sm:mt-8'>
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


                                <div>
                                    <ComNumber
                                        label={textApp.CreateProduct.label.quantity}
                                        placeholder={textApp.CreateProduct.placeholder.quantity}
                                        // type="numbers"
                                        min={1}
                                        defaultValue={1}
                                        {...register("quantity")}
                                        required
                                    />

                                </div>

                                <div className="">
                                    <ComSelect
                                        size={"large"}
                                        style={{
                                            width: '100%',
                                        }}
                                        label={textApp.CreateProduct.label.material}
                                        placeholder={textApp.CreateProduct.placeholder.material}
                                        required
                                        onChangeValue={handleValueChangeSelect}
                                        options={options}
                                        {...register("material")}

                                    />
                                </div>
                                <div className="sm:col-span-2">
                                    <ComInput
                                        label={textApp.CreateProduct.label.size}
                                        placeholder={textApp.CreateProduct.placeholder.size}
                                        required
                                        type="text"
                                        {...register("size")}
                                    />
                                </div>

                                <ComTextArea
                                    label={textApp.CreateProduct.label.description}
                                    placeholder={textApp.CreateProduct.placeholder.description}
                                    rows={4}
                                    defaultValue={''}
                                    required
                                    maxLength={1000}
                                    {...register("description")}
                                />



                                <div className="sm:col-span-1">
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
                            <Dialog open={Boolean(selectedRow)} onClose={handleCloseDialog}>
                                <DialogTitle>{selectedRow.name}</DialogTitle>
                                <DialogContent>
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
                                                    Màu sắc: {selectedRow.color}
                                                </ListGroup.Item>
                                                <ListGroup.Item>
                                                    Kích cỡ: {selectedRow.size}
                                                </ListGroup.Item>
                                                <ListGroup.Item>
                                                    Vật liệu: {selectedRow.material}
                                                </ListGroup.Item>
                                                <ListGroup.Item>
                                                    Số tầng: {selectedRow.floorQuantity}
                                                </ListGroup.Item>
                                                <ListGroup.Item>
                                                    Số cửa: {selectedRow.gateQuantity}
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
                                </DialogContent>
                                <DialogActions style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Button onClick={handleCloseDialog}>Close</Button>
                                    <div style={{ display: 'flex' }}>
                                        <LinkContainer to={`/admin/product/${selectedRow.productId}/edit`}>
                                            <Button variant='light' className='btn-sm mx-2'>
                                                <FaEdit />
                                            </Button>
                                        </LinkContainer>
                                        <Button
                                            variant='danger'
                                            className='btn-sm'
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
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
    useGetListComponentCreatedBySystemQuery,
    useAddComponentIntoProductMutation,
    useGetListAllComponentQuery,
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
    

    const getRowId = (row) => row.productId;

    // Otherwise filter will be applied on fields such as the hidden column id
    const columns = React.useMemo(
        () =>
            VISIBLE_FIELDS.map((field) => {
                if (field === 'imagePath1') {
                    return {
                        field,
                        headerName: 'Ảnh',
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
                    let headerName;
                    switch (field) {
                        case 'productId':
                            headerName = 'ID';
                            break;
                        case 'name':
                            headerName = 'Tên sản phẩm';
                            break;
                        case 'price':
                            headerName = 'Giá';
                            break;
                        case 'uploadDate':
                            headerName = 'Ngày đăng';
                            break;
                        case 'quantity':
                            headerName = 'Số lượng';
                            break;
                        case 'status':
                            headerName = 'Trạng thái';
                            break;
                        default:
                            headerName = '';
                    }
                    return {
                        field,
                        headerName,
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
        quantity: yup.number().min(1, textApp.CreateProduct.message.quantityMin).typeError(textApp.CreateProduct.message.quantity),
        size: yup.string().required(textApp.CreateProduct.message.size),
        durability: yup.string().required(textApp.CreateProduct.message.durability),
        description: yup.string().required(textApp.CreateProduct.message.description),
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
    const { handleSubmit, register, setValue } = methods

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

    const TableComponent = ({ selectedRowID }) => {
        const { data: getListAllComponent, refetch: ListAllComponentRefetch } = useGetListAllComponentQuery();

        const filteredComponents = getListAllComponent?.filter(component => component.productId === selectedRowID);
        useEffect(() => {
            if (filteredComponents) {
                const intervalId = setInterval(ListAllComponentRefetch, 1000); // Refresh every 1 seconds
                return () => clearInterval(intervalId); // Cleanup the interval on component unmount or 'order' change
            }
        }, [filteredComponents, ListAllComponentRefetch]);

        console.log(filteredComponents);
        return (
            <Container>
                <Table striped hover responsive className='table-auto'>
                    <thead>
                        <tr>
                            <th>Tên thành phần</th>
                            <th>Số lượng</th>
                            <th>Chất liệu</th>
                            <th>Màu sắc</th>
                            <th>Mô tả</th>
                            <th>Trạng thái</th>

                        </tr>
                    </thead>
                    <tbody>
                        {filteredComponents?.map((component, index) => (
                            <tr key={index}>
                                <td>{component?.name}</td>
                                <td>{component?.quantity}</td>
                                <td>{component?.material}</td>
                                <td>{component?.color}</td>
                                <td>{component?.description}</td>
                                <td>{component?.isReplacable && component?.isReplacable === 1 ? "Thay đổi" : component?.isReplacable === 0 ? "Cố định" : ""}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Container>
        );
    };


    const MySelectComponent = ({ selectedRowID }) => {
        const [quantity, setQuantity] = useState(0);
        const [componentId, setComponentId] = useState('');

        const { data: getListComponentCreatedBySystem } = useGetListComponentCreatedBySystemQuery();

        const [addComponentIntoProduct] = useAddComponentIntoProductMutation();

        const submitComponent = async (e) => {
            e.preventDefault();
            try {
                await addComponentIntoProduct({
                    componentId,
                    productId: selectedRowID,
                    quantity,
                }).unwrap();
                toast.success('thành công');
            } catch (err) {
                toast.error("ERRORR");
            }
        };

        console.log(selectedRowID);

        return (
            <Container>
                <Form onSubmit={submitComponent}>
                    <Form.Group controlId='price' className='mb-4 mt-3'>
                        <Form.Label>Số lượng</Form.Label>
                        <Form.Control
                            type='number'
                            placeholder='Nhập số lượng'
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                        ></Form.Control>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Lựa chọn : </Form.Label>
                        {getListComponentCreatedBySystem ? (
                            <Select value={componentId} onChange={(e) => setComponentId(e.target.value)}>
                                {getListComponentCreatedBySystem.map((components) => (
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
                                    {getListComponentCreatedBySystem && getListComponentCreatedBySystem
                                        .filter((data) => data.componentId === componentId) // Filter the data based on the selected option
                                        .map((data, index) => (
                                            <tr key={index}>
                                                <td>Tên: {data.name}</td>
                                                <td>Màu sắc: {data.color}</td>
                                                <td>Chất liệu: {data.material}</td>
                                                <td>Mô tả: {data.description}</td>
                                                <td>Trạng thái: {data?.isReplacable && data?.isReplacable === 1 ? "Thay đổi" : data?.isReplacable === 0 ? "Cố định" : ""}</td>
                                                <td></td>
                                            </tr>
                                        ))}
                                </tbody>
                            </Table>
                        )}
                    </Form.Group>
                    <Col className='text-end'>
                        <Button
                            type='submit'
                            variant='primary'
                        >
                            Tạo
                        </Button>
                    </Col>              
                </Form>
            </Container>
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
                                        <TableComponent selectedRowID={selectedRow.productId} />
                                    </Row>

                                    <p>▻ Thêm thành phần:</p> <MySelectComponent selectedRowID={selectedRow.productId} />

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
                </>
            )}
        </Container>
    );
};
export default ProductListScreen
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
    useGetListComponentCreatedBySystemQuery,
    useAddComponentIntoProductMutation,
    useGetListAllComponentQuery,
    useAddProductAutomaticMutation,
    useAddComponentIntoProductCreatingMutation,
    useGetListComponentOfProductCreatingQuery,
    useDeleteComponentOfProductMutation,
    useDeleteAllComponentOfProductOfAdminMutation,
    useAddProductQuantityMutation,
    useGetProductDetailsQuery,
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
import { BlockPicker } from 'react-color';
import { AddBox, ExitToAppTwoTone } from '@mui/icons-material';



const VISIBLE_FIELDS = ['productId', 'name', 'imagePath1', 'price', 'uploadDate', 'quantity'];

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

    function formatCurrency(number) {
        // Sử dụng hàm toLocaleString() để định dạng số thành chuỗi với ngăn cách hàng nghìn và mặc định là USD.
        return number.toLocaleString('en-US', {
            style: 'currency',
            currency: 'VND',
        });
    }

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
                        // case 'status':
                        //     headerName = 'Trạng thái';
                        //     break;
                        default:
                            headerName = '';
                    }
                    return {
                        field,
                        headerName,
                        width: 230,
                        sortable: true,
                        filterable: true,
                        // valueGetter: (params) =>
                        //     field === 'status' ? (params.row.status === 1 ? "Cố định" : "Không cố định") : params.value,
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
        window.location.reload();
    }


    const [deleteProduct, { isLoading: loadingDelete }] =
        useDeleteProductMutation();

    const deleteHandler = async (productId) => {
        if (window.confirm('Bạn muốn xóa ?')) {
            try {
                await deleteProduct(productId);
                handleCloseDialog()
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
                handleCancel()
                refetch();
            } catch (err) {
                toast.error(err?.data?.message || err.error);
            }
        }
    };

    const [isModalOpen, setIsModalOpen] = useState(false);

    const [addProductAutomatic] = useAddProductAutomaticMutation({
        refetchInterval: 1000, // Set the interval in milliseconds (e.g., every 5 seconds)
        enabled: true, // Enable the automatic refetch
    })

    const showModal = async () => {
        try {
            const res = await addProductAutomatic();
            setIsModalOpen(true);
        } catch (err) {
            // Handle error
        }

    };

    const [deleteAllComponentOfProductOfAdmin] = useDeleteAllComponentOfProductOfAdminMutation();

    const handleCancel = async () => {
        try {
            const res = await deleteAllComponentOfProductOfAdmin();
            setIsModalOpen(false);
        } catch (err) {
            // Handle error
        }
    };

    const deleteAllComponent = async () => {
        if (window.confirm('Bạn muốn xóa tât cả ?')) {
            try {
                await deleteAllComponentOfProductOfAdmin();
                toast.success('Xóa thành công');
            } catch (err) {
                toast.error(err?.data?.message || err.error);
            }
        }
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
            toast.error('Hãy thêm ảnh');
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
                postData('/Product/Add-Product-Promax', post)
                    .then((data) => {
                        console.log(data);
                        setIsModalOpen(false);
                        setDisabled(false)
                        toast.success('Sản phẩm đã được tạo thành công');
                        window.location.reload();
                    })
                    .catch((err) => {
                        toast.error('Tạo sản phẩm thất bại');
                        console.error("Error fetching items:", error);
                        setDisabled(false)
                    });

            })
            .catch((error) => {
                toast.error('Hãy thêm ảnh');
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

        const [deleteComponentOfProduct] = useDeleteComponentOfProductMutation();

        const deleteHandlerComponent = async (productDetailId) => {
            if (window.confirm('Bạn có muốn xóa ?')) {
                try {
                    await deleteComponentOfProduct(productDetailId);
                    toast.success('Xóa thành công');
                } catch (err) {
                    toast.error("Sản phẩm này đã có khách hàng mua nên không thể thay đổi");
                }
            }
        };
        return (
            <Container>
                {(filteredComponents?.length === 0 || filteredComponents === undefined) ? (
                    <Message>
                        Các thành phần của sản phẩm hiện đang trống
                    </Message>
                ) : (
                    <Table striped hover responsive className='table-auto'>
                        <thead>
                            <tr>
                                <th>Tên thành phần</th>
                                <th>Số lượng</th>
                                <th>Chất liệu</th>
                                <th>Màu sắc</th>
                                <th>Mô tả</th>
                                <th>Trạng thái</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredComponents?.map((component, index) => (
                                <tr key={index}>
                                    <td>{component?.name}</td>
                                    <td>{component?.quantity}</td>
                                    <td>{component?.material}</td>
                                    <td><div style={{
                                        marginLeft: '50px',
                                        backgroundColor: `${component.color}`,
                                        width: 50,
                                        height: 28,
                                    }}></div> </td>
                                    <td>{component?.description}</td>
                                    <td>{component?.isReplacable && component?.isReplacable === 1 ? "Thay đổi" : component?.isReplacable === 0 ? "Cố định" : ""}</td>
                                    <td>
                                        <Col md={2}>
                                            <Button
                                                style={{ color: '' }}
                                                type='button'
                                                variant='danger'
                                                onClick={() => deleteHandlerComponent(component.productDetailId)}
                                            >
                                                <FaTrash style={{ color: 'white' }} />
                                            </Button>
                                        </Col></td>
                                </tr>
                            ))}
                        </tbody>

                    </Table>
                )}
            </Container>
        );
    };

    const AddQuantity = ({ selectedRowID }) => {
        const [quantity, setQuantity] = useState(0);
        const [addProductQuantity] = useAddProductQuantityMutation();
        const {
            data: product,
        } = useGetProductDetailsQuery(selectedRowID);
        const submitHandler = async (e) => {
            e.preventDefault();
            try {
                await addProductQuantity({
                    productId: selectedRowID,
                    quantity,
                }).unwrap(); // NOTE: here we need to unwrap the Promise to catch any rejection in our catch block
                toast.success('Sản phẩm đã cập nhập thành công');
            } catch (err) {
                toast.error("Sản phẩm này đã có khách hàng mua nên không thể thay đổi");
            }
        };

        useEffect(() => {
            if (product) {
                setQuantity(product.quantity);
            }
        }, [product]);



        return (
            <Container>
                <Form onSubmit={submitHandler}>
                    <Row >
                        <Col >
                            <Form.Group controlId='quantity'>
                                <Form.Label>Số lượng sản phẩm</Form.Label>
                                <Form.Control
                                    type='number'
                                    placeholder='Enter quantity'
                                    min={1}
                                    value={quantity}
                                    onChange={(e) => setQuantity(e.target.value)}
                                ></Form.Control>
                            </Form.Group>
                        </Col>
                        <Col className='mt-4'>
                            <Button
                                type='submit'
                                variant='light'                               
                            >
                                <AddBox /> Thêm
                            </Button>
                        </Col>
                    </Row>
                </Form>
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
                toast.success('Thành công');
            } catch (err) {
                toast.error("Sản phẩm này đã có khách hàng mua nên không thể thay đổi");
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
                            min={1}
                            onChange={(e) => setQuantity(e.target.value)}
                        ></Form.Control>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Lựa chọn : </Form.Label>
                        {getListComponentCreatedBySystem ? (
                            <Select value={componentId} onChange={(e) => setComponentId(e.target.value)}>
                                {getListComponentCreatedBySystem.map((components) => (
                                    <MenuItem key={components.componentId} value={components.componentId} >
                                        {/* {components.name} - Chất liệu: {components.material} - Màu: <div style={{
                                            marginLeft: '10px',
                                            backgroundColor: `${components.color}`,
                                            width: 28,
                                            height: 28,
                                            display: 'flex'
                                        }}></div>    */}
                                        <div style={{ display: 'flex' }}>
                                            <div style={{ marginLeft: '5px' }}> {components.name} </div>
                                            <div style={{ marginLeft: '20px' }}>- Chất liệu: {components.material}</div>
                                            <div style={{ display: 'flex', marginLeft: '20px' }}>- Màu: <div style={{
                                                marginLeft: '10px',
                                                backgroundColor: `${components.color}`,
                                                width: 28,
                                                height: 20,
                                            }}></div></div>
                                        </div>
                                    </MenuItem>
                                ))}
                            </Select>
                        ) : (
                            <p>Trống...</p>
                        )}

                        {isLoading ? (
                            <Loader />
                        ) : error ? (
                            <Message variant='danger'>
                                {error?.data?.message || error.error}
                            </Message>
                        ) : (
                            <Table className='mt-2'>
                                <tbody>
                                    {getListComponentCreatedBySystem && getListComponentCreatedBySystem
                                        .filter((data) => data.componentId === componentId) // Filter the data based on the selected option
                                        .map((data, index) => (
                                            <tr key={index}>
                                                {/* <td>Tên: {data.name}</td>
                                                <td style={{ display: 'flex' }}>Màu sắc: <div style={{
                                                    marginLeft: '5px',
                                                    backgroundColor: `${data.color}`,
                                                    width: 50,
                                                    height: 30,
                                                }}></div></td>
                                                <td>Chất liệu: <>{data.material}</></td> */}
                                                <td>Mô tả: <>{data.description}</></td>
                                                <td>Trạng thái: <>{data?.isReplacable && data?.isReplacable === 1 ? "Thay đổi" : data?.isReplacable === 0 ? "Cố định" : ""}</></td>
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

    const TableComponentInAddProduct = () => {

        const { data: getListComponentOfProductCreating, refetch } = useGetListComponentOfProductCreatingQuery();
        useEffect(() => {
            if (getListComponentOfProductCreating) {
                const intervalId = setInterval(refetch, 1000); // Refresh every 1 seconds
                return () => clearInterval(intervalId); // Cleanup the interval on component unmount or 'order' change
            }
        }, [getListComponentOfProductCreating, refetch]);

        const [deleteComponentOfProduct] = useDeleteComponentOfProductMutation();

        const deleteHandlerComponent = async (productDetailId) => {
            if (window.confirm('Bạn có muốn xóa ?')) {
                try {
                    await deleteComponentOfProduct(productDetailId);
                    toast.success('Xóa thành công');
                } catch (err) {
                    toast.error(err?.data?.message || err.error);
                }
            }
        };

        return (
            <Container>
                {(getListComponentOfProductCreating?.length === 0 || getListComponentOfProductCreating === undefined) ? (
                    <Message>
                        Các thành phần của sản phẩm hiện đang trống
                    </Message>
                ) : (
                    <>
                        <Button
                            style={{ justifyContent: 'end' }}
                            className='mb-2 mt-2'
                            type='button'
                            variant='secondary'
                            onClick={() => deleteAllComponent()}
                        >
                            <FaTrash /> Xóa tất cả thành phần
                        </Button>
                        <Table striped hover responsive className='table-auto'>
                            <thead>
                                <tr>
                                    <th>Tên thành phần</th>
                                    <th>Số lượng</th>
                                    <th>Chất liệu</th>
                                    <th>Màu sắc</th>
                                    <th>Mô tả</th>
                                    <th>Trạng thái</th>
                                    <th></th>
                                </tr>
                            </thead>

                            <tbody>
                                {getListComponentOfProductCreating?.map((component, index) => (
                                    <tr key={index}>
                                        <td>{component?.name}</td>
                                        <td>{component?.quantity}</td>
                                        <td>{component?.material}</td>
                                        <td><div style={{
                                            marginLeft: '140px',
                                            backgroundColor: `${component.color}`,
                                            width: 50,
                                            height: 28,
                                        }}></div> </td>
                                        <td>{component?.description}</td>
                                        <td>{component?.isReplacable && component?.isReplacable === 1 ? "Thay đổi" : component?.isReplacable === 0 ? "Cố định" : ""}</td>
                                        <td>
                                            <Col md={2}>
                                                <Button
                                                    style={{ color: '' }}
                                                    type='button'
                                                    variant='danger'
                                                    onClick={() => deleteHandlerComponent(component.productDetailId)}
                                                >
                                                    <FaTrash style={{ color: 'white' }} />
                                                </Button>
                                            </Col>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </>
                )}
            </Container>
        );
    };

    const MySelectComponentInAddProduct = () => {
        const [quantity, setQuantity] = useState(0);
        const [componentId, setComponentId] = useState('');

        const { data: getListComponentCreatedBySystem } = useGetListComponentCreatedBySystemQuery();

        const [addComponentIntoProductCreating] = useAddComponentIntoProductCreatingMutation();

        const submitComponent = async (e) => {
            e.preventDefault();
            try {
                await addComponentIntoProductCreating({
                    componentId,
                    quantity,
                }).unwrap();
                toast.success('Thành công');
            } catch (err) {
                toast.error("Hãy chọn thành phần để thêm");
            }
        };

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
                                    <MenuItem key={components.componentId} value={components.componentId} >
                                        <div style={{ display: 'flex' }}>
                                            <div style={{ marginLeft: '5px' }}> {components.name} </div>
                                            <div style={{ marginLeft: '20px' }}>- Chất liệu: {components.material}</div>
                                            <div style={{ display: 'flex', marginLeft: '20px' }}>- Màu: <div style={{
                                                marginLeft: '10px',
                                                backgroundColor: `${components.color}`,
                                                width: 28,
                                                height: 20,
                                            }}></div></div>
                                        </div>
                                    </MenuItem>
                                ))}
                            </Select>
                        ) : (
                            <p>Trống...</p>
                        )}

                        {isLoading ? (
                            <Loader />
                        ) : error ? (
                            <Message variant='danger'>
                                {error?.data?.message || error.error}
                            </Message>
                        ) : (
                            <Table className='mt-2'>
                                <tbody>
                                    {getListComponentCreatedBySystem && getListComponentCreatedBySystem
                                        .filter((data) => data.componentId === componentId) // Filter the data based on the selected option
                                        .map((data, index) => (
                                            <tr key={index}>
                                                {/* <td>Tên: {data.name}</td>
                                                <td style={{ display: 'flex' }}>Màu: <div style={{
                                                    marginLeft: '5px',
                                                    backgroundColor: `${data.color}`,
                                                    width: 50,
                                                    height: 30,
                                                }}></div></td>
                                                <td>Chất liệu: <>{data.material}</></td> */}
                                                <td>Mô tả: <>{data.description}</></td>
                                                <td>Trạng thái: <>{data?.isReplacable && data?.isReplacable === 1 ? "Thay đổi" : data?.isReplacable === 0 ? "Cố định" : ""}</></td>
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
                            variant='light'
                        >
                            <AddBox /> Thêm thành phần
                        </Button>
                    </Col>
                </Form>
            </Container>
        );
    };



    const [material, setMaterial] = useState('');
    const [name, setName] = useState('');
    const [description, setDescription] = useState('không');
    const [color, setColor] = useState('#555555');
    const [isReplacable, setIsReplacable] = useState('');
    const [showPicker, setShowPicker] = React.useState(false);

    const [addComponent, { isLoading: loadingaddComponent }] = useAddComponentMutation();

    const handleTogglePicker = () => {
        setShowPicker(!showPicker);
    };
    const handleChangeColor = (selectedColor) => {
        setColor(selectedColor.hex);
    };


    const submitHandler = async (e) => {
        e.preventDefault();
        try {

            const res = await addComponent({
                material,
                name,
                description,
                color: encodeURI(color),
                isReplacable,
            }).unwrap();
            setIsModalOpen2(false);
            toast.success("Tạo thành công");
            window.location.reload();
        } catch (err) {
            toast.error("đã tồn tại");

        }
    };

    return (
        <Container >
            <Row className='align-items-center'>
                <Col>
                    <h1>Quản lí sản phẩm</h1>
                </Col>

                <Col className='text-end'>
                    <Button className='my-3' onClick={showModal} >
                        <FaPlus />Tạo sản phẩm
                    </Button>

                    <Button className='mx-3' onClick={showModal2}>
                        <FaPlus />Thêm thành phần
                    </Button>
                </Col>
            </Row>

            {/* <Modal
                title={
                    <Col>
                        <h1>Tạo sản phẩm</h1>
                    </Col>
                }
                // okType="primary text-black border-gray-700"
                open={isModalOpen}
                
                width={1800}
                style={{ top: 10 }}

                onCancel={handleCancel}

                footer={[
                ]}
            >

                
                
            </Modal> */}

            <Dialog maxWidth='lg' open={isModalOpen} onClose={handleCancel}>
                <DialogTitle><h1>Tạo sản phẩm</h1></DialogTitle>
                <DialogContent>
                    <Row>
                        <Col md={6}>
                            <FormProvider {...methods} >
                                <Form >
                                    <Row>
                                        <Col md={6}>
                                            <div className=' overflow-y-auto p-4'>
                                                <Form.Group className='mx-auto  max-w-xl mb-3'>
                                                    <Form.Label>Tên sản phẩm<span style={{ color: 'red' }}>*</span></Form.Label>
                                                    <ComInput
                                                        type="text"
                                                        // label={textApp.CreateProduct.label.name}
                                                        placeholder={textApp.CreateProduct.placeholder.name}
                                                        {...register("name")}
                                                        autoComplete="off"
                                                        required
                                                    />

                                                </Form.Group>

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
                                                <div className='mx-auto mt-4 max-w-xl mb-3'>
                                                    {textApp.CreateProduct.label.imagePath}<span style={{ color: 'red' }}>*</span>
                                                    <ComUpImg
                                                        onChange={onChange}
                                                    />
                                                </div>

                                            </div>
                                        </Col>
                                        <Col md={5} style={{ marginLeft: 15 }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', }}>
                                                <Form.Group className=' mt-4 sm:mt-8'>
                                                    <Form.Label>Giá tiền<span style={{ color: 'red' }}>*</span></Form.Label>
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


                                                <Form.Group className='mx-auto mt-4 max-w-xl sm:mt-8' >
                                                    <Form.Label style={{ marginLeft: 20 }}>Số lượng</Form.Label>
                                                    <ComNumber
                                                        style={{ marginLeft: 20 }}
                                                        placeholder={textApp.CreateProduct.placeholder.quantity}
                                                        type="numbers"
                                                        min={1}
                                                        {...register("quantity")}
                                                        required
                                                    />

                                                </Form.Group>
                                            </div>
                                            <Form.Group className='mx-auto mt-3 max-w-xl mb-3'>
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
                                            </Form.Group>
                                            <Form.Group className='mx-auto mt-3 max-w-xl mb-3'>

                                            </Form.Group>
                                        </Col>


                                    </Row>
                                    <Col className='text-end'>
                                        {/* <Button
                                    disabled={disabled}
                                    htmlType="submit"
                                    type="primary"

                                >
                                    {textApp.common.button.createProduct}
                                </Button> */}
                                    </Col>
                                </Form>
                            </FormProvider>
                        </Col>
                        <Col md={6} >
                            <p className="mx-auto mt-4 max-w-xl sm:mt-8">▻ Thêm thành phần:</p> <MySelectComponentInAddProduct />
                        </Col>
                        <Col >
                            <TableComponentInAddProduct />
                        </Col>
                    </Row>
                </DialogContent>
                <DialogActions>
                    <Button variant='light' onClick={handleCancel}> <ExitToAppTwoTone />Thoát</Button>
                    <Button onClick={handleSubmit(onSubmit)} disabled={disabled}> Tạo sản phẩm</Button>
                </DialogActions>
            </Dialog>

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
                                {/* <Form.Control
                                    type='name'
                                    placeholder='Enter name'
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                ></Form.Control> */}
                                <Select
                                    value={name}
                                    onChange={(event) => setName(event.target.value)}
                                    displayEmpty
                                    style={{
                                        width: 350,
                                    }}
                                >
                                    <MenuItem value="" disabled>
                                        Chọn
                                    </MenuItem>
                                    <MenuItem value="Cửa">Cửa</MenuItem>
                                    <MenuItem value="Đáy">Đáy</MenuItem>
                                    <MenuItem value="Khung">Khung</MenuItem>
                                    <MenuItem value="Khay đựng">Khay đựng</MenuItem>
                                    <MenuItem value="Móc treo">Móc treo</MenuItem>
                                </Select>
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
                            <Dialog maxWidth='md' fullWidth={true} open={Boolean(selectedRow)} onClose={handleCloseDialog} >

                                <DialogContent >
                                    <Row>
                                        <Col md={6}>
                                            <Image src={selectedRow.imagePath1} alt={selectedRow.name} fluid />
                                            <ListGroup variant='flush'>
                                                <ListGroup.Item>
                                                    <AddQuantity selectedRowID={selectedRow.productId} />
                                                </ListGroup.Item>
                                            </ListGroup>
                                        </Col>
                                        <Col md={6}>
                                            <DialogTitle>{selectedRow.name}</DialogTitle>
                                            <ListGroup variant='flush'>
                                                <ListGroup.Item>
                                                    <Rating
                                                        value={selectedRow.ratingAverage}
                                                        text={`${selectedRow.feedBackQuantity && selectedRow.feedBackQuantity > 0 ? selectedRow.feedBackQuantity : '0'} đánh giá`}
                                                    />
                                                </ListGroup.Item>
                                                <ListGroup.Item>Giá: {formatCurrency(selectedRow.price)}</ListGroup.Item>
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
                                                    NSX: {new Date(selectedRow.uploadDate).toLocaleDateString('en-GB')}
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
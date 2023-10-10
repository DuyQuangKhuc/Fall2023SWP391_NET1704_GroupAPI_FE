/* eslint-disable react/jsx-no-duplicate-props */
import { LinkContainer } from 'react-router-bootstrap';
import { Table, Row, Col, ListGroup, Image, Button, Container } from 'react-bootstrap';
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
import { Dropdown, Menu, Typography } from 'antd';
import { DeleteForeverTwoTone, EditNoteTwoTone } from '@mui/icons-material';
import Box from '@mui/material/Box';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { useDemoData } from '@mui/x-data-grid-generator';
import React from 'react';
import { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions  } from '@material-ui/core';
import Rating from '../../components/Rating';
import ProductEditScreen from './ProductEditScreen';


const VISIBLE_FIELDS = ['productId', 'name', 'imagePath1', 'price', 'uploadDate', 'quantity', 'status'];

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

    const deleteHandler = async (id) => {
        if (window.confirm('Are you sure')) {
            try {
                await deleteProduct(id);
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



    console.log(data)
    return (
        <Container >
            <Row className='align-items-center'>
                <Col>
                    <h1>Products</h1>
                </Col>
                <Col className='text-end'>
                    <Button className='my-3' onClick={createProductHandler}>
                        <FaPlus /> Create Product
                    </Button>
                </Col>
            </Row>

            {loadingCreate && <Loader />}
            {loadingDelete && <Loader />}
            {isLoading ? (
                <Loader />
            ) : error ? (
                <Message variant='danger'>{error.data.message}</Message>
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
import { LinkContainer } from 'react-router-bootstrap';
import { Table, Button, Container, Col, ButtonGroup } from 'react-bootstrap';
import { FaCheck, FaPlus, FaRegEdit, FaTimes, FaWindowMinimize } from 'react-icons/fa';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import { useGetListOrderDetailCloneQuery, useGetListOrderQuery, useGetListProductOnlyUserQuery } from '../../slices/ordersApiSlice';
import React from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { useState } from 'react';
import { Collapse, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from '@material-ui/core';

import { useAcceptProductOfUserFromAdminMutation, useAcceptProductOfUserMutation, useCancelProductOfUserMutation, useGetListAllComponentQuery, useListProductOnlyUserHaveReasonQuery } from '../../slices/productsApiSlice';
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import { Tabs } from 'antd';
import TabPane from 'antd/es/tabs/TabPane';
import { Link } from 'react-router-dom';



const OrderListScreen = () => {
    const [value, setValue] = React.useState('1');
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    const { data: getListProductOnlyUser, refetch } = useGetListProductOnlyUserQuery();
    useEffect(() => {
        if (getListProductOnlyUser) {
            const intervalId = setInterval(refetch, 1000); // Refresh every 1 seconds
            return () => clearInterval(intervalId); // Cleanup the interval on component unmount or 'order' change
        }
    }, [getListProductOnlyUser, refetch]);

    const filteredListProductOnlyUser = getListProductOnlyUser?.filter(component => component.isDeleted === 0);

    const filteredListProductOnlyUser1 = getListProductOnlyUser?.filter(component => component.isDeleted === 1);

    const filteredListProductOnlyUser2 = getListProductOnlyUser?.filter(component => component.isDeleted === 2);

    const filteredListProductOnlyUser3 = getListProductOnlyUser?.filter(component => component.isDeleted === 3);

    const filteredListProductOnlyUser4 = getListProductOnlyUser?.filter(component => component.isDeleted === 4);

    //const filteredListProductOnlyUser5 = getListProductOnlyUser?.filter(component => component.isDeleted === 5);

    const { data: listProductOnlyUserHaveReason, refetch: listProductOnlyUserHaveReasonRefetch } = useListProductOnlyUserHaveReasonQuery();
    useEffect(() => {
        if (listProductOnlyUserHaveReason) {
            const intervalId = setInterval(listProductOnlyUserHaveReasonRefetch, 1000); // Refresh every 1 seconds
            return () => clearInterval(intervalId); // Cleanup the interval on component unmount or 'order' change
        }
    }, [listProductOnlyUserHaveReason, listProductOnlyUserHaveReasonRefetch]);


    const isDeletedMapping = {
        0: "Đang chờ duyệt",
        1: "Đang chờ phản hồi của khách hàng",
        2: "Đang chờ chấp thuận",
        3: "Chưa thanh toán",
        4: "Đã bán",
        5: "Đã hủy"
    };

    const isMapping = {
        1: "Đã bán",
        4: "Đã hủy"
    };

    const getTabColor = (status) => {
        switch (status) {
            case 0: // Đang chờ duyệt
                return '#941313';
            case 1: // Đang chờ phản hồi của khách hàng
                return '#d1bd26';
            case 2: // 
                return '#941313';
            case 3: // 
                return '#cc8d21';
            case 4: // Đã hoàn thành
                return 'green';
            case 5: // Đã hủy
                return '#9c9583';
            default:
                return 'default';
        }
    };

    const getTabColor1 = (status) => {
        switch (status) {
            case 1: // Đã hoàn thành
                return 'green';
            case 4: // Đã hủy
                return '#9c9583';
            default:
                return 'default';
        }
    };

    function formatCurrency(number) {
        // Sử dụng hàm toLocaleString() để định dạng số thành chuỗi với ngăn cách hàng nghìn và mặc định là USD.
        return number?.toLocaleString('en-US', {
            style: 'currency',
            currency: 'VND',
        });
    }

    const [open, setOpen] = React.useState(false);

    const handleClickOpen = (productId) => {
        setProductId(productId)
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };
    //-----------------------------đang chờ duyệt
    const [price, setPrice] = useState('');
    const [productId, setProductId] = useState('');

    const [acceptProductOfUserFromAdmin] = useAcceptProductOfUserFromAdminMutation();

    const submitHandler1 = async () => {
        try {
            const res = await acceptProductOfUserFromAdmin({
                productId: productId,
                price,
            }).unwrap();
            toast.success('thành công');
            handleClose()
        } catch (err) {
            toast.error("Hãy nhập giá");
        }

    };

    const [acceptProductOfUser] = useAcceptProductOfUserMutation();

    const submitHandler3 = async (productId) => {
        try {
            const res = await acceptProductOfUser({
                productId: productId,
            }).unwrap();
            toast.success('thành công');
        } catch (err) {
            toast.error("thất bại");
        }

    };

    const [open2, setOpen2] = React.useState(false);
    const handleClickOpen2 = (productId) => {
        setProductId(productId)
        setOpen2(true);
    };

    const handleClose2 = () => {
        setOpen2(false);
    };
    const [cancelProductOfUser] = useCancelProductOfUserMutation();
    const [reason, setReason] = useState('');
    const submitHandler2 = async () => {
        if (window.confirm('Bạn có chắc muốn hủy đơn hàng?')) {
            try {
                const res = await cancelProductOfUser({
                    productId: productId,
                    reason,
                }).unwrap();
                console.log(productId);
                toast.success('Hủy thành công');
                handleClose2()
            } catch (err) {
                toast.error("Nhập lí do");
            }
        }
    };

    const { data: getListAllComponent, refetch: getListAllComponentRefetch } = useGetListAllComponentQuery();
    useEffect(() => {
        if (getListAllComponent) {
            const intervalId = setInterval(getListAllComponentRefetch, 1000); // Refresh every 1 seconds
            return () => clearInterval(intervalId); // Cleanup the interval on component unmount or 'order' change
        }
    }, [getListAllComponent, getListAllComponentRefetch]);
    // Define useState hook to track the expanded rows
    const [expandedRows, setExpandedRows] = useState([]);

    const isRowExpanded = (productId) => {
        return expandedRows.includes(productId);
    };

    const toggleRow = (productId) => {
        const isCurrentlyExpanded = isRowExpanded(productId);
        const newExpandedRows = isCurrentlyExpanded
            ? expandedRows.filter(rowId => rowId !== productId)
            : [...expandedRows, productId];
        setExpandedRows(newExpandedRows);
    };

    const { data: getListOrder, refetch: getListOrdersRefetch } = useGetListOrderQuery();
    useEffect(() => {
        if (getListOrder) {
            const intervalId = setInterval(getListOrdersRefetch, 1000); // Refresh every 1 seconds
            return () => clearInterval(intervalId); // Cleanup the interval on component unmount or 'order' change
        }
    }, [getListOrder, getListOrdersRefetch]);

    const { data: getListOrderDetailClone, refetch: getListOrderDetailCloneRefetch } = useGetListOrderDetailCloneQuery();
    useEffect(() => {
        if (getListOrderDetailClone) {
            const intervalId = setInterval(getListOrderDetailCloneRefetch, 1000); // Refresh every 1 seconds
            return () => clearInterval(intervalId); // Cleanup the interval on component unmount or 'order' change
        }
    }, [getListOrderDetailClone, getListOrderDetailCloneRefetch]);

    return (
        <Container className='mt-3'>
            <Tabs defaultActiveKey='1'>
                <TabPane tab=<h1>Đơn hàng</h1> key='1'>
                    <Box sx={{ width: '100%', typography: 'body1' }}>
                        <TabContext value={value}>
                            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                <TabList onChange={handleChange} aria-label="tabs">
                                    <Tab label="Chờ duyệt" value="1" />
                                    <Tab label="Chờ phản hồi" value="2" />
                                    <Tab label="Xét duyệt lại giá khách hàng đưa ra" value="3" />
                                    <Tab label="Đơn hàng chưa thanh toán" value="4" />
                                    <Tab label="Đã hoàn thành" value="5" />
                                    <Tab label="Đã hủy" value="6" />
                                </TabList>
                            </Box>
                            <TabPanel value="1">
                                <TableContainer>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell></TableCell>
                                                <TableCell>Mã đơn hàng</TableCell>
                                                <TableCell>ID Tài khoản đặt hàng</TableCell>
                                                <TableCell>Ảnh</TableCell>
                                                <TableCell>Mô tả</TableCell>
                                                <TableCell>Ngày đặt hàng</TableCell>
                                                <TableCell>Trạng thái</TableCell>
                                                <TableCell></TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {filteredListProductOnlyUser?.map((row) => (
                                                <>
                                                    <TableRow hover role="checkbox" tabIndex={-1} key={row.productId}>
                                                        <TableCell>
                                                            <ButtonGroup aria-label="expand row"
                                                                size="small" onClick={() => toggleRow(row?.productId)}>
                                                                {isRowExpanded(row?.productId) ? <FaWindowMinimize /> : <FaPlus />}
                                                            </ButtonGroup>
                                                        </TableCell>
                                                        <TableCell>{row.productId}</TableCell>
                                                        <TableCell>{row.name}</TableCell>
                                                        <TableCell className='align-middle'><img src={row?.imagePath1} alt={row?.imagePath1} style={{ width: '50px', height: '50px' }} /></TableCell>
                                                        <TableCell><div style={{ padding: '5px', borderRadius: '5px' }}>{row?.description}</div></TableCell>
                                                        <TableCell>{new Date(row.uploadDate).toLocaleDateString('en-GB')}</TableCell>
                                                        <TableCell >
                                                            <div style={{ backgroundColor: getTabColor(row.isDeleted), padding: '5px', color: '#fff', borderRadius: '5px', width: 'fit-content' }}>
                                                                {isDeletedMapping[row.isDeleted]}
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>

                                                            <Button variant='outline-success' className='mx-2' onClick={() => handleClickOpen(row.productId)} >
                                                                <FaCheck style={{ color: 'green' }} />
                                                            </Button>

                                                            <Dialog open={open} onClose={handleClose}>
                                                                <DialogTitle>Gửi hóa đơn đến khách hàng</DialogTitle>
                                                                <DialogContent>
                                                                    <DialogContentText>
                                                                        Gửi số tiền yêu cầu mà khách hàng cần thanh toán
                                                                    </DialogContentText>
                                                                    <TextField
                                                                        autoFocus
                                                                        margin="dense"
                                                                        id="number"
                                                                        label="Nhập số tiền"
                                                                        type="number"
                                                                        fullWidth
                                                                        value={price}
                                                                        onChange={(e) => setPrice(e.target.value)}
                                                                    />
                                                                </DialogContent>
                                                                <DialogActions>
                                                                    <Button onClick={handleClose}>Thoát</Button>
                                                                    <Button onClick={() => submitHandler1(row.productId)}>Gửi hóa đơn</Button>
                                                                </DialogActions>
                                                            </Dialog>

                                                            <Button
                                                                variant="outline-danger"
                                                                className='mx-1'
                                                                //onClick={() => submitHandler2(order.productId)}
                                                                onClick={() => handleClickOpen2(row.productId)}
                                                            >
                                                                <FaTimes style={{ color: '' }} />
                                                            </Button>

                                                            <Dialog open={open2} onClose={handleClose2}>
                                                                <DialogTitle>Lí do hủy đơn</DialogTitle>
                                                                <DialogContent>
                                                                    <DialogContentText>
                                                                        Hãy đưa ra lí do vì sao hủy đơn
                                                                    </DialogContentText>
                                                                    <TextField
                                                                        autoFocus
                                                                        margin="dense"
                                                                        id="textarea"
                                                                        label="Nhập lí do"
                                                                        type="textarea"
                                                                        fullWidth
                                                                        value={reason}
                                                                        onChange={(e) => setReason(e.target.value)}
                                                                    />
                                                                </DialogContent>
                                                                <DialogActions>
                                                                    <Button onClick={handleClose2} variant='light'>Thoát</Button>
                                                                    <Button onClick={(e) => submitHandler2(e, row.productId)}>Gửi</Button>
                                                                </DialogActions>
                                                            </Dialog>

                                                        </TableCell>

                                                    </TableRow>
                                                    <TableRow>
                                                        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                                                            <Collapse in={isRowExpanded(row?.productId)} timeout="auto" unmountOnExit>
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
                                                                            </TableRow>
                                                                        </TableHead>
                                                                        <TableBody>
                                                                            {getListAllComponent?.filter((component) => component.productId === row?.productId)?.map((component, index) => (
                                                                                <TableRow key={index}>
                                                                                    <TableCell>{component.name}</TableCell>
                                                                                    <TableCell>{component.material}</TableCell>
                                                                                    <TableCell>{component.quantity}</TableCell>
                                                                                    <TableCell>
                                                                                        <div style={{
                                                                                            backgroundColor: `${component.color}`,
                                                                                            width: 90,
                                                                                            height: 28,
                                                                                            borderRadius: '5px',
                                                                                            padding: '5px',
                                                                                        }}></div>
                                                                                    </TableCell>
                                                                                    <TableCell>{component.description}</TableCell>
                                                                                    <TableCell>{component?.isReplacable && component?.isReplacable === 1 ? "Tháo rời" : component?.isReplacable === 0 ? "Cố định" : ""}</TableCell>
                                                                                </TableRow>
                                                                            ))
                                                                            }
                                                                        </TableBody>
                                                                    </table>
                                                                </Box>

                                                            </Collapse>
                                                        </TableCell>
                                                    </TableRow>
                                                </>
                                            ))}

                                        </TableBody>
                                    </Table>

                                </TableContainer>

                            </TabPanel>

                            <TabPanel value="2">
                                <TableContainer>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell></TableCell>
                                                <TableCell>Mã đơn hàng</TableCell>
                                                <TableCell>ID Tài khoản đặt hàng</TableCell>
                                                <TableCell>Ảnh</TableCell>
                                                <TableCell>Tổng số tiền</TableCell>
                                                <TableCell>Mô tả</TableCell>
                                                <TableCell>Ngày đặt hàng</TableCell>
                                                <TableCell>Trạng thái</TableCell>
                                                <TableCell></TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {filteredListProductOnlyUser1?.map((row) => (
                                                <>
                                                    <TableRow hover role="checkbox" tabIndex={-1} key={row.productId}>
                                                        <TableCell>
                                                            <ButtonGroup onClick={() => toggleRow(row?.productId)}>
                                                                {isRowExpanded(row?.productId) ? <FaWindowMinimize /> : <FaPlus />}
                                                            </ButtonGroup>
                                                        </TableCell>
                                                        <TableCell>{row.productId}</TableCell>
                                                        <TableCell>{row.name}</TableCell>
                                                        <TableCell className='align-middle'><img src={row?.imagePath1} alt={row?.imagePath1} style={{ width: '50px', height: '50px' }} /></TableCell>
                                                        <TableCell>{formatCurrency(row.price)}</TableCell>
                                                        <TableCell><div style={{ padding: '5px', borderRadius: '5px' }}>{row?.description}</div></TableCell>
                                                        <TableCell>{new Date(row.uploadDate).toLocaleDateString('en-GB')}</TableCell>
                                                        <TableCell >
                                                            <div style={{ backgroundColor: getTabColor(row.isDeleted), padding: '5px', color: '#fff', borderRadius: '5px', width: 'fit-content' }}>
                                                                {isDeletedMapping[row.isDeleted]}
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>
                                                    <TableRow>
                                                        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                                                            <Collapse in={isRowExpanded(row?.productId)} timeout="auto" unmountOnExit>
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
                                                                            </TableRow>
                                                                        </TableHead>
                                                                        <TableBody>
                                                                            {getListAllComponent?.filter((component) => component.productId === row?.productId)?.map((component, index) => (
                                                                                <TableRow key={index}>
                                                                                    <TableCell>{component.name}</TableCell>
                                                                                    <TableCell>{component.material}</TableCell>
                                                                                    <TableCell>{component.quantity}</TableCell>
                                                                                    <TableCell>
                                                                                        <div style={{
                                                                                            backgroundColor: `${component.color}`,
                                                                                            width: 90,
                                                                                            height: 28,
                                                                                            borderRadius: '5px',
                                                                                            padding: '5px',
                                                                                        }}></div>
                                                                                    </TableCell>
                                                                                    <TableCell>{component.description}</TableCell>
                                                                                    <TableCell>{component?.isReplacable && component?.isReplacable === 1 ? "Tháo rời" : component?.isReplacable === 0 ? "Cố định" : ""}</TableCell>
                                                                                </TableRow>
                                                                            ))
                                                                            }
                                                                        </TableBody>
                                                                    </table>
                                                                </Box>

                                                            </Collapse>
                                                        </TableCell>
                                                    </TableRow>
                                                </>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </TabPanel>

                            <TabPanel value="3">
                                <TableContainer>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell></TableCell>
                                                <TableCell>Mã đơn hàng</TableCell>
                                                <TableCell>ID Tài khoản đặt hàng</TableCell>
                                                <TableCell>Ảnh</TableCell>
                                                <TableCell>Tổng số tiền</TableCell>
                                                <TableCell>Mô tả</TableCell>
                                                <TableCell>Ngày đặt hàng</TableCell>
                                                <TableCell>Trạng thái</TableCell>
                                                <TableCell></TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {filteredListProductOnlyUser2?.map((row) => (
                                                <>
                                                    <TableRow hover role="checkbox" tabIndex={-1} key={row.productId}>
                                                        <TableCell>
                                                            <ButtonGroup onClick={() => toggleRow(row?.productId)}>
                                                                {isRowExpanded(row?.productId) ? <FaWindowMinimize /> : <FaPlus />}
                                                            </ButtonGroup>
                                                        </TableCell>
                                                        <TableCell>{row.productId}</TableCell>
                                                        <TableCell>{row.name}</TableCell>
                                                        <TableCell className='align-middle'><img src={row?.imagePath1} alt={row?.imagePath1} style={{ width: '50px', height: '50px' }} /></TableCell>
                                                        <TableCell>{formatCurrency(row.price)}</TableCell>
                                                        <TableCell><div style={{ padding: '5px', borderRadius: '5px' }}>{row?.description}</div></TableCell>
                                                        <TableCell>{new Date(row.uploadDate).toLocaleDateString('en-GB')}</TableCell>
                                                        <TableCell >
                                                            <div style={{ backgroundColor: getTabColor(row.isDeleted), padding: '5px', color: '#fff', borderRadius: '5px', width: 'fit-content' }}>
                                                                {isDeletedMapping[row.isDeleted]}
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Button variant='outline-success' className='mx-1' onClick={() => submitHandler3(row.productId)}>
                                                                <FaCheck style={{ color: 'green' }} />
                                                            </Button>

                                                            <Dialog open={open} onClose={handleClose}>
                                                                <DialogTitle>Thương lượng lại giá</DialogTitle>
                                                                <DialogContent>
                                                                    <DialogContentText>
                                                                        Đề xuất lại giá cho khách hàng
                                                                    </DialogContentText>
                                                                    <TextField
                                                                        autoFocus
                                                                        margin="dense"
                                                                        id="number"
                                                                        label="Nhập số tiền"
                                                                        type="number"
                                                                        fullWidth
                                                                        value={price}
                                                                        onChange={(e) => setPrice(e.target.value)}
                                                                    />
                                                                </DialogContent>
                                                                <DialogActions>
                                                                    <Button onClick={handleClose}>Thoát</Button>
                                                                    <Button onClick={(e) => submitHandler1(e, row.productId)}>Gửi hóa đơn</Button>
                                                                </DialogActions>
                                                            </Dialog>

                                                            <Button variant='outline-warning' className='mx-1' onClick={() => handleClickOpen(row.productId)} >
                                                                <FaRegEdit style={{ color: '' }} />
                                                            </Button>

                                                            <Button
                                                                variant="outline-danger"
                                                                className='mx-1'
                                                                //onClick={() => submitHandler2(order.productId)}
                                                                onClick={() => handleClickOpen2(row.productId)}
                                                                
                                                            >
                                                                <FaTimes style={{ color: '' }} />
                                                            </Button>

                                                            <Dialog open={open2} onClose={handleClose2}>
                                                                <DialogTitle>Lí do hủy đơn</DialogTitle>
                                                                <DialogContent>
                                                                    <DialogContentText>
                                                                        Hãy đưa ra lí do vì sao hủy đơn
                                                                    </DialogContentText>
                                                                    <TextField
                                                                        label="Nhập lí do"
                                                                        id="Nhập lí do"
                                                                        fullWidth
                                                                        value={reason}
                                                                        onChange={(e) => setReason(e.target.value)}
                                                                    />
                                                                </DialogContent>
                                                                <DialogActions>
                                                                    <Button onClick={handleClose2} variant='light'>Thoát</Button>
                                                                    <Button onClick={(e) => submitHandler2(e, row.productId)}>Gửi</Button>
                                                                </DialogActions>
                                                            </Dialog>
                                                        </TableCell>
                                                    </TableRow>
                                                    <TableRow>
                                                        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                                                            <Collapse in={isRowExpanded(row?.productId)} timeout="auto" unmountOnExit>
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
                                                                            </TableRow>
                                                                        </TableHead>
                                                                        <TableBody>
                                                                            {getListAllComponent?.filter((component) => component.productId === row?.productId)?.map((component, index) => (
                                                                                <TableRow key={index}>
                                                                                    <TableCell>{component.name}</TableCell>
                                                                                    <TableCell>{component.material}</TableCell>
                                                                                    <TableCell>{component.quantity}</TableCell>
                                                                                    <TableCell>
                                                                                        <div style={{
                                                                                            backgroundColor: `${component.color}`,
                                                                                            width: 90,
                                                                                            height: 28,
                                                                                            borderRadius: '5px',
                                                                                            padding: '5px',
                                                                                        }}></div>
                                                                                    </TableCell>
                                                                                    <TableCell>{component.description}</TableCell>
                                                                                    <TableCell>{component?.isReplacable && component?.isReplacable === 1 ? "Tháo rời" : component?.isReplacable === 0 ? "Cố định" : ""}</TableCell>
                                                                                </TableRow>
                                                                            ))
                                                                            }
                                                                        </TableBody>
                                                                    </table>
                                                                </Box>

                                                            </Collapse>
                                                        </TableCell>
                                                    </TableRow>
                                                </>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </TabPanel>

                            <TabPanel value="4">
                                <TableContainer>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell></TableCell>
                                                <TableCell>Mã đơn hàng</TableCell>
                                                <TableCell>ID Tài khoản đặt hàng</TableCell>
                                                <TableCell>Ảnh</TableCell>
                                                <TableCell>Tổng số tiền</TableCell>
                                                <TableCell>Mô tả</TableCell>
                                                <TableCell>Ngày đặt hàng</TableCell>
                                                <TableCell>Trạng thái</TableCell>
                                                <TableCell></TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {filteredListProductOnlyUser3?.map((row) => (
                                                <>
                                                    <TableRow hover role="checkbox" tabIndex={-1} key={row.productId}>
                                                        <TableCell>
                                                            <ButtonGroup onClick={() => toggleRow(row?.productId)}>
                                                                {isRowExpanded(row?.productId) ? <FaWindowMinimize /> : <FaPlus />}
                                                            </ButtonGroup>
                                                        </TableCell>
                                                        <TableCell>{row.productId}</TableCell>
                                                        <TableCell>{row.name}</TableCell>
                                                        <TableCell className='align-middle'><img src={row?.imagePath1} alt={row?.imagePath1} style={{ width: '50px', height: '50px' }} /></TableCell>
                                                        <TableCell>{formatCurrency(row.price)}</TableCell>
                                                        <TableCell><div style={{ padding: '5px', borderRadius: '5px' }}>{row?.description}</div></TableCell>
                                                        <TableCell>{new Date(row.uploadDate).toLocaleDateString('en-GB')}</TableCell>
                                                        <TableCell >
                                                            <div style={{ backgroundColor: getTabColor(row.isDeleted), padding: '5px', color: '#fff', borderRadius: '5px', width: 'fit-content' }}>
                                                                {isDeletedMapping[row.isDeleted]}
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>
                                                    <TableRow>
                                                        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                                                            <Collapse in={isRowExpanded(row?.productId)} timeout="auto" unmountOnExit>
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
                                                                            </TableRow>
                                                                        </TableHead>
                                                                        <TableBody>
                                                                            {getListAllComponent?.filter((component) => component.productId === row?.productId)?.map((component, index) => (
                                                                                <TableRow key={index}>
                                                                                    <TableCell>{component.name}</TableCell>
                                                                                    <TableCell>{component.material}</TableCell>
                                                                                    <TableCell>{component.quantity}</TableCell>
                                                                                    <TableCell>
                                                                                        <div style={{
                                                                                            backgroundColor: `${component.color}`,
                                                                                            width: 90,
                                                                                            height: 28,
                                                                                            borderRadius: '5px',
                                                                                            padding: '5px',
                                                                                        }}></div>
                                                                                    </TableCell>
                                                                                    <TableCell>{component.description}</TableCell>
                                                                                    <TableCell>{component?.isReplacable && component?.isReplacable === 1 ? "Tháo rời" : component?.isReplacable === 0 ? "Cố định" : ""}</TableCell>
                                                                                </TableRow>
                                                                            ))
                                                                            }
                                                                        </TableBody>
                                                                    </table>
                                                                </Box>

                                                            </Collapse>
                                                        </TableCell>
                                                    </TableRow>
                                                </>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </TabPanel>

                            <TabPanel value="5">
                                <TableContainer>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell></TableCell>
                                                <TableCell>Mã đơn hàng</TableCell>
                                                <TableCell>ID Tài khoản đặt hàng</TableCell>
                                                <TableCell>Ảnh</TableCell>
                                                <TableCell>Tổng số tiền</TableCell>
                                                <TableCell>Mô tả</TableCell>
                                                <TableCell>Ngày đặt hàng</TableCell>
                                                <TableCell>Trạng thái</TableCell>
                                                <TableCell></TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {filteredListProductOnlyUser4?.map((row) => (
                                                <>
                                                    <TableRow hover role="checkbox" tabIndex={-1} key={row.productId}>
                                                        <TableCell>
                                                            <ButtonGroup onClick={() => toggleRow(row?.productId)}>
                                                                {isRowExpanded(row?.productId) ? <FaWindowMinimize /> : <FaPlus />}
                                                            </ButtonGroup>
                                                        </TableCell>
                                                        <TableCell>{row.productId}</TableCell>
                                                        <TableCell>{row.name}</TableCell>
                                                        <TableCell className='align-middle'><img src={row?.imagePath1} alt={row?.imagePath1} style={{ width: '50px', height: '50px' }} /></TableCell>
                                                        <TableCell>{formatCurrency(row.price)}</TableCell>
                                                        <TableCell><div style={{ padding: '5px', borderRadius: '5px' }}>{row?.description}</div></TableCell>
                                                        <TableCell>{new Date(row.uploadDate).toLocaleDateString('en-GB')}</TableCell>
                                                        <TableCell >
                                                            <div style={{ backgroundColor: getTabColor(row.isDeleted), padding: '5px', color: '#fff', borderRadius: '5px', width: 'fit-content' }}>
                                                                {isDeletedMapping[row.isDeleted]}
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>
                                                    <TableRow>
                                                        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                                                            <Collapse in={isRowExpanded(row?.productId)} timeout="auto" unmountOnExit>
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
                                                                            </TableRow>
                                                                        </TableHead>
                                                                        <TableBody>
                                                                            {getListAllComponent?.filter((component) => component.productId === row?.productId)?.map((component, index) => (
                                                                                <TableRow key={index}>
                                                                                    <TableCell>{component.name}</TableCell>
                                                                                    <TableCell>{component.material}</TableCell>
                                                                                    <TableCell>{component.quantity}</TableCell>
                                                                                    <TableCell>
                                                                                        <div style={{
                                                                                            backgroundColor: `${component.color}`,
                                                                                            width: 90,
                                                                                            height: 28,
                                                                                            borderRadius: '5px',
                                                                                            padding: '5px',
                                                                                        }}></div>
                                                                                    </TableCell>
                                                                                    <TableCell>{component.description}</TableCell>
                                                                                    <TableCell>{component?.isReplacable && component?.isReplacable === 1 ? "Tháo rời" : component?.isReplacable === 0 ? "Cố định" : ""}</TableCell>
                                                                                </TableRow>
                                                                            ))
                                                                            }
                                                                        </TableBody>
                                                                    </table>
                                                                </Box>

                                                            </Collapse>
                                                        </TableCell>
                                                    </TableRow>
                                                </>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </TabPanel>

                            <TabPanel value="6">
                                <TableContainer>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell></TableCell>
                                                <TableCell>Mã đơn hàng</TableCell>
                                                <TableCell>ID Tài khoản đặt hàng</TableCell>
                                                <TableCell>Ảnh</TableCell>
                                                <TableCell>Tổng số tiền</TableCell>
                                                <TableCell>Mô tả</TableCell>
                                                <TableCell>Lí do hủy</TableCell>
                                                <TableCell>Ngày đặt hàng</TableCell>
                                                <TableCell>Trạng thái</TableCell>
                                                <TableCell></TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {listProductOnlyUserHaveReason?.map((row) => (
                                                <>
                                                    <TableRow hover role="checkbox" tabIndex={-1} key={row.productId}>
                                                        <TableCell>
                                                            <ButtonGroup onClick={() => toggleRow(row?.productId)}>
                                                                {isRowExpanded(row?.productId) ? <FaWindowMinimize /> : <FaPlus />}
                                                            </ButtonGroup>
                                                        </TableCell>
                                                        <TableCell>{row.productId}</TableCell>
                                                        <TableCell>{row.name}</TableCell>
                                                        <TableCell className='align-middle'><img src={row?.imagePath1} alt={row?.imagePath1} style={{ width: '50px', height: '50px' }} /></TableCell>
                                                        <TableCell>{formatCurrency(row.price)}</TableCell>
                                                        <TableCell><div style={{ padding: '5px', borderRadius: '5px' }}>{row?.description}</div></TableCell>
                                                        <TableCell><div style={{ padding: '5px', borderRadius: '5px' }}>{row?.reason}</div></TableCell>
                                                        <TableCell>{new Date(row.uploadDate).toLocaleDateString('en-GB')}</TableCell>
                                                        <TableCell >
                                                            <div style={{ backgroundColor: getTabColor(row.isDeleted), padding: '5px', color: '#fff', borderRadius: '5px', width: 'fit-content' }}>
                                                                {isDeletedMapping[row.isDeleted]}
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>
                                                    <TableRow>
                                                        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                                                            <Collapse in={isRowExpanded(row?.productId)} timeout="auto" unmountOnExit>
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
                                                                            </TableRow>
                                                                        </TableHead>
                                                                        <TableBody>
                                                                            {getListAllComponent?.filter((component) => component.productId === row?.productId)?.map((component, index) => (
                                                                                <TableRow key={index}>
                                                                                    <TableCell>{component.name}</TableCell>
                                                                                    <TableCell>{component.material}</TableCell>
                                                                                    <TableCell>{component.quantity}</TableCell>
                                                                                    <TableCell>
                                                                                        <div style={{
                                                                                            backgroundColor: `${component.color}`,
                                                                                            width: 90,
                                                                                            height: 28,
                                                                                            borderRadius: '5px',
                                                                                            padding: '5px',
                                                                                        }}></div>
                                                                                    </TableCell>
                                                                                    <TableCell>{component.description}</TableCell>
                                                                                    <TableCell>{component?.isReplacable && component?.isReplacable === 1 ? "Tháo rời" : component?.isReplacable === 0 ? "Cố định" : ""}</TableCell>
                                                                                </TableRow>
                                                                            ))
                                                                            }
                                                                        </TableBody>
                                                                    </table>
                                                                </Box>

                                                            </Collapse>
                                                        </TableCell>
                                                    </TableRow>
                                                </>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </TabPanel>
                        </TabContext>
                    </Box>
                </TabPane>
                <TabPane tab=<h2>Lịch sử sản phẩm đã bán</h2> key='2'>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell></TableCell>
                                    <TableCell>Mã đơn hàng</TableCell>
                                    <TableCell>ID Tài khoản đặt hàng</TableCell>
                                    <TableCell>Tổng số tiền</TableCell>
                                    <TableCell>Ngày đặt hàng</TableCell>
                                    <TableCell>Trạng thái</TableCell>
                                    <TableCell></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {getListOrder?.map((row) => (
                                    <>
                                        <TableRow hover role="checkbox" tabIndex={-1} key={row.orderId}>
                                            <TableCell>
                                                <ButtonGroup onClick={() => toggleRow(row?.orderId)}>
                                                    {isRowExpanded(row?.orderId) ? <FaWindowMinimize /> : <FaPlus />}
                                                </ButtonGroup>
                                            </TableCell>
                                            <TableCell>{row.orderId}</TableCell>
                                            <TableCell>{row.accountId}</TableCell>
                                            <TableCell>{formatCurrency(row.totalPrice)}</TableCell>
                                            <TableCell>{new Date(row.orderDate)?.toLocaleDateString('en-GB')}</TableCell>
                                            <TableCell >
                                                <div style={{ backgroundColor: getTabColor1(row.status), padding: '5px', color: '#fff', borderRadius: '5px', width: 'fit-content' }}>
                                                    {isMapping[row.status]}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                                                <Collapse in={isRowExpanded(row?.orderId)} timeout="auto" unmountOnExit>
                                                    <Box sx={{ margin: 1 }}>
                                                        <table class="table table-bordered ">
                                                            <TableHead>
                                                                <TableRow>
                                                                    <TableCell>Tên</TableCell>
                                                                    <TableCell>Ảnh</TableCell>
                                                                    <TableCell>Số lượng</TableCell>
                                                                </TableRow>
                                                            </TableHead>
                                                            <TableBody>
                                                                {getListOrderDetailClone?.filter((component) => component.orderId === row?.orderId)?.map((component, index) => (
                                                                    <TableRow key={index}>
                                                                        <TableCell><Link to={`/product/${component.productId}`}>{component.name}</Link></TableCell>
                                                                        <TableCell><img src={component?.image} alt={component?.image} style={{ width: '50px', height: '60px' }} /></TableCell>
                                                                        <TableCell>{component.quantity}</TableCell>
                                                                    </TableRow>
                                                                ))
                                                                }
                                                            </TableBody>
                                                        </table>
                                                    </Box>

                                                </Collapse>
                                            </TableCell>
                                        </TableRow>
                                    </>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </TabPane>
            </Tabs>
        </Container>
    );
};
export default OrderListScreen;
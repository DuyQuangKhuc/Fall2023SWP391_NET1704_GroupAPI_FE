import { LinkContainer } from 'react-router-bootstrap';
import { Table, Button, Container, Col } from 'react-bootstrap';
import { FaCheck, FaTimes } from 'react-icons/fa';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import { useGetListProductOnlyUserQuery } from '../../slices/ordersApiSlice';
import React from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from '@material-ui/core';

import { useAcceptProductOfUserFromAdminMutation, useCancelProductOfUserMutation } from '../../slices/productsApiSlice';
import { useEffect } from 'react';
import { toast } from 'react-toastify';



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


    const isDeletedMapping = {
        0: "Đang chờ duyệt",
        1: "Đang chờ phản hồi của khách hàng",
        2: "Đang chờ chấp thuận",
        3: "Chưa thanh toán",
        4: "Đã hoàn thành",
        5: "Đã hủy"
    };

    const getTabColor = (status) => {
        switch (status) {
            case 0: // Đang chờ duyệt
                return '#941313';
            case 1: // Đang chờ phản hồi của khách hàng
                return '#d1bd26';
            case 2: // Đang chờ phản hồi của khách hàng
                return 'red';
            case 3: // Đã hoàn thành
                return 'green';
            case 4: // Đã hoàn thành
                return 'green';
            case 5: // Đã hoàn thành
                return 'green';
            default:
                return 'default';
        }
    };

    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };
    //-----------------------------đang chờ duyệt
    const [price, setPrice] = useState('');

    const [acceptProductOfUserFromAdmin] = useAcceptProductOfUserFromAdminMutation();

    const submitHandler1 = async (e, productId) => {
        e.preventDefault();
        try {
            const res = await acceptProductOfUserFromAdmin({
                productId: productId,
                price,
            }).unwrap();
            console.log(productId);
            toast.success('thành công');
            handleClose()
        } catch (err) {
            toast.error("lỗi");
        }

    };

    const [cancelProductOfUser] = useCancelProductOfUserMutation();

    const submitHandler2 = async (productId) => {
        if (window.confirm('Bạn có chắc muốn xóa đơn hàng?')) {
            try {
                const res = await cancelProductOfUser({
                    productId: productId,
                }).unwrap();
                console.log(productId);
                toast.success('Xóa thành công');
                handleClose()
            } catch (err) {
                toast.error("lỗi");
            }
        }
    };


    return (
        <Container className='mt-3'>
            <h1>Đơn hàng</h1>
            <Box sx={{ width: '100%', typography: 'body1' }}>
                <TabContext value={value}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <TabList onChange={handleChange} aria-label="tabs">
                            <Tab label="Chờ duyệt" value="1" />
                            <Tab label="Chờ phản hồi" value="2" />
                            <Tab label="Chờ xử lí" value="3" />
                            <Tab label="Đã hủy" value="4" />
                        </TabList>
                    </Box>
                    <TabPanel value="1">
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Mã đơn hàng</TableCell>
                                        <TableCell>ID Tài khoản đặt hàng</TableCell>
                                        <TableCell>Ngày đặt hàng</TableCell>
                                        <TableCell>Trạng thái</TableCell>
                                        <TableCell></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {filteredListProductOnlyUser?.map((row) => (
                                        <TableRow hover role="checkbox" tabIndex={-1} key={row.productId}>
                                            <TableCell>{row.productId}</TableCell>
                                            <TableCell>{row.name}</TableCell>
                                            <TableCell>{row.uploadDate}</TableCell>
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
                                                        <Button onClick={(e) => submitHandler1(e, row.productId)}>Gửi hóa đơn</Button>
                                                    </DialogActions>
                                                </Dialog>

                                                <Button
                                                    variant="outline-danger"
                                                    className=''
                                                    onClick={() => submitHandler2(row.productId)}
                                                >
                                                    <FaTimes style={{ color: '' }} />
                                                </Button>

                                            </TableCell>
                                        </TableRow>
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
                                        <TableCell>Mã đơn hàng</TableCell>
                                        <TableCell>ID Tài khoản đặt hàng</TableCell>
                                        <TableCell>Tổng số tiền</TableCell>
                                        <TableCell>Ngày đặt hàng</TableCell>
                                        <TableCell>Trạng thái</TableCell>
                                        <TableCell></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {filteredListProductOnlyUser1?.map((row) => (
                                        <TableRow hover role="checkbox" tabIndex={-1} key={row.productId}>
                                            <TableCell>{row.productId}</TableCell>
                                            <TableCell>{row.name}</TableCell>
                                            <TableCell>${row.price}</TableCell>
                                            <TableCell>{row.uploadDate}</TableCell>
                                            <TableCell >
                                                <div style={{ backgroundColor: getTabColor(row.isDeleted), padding: '5px', color: '#fff', borderRadius: '5px', width: 'fit-content' }}>
                                                    {isDeletedMapping[row.isDeleted]}
                                                </div>
                                            </TableCell>
                                        </TableRow>
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
                                        <TableCell>Mã đơn hàng</TableCell>
                                        <TableCell>ID Tài khoản đặt hàng</TableCell>
                                        <TableCell>Tổng số tiền</TableCell>
                                        <TableCell>Ngày đặt hàng</TableCell>
                                        <TableCell>Trạng thái</TableCell>
                                        <TableCell></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {filteredListProductOnlyUser2?.map((row) => (
                                        <TableRow key={row.productId}>
                                            <TableCell>{row.productId}</TableCell>
                                            <TableCell>{row.name}</TableCell>
                                            <TableCell>${row.price}</TableCell>
                                            <TableCell>{row.uploadDate}</TableCell>
                                            <TableCell >
                                                <div style={{ backgroundColor: getTabColor(row.isDeleted), padding: '5px', color: '#fff', borderRadius: '5px', width: 'fit-content' }}>
                                                    {isDeletedMapping[row.isDeleted]}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </TabPanel>

                    <TabPanel value="4"></TabPanel>
                </TabContext>
            </Box>
        </Container>
    );
};
export default OrderListScreen;
import { LinkContainer } from 'react-router-bootstrap';
import { Table, Button, Container, Col } from 'react-bootstrap';
import { FaCheck, FaRegEdit, FaTimes } from 'react-icons/fa';
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

import { useAcceptProductOfUserFromAdminMutation, useAcceptProductOfUserMutation, useCancelProductOfUserMutation } from '../../slices/productsApiSlice';
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

    const filteredListProductOnlyUser3 = getListProductOnlyUser?.filter(component => component.isDeleted === 3);

    const filteredListProductOnlyUser4 = getListProductOnlyUser?.filter(component => component.isDeleted === 4);

    const filteredListProductOnlyUser5 = getListProductOnlyUser?.filter(component => component.isDeleted === 5);


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

    function formatCurrency(number) {
        // Sử dụng hàm toLocaleString() để định dạng số thành chuỗi với ngăn cách hàng nghìn và mặc định là USD.
        return number.toLocaleString('en-US', {
            style: 'currency',
            currency: 'VND',
        });
    }

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

    const [acceptProductOfUser] = useAcceptProductOfUserMutation();

    const submitHandler3 = async (productId) => {
        try {
            const res = await acceptProductOfUser({
                productId: productId,
            }).unwrap();     
            toast.success('thành công');
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
                                            <TableCell>{formatCurrency(row.price)}</TableCell>
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
                                            <TableCell>{formatCurrency(row.price)}</TableCell>
                                            <TableCell>{row.uploadDate}</TableCell>
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
                                                    onClick={() => submitHandler2(row.productId)}
                                                >
                                                    <FaTimes style={{ color: '' }} />
                                                </Button></TableCell>
                                        </TableRow>
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
                                        <TableCell>Mã đơn hàng</TableCell>
                                        <TableCell>ID Tài khoản đặt hàng</TableCell>
                                        <TableCell>Tổng số tiền</TableCell>
                                        <TableCell>Ngày đặt hàng</TableCell>
                                        <TableCell>Trạng thái</TableCell>
                                        <TableCell></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {filteredListProductOnlyUser3?.map((row) => (
                                        <TableRow hover role="checkbox" tabIndex={-1} key={row.productId}>
                                            <TableCell>{row.productId}</TableCell>
                                            <TableCell>{row.name}</TableCell>
                                            <TableCell>{formatCurrency(row.price)}</TableCell>
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

                    <TabPanel value="5">
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
                                    {filteredListProductOnlyUser4?.map((row) => (
                                        <TableRow hover role="checkbox" tabIndex={-1} key={row.productId}>
                                            <TableCell>{row.productId}</TableCell>
                                            <TableCell>{row.name}</TableCell>
                                            <TableCell>{formatCurrency(row.price)}</TableCell>
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

                    <TabPanel value="6">
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
                                    {filteredListProductOnlyUser5?.map((row) => (
                                        <TableRow hover role="checkbox" tabIndex={-1} key={row.productId}>
                                            <TableCell>{row.productId}</TableCell>
                                            <TableCell>{row.name}</TableCell>
                                            <TableCell>{formatCurrency(row.price)}</TableCell>
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
                </TabContext>
            </Box>
        </Container>
    );
};
export default OrderListScreen;
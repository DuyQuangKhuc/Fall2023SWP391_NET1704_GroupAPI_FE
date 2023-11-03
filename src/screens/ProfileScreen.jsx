import React, { useEffect, useState } from 'react';
import { Table, Form, Button, Row, Col, Container } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { FaCheck, FaTimes, FaPlus, FaWindowMinimize, FaRegEdit } from 'react-icons/fa';
import { toast } from 'react-toastify';
import Loader from '../components/Loader';
import { useUpdateUserMutation } from '../slices/usersApiSlice';
import { useAcceptPriceFromProductOfUserMutation, useGetListOrderOfUserQuery, useGetListPaymentMethodQuery, useGetMyOrdersQuery } from '../slices/ordersApiSlice';
import { setCredentials } from '../slices/authSlice';
import { useParams } from 'react-router-dom';
import { Tabs } from 'antd';
import TabPane from 'antd/es/tabs/TabPane';
import { useAcceptProductOfUserFromUserMutation, useCancelProductOfUserMutation, useGetListAllComponentQuery, useGetListProductCreatedByUserQuery, useGetVoucherOfUserQuery } from '../slices/productsApiSlice';
import ButtonGroup from 'antd/es/button/button-group';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { Avatar, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from '@material-ui/core';
import VoucherUser from '../components/VoucherUser';
import { Grid } from '@material-ui/core';

const ProfileScreen = () => {
    const [name, setUser] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [address1, setAddress1] = useState('');
    const { userInfo } = useSelector((state) => state.auth);

    const [value, setValue] = React.useState('1');
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const { data: getListAllComponent, refetch: getListAllComponentRefetch } = useGetListAllComponentQuery();
    useEffect(() => {
        if (getListAllComponent) {
            const intervalId = setInterval(getListAllComponentRefetch, 1000); // Refresh every 1 seconds
            return () => clearInterval(intervalId); // Cleanup the interval on component unmount or 'order' change
        }
    }, [getListAllComponent, getListAllComponentRefetch]);
    console.log(getListAllComponent);
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

    function formatCurrency(number) {
        // Sử dụng hàm toLocaleString() để định dạng số thành chuỗi với ngăn cách hàng nghìn và mặc định là USD.
        return number.toLocaleString('en-US', {
            style: 'currency',
            currency: 'VND',
        });
    }


    const { id: accountId } = useParams();

    const { data: orders, } = useGetMyOrdersQuery(accountId);


    const { data: getListProductCreatedByUser, refetch } = useGetListProductCreatedByUserQuery(accountId);
    useEffect(() => {
        if (getListProductCreatedByUser) {
            const intervalId = setInterval(refetch, 1000); // Refresh every 1 seconds
            return () => clearInterval(intervalId); // Cleanup the interval on component unmount or 'order' change
        }
    }, [getListProductCreatedByUser, refetch]);

    const filteredListProductOnlyUser = getListProductCreatedByUser?.filter(component => component.isDeleted === 0);

    const filteredListProductOnlyUser1 = getListProductCreatedByUser?.filter(component => component.isDeleted === 1);

    const filteredListProductOnlyUser2 = getListProductCreatedByUser?.filter(component => component.isDeleted === 2);

    const filteredListProductOnlyUser3 = getListProductCreatedByUser?.filter(component => component.isDeleted === 3);

    const filteredListProductOnlyUser4 = getListProductCreatedByUser?.filter(component => component.isDeleted === 4);

    const filteredListProductOnlyUser5 = getListProductCreatedByUser?.filter(component => component.isDeleted === 5);

    const isDeletedMapping = {
        0: "Đang chờ duyệt",
        1: "Đang chờ phản hồi",
        2: "Đang chờ chấp thuận",
        3: "Chưa thanh toán",
        4: "Đã thanh toán",
        5: "Đã hủy"
    };

    const getTabColor = (status) => {
        switch (status) {
            case 0: // Đang chờ duyệt
                return '#941313';
            case 1: // Đang chờ phản hồi 
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

    const [open, setOpen] = React.useState(false);
    const [open1, setOpen1] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleClickOpen1 = () => {
        setOpen1(true);
    };

    const handleClose1 = () => {
        setOpen1(false);
    };


    //-----------------------------đang chờ duyệt
    const [price, setPrice] = useState('');

    const [acceptProductOfUserFromUser] = useAcceptProductOfUserFromUserMutation();

    const submitHandler1 = async (e, productId) => {
        e.preventDefault();
        try {
            const res = await acceptProductOfUserFromUser({
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
    //----------------------------------------------
    const { data: getListOrderOfUser } = useGetListOrderOfUserQuery(accountId);

    const [product] = useState(JSON.parse(localStorage.getItem('ListProductCreatedByUser')));

    const [updateUser, { isLoading: loadingUpdateProfile }] = useUpdateUserMutation(accountId);
    useEffect(() => {
        setPhone(userInfo.phone);
        setEmail(userInfo.email);
        setUser(userInfo.name)
        setPassword(userInfo.password);
        setAddress1(userInfo.address)
    }, [userInfo.email, userInfo.phone, userInfo.name, userInfo.password, userInfo.address]);

    const dispatch = useDispatch();

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            const res = await updateUser({
                accountId,
                name,
                phone,
                email,
                password,
                address: address1
            }).unwrap();
            dispatch(setCredentials({ ...res }));
            toast.success('Cập nhập thành công');
        } catch (err) {
            toast.error("lỗi");
        }
    };

    const [paymentMethodId, setPaymentMethod] = useState('');
    const [address, setAddress] = useState('');

    const { data: getListPaymentMethod } = useGetListPaymentMethodQuery();

    const [acceptPriceFromProductOfUser] = useAcceptPriceFromProductOfUserMutation();

    const submitHandlerPriceFromProduct = async (e, productId) => {
        e.preventDefault();
        try {
            const res = await acceptPriceFromProductOfUser({
                productId: productId,
                paymentMethodId,
                address,
            }).unwrap()
            toast.success("Thanh toán thành công");
            handleClose1()
        } catch (err) {
            console.log(err);
            toast.error("Nhập thiếu");
        }
    };

    const { data: getVoucherOfUser, refetch: getVoucherOfUserRefetch } = useGetVoucherOfUserQuery(userInfo?.accountId);
    useEffect(() => {
        if (getVoucherOfUser) {
            const intervalId = setInterval(getVoucherOfUserRefetch, 1000); // Refresh every 1 seconds
            return () => clearInterval(intervalId); // Cleanup the interval on component unmount or 'order' change
        }
    }, [getVoucherOfUser, getVoucherOfUserRefetch]);

    return (
        <div className=" max-w-full max-h-full  bg-repeat" style={{
            backgroundImage: "url('https://img.rawpixel.com/s3fs-private/rawpixel_images/website_content/v1016-a-02-ksh6oqdp.jpg?w=800&dpr=1&fit=default&crop=default&q=65&vib=3&con=3&usm=15&bg=F4F4F3&ixlib=js-2.2.1&s=8bf67d33cc68e3f340e23db016c234dd')",
            backgroundSize: 'cover',
            backgroundPosition: 'center center',
            backgroundRepeat: 'no-repeat',

        }}>
            <Container>
                <Row >
                    <Col md={3} className='mt-3'>
                        <h2>Trang cá nhân</h2>
                        <Form onSubmit={submitHandler} className='mb-3'>
                            <Form.Group className='my-2' controlId='user'>
                                <Form.Label>Tên</Form.Label>
                                <Form.Control
                                    type='user'
                                    placeholder='Enter user'
                                    value={name}
                                    onChange={(e) => setUser(e.target.value)}
                                ></Form.Control>
                            </Form.Group>

                            <Form.Group className='my-2' controlId='email'>
                                <Form.Label>Email</Form.Label>
                                <Form.Control
                                    type='email'
                                    placeholder='Enter email'
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    disabled
                                ></Form.Control>
                            </Form.Group>

                            <Form.Group className='my-2' controlId='address'>
                                <Form.Label>Địa chỉ</Form.Label>
                                <Form.Control
                                    type='address'
                                    placeholder=''
                                    value={address1}
                                    onChange={(e) => setAddress1(e.target.value)}
                                ></Form.Control>
                            </Form.Group>

                            <Form.Group className='my-2' controlId='phone'>
                                <Form.Label>Số điện thoại</Form.Label>
                                <Form.Control
                                    type='phone'
                                    placeholder='Enter phone'
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                ></Form.Control>
                            </Form.Group>

                            <Form.Group className='my-2' controlId='password'>
                                {/* <Form.Label>Mật khẩu</Form.Label> */}
                                <Form.Control
                                    type='password'
                                    placeholder='Enter password'
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    hidden
                                ></Form.Control>
                            </Form.Group>

                            {/* <Form.Group className='my-2' controlId='confirmPassword'>
                                <Form.Label>Xác nhận mật khẩu</Form.Label>
                                <Form.Control
                                    type='password'
                                    placeholder='Confirm password'
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    hidden
                                ></Form.Control>
                            </Form.Group> */}

                            <Button type='submit' variant='primary'>
                                Cập nhập
                            </Button>
                            {loadingUpdateProfile && <Loader />}
                        </Form>
                    </Col>
                    <Col md={9} className='mt-3'>
                        <Tabs defaultActiveKey='1'>
                            <TabPane tab=<h4>Phiếu giảm giá đang có</h4> key='1'>
                                <Row>
                                    {getVoucherOfUser?.map((voucher) => (
                                        <Grid key={voucher.voucherId} md={6} className='p-3'>
                                            <VoucherUser voucher={voucher} />
                                        </Grid>
                                    ))}
                                </Row>
                            </TabPane>
                            <TabPane tab=<h4>Lịch sử đặt hàng</h4> key='2'>
                                <Box sx={{ width: '100%', typography: 'body1' }}>
                                    <TabContext value={value}>
                                        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                            <TabList onChange={handleChange} aria-label="tabs">
                                                <Tab label="Chờ duyệt" value="1" />
                                                <Tab label="Chờ phản hồi" value="2" />
                                                <Tab label="Chờ xét yêu cầu" value="3" />
                                                <Tab label="Đơn hàng chưa thanh toán" value="4" />
                                                <Tab label="Đã thanh toán" value="5" />
                                                <Tab label="Đã hủy" value="6" />
                                            </TabList>
                                        </Box>
                                        <TabPanel value="1">
                                            <Table striped hover responsive className='table-sm'>
                                                <thead>
                                                    <tr>
                                                        <th></th>
                                                        <th>Mã đơn hàng</th>
                                                        <th>Ảnh</th>
                                                        <th>Mô tả</th>
                                                        <th>Ngày tạo đơn</th>
                                                        <th>Trạng thái</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {filteredListProductOnlyUser?.map((order) => (
                                                        <React.Fragment key={order?.productId}>
                                                            <tr>
                                                                <td className='align-middle'>
                                                                    <ButtonGroup onClick={() => toggleRow(order?.productId)}>
                                                                        {isRowExpanded(order?.productId) ? <FaWindowMinimize /> : <FaPlus />}
                                                                    </ButtonGroup>
                                                                </td>
                                                                <td className='align-middle'><div style={{ padding: '5px', borderRadius: '5px' }}>{order?.productId}</div></td>
                                                                <td className='align-middle'><img src={order?.imagePath1} alt={order?.imagePath1} style={{ width: '50px', height: '50px' }} /></td>
                                                                <td className='align-middle'><div style={{ padding: '5px', borderRadius: '5px' }}>{order?.description}</div></td>
                                                                <td className='align-middle'><div style={{ padding: '5px', borderRadius: '5px' }}>{new Date(order.uploadDate).toLocaleDateString('en-GB')}</div></td>
                                                                <td className='align-middle'>
                                                                    <div style={{
                                                                        backgroundColor: getTabColor(order.isDeleted),
                                                                        padding: '5px',
                                                                        color: '#fff',
                                                                        borderRadius: '5px',
                                                                    }}
                                                                    >
                                                                        {isDeletedMapping[order.isDeleted]}
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                            {isRowExpanded(order?.productId) && (
                                                                <tr>
                                                                    <td colSpan={4}>
                                                                        <table class="table table-bordered ">
                                                                            <thead>
                                                                                <tr>
                                                                                    <th>Tên</th>
                                                                                    <th>Chất liệu</th>
                                                                                    <th>Số lượng</th>
                                                                                    <th>Màu sắc</th> 
                                                                                    <th>Mô tả</th>
                                                                                    <th>Bộ phận</th>
                                                                                </tr>
                                                                            </thead>
                                                                            <tbody>
                                                                                {getListAllComponent
                                                                                    .filter((component) => component.productId === order?.productId)
                                                                                    .map((component, index) => (
                                                                                        <tr key={index}>
                                                                                            <td>{component.name}</td>
                                                                                            <td>{component.material}</td>
                                                                                            <td>{component.quantity}</td>
                                                                                            <td className='align-middle ' style={{ width: 90 }}>
                                                                                                <div style={{
                                                                                                    backgroundColor: `${component.color}`,
                                                                                                    height: 28,
                                                                                                    borderRadius: '5px',
                                                                                                    padding: '5px',
                                                                                                }}></div>
                                                                                            </td>
                                                                                            <td>{component.description}</td>
                                                                                            <td>{component?.isReplacable && component?.isReplacable === 1 ? "Tháo rời" : component?.isReplacable === 0 ? "Cố định" : ""}</td>
                                                                                        </tr>
                                                                                    ))
                                                                                }
                                                                            </tbody>
                                                                        </table>
                                                                    </td>
                                                                </tr>
                                                            )}
                                                        </React.Fragment>
                                                    ))}
                                                </tbody>
                                            </Table>
                                        </TabPanel>

                                        <TabPanel value="2">
                                            <Table striped hover responsive className='table-sm'>
                                                <thead>
                                                    <tr>
                                                        <th></th>
                                                        <th>Mã đơn hàng</th>
                                                        <th>Ảnh</th>
                                                        <th>Giá</th>
                                                        <th>Mô tả</th>
                                                        <th>Ngày tạo đơn</th>
                                                        <th>Trạng thái</th>
                                                        <th></th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {filteredListProductOnlyUser1?.map((order) => (
                                                        <React.Fragment key={order?.productId}>
                                                            <tr>
                                                                <td className='align-middle'>
                                                                    <ButtonGroup onClick={() => toggleRow(order?.productId)}>
                                                                        {isRowExpanded(order?.productId) ? <FaWindowMinimize /> : <FaPlus />}
                                                                    </ButtonGroup>
                                                                </td>
                                                                <td className='align-middle'><div style={{ padding: '5px', borderRadius: '5px' }}>{order?.productId}</div></td>
                                                                <td className='align-middle'><img src={order?.imagePath1} alt={order?.imagePath1} style={{ width: '50px', height: '50px' }} /></td>
                                                                <td className='align-middle'><div style={{ padding: '5px', borderRadius: '5px' }}>{formatCurrency(order.price)}</div></td>
                                                                <td className='align-middle'><div style={{ padding: '5px', borderRadius: '5px' }}>{order?.description}</div></td>
                                                                <td className='align-middle'><div style={{ padding: '5px', borderRadius: '5px' }}>{new Date(order.uploadDate).toLocaleDateString('en-GB')}</div></td>
                                                                <td className='align-middle'>
                                                                    <div style={{
                                                                        backgroundColor: getTabColor(order.isDeleted),
                                                                        padding: '5px',
                                                                        color: '#fff',
                                                                        borderRadius: '5px',
                                                                        //width: 'fit-content', 
                                                                    }}
                                                                    >
                                                                        {isDeletedMapping[order.isDeleted]}
                                                                    </div>
                                                                </td>
                                                                <td >
                                                                    <Button variant='outline-success' className='mx-1' onClick={() => handleClickOpen1(order.productId)} >
                                                                        <FaCheck style={{ color: 'green' }} />
                                                                    </Button>

                                                                    <Dialog open={open1} onClose={handleClose1}>
                                                                        <DialogTitle>Thanh toán</DialogTitle>
                                                                        <DialogContent>
                                                                            <Form>
                                                                                <Form.Group style={{ display: 'flex', justifyContent: 'space-between' }} >
                                                                                    <Col md={6}>
                                                                                        <DialogContentText as='legend' >Thông tin địa chỉ giao hàng</DialogContentText>
                                                                                        <Form.Group className='my-2' controlId='address'>
                                                                                            <Form.Label>Address</Form.Label>
                                                                                            <Form.Control
                                                                                                type='text'
                                                                                                placeholder='Enter address'
                                                                                                value={address}
                                                                                                required
                                                                                                onChange={(e) => setAddress(e.target.value)}
                                                                                            ></Form.Control>
                                                                                        </Form.Group>

                                                                                    </Col>
                                                                                    <Col md={5}>
                                                                                        <DialogContentText as='legend' >Lựa chọn thanh toán</DialogContentText>
                                                                                        {getListPaymentMethod && Array?.isArray(getListPaymentMethod) && getListPaymentMethod?.map((payment) => (
                                                                                            <Form.Check
                                                                                                key={payment.paymentMethodId}
                                                                                                className='my-2'
                                                                                                type='radio'
                                                                                                label={payment.name}
                                                                                                name='paymentMethod'
                                                                                                checked={paymentMethodId === payment.paymentMethodId}
                                                                                                onChange={() => setPaymentMethod(payment.paymentMethodId)}
                                                                                            />
                                                                                        ))}
                                                                                    </Col>
                                                                                </Form.Group>
                                                                            </Form>
                                                                        </DialogContent>
                                                                        <DialogActions>
                                                                            <Button onClick={handleClose1}>Thoát</Button>
                                                                            <Button onClick={(e) => submitHandlerPriceFromProduct(e, order.productId)}> Thanh toán</Button>
                                                                        </DialogActions>
                                                                    </Dialog>

                                                                    <Dialog open={open} onClose={handleClose}>
                                                                        <DialogTitle>Thương lượng lại giá</DialogTitle>
                                                                        <DialogContent>
                                                                            <DialogContentText>
                                                                                Đưa ra số tiền mà bạn có thể trả
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
                                                                            <Button onClick={(e) => submitHandler1(e, order.productId)}>Gửi hóa đơn</Button>
                                                                        </DialogActions>
                                                                    </Dialog>

                                                                    <Button variant='outline-warning' className='mx-1' onClick={() => handleClickOpen(order.productId)} >
                                                                        <FaRegEdit style={{ color: '' }} />
                                                                    </Button>

                                                                    <Button
                                                                        variant="outline-danger"
                                                                        className='mx-1'
                                                                        onClick={() => submitHandler2(order.productId)}
                                                                    >
                                                                        <FaTimes style={{ color: '' }} />
                                                                    </Button>
                                                                </td>
                                                            </tr>
                                                            {isRowExpanded(order?.productId) && (
                                                                <tr>
                                                                    <td colSpan={4}>
                                                                        <table class="table table-bordered ">
                                                                            <thead>
                                                                                <tr>
                                                                                    <th>Tên</th>
                                                                                    <th>Chất liệu</th>
                                                                                    <th>Số lượng</th>
                                                                                    <th>Màu sắc</th> 
                                                                                    <th>Mô tả</th>
                                                                                    <th>Bộ phận</th>
                                                                                </tr>
                                                                            </thead>
                                                                            <tbody>
                                                                                {getListAllComponent
                                                                                    .filter((component) => component.productId === order?.productId)
                                                                                    .map((component, index) => (
                                                                                        <tr key={index}>
                                                                                            <td>{component.name}</td>
                                                                                            <td>{component.material}</td>
                                                                                            <td>{component.quantity}</td>
                                                                                            <td className='align-middle ' style={{ width: 90 }}>
                                                                                                <div style={{
                                                                                                    backgroundColor: `${component.color}`,
                                                                                                    height: 28,
                                                                                                    borderRadius: '5px',
                                                                                                    padding: '5px',
                                                                                                }}></div>
                                                                                            </td>
                                                                                            <td>{component.description}</td>
                                                                                            <td>{component?.isReplacable && component?.isReplacable === 1 ? "Tháo rời" : component?.isReplacable === 0 ? "Cố định" : ""}</td>
                                                                                        </tr>
                                                                                    ))
                                                                                }
                                                                            </tbody>
                                                                        </table>
                                                                    </td>
                                                                </tr>
                                                            )}
                                                        </React.Fragment>
                                                    ))}
                                                </tbody>
                                            </Table>
                                        </TabPanel>

                                        <TabPanel value="3">
                                            <Table striped hover responsive className='table-sm'>
                                                <thead>
                                                    <tr>
                                                        <th></th>
                                                        <th>Mã đơn hàng</th>
                                                        <th>Ảnh</th>
                                                        <th>Giá</th>
                                                        <th>Mô tả</th>
                                                        <th>Ngày tạo đơn</th>
                                                        <th>Trạng thái</th>
                                                        <th></th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {filteredListProductOnlyUser2?.map((order, index) => (
                                                        <React.Fragment key={index}>
                                                            <tr>
                                                                <td className='align-middle'>
                                                                    <ButtonGroup onClick={() => toggleRow(index)}>
                                                                        {isRowExpanded(index) ? <FaWindowMinimize /> : <FaPlus />}
                                                                    </ButtonGroup>
                                                                </td>
                                                                <td className='align-middle'><div style={{ padding: '5px', borderRadius: '5px' }}>{order?.productId}</div></td>
                                                                <td className='align-middle'><img src={order?.imagePath1} alt={order?.imagePath1} style={{ width: '50px', height: '50px' }} /></td>
                                                                <td className='align-middle'><div style={{ padding: '5px', borderRadius: '5px' }}>{formatCurrency(order.price)}</div></td>
                                                                <td className='align-middle'><div style={{ padding: '5px', borderRadius: '5px' }}>{order?.description}</div></td>
                                                                <td className='align-middle'><div style={{ padding: '5px', borderRadius: '5px' }}>{new Date(order.uploadDate).toLocaleDateString('en-GB')}</div></td>
                                                                <td className='align-middle'>
                                                                    <div style={{
                                                                        backgroundColor: getTabColor(order.isDeleted),
                                                                        padding: '5px',
                                                                        color: '#fff',
                                                                        borderRadius: '5px',
                                                                        //width: 'fit-content', 
                                                                    }}
                                                                    >
                                                                        {isDeletedMapping[order.isDeleted]}
                                                                    </div>
                                                                </td>

                                                            </tr>
                                                            {isRowExpanded(index) && (
                                                                <tr>
                                                                    <td colSpan={4}>
                                                                        <table class="table table-bordered ">
                                                                            <thead>
                                                                                <tr>
                                                                                    <th>Tên</th>
                                                                                    <th>Chất liệu</th>
                                                                                    <th>Số lượng</th>
                                                                                    <th>Màu sắc</th> 
                                                                                    <th>Mô tả</th>
                                                                                    <th>Bộ phận</th>
                                                                                </tr>
                                                                            </thead>
                                                                            <tbody>
                                                                                {getListAllComponent
                                                                                    .filter((component) => component.productId === order?.productId)
                                                                                    .map((component, index) => (
                                                                                        <tr key={index}>
                                                                                            <td>{component.name}</td>
                                                                                            <td>{component.material}</td>
                                                                                            <td>{component.quantity}</td>
                                                                                            <td className='align-middle ' style={{ width: 90 }}>
                                                                                                <div style={{
                                                                                                    backgroundColor: `${component.color}`,
                                                                                                    height: 28,
                                                                                                    borderRadius: '5px',
                                                                                                    padding: '5px',
                                                                                                }}></div>
                                                                                            </td>
                                                                                            <td>{component.description}</td>
                                                                                            <td>{component?.isReplacable && component?.isReplacable === 1 ? "Tháo rời" : component?.isReplacable === 0 ? "Cố định" : ""}</td>
                                                                                        </tr>
                                                                                    ))
                                                                                }
                                                                            </tbody>
                                                                        </table>
                                                                    </td>
                                                                </tr>
                                                            )}
                                                        </React.Fragment>
                                                    ))}
                                                </tbody>
                                            </Table>
                                        </TabPanel>

                                        <TabPanel value="4">
                                            <Table striped hover responsive className='table-sm'>
                                                <thead>
                                                    <tr>
                                                        <th></th>
                                                        <th>Mã đơn hàng</th>
                                                        <th>Ảnh</th>
                                                        <th>Giá</th>
                                                        <th>Mô tả</th>
                                                        <th>Ngày tạo đơn</th>
                                                        <th>Trạng thái</th>
                                                        <th></th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {filteredListProductOnlyUser3?.map((order) => (
                                                        <React.Fragment key={order?.productId}>
                                                            <tr>
                                                                <td className='align-middle'>
                                                                    <ButtonGroup onClick={() => toggleRow(order?.productId)}>
                                                                        {isRowExpanded(order?.productId) ? <FaWindowMinimize /> : <FaPlus />}
                                                                    </ButtonGroup>
                                                                </td>
                                                                <td className='align-middle'><div style={{ padding: '5px', borderRadius: '5px' }}>{order?.productId}</div></td>
                                                                <td className='align-middle'><img src={order?.imagePath1} alt={order?.imagePath1} style={{ width: '50px', height: '50px' }} /></td>
                                                                <td className='align-middle'><div style={{ padding: '5px', borderRadius: '5px' }}>{formatCurrency(order.price)}</div></td>
                                                                <td className='align-middle'><div style={{ padding: '5px', borderRadius: '5px' }}>{order?.description}</div></td>
                                                                <td className='align-middle'><div style={{ padding: '5px', borderRadius: '5px' }}>{new Date(order.uploadDate).toLocaleDateString('en-GB')}</div></td>
                                                                <td className='align-middle'>
                                                                    <div style={{
                                                                        backgroundColor: getTabColor(order.isDeleted),
                                                                        padding: '5px',
                                                                        color: '#fff',
                                                                        borderRadius: '5px',
                                                                        //width: 'fit-content', 
                                                                    }}
                                                                    >
                                                                        {isDeletedMapping[order.isDeleted]}
                                                                    </div>
                                                                </td>
                                                                <td>
                                                                    <Button variant='outline-success' className='mx-1' onClick={() => handleClickOpen1(order.productId)} >
                                                                        <FaCheck style={{ color: 'green' }} />
                                                                    </Button>

                                                                    <Dialog open={open1} onClose={handleClose1}>
                                                                        <DialogTitle>Thanh toán</DialogTitle>
                                                                        <DialogContent>
                                                                            <Form>
                                                                                <Form.Group style={{ display: 'flex', justifyContent: 'space-between' }} >
                                                                                    <Col md={6}>
                                                                                        <DialogContentText as='legend' >Thông tin địa chỉ giao hàng</DialogContentText>
                                                                                        <Form.Group className='my-2' controlId='address'>
                                                                                            <Form.Label>Address</Form.Label>
                                                                                            <Form.Control
                                                                                                type='text'
                                                                                                placeholder='Enter address'
                                                                                                value={address}
                                                                                                required
                                                                                                onChange={(e) => setAddress(e.target.value)}
                                                                                            ></Form.Control>
                                                                                        </Form.Group>

                                                                                    </Col>
                                                                                    <Col md={5}>
                                                                                        <DialogContentText as='legend' >Lựa chọn thanh toán</DialogContentText>
                                                                                        {getListPaymentMethod && Array?.isArray(getListPaymentMethod) && getListPaymentMethod?.map((payment) => (
                                                                                            <Form.Check
                                                                                                key={payment.paymentMethodId}
                                                                                                className='my-2'
                                                                                                type='radio'
                                                                                                label={payment.name}
                                                                                                name='paymentMethod'
                                                                                                checked={paymentMethodId === payment.paymentMethodId}
                                                                                                onChange={() => setPaymentMethod(payment.paymentMethodId)}
                                                                                            />
                                                                                        ))}
                                                                                    </Col>
                                                                                </Form.Group>
                                                                            </Form>
                                                                        </DialogContent>
                                                                        <DialogActions>
                                                                            <Button onClick={handleClose1}>Thoát</Button>
                                                                            <Button onClick={(e) => submitHandlerPriceFromProduct(e, order.productId)}> Thanh toán</Button>
                                                                        </DialogActions>
                                                                    </Dialog>

                                                                    <Button
                                                                        variant="outline-danger"
                                                                        className='mx-1'
                                                                        onClick={() => submitHandler2(order.productId)}
                                                                    >
                                                                        <FaTimes style={{ color: '' }} />
                                                                    </Button>
                                                                </td>
                                                            </tr>
                                                            {isRowExpanded(order?.productId) && (
                                                                <tr>
                                                                    <td colSpan={4}>
                                                                        <table class="table table-bordered ">
                                                                            <thead>
                                                                                <tr>
                                                                                    <th>Tên</th>
                                                                                    <th>Chất liệu</th>
                                                                                    <th>Số lượng</th>
                                                                                    <th>Màu sắc</th> 
                                                                                    <th>Mô tả</th>
                                                                                    <th>Bộ phận</th>
                                                                                </tr>
                                                                            </thead>
                                                                            <tbody>
                                                                                {getListAllComponent
                                                                                    .filter((component) => component.productId === order?.productId)
                                                                                    .map((component, index) => (
                                                                                        <tr key={index}>
                                                                                            <td>{component.name}</td>
                                                                                            <td>{component.material}</td>
                                                                                            <td>{component.quantity}</td>
                                                                                            <td className='align-middle ' style={{ width: 90 }}>
                                                                                                <div style={{
                                                                                                    backgroundColor: `${component.color}`,
                                                                                                    height: 28,
                                                                                                    borderRadius: '5px',
                                                                                                    padding: '5px',
                                                                                                }}></div>
                                                                                            </td>
                                                                                            <td>{component.description}</td>
                                                                                            <td>{component?.isReplacable && component?.isReplacable === 1 ? "Tháo rời" : component?.isReplacable === 0 ? "Cố định" : ""}</td>
                                                                                        </tr>
                                                                                    ))
                                                                                }
                                                                            </tbody>
                                                                        </table>
                                                                    </td>
                                                                </tr>
                                                            )}
                                                        </React.Fragment>
                                                    ))}
                                                </tbody>
                                            </Table>
                                        </TabPanel>

                                        <TabPanel value="5">
                                            <Table striped hover responsive className='table-sm'>
                                                <thead>
                                                    <tr>
                                                        <th></th>
                                                        <th>Mã đơn hàng</th>
                                                        <th>Ảnh</th>
                                                        <th>Giá</th>
                                                        <th>Mô tả</th>
                                                        <th>Ngày tạo đơn</th>
                                                        <th>Trạng thái</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {filteredListProductOnlyUser4?.map((order) => (
                                                        <React.Fragment key={order?.productId}>
                                                            <tr>
                                                                <td className='align-middle'>
                                                                    <ButtonGroup onClick={() => toggleRow(order?.productId)}>
                                                                        {isRowExpanded(order?.productId) ? <FaWindowMinimize /> : <FaPlus />}
                                                                    </ButtonGroup>
                                                                </td>
                                                                <td className='align-middle'><div style={{ padding: '5px', borderRadius: '5px' }}>{order?.productId}</div></td>
                                                                <td className='align-middle'><img src={order?.imagePath1} alt={order?.imagePath1} style={{ width: '50px', height: '50px' }} /></td>
                                                                <td className='align-middle'><div style={{ padding: '5px', borderRadius: '5px' }}>{formatCurrency(order.price)}</div></td>
                                                                <td className='align-middle'><div style={{ padding: '5px', borderRadius: '5px' }}>{order?.description}</div></td>
                                                                <td className='align-middle'><div style={{ padding: '5px', borderRadius: '5px' }}>{new Date(order.uploadDate).toLocaleDateString('en-GB')}</div></td>
                                                                <td className='align-middle'>
                                                                    <div style={{
                                                                        backgroundColor: getTabColor(order.isDeleted),
                                                                        padding: '5px',
                                                                        color: '#fff',
                                                                        borderRadius: '5px',
                                                                        //width: 'fit-content', 
                                                                    }}
                                                                    >
                                                                        {isDeletedMapping[order.isDeleted]}
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                            {isRowExpanded(order?.productId) && (
                                                                <tr>
                                                                    <td colSpan={4}>
                                                                        <table class="table table-bordered ">
                                                                            <thead>
                                                                                <tr>
                                                                                    <th>Tên</th>
                                                                                    <th>Chất liệu</th>
                                                                                    <th>Số lượng</th>
                                                                                    <th>Màu sắc</th>
                                                                                    <th>Mô tả</th>
                                                                                    <th>Bộ phận</th>
                                                                                </tr>
                                                                            </thead>
                                                                            <tbody>
                                                                                {getListAllComponent
                                                                                    .filter((component) => component.productId === order?.productId)
                                                                                    .map((component, index) => (
                                                                                        <tr key={index}>
                                                                                            <td>{component.name}</td>
                                                                                            <td>{component.material}</td>
                                                                                            <td>{component.quantity}</td>
                                                                                            <td className='align-middle ' style={{ width: 90 }}>
                                                                                                <div style={{
                                                                                                    backgroundColor: `${component.color}`,
                                                                                                    height: 28,
                                                                                                    borderRadius: '5px',
                                                                                                    padding: '5px',
                                                                                                }}></div>
                                                                                            </td>
                                                                                            <td>{component.description}</td>
                                                                                            <td>{component?.isReplacable && component?.isReplacable === 1 ? "Tháo rời" : component?.isReplacable === 0 ? "Cố định" : ""}</td>
                                                                                        </tr>
                                                                                    ))
                                                                                }
                                                                            </tbody>
                                                                        </table>
                                                                    </td>
                                                                </tr>
                                                            )}
                                                        </React.Fragment>
                                                    ))}
                                                </tbody>
                                            </Table>
                                        </TabPanel>

                                        <TabPanel value="6">
                                            <Table striped hover responsive className='table-sm'>
                                                <thead>
                                                    <tr>
                                                        <th></th>
                                                        <th>Mã đơn hàng</th>
                                                        <th>Ảnh</th>
                                                        <th>Giá</th>
                                                        <th>Mô tả</th>
                                                        <th>Ngày tạo đơn</th>
                                                        <th>Trạng thái</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {filteredListProductOnlyUser5?.map((order) => (
                                                        <React.Fragment key={order?.productId}>
                                                            <tr>
                                                                <td className='align-middle'>
                                                                    <ButtonGroup onClick={() => toggleRow(order?.productId)}>
                                                                        {isRowExpanded(order?.productId) ? <FaWindowMinimize /> : <FaPlus />}
                                                                    </ButtonGroup>
                                                                </td>
                                                                <td className='align-middle'><div style={{ padding: '5px', borderRadius: '5px' }}>{order?.productId}</div></td>
                                                                <td className='align-middle'><img src={order?.imagePath1} alt={order?.imagePath1} style={{ width: '50px', height: '50px' }} /></td>
                                                                <td className='align-middle'><div style={{ padding: '5px', borderRadius: '5px' }}>{formatCurrency(order.price)}</div></td>
                                                                <td className='align-middle'><div style={{ padding: '5px', borderRadius: '5px' }}>{order?.description}</div></td>
                                                                <td className='align-middle'><div style={{ padding: '5px', borderRadius: '5px' }}>{new Date(order.uploadDate).toLocaleDateString('en-GB')}</div></td>
                                                                <td className='align-middle'>
                                                                    <div style={{
                                                                        backgroundColor: getTabColor(order.isDeleted),
                                                                        padding: '5px',
                                                                        color: '#fff',
                                                                        borderRadius: '5px',
                                                                        //width: 'fit-content', 
                                                                    }}
                                                                    >
                                                                        {isDeletedMapping[order.isDeleted]}
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                            {isRowExpanded(order?.productId) && (
                                                                <tr>
                                                                    <td colSpan={4}>
                                                                        <table class="table table-bordered ">
                                                                            <thead>
                                                                                <tr>
                                                                                    <th>Tên</th>
                                                                                    <th>Chất liệu</th>
                                                                                    <th>Số lượng</th>
                                                                                    <th>Màu sắc</th> 
                                                                                    <th>Mô tả</th>
                                                                                    <th>Bộ phận</th>
                                                                                </tr>
                                                                            </thead>
                                                                            <tbody>
                                                                                {getListAllComponent
                                                                                    .filter((component) => component.productId === order?.productId)
                                                                                    .map((component, index) => (
                                                                                        <tr key={index}>
                                                                                            <td>{component.name}</td>
                                                                                            <td>{component.material}</td>
                                                                                            <td>{component.quantity}</td>
                                                                                            <td className='align-middle ' style={{ width: 90 }}>
                                                                                                <div style={{
                                                                                                    backgroundColor: `${component.color}`,
                                                                                                    height: 28,
                                                                                                    borderRadius: '5px',
                                                                                                    padding: '5px',
                                                                                                }}></div>
                                                                                            </td>
                                                                                            <td>{component.description}</td>
                                                                                            <td>{component?.isReplacable && component?.isReplacable === 1 ? "Tháo rời" : component?.isReplacable === 0 ? "Cố định" : ""}</td>
                                                                                        </tr>
                                                                                    ))
                                                                                }
                                                                            </tbody>
                                                                        </table>
                                                                    </td>
                                                                </tr>
                                                            )}
                                                        </React.Fragment>
                                                    ))}
                                                </tbody>
                                            </Table>
                                        </TabPanel>
                                    </TabContext>
                                </Box>
                            </TabPane>
                            <TabPane tab=<h4>Lịch sử mua hàng</h4> key='3'>
                                <Table striped hover responsive className='table-sm'>
                                    <thead>
                                        <tr>
                                            <th>Mã đơn hàng</th>
                                            <th>Ngày mua hàng</th>
                                            <th>Tổng số tiền</th>
                                            <th>Thanh toán</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {getListOrderOfUser && getListOrderOfUser?.map((order, index) => (
                                            <tr key={index}>
                                                <td>{order.orderId}</td>
                                                <td>{order.orderDate}</td>
                                                <td>{formatCurrency(order.totalPrice)}</td>
                                                <td>
                                                    {order.status === 1 ? (
                                                        <FaCheck style={{ color: 'green' }} />
                                                    ) : (
                                                        <FaTimes style={{ color: 'red' }} />
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </TabPane>
                        </Tabs>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default ProfileScreen;
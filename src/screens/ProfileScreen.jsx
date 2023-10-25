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
import { useAcceptProductOfUserFromUserMutation, useCancelProductOfUserMutation, useGetListAllComponentQuery, useGetListProductCreatedByUserQuery } from '../slices/productsApiSlice';
import ButtonGroup from 'antd/es/button/button-group';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from '@material-ui/core';

const ProfileScreen = () => {
    const [name, setUser] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const { userInfo } = useSelector((state) => state.auth);

    const [value, setValue] = React.useState('1');
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    // Define useState hook to track the expanded rows
    const [expandedRows, setExpandedRows] = useState([]);

    // Function to toggle the expanded state of a row
    const toggleRow = (index) => {
        // Check if the row is already expanded
        if (expandedRows.includes(index)) {
            // Remove the row index from the expanded rows array
            setExpandedRows(expandedRows.filter((row) => row !== index));
        } else {
            // Add the row index to the expanded rows array
            setExpandedRows([...expandedRows, index]);
        }
    };

    // Function to check if a row is expanded
    const isRowExpanded = (index) => expandedRows.includes(index);

    const { id: accountId } = useParams();

    const { data: orders, isLoading, error } = useGetMyOrdersQuery(accountId);


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

    const { data: getListAllComponent } = useGetListAllComponentQuery();
    // const filteredComponents = getListAllComponent?.filter(component => component.productId === product.productId);

    

    const [updateUser, { isLoading: loadingUpdateProfile }] = useUpdateUserMutation(accountId);
    useEffect(() => {
        setPhone(userInfo.phone);
        setEmail(userInfo.email);
        setUser(userInfo.name)
    }, [userInfo.email, userInfo.phone, userInfo.name]);

    const dispatch = useDispatch();

    const submitHandler = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            toast.error('sai mật khẩu');
        } else {
            try {
                const res = await updateUser({
                    accountId,
                    name,
                    phone,
                    email,
                    password,
                }).unwrap();
                dispatch(setCredentials({ ...res }));
                toast.success('Cập nhập thành công');
            } catch (err) {
                toast.error("lỗi");
            }
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
        }
    };

    return (
        <Container className='my-3'>
            <Row>
                <Col md={3}>
                    <h2>User Profile</h2>

                    <Form onSubmit={submitHandler}>
                        <Form.Group className='my-2' controlId='user'>
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                type='user'
                                placeholder='Enter user'
                                value={name}
                                onChange={(e) => setUser(e.target.value)}
                            ></Form.Control>
                        </Form.Group>

                        <Form.Group className='my-2' controlId='email'>
                            <Form.Label>Email Address</Form.Label>
                            <Form.Control
                                type='email'
                                placeholder='Enter email'
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            ></Form.Control>
                        </Form.Group>

                        <Form.Group className='my-2' controlId='phone'>
                            <Form.Label>Phone</Form.Label>
                            <Form.Control
                                type='phone'
                                placeholder='Enter phone'
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                            ></Form.Control>
                        </Form.Group>

                        <Form.Group className='my-2' controlId='password'>
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type='password'
                                placeholder='Enter password'
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            ></Form.Control>
                        </Form.Group>

                        <Form.Group className='my-2' controlId='confirmPassword'>
                            <Form.Label>New Password</Form.Label>
                            <Form.Control
                                type='password'
                                placeholder='Confirm password'
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            ></Form.Control>
                        </Form.Group>

                        <Button type='submit' variant='primary'>
                            Update
                        </Button>
                        {loadingUpdateProfile && <Loader />}
                    </Form>
                </Col>
                <Col md={9}>
                    <Tabs defaultActiveKey='1'>
                        <TabPane tab=<h4>Lịch sử đặt hàng</h4> key='1'>
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
                                                    <th>Ngày tạo đơn</th>
                                                    <th>Trạng thái</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {filteredListProductOnlyUser?.map((order, index) => (
                                                    <React.Fragment key={index}>
                                                        <tr>
                                                            <td>
                                                                <ButtonGroup onClick={() => toggleRow(index)}>
                                                                    {isRowExpanded(index) ? <FaWindowMinimize /> : <FaPlus />}
                                                                </ButtonGroup>
                                                            </td>
                                                            <td><div style={{ padding: '5px', borderRadius: '5px' }}>{order?.productId}</div></td>
                                                            <td><div style={{  padding: '5px', borderRadius: '5px'}}>{order.uploadDate}</div></td>
                                                            <td className='align-middle'>
                                                                <div  style={{
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
                                                            getListAllComponent
                                                                .filter((id) => id.componentId === order?.productId)
                                                                .map((id, subIndex) => (
                                                                    <div key={subIndex}>
                                                                        <td>{id?.name}</td>
                                                                        <td>{id?.material}</td>
                                                                        <td>{id?.description}</td>
                                                                        <td>{id?.color}</td>
                                                                        <td>{id?.isReplacable}</td>
                                                                    </div>
                                                                ))
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
                                                    <th>Giá</th>
                                                    <th>Ngày tạo đơn</th>                            
                                                    <th>Trạng thái</th>
                                                    <th></th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {filteredListProductOnlyUser1?.map((order, index) => (
                                                    <React.Fragment key={index}>
                                                        <tr>
                                                            <td className='align-middle'>
                                                                <ButtonGroup onClick={() => toggleRow(index)}>
                                                                    {isRowExpanded(index) ? <FaWindowMinimize /> : <FaPlus />}
                                                                </ButtonGroup>
                                                            </td>
                                                            <td className='align-middle'><div style={{ padding: '5px', borderRadius: '5px' }}>{order?.productId}</div></td>
                                                            <td className='align-middle'><div style={{ padding: '5px', borderRadius: '5px' }}>${order.price}</div></td>
                                                            <td className='align-middle'><div style={{ padding: '5px', borderRadius: '5px' }}>{order.uploadDate}</div></td>
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
                                                        {isRowExpanded(index) && (
                                                            getListAllComponent
                                                                .filter((id) => id.componentId === order?.productId)
                                                                .map((id, subIndex) => (
                                                                    <div key={subIndex}>
                                                                        <td>{id?.name}</td>
                                                                        <td>{id?.material}</td>
                                                                        <td>{id?.description}</td>
                                                                        <td>{id?.color}</td>
                                                                        <td>{id?.isReplacable}</td>
                                                                    </div>
                                                                ))
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
                                                    <th>Giá</th>
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
                                                            <td className='align-middle'><div style={{ padding: '5px', borderRadius: '5px' }}>${order.price}</div></td>
                                                            <td className='align-middle'><div style={{ padding: '5px', borderRadius: '5px' }}>{order.uploadDate}</div></td>
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
                                                            getListAllComponent
                                                                .filter((id) => id.componentId === order?.productId)
                                                                .map((id, subIndex) => (
                                                                    <div key={subIndex}>
                                                                        <td>{id?.name}</td>
                                                                        <td>{id?.material}</td>
                                                                        <td>{id?.description}</td>
                                                                        <td>{id?.color}</td>
                                                                        <td>{id?.isReplacable}</td>
                                                                    </div>
                                                                ))
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
                                                    <th>Giá</th>
                                                    <th>Ngày tạo đơn</th>
                                                    <th>Trạng thái</th>
                                                    <th></th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {filteredListProductOnlyUser3?.map((order, index) => (
                                                    <React.Fragment key={index}>
                                                        <tr>
                                                            <td>
                                                                <ButtonGroup onClick={() => toggleRow(index)}>
                                                                    {isRowExpanded(index) ? <FaWindowMinimize /> : <FaPlus />}
                                                                </ButtonGroup>
                                                            </td>
                                                            <td className='align-middle'><div style={{ padding: '5px', borderRadius: '5px' }}>{order?.productId}</div></td>
                                                            <td className='align-middle'><div style={{ padding: '5px', borderRadius: '5px' }}>${order.price}</div></td>
                                                            <td className='align-middle'><div style={{ padding: '5px', borderRadius: '5px' }}>{order.uploadDate}</div></td>
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

                                                                <Button
                                                                    variant="outline-danger"
                                                                    className='mx-1'
                                                                    onClick={() => submitHandler2(order.productId)}
                                                                >
                                                                    <FaTimes style={{ color: '' }} />
                                                                </Button>
                                                            </td>
                                                        </tr>
                                                        {isRowExpanded(index) && (
                                                            getListAllComponent
                                                                .filter((id) => id.componentId === order?.productId)
                                                                .map((id, subIndex) => (
                                                                    <div key={subIndex}>
                                                                        <td>{id?.name}</td>
                                                                        <td>{id?.material}</td>
                                                                        <td>{id?.description}</td>
                                                                        <td>{id?.color}</td>
                                                                        <td>{id?.isReplacable}</td>
                                                                    </div>
                                                                ))
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
                                                    <th>Giá</th>
                                                    <th>Ngày tạo đơn</th>
                                                    <th>Trạng thái</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {filteredListProductOnlyUser4?.map((order, index) => (
                                                    <React.Fragment key={index}>
                                                        <tr>
                                                            <td>
                                                                <ButtonGroup onClick={() => toggleRow(index)}>
                                                                    {isRowExpanded(index) ? <FaWindowMinimize /> : <FaPlus />}
                                                                </ButtonGroup>
                                                            </td>
                                                            <td className='align-middle'><div style={{ padding: '5px', borderRadius: '5px' }}>{order?.productId}</div></td>
                                                            <td className='align-middle'><div style={{ padding: '5px', borderRadius: '5px' }}>${order.price}</div></td>
                                                            <td className='align-middle'><div style={{ padding: '5px', borderRadius: '5px' }}>{order.uploadDate}</div></td>
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
                                                            getListAllComponent
                                                                .filter((id) => id.componentId === order?.productId)
                                                                .map((id, subIndex) => (
                                                                    <div key={subIndex}>
                                                                        <td>{id?.name}</td>
                                                                        <td>{id?.material}</td>
                                                                        <td>{id?.description}</td>
                                                                        <td>{id?.color}</td>
                                                                        <td>{id?.isReplacable}</td>
                                                                    </div>
                                                                ))
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
                                                    <th>Giá</th>
                                                    <th>Ngày tạo đơn</th>
                                                    <th>Trạng thái</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {filteredListProductOnlyUser5?.map((order, index) => (
                                                    <React.Fragment key={index}>
                                                        <tr>
                                                            <td>
                                                                <ButtonGroup onClick={() => toggleRow(index)}>
                                                                    {isRowExpanded(index) ? <FaWindowMinimize /> : <FaPlus />}
                                                                </ButtonGroup>
                                                            </td>
                                                            <td className='align-middle'><div style={{ padding: '5px', borderRadius: '5px' }}>{order?.productId}</div></td>
                                                            <td className='align-middle'><div style={{ padding: '5px', borderRadius: '5px' }}>${order.price}</div></td>
                                                            <td className='align-middle'><div style={{ padding: '5px', borderRadius: '5px' }}>{order.uploadDate}</div></td>
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
                                                            getListAllComponent
                                                                .filter((id) => id.componentId === order?.productId)
                                                                .map((id, subIndex) => (
                                                                    <div key={subIndex}>
                                                                        <td>{id?.name}</td>
                                                                        <td>{id?.material}</td>
                                                                        <td>{id?.description}</td>
                                                                        <td>{id?.color}</td>
                                                                        <td>{id?.isReplacable}</td>
                                                                    </div>
                                                                ))
                                                        )}
                                                    </React.Fragment>
                                                ))}
                                            </tbody>
                                        </Table>
                                    </TabPanel>
                                </TabContext>
                            </Box>
                        </TabPane>
                        <TabPane tab=<h4>Lịch sử mua hàng</h4> key='2'>
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
                                            <td>${order.totalPrice}</td>
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
    );
};

export default ProfileScreen;
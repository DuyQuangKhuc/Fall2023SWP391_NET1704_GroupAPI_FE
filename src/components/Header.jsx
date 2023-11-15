import { Navbar, Nav, Container, NavDropdown, Badge } from 'react-bootstrap';
import { FaShoppingCart, FaTicketAlt, FaUser, } from 'react-icons/fa';
import { LinkContainer } from 'react-router-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useLogoutMutation } from '../slices/usersApiSlice';
import { logout } from '../slices/authSlice';
import SearchBox from './SearchBox';
import { resetCart } from '../slices/cartSlice';
import { MdAddShoppingCart } from "react-icons/md";
import { useState } from 'react';
import { useGetAddProductUserAutomaticMutation, useGetListOrderDetailCloneByOrderIdorderIdQuery } from '../slices/ordersApiSlice';
import logo1 from '../../src/assets/styles/logo1.svg'

const Header = () => {
    const { cartItems } = useSelector((state) => state.cart);
    const { userInfo } = useSelector((state) => state.auth);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [order] = useState(JSON.parse(localStorage.getItem('getOrder')));


    const { data: getListOrderDetailCloneByOrderIdorderId } = useGetListOrderDetailCloneByOrderIdorderIdQuery(order?.orderId);



    const logoutHandler = async () => {
        try {
            //await logoutApiCall().unwrap();
            localStorage.clear();
            dispatch(logout());
            // NOTE: here we need to reset cart state for when a user logs out so the next
            // user doesn't inherit the previous users cart and shipping
            dispatch(resetCart());
            navigate('/login');
        } catch (err) {
            console.error(err);
        }
    }

    const [getAddProductUserAutomatic] = useGetAddProductUserAutomaticMutation({
        refetchInterval: 1000, // Set the interval in milliseconds (e.g., every 5 seconds)
        enabled: true, // Enable the automatic refetch
    })

    const deleteHandler = async () => {
        try {
            const res = await getAddProductUserAutomatic(userInfo.accountId);
            navigate('/order');
        } catch (err) {
            // Handle error
        }
    };


    const checkoutHandler = () => {
        navigate('/login?redirect=/order');
    };
    return (
        <header >

            <Navbar bg='primary' variant='dark' expand='lg' collapseOnSelect>
                <Container>
                    <LinkContainer to='/'>
                        <Navbar.Brand>
                            <img src={logo1} alt='ProShop' style={{ width: 50, height: 50 }} />
                            Lồng Chim
                        </Navbar.Brand>
                    </LinkContainer>
                    <Navbar.Toggle aria-controls='basic-navbar-nav' />
                    <Navbar.Collapse id='basic-navbar-nav'>
                        <Nav className='ms-auto'>


                            <SearchBox className="ms-32" />


                            {userInfo && userInfo.role === 4 && (
                                <LinkContainer to='/voucher'>
                                    <Nav.Link>
                                        <FaTicketAlt /> Đổi voucher
                                    </Nav.Link>
                                </LinkContainer>
                            )}

                            {userInfo && userInfo.role === 1 ? (
                                <></>
                            ) : (
                                <LinkContainer to='/cart'>
                                    <Nav.Link>
                                        <FaShoppingCart /> Đơn hàng
                                        {getListOrderDetailCloneByOrderIdorderId?.length > 0 && (
                                            <Badge pill bg='success' style={{ marginLeft: '5px' }}>
                                                {getListOrderDetailCloneByOrderIdorderId?.reduce((a, c) => a + c.quantity, 0)}
                                            </Badge>
                                        )}
                                    </Nav.Link>
                                </LinkContainer>
                            )}

                            {userInfo && userInfo.role === 4 && (
                                <LinkContainer onClick={deleteHandler} to='/order'>
                                    <Nav.Link>
                                        <MdAddShoppingCart /> Đặt riêng
                                    </Nav.Link>
                                </LinkContainer>
                            )}

                            {userInfo && userInfo?.role === 4 ? (
                                <NavDropdown title={userInfo?.email} id='username'>
                                    <LinkContainer to={`/profile/${userInfo.accountId}`}>
                                        <NavDropdown.Item>Trang cá nhân</NavDropdown.Item>
                                    </LinkContainer>
                                    <NavDropdown.Item onClick={logoutHandler}>
                                        Đăng xuất
                                    </NavDropdown.Item>
                                </NavDropdown>
                            ) : (
                                userInfo?.role === 1 ? (
                                    <NavDropdown title='Admin' id='adminmenu'>
                                        {/* <LinkContainer to='/admin'>
                                            <NavDropdown.Item>Dasboard</NavDropdown.Item>
                                        </LinkContainer> */}
                                        <LinkContainer to='/admin/productlist'>
                                            <NavDropdown.Item>Quản lí sản phẩm</NavDropdown.Item>
                                        </LinkContainer>
                                        <LinkContainer to='/admin/orderlist'>
                                            <NavDropdown.Item>Quản lí đơn hàng</NavDropdown.Item>
                                        </LinkContainer>
                                        <LinkContainer to='/admin/userlist'>
                                            <NavDropdown.Item>Quản lí tài khoản</NavDropdown.Item>
                                        </LinkContainer>
                                        <NavDropdown.Item onClick={logoutHandler}>
                                            Đăng xuất
                                        </NavDropdown.Item>
                                    </NavDropdown>
                                ) : (
                                    userInfo?.role === 2 ? (
                                        <NavDropdown title='Manager' id='adminmenu'>
                                            {/* <LinkContainer to='/admin'>
                                            <NavDropdown.Item>Dasboard</NavDropdown.Item>
                                        </LinkContainer> */}
                                            <LinkContainer to='/admin/productlist'>
                                                <NavDropdown.Item>Quản lí sản phẩm</NavDropdown.Item>
                                            </LinkContainer>
                                            <LinkContainer to='/admin/orderlist'>
                                                <NavDropdown.Item>Quản lí đơn hàng</NavDropdown.Item>
                                            </LinkContainer>
                                            <LinkContainer to='/admin/userlist'>
                                                <NavDropdown.Item>Quản lí tài khoản</NavDropdown.Item>
                                            </LinkContainer>
                                            <NavDropdown.Item onClick={logoutHandler}>
                                                Đăng xuất
                                            </NavDropdown.Item>
                                        </NavDropdown>
                                    ) : (
                                        userInfo?.role === 3 ? (
                                            <NavDropdown title='Staff' id='adminmenu'>
                                                {/* <LinkContainer to='/admin'>
                                            <NavDropdown.Item>Dasboard</NavDropdown.Item>
                                        </LinkContainer> */}
                                                {/* <LinkContainer to='/admin/productlist'>
                                                    <NavDropdown.Item>Quản lí sản phẩm</NavDropdown.Item>
                                                </LinkContainer> */}
                                                <LinkContainer to='/admin/orderlist'>
                                                    <NavDropdown.Item>Quản lí đơn hàng</NavDropdown.Item>
                                                </LinkContainer>
                                                <LinkContainer to='/admin/userlist'>
                                                    <NavDropdown.Item>Quản lí tài khoản</NavDropdown.Item>
                                                </LinkContainer>
                                                <NavDropdown.Item onClick={logoutHandler}>
                                                    Đăng xuất
                                                </NavDropdown.Item>
                                            </NavDropdown>
                                        ) : (
                                            <LinkContainer to='/login'>
                                                <Nav.Link>
                                                    <FaUser /> Đăng nhập
                                                </Nav.Link>
                                            </LinkContainer>
                                        )
                                    )
                                )
                            )}

                            {/* Admin Links
                            {userInfo && userInfo.role === 1 && (
                                <NavDropdown title='Admin' id='adminmenu'>
                                    <LinkContainer to='/admin/productlist'>
                                        <NavDropdown.Item>Products</NavDropdown.Item>
                                    </LinkContainer>
                                    <LinkContainer to='/admin/orderlist'>
                                        <NavDropdown.Item>Orders</NavDropdown.Item>
                                    </LinkContainer>
                                    <LinkContainer to='/admin/userlist'>
                                        <NavDropdown.Item>Users</NavDropdown.Item>
                                    </LinkContainer>
                                </NavDropdown>
                            )} */}
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </header>
    );
};

export default Header;
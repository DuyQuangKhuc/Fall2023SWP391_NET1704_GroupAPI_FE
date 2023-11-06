import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Form, Button, Row, Col, Container } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../components/Loader';
import FormContainer from '../components/FormContainer';
import { Alert, Paper } from "@mui/material";
import { useRegisterMutation } from '../slices/usersApiSlice';
import { setCredentials } from '../slices/authSlice';
import { toast } from 'react-toastify';

const RegisterScreen = () => {
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [register, { isLoading }] = useRegisterMutation();

    const [successAlert, setSuccessAlert] = useState(false);
    const { userInfo } = useSelector((state) => state.auth);

    const { search } = useLocation();
    const sp = new URLSearchParams(search);
    const redirect = sp.get('redirect') || '/login';

    useEffect(() => {
        if (userInfo) {
            navigate(redirect);
        }
    }, [navigate, redirect, userInfo]);

    const submitHandler = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            toast.error('Mật khẩu không giống nhau');
        } else {
            try {
                const res = await register({ phone, email, name, password }).unwrap();
                dispatch(setCredentials({ ...res }));
                navigate('/login');
                setSuccessAlert(true);
                setTimeout(() => {
                    setSuccessAlert("true");
                }, 3000);
            } catch (err) {
                toast.error("Tài khoản đã tồn tại");
            }
        }
    };

    return (
        <Container className='my-3'>
            <FormContainer>
                <h1>Đăng ký</h1>
                <Form onSubmit={submitHandler}>
                    <Form.Group className='my-2' controlId='name'>
                        <Form.Label>Tên</Form.Label>
                        <Form.Control
                            type='name'
                            placeholder='Nhập tên'
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        ></Form.Control>
                    </Form.Group>

                    <Form.Group className='my-2' controlId='email'>
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            type='email'
                            placeholder='Nhập email'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        ></Form.Control>
                    </Form.Group>
                    <Form.Group className='my-2' controlId='phone'>
                        <Form.Label>Số điện thoại</Form.Label>
                        <Form.Control
                            type='phone'
                            placeholder='Nhập số điện thoại'
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                        ></Form.Control>
                    </Form.Group>
                    <Form.Group className='my-2' controlId='password'>
                        <Form.Label>Mật khẩu</Form.Label>
                        <Form.Control
                            type='password'
                            placeholder='Nhập mật khẩu'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        ></Form.Control>
                    </Form.Group>
                    <Form.Group className='my-2' controlId='confirmPassword'>
                        <Form.Label>Xác nhận mật khẩu</Form.Label>
                        <Form.Control
                            type='password'
                            placeholder='Xác nhận mật khẩu'
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        ></Form.Control>
                    </Form.Group>

                    <Button disabled={isLoading} type='submit' variant='primary'>
                        Register
                    </Button>
                    {successAlert && (
                        <Paper>
                            <Alert variant="contained" color="success">Thành công !!</Alert>
                        </Paper>
                    )}
                    {isLoading && <Loader />}
                </Form>

                <Row className='py-3'>
                    <Col>
                        Bạn đã có tài khoản?{' '}
                        <Link to={redirect ? `/login?redirect=${redirect}` : '/login'}>
                            Đăng nhập
                        </Link>
                    </Col>
                </Row>
            </FormContainer>


        </Container>
    );
};

export default RegisterScreen;
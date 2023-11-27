import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Form, Button, Row, Col, Container } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../components/Loader';
import FormContainer from '../components/FormContainer';
import { Alert, Paper } from "@mui/material";
import { useCheckVerificationMutation, useRegisterMutation, useSendVerificationMutation } from '../slices/usersApiSlice';
import { setCredentials } from '../slices/authSlice';
import { toast } from 'react-toastify';

const RegisterScreen = () => {
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    //const dispatch = useDispatch();
    const navigate = useNavigate();

    const [register, { isLoading }] = useRegisterMutation();

    const [successAlert, setSuccessAlert] = useState(false);
    const [successAlert1, setSuccessAlert1] = useState(false);
    const { userInfo } = useSelector((state) => state.auth);
    const [emailVerification, setEmailVerification] = useState('');
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
                //dispatch(setCredentials({ ...res }));
                toast.success("Đăng ký tài khoản thành công");
                navigate('/login');
            } catch (err) {
                toast.error("Lỗi");
            }
        }
    };

    const [sendVerification, { isLoading: sendVerificationLoading }] = useSendVerificationMutation();

    const submitSendVerification = async (e) => {
        e.preventDefault();

        try {
            const res = await sendVerification({ email }).unwrap();
            setSuccessAlert(true);
            setTimeout(() => {
                setSuccessAlert("true");
            }, 1000);
        } catch (err) {
            if (err.status === 400) {
                toast.error("Email đã được đăng kí, hãy nhập email khác");
            } else {
                toast.error("Hãy chắc chắn bạn điền đúng email");
            }
        }
    };

    const [checkVerification, { isLoading: checkVerificationLoading }] = useCheckVerificationMutation();

    const submitCheckVerification = async (e) => {
        e.preventDefault();

        try {
            const res = await checkVerification(
                emailVerification
            ).unwrap();
            setSuccessAlert1(true);
            setTimeout(() => {
                setSuccessAlert1("true");
            }, 1000);
        } catch (err) {
            toast.error("Hãy chắc chắn bạn nhập đúng mã");
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
                            disabled={successAlert}
                            required
                        ></Form.Control>
                    </Form.Group>

                    <Form.Group className='my-2' controlId='phone'>
                        <Form.Label>Số điện thoại</Form.Label>
                        <Form.Control
                            type='phone'
                            placeholder='Nhập số điện thoại'
                            maxLength={10}
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

                    <Form.Group className='my-2' controlId='emailVerification'>
                        <Form.Label>Xác thực người dùng</Form.Label>
                        <Row >
                            <Col md={6}>
                                <Form.Control
                                    type='text'
                                    placeholder='Mã xác thực sẽ gửi về email của bạn'
                                    value={emailVerification}
                                    onChange={(e) => setEmailVerification(e.target.value)}
                                    required
                                ></Form.Control>
                            </Col>
                            <Col md={6}>
                                {successAlert ? (
                                    <Button disabled={checkVerificationLoading} onClick={submitCheckVerification} variant='success' >
                                        <div style={{ display: 'flex' }}>
                                            {checkVerificationLoading && <Loader />} <span style={{ color: '#fafcfc' }}>Gửi mã</span>
                                        </div>
                                    </Button>
                                ) : (
                                    <Button disabled={sendVerificationLoading} onClick={submitSendVerification} variant='primary' >
                                        <div style={{ display: 'flex' }}>
                                            {sendVerificationLoading && <Loader />} <span style={{ color: '#fafcfc' }}>Nhận mã</span>
                                        </div>
                                    </Button>
                                )}
                            </Col>
                        </Row>
                    </Form.Group>

                    {successAlert1 && (
                        <>
                            <Paper>
                                <Alert variant="standard" color="success">Xác thực thành công !!</Alert>
                            </Paper>

                            <Button disabled={isLoading} type='submit' variant='primary' className='mt-3'>
                                Đăng ký
                            </Button>
                        </>
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
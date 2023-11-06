import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Form, Button, Row, Col, Container } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../components/Loader';
import FormContainer from '../components/FormContainer';

import { useLoginMutation } from '../slices/usersApiSlice';
import { setCredentials } from '../slices/authSlice';
import { toast } from 'react-toastify';


const LoginScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [login, { isLoading }] = useLoginMutation();

    const { userInfo } = useSelector((state) => state.auth);

    const { search } = useLocation();
    const sp = new URLSearchParams(search);
    const redirect = sp.get('redirect') || '/';

    useEffect(() => {
        if (userInfo) {
            navigate(redirect);
        }
    }, [navigate, redirect, userInfo]);

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            const res = await login({ email, password }).unwrap();
            dispatch(setCredentials({ ...res }));
            navigate(redirect);
        } catch (err) {
            const errorMessage =  "Tài khoản không tồn tại" ;
            toast.error(errorMessage);
            console.log(errorMessage)
        }
    };

   
    return (
        <Container className='my-3'>
            <FormContainer className='my-2'>
                <h1 className='my-2'>Đăng nhập</h1>
                <Form onSubmit={submitHandler} className='my-2'>
                    <Form.Group className='my-2' controlId='email'>
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            type='email'
                            placeholder='Nhập email'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
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

                    <Button disabled={isLoading} type='submit' variant='primary'>
                        Đăng nhập
                    </Button>
                    
                    {isLoading && <Loader />}
                </Form>

                <Row className='py-3'>
                    <Col>
                        Bạn chưa có tài khoản?{' '}
                        <Link to={redirect ? `/register?redirect=${redirect}` : '/register'}>
                            Đăng kí
                        </Link>
                    </Col>
                </Row>
            </FormContainer>
        </Container>
    );
};

export default LoginScreen;
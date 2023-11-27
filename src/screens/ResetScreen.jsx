import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Form, Button, Row, Col, Container } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../components/Loader';
import FormContainer from '../components/FormContainer';

import { useCheckVerificationMutation, useForgetPasswordMutation, useLoginMutation, useSendVerificationToChangePassswordMutation } from '../slices/usersApiSlice';
import { setCredentials } from '../slices/authSlice';
import { toast } from 'react-toastify';


const ResetScreen = () => {
    const [email, setEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [emailVerification, setEmailVerification] = useState('');
    const [successAlert, setSuccessAlert] = useState(false);
    const [successAlert1, setSuccessAlert1] = useState(false);
    const navigate = useNavigate();


    const [sendVerificationToChangePasssword, { isLoading: sendVerificationToChangePassswordLoading }] = useSendVerificationToChangePassswordMutation();
    

    const submitSendVerification = async (e) => {
        e.preventDefault();
        try {
            const res = await sendVerificationToChangePasssword({ email }).unwrap();
            setSuccessAlert(true);
            setTimeout(() => {
                setSuccessAlert("true");
            }, 1000);
        } catch (err) {
            toast.error("Email của bạn hiện chưa đăng kí");
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

    const [forgetPassword, { isLoading: forgetPasswordLoading }] = useForgetPasswordMutation();

    const submitForgetPassword = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            toast.error('Mật khẩu không giống nhau');
        } else {
            try {
                const res = await forgetPassword({
                    email,
                    newPassword
                }).unwrap();
                toast.success("Khôi phục mật khẩu thành công. Hãy đăng nhập lại");
                navigate('/login');
            } catch (err) {
                toast.error("Hãy chắc chắn bạn nhập đúng");
            }
        }
    };


    return (
        <Container className='my-3'>
            <Link className='btn btn-light my-3' to='/login'>
                Quay lại
            </Link>
            <FormContainer className='my-2'>
                <h1 className='my-2'>Lấy lại mật khẩu</h1>
                {successAlert ? (
                    <>
                        {successAlert1 ? (
                            <Form onSubmit={submitForgetPassword} className='my-2'>
                                <Form.Group className='my-2' controlId='password'>
                                    <Form.Label>Mật khẩu mới</Form.Label>
                                    <Form.Control
                                        type='password'
                                        placeholder='Nhập mật khẩu'
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
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

                                <Button disabled={forgetPasswordLoading} type='submit' variant='primary'>
                                    <div style={{ display: 'flex' }}>
                                        {forgetPasswordLoading && <Loader />} <span style={{ color: '#fafcfc' }}>Khôi phục mật khẩu</span>
                                    </div>
                                </Button>
                            </Form>
                        ) : (
                            <Form.Group className='my-2' controlId='emailVerification'>
                                <Form.Label>Xác thực địa chỉ email</Form.Label>
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
                                        <Button disabled={checkVerificationLoading} onClick={submitCheckVerification} variant='success' >
                                            <div style={{ display: 'flex' }}>
                                                {checkVerificationLoading && <Loader />} <span style={{ color: '#fafcfc' }}>Gửi mã</span>
                                            </div>
                                        </Button>
                                    </Col>
                                </Row>
                            </Form.Group>
                        )}
                    </>

                ) : (
                    <Form onSubmit={submitSendVerification} className='my-2'>
                        <Form.Group className='my-2' controlId='email'>
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type='email'
                                placeholder='Nhập email'
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            ></Form.Control>
                        </Form.Group>

                        <Button disabled={sendVerificationToChangePassswordLoading} type='submit' variant='primary'>
                            <div style={{ display: 'flex' }}>
                                {sendVerificationToChangePassswordLoading && <Loader />} <span style={{ color: '#fafcfc' }}>Tiếp tục</span>
                            </div>
                        </Button>
                    </Form>
                )}


            </FormContainer>
        </Container>
    );
};

export default ResetScreen;
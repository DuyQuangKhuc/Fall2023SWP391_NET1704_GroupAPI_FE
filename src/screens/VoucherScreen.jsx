import { Row, Col, Container } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { useGetProductsQuery } from '../slices/productsApiSlice';
import { useGetOrderIsUsingByAccountIdQuery } from '../slices/ordersApiSlice';
import { useEffect } from 'react';
import { useState } from 'react';
import Voucher from '../components/Voucher';
import { Grid } from '@material-ui/core';

const VoucherScreen = () => {
    const { pageNumber, keyword } = useParams();

    const { data, isLoading, error } = useGetProductsQuery({
        keyword,
        pageNumber,
    });
    const [user] = useState(JSON.parse(localStorage.getItem('userInfo')));
    const { data: getOrder } = useGetOrderIsUsingByAccountIdQuery(user?.accountId);
    useEffect(() => {
        if (getOrder) {
            localStorage.setItem('getOrder', JSON.stringify(getOrder));
        }
    }, [getOrder]);


    return (
        <div className=" max-w-full max-h-full  bg-repeat" style={{
            backgroundImage: "url('https://img.rawpixel.com/s3fs-private/rawpixel_images/website_content/v1016-a-02-ksh6oqdp.jpg?w=800&dpr=1&fit=default&crop=default&q=65&vib=3&con=3&usm=15&bg=F4F4F3&ixlib=js-2.2.1&s=8bf67d33cc68e3f340e23db016c234dd')",
            backgroundSize: 'cover',
            backgroundPosition: 'center center',
            backgroundRepeat: 'no-repeat',

        }}>
            <Container >
                <Row>
                    <h1 className='mt-3'>Đổi phiếu giảm giá</h1>
                    <Col >
                        <Grid container>
                            {data?.map((product) => (
                                <Grid key={product.productId} xs={6} md={6} className='p-3'>
                                    <Voucher product={product} />
                                </Grid>

                            ))}
                        </Grid>

                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default VoucherScreen;
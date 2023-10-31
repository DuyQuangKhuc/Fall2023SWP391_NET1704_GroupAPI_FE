import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

const VoucherUser = ({ voucher }) => {
    return (
        <Card sx={{ display: 'flex' }}>           
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flex: '5 0 auto' }}>
                    <Typography component="div" variant="h5"  >
                        Giảm {voucher.value}%
                    </Typography>
                </CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', pl: 1, pb: 1 }}>
                    <IconButton sx={{ backgroundColor: '#f2eceb' }} >
                        <Typography >
                            Đang Có {voucher.quantity} phiếu
                        </Typography>
                    </IconButton>

                </Box>
            </Box>
            <CardMedia
                component="img"
                sx={{ width: 310 }}
                image="https://ngaymoi24h.vn/upload/images/AN-09-04/An-05-05/voucher.png"
                alt="voucher"
            />

        </Card>
    );
};

export default VoucherUser;
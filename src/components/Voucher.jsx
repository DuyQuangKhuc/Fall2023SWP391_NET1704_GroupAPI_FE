import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ShoppingBagTwoToneIcon from '@mui/icons-material/ShoppingBagTwoTone';
const Voucher = ({ voucher }) => {

    return (
        <Card sx={{ display: 'flex' }}>
            <CardMedia
                component="img"
                sx={{ width: 360 }}
                image="https://ngaymoi24h.vn/upload/images/AN-09-04/An-05-05/voucher.png"
                alt="voucher"
            />
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flex: '5 0 auto' }}>
                    <Typography component="div" variant="h5"  >
                        Giảm {voucher.value}%  
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary" component="div">
                        Cần {voucher.price} điểm
                    </Typography>
                </CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', pl: 20, pb: 1 }}>
                    <IconButton sx={{ backgroundColor: '#f2eceb' }}>
                        <ShoppingBagTwoToneIcon sx={{ height: 38, width: 38 }} />
                        <Typography >
                            Đổi
                        </Typography>
                    </IconButton>
                    
                </Box>
            </Box>
            
        </Card>
    );
};

export default Voucher;
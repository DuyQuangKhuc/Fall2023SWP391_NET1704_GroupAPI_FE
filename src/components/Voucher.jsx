import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ShoppingBagTwoToneIcon from '@mui/icons-material/ShoppingBagTwoTone';
const Voucher = ({ product }) => {

    const theme = useTheme();

    function formatCurrency(number) {
        // Sử dụng hàm toLocaleString() để định dạng số thành chuỗi với ngăn cách hàng nghìn và mặc định là USD.
        return number.toLocaleString('en-US', {
            style: 'currency',
            currency: 'VND',
        });
    }
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
                        Giảm       
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary" component="div">
                        Cần      điểm
                    </Typography>
                </CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', pl: 20, pb: 1 }}>
                    {/* <IconButton aria-label="previous">
                        {theme.direction === 'rtl' ? <SkipNextIcon /> : <SkipPreviousIcon />}
                    </IconButton> */}
                    <IconButton sx={{ backgroundColor: '#f2eceb' }}>
                        <ShoppingBagTwoToneIcon sx={{ height: 38, width: 38 }} />
                        <Typography >
                            Đổi
                        </Typography>
                    </IconButton>
                    {/* <IconButton aria-label="next">
                        {theme.direction === 'rtl' ? <SkipPreviousIcon /> : <SkipNextIcon />}
                    </IconButton> */}
                </Box>
            </Box>
            
        </Card>
    );
};

export default Voucher;
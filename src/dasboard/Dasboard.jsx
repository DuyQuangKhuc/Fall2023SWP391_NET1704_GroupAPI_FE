import React, { useState, useRef } from 'react';
import { FiSearch } from 'react-icons/fi';
import { IoMenuOutline } from 'react-icons/io5'
import './../assets/styles/dashboard.css'
import Insights from './Insights';
import { Container } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { BarChart } from '@mui/x-charts/BarChart';
import { axisClasses } from '@mui/x-charts';
import { useGetListOrderQuery } from '../slices/ordersApiSlice';
import { useEffect } from 'react';
import { useListMoneyOnDateQuery, useListQuantityBoughtOfProductOnDateQuery } from '../slices/productsApiSlice';

const Dashboard = () => {
    const { userInfo } = useSelector((state) => state.auth);
    const valueFormatter = (value) => `${formatCurrency(value)}`;
    function formatCurrency(number) {
        // Sử dụng hàm toLocaleString() để định dạng số thành chuỗi với ngăn cách hàng nghìn và mặc định là USD.
        return number?.toLocaleString('en-US', {
            style: 'currency',
            currency: 'VND',
        });
    }

    const chartSetting = {
        // yAxis: [
        //     {
        //         label: 'rainfall (mm)',
        //     },
        // ],
    
        width: 1200,
        height: 500,
        sx: {
            [`.${axisClasses.left} .${axisClasses.label}`]: {
                transform: 'translate(-20px, 0)', 
            },
          
        },
    };

    const { data: getListOrder, refetch: getListOrdersRefetch } = useGetListOrderQuery();
    useEffect(() => {
        if (getListOrder) {
            const intervalId = setInterval(getListOrdersRefetch, 1000); // Refresh every 1 seconds
            return () => clearInterval(intervalId); // Cleanup the interval on component unmount or 'order' change
        }
    }, [getListOrder, getListOrdersRefetch]);
    
    const { data: listQuantityBoughtOfProductOnDate, refetch: listQuantityBoughtOfProductOnDateRefetch } = useListQuantityBoughtOfProductOnDateQuery();
    useEffect(() => {
        if (listQuantityBoughtOfProductOnDate) {
            const intervalId = setInterval(listQuantityBoughtOfProductOnDateRefetch, 1000); // Refresh every 1 seconds
            return () => clearInterval(intervalId); // Cleanup the interval on component unmount or 'order' change
        }
    }, [listQuantityBoughtOfProductOnDate, listQuantityBoughtOfProductOnDateRefetch]);

    const { data: listMoneyOnDate, refetch: listMoneyOnDateRefetch } = useListMoneyOnDateQuery();
    useEffect(() => {
        if (listMoneyOnDate) {
            const intervalId = setInterval(listMoneyOnDateRefetch, 1000); // Refresh every 1 seconds
            return () => clearInterval(intervalId); // Cleanup the interval on component unmount or 'order' change
        }
    }, [listMoneyOnDate, listMoneyOnDateRefetch]);

    const [selectedProductId, setSelectedProductId] = useState(null);
    
    return (
        <Container>
            <div className="app">
                <h3>Thống kê dữ liệu </h3>
            </div>
            <Insights />
            <div className="app">
                <h4>Thu nhập hàng ngày </h4>
            </div>

            {listMoneyOnDate?.length > 0 && (
                <BarChart
                    margin={{
                        left: 120,

                    }}
                    dataset={listMoneyOnDate}

                    xAxis={[{
                        scaleType: 'band',
                        dataKey: 'date',
                        tickFormatter: (dataKey) => {
                            const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
                            return new Date(dataKey).toLocaleDateString('en-US', options);
                        },
                        categoryGapRatio: 0.5
                    }]}
                    series={[
                        { dataKey: 'money', label: 'Số tiền kiếm được', valueFormatter },
                    ]}
                    {...chartSetting}
                />
            )}
            <div className='charts'>
                {/* <Overview />
                <Customers /> */}
                
                
            </div>
            {/* <Products /> */}
            <div style={{ marginLeft: '50px' }}>
                
            </div>
            
            {/* <BarChart
                dataset={getListOrder}
                yAxis={[{ scaleType: 'band', dataKey: 'orderId' }]}
                series={[{ dataKey: 'totalPrice', label: 'Seoul rainfall', valueFormatter }]}
                layout="horizontal"
                {...chartSetting}
            /> */}
            
        </Container>
    )

};

export default Dashboard;

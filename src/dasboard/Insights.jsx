import React from 'react'
import InsightsBox from './InsightsBox'
import money from './../assets/styles/img/money.png'
import note from './../assets/styles/img/note.png'
import wallet from './../assets/styles/img/wallet.png'
import bag from './../assets/styles/img/bag.png'
import './../assets/styles/Insights.css'
import { useGetListProductOnlyUserQuery } from '../slices/ordersApiSlice'
import { useEffect } from 'react'
import { useState } from 'react'
import { useGetProductsQuery, useListMoneyOnDateQuery } from '../slices/productsApiSlice'

export default function Insights() {

    const [price, setPrice] = useState([]);
    const [totalProduct, setTotalProduct] = useState([]);
    const [wait, setWait] = useState([]);
    const [negotiate, setNegotiate] = useState([]);

    const { data: getListProductOnlyUser, refetch } = useGetListProductOnlyUserQuery();
    useEffect(() => {
        if (getListProductOnlyUser) {
            const intervalId = setInterval(refetch, 1000); // Refresh every 1 seconds
            return () => clearInterval(intervalId); // Cleanup the interval on component unmount or 'order' change
        }
    }, [getListProductOnlyUser, refetch]);

    const { data: listMoneyOnDate, refetch: listMoneyOnDateRefetch } = useListMoneyOnDateQuery();
    useEffect(() => {
        if (listMoneyOnDate) {
            setPrice(listMoneyOnDate);
            const intervalId = setInterval(listMoneyOnDateRefetch, 1000); // Refresh every 1 seconds
            return () => clearInterval(intervalId); // Cleanup the interval on component unmount or 'order' change
        }
    }, [listMoneyOnDate, listMoneyOnDateRefetch]);
    
    
    const filteredListProductOnlyUser = getListProductOnlyUser?.filter(component => component.isDeleted === 0);
    useEffect(() => {
        if (filteredListProductOnlyUser) {
            setWait(filteredListProductOnlyUser?.length); // Refresh every 1 seconds    
        }
    }, [filteredListProductOnlyUser]);

    const filteredListProductOnlyUser2 = getListProductOnlyUser?.filter(component => component.isDeleted === 2);
    useEffect(() => {
        if (filteredListProductOnlyUser2) {
            setNegotiate(filteredListProductOnlyUser2?.length); // Refresh every 1 seconds    
        }
    }, [filteredListProductOnlyUser2]);
  
    function formatCurrency(number) {
        // Sử dụng hàm toLocaleString() để định dạng số thành chuỗi với ngăn cách hàng nghìn và mặc định là USD.
        return number?.toLocaleString('en-US', {
            style: 'currency',
            currency: 'VND',
        });
    }
    const totalPrice = price.reduce((acc, item) => acc + item.money, 0);

    const { data } = useGetProductsQuery();
    useEffect(() => {
        if (data) {
            setTotalProduct(data?.length); // Refresh every 1 seconds    
        }
    }, [data]);


    return (
        <div className='insights-container'>
            <InsightsBox img={money} title='Tổng thu nhập' value={formatCurrency(totalPrice)} profit={true} />
            <InsightsBox img={wallet} title='Tổng sản phẩm' value={totalProduct} profit={false} />
            <InsightsBox img={note} title='Số đơn cần duyệt' value={wait} profit={false}  />
            <InsightsBox img={note} title='Số đơn đang thương lượng' value={negotiate} profit={false} />         
        </div>
    )
}
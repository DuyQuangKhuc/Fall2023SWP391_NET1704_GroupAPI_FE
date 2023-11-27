import React from 'react'
import { BiUpArrowAlt, BiDownArrowAlt } from 'react-icons/bi'

export default function InsightsBox({ img, title, value, profit, change, duration }) {
    return (
        <div className='insight-container'>
            <img src={img} alt='insight-img' />
            <div className='insight-div'>
                <h6>{title}</h6>
                <p>{value}</p>
                {/* <div className='percentage'><span className={profit ? 'profit' : 'loss'}>
                    {profit ? <BiUpArrowAlt className='arrow' /> : <BiDownArrowAlt className='arrow' />}{change}%</span>&nbsp; {duration}</div> */}
            </div>
        </div>
    )
}
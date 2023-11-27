import * as React from 'react';
import Pagination from '@mui/material/Pagination';

const Paginate = ({ page, setPage, totalPage }) => {
    const handleChange = (event, value) => {
        setPage(value);
    };

    return (

        <Pagination
            count={totalPage}
            variant="outlined"
            shape="rounded"
            page={page}
            showFirstButton
            showLastButton
            onChange={handleChange}
            style={{ justifyContent: 'center', marginLeft: '550px' }}
        >
        </Pagination>
    );
};

export default Paginate;
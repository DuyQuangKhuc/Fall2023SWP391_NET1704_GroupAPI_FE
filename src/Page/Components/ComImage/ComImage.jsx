import React from 'react';
import ImageGallery from 'react-image-gallery';


const ComImage = ({ product }) => {
    // const images = product.map(image => ({

    //     original: image.original,
    //     thumbnail: image.thumbnail,
    // }));

    return (
        <div>
            <ImageGallery thumbnailHeight={200} items={product} />
        </div>
    );
};

export default ComImage;

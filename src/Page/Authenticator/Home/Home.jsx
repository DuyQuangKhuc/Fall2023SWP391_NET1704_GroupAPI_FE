import { useEffect, useState } from "react";
import { getData } from "../../../api/api";
import ComHeader from "../../Components/ComHeader/ComHeader";
import { ComLink } from "../../Components/ComLink/ComLink";
import ComFooter from "../../Components/ComFooter/ComFooter";
import ComImage from "../../Components/ComImage/ComImage";
import images from "../../../img";

export default function Home() {
    const [products, setProducts] = useState([])
    useEffect(() => {
        getData('/Product/List_Product')
            .then((data) => {
                
                setProducts(data.data)
                console.log(data.data);
            })
            .catch((error) => {
                console.error("Error fetching items:", error);
            });
        
    }, []);

    return (
        <>
            <ComHeader />

            <div className="mx-auto max-w-2xl px-4 py-2  sm:mt-4 sm:px-6 lg:py-2 lg:max-w-7xl  ">
                <ComImage showThumbnails={false} product={images.Home} />
            </div>
            <div className="bg-white">
                <div className="mx-auto  max-w-2xl px-4 py-16 sm:px-6 sm:py-4  lg:max-w-7xl lg:px-8">

                    <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
                        {products?.map((product, index) => (
                            <ComLink key={index} to={`/Product/Product/${product.productId}`} className="group ">
                                <div className="aspect-h-1 aspect-w-1 h-80 overflow-hidden rounded-lg bg-gray-200 xl:aspect-h-8 xl:aspect-w-7 border-solid border-2 border-stone-100">
                                    <img
                                        src={product.imagePath}
                                        alt={product.imageAlt}
                                        className="w-full h-full object-cover object-center lg:h-full lg:w-full "
                                    />
                                </div>
                                <h3 className="mt-4 text-sm text-gray-700 line-clamp-2">{product.name}</h3>
                                <p className="mt-1 text-lg font-medium text-gray-900">{product.price}</p>
                            </ComLink>
                        ))}
                    </div>
                </div>
            </div>
            <ComFooter />
        </>
    )
}
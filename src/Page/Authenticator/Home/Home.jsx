import { useEffect, useState } from "react";
import { getData } from "../../../api/api";
import ComHeader from "../../Components/ComHeader/ComHeader";
import { ComLink } from "../../Components/ComLink/ComLink";

export default function Home() {
    const [products, setProducts] = useState([])
    useEffect(() => {
        getData('/table')
        .then((data) => {
            console.log(data);
            setProducts(data.data.docs)
        })
        .catch((error) => {
            console.error("Error fetching items:", error);
        });
        console.log(products);
    }, []);
    
    return (
        <> 
         <ComHeader/>
            <div className="bg-white">
                <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        
                    <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
                        {products?.map((product,index) => (
                            <ComLink key={index} to={`/product/${product.slug}`} className="group ">
                                <div className="aspect-h-1 aspect-w-1 h-80 overflow-hidden rounded-lg bg-gray-200 xl:aspect-h-8 xl:aspect-w-7 border-solid border-2 border-stone-100">
                                    <img
                                        src={product.image}
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

        </>
    )
}
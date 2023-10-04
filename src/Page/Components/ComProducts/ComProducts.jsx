import { useEffect, useState } from "react";
import { getData } from "../../../api/api";
import { ComLink } from "../../Components/ComLink/ComLink"; import { textApp } from "../../../TextContent/textApp";
;


export default function ComProducts({ text, link, getAll }) {
    const [products, setProducts] = useState([])
    useEffect(() => {
        getData(link)
            .then((data) => {
                console.log(data);
                setProducts(data.data.docs)
            })
            .catch((error) => {
                console.error("Error fetching items:", error);
            });
        console.log(products);
    }, []);
    function formatCurrency(number) {
        // Sử dụng hàm toLocaleString() để định dạng số thành chuỗi với ngăn cách hàng nghìn và mặc định là USD.
        return number.toLocaleString('en-US', {
            style: 'currency',
            currency: 'VND',
        });
    }
    return (
        <>
            <div className="bg-white p-4">
                <div className=" mx-auto  max-w-2xl px-4 py-16 sm:px-6 sm:py-4  lg:max-w-7xl lg:px-8">
                    <h2 class="bg-red-500 h-12 flex items-center p-2 text-2xl font-bold tracking-tight text-white mb-4">{text}</h2>
                    <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
                        {products?.map((product, index) => (
                            <ComLink key={index} to={`/product/${product._id}`} className="group hover:">
                                <div className="aspect-h-1 aspect-w-1 h-80 overflow-hidden rounded-lg bg-gray-200 xl:aspect-h-8 xl:aspect-w-7 border-solid border-2 border-stone-100">
                                    <img
                                        src={product.image}
                                        alt={product.imageAlt}
                                        className="w-full h-full object-cover object-center lg:h-full lg:w-full "
                                    />
                                </div>
                                <h3 className="mt-4 text-sm text-gray-700 line-clamp-2">{product.name}</h3>
                                <div className="">
                                    <p className="mt-1 ml-2  text-sm font-medium line-through text-slate-600">{formatCurrency(product.price)}</p>
                                    <p className="ml-2 text-2xl font-medium  text-red-600">{formatCurrency(product.reducedPrice)}</p>
                                </div>
                            </ComLink>
                        ))}
                    </div>
                    <ComLink to={getAll} >
                        {textApp.Home.getAll}
                    </ComLink>
                </div>
            </div>
        </>
    )
}
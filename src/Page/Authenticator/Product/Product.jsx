/* eslint-disable jsx-a11y/img-redundant-alt */

import { useEffect, useState } from 'react'
import { StarIcon } from '@heroicons/react/20/solid'
import { RadioGroup } from '@headlessui/react'
import ComHeader from '../../Components/ComHeader/ComHeader'
import ComImage from '../../Components/ComImage/ComImage'
import { getData } from '../../../api/api'
import { useParams } from 'react-router-dom'
import { textApp } from '../../../TextContent/textApp'
import { FormProvider, useForm } from 'react-hook-form'
import * as yup from "yup"
import { yupResolver } from '@hookform/resolvers/yup'
import ComNumber from '../../Components/ComInput/ComNumber'
import { MdAdd, MdRemove } from 'react-icons/md';
import FeedBack from './FeedBack'
import ComFooter from '../../Components/ComFooter/ComFooter'
import { Rate } from 'antd'

const product = {

    sizes: [
        { name: 'XXS', inStock: false },
        { name: 'XS', inStock: true },
        { name: 'S', inStock: true },
        { name: 'M', inStock: true },
        { name: 'L', inStock: true },
        { name: 'XL', inStock: true },
        { name: '2XL', inStock: true },
        { name: '3XL', inStock: true },
    ],
    description:
        'The Basic Tee 6-Pack allows you to fully express your vibrant personality with three grayscale options. Feeling adventurous? Put on a heather gray tee. Want to be a trendsetter? Try our exclusive colorway: "Black". Need to add an extra pop of color to your outfit? Our white tee has you covered.',
    highlights: [
        'Hand cut and sewn locally',
        'Dyed with our proprietary colors',
        'Pre-washed & pre-shrunk',
        'Ultra-soft 100% cotton',
    ],
    details:
        'The 6-Pack includes two black, two white, and two heather gray Basic Tees. Sign up for our subscription service and be the first to get new, exciting colors, like our upcoming "Charcoal Gray" limited release.',
}
const reviews = { href: '#', average: 4, totalCount: 117 }

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

export default function Product() {
    const [selectedSize, setSelectedSize] = useState(product.sizes[2])
    const [quantity, setQuantity] = useState(0);
    const [Product, setProduct] = useState([])
    const [image, setImage] = useState([])
    const { slug } = useParams();

    const decrementQuantity = () => {
        setQuantity(prevQuantity => prevQuantity > 0 ? prevQuantity - 1 : 0);
    }

    const incrementQuantity = () => {
        setQuantity(prevQuantity => {
            if (prevQuantity + 1 > Product.quantity) {
                alert(`Số lượng bạn chọn đã đạt mức tối đa của sản phẩm này`);
                return prevQuantity;
            }
            return prevQuantity + 1;
        });
    }

    const productQuantity = yup.object({
        quantity: yup.number().max(Product.quantity, `Số lượng bạn chọn đã đạt mức tối đa của sản phẩm này`).min(1, "phải lớn hơn hoặc bằng 1").required("Trường số lượng là bắt buộc").typeError("vui lòng chọn nhập vào đây"),
    })
    const LoginRequestDefault = {
        quantity: "1",

    };
    const methods = useForm({
        resolver: yupResolver(productQuantity),
        defaultValues: {
            quantity: 1,
        },
        values: LoginRequestDefault
    })
    const { handleSubmit, register, setFocus, watch, setValue } = methods
    const onSubmit = (data) => {
        console.log(data);
    }
    useEffect(() => {
        getData(`/Product/Product?id=${slug}`)
            // .then(product =>
            //     setProduct(product.data))
            .then((data) => {
                setProduct(data.data)
                console.log(data.data);
            })
            .catch((error) => {
                console.log(error);
            })

    }, [slug]);

    useEffect(() => {

        if (Product?.image) {
            setImage(Product?.image.map(image => ({

                original: image,
                thumbnail: image,
                className: 'w-24 h-24',
            })
            ))
        }
    }, [Product])
    return (
        <>
            <ComHeader />
            <div className="bg-slate-50">
                <div className="">
                    {/* Image gallery */}


                    {/* Product info */}
                    <div className="mx-auto max-w-2xl px-4 pb-16 pt-8 sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-2 lg:grid-rows-[auto,auto,1fr] lg:gap-x-8 lg:px-8 lg:pb-24 lg:pt-8">


                        {/* Options */}
                        <div className='product' >
                            {/* <ComImage product={image} /> */}
                            <img src={Product.imagePath} alt="Description of Image" />
                        </div>

                        <div className="mt-4 lg:row-span-3 lg:mt-0">
                            <h3 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">{Product.name}</h3>

                            <p className="text-3xl pt-2 tracking-tight font-serif text-gray-900">${Product.price}</p>

                            {/* Reviews */}
                            <div className="mt-6">
                                <h3 className="sr-only">Reviews</h3>
                                <div className="flex items-center">
                                    <div className="flex items-center">
                                        {/* {[0, 1, 2, 3, 4].map((rating) => (
                                            <StarIcon
                                                key={rating}
                                                className={classNames(
                                                    reviews.average > rating ? 'text-gray-900' : 'text-gray-200',
                                                    'h-5 w-5 flex-shrink-0'
                                                )}
                                                aria-hidden="true"
                                            />
                                        ))} */}
                                        <Rate />
                                    </div>
                                    <p className="sr-only">{reviews.average} out of 5 stars</p>
                                    <a href={reviews.href} className="ml-3 text-sm font-medium text-indigo-600 hover:text-indigo-500">
                                        {reviews.totalCount} reviews
                                    </a>
                                </div>
                            </div>
                            <FormProvider {...methods} >
                                <form className="mt-10" onSubmit={handleSubmit(onSubmit)}>

                                    <div>
                                        {/* <div className='flex gap-4'>
                                            <h3 className="text-sm font-medium text-gray-900 mt-2">{textApp.Product.page.quantity}</h3>
                                            
                                            <ComNumber
                                                className="w-56"
                                                // min={1} 
                                                defaultValue={1}
                                                // max={Product.quantity} 
                                                {...register("quantity")}
                                            />
                                            <div className='mt-2'> {Product.quantity} sản phẩm có sẵn</div>
                                        </div> */}
                                        <div>
                                            <div className='flex gap-4'>
                                                <h3 className="text-sm font-medium text-gray-900 mt-2">{textApp.Product.page.quantity}</h3>
                                                <div className="relative">
                                                    <div className="flex items-center justify-center w-full">
                                                        <button type="button" className="text-gray-500 focus:outline-none focus:text-gray-600" onClick={() => decrementQuantity()}>
                                                            <span className="sr-only">Decrease quantity</span>
                                                            <MdRemove className="h-5 w-5" />
                                                        </button>
                                                        <input
                                                            className="mx-2 border text-center w-8"
                                                            type="text"
                                                            value={quantity}
                                                            onChange={e => setQuantity(e.target.value)}
                                                            
                                                        />
                                                        <button type="button" className="text-gray-500 focus:outline-none focus:text-gray-600" onClick={() => incrementQuantity()}>
                                                            <span className="sr-only">Increase quantity</span>
                                                            <MdAdd className="h-5 w-5" />
                                                        </button>
                                                    </div>
                                                    <div className='mt-2'> {Product.quantity} sản phẩm có sẵn</div>
                                                </div>
                                            </div>
                                        </div>

                                    </div>

                                    {/* Sizes */}
                                    <div className="mt-10">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-sm font-medium text-gray-900">Size</h3>

                                        </div>

                                        <RadioGroup value={selectedSize} onChange={setSelectedSize} className="mt-4">
                                            <RadioGroup.Label className="sr-only">Choose a size</RadioGroup.Label>
                                            <div className="grid grid-cols-4 gap-4 sm:grid-cols-8 lg:grid-cols-4">
                                                {product.sizes.map((size) => (
                                                    <RadioGroup.Option
                                                        key={size.name}
                                                        value={size}
                                                        disabled={!size.inStock}
                                                        className={({ active }) =>
                                                            classNames(
                                                                size.inStock
                                                                    ? 'cursor-pointer bg-white text-gray-900 shadow-sm'
                                                                    : 'cursor-not-allowed bg-gray-50 text-gray-200',
                                                                active ? 'ring-2 ring-indigo-500' : '',
                                                                'group relative flex items-center justify-center rounded-md border py-3 px-4 text-sm font-medium uppercase hover:bg-gray-50 focus:outline-none sm:flex-1 sm:py-6'
                                                            )
                                                        }
                                                    >
                                                        {({ active, checked }) => (
                                                            <>
                                                                <RadioGroup.Label as="span">{size.name}</RadioGroup.Label>
                                                                {size.inStock ? (
                                                                    <span
                                                                        className={classNames(
                                                                            active ? 'border' : 'border-2',
                                                                            checked ? 'border-indigo-500' : 'border-transparent',
                                                                            'pointer-events-none absolute -inset-px rounded-md'
                                                                        )}
                                                                        aria-hidden="true"
                                                                    />
                                                                ) : (
                                                                    <span
                                                                        aria-hidden="true"
                                                                        className="pointer-events-none absolute -inset-px rounded-md border-2 border-gray-200"
                                                                    >
                                                                        <svg
                                                                            className="absolute inset-0 h-full w-full stroke-2 text-gray-200"
                                                                            viewBox="0 0 100 100"
                                                                            preserveAspectRatio="none"
                                                                            stroke="currentColor"
                                                                        >
                                                                            <line x1={0} y1={100} x2={100} y2={0} vectorEffect="non-scaling-stroke" />
                                                                        </svg>
                                                                    </span>
                                                                )}
                                                            </>
                                                        )}
                                                    </RadioGroup.Option>
                                                ))}
                                            </div>
                                        </RadioGroup>
                                    </div>

                                    <button
                                        type="submit"
                                        className="mt-10 flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                    >
                                        Buy
                                    </button>
                                </form>
                            </FormProvider>
                        </div>

                    </div>
                    <div className="mx-auto max-w-2xl px-4 pb-16 pt-10 sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-2 lg:grid-rows-[auto,auto,1fr] lg:gap-x-8 lg:px-8 lg:pb-24 lg:pt-16">
                        <div className="block py-10 lg:col-span-2 lg:col-start-1 lg:pb-16 lg:pt-6 whitespace-pre-line">
                            <h3 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">Summary</h3>
                            <p>
                                {Product.description}
                            </p>
                        </div>
                        <FeedBack/>
                        
                    </div>
                    <ComFooter />
                </div>
            </div>
        </>
    )
}
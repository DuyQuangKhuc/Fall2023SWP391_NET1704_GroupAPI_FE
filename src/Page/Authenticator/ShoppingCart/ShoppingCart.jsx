/* eslint-disable jsx-a11y/no-redundant-roles */
/* eslint-disable jsx-a11y/anchor-is-valid */
import { Fragment, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";

const products = [
    {
        id: 1,
        name: "Throwback Hip Bag",
        href: "#",
        color: "Salmon",
        price: "$90.00",
        quantity: 1,
        imageSrc:
            "https://tailwindui.com/img/ecommerce-images/shopping-cart-page-04-product-01.jpg",
        imageAlt:
            "Salmon orange fabric pouch with match zipper, gray zipper pull, and adjustable hip belt.",
    },
    {
        id: 2,
        name: "Medium Stuff Satchel",
        href: "#",
        color: "Blue",
        price: "$32.00",
        quantity: 1,
        imageSrc:
            "https://tailwindui.com/img/ecommerce-images/shopping-cart-page-04-product-02.jpg",
        imageAlt:
            "Front of satchel with blue canvas body, black straps and handle, drawstring top, and front zipper pouch.",
    },
    {
        id: 3,
        name: "Medium Stuff Satchel",
        href: "#",
        color: "Blue",
        price: "$32.00",
        quantity: 1,
        imageSrc:
            "https://tailwindui.com/img/ecommerce-images/shopping-cart-page-04-product-02.jpg",
        imageAlt:
            "Front of satchel with blue canvas body, black straps and handle, drawstring top, and front zipper pouch.",
    },
    {
        id: 4,
        name: "Medium Stuff Satchel",
        href: "#",
        color: "Blue",
        price: "$32.00",
        quantity: 1,
        imageSrc:
            "https://tailwindui.com/img/ecommerce-images/shopping-cart-page-04-product-02.jpg",
        imageAlt:
            "Front of satchel with blue canvas body, black straps and handle, drawstring top, and front zipper pouch.",
    },
    {
        id: 5,
        name: "Medium Stuff Satchel",
        href: "#",
        color: "Blue",
        price: "$32.00",
        quantity: 1,
        imageSrc:
            "https://tailwindui.com/img/ecommerce-images/shopping-cart-page-04-product-02.jpg",
        imageAlt:
            "Front of satchel with blue canvas body, black straps and handle, drawstring top, and front zipper pouch.",
    },
    // More products...
];

export default function ShoppingCart({ show, updateShoppingCart }) {
    const [open, setOpen] = useState(show);
    const [selectAll, setSelectAll] = useState(false); // State cho checkbox "Chọn tất cả"
    const [selectedProducts, setSelectedProducts] = useState([]); // State cho checkbox sản phẩm riêng lẻ
    const [cartProducts, setCartProducts] = useState(products);

    const handleRemoveProduct = (productId) => {
        // hiện lên thông báo đã xóa sản phẩm
        alert("Đã xóa sản phẩm khỏi giỏ hàng với id: " + productId);
        const updatedCart = cartProducts.filter(
            (product) => product.id !== productId
        );
        console.log("Updated Cart:", updatedCart);
        setCartProducts(updatedCart);
    };

    const handleQuantityChange = (productId, newQuantity) => {
        const updatedCart = cartProducts.map((product) => {
            if (product.id === productId) {
                return { ...product, quantity: newQuantity };
            }
            return product;
        });
        setCartProducts(updatedCart);
    };

    const calculateTotalPrice = () => {
        return cartProducts.reduce((total, product) => {
            return total + parseFloat(product.price.slice(1)) * product.quantity;
        }, 0);
    };

    const handleSelectAllChange = () => {
        setSelectAll(!selectAll);
        // Nếu đã chọn "Chọn tất cả", hãy chọn tất cả sản phẩm
        if (!selectAll) {
            const allProductIds = products.map((product) => product.id);
            setSelectedProducts(allProductIds);
        } else {
            setSelectedProducts([]);
        }
    };

    const handleProductCheckboxChange = (productId) => {
        if (selectedProducts.includes(productId)) {
            // Nếu sản phẩm đã được chọn, hãy bỏ chọn nó
            setSelectedProducts(selectedProducts.filter((id) => id !== productId));
        } else {
            // Nếu sản phẩm chưa được chọn, hãy chọn nó
            setSelectedProducts([...selectedProducts, productId]);
        }
    };

    const renderSelectAllCheckbox = () => (
        <div className="mt-2">
            <label className="inline-flex items-center">
                <input
                    type="checkbox"
                    className="form-checkbox text-indigo-600 border-indigo-600"
                    checked={selectAll}
                    onChange={handleSelectAllChange}
                />
                <span className="ml-2">Chọn tất cả</span>
            </label>
        </div>
    );

    // Render checkbox cho từng sản phẩm
    const renderProductCheckboxes = () => (
        <ul role="list" className="-my-6 divide-y divide-gray-200">
            {products.map((product) => (
                <li key={product.id} className="flex py-6">
                    <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                        <img
                            src={product.imageSrc}
                            alt={product.imageAlt}
                            className="h-full w-full object-cover object-center"
                        />
                    </div>
                    <div className="ml-4 flex flex-1 flex-col">
                        <div>
                            <div className="flex justify-between text-base font-medium text-gray-900">
                                <h3>
                                    <a href={product.href}>{product.name}</a>
                                </h3>
                                <p className="ml-4">{product.price}</p>
                            </div>
                            <p className="mt-1 text-sm text-gray-500">{product.color}</p>
                        </div>
                        <div className="flex flex-1 items-end justify-between text-sm">
                            <p className="text-gray-500">
                                Qty {/* thay đổi số lượng sản phẩm */}
                                <input
                                    type="number"
                                    className="w-10 border border-gray-300 rounded-md"
                                    value={product.quantity}
                                    onChange={(e) =>
                                        handleQuantityChange(product.id, e.target.value)
                                    }
                                />
                            </p>

                            <div className="flex">
                                <button
                                    type="button"
                                    className="font-medium text-indigo-600 hover:text-indigo-500"
                                    onClick={() => handleRemoveProduct(product.id)} // Gọi hàm xóa sản phẩm
                                >
                                    Remove
                                </button>
                            </div>
                            <div className="flex items-center">
                                <label className="inline-flex items-center ml-4">
                                    <input
                                        type="checkbox"
                                        className="form-checkbox text-indigo-600 border-indigo-600"
                                        checked={selectedProducts.includes(product.id)}
                                        onChange={() => handleProductCheckboxChange(product.id)}
                                    />
                                </label>
                            </div>
                        </div>
                    </div>
                </li>
            ))}
        </ul>
    );

    useEffect(() => {
        setOpen(show);
        if (show) {
            // updateShoppingCart(true);
        }
    }, [show]);
    const handleCartClose = () => {
        // Gọi hàm callback để cập nhật giá trị shoppingCart thành false
        updateShoppingCart(false);
        console.log(123);
    };
    return (
        <Transition.Root show={open} as={Fragment}>
            <Dialog
                as="div"
                className="relative z-10"
                onClose={() => {
                    setOpen(false);
                    handleCartClose();
                }}
            >
                <Transition.Child
                    as={Fragment}
                    enter="ease-in-out duration-500"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in-out duration-500"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-hidden">
                    <div className="absolute inset-0 overflow-hidden">
                        <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
                            <Transition.Child
                                as={Fragment}
                                enter="transform transition ease-in-out duration-500 sm:duration-700"
                                enterFrom="translate-x-full"
                                enterTo="translate-x-0"
                                leave="transform transition ease-in-out duration-500 sm:duration-700"
                                leaveFrom="translate-x-0"
                                leaveTo="translate-x-full"
                            >
                                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                                    <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                                        <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                                            <div className="flex items-start justify-between">
                                                <Dialog.Title className="text-lg font-medium text-gray-900">
                                                    Shopping cart
                                                </Dialog.Title>
                                                <div className="ml-3 flex h-7 items-center">
                                                    <button
                                                        type="button"
                                                        className="relative -m-2 p-2 text-gray-400 hover:text-gray-500"
                                                        onClick={() => {
                                                            setOpen(false);
                                                            handleCartClose();
                                                        }}
                                                    >
                                                        <span className="absolute -inset-0.5" />
                                                        <span className="sr-only">Close panel</span>
                                                        <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="mt-8">
                                                {renderSelectAllCheckbox()}{" "}
                                                {/* Gọi hàm renderSelectAllCheckbox ở đây */}
                                                {renderProductCheckboxes()}{" "}
                                                {/* Gọi hàm renderProductCheckboxes ở đây */}
                                            </div>
                                        </div>

                                        <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
                                            <div className="flex justify-between text-base font-medium text-gray-900">
                                                <p>Subtotal</p>
                                                <p>${calculateTotalPrice().toFixed(2)}</p>
                                            </div>
                                            <p className="mt-0.5 text-sm text-gray-500">
                                                Shipping and taxes calculated at checkout.
                                            </p>
                                            <div className="mt-6">
                                                <a
                                                    href="#"
                                                    className="flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700"
                                                >
                                                    Checkout
                                                </a>
                                            </div>
                                            <div className="mt-6 flex justify-center text-center text-sm text-gray-500">
                                                <p>
                                                    or
                                                    <button
                                                        type="button"
                                                        className="font-medium text-indigo-600 hover:text-indigo-500"
                                                        onClick={() => setOpen(false)}
                                                    >
                                                        Continue Shopping
                                                        <span aria-hidden="true"> &rarr;</span>
                                                    </button>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </div>
            </Dialog>
        </Transition.Root>
    );
}
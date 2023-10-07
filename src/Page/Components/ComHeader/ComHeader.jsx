/* eslint-disable jsx-a11y/no-redundant-roles */
/* eslint-disable jsx-a11y/anchor-is-valid */

import { Fragment, useEffect, useState } from "react";
import { Dialog, Popover, Tab, Transition } from "@headlessui/react";
import {
  Bars3Icon,
  CogIcon,
  MagnifyingGlassIcon,
  ShoppingBagIcon,
  UserCircleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import ShoppingCart from "../../Authenticator/ShoppingCart/ShoppingCart";
import { routs } from "../../../constants/ROUT";
import { ComLink } from "../ComLink/ComLink";
import { Affix } from "antd";
import images from "../../../img";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import ComButton from "../ComButton/ComButton";

const navigation = {
  categories: [
    {
      id: "women",
      name: "Home",
      featured: [
        {
          name: "New Arrivals",
          href: "#",
          imageSrc:
            "",
          imageAlt:
            "Models sitting back to back, wearing Basic Tee in black and bone.",
        },
        {
          name: "Basic Tees",
          href: "#",
          imageSrc:
            "https://tailwindui.com/img/ecommerce-images/mega-menu-category-02.jpg",
          imageAlt:
            "Close up of Basic Tee fall bundle with off-white, ochre, olive, and black tees.",
        },
      ],
      sections: [
        {
          id: "clothing",
          name: "Clothing",
          items: [
            { name: "Tops", href: "#" },
            { name: "Dresses", href: "#" },
            { name: "Pants", href: "#" },
            { name: "Denim", href: "#" },
            { name: "Sweaters", href: "#" },
            { name: "T-Shirts", href: "#" },
            { name: "Jackets", href: "#" },
            { name: "Activewear", href: "#" },
            { name: "Browse All", href: "#" },
          ],
        },
        {
          id: "accessories",
          name: "Accessories",
          items: [
            { name: "Watches", href: "#" },
            { name: "Wallets", href: "#" },
            { name: "Bags", href: "#" },
            { name: "Sunglasses", href: "#" },
            { name: "Hats", href: "#" },
            { name: "Belts", href: "#" },
          ],
        },
        {
          id: "brands",
          name: "Brands",
          items: [
            { name: "Full Nelson", href: "#" },
            { name: "My Way", href: "#" },
            { name: "Re-Arranged", href: "#" },
            { name: "Counterfeit", href: "#" },
            { name: "Significant Other", href: "#" },
          ],
        },
      ],
    },
    {
      id: "men",
      name: "Product",
      featured: [
        {
          name: "New Arrivals",
          href: "#",
          imageSrc:
            "https://tailwindui.com/img/ecommerce-images/product-page-04-detail-product-shot-01.jpg",
          imageAlt:
            "Drawstring top with elastic loop closure and textured interior padding.",
        },
        {
          name: "Artwork Tees",
          href: "#",
          imageSrc:
            "https://tailwindui.com/img/ecommerce-images/category-page-02-image-card-06.jpg",
          imageAlt:
            "Three shirts in gray, white, and blue arranged on table with same line drawing of hands and shapes overlapping on front of shirt.",
        },
      ],
      sections: [
        {
          id: "clothing",
          name: "Lồng chim",
          items: [
            { name: "LỒNG KHUYÊN", href: "#" },
            { name: "LỒNG ỐC MÍT HÚT MẬT", href: "#" },
            { name: "LỒNG CHOÈ THAN", href: "#" },
            { name: "LỒNG CHÀO MÀO", href: "#" },
            { name: "LỒNG CHÒE ĐẤT", href: "#" },
            { name: "LỒNG KHƯỚU,HOẠ MI", href: "#" },
            { name: "LỒNG CHOÈ LỬA", href: "#" },
          ],
        },
        {
          id: "accessories",
          name: "Phụ kiện lồng chim",
          items: [
            { name: "Miếng lót lồng chim", href: "#" },
            { name: "Móc treo lồng chim", href: "#" },
            { name: "Gậy ngồi", href: "#" },
            { name: "Hộp thức ăn", href: "#" },
            { name: "Gương và đồ trang trí", href: "#" },
          ],
        },
        // {
        //   id: "brands",
        //   name: "Brands",
        //   items: [
        //     { name: "Re-Arranged", href: "#" },
        //     { name: "Counterfeit", href: "#" },
        //     { name: "Full Nelson", href: "#" },
        //     { name: "My Way", href: "#" },
        //   ],
        // },
      ],
    },
  ],
  pages: [
    { name: "Company", href: "#" },
    { name: "Stores", href: "#" },
    { name: "Payment", href: "/payment" },
  ],
};

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}


const logout = () => {
  localStorage.removeItem('user');
  // Redirect to login page
  window.location.href = '/login';
};

const products = [
  { name: 'Log out', onClick: logout },
]


export default function ComHeader() {
  const [user] = useState(JSON.parse(localStorage.getItem('user')));
  const [open, setOpen] = useState(false);
  const [shoppingCart, setShoppingCart] = useState(false);

  const updateShoppingCartStatus = (newStatus) => {
    setShoppingCart(newStatus);
  };

  return (
    <>
      <ShoppingCart
        show={shoppingCart}
        updateShoppingCart={updateShoppingCartStatus}
      ></ShoppingCart>
      <Affix offsetTop={0} >
        <div className="bg-indigo-100">
          {/* Mobile menu */}
          <Transition.Root show={open} as={Fragment}>
            <Dialog
              as="div"
              className="relative z-40 lg:hidden"
              onClose={setOpen}
            >
              <Transition.Child
                as={Fragment}
                enter="transition-opacity ease-linear duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="transition-opacity ease-linear duration-300"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <div className="fixed inset-0 bg-black bg-opacity-25" />
              </Transition.Child>

              <div className="fixed inset-0 z-40 flex">
                <Transition.Child
                  as={Fragment}
                  enter="transition ease-in-out duration-300 transform"
                  enterFrom="-translate-x-full"
                  enterTo="translate-x-0"
                  leave="transition ease-in-out duration-300 transform"
                  leaveFrom="translate-x-0"
                  leaveTo="-translate-x-full"
                >
                  <Dialog.Panel className="relative flex w-full max-w-xs flex-col overflow-y-auto bg-white pb-12 shadow-xl">
                    <div className="flex px-4 pb-2 pt-5">
                      <button
                        type="button"
                        className="relative -m-2 inline-flex items-center justify-center rounded-md p-2 text-gray-400"
                        onClick={() => setOpen(false)}
                      >
                        <span className="absolute -inset-0.5" />
                        <span className="sr-only">Close menu</span>
                        <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                      </button>
                    </div>

                    {/* Links */}
                    <Tab.Group as="div" className="mt-2">
                      <div className="border-b border-gray-200">
                        <Tab.List className="-mb-px flex space-x-8 px-4">
                          {navigation.categories.map((category) => (
                            <Tab
                              key={category.name}
                              className={({ selected }) =>
                                classNames(
                                  selected
                                    ? "border-indigo-600 text-indigo-600"
                                    : "border-transparent text-gray-900",
                                  "flex-1 whitespace-nowrap border-b-2 px-1 py-4 text-base font-medium"
                                )
                              }
                            >
                              {category.name}
                            </Tab>
                          ))}
                        </Tab.List>
                      </div>
                      <Tab.Panels as={Fragment}>
                        {navigation.categories.map((category) => (
                          <Tab.Panel
                            key={category.name}
                            className="space-y-10 px-4 pb-8 pt-10"
                          >
                            <div className="grid grid-cols-2 gap-x-4">
                              {category.featured.map((item) => (
                                <div
                                  key={item.name}
                                  className="group relative text-sm"
                                >
                                  <div className="aspect-h-1 aspect-w-1 overflow-hidden rounded-lg bg-gray-100 group-hover:opacity-75">
                                    <img
                                      src={item.imageSrc}
                                      alt={item.imageAlt}
                                      className="object-cover object-center"
                                    />
                                  </div>
                                  <a
                                    href={item.href}
                                    className="mt-6 block font-medium text-gray-900"
                                  >
                                    <span
                                      className="absolute inset-0 z-10"
                                      aria-hidden="true"
                                    />
                                    {item.name}
                                  </a>
                                  <p aria-hidden="true" className="mt-1">
                                    Shop now
                                  </p>
                                </div>
                              ))}
                            </div>
                            {category.sections.map((section) => (
                              <div key={section.name}>
                                <p
                                  id={`${category.id}-${section.id}-heading-mobile`}
                                  className="font-medium text-gray-900"
                                >
                                  {section.name}
                                </p>
                                <ul
                                  role="list"
                                  aria-labelledby={`${category.id}-${section.id}-heading-mobile`}
                                  className="mt-6 flex flex-col space-y-6"
                                >
                                  {section.items.map((item) => (
                                    <li key={item.name} className="flow-root">
                                      <a
                                        href={item.href}
                                        className="-m-2 block p-2 text-gray-500"
                                      >
                                        {item.name}
                                      </a>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            ))}
                          </Tab.Panel>
                        ))}
                      </Tab.Panels>
                    </Tab.Group>

                    <div className="space-y-6 border-t border-gray-200 px-4 py-6">
                      {navigation.pages.map((page) => (
                        <div key={page.name} className="flow-root">
                          <a
                            href={page.href}
                            className="-m-2 block p-2 font-medium text-gray-900"
                          >
                            {page.name}
                          </a>
                        </div>
                      ))}
                    </div>

                    <div className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-end lg:space-x-6">
                      {user && user.accountId ? (
                        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
                          <Popover className="relative ">
                            {({ open }) => (
                              <>
                                <Popover.Button
                                  className={classNames(
                                    open ? 'text-gray-700' : 'text-gray-950',
                                    'group rounded-md inline-flex items-center text-base font-medium hover:text-gray-900 focus:outline-none '
                                  )}
                                >
                                  <span>Welcome, {user.email}</span>
                                  <ChevronDownIcon
                                    className={classNames(
                                      open ? 'text-gray-600' : 'text-gray-400',
                                      'ml-2 h-5 w-5 group-hover:text-gray-500'
                                    )}
                                    aria-hidden="true"
                                  />
                                </Popover.Button>

                                <Transition
                                  as={Fragment}
                                  enter="transition ease-out duration-200"
                                  enterFrom="opacity-0 translate-y-1"
                                  enterTo="opacity-100 translate-y-0"
                                  leave="transition ease-in duration-150"
                                  leaveFrom="opacity-100 translate-y-0"
                                  leaveTo="opacity-0 translate-y-1"
                                >
                                  <Popover.Panel
                                    focus
                                    static
                                    className="absolute z-10 -right-0 mt-3 transform pr-2 w-screen max-w-xs sm:px-0 lg:max-w-min"
                                  >
                                    <div className="rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 overflow-hidden">
                                      <div className="relative grid gap-6 bg-white px-5 py-6 sm:gap-8 sm:p-8">
                                        {/* <div className="flex items-center gap-4">
                                          <img
                                            className="h-10 w-10 rounded-full"
                                            src={user.avatar}
                                            alt=""
                                          />
                                          <div>
                                            <div className="text-base font-medium text-gray-800">{user.email}</div>
                                            <div className="text-sm font-medium text-gray-500">{user.role}</div>
                                          </div>
                                        </div> */}
                                        <div className="grid grid-cols-1 gap-4 sm:gap-6">
                                          <ComLink className="-m-3 p-3 pl-1 flex items-start rounded-lg hover:bg-gray-50">
                                            <UserCircleIcon className="flex-shrink-0 h-6 w-6 text-indigo-600" aria-hidden="true" />
                                            <div className="ml-4">
                                              <p className="text-base font-medium text-gray-900">Account</p>
                                            </div>
                                          </ComLink>
                                          <ComLink className="-m-3 p-3 pl-1 flex items-start rounded-lg hover:bg-gray-50">
                                            <CogIcon className="flex-shrink-0 h-6 w-6 text-indigo-600" aria-hidden="true" />
                                            <div className="ml-4">
                                              <p className="text-base font-medium text-gray-900">Settings</p>
                                            </div>
                                          </ComLink>
                                        </div>
                                        <div className="mt-1 flex justify-center">
                                          <ComButton onClick={() => logout()} className="w-full bg-indigo-600 border border-transparent rounded-md py-2 px-4 inline-flex justify-center text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm">
                                            Logout
                                          </ComButton>
                                        </div>
                                      </div>
                                    </div>
                                  </Popover.Panel>
                                </Transition>
                              </>
                            )}
                          </Popover>
                        </div>
                      ) : (
                        <>
                          <ComLink
                            to={routs["/login"].link}
                            className="text-sm font-medium text-gray-700 hover:text-gray-800"
                          >
                            {routs["/login"].name}
                          </ComLink>
                          <span className="h-6 w-px bg-gray-200" aria-hidden="true" />
                          <ComLink
                            to={routs["/reissue"].link}
                            className="text-sm font-medium text-gray-700 hover:text-gray-800"
                          >
                            {routs["/reissue"].name}
                          </ComLink>
                        </>
                      )}
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </Dialog>
          </Transition.Root>

          <header className="relative bg-indigo-50 z-10">
            <nav
              aria-label="Top"
              className="mx-auto max-w-full px-4 sm:px-6 lg:px-8"
            >
              <div className="border-b border-gray-200">
                <div className="flex h-16 items-center">
                  <button
                    type="button"
                    className="relative rounded-md bg-white p-2 text-gray-400 lg:hidden"
                    onClick={() => setOpen(true)}
                  >
                    <span className="absolute -inset-0.5" />
                    <span className="sr-only">Open menu</span>
                    <Bars3Icon className="h-6 w-6" aria-hidden="true" />
                  </button>

                  {/* Logo */}
                  <div className="ml-4 flex lg:ml-0">
                    <ComLink to={routs["/"].link}>
                      <img
                        className="h-16 w-auto "
                        src={images.logo}
                        alt=""
                      />
                    </ComLink>
                  </div>

                  {/* Flyout menus */}
                  <Popover.Group className="hidden lg:ml-8 lg:block lg:self-stretch">
                    <div className="flex h-full space-x-8">
                      {navigation.categories.map((category) => (
                        <Popover key={category.name} className="flex">
                          {({ open }) => (
                            <>
                              <div className="relative flex">
                                <Popover.Button
                                  className={classNames(
                                    open
                                      ? "border-indigo-600 text-indigo-600"
                                      : "border-transparent text-gray-700 hover:text-gray-800",
                                    "relative z-10 -mb-px flex items-center border-b-2 pt-px text-sm font-medium transition-colors duration-200 ease-out"
                                  )}
                                >
                                  {category.name}
                                </Popover.Button>
                              </div>

                              <Transition
                                as={Fragment}
                                enter="transition ease-out duration-200"
                                enterFrom="opacity-0"
                                enterTo="opacity-100"
                                leave="transition ease-in duration-150"
                                leaveFrom="opacity-100"
                                leaveTo="opacity-0"
                              >
                                <Popover.Panel className="absolute inset-x-0 top-full text-sm text-gray-500">
                                  {/* Presentational element used to render the bottom shadow, if we put the shadow on the actual panel it pokes out the top, so we use this shorter element to hide the top of the shadow */}
                                  <div
                                    className="absolute inset-0 top-1/2 bg-white shadow"
                                    aria-hidden="true"
                                  />

                                  <div className="relative bg-white">
                                    <div className="mx-auto max-w-7xl px-8">
                                      <div className="grid grid-cols-2 gap-x-8 gap-y-10 py-16">
                                        <div className="col-start-2 grid grid-cols-2 gap-x-8">
                                          {category.featured.map((item) => (
                                            <div
                                              key={item.name}
                                              className="group relative text-base sm:text-sm"
                                            >
                                              <div className="aspect-h-1 aspect-w-1 overflow-hidden rounded-lg bg-gray-100 group-hover:opacity-75">
                                                <img
                                                  src={item.imageSrc}
                                                  alt={item.imageAlt}
                                                  className="object-cover object-center"
                                                />
                                              </div>
                                              <a
                                                href={item.href}
                                                className="mt-6 block font-medium text-gray-900"
                                              >
                                                <span
                                                  className="absolute inset-0 z-10"
                                                  aria-hidden="true"
                                                />
                                                {item.name}
                                              </a>
                                              <p
                                                aria-hidden="true"
                                                className="mt-1"
                                              >
                                                Shop now
                                              </p>
                                            </div>
                                          ))}
                                        </div>
                                        <div className="row-start-1 grid grid-cols-3 gap-x-8 gap-y-10 text-sm">
                                          {category.sections.map((section) => (
                                            <div key={section.name}>
                                              <p
                                                id={`${section.name}-heading`}
                                                className="font-medium text-gray-900"
                                              >
                                                {section.name}
                                              </p>
                                              <ul
                                                role="list"
                                                aria-labelledby={`${section.name}-heading`}
                                                className="mt-6 space-y-6 sm:mt-4 sm:space-y-4"
                                              >
                                                {section.items.map((item) => (
                                                  <li
                                                    key={item.name}
                                                    className="flex"
                                                  >
                                                    <a
                                                      href={item.href}
                                                      className="hover:text-gray-800"
                                                    >
                                                      {item.name}
                                                    </a>
                                                  </li>
                                                ))}
                                              </ul>
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </Popover.Panel>
                              </Transition>
                            </>
                          )}
                        </Popover>
                      ))}

                      {navigation.pages.map((page) => (
                        <a
                          key={page.name}
                          href={page.href}
                          className="flex items-center text-sm font-medium text-gray-700 hover:text-gray-800"
                        >
                          {page.name}
                        </a>
                      ))}
                    </div>
                  </Popover.Group>

                 

                  {/* Cart */}
                  <div className="ml-4 flow-root lg:ml-6">
                    <button
                      onClick={() => {
                        setShoppingCart(true);
                      }}
                      className="group -m-2 flex items-center p-2"
                    >
                      <ShoppingBagIcon
                        className="h-6 w-6 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
                        aria-hidden="true"
                      />
                      <span className="ml-2 text-sm font-medium text-gray-700 group-hover:text-gray-800">
                        0
                      </span>
                      <span className="sr-only">items in cart, view bag</span>
                    </button>
                  </div>

                  <div className="flex lg:ml-6 pl-40">
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                      </span>
                      <input
                        className="block w-full bg-white border border-gray-300 rounded-md py-2 pl-10 pr-3 text-sm placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:placeholder-gray-400 sm:text-sm"
                        type="text"
                        name="search"
                        id="search"
                        placeholder="Search"
                      />
                    </div>
                  </div>

                  <div className="ml-auto flex items-center">
                    <div className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-end lg:space-x-6">
                      {user && user.accountId ? (
                        // <Popover className="relative">
                        //   <Popover.Button className="flex items-center gap-x-1 text-sm font-semibold leading-6 text-gray-900">
                        //     Hello, {user.email}
                        //     <ChevronDownIcon className="h-5 w-5 flex-none text-gray-400" aria-hidden="true" />
                        //   </Popover.Button>
                        //   <Transition
                        //     as={Fragment}
                        //     enter="transition ease-out duration-200"
                        //     enterFrom="opacity-0 translate-y-1"
                        //     enterTo="opacity-100 translate-y-0"
                        //     leave="transition ease-in duration-150"
                        //     leaveFrom="opacity-100 translate-y-0"
                        //     leaveTo="opacity-0 translate-y-1"
                        //   >
                        //     <Popover.Panel className="absolute top-full mt-2 w-56 rounded-md bg-white ring-1 ring-opacity-5 ">
                        //       <div className="py-1 ">
                        //         {products.map((item) => (
                        //           <div
                        //             key={item.name}
                        //             className="px-4 py-2 "
                        //           >
                        //             <ComLink onClick={item.onClick} to={item.href} className="block font-semibold whitespace-nowrap text-black">
                        //               {item.name}
                        //             </ComLink>
                        //             <p className="mt-1 text-sm text-gray-600">{item.description}</p>

                        //           </div>
                        //         ))}
                        //       </div>
                        //     </Popover.Panel>
                        //   </Transition>
                        // </Popover>

                        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
                          <Popover className="relative ">
                            {({ open }) => (
                              <>
                                <Popover.Button
                                  className={classNames(
                                    open ? 'text-gray-700' : 'text-gray-950',
                                    'group  rounded-md inline-flex items-center text-base font-medium hover:text-gray-900 focus:outline-none '
                                  )}
                                >
                                  <span>Welcome, {user.email}</span>
                                  <ChevronDownIcon
                                    className={classNames(
                                      open ? 'text-gray-600' : 'text-gray-400',
                                      'ml-2 h-5 w-5 group-hover:text-gray-500'
                                    )}
                                    aria-hidden="true"
                                  />
                                </Popover.Button>

                                <Transition
                                  as={Fragment}
                                  enter="transition ease-out duration-200"
                                  enterFrom="opacity-0 translate-y-1"
                                  enterTo="opacity-100 translate-y-0"
                                  leave="transition ease-in duration-150"
                                  leaveFrom="opacity-100 translate-y-0"
                                  leaveTo="opacity-0 translate-y-1"
                                >
                                  <Popover.Panel
                                    focus
                                    static
                                    className="absolute z-10 -right-0 mt-3 transform pr-2 w-screen max-w-xs sm:px-0 lg:max-w-min"
                                  >
                                    <div className="rounded-lg shadow-lg  overflow-hidden">
                                      <div className="relative grid gap-6 bg-white px-5 py-6 sm:gap-8 sm:p-8">
                                        {/* <div className="flex items-center gap-4">
                                          <img
                                            className="h-10 w-10 rounded-full"
                                            src={user.avatar}
                                            alt=""
                                          />
                                          <div>
                                            <div className="text-base font-medium text-gray-800">{user.email}</div>
                                            <div className="text-sm font-medium text-gray-500">{user.role}</div>
                                          </div>
                                        </div> */}
                                        <div className="grid grid-cols-1 gap-4 sm:gap-6">
                                          <ComLink className="-m-3 p-3 pl-1 flex items-start rounded-lg hover:bg-gray-50">
                                            <UserCircleIcon className="flex-shrink-0 h-6 w-6 text-indigo-600" aria-hidden="true" />
                                            <div className="ml-4">
                                              <p className="text-base font-medium text-gray-900">Account</p>
                                            </div>
                                          </ComLink>
                                          <ComLink className="-m-3 p-3 pl-1 flex items-start rounded-lg hover:bg-gray-50">
                                            <CogIcon className="flex-shrink-0 h-6 w-6 text-indigo-600" aria-hidden="true" />
                                            <div className="ml-4">
                                              <p className="text-base font-medium text-gray-900">Settings</p>
                                            </div>
                                          </ComLink>
                                        </div>
                                        <div className="mt-1 flex justify-center">
                                          <ComButton onClick={() => logout()} className="w-full bg-indigo-600 border border-transparent rounded-md py-2 px-4 inline-flex justify-center text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm">
                                            Logout
                                          </ComButton>
                                        </div>
                                      </div>
                                    </div>
                                  </Popover.Panel>
                                </Transition>
                              </>
                            )}
                          </Popover>
                        </div>
                        
                      ) : (
                        <>
                          <ComLink
                            to={routs["/login"].link}
                            className="text-sm font-medium text-gray-700 hover:text-gray-800"
                          >
                            {routs["/login"].name}
                          </ComLink>
                          <span className="h-6 w-px bg-gray-200" aria-hidden="true" />
                          <ComLink
                            to={routs["/reissue"].link}
                            className="text-sm font-medium text-gray-700 hover:text-gray-800"
                          >
                            {routs["/reissue"].name}
                          </ComLink>
                        </>
                      )}
                    </div>

                    
                  </div>
                </div>
              </div>
            </nav>
          </header>
        </div>
      </Affix>
    </>
  );
}
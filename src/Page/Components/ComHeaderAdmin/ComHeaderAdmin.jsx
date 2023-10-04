import { Fragment, useEffect, useState } from 'react'
import { Dialog, Disclosure, Popover, Transition } from '@headlessui/react'
import {
  Bars3Icon,

  XMarkIcon,
} from '@heroicons/react/24/outline'
import { ChevronDownIcon, } from '@heroicons/react/20/solid'
import { ComLink } from '../ComLink/ComLink'
import { Link, useNavigate } from 'react-router-dom'
import { getData } from '../../../api/api'
import { Affix } from 'antd'
import { useCookies } from 'react-cookie'
import images from '../../../img'
import { routs } from '../../../constants/ROUT'
import { textApp } from '../../../TextContent/textApp'

const products = [
  { name:routs['/createProduct'].name, href:routs['/createProduct'].link, },
  { name:routs['/tableProduct'].name, href: routs['/tableProduct'].link, },
]


function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function ComHeaderAdmin() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [cookies, setCookie, removeCookie] = useCookies(['accessToken']);
  const navigate = useNavigate();

  const handleDeleteCookie = () => {
    removeCookie('accessToken');
  };
  useEffect(() => {
    getData('/admin')
      .then((data) => {
        if (!data.data.admin) {
          navigate('/')
        }
        if (data.data.admin === 'login') {
          navigate('/login')
        }
      })
      .catch((error) => {
        console.log(error);
        navigate('/login')
      })

  }, [navigate]);
  return (
    <Affix offsetTop={0}>
      <header className="bg-white border-b border-gray-200">
        <nav className="mx-auto flex max-w-7xl items-center justify-between  lg:px-8" aria-label="Global">
          <div className="flex lg:flex-1">
          
              <span className="sr-only">Your Company</span>
              <img className="h-16 w-auto" src={images.logo} alt="" />
           
          </div>
          <div className="flex lg:hidden">
            <button
              type="button"
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
              onClick={() => setMobileMenuOpen(true)}
            >
              <span className="sr-only">Open main menu</span>
              <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <Popover.Group className="hidden lg:flex lg:gap-x-12">
            <Popover className="relative">
              <Popover.Button className="flex items-center gap-x-1 text-sm font-semibold leading-6  text-indigo-600 hover:text-indigo-500 ">
                {textApp.HeaderAdmin.product}
                <ChevronDownIcon className="h-5 w-5 flex-none font-semibold text-indigo-600 hover:text-indigo-500 " aria-hidden="true" />
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
                <Popover.Panel className="absolute -left-8 top-full z-10 mt-3  w-auto overflow-hidden rounded-md bg-white shadow-lg ring-1 ring-gray-900/5">
                  <div className="p-2">
                    {products.map((item) => (
                      <div
                        key={item.name}
                        className="group relative flex items-center gap-x-6 rounded-lg p-1 text-sm leading-6 hover:bg-gray-50"
                      >

                        <div className="min-w-full ">
                          <ComLink to={item.href} className=" font-semibold text-gray-900 whitespace-nowrap ">
                            {item.name}
                          </ComLink>
                          <p className="mt-1 text-gray-600">{item.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                </Popover.Panel>
              </Transition>
            </Popover>

            <a href="#" className="text-sm font-semibold leading-6 text-gray-900">
              Features
            </a>
            <a href="#" className="text-sm font-semibold leading-6 text-gray-900">
              Marketplace
            </a>
            <a href="#" className="text-sm font-semibold leading-6 text-gray-900">
              Company
            </a>
          </Popover.Group>
          <div className="hidden lg:flex lg:flex-1 lg:justify-end">
            <Link onClick={() => handleDeleteCookie()} to="/login" className="text-sm font-semibold leading-6 text-gray-900">
              Logout
            </Link>
          </div>
        </nav>
        <Dialog as="div" className="lg:hidden" open={mobileMenuOpen} onClose={setMobileMenuOpen}>
          <div className="fixed inset-0 z-10" />
          <Dialog.Panel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
            <div className="flex items-center justify-between">
          
                <img
                  className="h-16 w-auto"
                  src={images.logo}
                  alt=""
                />
             
              <button
                type="button"
                className="-m-2.5 rounded-md p-2.5 text-gray-700"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="sr-only">Close menu</span>
                <XMarkIcon className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
            <div className="mt-6 flow-root">
              <div className="-my-6 divide-y divide-gray-500/10">
                <div className="space-y-2 py-6">
                  <Disclosure as="div" className="-mx-3">
                    {({ open }) => (
                      <>
                        <Disclosure.Button className="flex w-full items-center justify-between rounded-lg py-2 pl-3 pr-3.5 text-base  leading-7 hover:bg-gray-50 font-semibold text-indigo-600 hover:text-indigo-500 ">
                          Product
                          <ChevronDownIcon
                            className={classNames(open ? 'rotate-180' : '', 'h-5 w-5 flex-none')}
                            aria-hidden="true"
                          />
                        </Disclosure.Button>
                        <Disclosure.Panel className="mt-2 space-y-2">
                          {[...products].map((item) => (
                            <ComLink
                              key={item.name}
                              as="a"
                              to={item.href}
                              className="block rounded-lg py-2 pl-6 pr-3 text-sm font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                            >
                              {item.name}
                            </ComLink>
                          ))}
                        </Disclosure.Panel>
                      </>
                    )}
                  </Disclosure>
                  <a
                    href="#"
                    className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                  >
                    Features
                  </a>
                  <a
                    href="#"
                    className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                  >
                    Marketplace
                  </a>
                  <a
                    href="#"
                    className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                  >
                    Company
                  </a>
                </div>
                <div className="py-6">
                  <Link onClick={() => handleDeleteCookie()} to="/login" className="text-sm font-semibold leading-6 text-gray-900">
                    Logout
                  </Link>
                </div>
              </div>
            </div>
          </Dialog.Panel>
        </Dialog>
      </header>
    </Affix>
  )
}
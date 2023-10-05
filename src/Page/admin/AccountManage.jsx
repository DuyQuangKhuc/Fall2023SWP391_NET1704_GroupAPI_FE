
import { useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from "yup"

import { Dropdown, Menu, Modal, Select, Table, Typography, notification } from 'antd';
import { textApp } from '../../TextContent/textApp';
import { getData, postData, putData } from '../../api/api';
import { firebaseImgs } from '../../upImgFirebase/firebaseImgs';
import ComHeaderAdmin from '../Components/ComHeaderAdmin/ComHeaderAdmin';
import ComButton from '../Components/ComButton/ComButton';
import ComUpImg from '../Components/ComUpImg/ComUpImg';
import ComInput from '../Components/ComInput/ComInput';
import ComTextArea from '../Components/ComInput/ComTextArea';
import ComNumber from '../Components/ComInput/ComNumber';
import { ChangeCircleTwoTone, DeleteForeverTwoTone, EditAttributesTwoTone, EditLocationAltTwoTone, EditNoteTwoTone } from '@mui/icons-material';


export default function TableProduct() {
    const [disabled, setDisabled] = useState(false);
    const [imagePath, setImages] = useState([]);
    const [material1, setMaterial1] = useState();
    const [material, setMaterial] = useState(material1);
    const [account, setAccount] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [productRequestDefault, setProductRequestDefault] = useState({});
    const [api, contextHolder] = notification.useNotification();
    const [selectedMaterials, setSelectedMaterials] = useState(material1);

    const showModalEdit = (e) => {
        setSelectedMaterials(e.material)
        setMaterial1(e.material)
        setProductRequestDefault({
            name: e.name,
            price: e.price,
            quantity: e.quantity,
            detail: e.detail,
            shape: e.shape,
            models: e.models,
            material: e.material,
            accessory: e.accessory,
            description: e.description,
            id: e._id
        })
        setIsModalOpen(true);
    };
    const options = [
        {
            label: "Gỗ",
            value: "Gỗ"
        },
        {
            label: "Nhựa",
            value: "Nhựa"
        },
        {
            label: "Kim Loại",
            value: "Kim loại"
        },
    ];

    const handleCancel = () => {
        setIsModalOpen(false);

    };
    const handleValueChange = (e, value) => {
        console.log(value);

        setValue("price", value, { shouldValidate: true });
    };

    const handleValueChange1 = (e, value) => {
        console.log(value);
        setValue("reducedPrice", value, { shouldValidate: true });
    };
    const handleChange = (value) => {
        setSelectedMaterials(value);
        setMaterial(value)
        console.log([value]);
    };

    const CreateProductMessenger = yup.object({

        name: yup.string().required(textApp.CreateProduct.message.name),
        price: yup.number().min(1, textApp.CreateProduct.message.priceMin).typeError(textApp.CreateProduct.message.price),
        price1: yup.string().required(textApp.CreateProduct.message.price).min(1, textApp.CreateProduct.message.priceMin).test('no-dots', textApp.CreateProduct.message.priceDecimal, value => !value.includes('.')),
        reducedPrice: yup.number().min(1, textApp.CreateProduct.message.priceMin).typeError(textApp.CreateProduct.message.price),
        reducedPrice1: yup.string().required(textApp.CreateProduct.message.price).min(1, textApp.CreateProduct.message.priceMin).test('no-dots', textApp.CreateProduct.message.priceDecimal, value => !value.includes('.')),
        quantity: yup.number().min(1, textApp.CreateProduct.message.quantityMin).typeError(textApp.CreateProduct.message.quantity),
        detail: yup.string().required(textApp.CreateProduct.message.detail),
        shape: yup.string().required(textApp.CreateProduct.message.shape),
        models: yup.string().required(textApp.CreateProduct.message.models),
        // material: yup.string().required(textApp.CreateProduct.message.material),
        accessory: yup.string().required(textApp.CreateProduct.message.accessory),
        description: yup.string().required(textApp.CreateProduct.message.description),
    })
    const createProductRequestDefault = {
        price: 1000,
        reducedPrice: 1000,

    };
    const methods = useForm({
        resolver: yupResolver(CreateProductMessenger),
        defaultValues: {
            name: "",
            price: "",
            quantity: "",
            detail: "",
            material: [],
            models: "",
            accessory: "",
            description: "",
        },
        values: productRequestDefault
    })
    const { handleSubmit, register, setFocus, watch, setValue } = methods

    const onSubmit = (data) => {
        setDisabled(true)
        firebaseImgs(imagePath)
            .then((dataImg) => {
                if (Array.isArray(imagePath) && imagePath.length === 0) {
                    const updatedData = {
                        ...data, // Giữ lại các trường dữ liệu hiện có trong data
                        material
                    };

                    putData(`/Product/Update-Product`, productRequestDefault.id, updatedData, {})
                        .then((dataS) => {
                            api["success"]({
                                message: 'Notification Title',
                                description:
                                    'This is the content of the notification. This is the content of the notification. This is the content of the notification.',
                            });
                        })
                        .catch((error) => {
                            console.error("Error fetching items:", error);
                            setDisabled(false)
                        });
                } else {
                    const updatedData = {
                        ...data, // Giữ lại các trường dữ liệu hiện có trong data
                        material,
                        imagePath: dataImg, // Thêm trường images chứa đường dẫn ảnh
                    };
                    putData(`/Product/List-Product`, productRequestDefault.id, updatedData, {})
                        .then((dataS) => {
                            api["success"]({
                                message: 'Notification Title',
                                description:
                                    'This is the content of the notification. This is the content of the notification. This is the content of the notification.',
                            });
                        })
                        .catch((error) => {
                            console.error("Error fetching items:", error);
                            setDisabled(false)
                        });
                }

            }
            )
            .catch((error) => {
                console.log(error)
            });
        setImages([]);
        setDisabled(false)
        setIsModalOpen(false);

    }

    useEffect(() => {
        getData('Account/Get-All-Account', {})
            .then((data) => {
                setAccount(data?.data)
                setDisabled(false)
            })
            .catch((error) => {
                console.error("Error fetching items:", error);
                setDisabled(false)
            });
    }, [disabled]);
    const onChange = (data) => {
        const selectedImages = data;
        // Tạo một mảng chứa đối tượng 'originFileObj' của các tệp đã chọn
        const newImages = selectedImages.map((file) => file.originFileObj);
        // Cập nhật trạng thái 'image' bằng danh sách tệp mới
        setImages(newImages);

    }
    const columns = [



        {
            title: 'ID',
            width: 50,
            dataIndex: 'accountId',
            key: 'accountId',
            fixed: 'left',
        },
        {
            title: 'Name',
            width: 150,
            dataIndex: 'name',
            key: 'name',
            // fixed: 'left',
            render: (_, record) => (
                <div >
                    <h1>{record.name ? record.name : "Empty"}</h1>
                </div>
            )
        },
        {
            title: 'Email',
            width: 150,
            dataIndex: 'email',
            key: 'email',
            render: (_, record) => (
                <div>
                    {record.email}
                </div>
            ),
        },
        {
            title: 'Password',
            width: 100,
            dataIndex: 'password',
            render: (_, record) => (
                <div >
                    {record.password ? "******" : ""}
                </div>
            ),
            key: 'password',
        },
        {
            title: 'Phone',
            dataIndex: 'phone',
            width: 150,
            key: 'phone',
            render: (_, record) => (
                <div >
                    {record.phone ? record.phone : "Empty"}
                </div>
            ),
        },
        {
            title: 'Address',
            dataIndex: 'address',
            width: 200,
            key: 'address',
            render: (_, record) => (
                <div >
                    {record.address ? record.address : "Empty"}
                </div>
            ),
        },
        {
            title: 'Point',
            width: 80,
            dataIndex: 'point',
            key: '1',
        },
        {
            title: 'Role',
            width: 80,
            dataIndex: 'role',
            key: 'role',
            render: (_, record) => (
                <div >
                    {record.role === 1 ? "Admin" : record.role === 2 ? "Manager" : record.role === 3 ? "Staff" : record.role === 4 ? "User" : ''}
                </div>
            ),
        },
        {
            title: 'Status',
            width: 80,
            dataIndex: 'status',
            key: 'status',
            render: (_, record) => (
                <div >
                    {record.status === 1 ? "Action" : record.status === 0 ? "Non-action" : ''}
                </div>
            ),
        },
        {
            title: '',
            width: 50,
            key: 'operation',
            fixed: 'right',
            render: (_, record) => (
                //onClick={() => showModalEdit(record)}
                <Dropdown 
                    placement="bottom"
                    overlay={
                        <Menu>
                            <Menu.Item key="1" >
                                <EditNoteTwoTone/> Edit
                            </Menu.Item>
                            <Menu.Item key="2">
                                <ChangeCircleTwoTone/> Role
                            </Menu.Item>
                            <Menu.Item key="3">
                                <DeleteForeverTwoTone /> Remove 
                            </Menu.Item>
                        </Menu>
                    }>
                    <Typography.Link >
                        •••
                    </Typography.Link>
                </Dropdown>

            )
        },
    ];
    const handleChangeSelect = (value) => {
        setSelectedMaterials(value);
    };
    return (
        <>
            {contextHolder}
            <ComHeaderAdmin />
            <div className='flex p-5 justify-center'>
                <Table
                    rowKey="_id"
                    columns={columns}
                    dataSource={account}
                    scroll={{
                        x: 1500,
                        // y: 500,
                    }}
                    bordered
                    pagination={{
                        showSizeChanger: true, // Hiển thị dropdown cho phép chọn số lượng dữ liệu
                        pageSizeOptions: ['10', '20', '50', '100'], // Các tùy chọn số lượng dữ liệu
                    }}
                />
            </div>
            <Modal title={textApp.TableProduct.title.change}
                okType="primary text-black border-gray-700"
                open={isModalOpen}

                width={1000}
                style={{ top: 20 }}

                onCancel={handleCancel}>
                <FormProvider {...methods} >
                    <form onSubmit={handleSubmit(onSubmit)} className="mx-auto mt-4 max-w-xl sm:mt-8">
                        <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
                            <div className="sm:col-span-2">
                                <div className="mt-2.5">
                                    <ComInput
                                        type="text"
                                        label={textApp.CreateProduct.label.name}
                                        placeholder={textApp.CreateProduct.placeholder.name}
                                        {...register("name")}
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <ComNumber
                                    label={textApp.CreateProduct.label.price}
                                    placeholder={textApp.CreateProduct.placeholder.price}
                                    // type="money"
                                    defaultValue={1000}
                                    min={1000}
                                    money
                                    onChangeValue={handleValueChange}
                                    {...register("price1")}
                                    required
                                />

                            </div>
                            <div>
                                <ComNumber
                                    label={textApp.CreateProduct.label.reducedPrice}
                                    placeholder={textApp.CreateProduct.placeholder.reducedPrice}
                                    // type="money"
                                    defaultValue={1000}
                                    min={1000}
                                    money
                                    onChangeValue={handleValueChange1}
                                    {...register("reducedPrice1")}
                                    required
                                />

                            </div>
                            <div>
                                <ComNumber
                                    label={textApp.CreateProduct.label.quantity}
                                    placeholder={textApp.CreateProduct.placeholder.quantity}
                                    // type="numbers"
                                    defaultValue={1}
                                    {...register("quantity")}
                                    required
                                />

                            </div>

                            <div className="">
                                {selectedMaterials}
                                <Select
                                    size={"large"}
                                    style={{
                                        width: '100%',
                                    }}
                                    value={selectedMaterials}
                                    mode="multiple"
                                    placeholder={textApp.CreateProduct.placeholder.material}
                                    onChange={handleChange}
                                    options={options}
                                />
                            </div>
                            <div className="sm:col-span-2">
                                <ComInput
                                    label={textApp.CreateProduct.label.shape}
                                    placeholder={textApp.CreateProduct.placeholder.shape}
                                    required
                                    type="text"
                                    {...register("shape")}
                                />
                            </div>
                            <div className="sm:col-span-2">
                                <ComInput
                                    label={textApp.CreateProduct.label.detail}
                                    placeholder={textApp.CreateProduct.placeholder.detail}
                                    required
                                    type="text"
                                    {...register("detail")}
                                />
                            </div>
                            <div className="sm:col-span-2">
                                <ComInput
                                    label={textApp.CreateProduct.label.models}
                                    placeholder={textApp.CreateProduct.placeholder.models}
                                    required
                                    type="text"
                                    {...register("models")}
                                />
                            </div>

                            <div className="sm:col-span-2">
                                <ComInput
                                    label={textApp.CreateProduct.label.accessory}
                                    placeholder={textApp.CreateProduct.placeholder.accessory}
                                    required
                                    type="text"
                                    {...register("accessory")}
                                />
                            </div>


                            <div className="sm:col-span-2">

                                <div className="mt-2.5">

                                    <ComTextArea
                                        label={textApp.CreateProduct.label.description}
                                        placeholder={textApp.CreateProduct.placeholder.description}
                                        rows={4}
                                        defaultValue={''}
                                        required
                                        maxLength={1000}
                                        {...register("description")}
                                    />
                                </div>
                            </div>
                            <div className="sm:col-span-1">
                                <ComUpImg onChange={onChange} />
                            </div>
                        </div>
                        <div className="mt-10">
                            <ComButton

                                disabled={disabled}
                                htmlType="submit"
                                type="primary"

                                className="block w-full rounded-md bg-indigo-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            >
                                {textApp.common.button.createProduct}
                            </ComButton>
                        </div>
                    </form>
                </FormProvider>

            </Modal>
        </>


    )


}

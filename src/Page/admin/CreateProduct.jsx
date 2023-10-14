
import { useState } from 'react'
import { postData } from '../../api/api'
import { textApp } from '../../TextContent/textApp'
import ComInput from '../Components/ComInput/ComInput'
import { FormProvider, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from "yup"
import ComUpImg from '../Components/ComUpImg/ComUpImg'
import { firebaseImgs } from '../../upImgFirebase/firebaseImgs'
import ComButton from '../Components/ComButton/ComButton'
import ComHeaderAdmin from '../Components/ComHeaderAdmin/ComHeaderAdmin'
import ComTextArea from '../Components/ComInput/ComTextArea'


export default function CreateProduct() {
    const [disabled, setDisabled] = useState(false);
    const [image, setImages] = useState([]);


    const CreateProductMessenger = yup.object({

        name: yup.string().required(textApp.CreateProduct.message.name),
        price: yup.string().required(textApp.CreateProduct.message.price),
        quantity: yup.string().required(textApp.CreateProduct.message.quantity),
        detail: yup.string().required(textApp.CreateProduct.message.detail),
        models: yup.string().required(textApp.CreateProduct.message.models),
        material: yup.string().required(textApp.CreateProduct.message.material),
        accessory: yup.string().required(textApp.CreateProduct.message.accessory),
        // image: yup.string().required(textApp.CreateProduct.message.image),
        description: yup.string().required(textApp.CreateProduct.message.description),
        // email: yup.string().email('định dạng sai').required('Login ID is required email'),
    })
    const CreateProductRequestDefault = {


    };
    const methods = useForm({
        resolver: yupResolver(CreateProductMessenger),
        defaultValues: {
            name: "",
            price: "",
            quantity: "",
            detail: "",
            models: "",
            material: "",
            accessory: "",
            image: [],
            describe: "",
        },
        values: CreateProductRequestDefault
    })
    const { handleSubmit, register, setFocus, watch, setValue } = methods

    const onSubmit = (data) => {
        console.log(data);
        setDisabled(true)
        firebaseImgs(image)
            .then((dataImg) => {
                console.log('ảnh nè : ', dataImg);
                const updatedData = {
                    ...data, // Giữ lại các trường dữ liệu hiện có trong data
                    image: dataImg, // Thêm trường images chứa đường dẫn ảnh
                };

                postData('/product', updatedData, {})
                    .then((dataS) => {
                        console.log(dataS);
                        setDisabled(false)
                    })
                    .catch((error) => {
                        console.error("Error fetching items:", error);
                        setDisabled(false)
                    });
            }
            )
            .catch((error) => {
                console.log(error)
            });


    }
    const onChange = (data) => {

        const selectedImages = data;

        // Tạo một mảng chứa đối tượng 'originFileObj' của các tệp đã chọn
        const newImages = selectedImages.map((file) => file.originFileObj);

        // Cập nhật trạng thái 'image' bằng danh sách tệp mới
        setImages(newImages);
        console.log(image);
        // setFileList(data);
    }

    return (
        <>
            <ComHeaderAdmin />

            <div className="isolate bg-white px-6 py-10 sm:py-10 lg:px-8">
                <div className="mx-auto max-w-2xl text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                        {textApp.CreateProduct.pageTitle}
                    </h2>

                </div>
                <FormProvider {...methods} >
                    <form onSubmit={handleSubmit(onSubmit)} className="mx-auto mt-16 max-w-xl sm:mt-20">
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
                                <ComInput
                                    label={textApp.CreateProduct.label.price}
                                    placeholder={textApp.CreateProduct.placeholder.price}
                                    type="numbers"
                                    {...register("price")}
                                    required
                                />

                            </div>
                            <div>

                                <ComInput
                                    label={textApp.CreateProduct.label.quantity}
                                    placeholder={textApp.CreateProduct.placeholder.quantity}
                                    type="numbers"
                                    {...register("quantity")}
                                    required
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
                                    label={textApp.CreateProduct.label.material}
                                    placeholder={textApp.CreateProduct.placeholder.material}
                                    required
                                    type="text"
                                    {...register("material")}
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

            </div>
        </>
    )
}

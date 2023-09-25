
import { FormProvider, useForm } from "react-hook-form";

import * as yup from "yup"
import { yupResolver } from '@hookform/resolvers/yup';
import ComInput from "../../Components/ComInput/ComInput";
import ComButton from "../../Components/ComButton/ComButton";
import { textApp } from "../../../TextContent/textApp";
import { ComLink } from "../../Components/ComLink/ComLink";
import { routs } from "../../../constants/ROUT";
import { useStorage } from "../../../hooks/useLocalStorage";
import { useEffect, useState } from "react";
import { postData } from "../../../api/api";
import ComHeader from "../../Components/ComHeader/ComHeader";
import { FieldError } from "../../Components/FieldError/FieldError";
import { Navigate } from "react-router-dom";



export default function Reissue() {

    const [data, setData] = useState({});
    const [disabled, setDisabled] = useState(false);

    const [showSuccess, setShowSuccess] = useState(false);
    const [showFailure, setShowFailure] = useState(false);

    const loginMessenger = yup.object({
        // code: yup.string().required(textApp.Reissue.message.username).min(5, "Username must be at least 5 characters"),
        username: yup.string().required(textApp.Reissue.message.username),
        phone: yup.string().required(textApp.Reissue.message.phone),
        password: yup.string().required(textApp.Reissue.message.password),
        // email: yup.string().email('định dạng sai').required('Login ID is required email'),
    })
    const LoginRequestDefault = {
        // code: "",
        password: "",
        phone: "",
        username: "",
        // email: "",

    };
    const methods = useForm({
        resolver: yupResolver(loginMessenger),
        defaultValues: {
            // code: "",
            username: "",
            phone: "",
            password: "",
            // email: "",
        },
        values: LoginRequestDefault
    })
    const { handleSubmit, register, setFocus, watch, setValue } = methods
    const onSubmit = (data) => {
        setDisabled(true)
        postData(`/LoginAndRegister/Add_Account?email=${data.username}&phone_number=${data.phone}&password=${data.password}`)
            .then((data) => {
                console.log(data);
                setDisabled(false)
                setShowSuccess(true);
                setTimeout(() => {
                    setShowSuccess(false);
                    Navigate('/login');
                }, 3000);
            })
            .catch((error) => {
                console.error("Error fetching items:", error);
                setDisabled(false)
                setShowFailure(true);
                setTimeout(() => {
                    setShowFailure(false);
                }, 3000);
            });
    }
    // console.log(disableds);
    // useEffect(() => {

    // }, [disableds]);
    return (
        <>
            <ComHeader />
            <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-sm">

                    <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                        Create in to your account
                    </h2>
                </div>

                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                    <FormProvider {...methods} >
                        <form className="flex flex-col gap-6" onSubmit={handleSubmit(onSubmit)}>

                            <ComInput
                                placeholder={textApp.Reissue.placeholder.username}
                                label={textApp.Reissue.label.username}
                                type="text"
                                // search
                                maxLength={15}
                                {...register("username")}
                                required
                            />

                            <ComInput
                                placeholder={textApp.Reissue.placeholder.phone}
                                label={textApp.Reissue.label.phone}
                                type="numbers"
                                maxLength={16}
                                {...register("phone")}
                                required
                            />
                            <ComInput
                                placeholder={textApp.Reissue.placeholder.password}
                                label={textApp.Reissue.label.password}
                                type="password"
                                maxLength={16}
                                {...register("password")}
                                required
                            />

                            <ComButton

                                disabled={disabled}
                                htmlType="submit"
                                type="primary"
                            >
                                {textApp.Reissue.pageTitle}
                            </ComButton>

                            {/* <ComButton
                                htmlType="submit"
                                type="primary"
                                className="bg-black hover:bg-white"
                            >
                                cancel
                            </ComButton> */}
                        </form>
                    </FormProvider>

                    <p className="mt-10 text-center text-sm text-gray-500">
                        Not a member?{' '}
                        <ComLink to={routs["/login"].link} >
                            <>{routs["/login"].name}</>
                        </ComLink>
                    </p>
                </div>
            </div>

            {showSuccess && (
                <div className="fixed inset-0 flex items-center justify-center">
                    <div className="bg-white p-4 rounded-lg shadow-lg">
                        <p className="text-green-500 font-bold">Account created successfully!</p>
                    </div>
                </div>
            )}

            {showFailure && (
                <div className="fixed inset-0 flex items-center justify-center">
                    <div className="bg-white p-4 rounded-lg shadow-lg">
                        <p className="text-red-500 font-bold">Failed to create account. Please try again.</p>
                    </div>
                </div>
            )}
        </>
    )

}


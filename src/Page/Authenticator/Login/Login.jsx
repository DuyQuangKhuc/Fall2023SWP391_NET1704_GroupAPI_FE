
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
import { useNavigate } from "react-router-dom";
import { FieldError } from "../../Components/FieldError/FieldError";


export default function Login() {
    const [token, setToken] = useStorage("user", null);
    const [disabled, setDisabled] = useState(false);
    const [Login, setLogin] = useState(false);

    const navigate = useNavigate();

    const loginMessenger = yup.object({
        // code: yup.string().required(textApp.Login.message.username).min(5, "Username must be at least 5 characters"),
        username: yup.string().required(textApp.Login.message.username),
        password: yup.string().required(textApp.Login.message.password),
        // email: yup.string().email('định dạng sai').required('Login ID is required email'),
    })
    const LoginRequestDefault = {
        // code: "",
        password: "",
        username: "",
        // email: "",

    };
    const methods = useForm({
        resolver: yupResolver(loginMessenger),
        defaultValues: {
            // code: "",
            username: "",
            password: "",
            // email: "",
        },
        values: LoginRequestDefault
    })
    const { handleSubmit, register, setFocus, watch, setValue } = methods
    const onSubmit = (data) => {
        setLogin(false)
        setDisabled(true)
        postData('/login', data, {})
            .then((data) => {
                console.log(data);
                setToken(data)
                setDisabled(false)
                navigate('/')
            })
            .catch((error) => {
                console.error("Error fetching items:", error);
                setDisabled(false)
                setLogin(true)
            });
    }
    // console.log(disableds);
    // useEffect(() => {

    // }, [disableds]);
    return (
        <>
        <ComHeader/>
            <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-sm">

                    <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                        Sign in to your account
                    </h2>
                </div>

                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                    <FormProvider {...methods} >
                        <form className="flex flex-col gap-6" onSubmit={handleSubmit(onSubmit)}>
                            {/* 
                            <ComInput
                                placeholder={textApp.Login.label.username}
                                label={textApp.Login.pageTitle}
                                type="numbers"
                                search
                                maxLength={5}
                                // minLength={4}
                                {...register("code")}
                                required
                            />

                            <ComInput
                                placeholder='question'
                                label='qưe'
                                type="text"
                                // search
                                maxLength={5}
                                {...register("username")}
                                required
                            />

                            <ComInput
                                placeholder='email'
                                label='email'
                                type="emails"
                                // search
                                {...register("email")}
                                required
                            />

                            <ComInput
                                placeholder='question'
                                label='qưe'
                                type="password"
                                maxLength={16}
                                {...register("password")}
                                required
                            /> */}

                            <ComInput
                                placeholder={textApp.Login.placeholder.username}
                                label={textApp.Login.label.username}
                                type="text"
                                // search
                                maxLength={15}
                                {...register("username")}
                                required
                            />

                            <ComInput
                                placeholder={textApp.Login.placeholder.password}
                                label={textApp.Login.label.password}
                                type="password"
                                maxLength={16}
                                {...register("password")}
                                required
                            />
                            
                            <FieldError className="text-red-500 text-center">{Login?textApp.Login.message.error:''}</FieldError>
                            <ComButton

                                disabled={disabled}
                                htmlType="submit"
                                type="primary"
                            >
                               {textApp.Login.pageTitle}
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
                        <ComLink to={routs["/reissue"].link} >
                            <>{routs["/reissue"].name}</>
                        </ComLink>
                    </p>
                </div>
            </div>

        </>
    )

}


import { register } from "@/app/api/auth";
import { Button, Input } from "@nextui-org/react"
import { useFormik } from "formik";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import * as Yup from 'yup';
import { setAccessToken } from "../../../auth/auth";
import { useRouter } from "next/navigation";
import ButtonToShowPassword from "@/app/components/ButtonToShowPassword";
import { setCookie } from "cookies-next";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";


const FormRegister = () => {
    const translation = useTranslations('CreateAnAccountForm');
    const router: AppRouterInstance = useRouter();
    const locale: string = useLocale();
    const [isVisiblePassword, setIsVisiblePassword] = useState(false);
    const [isVisibleConfirmPassword, setIsVisibleConfirmPassword] = useState(false);

    const validationSchema = Yup.object({
        username: Yup.string().required(translation('usernameRequired')),
        email: Yup.string().email(translation('emailValide')).required(translation('emailRequired')),
        password: Yup.string().required(translation('passwordRequired')),
        confirmPassword: Yup.string().required(translation('confirmPasswordRequired'))
    });

    const formik = useFormik({
        initialValues: {
            username: '',
            email: '',
            password: '',
            confirmPassword: '',
        },
        validationSchema,
        onSubmit: values => {
            const expires: Date = new Date();
            const nbrDays: number = 7;
            expires.setDate(expires.getDate() + nbrDays);

            register(values)
                .then((res) => {
                    setAccessToken(res.data.accessToken);
                    setCookie('userId', res.data.userId, {
                        expires: expires,
                    });
                    router.replace(`/${locale}/?about=true`);
                }).catch((err) => {
                    console.log("error: ", err);
                });
        },
    });

    return (
        <div className="flex flex-col justify-center items-center gap-6">
            <form onSubmit={formik.handleSubmit} className="space-y-4">
                <Input
                    id="username"
                    label={translation('username')}
                    type="text"
                    isRequired
                    labelPlacement="outside"
                    variant="bordered"
                    size="lg"
                    radius="full"
                    className="max-w-xs font-murecho font-bold"
                    onChange={formik.handleChange}
                    value={formik.values.username}
                    onBlur={formik.handleBlur}
                    aria-label="Username"
                    errorMessage={formik.touched.username && formik.errors.username ? formik.errors.username : null}
                />
                {formik.touched.username && formik.errors.username && (
                    <div className="text-red-500 font-murecho text-sm" role="alert">{formik.errors.username}</div>
                )}

                <Input
                    id="email"
                    label={translation('email')}
                    type="text"
                    isRequired
                    labelPlacement="outside"
                    variant="bordered"
                    size="lg"
                    radius="full"
                    className="max-w-xs font-murecho font-bold"
                    onChange={formik.handleChange}
                    value={formik.values.email}
                    onBlur={formik.handleBlur}
                    aria-label="Email address"
                    errorMessage={formik.touched.email && formik.errors.email ? formik.errors.email : null}
                />
                {formik.touched.email && formik.errors.email && (
                    <div className="text-red-500 font-murecho text-sm" role="alert">{formik.errors.email}</div>
                )}

                <Input
                    id="password"
                    label={translation('password')}
                    type={isVisiblePassword ? "text" : "password"}
                    isRequired
                    labelPlacement="outside"
                    variant="bordered"
                    size="lg"
                    radius="full"
                    className="max-w-xs font-murecho font-bold"
                    onChange={formik.handleChange}
                    value={formik.values.password}
                    onBlur={formik.handleBlur}
                    aria-label="Password"
                    errorMessage={formik.touched.password && formik.errors.password ? formik.errors.password : null}
                    endContent={<ButtonToShowPassword isVisible={isVisiblePassword} setIsVisible={setIsVisiblePassword} />}
                />
                {formik.touched.password && formik.errors.password && (
                    <div className="text-red-500 font-murecho text-sm" role="alert">{formik.errors.password}</div>
                )}

                <Input
                    id="confirmPassword"
                    label={translation('confirmPassword')}
                    type={isVisibleConfirmPassword ? "text" : "password"}
                    isRequired
                    labelPlacement="outside"
                    variant="bordered"
                    size="lg"
                    radius="full"
                    className="max-w-xs font-murecho font-bold"
                    onChange={formik.handleChange}
                    value={formik.values.confirmPassword}
                    onBlur={formik.handleBlur}
                    aria-label="Confirm password"
                    errorMessage={formik.touched.confirmPassword && formik.errors.confirmPassword ? formik.errors.confirmPassword : null}
                    endContent={<ButtonToShowPassword isVisible={isVisibleConfirmPassword} setIsVisible={setIsVisibleConfirmPassword} />}
                />
                {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                    <div className="text-red-500 font-murecho text-sm" role="alert">{formik.errors.confirmPassword}</div>
                )}

                <Button
                    type="submit"
                    size="lg"
                    radius="full"
                    className="font-murecho-bold text-white bg-[#1E3A8A] max-w-xs w-full mt-8 transition-colors"
                    aria-label="Register"
                >
                    {translation('button')}
                </Button>
            </form>
        </div>
    )
}

export { FormRegister }

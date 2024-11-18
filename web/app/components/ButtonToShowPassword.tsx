
import { Button } from "@nextui-org/react"
import { Dispatch, SetStateAction, useState } from "react";
import EyeFilledIcon from "@/public/icons/EyeFilled";
import { EyeSlashFilledIcon } from "@/public/icons/EyeSlashFilled";

const ButtonToShowPassword = ({ isVisible, setIsVisible }:
    {
        isVisible: boolean,
        setIsVisible: Dispatch<SetStateAction<boolean>>
    }) => {
    const toggleVisibility = () => { setIsVisible(!isVisible) };

    return (
        <Button className="focus:outline-none bg-transparent" disableRipple onClick={toggleVisibility} aria-label="toggle password visibility">
            <div className="ml-10">
                {isVisible ? (
                    <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                ) : (
                    <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                )}
            </div>
        </Button>
    )
}

export default ButtonToShowPassword;
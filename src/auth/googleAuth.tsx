import {JSX, useContext} from "react";
import {useLogin, useNotification, useTranslate} from "@refinedev/core";
import {Box, Button} from "@mui/material";
import {TokenResponse, useGoogleLogin} from '@react-oauth/google';

import {axiosInstance} from "../authProvider";
import {Google} from "@mui/icons-material";
import {buttonStyle} from "../styles";
import {ColorModeContext} from "../contexts";
import {useMobile} from "../hook";
import {useNavigate} from "react-router-dom";


type IProps = {
    type: "login" | "register",
    isUserAggre?: boolean,
    text?: "signin_with" | "signup_with" | "continue_with" | undefined
}

const GoogleButton = ({type, text = "signin_with", isUserAggre}: IProps): JSX.Element => {
    const {open} = useNotification();
    const translate = useTranslate();
    const {mode} = useContext(ColorModeContext);
    const {width} = useMobile();
    const navigate = useNavigate();
    const {mutate: login} = useLogin<CredentialResponse>();

    const onSuccess = async (tokenResponse: TokenResponse) => {
        try {
            const res = await axiosInstance.post(`/auth/${type}`, {
                access_token: tokenResponse?.access_token,
                registerBy: 'Google'
            });
            if (type === 'login') {
                login(res.data)
            } else {
                navigate('/login')
            }
        } catch (e: any) {
            open?.({
                type: "error",
                message: `${e?.response?.data?.error}`,
                description: "Wrong",
                key: "unique-id",
            });
        }
    }
    const onFailure = () => {
        open?.({
            type: "error",
            message: `Google auth error`,
            description: 'Wrong',
            key: 'google error'
        })
    }

    const handleGoogle = useGoogleLogin({
        onSuccess: onSuccess,
        onError: onFailure
    })

    return (
        <Box
            sx={{
                width: {xs: '48px', sm: '300px', md: '350px'},
                height: {xs: '48px', sm: '60px'},
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                "& div": {
                    width: '100%'
                },
            }}>
            <Button
                variant={'contained'}
                color={'info'}
                id={'googleButton'}
                disabled={type === 'register' && !isUserAggre}
                onClick={() => handleGoogle()}
                sx={{
                    ...buttonStyle,
                    display: 'flex',
                    gap: 2,
                    alignItems: 'center',
                    fontSize: {md: '20px'},
                    textTransform: 'inherit',
                    width: '100%',
                    minWidth: '48px',
                    height: '100%',
                    p: '5px',
                    bgcolor: mode === 'dark' ? "#13131a" : '#f2f2f8',
                    color: mode === 'light' ? "#13131a" : '#f2f2f8',
                    borderRadius: '7px',
                }}
            >
                <Google sx={{
                    fontSize: '30px',
                    borderRadius: '50%',
                    height: '100%',
                    width: 'auto',
                    aspectRatio: '1 / 1',
                }}/>
                {
                    width > 600 &&
                    translate(`buttons.google.${text}`)
                }
            </Button>
        </Box>
    )
};

export default GoogleButton;
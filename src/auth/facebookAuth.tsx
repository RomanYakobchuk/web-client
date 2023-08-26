import {ReactFacebookLoginInfo, ReactFacebookFailureResponse} from 'react-facebook-login';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';
import {Box, Button} from "@mui/material";
import {Facebook} from '@mui/icons-material';
import {useLogin, useNotification, useTranslate} from "@refinedev/core";
import {axiosInstance} from "../authProvider";
import {useMobile} from "../utils";

type IProps = {
    text: "signin_with" | "signup_with" | "continue_with" | undefined,
    type: "login" | "register"
}


const appId = `${process.env.REACT_APP_FACEBOOK_APP_ID}`;
const FacebookAuth = ({type, text}: IProps) => {
    FB?.init({
        appId: appId,
        status: true,
        xfbml: true,
        version: 'v17.0'
    })

    const {mutate: login} = useLogin<CredentialResponse>();
    const translate = useTranslate();
    const {width} = useMobile();
    const {open} = useNotification();

    const facebookAuth = async (userInfo: ReactFacebookLoginInfo) => {
        if (userInfo.id) {
            try {
                const res = await axiosInstance.post(`/auth/${type}`, {
                    registerBy: 'Facebook',
                    userId: userInfo?.userID,
                    access_token: userInfo?.accessToken
                });
                if (type === 'login') {
                    login(res.data)
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
    }

    const facebookFailure = (response: ReactFacebookFailureResponse) => {
        open?.({
            type: "error",
            message: `${response.status}`,
            description: 'Wrong',
            key: 'facebook error'
        })
    }

    return (
        <Box sx={{
            display: 'flex',
            height: {xs: '48px', sm: '60px'},
            width: {xs: '48px', sm: '300px', md: '350px'},
            justifyContent: 'center',
        }}>
            <FacebookLogin
                appId={appId}
                callback={facebookAuth}
                onFailure={facebookFailure}
                autoLoad={false}
                render={renderProps => (
                    <Button
                        color={'info'}
                        variant={'contained'}
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            borderRadius: '7px',
                            width: '100%',
                            height: '100%',
                            minWidth: '48px',
                            gap: '16px',
                            textTransform: 'inherit',
                            p: '5px',
                            fontSize: {sm: '20px'},
                            "& svg": {
                                fontSize: '40px'
                            }
                        }}
                        onClick={(event) => {
                            renderProps.onClick()
                        }}>
                        <Facebook/>
                        {
                            width > 600 &&
                            translate(`buttons.facebook.${text}`)
                        }
                    </Button>
                )}
            />
        </Box>
    );
};
export default FacebookAuth

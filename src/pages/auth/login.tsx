import {
    Box,
    Container,
    Typography,
    Grid,
    Avatar,
    Button,
    TextField,
    CssBaseline,
    FormControl, CircularProgress
} from "@mui/material";
import React, {useContext, useEffect, useState} from "react";
import {useForm} from "@refinedev/react-hook-form";
import {useNavigate, useNavigation, Link} from "react-router-dom";
import {FieldValues} from "react-hook-form";
import {useNotification} from "@refinedev/core";
import {useLogin, useTranslate} from "@refinedev/core";
import {VisibilityOffOutlined, VisibilityOutlined} from "@mui/icons-material";

import Copyright from "./utills/copyright";
import {IData} from "../../interfaces/common";
import {Header} from "../../layout";
import {ColorModeContext} from "../../contexts";
import {parseJwt, useMobile} from "../../utils";
import {axiosInstance} from "../../authProvider";
import {buttonStyle, textFieldStyle} from "../../styles";

const Login = () => {

    const translate = useTranslate();
    const {mode} = useContext(ColorModeContext);
    const navigate = useNavigate();
    const {mutate: login} = useLogin<IData>()
    const {open} = useNotification();
    const {width} = useMobile();

    const [size, setSize] = useState<'small' | 'medium' | undefined>('medium');
    const [showPass, setShowPass] = useState(false);
    const [showActiveAcc, setShowActiveAcc] = useState(false);
    const [error, setError] = useState<any>([])

    const {
        refineCore: {onFinish, formLoading},
        register,
        handleSubmit
    } = useForm({
        refineCoreProps: {
            resource: 'auth/login',
            onMutationError: (data) => {
                setError(data?.response?.data)
            },
            successNotification: (data: any) => {
                return {
                    type: "success",
                    message: data?.data?.message
                }
            }
        }
    },);

    const onFinishHandler = async (formData: FieldValues) => {
        if (!formData?.email || !formData?.password) return alert(translate("pages.login.notHave"))
        const {data}: IData | any = await onFinish({
            email: formData?.email,
            password: formData?.password
        });
        const user = data?.user ? parseJwt(data?.user) : null
        if (user?.isActivated) {
            login(data)
        }
    };


    useEffect(() => {
        if (error?.error && error?.code === 423) {
            setShowActiveAcc(true)
        } else if (error?.code === 400) {
            open?.({
                type: "error",
                message: `${error?.error}`,
                description: "Wrong",
                key: "unique-id",
            });
        } else {
            setShowActiveAcc(false)
        }
    }, [error])

    const handleShowPass = () => {
        showPass ? setShowPass(false) : setShowPass(true)
    }
    const ActivateAccount = async (data: FieldValues) => {
        if (!data?.email) return alert(translate("pages.login.notHaveAct"))
        await axiosInstance.post("/auth/activate", {
            email: data?.email
        })
    };
    useEffect(() => {
        if (width < 600) {
            setSize('small')
        }
    }, [width]);

    return (
        <Box sx={{
            width: '100%',
            flex: 1,
            minHeight: '100vh',
            height: '100%',
            bgcolor: mode === "dark" ? "#173d4f" : '#E9EEF2',
        }}>
            <Header/>
            <Container component="main" maxWidth="xs" sx={{
                bgcolor: 'transparent'
            }}>
                <CssBaseline/>
                <Box
                    sx={{
                        marginTop: 4,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Avatar src={`/images/logo.png`} onClick={() => navigate('/welcome')}
                            sx={{m: 1, cursor: 'pointer'}}/>
                    <Typography component="h1" variant="h5" fontSize={{xs: 18, md: 22}}>
                        {translate("pages.login.title")}
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit(onFinishHandler)} noValidate sx={{mt: 1}}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            size={size}
                            sx={textFieldStyle}
                            color={"secondary"}
                            label={translate("pages.login.fields.email")}
                            {...register("email", {required: true})}
                            autoComplete="email"
                            autoFocus
                        />
                        <FormControl fullWidth sx={{
                            position: 'relative'
                        }}>
                            <TextField
                                margin="normal"
                                required
                                size={size}
                                fullWidth
                                sx={textFieldStyle}
                                color={"secondary"}
                                {...register("password", {required: true})}
                                label={translate("pages.login.fields.password")}
                                type={showPass ? 'text' : 'password'}
                                id="password"
                                autoComplete="current-password"
                            />
                            <Box sx={{
                                cursor: 'pointer',
                                position: 'absolute',
                                zIndex: 20,
                                top: '45%',
                                right: '5%',
                                width: '20px',
                                height: '20px',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                "&:hover": {
                                    color: 'cornflowerblue'
                                }
                            }}>
                                {
                                    showPass ?
                                        <VisibilityOffOutlined onClick={handleShowPass}/> :
                                        <VisibilityOutlined onClick={handleShowPass}/>
                                }
                            </Box>
                        </FormControl>
                        {
                            showActiveAcc &&
                            <div>
                                <Typography>
                                    {translate("pages.login.errors.active")}
                                </Typography>
                                <Button fullWidth variant={"outlined"} onClick={handleSubmit(ActivateAccount)}>
                                    {translate("pages.login.activate")}
                                </Button>
                            </div>
                        }
                        <Grid item mt={2} mb={2}>
                            <Button type={"submit"}
                                    color={mode === "dark" ? "info" : "secondary"}
                                    variant={'contained'}
                                    sx={{
                                        ...buttonStyle,
                                        fontSize: '20px',
                                        textTransform: 'uppercase',
                                        width: '100%',
                                    }}>
                                {
                                    formLoading ? <CircularProgress/> :
                                        translate("pages.login.buttons.submit")
                                }
                            </Button>
                        </Grid>
                        <Grid container sx={{
                            display: 'flex',
                            mt: 4,
                            flexDirection: 'column',
                            gap: 1
                        }}>
                            <Link
                                to={'/forgot-password'}
                                style={{
                                    color: mode === 'dark' ? '#8aa4d3' : '#275ab7',
                                    fontSize: '16px',
                                    textTransform: 'none',
                                    width: '100%',
                                    transition: '300ms linear',
                                }}>
                                {translate("pages.login.buttons.forgotPassword")}
                            </Link>
                            <Box>
                                {translate("pages.login.buttons.noAccount") + ' '}
                                <Link
                                    to={'/register'}
                                    style={{
                                        color: mode === 'dark' ? '#8aa4d3' : '#275ab7',
                                        fontSize: '16px',
                                        textTransform: 'none',
                                        width: '100%',
                                        transition: '300ms linear',

                                    }}>
                                    {translate("pages.login.signup")}
                                </Link>
                            </Box>
                        </Grid>
                    </Box>
                </Box>
                <Copyright sx={{mt: 8, mb: 4}}/>
            </Container>
        </Box>
    );
}
export default Login;

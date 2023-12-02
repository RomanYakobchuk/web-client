import {
    Box,
    Typography,
    Grid,
    Avatar,
    Button,
    TextField,
    FormControl, CircularProgress
} from "@mui/material";
import React, {useContext, useEffect, useState} from "react";
import {useForm} from "@refinedev/react-hook-form";
import {useNavigate, Link} from "react-router-dom";
import {FieldValues} from "react-hook-form";
import {useNotification} from "@refinedev/core";
import {useLogin, useTranslate} from "@refinedev/core";
import {PriorityHigh, VisibilityOffOutlined, VisibilityOutlined} from "@mui/icons-material";

import {IData} from "../../interfaces/common";
import {ColorModeContext} from "../../contexts";
import {parseJwt} from "../../utils";
import {axiosInstance} from "../../authProvider";
import {buttonStyle, textFieldStyle} from "../../styles";
import ContainerComponent from "./utills/containerComponent";
import OrPart from "./utills/orPart";
import {ModalWindow} from "../../components";

const Login = () => {

    const translate = useTranslate();
    const {mode} = useContext(ColorModeContext);
    const navigate = useNavigate();
    const {mutate: login} = useLogin<IData>()
    const {open} = useNotification();

    const [openImportantly, setOpenImportantly] = useState<boolean>(false);
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
            action: 'create',
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
            password: formData?.password,
            registerBy: 'Email'
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

    const size = 'small', variant: "outlined" | "filled" | "standart" = 'outlined';

    return (
        <ContainerComponent>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    margin: 'auto',
                    maxWidth: '90%',
                    width: '400px'
                }}
            >
                <Avatar src={`/images/logo.png`} onClick={() => navigate('/welcome')}
                        sx={{m: 1, cursor: 'pointer'}}/>
                <Typography component="h1" variant="h5" fontSize={{xs: 18, md: 22}}>
                    {translate("pages.login.title")}
                </Typography>
                <Button
                    variant={'text'}
                    color={'warning'}
                    endIcon={<PriorityHigh/>}
                    onClick={() => setOpenImportantly(true)}
                >
                    {translate("pages.login.importantly.title")}
                </Button>
                {
                    openImportantly && (
                        <ModalWindow
                            open={openImportantly}
                            setOpen={setOpenImportantly}
                            contentProps={{
                                maxWidth: {xs: '90%', sm: '500px'},
                                height: '60vh',
                                borderRadius: '15px'
                            }}
                            title={
                                <Box sx={{
                                    width: '100%',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    fontWeight: 700,
                                    fontSize: {xs: '20px', sm: '24px'}
                                }}>
                                    {translate("pages.login.importantly.title")}
                                </Box>
                            }
                            bodyProps={{
                                p: '30px 20px'
                            }}
                        >
                            <Box sx={{
                                fontSize: {xs: '16px', sm: '18px'},
                                "& p": {
                                    fontSize: {xs: '16px', sm: '18px'},
                                },
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 2
                            }}>
                                <Typography>
                                    {translate('pages.login.importantly.loginMethod')}
                                </Typography>
                                <Box>
                                    <Box component={'span'}>
                                        {translate('pages.login.importantly.facebook.part1')}
                                    </Box>
                                    <Link
                                        style={{
                                            padding: '3px',
                                            margin: '0 3px',
                                            backgroundColor: 'silver',
                                            borderRadius: '5px'
                                        }}
                                        to={'https://www.facebook.com'}>
                                        {
                                            " " + "https://www.facebook.com" + " "
                                        }
                                    </Link>
                                    <Box component={'span'}>
                                        {translate('pages.login.importantly.facebook.part2')}
                                    </Box>
                                </Box>
                            </Box>
                        </ModalWindow>
                    )
                }
                <Box
                    component="form"
                    onSubmit={handleSubmit(onFinishHandler)}
                    noValidate
                    sx={{
                        mt: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        width: '100%',
                        gap: 3
                    }}
                >
                    <TextField
                        required
                        fullWidth
                        id="email"
                        size={size}
                        color={"secondary"}
                        variant={variant}
                        sx={{
                            ...textFieldStyle
                        }}
                        label={translate("pages.login.fields.email")}
                        {...register("email", {required: true})}
                        autoComplete="email"
                        autoFocus
                    />
                    <FormControl fullWidth sx={{
                        position: 'relative'
                    }}>
                        <TextField
                            required
                            variant={variant}
                            size={size}
                            fullWidth
                            color={"secondary"}
                            {...register("password", {required: true})}
                            label={translate("pages.login.fields.password")}
                            type={showPass ? 'text' : 'password'}
                            id="password"
                            sx={{
                                ...textFieldStyle
                            }}
                            autoComplete="current-password"
                        />
                        <Box sx={{
                            cursor: 'pointer',
                            position: 'absolute',
                            zIndex: 20,
                            top: '50%',
                            transform: 'translateY(-45%)',
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
                    <Grid item>
                        <Button type={"submit"}
                                color={mode === "dark" ? "info" : "secondary"}
                                variant={'contained'}
                                sx={{
                                    ...buttonStyle,
                                    fontSize: '20px',
                                    textTransform: 'inherit',
                                    width: '100%',
                                }}>
                            {
                                formLoading ? <CircularProgress/> :
                                    translate("pages.login.buttons.submit")
                            }
                        </Button>
                    </Grid>
                </Box>
                <OrPart
                    githubType={'login_github'}
                    googleType={'login'} googleText={'signin_with'} facebookType={'login'}
                        facebookText={'signin_with'}/>
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
        </ContainerComponent>
    );
}
export default Login;
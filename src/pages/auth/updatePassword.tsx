import {
    Avatar,
    Box, Button,
    CircularProgress,
    FormControl, Grid,
    TextField,
    Typography
} from "@mui/material";
import React, {useContext, useEffect, useState} from "react";
import {useNotification, useTranslate} from "@refinedev/core";
import {FieldValues} from "react-hook-form";
import {useForm} from "@refinedev/react-hook-form";
import {useLocation, useNavigate} from "react-router-dom";
import {VisibilityOffOutlined, VisibilityOutlined} from "@mui/icons-material";

import {parseJwt} from "../../utils";
import {ColorModeContext} from "../../contexts";
import {buttonStyle, textFieldStyle} from "../../styles";
import ContainerComponent from "./utills/containerComponent";

const UpdatePassword = () => {

    const translate = useTranslate();
    const {mode} = useContext(ColorModeContext);
    const navigate = useNavigate();
    const {open} = useNotification();
    const {search} = useLocation();
    const [showPass, setShowPass] = useState(false);
    const [showConfirmPass, setShowConfirmPass] = useState(false);

    const dateNow = new Date();
    const data_token = parseJwt(search?.split('=')[1]);
    useEffect(() => {
        if (data_token?.exp * 1000 < dateNow.getTime()) {
            open?.({
                type: "error",
                message: translate("pages.updatePassword.errors.timeIsUp"),
                description: "Wrong",
                key: "unique-id",
            });
            navigate('/update-password')
        }
    }, [data_token, dateNow])
    const {
        refineCore: {onFinish, formLoading},
        register,
        handleSubmit,
    } = useForm({
        refineCoreProps: {
            resource: 'auth/updatePassword',
        }
    },);

    useEffect(() => {
        if (!search?.split('=')[1]) {
            navigate("/")
        }
    }, [search?.split('=')[1]])

    const onFinishHandler = async (date: FieldValues) => {
        if (date?.password !== date?.confirmPassword) return alert(translate("pages.updatePassword.errors.confirmPasswordNotMatch"))
        try {
            const data = await onFinish({
                email: data_token?.email,
                password: date?.password,
                token: search?.split('=')[1] as string
            });
            if (data?.data?.message) {
                open?.({
                    type: 'success',
                    message: data?.data?.message,
                    description: 'Ok'
                })
                navigate('/login')
            }
        } catch (e: any) {
            console.log(e)
        }
    };

    const handleShowPass = () => {
        showPass ? setShowPass(false) : setShowPass(true)
    }
    const handleShowConfirmPass = () => {
        showConfirmPass ? setShowConfirmPass(false) : setShowConfirmPass(true)
    }
    return (
        <ContainerComponent >
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Avatar src={`/images/logo.png`} onClick={() => navigate('/welcome')}
                        sx={{m: 1, cursor: 'pointer'}}/>
                <Typography component="h1" variant="h5">
                    {translate("pages.updatePassword.title")}
                </Typography>
                <Box component="form" onSubmit={handleSubmit(onFinishHandler)} noValidate sx={{mt: 1}}>
                    <FormControl fullWidth sx={{
                        position: 'relative'
                    }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            color={"secondary"}
                            {...register("password", {
                                required: translate("capl.required", {field: translate(`pages.register.fields.password`)}),
                                pattern: {
                                    value: /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
                                    message: translate('pages.login.errors.passValid')
                                }
                            })}
                            label={translate("pages.login.fields.password")}
                            type={showPass ? 'text' : 'password'}
                            id="password"
                            sx={textFieldStyle}
                            placeholder={"Example: Thsd_e28gv"}
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
                    <FormControl fullWidth sx={{
                        position: 'relative'
                    }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            sx={textFieldStyle}
                            inputProps={{pattern: "/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?\\d)(?=.*?[#?!@$%^&*-]).{8,}$/"}}
                            {...register("confirmPassword", {required: true})}
                            label={translate("pages.updatePassword.fields.confirmPassword")}
                            type={showConfirmPass ? 'text' : 'password'}
                            color={"secondary"}
                            id="confirmPassword"
                            placeholder={"Example: Thsd_e28gv"}
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
                                showConfirmPass ?
                                    <VisibilityOffOutlined onClick={handleShowConfirmPass}/> :
                                    <VisibilityOutlined onClick={handleShowConfirmPass}/>
                            }
                        </Box>
                    </FormControl>
                    <Grid item mt={2} mb={2}>
                        <Button
                            type={"submit"}
                            color={mode === "dark" ? "info" : "secondary"} variant={"contained"}
                            fullWidth
                            sx={buttonStyle}
                        >
                            {
                                formLoading ?
                                    <CircularProgress/> :
                                    translate("pages.updatePassword.buttons.submit")
                            }
                        </Button>
                    </Grid>
                </Box>
            </Box>
        </ContainerComponent>
    );
};

export default UpdatePassword;
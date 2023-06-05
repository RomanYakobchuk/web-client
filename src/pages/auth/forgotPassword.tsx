import {
    Avatar,
    Box,
    Button,
    CircularProgress,
    Container,
    CssBaseline,
    Grid,
    TextField,
    Typography
} from "@mui/material";
import React, {useContext, useEffect, useState} from "react";
import {useNotification, useTranslate} from "@refinedev/core";
import {FieldValues} from "react-hook-form";
import {useForm} from "@refinedev/react-hook-form";
import {useNavigate} from "react-router-dom";

import {Header} from "../../components/layout";
import Copyright from "./utills/copyright";
import {ColorModeContext} from "../../contexts";

const ForgotPassword = () => {

    const translate = useTranslate();
    const {mode} = useContext(ColorModeContext);
    const navigate = useNavigate();
    const {open} = useNotification();
    const [error, setError] = useState<any>([]);

    const {
        refineCore: {onFinish, formLoading},
        register,
        handleSubmit,
    } = useForm({
        refineCoreProps: {
            resource: 'auth/forgotPassword',
            onMutationError: (data) => {
                setError(data?.response?.data)
            },
        }
    },);
    const onFinishHandler = async (date: FieldValues) => {
        if (!date?.email) return alert(translate("pages.forgotPassword.errors.validEmail"))
        await onFinish({
            email: date?.email
        });

    };
    useEffect(() => {
        if (error?.error && error?.code === 400) {
            open?.({
                type: "error",
                message: translate("pages.forgotPassword.errors.validEmail"),
                description: "Wrong",
                key: "unique-id",
            });
        }
    }, [error])
    return (
        <Box sx={{
            width: '100%',
            flex: 1,
            minHeight: '100vh',
            bgcolor: mode === "dark" ? "#173d4f" : '#E9EEF2',
        }}>
            <Header/>
            <Container component="main" maxWidth="xs" sx={{
                bgcolor: 'transparent'
            }}>
                <CssBaseline/>
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
                    <Typography component="h1" variant="h5" fontSize={{xs: 18, md: 22}}>
                        {translate("pages.forgotPassword.title")}
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit(onFinishHandler)} noValidate sx={{mt: 1}}>
                        <TextField
                            margin="normal"
                            required
                            minRows={5}
                            fullWidth
                            color={"secondary"}
                            id="email"
                            label={translate("pages.forgotPassword.fields.email")}
                            {...register('email', {required: true})}
                            autoComplete="code"
                            autoFocus
                        />
                        <Grid container mt={4} flexDirection={"column"} gap={2}>
                            <Button
                                type={"submit"}
                                sx={{
                                    color: '#fcfcfc',
                                    fontSize: '18px',
                                    textTransform: 'none',
                                    bgcolor: 'blue',
                                    width: '100%',
                                    transition: '300ms linear',
                                    p: '10px 20px',
                                    "&:hover": {
                                        bgcolor: '#1d3c6b'
                                    }
                                }}>
                                {
                                    formLoading ?
                                        <CircularProgress/> :
                                        translate("pages.forgotPassword.buttons.submit")
                                }
                            </Button>
                            <Button
                                onClick={() => navigate('/login')}
                                sx={{
                                    color: '#fcfcfc',
                                    fontSize: '16px',
                                    textTransform: 'none',
                                    bgcolor: mode === "dark" ? "#5689c0" : "#244d61",
                                    width: '100%',
                                    transition: '300ms linear',
                                    "&:hover": {
                                        bgcolor: '#1d3c6b'
                                    }
                                }}>
                                {translate("pages.register.buttons.haveAccount") + translate("pages.login.signin")}
                            </Button>
                        </Grid>
                    </Box>
                </Box>
                <Copyright sx={{mt: 8, mb: 4}}/>
            </Container>
        </Box>
    );
};

export default ForgotPassword;
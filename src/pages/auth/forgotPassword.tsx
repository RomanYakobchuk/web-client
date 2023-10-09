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
import {Link, useNavigate} from "react-router-dom";

import {Header} from "../../layout";
import Copyright from "./utills/copyright";
import {ColorModeContext} from "../../contexts";
import {useMobile} from "../../hook";
import {buttonStyle, textFieldStyle} from "../../styles";
import ContainerComponent from "./utills/containerComponent";

const ForgotPassword = () => {

    const translate = useTranslate();
    const {mode} = useContext(ColorModeContext);
    const navigate = useNavigate();
    const {width} = useMobile();
    const {open} = useNotification();

    const [size, setSize] = useState<'small' | 'medium' | undefined>('medium');
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
    }, [error]);

    useEffect(() => {
        if (width < 600) {
            setSize('small');
        }
    }, [width])
    return (
        <ContainerComponent pictureProps={{
            order: 1
        }}>
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    minWidth: '270px'
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
                        size={size}
                        sx={{
                            ...textFieldStyle,
                            minWidth: '300px'
                        }}
                        label={translate("pages.forgotPassword.fields.email")}
                        {...register('email', {required: true})}
                        autoComplete="code"
                        autoFocus
                    />
                    <Grid container mt={4} flexDirection={"column"} gap={2}>
                        <Button
                            color={mode === "dark" ? "info" : "secondary"}
                            variant={'contained'}
                            type={"submit"}
                            sx={{
                                ...buttonStyle,
                                textTransform: 'none',
                                width: '100%',
                            }}>
                            {
                                formLoading ?
                                    <CircularProgress/> :
                                    translate("pages.forgotPassword.buttons.submit")
                            }
                        </Button>
                        <Box>
                            {translate("pages.register.buttons.haveAccount") + ' '}
                            <Link
                                to={'/login'}
                                style={{
                                    color: mode === 'dark' ? '#8aa4d3' : '#275ab7',
                                    fontSize: '16px',
                                    textTransform: 'none',
                                    width: '100%',
                                    transition: '300ms linear',

                                }}>
                                {translate("pages.login.signin")}
                            </Link>
                        </Box>
                    </Grid>
                </Box>
            </Box>
        </ContainerComponent>
    );
};

export default ForgotPassword;
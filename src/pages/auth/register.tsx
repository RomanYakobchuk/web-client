import {
    Box,
    Container,
    Typography,
    Grid,
    Checkbox,
    Avatar,
    Button,
    TextField,
    CssBaseline,
    FormControl, CircularProgress, Select, MenuItem, InputLabel
} from "@mui/material";
import React, {ChangeEvent, useContext, useEffect, useState} from "react";
import {FieldValues} from "react-hook-form";
import {useNotification, useTranslate} from "@refinedev/core";
import {
    ErrorOutlineOutlined,
    VisibilityOffOutlined,
    VisibilityOutlined
} from "@mui/icons-material";
import {useForm} from "@refinedev/react-hook-form";
import {Link, useNavigate} from "react-router-dom";

import {Header} from "../../layout";
import Copyright from "./utills/copyright";
import UserAgreement from "../../components/userAgreement";
import {ColorModeContext} from "../../contexts";
import {ModalWindow} from "../../components";
import {buttonStyle, selectStyle, textFieldStyle} from "../../styles";
import {useMobile} from "../../utils";

const Register = () => {
    const translate = useTranslate();
    const navigate = useNavigate();
    const {mode} = useContext(ColorModeContext);
    const {open} = useNotification();
    const {width} = useMobile();

    const [size, setSize] = useState<'small' | 'medium' | undefined>('medium');
    const [show, setShow] = useState(false);
    const [error, setError] = useState<any>([]);
    const [accept, setAccept] = useState(false);
    const [showPass, setShowPass] = useState(false);
    const [openModal, setOpenModal] = useState(false);

    const {
        refineCore: {onFinish, formLoading},
        register,
        handleSubmit,
    } = useForm({
        refineCoreProps: {
            resource: 'auth/register',
            onMutationError: (data) => {
                setError(data?.response?.data)
            },
            redirect: false
        }
    },);


    const onFinishHandler = async (data: FieldValues) => {
        if (!accept) return alert(translate("agreement.alert"));

        if (data?.dOB > (new Date().getFullYear() - 18)) {
            return alert(translate("account.edit.alert"))
        }

        await onFinish({
            ...data
        });

        setOpenModal(true)

    };

    useEffect(() => {
        if (error?.error && error?.code === 409) {
            open?.({
                type: "error",
                message: `${error?.error}`,
                description: "Wrong",
                key: "unique-id",
            });
        }
    }, [error])
    const handleShowPass = () => {
        showPass ? setShowPass(false) : setShowPass(true)
    }

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
            pb: '30px',
            bgcolor: mode === "dark" ? "#173d4f" : '#E9EEF2',
        }}>
            <Header/>
            <Container component="main" maxWidth="xs" sx={{
                bgcolor: 'transparent'
            }}>
                <CssBaseline/>
                <Box
                    sx={{
                        marginTop: 2,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Avatar src={`/images/logo.png`} onClick={() => navigate('/welcome')}
                            sx={{m: 1, cursor: 'pointer'}}/>
                    <Typography component="h1" variant="h5" fontSize={{xs: 18, md: 22}}>
                        {translate("pages.register.title")}
                    </Typography>
                    <Typography component={"h3"} color={'red'}>
                        {translate("importantText")}
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit(onFinishHandler)} noValidate sx={{mt: 3}}>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <TextField
                                    autoComplete="given-name"
                                    required
                                    color={"secondary"}
                                    fullWidth
                                    size={size}
                                    sx={textFieldStyle}
                                    id="name"
                                    label={translate("pages.register.fields.name")}
                                    autoFocus
                                    {...register('name', {required: true})}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    size={size}
                                    fullWidth
                                    id="phone"
                                    sx={textFieldStyle}
                                    color={"secondary"}
                                    label={translate("pages.register.fields.phone")}
                                    defaultValue={'+380'}
                                    inputProps={{pattern: "/\\(?\\+[0-9]{1,3}\\)? ?-?[0-9]{1,3} ?-?[0-9]{3,5} ?-?[0-9]{4}( ?-?[0-9]{3})? ?(\\w{1,10}\\s?\\d{1,6})?/"}}
                                    autoComplete="family-name"
                                    {...register('phone', {required: true})}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    sx={textFieldStyle}
                                    id="email"
                                    size={size}
                                    color={"secondary"}
                                    inputProps={{pattern: "/^([^.@]+)(\\.[^.@]+)*@([^.@]+\\.)+([^.@]+)$/"}}
                                    label={translate("pages.register.fields.email")}
                                    type={"email"}
                                    {...register('email', {required: true})}
                                    autoComplete="email"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    required
                                    size={size}
                                    id="outlined-basic"
                                    color={"secondary"}
                                    type={"date"}
                                    sx={textFieldStyle}
                                    inputProps={{}}
                                    defaultValue={"2000-01-01"}
                                    label={translate("pages.register.fields.dOB")}
                                    variant="outlined"
                                    {...register('dOB', {required: true})}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <FormControl fullWidth>
                                    <InputLabel color={"secondary"}
                                                id="demo-simple-select-label">{translate('pages.login.fields.role')}</InputLabel>
                                    <Select
                                        required
                                        fullWidth
                                        size={size}
                                        color={"secondary"}
                                        labelId="demo-simple-select-label"
                                        defaultValue={'user'}
                                        sx={selectStyle}
                                        label={translate('pages.login.fields.role')}
                                        {...register('status', {required: true})}
                                    >
                                        <MenuItem value={'user'}>{translate("roles.user")}</MenuItem>
                                        <MenuItem value={'manager'}>{translate("roles.manager")}</MenuItem>
                                    </Select>
                                </FormControl>

                            </Grid>
                            <Grid item xs={12}>
                                <FormControl fullWidth sx={{
                                    position: 'relative'
                                }}>
                                    <TextField
                                        margin="normal"
                                        required
                                        fullWidth
                                        label={translate("pages.login.fields.password")}
                                        type={showPass ? 'text' : 'password'}
                                        sx={textFieldStyle}
                                        color={"secondary"}
                                        id="password"
                                        size={size}
                                        placeholder={"Example: Thsd_e28gv"}
                                        inputProps={{pattern: "/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?\\d)(?=.*?[#?!@$%^&*-]).{8,}$/"}}
                                        {...register('password', {required: true})}
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
                            </Grid>
                            <Grid item xs={12}>
                                <FormControl sx={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'start'
                                }}>
                                    <Checkbox checked={accept} value="allowExtraEmails"
                                              onChange={(e: ChangeEvent<HTMLInputElement>) => setAccept(e.target.checked)}
                                              color={'secondary'} required/>
                                    <Typography sx={{
                                        cursor: 'pointer',
                                        "&:hover": {
                                            color: 'cornflowerblue'
                                        },
                                        display: 'flex',
                                        flexDirection: 'row',
                                        gap: 1,
                                        alignItems: 'center'
                                    }}
                                                onClick={() => setShow(true)}
                                    >
                                        {translate("agreement.accept")}
                                        <ErrorOutlineOutlined/>
                                    </Typography>
                                </FormControl>
                            </Grid>
                            <UserAgreement show={show} setShow={setShow}/>
                        </Grid>
                        <Grid item mt={2} mb={2}>
                            <Button
                                type={"submit"}
                                variant={'contained'}
                                color={mode === "dark" ? "info" : "secondary"}
                                sx={{
                                    ...buttonStyle,
                                    fontSize: '18px',
                                    width: '100%',
                                }}>
                                {
                                    formLoading ? <CircularProgress/> :
                                        translate("pages.register.buttons.submit")}
                            </Button>
                        </Grid>
                        <Grid container justifyContent="start">
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
                {/*<ModalWindow textButtonCancel={translate("buttons.close")}*/}
                {/*             textButtonConfirm={translate("verify.openGmail")}*/}
                {/*             textTitle={translate("verify.activation")} message={translate("verify.verifyMes")}*/}
                {/*             handleSubmit={() => window.location.replace('https://mail.google.com/')} open={openModal}*/}
                {/*             close={setOpenModal}/>*/}
                <Copyright sx={{mt: 5}}/>
            </Container>
        </Box>
    );
}
export default Register;
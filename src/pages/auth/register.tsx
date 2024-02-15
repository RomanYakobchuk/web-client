import {
    Box,
    Typography,
    Grid,
    Checkbox,
    Avatar,
    Button,
    TextField,
    FormControl, CircularProgress, MenuItem, SxProps
} from "@mui/material";
import {useStepsForm} from "@refinedev/react-hook-form";
import React, {ChangeEvent, useContext, useEffect, useState} from "react";
import {FieldValues} from "react-hook-form";
import {HttpError, useNotification, useTranslate} from "@refinedev/core";
import {
    Check,
    ErrorOutlineOutlined,
    VisibilityOffOutlined,
    VisibilityOutlined
} from "@mui/icons-material";
import {Link, useNavigate} from "react-router-dom";
import dayjs from "dayjs";

import {ColorModeContext} from "../../contexts";
import {buttonStyle, selectStyle, textFieldStyle} from "../../styles";
import ContainerComponent from "./utills/containerComponent";
import {ModalWindow} from "@/components";
import OrPart from "./utills/orPart";
import UserAgreement from "./utills/userAgreement";
import {StepTitles} from "@/components/steps/stepTitles";
import {StepButtons} from "@/components/steps/stepButtons";

const Register = () => {
    const translate = useTranslate();
    const navigate = useNavigate();
    const {mode} = useContext(ColorModeContext);
    const {open} = useNotification();

    const [show, setShow] = useState(false);
    const [error, setError] = useState<any>([]);
    const [accept, setAccept] = useState(false);
    const [showPass, setShowPass] = useState(false);
    const [openModal, setOpenModal] = useState(false);

    const {
        refineCore: {onFinish, formLoading},
        register,
        handleSubmit,
        steps: {gotoStep, currentStep},
        formState: {errors}
    } = useStepsForm<IRegister, HttpError, IRegister>({
        refineCoreProps: {
            resource: 'auth/register',
            action: 'create',
            onMutationError: (data) => {
                setError(data?.response?.data)
            },
            redirect: false
        },
        stepsProps: {
            defaultStep: 0
        }
    },);

    const stepTitles = [translate('pages.register.steps.first'), translate('pages.register.steps.second')]

    const onFinishHandler = async (data: FieldValues) => {
        if (!accept) return alert(translate("agreement.alert"));

        if (data?.dOB > (new Date().getFullYear() - 18)) {
            return alert(translate("account.edit.alert"))
        }
        const response: any = await onFinish({
            ...data,
            registerBy: "Email"
        } as IRegister);
        if (response?.data) {
            if (!response?.data?.isVerify) {
                setOpenModal(true)
            }
        }
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

    const size = 'small', variant: "outlined" | "filled" | "standart" = 'outlined';

    const requiredText = (field: string) => translate("capl.required", {field: translate(`pages.register.fields.${field}`)});

    const itemContainerStepStyle: SxProps = {
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        width: '100%'
    }
    const now = new Date();
    const color = "secondary";

    const textFieldCurrentStyle = {
        ...textFieldStyle
    }

    const renderFormByStep = (step: number) => {
        switch (step) {
            case 0:
                return (
                    <Box
                        key={'0'}
                        sx={{
                            ...itemContainerStepStyle
                        }}
                    >
                        <FormControl>
                            <TextField
                                required
                                size={size}
                                fullWidth
                                id="phone"
                                variant={variant}
                                // sx={textFieldStyle}
                                color={color}
                                label={translate("pages.register.fields.phone")}
                                defaultValue={'+380'}
                                sx={{
                                    ...textFieldCurrentStyle
                                }}
                                // type={'tel'}
                                // inputProps={{pattern: }}
                                {...register('phone', {
                                    required: requiredText('phone'),
                                    pattern: {
                                        value: /^\+?3?8?(0\d{9})$/,
                                        message: 'Phone number not valid'
                                    }
                                })}
                            />
                            {errors.phone && (
                                <span>{errors?.phone?.message as string}</span>
                            )}
                        </FormControl>
                        <FormControl>
                            <TextField
                                fullWidth
                                required
                                size={size}
                                id={"dOB"}
                                variant={variant}
                                color={color}
                                type={"date"}
                                sx={{
                                    ...textFieldCurrentStyle
                                }}
                                // sx={textFieldStyle}
                                defaultValue={"2000-01-01"}
                                label={translate("pages.register.fields.dOB")}
                                {...register('dOB', {
                                    required: requiredText('dOB'),
                                    max: {
                                        value: dayjs(new Date(now.getFullYear() - 18, now.getMonth(), now.getDate()))?.format('YYYY-MM-DD'),
                                        message: 'Only 18+'
                                    }
                                })}
                            />
                            {errors.dOB && (
                                <span>{errors?.dOB?.message as string}</span>
                            )}
                        </FormControl>
                        <FormControl>
                            <TextField
                                required
                                fullWidth
                                select
                                size={size}
                                color={color}
                                defaultValue={'user'}
                                id={'status'}
                                sx={{
                                    ...textFieldCurrentStyle
                                }}
                                // sx={selectStyle}
                                variant={variant}
                                label={translate('pages.login.fields.role')}
                                {...register('status', {required: requiredText('role')})}
                            >
                                <MenuItem value={'user'}>{translate("roles.user")}</MenuItem>
                                <MenuItem value={'manager'}>{translate("roles.manager")}</MenuItem>
                            </TextField>
                            {errors.status && (
                                <span>{errors?.status?.message as string}</span>
                            )}
                        </FormControl>
                    </Box>
                );
            case 1:
                return (
                    <Box
                        key={'1'}
                        sx={{
                            ...itemContainerStepStyle
                        }}
                    >
                        <FormControl>
                            <TextField
                                required
                                color={color}
                                fullWidth
                                defaultValue={''}
                                size={size}
                                sx={{
                                    ...textFieldCurrentStyle
                                }}
                                id={"name"}
                                variant={variant}
                                label={translate("pages.register.fields.name")}
                                {...register('name', {
                                    required: requiredText('name'),
                                })}
                            />
                            {errors.name && (
                                <span>{errors?.name?.message as string}</span>
                            )}
                        </FormControl>
                        <FormControl>
                            <TextField
                                required
                                fullWidth
                                sx={{
                                    ...textFieldCurrentStyle
                                }}
                                id="email"
                                variant={variant}
                                size={size}
                                defaultValue={'@gmail.com'}
                                color={color}
                                inputProps={{pattern: "/^([^.@]+)(\\.[^.@]+)*@([^.@]+\\.)+([^.@]+)$/"}}
                                label={translate("pages.register.fields.email")}
                                type={"email"}
                                {...register('email', {
                                    required: requiredText('email'),
                                    pattern: {
                                        value: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                                        message: translate('pages.register.errors.validEmail')
                                    }
                                })}
                            />
                            {errors.email && (
                                <span>{errors?.email?.message as string}</span>
                            )}
                        </FormControl>
                        <FormControl>
                            <Box sx={{width: '100%', position: 'relative'}}>
                                <TextField
                                    required
                                    fullWidth
                                    label={translate("pages.login.fields.password")}
                                    type={showPass ? 'text' : 'password'}
                                    sx={{
                                        ...textFieldCurrentStyle
                                    }}
                                    color={color}
                                    id="password"
                                    variant={variant}
                                    size={size}
                                    placeholder={"Example: Thsd_e28gv"}
                                    {...register('password', {
                                        required: requiredText('password'),
                                        pattern: {
                                            // value: /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?\d)(?=.*?[#?!@$%^&*-]).{8,}$/,
                                            value: /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
                                            message: translate('pages.login.errors.passValid')
                                        }
                                    })}
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
                                    },
                                }}>
                                    {
                                        showPass ?
                                            <VisibilityOffOutlined onClick={handleShowPass}/> :
                                            <VisibilityOutlined onClick={handleShowPass}/>
                                    }
                                </Box>
                            </Box>
                            {errors.password && (
                                <span>{errors?.password?.message as string}</span>
                            )}
                        </FormControl>
                    </Box>
                )
        }
    }

    return (
        <ContainerComponent>
            <Box
                sx={{
                    marginTop: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    margin: '0 auto',
                    width: {xs: '90%', md: '700px'},
                    maxWidth: '700px',
                }}
            >
                <Avatar src={`/images/logo.png`} onClick={() => navigate('/welcome')}
                        sx={{m: 1, cursor: 'pointer'}}/>
                <Typography component="h1" variant="h5" fontSize={{xs: 18, md: 22}}>
                    {translate("pages.register.title")}
                </Typography>
                <Typography
                    sx={{
                        maxWidth: '500px',
                        m: 1
                    }}
                    component={"h3"} color={'red'}>
                    {translate("importantText")}
                </Typography>
                <Box sx={{
                    width: '100%',
                    maxWidth: '500px',
                    p: 3,
                    borderRadius: '10px',
                    border: '2px solid cornflowerblue'
                }}>
                    <StepTitles
                        gotoStep={gotoStep}
                        stepTitles={stepTitles}
                        currentStep={currentStep}
                    />
                    <Box
                        component="form"
                        autoComplete="off"
                        sx={{
                            width: '100%',
                            // mt: '30px',
                            maxWidth: '350px',
                            margin: '30px auto 0',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 2,
                            "& span:not(.MuiCheckbox-root)": {
                                color: 'red',
                                mt: '5px'
                            }
                        }}
                    >
                        {
                            renderFormByStep(currentStep)
                        }
                        <StepButtons
                            currentStep={currentStep}
                            stepTitles={stepTitles}
                            gotoStep={gotoStep}
                            onSubmit={handleSubmit(onFinishHandler)}
                        />
                    </Box>
                </Box>
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'start',
                    width: '100%',
                    mt: '10px'
                }}>
                    <Checkbox
                        checked={accept} value="allowExtraEmails"
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setAccept(e.target.checked)}
                        color={'secondary'} required/>
                    <Box sx={{
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
                    </Box>
                    <UserAgreement show={show} setShow={setShow}/>
                </Box>
                <OrPart
                    isUserAggre={accept}
                    githubType={'register_github'}
                    googleType={'register'}
                    googleText={'signup_with'}
                    facebookType={'register'}
                    facebookText={'signup_with'}
                />
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
            <ModalWindow
                title={
                    <Box sx={{
                        fontWeight: 700,
                        fontSize: {xs: '20px', sm: '24px'}
                    }}>
                        {translate("verify.activation")}
                    </Box>
                }
                setOpen={setOpenModal}
                open={openModal}
                contentProps={{
                    maxWidth: '500px',
                    width: '90%',
                    height: '40vh',
                    borderRadius: '15px'
                }}
                bodyProps={{
                    width: '80%',
                    margin: '50px auto',
                }}
            >
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 6,
                    width: '100%',
                    maxWidth: '300px',
                    margin: '0 auto'
                }}>
                    <Typography sx={{
                        fontSize: {xs: '16px', sm: '18px', md: '20px'}
                    }}>
                        {translate("verify.verifyMes")}
                    </Typography>
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        width: '100%'
                    }}>
                        <Button
                            sx={{
                                ...buttonStyle
                            }}
                            variant={'contained'}
                            color={'error'}
                            onClick={() => setOpenModal(false)}>
                            {translate("buttons.close")}
                        </Button>
                        <Button
                            sx={{
                                ...buttonStyle
                            }}
                            variant={'contained'}
                            color={'info'}
                            onClick={() => window.location.replace('https://mail.google.com/')}
                        >
                            {translate("verify.openGmail")}
                        </Button>
                    </Box>
                </Box>

            </ModalWindow>
        </ContainerComponent>
    );
}

interface IRegister {
    status: "role" | "manager",
    password: string,
    email: string,
    phone: string,
    dOB: Date,
    name: string,
    registerBy?: "Email"
}

export default Register;
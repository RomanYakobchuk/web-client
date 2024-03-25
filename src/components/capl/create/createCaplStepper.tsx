import {FieldErrors, FieldValues, UseFormHandleSubmit, UseFormRegister, UseFormSetValue} from "react-hook-form";
import {
    BaseRecord,
    CreateResponse,
    UpdateResponse,
    useBack,
    useNotification,
    usePermissions,
    useTranslate
} from "@refinedev/core";
import {Box, FormControl, FormHelperText, InputLabel, SxProps, TextField, Typography} from "@mui/material";
import React, {useEffect, useState, useContext} from "react";
import {useSearchParams} from "react-router-dom";
import {Switch} from "antd";

import SearchEstablishments from "../../search/searchEstablishments";
import {IReserve, IEstablishment} from "@/interfaces/common";
import {StepButtons} from "@/components/steps/stepButtons";
import {StepTitles} from "@/components/steps/stepTitles";
import {useUserInfo} from "@/hook";
import dayjs from "dayjs";
import {ColorModeContext} from "@/contexts";
import {CaplFormUserStatus} from "./caplFormUserStatus";
import {Calendar} from "@/components/time";


type TProps = {
    type: "create" | "edit",
    register: UseFormRegister<FieldValues>,
    setValue: UseFormSetValue<FieldValues>,
    errors: FieldErrors<FieldValues>,
    gotoStep: (value: number) => void,
    currentStep: number,
    handleSubmit: UseFormHandleSubmit<FieldValues>,
    onFinish: (values: FieldValues) => Promise<CreateResponse<BaseRecord> | UpdateResponse<BaseRecord> | void>
}
export const CreateCaplStepper = ({
                                      type,
                                      register,
                                      setValue,
                                      onFinish,
                                      errors,
                                      gotoStep,
                                      currentStep,
                                      handleSubmit
                                  }: TProps) => {

    const {mode} = useContext(ColorModeContext);
    const {user: currentUser} = useUserInfo();
    const translate = useTranslate();
    const {open} = useNotification();
    const {data: role} = usePermissions();
    const goBack = useBack();
    const [searchParams, setSearchParams] = useSearchParams();

    const [dateCalendar, setDateCalendar] = useState<Date | null>(new Date(dayjs()?.add(55, "minutes")?.toString()));
    const [currentDataCapl, setCurrentDataCapl] = useState<IReserve | null>(null);
    const [searchPlace, setSearchPlace] = useState<IEstablishment | null>(null);
    const [manager, setManager] = useState<string>(searchPlace?.createdBy);
    // const [isAllowedEdit, setIsAllowedEdit] = useState<boolean>(true);
    const [user, setUser] = useState<string>(currentUser?._id);
    const [writeMe, setWriteMe] = useState<boolean>(false);
    const [userStatus, setUserStatus] = useState<IReserve['userStatus']>({value: 'draft', reasonRefusal: ''});
    const [establishmentStatus, setEstablishmentStatus] = useState<IReserve['establishmentStatus']>({
        value: 'draft',
        reasonRefusal: '',
        freeDateFor: [null] as IReserve['establishmentStatus']['freeDateFor']
    });

    useEffect(() => {
        const establishmentParam = searchParams.get('establishmentId');
        if (establishmentParam) {
            setSearchPlace({
                _id: establishmentParam
            } as IEstablishment)
        }
    }, [searchParams]);

    useEffect(() => {
        if (searchPlace?.createdBy) {
            setManager(searchPlace?.createdBy)
        }
    }, [searchPlace?.createdBy]);

    const stepTitles = ['first', 'second', 'third']?.map((item) => translate(`pages.register.steps.${item}`));
    const itemContainerStepStyle: SxProps = {
        gap: 2,
        width: '100%',
        display: 'grid',
        gridTemplateColumns: {xs: '1fr', sm: '1fr 1fr',},
        // gridTemplateRows: '80px',
        alignItems: 'start',
        "& label, & label.Mui-focused": {
            color: 'common.white'
        },
        "& .Mui-disabled": {
            WebkitTextFillColor: '#514f4f !important'
        }
    }
    useEffect(() => {
        register("establishmentId", {
            required: translate("capl.required", {"field": translate("home.one")}),
            value: searchPlace?._id
        })
        setValue("establishmentId", searchPlace?._id || "")
        if (searchPlace?._id) {
            setSearchParams((prev) => ({
                ...prev,
                'establishmentId': searchPlace?._id
            }));
        } else {
            searchParams.delete('establishmentId');
            setSearchParams(searchParams);
        }
    }, [register, searchPlace?._id]);
    useEffect(() => {
        register("userId", {
            value: user
        })
        setValue("userId", user)
        register("userStatus", {
            value: userStatus
        })
        setValue("userStatus", userStatus)
        register("establishmentStatus", {
            value: establishmentStatus
        })
        setValue("establishmentStatus", establishmentStatus)
        register("writeMe", {
            value: writeMe
        })
        setValue("writeMe", writeMe)
        register("managerId", {
            value: manager
        })
        setValue("managerId", manager)
    }, [register, user, userStatus, establishmentStatus, writeMe, manager]);

    useEffect(() => {
        console.log('date calendar: ', dateCalendar)
        const v = dateCalendar ? dayjs(dateCalendar)?.format('YYYY-MM-DDTHH:mm') : null;
        register('dateCalendar', {
            value: v,
            required: currentStep > 0 ? requiredText('date') : false,
            min: {
                value: currentStep > 0 ? type === 'create' ? dayjs()?.add(55, 'minutes')?.format('YYYY-MM-DDTHH:mm') : '' : '',
                message: translate('capl.create.minDateReserve.message')
            }
        });
        setValue('dateCalendar', v);
    }, [register, dateCalendar, currentStep, type]);


    const gridColumn = {xs: 'span 1', sm: 'span 2'};

    const currentDate = new Date(new Date().getTime() + (1 * 60 * 60 * 1000));

    const reservedDate = new Date(currentDataCapl?.date as Date);

    const isAllowedEditData = currentDate >= reservedDate;

    const editByEStatus = currentDataCapl?.establishmentStatus?.value !== "accepted";
    const isEditByUser = ((currentUser?._id === currentDataCapl?.user || (currentUser?._id === currentDataCapl?.user && currentUser?._id === currentDataCapl?.manager)) && ((isAllowedEditData && editByEStatus) || currentDataCapl?.isAllowedEdit)) || role === 'admin';
    const isAllowedUser = type === 'edit' ? !isEditByUser : false;
    // const isEditByManager = (role === 'manager' && editByEStatus) || role === 'admin';
    // const isAllowedManager = !isEditByManager;

    const requiredText = (field: string) => translate("capl.required", {field: translate(`capl.create.${field}`)});

    const namesValidate = (value: string, field: string) => {
        return value?.split(" ")?.length < 2 ? translate('capl.fullNameError', {
            "field": field,
            "number": "2"
        }) : true
    }

    const minDateReserve = type === 'create' ? dayjs()?.add(55, 'minutes')?.format('YYYY-MM-DDTHH:mm') : '';
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
                        <Box sx={{
                            gridColumn
                        }}>
                            <SearchEstablishments
                                isOnlyShowInfo={type === 'edit'}
                                searchEstablishment={searchPlace as IEstablishment}
                                setSearchEstablishment={setSearchPlace}
                                typeSearch={'all'}
                                isCanClear={true}
                                isChooseFromSaved={true}
                            />
                            {
                                errors?.establishmentId && (
                                    <Box
                                        component="span"
                                        sx={{
                                            color: 'error.main',
                                            fontSize: {xs: '16px', sm: '18', md: '20px'},
                                            fontWeight: 600,
                                            mb: 1
                                        }}
                                    >
                                        {errors?.establishmentId?.message as string}
                                    </Box>
                                )
                            }
                        </Box>
                    </Box>
                )
            case 1:
                return (
                    <Box
                        key={'1'}
                        sx={{
                            ...itemContainerStepStyle,
                        }}
                    >
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 2,
                                width: '100%'
                            }}
                        >
                            <FormControl fullWidth>
                                <TextField
                                    fullWidth
                                    label={translate("capl.create.fullName")}
                                    required
                                    size={"small"}
                                    disabled={isAllowedUser}
                                    id="outlined-basic"
                                    color={"secondary"}
                                    // name={'fullName'}
                                    variant="outlined"
                                    defaultValue={currentUser?.name}
                                    {...register('fullName', {
                                        required: requiredText('fullName'),
                                        validate: (value: string) => {
                                            return namesValidate(value, translate('capl.create.fullName'))
                                        }
                                    })}
                                />
                                {errors.fullName && (
                                    <span className={'caplStepperSpan'}>{errors?.fullName?.message as string}</span>
                                )}
                            </FormControl>
                            {/*<FormControl fullWidth>*/}
                            {/*    <TextField*/}
                            {/*        fullWidth*/}
                            {/*        label={translate("capl.create.date")}*/}
                            {/*        required*/}
                            {/*        size={"small"}*/}
                            {/*        disabled={isAllowedUser}*/}
                            {/*        type={"datetime-local"}*/}
                            {/*        id="outlined-basic"*/}
                            {/*        color={"secondary"}*/}
                            {/*        variant="outlined"*/}
                            {/*        defaultValue={dayjs().add(1.2, 'hour')?.format('YYYY-MM-DDTHH:mm')}*/}
                            {/*        inputProps={{*/}
                            {/*            min: minDateReserve,*/}
                            {/*        }}*/}
                            {/*        {...register('date', {*/}
                            {/*            required: requiredText('date'),*/}
                            {/*            min: {*/}
                            {/*                value: minDateReserve,*/}
                            {/*                message: requiredText('minDateReserve.message')*/}
                            {/*            }*/}
                            {/*        })}*/}
                            {/*        InputProps={{*/}
                            {/*            sx: {*/}
                            {/*                "&:invalid": {*/}
                            {/*                    color: 'red'*/}
                            {/*                }*/}
                            {/*            },*/}
                            {/*        }}*/}
                            {/*    />*/}
                            {/*    {errors.date && (*/}
                            {/*        <span className={'caplStepperSpan'}>{errors?.date?.message as string}</span>*/}
                            {/*    )}*/}
                            {/*</FormControl>*/}
                            <FormControl fullWidth>
                                <TextField
                                    fullWidth
                                    label={translate("capl.create.desiredAmount")}
                                    required
                                    size={"small"}
                                    type={"number"}
                                    id="outlined-basic"
                                    disabled={isAllowedUser}
                                    color={"secondary"}
                                    variant="outlined"
                                    inputProps={{
                                        inputMode: 'numeric',
                                        pattern: '[0-9]*',
                                        min: 0
                                    }}
                                    defaultValue={100}
                                    {...register('desiredAmount', {
                                        required: requiredText('desiredAmount'),
                                        pattern: {
                                            value: /^\d*$/,
                                            message: requiredText('desiredAmount')
                                        }
                                    })}
                                />
                                {errors.desiredAmount && (
                                    <span
                                        className={'caplStepperSpan'}>{errors?.desiredAmount?.message as string}</span>
                                )}
                            </FormControl>
                            <FormControl fullWidth>
                                <TextField
                                    fullWidth
                                    label={translate("capl.create.numberPeople")}
                                    required
                                    size={"small"}
                                    type={"number"}
                                    id="outlined-basic"
                                    disabled={isAllowedUser}
                                    color={"secondary"}
                                    variant="outlined"
                                    inputProps={{
                                        inputMode: 'numeric',
                                        pattern: '[0-9]*',
                                        min: 1
                                    }}
                                    defaultValue={1}
                                    {...register('numberPeople', {
                                        required: requiredText('numberPeople'),
                                        pattern: {
                                            value: /^\d*$/,
                                            message: requiredText('numberPeople')
                                        },
                                        min: 1
                                    })}
                                />
                                {errors.numberPeople && (
                                    <span className={'caplStepperSpan'}>{errors?.numberPeople?.message as string}</span>
                                )}
                            </FormControl>
                            <FormControl fullWidth>
                                <TextField
                                    fullWidth
                                    label={translate("capl.create.whoPay")}
                                    required
                                    size={"small"}
                                    id="outlined-basic"
                                    disabled={isAllowedUser}
                                    color={"secondary"}
                                    variant="outlined"
                                    defaultValue={currentUser?.name}
                                    {...register('whoPay', {
                                        required: requiredText('whoPay'),
                                        validate: (value: string) => {
                                            return namesValidate(value, translate('capl.create.whoPay'))
                                        }
                                    })}
                                />
                                {errors.whoPay && (
                                    <span className={'caplStepperSpan'}>{errors?.whoPay?.message as string}</span>
                                )}
                            </FormControl>
                            <FormControl fullWidth>
                                <TextField
                                    fullWidth
                                    label={translate("capl.create.eventType")}
                                    required
                                    size={"small"}
                                    id="outlined-basic"
                                    disabled={isAllowedUser}
                                    color={"secondary"}
                                    variant="outlined"
                                    defaultValue={''}
                                    {...register('eventType', {
                                        required: requiredText('eventType'),
                                    })}
                                />
                                {errors.eventType && (
                                    <span className={'caplStepperSpan'}>
                                    {errors?.eventType?.message as string}
                                </span>
                                )}
                            </FormControl>
                        </Box>
                        <Box
                            sx={{
                                width: '100%',
                                display: 'flex',
                                justifyContent: 'end'
                            }}
                        >
                            <Box sx={{
                                // width: {xs: '100%', md: '300px'},
                                width: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 1,
                                fontSize: {xs: '14px', sm: '16px'},
                            }}>
                                <FormHelperText
                                >
                                    {translate("capl.create.date")}
                                </FormHelperText>
                                <Calendar
                                    styles={{
                                        border: '1px solid silver'
                                    }}
                                    workSchedule={searchPlace?.workSchedule}
                                    minDate={minDateReserve ? new Date(minDateReserve?.toString()) : null}
                                    // maxDate={new Date(dayjs().add(5, 'day')?.toISOString())}
                                    value={dateCalendar}
                                    setValue={setDateCalendar}
                                    isTimeExist={true}
                                />
                                {errors.dateCalendar && (
                                    <span className={'caplStepperSpan'}>{errors?.dateCalendar?.message as string}</span>
                                )}
                            </Box>
                        </Box>
                    </Box>
                )
            case 2:
                return (
                    <Box
                        key={'2'}
                        sx={{
                            ...itemContainerStepStyle
                        }}
                    >
                        <FormControl
                            fullWidth>
                            <TextField
                                multiline
                                label={translate('capl.create.comment')}
                                style={{
                                    width: "100%",
                                    background: "transparent",
                                    color: 'common.white',
                                }}
                                maxRows={8}
                                color={"secondary"}
                                disabled={isAllowedUser}
                                {...register('comment')}
                                defaultValue={''}
                            />
                        </FormControl>
                        <FormControl sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'start',
                            gap: 2,
                        }}>
                            <Switch
                                defaultChecked={false}
                                disabled={isAllowedUser}
                                checked={writeMe}
                                onChange={(checked) => setWriteMe(checked)}
                            />
                            <Typography
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    gap: 1,
                                    alignItems: 'center',
                                    color: 'common.white'
                                }}
                            >
                                {translate("capl.create.writeMe")}
                            </Typography>
                        </FormControl>
                        {/*{*/}
                        {/*    (currentUser?._id === user || role === 'admin') && (*/}
                        {/*        <ChooseNewStatus*/}
                        {/*            value={userStatus?.value as TStatus}*/}
                        {/*            disabled={isAllowedUser}*/}
                        {/*            label={translate('capl.status.userStatus')}*/}
                        {/*            onChange={(event) => setUserStatus && setUserStatus((prevState) => ({*/}
                        {/*                ...prevState,*/}
                        {/*                value: event.target.value as TStatus*/}
                        {/*            }))}*/}
                        {/*        />*/}
                        {/*    )*/}
                        {/*}*/}
                        {
                            role !== 'manager' && type !== 'create' && (
                                <>
                                    {
                                        (currentUser?._id === user || role === 'admin') && (
                                            <FormControl
                                                sx={{
                                                    bgcolor: mode === 'light' ? '#d9d9d9' : '#474747',
                                                    borderRadius: '15px',
                                                    px: 2,
                                                    py: 1,
                                                    pb: 2
                                                }}
                                            >
                                                <InputLabel
                                                    id={'StatusLabel'}>{translate('capl.status.userStatus.title')}</InputLabel>
                                                <CaplFormUserStatus
                                                    typeStatus={'userStatus'}
                                                    className={'pt-12'}
                                                    type={type}
                                                    setStatus={setUserStatus}
                                                    status={userStatus}
                                                />
                                            </FormControl>
                                        )
                                    }
                                    {
                                        (role === 'manager' || role === 'admin') && (
                                            <FormControl
                                                sx={{
                                                    bgcolor: mode === 'light' ? '#d9d9d9' : '#474747',
                                                    borderRadius: '15px',
                                                    px: 2,
                                                    py: 1,
                                                    pb: 2
                                                }}
                                            >
                                                <InputLabel
                                                    id={'StatusLabel'}>{translate('capl.status.establishmentStatus.title')}</InputLabel>
                                                <CaplFormUserStatus
                                                    typeStatus={'establishmentStatus'}
                                                    className={'pt-12'}
                                                    type={type}
                                                    setStatus={setEstablishmentStatus}
                                                    status={establishmentStatus}
                                                />
                                            </FormControl>
                                        )
                                    }
                                </>
                            )
                        }
                    </Box>
                )
        }
    }

    const onFinishHandler = async (data: FieldValues) => {

        if (!searchPlace?._id) {
            open?.({
                type: 'error',
                message: `${translate('capl.required', {"field": translate(`home.one`)})}`
            });
            return;
        }
        for (const [key, value] of Object.entries(data)) {
            if (!value && key !== 'comment' && key !== 'writeMe') {
                open?.({
                    type: 'error',
                    message: `${translate('capl.required', {"field": translate(`capl.create.${key}`)})}`
                });
                return;
            }
        }
        namesValidate(data?.name, translate('capl.create.fullName'))
        namesValidate(data?.whoPay, translate('capl.create.whoPay'))

        const currentDate = new Date(new Date()?.getTime() + (1 * 60 * 60 * 1000));
        const reserveDate = new Date(data?.date);

        if (reserveDate < currentDate) {
            open?.({
                type: 'error',
                message: translate('capl.create.minDateReserve.isError')
            })
            return;
        }

        try {
            console.log(data)
            // await onFinish({
            //     ...data,
            //     date: new Date(data?.date)?.toISOString()
            // });

            // goBack();
        } catch (e: any) {
            console.log(e)
        }
    }

    return (
        <Box
            sx={{
                p: 2,
                bgcolor: 'common.black',
                borderRadius: '16px',
                "& .MuiFormHelperText-root":{
                    fontSize: {xs: '14px', sm: '16px'},
                    color: 'common.white'
                }
            }}
        >
            <Box>
                <StepTitles
                    styleContainer={{
                        maxWidth: '600px'
                    }}
                    gotoStep={gotoStep}
                    stepTitles={stepTitles}
                    currentStep={currentStep}
                />
            </Box>
            <Box
                component="form"
                autoComplete="off"
                sx={{
                    width: '100%',
                    // mt: '30px',
                    // maxWidth: '350px',
                    margin: '30px auto 0',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                    "& span:not(.MuiCheckbox-root).caplStepperSpan:not(.nextui)": {
                        color: 'red',
                        mt: '5px'
                    }
                }}
            >
                {
                    renderFormByStep(currentStep)
                }
                <StepButtons
                    styles={{
                        justifyContent: currentStep > 0 ? 'space-between' : 'end'
                    }}
                    buttonsVariant={'contained'}
                    currentStep={currentStep}
                    stepTitles={stepTitles}
                    gotoStep={gotoStep}
                    onSubmit={handleSubmit(onFinishHandler)}
                    textSubmit={translate('buttons.confirm')}
                />
            </Box>
        </Box>
    );
};

// next ui
{/*<Input*/
}
{/*    size={'sm'}*/
}
{/*    className={'nextui mb-4'}*/
}
{/*    disabled={isAllowedUser}*/
}
{/*    variant={'flat'}*/
}
{/*    label={translate("capl.create.fullName")}*/
}
{/*    defaultValue={currentUser?.name}*/
}
{/*    {...register('fullName', {*/
}
{/*        required: requiredText('fullName'),*/
}
{/*        validate: (value: string) => {*/
}
{/*            return namesValidate(value, translate('capl.create.fullName'))*/
}
{/*        }*/
}
{/*    })}*/
}
{/*/>*/
}
{/*<Input*/
}
{/*    className={'nextui mb-4'}*/
}
{/*    type={'datetime-local'}*/
}
{/*    label={translate("capl.create.date")}*/
}
{/*/>*/
}
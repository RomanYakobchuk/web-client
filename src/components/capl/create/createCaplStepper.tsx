import {useBack, useNotification, useTranslate} from "@refinedev/core";
import {Box, SxProps} from "@mui/material";
import React, {useEffect, useState} from "react";
import {useStepsForm} from "@refinedev/react-hook-form";
import {useLocation, useSearchParams} from "react-router-dom";

import {IReserve, PropertyProps} from "@/interfaces/common";
import {StepButtons} from "@/components/steps/stepButtons";
import {StepTitles} from "@/components/steps/stepTitles";
import {socket} from "@/socketClient";
import {useUserInfo} from "@/hook";
import SearchEstablishments from "../../search/searchEstablishments";


type TProps = {
    type: "create" | "edit"
}
export const CreateCaplStepper = ({type}: TProps) => {

    const {user: currentUser} = useUserInfo();
    const translate = useTranslate();
    const {open} = useNotification();
    const goBack = useBack();
    const {search: searchEstablishment} = useLocation();
    const [searchParams, setSearchParams] = useSearchParams();

    const [manager, setManager] = useState<string>("");
    const [isAllowedEdit, setIsAllowedEdit] = useState<boolean>(true);
    const [user, setUser] = useState<string>(currentUser?._id);
    const [searchPlace, setSearchPlace] = useState<PropertyProps | null>(null);
    const [fullName, setFullName] = useState<string>(currentUser?.name);
    const [eventType, setEventType] = useState<string>('');
    const [date, setDate] = useState<Date | any>(new Date(new Date()?.getTime() + (1 * 60 * 60 * 1000)));
    const [comment, setComment] = useState<string>('');
    const [writeMe, setWriteMe] = useState<boolean>(false);
    const [desiredAmount, setDesiredAmount] = useState<number>(0);
    const [numberPeople, setNumberPeople] = useState<number>(0);
    const [whoPay, setWhoPay] = useState<string>(currentUser?.name);
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
            } as PropertyProps)
        }
    }, [searchParams]);
    useEffect(() => {
        if (searchPlace?.createdBy) {
            setManager(searchPlace?.createdBy)
        }
    }, [searchPlace?.createdBy]);
    const {
        refineCore: {onFinish, formLoading},
        register,
        handleSubmit,
        steps: {gotoStep, currentStep},
        formState: {errors},
        setValue,
        getValues
    } = useStepsForm({
        warnWhenUnsavedChanges: true,
        refineCoreProps: {
            resource: `capl/create`,
            errorNotification: (data: any) => {
                return {
                    type: 'error',
                    message: data?.response?.data?.error
                }
            },
            successNotification: (data: any) => {
                return {
                    type: 'success',
                    message: data?.data?.message
                }
            },
            action: 'create',
            // onMutationError: (data) => {
            //     setError(data?.response?.data)
            // },
            redirect: false
        },
        stepsProps: {
            defaultStep: 0
        }
    });
    const stepTitles = ['first', 'second', 'third']?.map((item) => translate(`pages.register.steps.${item}`));
    const itemContainerStepStyle: SxProps = {
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        width: '100%'
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
                        <SearchEstablishments
                            isOnlyShowInfo={type === 'edit'}
                            searchEstablishment={searchPlace as PropertyProps}
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
                )
            case 1:
                return (
                    <Box
                        key={'1'}
                        sx={{
                            ...itemContainerStepStyle
                        }}
                    >
                        STEP 2
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
                        STEP 3
                    </Box>
                )
        }
    }

    const onFinishHandler = async () => {

        const requestData = {
            fullName,
            eventType,
            date,
            desiredAmount,
            numberPeople,
            whoPay,
            comment,
            writeMe,
            userStatus,
            establishmentStatus
        }

        if (!searchPlace?._id) {
            open?.({
                type: 'error',
                message: `${translate('capl.required', {"field": translate(`home.one`)})}`
            });
            return;
        }
        for (const [key, value] of Object.entries(requestData)) {
            if (!value && key !== 'comment' && key !== 'writeMe') {
                open?.({
                    type: 'error',
                    message: `${translate('capl.required', {"field": translate(`capl.create.${key}`)})}`
                });
                return;
            }
        }
        if (fullName?.split(" ")?.length !== 2 || whoPay?.split(" ")?.length !== 2) {
            open?.({
                type: 'error',
                message: translate('capl.fullNameError')
            })
            return;
        }
        const currentDate = new Date(new Date()?.getTime() + (1 * 60 * 60 * 1000));
        const reserveDate = new Date(date);
        if (reserveDate < currentDate) {
            open?.({
                type: 'error',
                message: translate('capl.create.minDateReserve.isError')
            })
            return;
        }

        try {
            const res = await onFinish({
                ...requestData,
                establishmentId: searchPlace?._id,
                userId: user,
                managerId: manager
            });
            if (res?.data?.notification && res?.data?.reservation?.manager) {
                socket?.emit('createNewNotification', {
                    userId: res?.data?.reservation?.manager,
                    notification: res?.data?.notification
                })
            }
            goBack();
        } catch (e) {

        }
    }

    return (
        <Box>
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
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1,
                    width: '100%'
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
                    textSubmit={translate('buttons.confirm')}
                />
            </Box>
        </Box>
    );
};


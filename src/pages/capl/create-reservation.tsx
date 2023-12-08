import {Link, useLocation} from "react-router-dom";
import React, {useEffect, useState} from "react";
import {useBack, useNotification, useTranslate} from "@refinedev/core";
import {useForm} from "@refinedev/react-hook-form";

import {IReserve, PropertyProps} from "@/interfaces/common";
import {CaplForm, CustomCreate} from "@/components";
import {useUserInfo} from "@/hook";
import {socket} from "@/socketClient";

const CreateReservation = () => {
    const {user: currentUser} = useUserInfo();
    const translate = useTranslate();
    const {open} = useNotification();
    const goBack = useBack();
    const {search: searchEstablishment} = useLocation();

    const [manager, setManager] = useState<string>("");
    const [isAllowedEdit, setIsAllowedEdit] = useState<boolean>(true);
    const [user, setUser] = useState<string>(currentUser?._id);
    const [searchPlace, setSearchPlace] = useState<PropertyProps>({} as PropertyProps);
    const [fullName, setFullName] = useState<string>(currentUser?.name);
    const [eventType, setEventType] = useState<string>('');
    const [date, setDate] = useState<Date | any>(new Date(new Date()?.getTime() + (1 * 60 * 60 * 1000)));
    const [comment, setComment] = useState<string>('');
    const [writeMe, setWriteMe] = useState<boolean>(false);
    const [desiredAmount, setDesiredAmount] = useState<number>(0);
    const [numberPeople, setNumberPeople] = useState<number>(0);
    const [whoPay, setWhoPay] = useState<string>(currentUser?.name);
    const [userStatus, setUserStatus] = useState<IReserve['userStatus']>({value: 'draft', reasonRefusal: ''});
    const [institutionStatus, setInstitutionStatus] = useState<IReserve['institutionStatus']>({value: 'draft', reasonRefusal: '', freeDateFor: [null] as IReserve['institutionStatus']['freeDateFor']});

    useEffect(() => {
        if (searchEstablishment) {
            const establishmentParam = new URLSearchParams(searchEstablishment).get('establishmentId');
            if (establishmentParam) {
                setSearchPlace({
                    _id: establishmentParam
                } as PropertyProps)
            }
        }
    }, [searchEstablishment]);

    const {refineCore: {onFinish, formLoading}} = useForm({
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
            redirect: false
        },
    })

    useEffect(() => {
        if (searchPlace?.createdBy) {
            setManager(searchPlace?.createdBy)
        }
    }, [searchPlace?.createdBy]);

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
            institutionStatus
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
            const res = await onFinish({...requestData, institutionId: searchPlace?._id, userId: user, managerId: manager});
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

    const dataCapl = {
        fullName: fullName,
        setFullName: setFullName,
        whoPay,
        setWhoPay,
        eventType,
        date,
        desiredAmount,
        numberPeople,
        comment,
        writeMe,
        setEventType,
        setDate,
        setDesiredAmount,
        setNumberPeople,
        setComment,
        setWriteMe,
        user,
        setUser,
        isAllowedEdit,
        setIsAllowedEdit,
        manager,
        setManager,
        institutionStatus,
        setInstitutionStatus,
        userStatus,
        setUserStatus
    }

    return (
        <CustomCreate
            isLoading={formLoading}
            breadCrumbItems={
                [
                    {
                        title: <Link
                            style={{
                                color: 'silver'
                            }}
                            to={'/capl'}>{translate('capl.capl')}</Link>
                    },
                    {
                        title: translate('capl.reservation')
                    }
                ]
            }
            bgColor={'transparent'}
            headerTitle={translate('capl.title')}
            saveButtonText={translate('buttons.confirm')}
            maxWidth={'900px'}
            onClick={onFinishHandler}
        >
            <CaplForm
                {...dataCapl}
                type={'create'}
                searchPlace={searchPlace}
                setSearchPlace={setSearchPlace}
            />
        </CustomCreate>
    );
};
export default CreateReservation

import {useBack, useNotification, useTranslate} from "@refinedev/core";
import {useForm} from "@refinedev/react-hook-form";
import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {Button} from "@mui/material";


import {IReserve, PropertyProps} from "@/interfaces/common";
import {CaplForm, CustomEdit} from "@/components";


const EditReserve = () => {

    const {id} = useParams();
    const goBack = useBack();

    const translate = useTranslate();
    const {open} = useNotification();

    const [reserve, setReserve] = useState<IReserve>({} as IReserve);

    const [manager, setManager] = useState<string>("");
    const [user, setUser] = useState<string>("");
    const [isAllowedEdit, setIsAllowedEdit] = useState<boolean>(false);
    const [createdBy, setCreatedBy] = useState<string>("");
    const [searchPlace, setSearchPlace] = useState<PropertyProps>({} as PropertyProps);
    const [fullName, setFullName] = useState<string>('');
    const [eventType, setEventType] = useState<string>('');
    const [date, setDate] = useState<Date | any>();
    const [comment, setComment] = useState<string>('');
    const [writeMe, setWriteMe] = useState<boolean>(false);
    const [desiredAmount, setDesiredAmount] = useState<number>(0);
    const [numberPeople, setNumberPeople] = useState<number>(0);
    const [whoPay, setWhoPay] = useState<string>('');
    const [userStatus, setUserStatus] = useState<IReserve['userStatus']>({}  as IReserve['userStatus'])
    const [institutionStatus, setInstitutionStatus] = useState<IReserve['institutionStatus']>({}  as IReserve['institutionStatus'])

    const {refineCore: {onFinish, queryResult, formLoading}} = useForm({
        warnWhenUnsavedChanges: true,
        refineCoreProps: {
            resource: 'capl/findOne',
            id: id as string,
            action: 'edit',
            redirect: false,
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
        }
    });
    useEffect(() => {
        if (queryResult?.data?.data) {
            setReserve(queryResult.data.data as IReserve)
        }
    }, [queryResult]);

    useEffect(() => {
        if (reserve) {
            loadData()
        }
    }, [reserve]);

    const loadData = () => {
        setFullName(reserve?.fullName)
        setWriteMe(reserve?.writeMe)
        setWhoPay(reserve?.whoPay)
        setUserStatus(reserve?.userStatus)
        setInstitutionStatus(reserve?.institutionStatus)
        setDesiredAmount(reserve?.desiredAmount)
        setNumberPeople(reserve?.numberPeople)
        setDate(reserve?.date)
        setComment(reserve?.comment)
        setEventType(reserve?.eventType)
        setSearchPlace(reserve?.institution as PropertyProps)
        setIsAllowedEdit(reserve?.isAllowedEdit)
        setManager(reserve?.manager)
        setUser(reserve?.user)
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
            institutionStatus,
            isAllowedEdit
        }
        if (fullName?.split(" ")?.length !== 2 || whoPay?.split(" ")?.length !== 2) {
            open?.({
                type: 'error',
                message: translate('capl.fullNameError')
            })
            return;
        }
        try {
            await onFinish({...requestData})
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
        createdBy,
        setCreatedBy,
        userStatus,
        setUserStatus,
        institutionStatus,
        setInstitutionStatus,
        setIsAllowedEdit,
        isAllowedEdit,
        currentDataCapl: reserve,
        user,
        setUser,
        manager,
        setManager
    }
    return (
        <CustomEdit
            isLoading={formLoading}
            bgColor={'transparent'}
            onClick={onFinishHandler}
            maxWidth={'800px'}
            // currentSaveButtonsProps={saveButtonProps}
        >
            <Button
                onClick={() => loadData()}
            >
                {translate('buttons.restore')}
            </Button>
            <CaplForm
                {...dataCapl}
                type={'edit'}
                searchPlace={searchPlace}
                setSearchPlace={setSearchPlace}
            />
        </CustomEdit>
    );
};
export default EditReserve;

// <Form
//     {...formProps}
//     initialValues={{
//         ...formProps.initialValues, date: dayjs(formProps?.initialValues?.date)
//     }} layout={'vertical'}>
//     <Grid container spacing={2}>
//         <Grid item xs={12} md={6}>
//             <Form.Item
//                 label={<label style={{
//                     color: color
//                 }}>{translate('capl.create.fullName')}</label>}
//                 name="fullName"
//                 rules={[
//                     {
//                         required: true,
//                     },
//                 ]}
//             >
//                 <Input
//                     disabled={!(user?.status === 'user' || user?.status === 'admin')}
//                     style={{
//                         background: bgColor,
//                         color: color,
//                     }}/>
//             </Form.Item>
//             <Form.Item
//                 label={
//                     <label style={{
//                         color: color
//                     }}>{translate('capl.create.date')}</label>
//                 }
//                 name={'date'}
//                 rules={[
//                     {
//                         required: true,
//                         type: 'date'
//                     },
//                 ]}
//             >
//                 <DatePicker
//                     disabled={!(user?.status === 'user' || user?.status === 'admin')}
//                     style={{
//                         width: '100%',
//                         background: '#fff'
//                     }}
//                     showTime={true}
//                     format={'DD-MM-YYYY HH:mm'}
//                 />
//             </Form.Item>
//             <Form.Item
//                 label={
//                     <label style={{
//                         color: color
//                     }}>{translate('capl.create.desiredAmount')}</label>
//                 }
//                 name={'desiredAmount'}
//                 rules={[
//                     {
//                         required: true,
//                     },
//                 ]}
//             >
//                 <Input
//                     disabled={!(user?.status === 'user' || user?.status === 'admin')}
//                     style={{
//                         background: bgColor,
//                         color: color
//                     }}
//                     type={'number'}/>
//             </Form.Item>
//             <Form.Item
//                 label={
//                     <label style={{
//                         color: color
//                     }}>{translate('capl.create.numberPeople')}</label>
//                 }
//                 name={'numberPeople'}
//                 rules={[
//                     {
//                         required: true,
//                     },
//                 ]}
//             >
//                 <Input
//                     disabled={!(role !== 'manager')}
//                     style={{
//                         background: bgColor,
//                         color: color
//                     }}
//                     type={'number'}/>
//             </Form.Item>
//             <Form.Item
//                 label={
//                     <label style={{
//                         color: color
//                     }}>{translate('capl.create.whoPay')}</label>
//                 }
//                 name="whoPay"
//                 rules={[
//                     {
//                         required: true,
//                     },
//                 ]}
//             >
//                 <Input
//                     disabled={!(user?.status === 'user' || user?.status === 'admin')}
//                     style={{
//                         background: bgColor,
//                         color: color
//                     }}
//                 />
//             </Form.Item>
//             <Form.Item
//                 label={
//                     <label style={{
//                         color: color
//                     }}>{translate('capl.create.writeMe')}</label>
//                 }
//                 name="writeMe"
//                 rules={[
//                     {
//                         type: 'boolean'
//                     }
//                 ]}
//             >
//                 <Switch
//                     disabled={!(user?.status === 'user' || user?.status === 'admin')}
//                     checked={writeMe}
//                     onChange={(checked) => setWriteMe(checked)}/>
//             </Form.Item>
//         </Grid>
//         <Grid item xs={12} md={6}>
//             <Form.Item
//                 label={
//                     <label style={{
//                         color: color
//                     }}>{translate('capl.status.userStatus')}</label>
//                 }
//                 name="userStatus"
//                 rules={[
//                     {
//                         required: true,
//                     },
//                 ]}
//             >
//
//             </Form.Item>
//             <Form.Item
//                 label={
//                     <label style={{
//                         color: color
//                     }}>{''}</label>
//                 }
//                 name="institutionStatus"
//                 rules={[
//                     {
//                         required: true,
//                     },
//                 ]}
//             >
//                 <Select
//                     disabled={!(user?.status === 'manager' || user?.status === 'admin')}
//                     style={{
//                         color: color,
//                         background: bgColor
//                     }}
//                     options={[
//                         {
//                             label: translate('capl.status.accepted'),
//                             value: "accepted",
//                         },
//                         {
//                             label: translate('capl.status.draft'),
//                             value: "draft",
//                         },
//                         {
//                             label: translate('capl.status.rejected'),
//                             value: "rejected",
//                         },
//                     ]}
//                 />
//             </Form.Item>
//             <Form.Item
//                 label={
//                     <label style={{
//                         color: color
//                     }}>{translate('capl.create.eventType')}</label>
//                 }
//                 name="eventType"
//                 rules={[
//                     {
//                         required: true,
//                     },
//                 ]}
//             >
//                 <Input
//                     disabled={!(user?.status === 'user' || user?.status === 'admin')}
//                     style={{
//                         color: color,
//                         background: bgColor
//                     }}/>
//             </Form.Item>
//             <Form.Item
//                 label={
//                     <label style={{
//                         color: color
//                     }}>{translate('capl.create.comment')}</label>
//                 }
//                 name="comment"
//             >
//                 <TextareaAutosize
//                     minRows={3}
//                     disabled={!(user?.status === 'user' || user?.status === 'admin')}
//                     style={{
//                         flex: 8,
//                         width: '100%',
//                         maxWidth: '100%',
//                         resize: 'vertical',
//                         minHeight: '70px',
//                         maxHeight: '170px',
//                         height: '70px',
//                         background: "transparent",
//                         fontSize: "16px",
//                         borderRadius: 6,
//                         padding: 10,
//                         color: mode === "dark" ? "#fcfcfc" : "#000",
//                         borderColor: mode === "dark" ? "#fcfcfc" : "#000",
//                     }}
//                 />
//             </Form.Item>
//         </Grid>
//     </Grid>
// </Form>
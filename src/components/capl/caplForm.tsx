import {Box, Select, FormControl, TextField, Typography, MenuItem, InputLabel} from "@mui/material";
import {CanAccess, usePermissions, useTranslate} from "@refinedev/core";
import React, {Dispatch, SetStateAction, useContext} from "react";
import {Switch} from "antd";

import {ColorModeContext} from "@/contexts";
import {IReserve, PropertyProps} from "@/interfaces/common";
import SearchInstitutions from "../search/searchInstitutions";
import {useUserInfo} from "@/hook";
import dayjs from "dayjs";
import ChooseNewStatus from "@/components/common/choose/chooseNewStatus";


type TProps = Omit<IReserve, "_id" | "institution" | "userStatus" | "institutionStatus" | "isClientAppeared"> & {
    setFullName: Dispatch<SetStateAction<string>>,
    setWhoPay: Dispatch<SetStateAction<string>>,
    setWriteMe: Dispatch<SetStateAction<boolean>>,
    setDate: Dispatch<SetStateAction<Date | string>>,
    setComment: Dispatch<SetStateAction<string>>,
    setDesiredAmount: Dispatch<SetStateAction<number>>,
    setNumberPeople: Dispatch<SetStateAction<number>>,
    setEventType: Dispatch<SetStateAction<string>>,
    searchPlace: PropertyProps,
    setSearchPlace: Dispatch<SetStateAction<PropertyProps>>,
    type: "edit" | "create",
    userStatus?: IReserve['userStatus'],
    institutionStatus?: IReserve['institutionStatus'],
    setUserStatus?: Dispatch<SetStateAction<IReserve['userStatus']>>
    setInstitutionStatus?: Dispatch<SetStateAction<IReserve['institutionStatus']>>,
    user: string,
    setUser: Dispatch<SetStateAction<string>>,
    manager: string,
    setManager: Dispatch<SetStateAction<string>>,
    setIsAllowedEdit: Dispatch<SetStateAction<boolean>>,
    currentDataCapl?: IReserve
}
type TStatus = "draft" | "rejected" | "accepted";
const CaplForm = (props: TProps) => {

    const {
        setSearchPlace,
        searchPlace,
        type,
        setEventType,
        eventType,
        institutionStatus,
        setInstitutionStatus,
        setUserStatus,
        userStatus,
        setNumberPeople,
        numberPeople,
        setDate,
        date,
        setDesiredAmount,
        desiredAmount,
        fullName,
        setFullName,
        setWriteMe,
        writeMe,
        whoPay,
        setWhoPay,
        setComment,
        comment,
        setUser,
        manager,
        user,
        setManager,
        setIsAllowedEdit,
        isAllowedEdit,
        currentDataCapl
    } = props;
    const translate = useTranslate();

    const {mode} = useContext(ColorModeContext);
    const {data: role} = usePermissions();
    const {user: currentUser} = useUserInfo();

    const gridColumn = {xs: 'span 1', sm: 'span 2'};

    const currentDate = new Date(new Date().getTime() + (1 * 60 * 60 * 1000));

    const reservedDate = new Date(currentDataCapl?.date as Date);

    const isAllowedEditData = currentDate >= reservedDate;

    const editByEStatus = currentDataCapl?.institutionStatus?.value !== "accepted";
    const isEditByUser = ((currentUser?._id === currentDataCapl?.user || (currentUser?._id === currentDataCapl?.user && currentUser?._id === currentDataCapl?.manager)) && ((isAllowedEditData && editByEStatus) || currentDataCapl?.isAllowedEdit)) || role === 'admin';
    const isAllowedUser = type === 'edit' ? !isEditByUser : false;
    const isEditByManager = (role === 'manager' && editByEStatus) || role === 'admin';
    const isAllowedManager = !isEditByManager;

    return (
        <Box sx={{
            display: 'grid',
            gridTemplateColumns: {xs: '1fr', sm: '1fr 1fr',},
            width: {xs: '100%'},
            // gridTemplateRows: '80px',
            gap: 3,
            alignItems: 'start',
            "& label, & label.Mui-focused": {
                color: 'common.white'
            },
            "& .Mui-disabled": {
                WebkitTextFillColor: '#514f4f !important'
            }
        }}>
            {
                role !== 'admin' && institutionStatus?.value === 'accepted' && !isAllowedEdit && (
                    <Typography sx={{
                        gridColumn,
                        fontSize: {xs: '14px', sm: '16px'},
                        color: 'orange',
                        whiteSpace: 'break-space'
                    }}>
                        {translate('capl.edit.isAccepted')}
                    </Typography>
                )
            }
            <CanAccess
                resource={'chooseUser'}
                action={'choose'}
            >
                {
                    role === 'admin' && (
                        <Box sx={{
                            gridColumn
                        }}>
                            'FIND USER FOR RESERVATION'
                        </Box>
                    )
                }
            </CanAccess>
            <FormControl
                fullWidth
                sx={{
                    gridColumn: gridColumn
                }}
            >
                <SearchInstitutions
                    isOnlyShowInfo={type === 'edit'}
                    searchInstitution={searchPlace as PropertyProps}
                    setSearchInstitution={setSearchPlace}
                    typeSearch={'all'}/>
            </FormControl>
            <FormControl fullWidth>
                <TextField
                    fullWidth
                    label={translate("capl.create.fullName")}
                    required
                    size={"small"}
                    disabled={isAllowedUser}
                    id="outlined-basic"
                    color={"secondary"}
                    name={'fullName'}
                    variant="outlined"
                    value={fullName || ''}
                    onChange={(event) => setFullName(event.target.value)}
                />
            </FormControl>
            <FormControl fullWidth>
                <TextField
                    fullWidth
                    label={translate("capl.create.date")}
                    required
                    size={"small"}
                    disabled={isAllowedUser}
                    type={"datetime-local"}
                    id="outlined-basic"
                    color={"secondary"}
                    variant="outlined"
                    inputProps={{
                        min: dayjs(new Date())?.format('YYYY-MM-DDTHH:mm'),
                    }}
                    // InputLabelProps={{
                    //     shrink: true,
                    // }}
                    InputProps={{
                        sx: {
                            "&:invalid": {
                                color: 'red'
                            }
                        },
                    }}
                    name={'date'}
                    value={dayjs(date)?.format('YYYY-MM-DDTHH:mm') || ''}
                    onChange={(event) => setDate(event.target.value)}
                />
                {
                    type === 'create' && (new Date(new Date()?.getTime() + (1 * 60 * 60 * 1000)) > new Date(date)) && (
                        <span style={{
                            fontSize: "14px",
                            color: 'red'
                        }}>{translate('capl.create.minDateReserve.message')}</span>
                    )
                }
            </FormControl>
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
                    value={desiredAmount || ''}
                    name={'desiredAmount'}
                    onChange={(event) => setDesiredAmount(Number(event.target.value))}
                />
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
                    value={numberPeople || 1}
                    name={'numberPeople'}
                    onChange={(event) => setNumberPeople(Number(event.target.value))}
                />
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
                    value={whoPay || ''}
                    name={'whoPay'}
                    onChange={(event) => setWhoPay(event.target.value)}
                />
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
                    value={eventType || ''}
                    name={'eventType'}
                    onChange={(event) => setEventType(event.target.value)}
                />
            </FormControl>
            <FormControl
                sx={{
                    gridColumn: gridColumn
                }}
                fullWidth>
                <TextField
                    multiline
                    label={translate('capl.create.comment')}
                    // minRows={2}
                    // required
                    style={{
                        width: "100%",
                        background: "transparent",
                        color: mode === "dark" ? "#fcfcfc" : "#000",
                    }}
                    // id="outlined-basic"
                    color={"secondary"}
                    disabled={isAllowedUser}
                    value={comment ?? ''}
                    name={'comment'}
                    onChange={(event) => setComment(event.target.value)}
                />
            </FormControl>
            <FormControl sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'start',
                gap: 2,
                gridColumn: gridColumn
            }}>
                <Switch
                    checked={writeMe}
                    disabled={isAllowedUser}
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
            {
                (currentUser?._id === user || role === 'admin') && (
                    // <FormControl fullWidth>
                    //     <InputLabel
                    //         id={'userStatusLabel'}>{translate('capl.status.userStatus')}</InputLabel>
                    //     <Select
                    //         size={"small"}
                    //         disabled={isAllowedUser}
                    //         value={userStatus?.value || "draft"}
                    //         labelId={'userStatusLabel'}
                    //         label={translate('capl.status.userStatus')}
                    //         onChange={(event) => setUserStatus && setUserStatus((prevState) => ({
                    //             ...prevState,
                    //             value: event.target.value as TStatus
                    //         }))}
                    //     >
                    //         {
                    //             [
                    //                 {
                    //                     label: "accepted",
                    //                     value: "accepted",
                    //                 },
                    //                 {
                    //                     label: "draft",
                    //                     value: "draft",
                    //                 },
                    //                 {
                    //                     label: "rejected",
                    //                     value: "rejected",
                    //                 },
                    //             ]?.map((item) => (
                    //                 <MenuItem
                    //                     value={item?.value}
                    //                     key={item?.value}
                    //                 >
                    //                     {translate(`capl.status.${item?.label}`)}
                    //                 </MenuItem>
                    //             ))
                    //         }
                    //     </Select>
                    // </FormControl>
                    <ChooseNewStatus
                        value={userStatus?.value as TStatus}
                        disabled={isAllowedUser}
                        label={translate('capl.status.userStatus')}
                        onChange={(event) => setUserStatus && setUserStatus((prevState) => ({
                            ...prevState,
                            value: event.target.value as TStatus
                        }))}
                    />
                )
            }
            {
                (role === 'manager' || role === 'admin') && (
                    <>
                        {/*<FormControl fullWidth>*/}
                        {/*    <InputLabel*/}
                        {/*        id={'institutionStatusLabel'}>{translate('capl.status.institutionStatus')}</InputLabel>*/}
                        {/*    <Select*/}
                        {/*        size={"small"}*/}
                        {/*        disabled={isAllowedManager}*/}
                        {/*        value={institutionStatus?.value || "draft"}*/}
                        {/*        labelId={'institutionStatusLabel'}*/}
                        {/*        label={translate('capl.status.institutionStatus')}*/}
                        {/*        onChange={(event) => setInstitutionStatus && setInstitutionStatus((prevState) => ({*/}
                        {/*            ...prevState,*/}
                        {/*            value: event.target.value as TStatus*/}
                        {/*        }))}*/}

                        {/*    >*/}
                        {/*        {*/}
                        {/*            [*/}
                        {/*                {*/}
                        {/*                    label: "accepted",*/}
                        {/*                    value: "accepted",*/}
                        {/*                },*/}
                        {/*                {*/}
                        {/*                    label: "draft",*/}
                        {/*                    value: "draft",*/}
                        {/*                },*/}
                        {/*                {*/}
                        {/*                    label: "rejected",*/}
                        {/*                    value: "rejected",*/}
                        {/*                },*/}
                        {/*            ]?.map((item) => (*/}
                        {/*                <MenuItem*/}
                        {/*                    value={item?.value}*/}
                        {/*                    key={item?.value}*/}
                        {/*                >*/}
                        {/*                    {translate(`capl.status.${item?.label}`)}*/}
                        {/*                </MenuItem>*/}
                        {/*            ))*/}
                        {/*        }*/}
                        {/*    </Select>*/}
                        {/*</FormControl>*/}
                        <ChooseNewStatus
                            value={institutionStatus?.value as TStatus}
                            disabled={type === 'edit' ? isAllowedManager : false}
                            label={translate('capl.status.institutionStatus')}
                            onChange={(event) => setInstitutionStatus && setInstitutionStatus((prevState) => ({
                                ...prevState,
                                value: event.target.value as TStatus
                            }))}
                        />
                        {
                            institutionStatus?.value === 'accepted' && (
                                <FormControl
                                    sx={{
                                        gridColumn,
                                        display: 'flex',
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        justifyContent: 'start',
                                        gap: 2,
                                        color: 'common.white'
                                    }}
                                    fullWidth
                                >
                                    <Switch
                                        checked={isAllowedEdit}
                                        onChange={checked => setIsAllowedEdit(checked)}
                                    />
                                    {'Is allowed edit user data by user?'}
                                </FormControl>
                            )
                        }
                    </>
                )
            }
        </Box>
    );
};
export default CaplForm


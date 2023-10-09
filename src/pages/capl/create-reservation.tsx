import {useNavigate, useSearchParams} from "react-router-dom";
import {
    Box,
    Button,
    Checkbox,
    FormControl,
    FormHelperText,
    TextareaAutosize,
    TextField,
    Typography
} from "@mui/material";
import {ArrowBackIosNew, Check, Clear} from "@mui/icons-material";
import React, {ChangeEvent, useContext, useEffect, useState} from "react";
import {useGetIdentity, useNotification, useTranslate} from "@refinedev/core";
import {useForm} from "@refinedev/react-hook-form";
import dayjs from "dayjs";

import {ColorModeContext} from "../../contexts";
import {IGetIdentity, ProfileProps, PropertyProps} from "../../interfaces/common";
import {ModalWindow, SearchInstitutions} from "../../components";

const CreateReservation = () => {
    const {data: identity} = useGetIdentity<IGetIdentity>();
    const user: ProfileProps = identity?.user as ProfileProps;
    const translate = useTranslate();
    const navigate = useNavigate();
    const {mode} = useContext(ColorModeContext);
    const {open} = useNotification();
    const [searchParams] = useSearchParams();

    const search = searchParams.get('establishment') ? JSON.parse(searchParams.get('establishment') as string) as PropertyProps : {} as PropertyProps;
    const [searchPlace, setSearchPlace] = useState<PropertyProps>({} as PropertyProps);
    const [fullName, setFullName] = useState<string>('');
    const [eventType, setEventType] = useState<string>('');
    const [date, setDate] = useState<Date | any>(dayjs(new Date()).format('YYYY-MM-DDThh:mm'));
    const [comment, setComment] = useState<string>('');
    const [writeMe, setWriteMe] = useState<boolean>(false);
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [desiredAmount, setDesiredAmount] = useState<number | any>(0);
    const [numberPeople, setNumberPeople] = useState<number | any>(0);
    const [whoPay, setWhoPay] = useState<string>('');


    const {refineCore: {onFinish, formLoading, queryResult}, handleSubmit} = useForm({
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
            redirect: "list"
        },
    })
    useEffect(() => {
        if (user?.name) {
            setFullName(user?.name)
            setWhoPay(user?.name)
        }
    }, [user?.name])
    useEffect(() => {
        if (search) {
            console.log(search)
            setSearchPlace((prevState) => ({...prevState, ...search}));
        }
    }, [search]);


    const onFinishHandler = async () => {
        const requestData = {
            fullName,
            eventType,
            date,
            desiredAmount,
            numberPeople,
            whoPay,
        }
        if (!searchPlace) {
            open?.({
                type: 'error',
                message: `${translate('capl.required', {"field": translate(`home.one`)})}`
            });
            return;
        }
        for (const [key, value] of Object.entries(requestData)) {
            if (!value) {
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
        await onFinish({...requestData, comment, institutionId: searchPlace, writeMe})

    }

    return (
        <Box>
            <Box sx={{
                display: "flex",
                width: '100%',
                justifyContent: 'start',
                alignItems: 'center',
                gap: {xs: 2, md: 6}
            }}>
                <Button
                    variant={"outlined"}
                    onClick={() => navigate(-1)}
                    color={'secondary'}>
                    <ArrowBackIosNew/>
                </Button>
                <Typography sx={{
                    fontSize: {xs: '16px', sm: '24px'}
                }} fontWeight={700} color={mode === "dark" ? "#fcfcfc" : "#11142D"}>
                    {translate('capl.title')}
                </Typography>
            </Box>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    bgcolor: mode === "dark" ? "#2e424d" : "#fcfcfc",
                    mt: {xs: '10px', sm: '20px'},
                    borderRadius: '15px',
                    p: '40px 10px',
                }}
            >
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                    width: '100%',
                    maxWidth: '550px'
                }}>
                    <FormControl fullWidth>
                        <FormHelperText
                            sx={{
                                fontSize: '14px',
                                mb: 0.5,
                                color: (theme) => theme.palette.text.primary
                            }}
                        >
                            {translate('home.one')}
                        </FormHelperText>
                        <SearchInstitutions searchInstitution={searchPlace as PropertyProps}
                                            setSearchInstitution={setSearchPlace}
                                            typeSearch={'all'}/>
                    </FormControl>
                    <FormControl fullWidth>
                        <TextField
                            fullWidth
                            label={translate("capl.create.fullName")}
                            required
                            size={"small"}
                            id="outlined-basic"
                            color={"secondary"}
                            variant="outlined"
                            value={fullName ? fullName : ''}
                            onChange={(event) => setFullName(event.target.value)}
                        />
                    </FormControl>
                    <FormControl fullWidth>
                        <TextField
                            fullWidth
                            label={translate("capl.create.date")}
                            required
                            size={"small"}
                            type={"datetime-local"}
                            id="outlined-basic"
                            color={"secondary"}
                            variant="outlined"
                            value={date ? date : ''}
                            onChange={(event) => setDate(event.target.value)}
                        />
                    </FormControl>
                    <FormControl fullWidth>
                        <TextField
                            fullWidth
                            label={translate("capl.create.desiredAmount")}
                            required
                            size={"small"}
                            type={"number"}
                            id="outlined-basic"
                            color={"secondary"}
                            variant="outlined"
                            inputProps={{inputMode: 'numeric', pattern: '[0-9]*'}}
                            value={desiredAmount ? desiredAmount : ''}
                            onChange={(event) => setDesiredAmount(event.target.value)}
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
                            color={"secondary"}
                            variant="outlined"
                            inputProps={{inputMode: 'numeric', pattern: '[0-9]*'}}
                            value={numberPeople ? numberPeople : ''}
                            onChange={(event) => setNumberPeople(event.target.value)}
                        />
                    </FormControl>
                    <FormControl fullWidth>
                        <TextField
                            fullWidth
                            label={translate("capl.create.whoPay")}
                            required
                            size={"small"}
                            id="outlined-basic"
                            color={"secondary"}
                            variant="outlined"
                            value={whoPay ? whoPay : ''}
                            onChange={(event) => setWhoPay(event.target.value)}
                        />
                    </FormControl>
                    <FormControl fullWidth>
                        <FormHelperText
                            sx={{
                                fontSize: '14px',
                                mb: 0.5,
                                color: (theme) => theme.palette.text.primary
                            }}
                        >
                            {translate('capl.create.comment')}
                        </FormHelperText>
                        <TextareaAutosize
                            minRows={5}
                            required
                            style={{
                                width: "100%",
                                background: "transparent",
                                fontSize: "16px",
                                resize: 'vertical',
                                minHeight: '100px',
                                maxHeight: '200px',
                                height: '100px',
                                borderRadius: 6,
                                padding: 10,
                                color: mode === "dark" ? "#fcfcfc" : "#000",
                            }}
                            id="outlined-basic"
                            color={"secondary"}
                            value={comment ? comment : ''}
                            onChange={(event) => setComment(event.target.value)}
                        />
                    </FormControl>
                    <FormControl fullWidth>
                        <TextField
                            fullWidth
                            label={translate("capl.create.eventType")}
                            required
                            size={"small"}
                            id="outlined-basic"
                            color={"secondary"}
                            variant="outlined"
                            value={eventType ? eventType : ''}
                            onChange={(event) => setEventType(event.target.value)}
                        />
                    </FormControl>
                    <FormControl sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'start'
                    }}>
                        <Checkbox checked={writeMe} value="allowExtraEmails"
                                  onChange={(e: ChangeEvent<HTMLInputElement>) => setWriteMe(e.target.checked)}
                                  color={"secondary"}/>
                        <Typography
                            sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                gap: 1,
                                alignItems: 'center'
                            }}
                        >
                            {translate("capl.create.writeMe")}
                        </Typography>
                    </FormControl>
                    <FormControl fullWidth sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexDirection: 'row'
                    }}>
                        <Button
                            onClick={() => navigate(-1)}
                            variant={'contained'}
                            sx={{
                                width: '37%'
                            }}
                            color={"error"}
                            endIcon={<Clear/>}
                        >
                            {translate('buttons.cancel')}
                        </Button>
                        <Button
                            variant={'contained'}
                            sx={{
                                width: '60%'
                            }}
                            color={"info"}
                            endIcon={<Check/>}
                            onClick={() => setOpenModal(true)}
                        >
                            {translate('buttons.confirm')}
                        </Button>
                        {/*<ModalWindow textButtonConfirm={translate('buttons.send')}*/}
                        {/*             textButtonCancel={translate('buttons.cancel')} textTitle={'Confirm'}*/}
                        {/*             message={'Save reservation'} handleSubmit={handleSubmit(onFinishHandler)}*/}
                        {/*             open={openModal} close={setOpenModal}/>*/}
                    </FormControl>
                </Box>
            </Box>
        </Box>

    );
};
export default CreateReservation

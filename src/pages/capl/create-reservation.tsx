import {Link, useLocation, useNavigate, useSearchParams} from "react-router-dom";
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
import {CustomCreate, ModalWindow, SearchInstitutions} from "../../components";
import {isJsonString} from "../../utils";

const CreateReservation = () => {
    const {data: identity} = useGetIdentity<IGetIdentity>();
    const user: ProfileProps = identity?.user as ProfileProps;
    const translate = useTranslate();
    const navigate = useNavigate();
    const {mode} = useContext(ColorModeContext);
    const {open} = useNotification();
    const {search: searchEstablishment} = useLocation();

    const [search, setSearch] = useState<PropertyProps>({} as PropertyProps);
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

    const establishmentParam = new URLSearchParams(searchEstablishment).get('establishment');

    useEffect(() => {
        if (searchEstablishment) {
            // const jsonString = decodeURIComponent(establishmentParam);
            // if (isJsonString(jsonString)) {
            //     setSearchPlace(JSON.parse(jsonString))
            // }
            console.log(searchEstablishment)
        }
    }, [searchEstablishment]);

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
            headerTitle={translate('capl.title')}
            saveButtonText={translate('buttons.confirm')}
            maxWidth={'900px'}
            onClick={onFinishHandler}
        >
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: '15px',
                    p: '10px',
                }}
            >
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 4,
                    width: '100%',
                }}>
                    <FormControl fullWidth>
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
                </Box>
            </Box>
        </CustomCreate>

    );
};
export default CreateReservation

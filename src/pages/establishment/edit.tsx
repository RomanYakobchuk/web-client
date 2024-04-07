import {useBack, useGetIdentity, useTranslate} from "@refinedev/core";
import {useParams} from "react-router-dom";
import {useForm} from "@refinedev/react-hook-form";
import React, {Reducer, useEffect, useReducer, useState} from "react";
import {RestartAlt} from "@mui/icons-material";
import {ErrorComponent} from "@refinedev/mui";
import {Button} from "antd";

import {ProfileProps, IEstablishment} from "@/interfaces/common";
import DataForm from "@/components/establishment/dataForm";
import {CustomEdit} from "@/components";
import {IEstablishmentFormProps} from "@/interfaces/formData";
import {ESTABLISHMENT} from "@/config/names";
import {
    ActionEstablishment, initialState,
    reducerFormStateEstablishment,
    StateFormEstablishment
} from "@/components/establishment/utills/formDataReducer";

const Edit = () => {
    const {data: currentUser} = useGetIdentity<ProfileProps>();
    const {id} = useParams();
    const goBack = useBack();
    const translate = useTranslate();

    const {
        refineCore: {onFinish, queryResult},
        handleSubmit,
    } = useForm<{ establishment: IEstablishment }>({
        refineCoreProps: {
            resource: `${ESTABLISHMENT}/infoById`,
            action: 'edit',
            id: id as string,
            redirect: false,
            errorNotification: (data: any) => {
                return {
                    type: 'error',
                    message: data?.response?.data?.error
                }
            },
            successNotification: (data: any) => {
                return {
                    type: "success",
                    message: data?.data?.message
                }
            },
            meta: {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }
        },
    });
    const {isLoading: isLoadingData, isError: isErrorData,} = queryResult!;
    const [establishment, setEstablishment] = useState<IEstablishment>({} as IEstablishment);
    const [state, dispatch] = useReducer<Reducer<StateFormEstablishment, ActionEstablishment>>(reducerFormStateEstablishment, initialState);

    useEffect(() => {
        if (queryResult?.data?.data) {
            setEstablishment(queryResult.data.data?.establishment as IEstablishment)
        }
    }, [queryResult]);

    const {
        type,
        workDays,
        workScheduleWeekend,
        sendNotifications,
        cuisine,
        pictures,
        description,
        features,
        location,
        place,
        workSchedule,
        createdBy,
        tags,
        averageCheck,
        title,
        contacts
    } = state as StateFormEstablishment;
    const handleChange = (type: keyof StateFormEstablishment, value: any) => {
        dispatch({type, payload: value});
    }

    const [defaultPictures, setDefaultPictures] = useState<any>([]);

    const loadData = (establishment: IEstablishment) => {
        handleChange("title", establishment?.title)
        handleChange("contacts", establishment?.contacts)
        handleChange("tags", establishment?.tags)
        handleChange("features", establishment?.features)
        handleChange("type", establishment?.type)
        handleChange("averageCheck", establishment?.averageCheck)
        handleChange("createdBy", establishment?.createdBy)
        handleChange("description", establishment?.description)
        handleChange("workSchedule", establishment?.workSchedule)
        handleChange("workDays", establishment?.workSchedule?.workDays?.length > 0 ? establishment?.workSchedule?.workDays : [establishment?.workSchedule?.workDays])
        handleChange("workScheduleWeekend", establishment?.workSchedule?.weekend)
        handleChange("location", establishment?.location)
        handleChange("place", establishment?.place)
        handleChange("sendNotifications", establishment?.sendNotifications)
        handleChange("cuisine", establishment?.cuisine)
        handleChange("pictures", establishment?.pictures)
        setDefaultPictures(establishment?.pictures)
    }
    useEffect(() => {
        if (establishment) {
            loadData(establishment);
        }
    }, [establishment]);

    useEffect(() => {
        if (workDays && workScheduleWeekend) {
            handleChange("workSchedule", {
                workDays: workDays,
                weekend: workScheduleWeekend,
            })
        }
    }, [workDays, workScheduleWeekend])
    const onFinishHandler = async () => {

        if (pictures.length > 10) return alert(translate("home.create.pictures.max"))
        if (pictures.length < 3) return alert('Minimum 3 pictures')

        const formData = new FormData();
        for (let i = 0; i < pictures.length; i++) {
            if (pictures[i] instanceof File) {
                formData.append('pictures', pictures[i] as File);
            } else {
                formData.append('pictures', JSON.stringify(pictures[i]))
            }
        }

        formData.append("description", description);
        formData.append("sendNotifications", JSON.stringify(sendNotifications));
        formData.append("title", title);
        formData.append("type", type);
        if (type === 'restaurant' && cuisine) {
            formData.append("cuisine", cuisine);
        }
        formData.append("createdBy", JSON.stringify(createdBy?.length > 0 ? createdBy : currentUser?._id));
        formData.append("place", JSON.stringify(place));

        formData.append("contacts", JSON.stringify(contacts))

        formData.append("tags", JSON.stringify(tags))

        formData.append("features", JSON.stringify(features))

        formData.append("averageCheck", JSON.stringify(averageCheck))

        formData.append("workSchedule", JSON.stringify(workSchedule))

        formData.append("location", JSON.stringify(location))

        await onFinish(formData);

        goBack();
    }

    if (isErrorData) return <ErrorComponent/>

    const props: IEstablishmentFormProps = {
        defaultPictures,
        onFinishHandler,
        handleSubmit,
        state,
        handleChange,
    }
    return (
        <CustomEdit
            bgColor={'transparent'}
            isLoading={isLoadingData}
            onClick={onFinishHandler}
        >
            <Button
                icon={<RestartAlt/>}
                onClick={() => loadData(establishment)}
                style={{
                    display: 'flex',
                    alignItems: 'center'
                }}
            >
                {translate('buttons.restore')}
            </Button>
            <DataForm
                {...props}
            />
        </CustomEdit>
    )
};
export default Edit

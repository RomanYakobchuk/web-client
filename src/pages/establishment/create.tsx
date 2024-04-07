import React, {FC, Reducer, useEffect, useReducer, useState} from "react";
import {useBack, useGetIdentity, useTranslate} from "@refinedev/core";
import {useForm} from "@refinedev/react-hook-form";

import {IEstablishmentFormProps} from "@/interfaces/formData";
import DataForm from "@/components/establishment/dataForm";
import {ProfileProps} from "@/interfaces/common";
import {ESTABLISHMENT} from "@/config/names";
import {CustomCreate} from "@/components";
import {Link} from "react-router-dom";
import {
    ActionEstablishment,
    initialState,
    reducerFormStateEstablishment,
    StateFormEstablishment
} from "@/components/establishment/utills/formDataReducer";


const Create: FC = () => {

    const {
        refineCore: {onFinish},
        handleSubmit,
    } = useForm({
        refineCoreProps: {
            action: 'create',
            resource: `${ESTABLISHMENT}/create`,
            redirect: false,
            meta: {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }
        },
    });

    const {data: currentUser} = useGetIdentity<ProfileProps>();

    const goBack = useBack();
    const translate = useTranslate();

    const [defaultPictures, _] = useState([]);

    const [state, dispatch] = useReducer<Reducer<StateFormEstablishment, ActionEstablishment>>(reducerFormStateEstablishment, initialState);
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

    const [searchManagerInput, setSearchManagerInput] = useState<string>("");
    const [searchInputValue, setSearchInputValue] = useState<string>("");

    useEffect(() => {
        if (workDays && workScheduleWeekend) {
            handleChange("workSchedule", {
                workDays: workDays,
                weekend: workScheduleWeekend,
            })
        }
    }, [workDays, workScheduleWeekend])
    const onFinishHandler = async () => {

        if (!pictures || pictures.length === 0) return alert("Виберіть головне фото");

        if (pictures.length > 10) return alert(translate("home.create.pictures.max") + ' ' + 10)

        if (pictures.length < 3) return alert('Minimum pictures: 3')
        const formData = new FormData();

        for (let i = 0; i < pictures.length; i++) {
            formData.append('pictures', pictures[i] as File);
        }
        formData.append("description", description);
        formData.append("title", title);
        if (type === "restaurant" && cuisine) {
            formData.append("cuisine", cuisine);
        }
        formData.append("type", type);
        formData.append("createdBy", createdBy ? createdBy : currentUser?._id as string);
        formData.append("place", JSON.stringify(place));

        formData.append("contacts", JSON.stringify(contacts))

        formData.append("tags", JSON.stringify(tags))

        formData.append("features", JSON.stringify(features))

        formData.append("averageCheck", averageCheck)
        formData.append("sendNotifications", JSON.stringify(sendNotifications));

        formData.append("workSchedule", JSON.stringify(workSchedule))

        formData.append("location", JSON.stringify(location))

        await onFinish(formData);

        goBack();
    }

    const props: IEstablishmentFormProps = {
        defaultPictures,
        handleSubmit,
        searchInputValue,
        searchManagerInput,
        state,
        onFinishHandler,
        setSearchInputValue,
        setSearchManagerInput,
        handleChange
    }
    return (
        <CustomCreate
            isLoading={false}
            onClick={onFinishHandler}
            bgColor={'transparent'}
            breadCrumbItems={[
                {
                    title: <Link
                        style={{
                            color: 'silver'
                        }}
                        to={`/${ESTABLISHMENT}`}>{translate(`${ESTABLISHMENT}.${ESTABLISHMENT}`)}</Link>
                },
                {
                    title: translate('home.create.title')
                }
            ]}
        >
            <DataForm
                {...props}
            />
        </CustomCreate>
    )
}
export default Create;

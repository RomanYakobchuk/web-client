import {useBack, useGetIdentity, useTranslate} from "@refinedev/core";
import {useForm} from "@refinedev/react-hook-form";
import React, {FC, useEffect, useState} from "react";

import {IPicture, ProfileProps, IEstablishment} from "@/interfaces/common";
import DataForm from "@/components/establishment/dataForm";
import {CustomCreate} from "@/components";
import {Link} from "react-router-dom";
import {IEstablishmentFormProps} from "@/interfaces/formData";
import {ESTABLISHMENT} from "@/config/names";


const Create: FC = () => {

    const {
        refineCore: {onFinish},
        handleSubmit,
    } = useForm({
        refineCoreProps: {
            resource: `${ESTABLISHMENT}/create`,
            redirect: false,
            meta: {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }
        }
    });

    const {data: currentUser} = useGetIdentity<ProfileProps>();

    const goBack = useBack();
    const translate = useTranslate();

    const [sendNotifications, setSendNotifications] = useState<boolean>(false);
    const [pictures, setPictures] = useState<IPicture[] | File[]>([] as IPicture[] | File[]);
    const [defaultPictures, _] = useState([]);
    const [type, setType] = useState<string>('');
    const [title, setTitle] = useState<string>('');
    const [averageCheck, setAverageCheck] = useState<string>('');
    const [workSchedule, setWorkSchedule] = useState<IEstablishment["workSchedule"] | any>({})

    const [workScheduleWeekend, setWorkScheduleWeekend] = useState<IEstablishment["workSchedule"]["weekend"]>("")
    const [location, setLocation] = useState<IEstablishmentFormProps['location']>({} as IEstablishmentFormProps['location']);
    const [tags, setTags] = useState<any>([]);
    const [place, setPlace] = useState<IEstablishmentFormProps['place']>({} as IEstablishmentFormProps['place']);
    const [features, setFeatures] = useState<any>([]);
    const [contacts, setContacts] = useState<any>([]);
    const [workDays, setWorkDays] = useState<Array<any>>([]);
    const [description, setDescription] = useState<any>("");
    const [createdBy, setCreatedBy] = useState<any>("");

    const [searchManagerInput, setSearchManagerInput] = useState<string>("");
    const [searchInputValue, setSearchInputValue] = useState<string>("");

    useEffect(() => {
        if (workDays && workScheduleWeekend) {
            setWorkSchedule({
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
        formData.append("type", type);
        formData.append("createdBy", createdBy?.length > 0 ? createdBy : currentUser?._id);
        formData.append("place", JSON.stringify(place));

        formData.append("contacts", JSON.stringify(contacts))

        formData.append("tags", JSON.stringify(tags))

        formData.append("features", JSON.stringify(features))

        formData.append("averageCheck", averageCheck)
        formData.append("sendNotifications", JSON.stringify(sendNotifications));

        formData.append("workSchedule", JSON.stringify(workSchedule))

        formData.append("location", JSON.stringify(location))

        await onFinish(formData);

        // if (data && data?.createdBy === currentUser?._id) {
        //     if (data?.user) {
        //         localStorage.setItem(
        //             "user",
        //             JSON.stringify(data?.user)
        //         );
        //     } else if (data) {
        //         localStorage.setItem(
        //             "user",
        //             JSON.stringify(data)
        //         );
        //     }
        // }

        goBack();
    }

    const props = {
        defaultPictures,
        setPictures,
        pictures,
        onFinishHandler,
        handleSubmit,
        tags,
        setAverageCheck,
        averageCheck,
        setTitle,
        title,
        setTags,
        setCreatedBy,
        createdBy,
        searchInputValue,
        setSearchInputValue,
        setWorkScheduleWeekend,
        setWorkDays,
        searchManagerInput,
        contacts,
        setContacts,
        description,
        features,
        setFeatures,
        location,
        setDescription,
        place,
        setPlace,
        setLocation,
        setSearchManagerInput,
        setType,
        type,
        workDays,
        workScheduleWeekend,
        sendNotifications,
        setSendNotifications
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

import {useBack, useGetIdentity, useTranslate} from "@refinedev/core";
import {useParams} from "react-router-dom";
import {useForm} from "@refinedev/react-hook-form";
import React, {useEffect, useState} from "react";
import {RestartAlt} from "@mui/icons-material";
import {ErrorComponent} from "@refinedev/mui";
import {Button} from "antd";

import {IPicture, ProfileProps, IEstablishment} from "@/interfaces/common";
import DataForm from "@/components/establishment/dataForm";
import {CustomEdit} from "@/components";
import {IEstablishmentFormProps} from "@/interfaces/formData";
import {ESTABLISHMENT} from "@/config/names";

const Edit = () => {
    const {data: currentUser} = useGetIdentity<ProfileProps>();
    const {id} = useParams();
    const goBack = useBack();
    const translate = useTranslate();

    const {
        refineCore: {onFinish, queryResult},
        handleSubmit,
        saveButtonProps
    } = useForm<{establishment: IEstablishment}>({
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

    useEffect(() => {
        if (queryResult?.data?.data) {
            setEstablishment(queryResult.data.data?.establishment as IEstablishment)
        }
    }, [queryResult]);

    const [sendNotifications, setSendNotifications] = useState<boolean>(false)
    const [pictures, setPictures] = useState<IPicture[] | File[]>([] as IPicture[] | File[]);
    const [defaultPictures, setDefaultPictures] = useState<any>([]);
    const [type, setType] = useState<string>('');
    const [title, setTitle] = useState<string>('');
    const [averageCheck, setAverageCheck] = useState<string>('');
    const [workSchedule, setWorkSchedule] = useState<IEstablishment["workSchedule"] | any>({})
    const [workScheduleWeekend, setWorkScheduleWeekend] = useState<IEstablishment["workSchedule"]["weekend"]>({} as IEstablishment["workSchedule"]["weekend"])
    const [location, setLocation] = useState<google.maps.LatLngLiteral | any>([]);
    const [tags, setTags] = useState<any>([]);
    const [place, setPlace] = useState<IEstablishment['place'] | any>({} as IEstablishment['place']);
    const [features, setFeatures] = useState<any>([]);
    const [contacts, setContacts] = useState<any>([]);
    const [workDays, setWorkDays] = useState<any>([]);
    const [description, setDescription] = useState<string | any>('');
    const [createdBy, setCreatedBy] = useState<string>('');

    const loadData = () => {
        setContacts(establishment?.contacts)
        setTags(establishment?.tags)
        setType(establishment?.type)
        setFeatures(establishment?.features)
        setAverageCheck(establishment?.averageCheck)
        setCreatedBy(establishment?.createdBy)
        setDescription(establishment?.description)
        setTitle(establishment?.title)
        setWorkSchedule(establishment?.workSchedule)
        setWorkDays(establishment?.workSchedule?.workDays?.length > 0 ? establishment?.workSchedule?.workDays : [establishment?.workSchedule?.workDays])
        setWorkScheduleWeekend(establishment?.workSchedule?.weekend)
        setLocation(establishment?.location)
        setPlace(establishment?.place)
        setPictures(establishment?.pictures)
        setDefaultPictures(establishment?.pictures)
        setSendNotifications(establishment?.sendNotifications)
    }
    useEffect(() => {
        if (establishment) {
            loadData();
        }
    }, [establishment]);

    useEffect(() => {
        if (workDays && workScheduleWeekend) {
            setWorkSchedule({
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

        formData.append("description", JSON.stringify(description));
        formData.append("sendNotifications", JSON.stringify(sendNotifications));
        formData.append("title", JSON.stringify(title));
        formData.append("type", JSON.stringify(type));
        formData.append("createdBy", JSON.stringify(createdBy?.length > 0 ? createdBy : currentUser?._id));
        formData.append("place", JSON.stringify(place));

        formData.append("contacts", JSON.stringify(contacts))

        formData.append("tags", JSON.stringify(tags))

        formData.append("features", JSON.stringify(features))

        formData.append("averageCheck", JSON.stringify(averageCheck))

        formData.append("workSchedule", JSON.stringify(workSchedule))

        formData.append("location", JSON.stringify(location))

        await onFinish(formData);

        // if (data && data?.createdById === currentUser?._id) {
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

    if (isErrorData) return <ErrorComponent/>

    const props: IEstablishmentFormProps = {
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
        setWorkScheduleWeekend,
        setWorkDays,
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
        setType,
        type,
        workDays,
        workScheduleWeekend,
        sendNotifications,
        setSendNotifications
    }
    return (
        <CustomEdit
            bgColor={'transparent'}
            isLoading={isLoadingData}
            onClick={onFinishHandler}
        >
            <Button
                icon={<RestartAlt/>}
                onClick={loadData}
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

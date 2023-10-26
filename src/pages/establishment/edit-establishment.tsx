import {useBack, useGetIdentity, useTranslate} from "@refinedev/core";
import {useParams} from "react-router-dom";
import {useForm} from "@refinedev/react-hook-form";
import React, {useEffect, useState} from "react";

import {IPicture, ProfileProps, PropertyProps} from "../../interfaces/common";
import DataForm from "../../components/establishment/dataForm";
import {ErrorComponent} from "@refinedev/mui";
import {CustomEdit} from "../../components";
import {IEstablishmentFormProps} from "../../interfaces/formData";
import {RestartAlt} from "@mui/icons-material";
import {Button} from "antd";

const EditEstablishment = () => {
    const {data: currentUser} = useGetIdentity<ProfileProps>();
    const {id} = useParams();
    const goBack = useBack();
    const translate = useTranslate();

    const {
        refineCore: {onFinish, queryResult},
        handleSubmit,
        saveButtonProps
    } = useForm<{institution: PropertyProps}>({
        refineCoreProps: {
            resource: `institution/infoById`,
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
        },
    });
    const {isLoading: isLoadingData, isError: isErrorData,} = queryResult!;

    const [institution, setInstitution] = useState<PropertyProps>({} as PropertyProps);

    useEffect(() => {
        if (queryResult?.data?.data) {
            setInstitution(queryResult.data.data?.institution as PropertyProps)
        }
    }, [queryResult]);

    const [sendNotifications, setSendNotifications] = useState<boolean>(false)
    const [pictures, setPictures] = useState<IPicture[] | File[]>([] as IPicture[] | File[]);
    const [defaultPictures, setDefaultPictures] = useState<any>([]);
    const [type, setType] = useState<string>('');
    const [title, setTitle] = useState<string>('');
    const [averageCheck, setAverageCheck] = useState<string>('');
    const [workSchedule, setWorkSchedule] = useState<PropertyProps["workSchedule"] | any>({})
    const [workScheduleWeekend, setWorkScheduleWeekend] = useState<PropertyProps["workSchedule"]["weekend"]>({} as PropertyProps["workSchedule"]["weekend"])
    const [location, setLocation] = useState<google.maps.LatLngLiteral | any>([]);
    const [tags, setTags] = useState<any>([]);
    const [place, setPlace] = useState<PropertyProps['place'] | any>({} as PropertyProps['place']);
    const [features, setFeatures] = useState<any>([]);
    const [contacts, setContacts] = useState<any>([]);
    const [workDays, setWorkDays] = useState<any>([]);
    const [description, setDescription] = useState<string | any>('');
    const [createdBy, setCreatedBy] = useState<string>('');

    const loadData = () => {
        setContacts(institution?.contacts)
        setTags(institution?.tags)
        setType(institution?.type)
        setFeatures(institution?.features)
        setAverageCheck(institution?.averageCheck)
        setCreatedBy(institution?.createdBy)
        setDescription(institution?.description)
        setTitle(institution?.title)
        setWorkSchedule(institution?.workSchedule)
        setWorkDays(institution?.workSchedule?.workDays?.length > 0 ? institution?.workSchedule?.workDays : [institution?.workSchedule?.workDays])
        setWorkScheduleWeekend(institution?.workSchedule?.weekend)
        setLocation(institution?.location)
        setPlace(institution?.place)
        setPictures(institution?.pictures)
        setDefaultPictures(institution?.pictures)
        setSendNotifications(institution?.sendNotifications)
    }
    useEffect(() => {
        if (institution) {
            loadData();
        }
    }, [institution]);

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
export default EditEstablishment

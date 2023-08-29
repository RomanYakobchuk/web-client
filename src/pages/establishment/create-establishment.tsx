import {useGetIdentity, useTranslate} from "@refinedev/core";
import {useForm} from "@refinedev/react-hook-form";
import {FC, useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";

import {ProfileProps, PropertyProps} from "../../interfaces/common";
import DataForm from "../../components/establishment/dataForm";
import {CustomCreate} from "../../components";


const CreateEstablishment: FC = () => {

    const {
        refineCore: {onFinish},
        handleSubmit,
    } = useForm({
        refineCoreProps: {
            resource: `institution/create`,
            redirect: false,
        }
    });

    const {data: currentUser} = useGetIdentity<ProfileProps>();

    const navigate = useNavigate();
    const translate = useTranslate();

    const [sendNotifications, setSendNotifications] = useState<boolean>(false);
    const [pictures, setPictures] = useState<Array<{name: string, url: string} | File>>([]);
    const [defaultPictures, setDefaultPictures] = useState([]);
    const [type, setType] = useState<string>('');
    const [title, setTitle] = useState<string>('');
    const [averageCheck, setAverageCheck] = useState<string>('');
    const [workSchedule, setWorkSchedule] = useState<PropertyProps["workSchedule"] | any>({})

    const [workScheduleWeekend, setWorkScheduleWeekend] = useState<PropertyProps["workSchedule"]["weekend"]>("")
    const [location, setLocation] = useState<google.maps.LatLngLiteral | any>({} as google.maps.LatLngLiteral);
    const [tags, setTags] = useState<any>([]);
    const [place, setPlace] = useState({address: '', city: ''})
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

        if (pictures.length > 10) return alert(translate("home.create.pictures.max"))

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

        const {data}: any = await onFinish(formData);

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

        navigate('/home')
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
            bgColor={'transparent'}>
            <DataForm
                {...props}
            />
        </CustomCreate>
    )
}
export default CreateEstablishment;

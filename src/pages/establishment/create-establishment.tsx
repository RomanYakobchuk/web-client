import {useGetIdentity, useTranslate} from "@refinedev/core";
import {useForm} from "@refinedev/react-hook-form";
import {FC, useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";

import {ProfileProps, PropertyProps} from "../../interfaces/common";
import DataForm from "../../components/establishment/dataForm";
import {CustomCreate} from "../../components";


const CreateEstablishment: FC = () => {

    const {
        refineCore: {onFinish, formLoading},
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

    const [otherPhoto, setOtherPhoto] = useState<any>([]);
    const [open, setOpen] = useState<boolean>(false);
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
    const [variantForDisplay, setVariantForDisplay] = useState<string>('1');

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

        if (!otherPhoto && otherPhoto?.length < 0) return alert("Виберіть головне фото");

        if (otherPhoto.length > 10) return alert(translate("home.create.otherPhoto.max"))

        const formData = new FormData();

        for (let i = 0; i < otherPhoto.length; i++) {
            formData.append('otherPhoto', otherPhoto[i] as File);
        }
        formData.append("description", description);
        formData.append("title", title);
        formData.append("type", type);
        formData.append("variantForDisplay", variantForDisplay);
        formData.append("createdBy", createdBy?.length > 0 ? createdBy : currentUser?._id);
        formData.append("place", JSON.stringify(place));

        formData.append("contacts", JSON.stringify(contacts))

        formData.append("tags", JSON.stringify(tags))

        formData.append("features", JSON.stringify(features))

        formData.append("averageCheck", averageCheck)

        formData.append("workSchedule", JSON.stringify(workSchedule))

        formData.append("location", JSON.stringify(location))

        const {data}: any = await onFinish(formData);

        if (data && data?.createdById === currentUser?._id) {
            if (data?.user) {
                localStorage.setItem(
                    "user",
                    JSON.stringify(data?.user)
                );
            } else if (data) {
                localStorage.setItem(
                    "user",
                    JSON.stringify(data)
                );
            }
        }
        setOpen(false);

        navigate('/home')
    }


    return (
        <CustomCreate isLoading={false} bgColor={'transparent'}>
            <DataForm
                setOtherPhoto={setOtherPhoto}
                otherPhoto={otherPhoto}
                onFinishHandler={onFinishHandler}
                formLoading={formLoading}
                titleAction={'create'}
                handleSubmit={handleSubmit}
                open={open}
                setOpen={setOpen}
                tags={tags}
                setAverageCheck={setAverageCheck}
                averageCheck={averageCheck}
                setTitle={setTitle}
                title={title}
                setTags={setTags}
                setCreatedBy={setCreatedBy}
                createdBy={createdBy}
                searchInputValue={searchInputValue}
                setSearchInputValue={setSearchInputValue}
                setWorkScheduleWeekend={setWorkScheduleWeekend}
                setWorkDays={setWorkDays}
                searchManagerInput={searchManagerInput}
                setVariantForDisplay={setVariantForDisplay}
                contacts={contacts}
                setContacts={setContacts}
                description={description}
                features={features}
                setFeatures={setFeatures}
                location={location}
                setDescription={setDescription}
                place={place}
                setPlace={setPlace}
                setLocation={setLocation}
                setSearchManagerInput={setSearchManagerInput}
                setType={setType}
                type={type}
                variantForDisplay={variantForDisplay}
                workDays={workDays}
                workScheduleWeekend={workScheduleWeekend}
            />
        </CustomCreate>
    )
}
export default CreateEstablishment;

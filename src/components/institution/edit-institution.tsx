import {useGetIdentity, useTranslate} from "@refinedev/core";
import {useNavigate, useParams} from "react-router-dom";
import {useForm} from "@refinedev/react-hook-form";
import {useEffect, useState} from "react";

import {ProfileProps, PropertyProps} from "../../interfaces/common";
import DataForm from "./utills/dataForm";
import Loading from "../loading";
import {ErrorComponent} from "@refinedev/mui";

const EditInstitution = () => {
    const {data: currentUser} = useGetIdentity<ProfileProps>();
    const {id} = useParams();
    const navigate = useNavigate();
    const translate = useTranslate();

    const {
        refineCore: {onFinish, formLoading, queryResult,},
        handleSubmit,
    } = useForm({
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
            }
        },
    });
    const {isLoading: isLoadingData, isError: isErrorData,} = queryResult!;

    const [institution, setInstitution] = useState<PropertyProps>({} as PropertyProps);

    useEffect(() => {
        if (queryResult?.data?.data) {
            setInstitution(queryResult.data.data as PropertyProps)
        }
    }, [queryResult]);

    const [mainPhoto, setMainPhoto] = useState<any>('');
    const [otherPhoto, setOtherPhoto] = useState<any>([]);
    const [open, setOpen] = useState<boolean>(false);
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
    const [variantForDisplay, setVariantForDisplay] = useState<string>('1');

    useEffect(() => {
        if (institution) {
            setContacts(institution?.contacts)
            setTags(institution?.tags)
            setType(institution?.type)
            setFeatures(institution?.features)
            setVariantForDisplay(institution?.variantForDisplay)
            setAverageCheck(institution?.averageCheck)
            setCreatedBy(institution?.createdBy)
            setDescription(institution?.description)
            setTitle(institution?.title)
            setWorkSchedule(institution?.workSchedule)
            setWorkDays(institution?.workSchedule?.workDays?.length > 0 ? institution?.workSchedule?.workDays : [institution?.workSchedule?.workDays])
            setWorkScheduleWeekend(institution?.workSchedule?.weekend)
            setLocation(institution?.location)
            setPlace(institution?.place)
            setMainPhoto(institution?.mainPhoto)
            setOtherPhoto(institution?.otherPhoto)
        }
    }, [institution])

    useEffect(() => {
        if (workDays && workScheduleWeekend) {
            setWorkSchedule({
                workDays: workDays,
                weekend: workScheduleWeekend,
            })
        }
    }, [workDays, workScheduleWeekend])
    const onFinishHandler = async () => {

        if ((!mainPhoto && !mainPhoto.name) || (!otherPhoto && otherPhoto?.length === 0)) return alert("Виберіть головне фото");

        if (otherPhoto.length > 10) return alert(translate("home.create.otherPhoto.max"))

        const formData = new FormData();

        formData.append("mainPhoto", mainPhoto as File);
        for (let i = 0; i < otherPhoto.length; i++) {
            if (otherPhoto[i] instanceof File) {
                formData.append('otherPhoto', otherPhoto[i] as File);
            } else {
                formData.append('otherPhoto', JSON.stringify(otherPhoto[i]))
            }
        }
        formData.append("description", JSON.stringify(description));
        formData.append("title", JSON.stringify(title));
        formData.append("type", JSON.stringify(type));
        formData.append("variantForDisplay", JSON.stringify(variantForDisplay));
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
        setOpen(false);

        navigate(`/all_institutions/show/${id}`)
    }

    if (isLoadingData) return <Loading/>
    if (isErrorData) return <ErrorComponent/>

    return (
        <DataForm
            setMainPhoto={setMainPhoto}
            mainPhoto={mainPhoto}
            titleAction={'edit'}
            setOtherPhoto={setOtherPhoto}
            otherPhoto={otherPhoto}
            onFinishHandler={onFinishHandler}
            formLoading={formLoading}
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
            setWorkScheduleWeekend={setWorkScheduleWeekend}
            setWorkDays={setWorkDays}
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
            setType={setType}
            type={type}
            variantForDisplay={variantForDisplay}
            workDays={workDays}
            workScheduleWeekend={workScheduleWeekend}
        />
    )
};
export default EditInstitution

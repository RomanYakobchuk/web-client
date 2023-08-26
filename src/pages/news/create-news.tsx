import {useLocation, useNavigate} from "react-router-dom";
import React, {useEffect, useState} from "react";
import {useGetIdentity, useTranslate} from "@refinedev/core";
import {useForm} from "@refinedev/react-hook-form";

import {IGetIdentity, ProfileProps} from "../../interfaces/common";
import NewsFormData from "../../components/news/utills/newsFormData";

const CreateNews = () => {
    const {search} = useLocation();
    const {data: identity} = useGetIdentity<IGetIdentity>();
    const user: ProfileProps = identity?.user as ProfileProps;
    const translate = useTranslate();
    const navigate = useNavigate();

    const [currentInstitutionId, setCurrentInstitutionId] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [title, setTitle] = useState<string>("");
    const [variantForDisplay, setVariantForDisplay] = useState<string>("1");
    const [pictures, setPictures] = useState<any>([]);
    const [category, setCategory] = useState('general');
    const [workDays, setWorkDays] = useState<any>([]);
    const [status, setStatus] = useState('published');
    const [datePublish, setDatePublish] = useState<Date | any>();
    const [isDatePublish, setIsDatePublish] = useState<boolean>(false);


    useEffect(() => {
        if (search) {
            setCurrentInstitutionId(search?.split('=')[1])
        }
    }, [search]);

    const {
        refineCore: {onFinish, formLoading},
        handleSubmit,
    } = useForm({
        refineCoreProps: {
            resource: `news/create`,
            redirect: false,
        }
    });

    const onFinishHandler = async () => {

        if (!pictures && pictures?.length < 0) return alert("Виберіть головне фото");

        if (pictures.length > 8) return alert(translate("home.create.pictures.max"))

        const formData = new FormData();

        for (let i = 0; i < pictures.length; i++) {
            console.log(pictures[i].order)
            formData.append('pictures', pictures[i] as File);
        }
        formData.append("description", description);
        formData.append("title", title);
        formData.append("status", status);
        formData.append("category", category);
        formData.append('isDatePublished', JSON.stringify(isDatePublish));
        if (datePublish) {
            formData.append('datePublished', JSON.stringify(datePublish));
        }
        formData.append("createdBy", user?._id);
        formData.append("institutionId", currentInstitutionId);
        formData.append("variantForDisplay", variantForDisplay);
        formData.append("dateEvent", JSON.stringify(workDays));

        const {data}: any = await onFinish(formData);

        // if (data && data?.createdById === user?._id) {
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
        // setOpen(false);

        navigate(-1)
    }

    return (
        <NewsFormData
            handleSubmit={handleSubmit}
            onFinishHandler={onFinishHandler}
            pictures={pictures}
            setPictures={setPictures}
            currentInstitutionId={currentInstitutionId}
            setCurrentInstitutionId={setCurrentInstitutionId}
            title={title}
            setTitle={setTitle}
            setWorkDays={setWorkDays}
            category={category}
            setCategory={setCategory}
            workDays={workDays}
            description={description}
            setDescription={setDescription}
            status={status}
            setStatus={setStatus}
            isDatePublished={isDatePublish}
            setIsDatePublished={setIsDatePublish}
            formLoading={formLoading}
            datePublished={datePublish}
            setDatePublished={setDatePublish}
        />
    )
};
export default CreateNews;

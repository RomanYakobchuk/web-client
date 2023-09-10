import {useLocation} from "react-router-dom";
import React, {useEffect, useState} from "react";
import {useBack, useGetIdentity, useTranslate} from "@refinedev/core";
import {useForm} from "@refinedev/react-hook-form";

import {
    IGetIdentity,
    INewsDataProps,
    INewsDateEvent,
    IPicture,
    ProfileProps,
    PropertyProps
} from "../../interfaces/common";
import NewsFormData from "../../components/news/utills/newsFormData";
import {CustomCreate} from "../../components";

const CreateNews = () => {
    const {search} = useLocation();
    const {data: identity} = useGetIdentity<IGetIdentity>();
    const user: ProfileProps = identity?.user as ProfileProps;
    const translate = useTranslate();
    const goBack = useBack();

    const [defaultPictures, _] = useState<IPicture[]>([] as IPicture[])
    const [institutionInfo, setInstitutionInfo] = useState<PropertyProps>({} as PropertyProps);
    const [description, setDescription] = useState<string>("");
    const [title, setTitle] = useState<string>("");
    const [pictures, setPictures] = useState<IPicture[] | File[]>([] as IPicture[] | File[]);
    const [category, setCategory] = useState('general');
    const [dateEvent, setDateEvent] = useState<INewsDateEvent[]>([] as INewsDateEvent[]);
    const [status, setStatus] = useState('published');
    const [datePublish, setDatePublish] = useState<Date | any>();
    const [isDatePublish, setIsDatePublish] = useState<boolean>(false);


    useEffect(() => {
        if (search) {
            setInstitutionInfo((prevState) => ({...prevState, _id: search?.split('=')[1]}))
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

        if (!pictures || pictures?.length <= 0) return alert("");

        if (pictures.length > 6) return alert(translate("home.create.pictures.max"))

        const currentDate = new Date();
        const desiredDate = new Date(datePublish);

        if (desiredDate < currentDate) return alert('The publication date must be greater than the current date');

        const formData = new FormData();

        for (let i = 0; i < pictures.length; i++) {
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
        formData.append("institutionId", institutionInfo?._id);
        formData.append("dateEvent", JSON.stringify(dateEvent));

        await onFinish(formData);

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

        goBack();
    }

    const props: INewsDataProps ={
        defaultPictures,
        handleSubmit,
        onFinishHandler,
        pictures,
        setPictures,
        institutionInfo,
        setInstitutionInfo,
        title,
        setTitle,
        setDateEvent,
        category,
        setCategory,
        dateEvent,
        description,
        setDescription,
        status,
        setStatus,
        isDatePublished: isDatePublish,
        setIsDatePublished: setIsDatePublish,
        datePublished: datePublish,
        setDatePublished: setDatePublish,
    }
    return (
        <CustomCreate
            bgColor={'transparent'}
            onClick={onFinishHandler}
            isLoading={formLoading}>
            <NewsFormData
                {...props}
            />
        </CustomCreate>
    )
};
export default CreateNews;

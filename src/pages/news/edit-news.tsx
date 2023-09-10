import {useParams} from "react-router-dom";
import {useBack, useTranslate} from "@refinedev/core";
import React, {useEffect, useState} from "react";
import {useForm} from "@refinedev/react-hook-form";

import {INews, INewsDataProps, INewsDateEvent, IPicture} from "../../interfaces/common";
import NewsFormData from "../../components/news/utills/newsFormData";
import {CustomEdit} from "../../components";

const EditNews = () => {
    const translate = useTranslate();
    const goBack = useBack();

    const {id} = useParams();
    const {
        refineCore: {onFinish, queryResult},
        handleSubmit,
        saveButtonProps
    } = useForm({
        refineCoreProps: {
            resource: `news/infoById`,
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

    const {isLoading: isLoadingData, isError: isErrorData} = queryResult!;

    const [news, setNews] = useState<INews>({} as INews);

    useEffect(() => {
        if (queryResult?.data?.data) {
            setNews(queryResult.data.data as INews)
        }
    }, [queryResult])

    const [institutionId, setInstitutionId] = useState<{_id: string, title: string}>({} as {_id: string, title: string});
    const [defaultPictures, _] = useState<IPicture[]>([] as IPicture[])
    const [description, setDescription] = useState<string>("");
    const [title, setTitle] = useState<string>("");
    const [pictures, setPictures] = useState<IPicture[] | File[]>([] as IPicture[] | File[]);
    const [category, setCategory] = useState<any>('general');
    const [dateEvent, setDateEvent] = useState<INewsDateEvent[]>([] as INewsDateEvent[]);
    const [status, setStatus] = useState<any>('published');
    const [datePublish, setDatePublish] = useState<Date | any>();
    const [isDatePublish, setIsDatePublish] = useState<boolean | any>(false);

    useEffect(() => {
        if (news) {
            setTitle(news?.title)
            setCategory(news?.category)
            setDescription(news?.description)
            setStatus(news?.status)
            setDatePublish(news?.publishAt?.datePublish)
            setIsDatePublish(news?.publishAt?.isPublish)
            setPictures(news?.pictures)
            setDateEvent(news?.dateEvent)
            setInstitutionId(news?.institutionId)
        }
    }, [news]);

    const onFinishHandler = async () => {

        if (!pictures || pictures?.length < 0) return alert("Виберіть головне фото");

        if (pictures.length > 8) return alert(translate("home.create.pictures.max"))

        const formData = new FormData();

        for (let i = 0; i < pictures.length; i++) {
            if (pictures[i] instanceof File) {
                formData.append('pictures', pictures[i] as File);
            } else {
                formData.append('pictures', JSON.stringify(pictures[i]))
            }
        }
        formData.append("description", description);
        formData.append("title", title);
        formData.append("category", category);
        // formData.append("createdBy", JSON.stringify(user?._id));
        formData.append("institutionId", institutionId?._id);
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
    };

    if (isErrorData) return <div>Error</div>

    const props: INewsDataProps = {
        defaultPictures,
        handleSubmit,
        onFinishHandler,
        pictures,
        setPictures,
        title,
        setTitle,
        setDateEvent,
        institutionId,
        category,
        setInstitutionId,
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
        <CustomEdit
            bgColor={'transparent'}
            onClick={onFinishHandler}
            isLoading={isLoadingData}
            saveButtonProps={saveButtonProps}
        >
            <NewsFormData
                {...props}
            />
        </CustomEdit>
    )
};
export default EditNews;

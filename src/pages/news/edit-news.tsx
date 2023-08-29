import {useNavigate, useParams} from "react-router-dom";
import {useTranslate} from "@refinedev/core";
import React, {useEffect, useState} from "react";
import {useForm} from "@refinedev/react-hook-form";

import {INews, INewsDateEvent, IPicture} from "../../interfaces/common";
import NewsFormData from "../../components/news/utills/newsFormData";
import Loading from "../../components/loading/loading";
import {CustomEdit} from "../../components";

const EditNews = () => {
    const translate = useTranslate();
    const navigate = useNavigate();

    const {id} = useParams();
    const {
        refineCore: {onFinish, formLoading, queryResult},
        handleSubmit,
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

    const [defaultPictures, _] = useState<IPicture[]>([] as IPicture[])
    const [currentInstitutionId, setCurrentInstitutionId] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [title, setTitle] = useState<string>("");
    const [variantForDisplay, setVariantForDisplay] = useState<string | any>("1");
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
            setCurrentInstitutionId(news?.institutionId)
            setPictures(news?.pictures)
            setVariantForDisplay(news?.variantForDisplay)
            setDateEvent(news?.dateEvent)
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
        formData.append("description", JSON.stringify(description));
        formData.append("title", JSON.stringify(title));
        formData.append("category", JSON.stringify(category));
        // formData.append("createdBy", JSON.stringify(user?._id));
        formData.append("institutionId", JSON.stringify(currentInstitutionId));
        formData.append("variantForDisplay", JSON.stringify(variantForDisplay));
        formData.append("dateEvent", JSON.stringify(dateEvent));

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
    };

    if (isLoadingData) return <Loading/>
    if (isErrorData) return <div>Error</div>

    return (
        <CustomEdit
            bgColor={'transparent'}
            onClick={onFinishHandler}
            isLoading={formLoading}>
            <NewsFormData
                defaultPictures={defaultPictures}
                handleSubmit={handleSubmit}
                onFinishHandler={onFinishHandler}
                pictures={pictures}
                setPictures={setPictures}
                currentInstitutionId={currentInstitutionId}
                setCurrentInstitutionId={setCurrentInstitutionId}
                title={title}
                setTitle={setTitle}
                setDateEvent={setDateEvent}
                category={category}
                setCategory={setCategory}
                dateEvent={dateEvent}
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
        </CustomEdit>
    )
};
export default EditNews;

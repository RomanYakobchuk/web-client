import {useNavigate, useParams} from "react-router-dom";
import {useGetIdentity, useTranslate} from "@refinedev/core";
import React, {useEffect, useState} from "react";
import {useForm} from "@refinedev/react-hook-form";
import {FieldValues} from "react-hook-form";

import {IGetIdentity, INews, ProfileProps} from "../../interfaces/common";
import NewsFormData from "../../components/news/utills/newsFormData";
import Loading from "../../components/loading/loading";

const EditNews = () => {
    const {data: identity} = useGetIdentity<IGetIdentity>();
    const user: ProfileProps = identity?.user as ProfileProps;
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

    const [currentInstitutionId, setCurrentInstitutionId] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [title, setTitle] = useState<string>("");
    const [variantForDisplay, setVariantForDisplay] = useState<string | any>("1");
    const [otherPhoto, setOtherPhoto] = useState<any>([]);
    const [category, setCategory] = useState<any>('general');
    const [workDays, setWorkDays] = useState<any>([]);
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
            setOtherPhoto(news?.otherPhoto)
            setVariantForDisplay(news?.variantForDisplay)
            setWorkDays(news?.dateEvent)
        }
    }, [news]);

    const onFinishHandler = async (date: FieldValues) => {

        if (!otherPhoto && otherPhoto?.length < 0) return alert("Виберіть головне фото");

        if (otherPhoto.length > 8) return alert(translate("home.create.otherPhoto.max"))

        const formData = new FormData();

        for (let i = 0; i < otherPhoto.length; i++) {
            if (otherPhoto[i] instanceof File) {
                formData.append('otherPhoto', otherPhoto[i] as File);
            } else {
                formData.append('otherPhoto', JSON.stringify(otherPhoto[i]))
            }
        }
        formData.append("description", JSON.stringify(description));
        formData.append("title", JSON.stringify(title));
        formData.append("category", JSON.stringify(category));
        // formData.append("createdBy", JSON.stringify(user?._id));
        formData.append("institutionId", JSON.stringify(currentInstitutionId));
        formData.append("variantForDisplay", JSON.stringify(variantForDisplay));
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
    };

    if (isLoadingData) return <Loading/>
    if (isErrorData) return <div>Error</div>

    return (
        <NewsFormData
            handleSubmit={handleSubmit}
            onFinishHandler={onFinishHandler}
            otherPhoto={otherPhoto}
            setOtherPhoto={setOtherPhoto}
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
            variantForDisplay={variantForDisplay}
            setVariantForDisplay={setVariantForDisplay}
            formLoading={formLoading}
            datePublished={datePublish}
            setDatePublished={setDatePublish}
        />
    )
};
export default EditNews;

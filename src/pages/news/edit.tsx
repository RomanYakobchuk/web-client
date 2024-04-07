import React, {Reducer, useEffect, useReducer, useState} from "react";
import {useBack, useTranslate} from "@refinedev/core";
import {useForm} from "@refinedev/react-hook-form";
import {useParams} from "react-router-dom";
import {Button} from "antd";

import {INews, IPicture, IEstablishment} from "@/interfaces/common";
import NewsFormData from "@/components/news/utills/newsFormData";
import {INewsDataProps} from "@/interfaces/formData";
import {RestartAlt} from "@mui/icons-material";
import {CustomEdit} from "@/components";
import {
    ActionNews,
    initialState,
    reducerFormStateNews,
    StateFormNews
} from "@/components/news/utills/newsFormDataReducer";

const Edit = () => {
    const translate = useTranslate();
    const goBack = useBack();

    const {id} = useParams();
    const {
        refineCore: {onFinish, queryResult},
        handleSubmit,
    } = useForm({
        warnWhenUnsavedChanges: true,
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
            },
            meta: {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }
        },

    });

    const {isLoading: isLoadingData} = queryResult!;

    const [news, setNews] = useState<INews>({} as INews);

    useEffect(() => {
        if (queryResult?.data?.data) {
            setNews(queryResult.data.data as INews)
        }
    }, [queryResult])

    const [defaultPictures, setDefaultPictures] = useState<IPicture[]>([] as IPicture[])

    const [state, dispatch] = useReducer<Reducer<StateFormNews, ActionNews>>(reducerFormStateNews, initialState);

    const {
        title,
        establishmentInfo,
        // createdBy,
        status,
        pictures,
        category,
        place,
        dateEvent,
        description,
        datePublish,
        isDatePublish
    } = state as StateFormNews;
    const handleChange = (type: keyof StateFormNews, value: any) => {
        dispatch({type, payload: value});
    }
    const loadData = () => {
        handleChange("title", news?.title)
        handleChange("description", news?.description)
        handleChange("dateEvent", news?.dateEvent)
        handleChange("pictures", news?.pictures)
        handleChange("category", news?.category)
        handleChange("status", news?.status)
        handleChange("datePublish", news?.publishAt?.datePublish)
        handleChange("isDatePublish", news?.publishAt?.isPublish)
        handleChange("dateEvent", news?.dateEvent)
        handleChange("establishmentInfo", news?.establishmentId as IEstablishment)
        handleChange("place", news?.place)
        setDefaultPictures(news?.pictures);
    }
    useEffect(() => {
        if (news) {
            loadData();
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
        formData.append('place', JSON.stringify(place));
        formData.append("category", category);
        formData.append("status", status);
        // formData.append("createdBy", JSON.stringify(user?._id));
        formData.append("establishmentId", establishmentInfo?._id as string);
        formData.append("dateEvent", JSON.stringify(dateEvent));

        await onFinish(formData);

        goBack();
    };

    // if (isErrorData) return <div>Error</div>

    const props: INewsDataProps = {
        defaultPictures,
        handleSubmit,
        onFinishHandler,
        handleChange,
        state
    }

    return (
        <CustomEdit
            bgColor={'transparent'}
            onClick={onFinishHandler}
            isLoading={isLoadingData}
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
            <NewsFormData
                {...props}
            />
        </CustomEdit>
    )
};
export default Edit;

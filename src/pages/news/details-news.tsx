import {useNavigate, useParams} from "react-router-dom";
import {useShow, useTranslate} from "@refinedev/core";
import {ErrorComponent} from "@refinedev/mui";
import {
    Box, Button,
    Typography
} from "@mui/material";
import MDEditor from "@uiw/react-md-editor";
// import {useJsApiLoader} from "@react-google-maps/api";
import React, {useContext} from "react";

import {INews, PropertyProps} from "@/interfaces/common";
import {useMobile, useUserInfo} from "@/hook";
import {ColorModeContext} from "@/contexts";
import OtherNews from "@/components/news/utills/otherNews";
import {CustomShow} from "@/components";
import ImageGalleryV2 from "@/components/gallery/imageGallery_v-2";
import NewsMainInfo from "./utils/newsMainInfo";
import {LoadingDetailsNews} from "@/components/news/whileLoading/loadingDetailsNews";

const DetailsNews = () => {

    const {id} = useParams();
    const navigate = useNavigate();
    const {user} = useUserInfo();
    const {width, layoutWidth} = useMobile();
    const {mode} = useContext(ColorModeContext);
    const translate = useTranslate();

    const {queryResult} = useShow<INews>({
        resource: 'news/infoById',
        id: id as string,
        errorNotification: (data: any) => {
            return {
                type: 'error',
                message: data?.response?.data?.error
            }
        }
    });
    const {data, isLoading, isError} = queryResult;

    // const {isLoaded} = useJsApiLoader({
    //     id: 'google-map-script',
    //     googleMapsApiKey: import.meta.env.VITE_APP_GOOGLE_MAPS_KEY!
    // });

    const news: INews = data?.data ?? {} as INews;
    const establishmentInfo = news?.establishmentId as PropertyProps;

    const info = encodeURIComponent(JSON.stringify(establishmentInfo));
    if (isError) return <ErrorComponent/>
    return (
        <CustomShow
            isLoading={false}
            bgColor={'transparent'}
            maxWidth={width < 900 ? '100%' : width < 1100 ? '1000px' : '1300px'}
            isShowButtons={user?._id === news?.createdBy || user?.status === 'admin'}
        >
            {
                isLoading
                    ? <LoadingDetailsNews/>
                    : <>
                        <Button
                            onClick={() => navigate(`/capl/create?establishment=${info}`)}
                        >
                            CREATE RESERVE
                        </Button>
                        <Box sx={{
                            width: '100%',
                            display: 'flex',
                            flexDirection: {xs: 'column', lg: 'row'},
                            "@media screen and (min-width: 1100px)": {
                                flexDirection: 'row'
                            },
                            gap: {xs: 2, lg: 4}
                        }}>
                            <Box sx={{
                                width: '100%',
                                order: {xs: 1, lg: 2},
                                "@media screen and (min-width: 1100px)": {
                                    order: 2
                                },
                                maxWidth: '400px'
                            }}>
                                <NewsMainInfo news={news}/>
                            </Box>
                            <Box sx={{
                                order: {xs: 2, lg: 1},
                                width: '100%',
                                transition: 'max-width 300ms linear',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: {xs: 4, md: 5, lg: 6},
                                color: 'common.white',
                                maxWidth: '900px',
                                "@media screen and (min-width: 1100px)": {
                                    order: 1,
                                    maxWidth: {md: `calc(${layoutWidth}px - 400px)`, lg: `calc(${layoutWidth}px - 450px)`}
                                }
                            }}>
                                <ImageGalleryV2 images={news?.pictures}/>
                                <Box sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: 1
                                }}>
                                    <Typography variant={'h5'}>
                                        {translate('home.create.description')}
                                    </Typography>
                                    <MDEditor.Markdown source={news.description}
                                                       style={{
                                                           whiteSpace: 'pre-wrap',
                                                           fontSize: "14px",
                                                           padding: "5px 0",
                                                           background: 'transparent',
                                                           color: mode === "dark" ? "#fcfcfc" : '#000'
                                                       }}/>
                                </Box>
                            </Box>
                        </Box>
                        <Box sx={{
                            color: 'common.white',
                            mt: 4
                        }}>
                            <Typography>
                                {translate('news.show.otherPlaceNews')}
                            </Typography>
                            <Box>
                                {
                                    establishmentInfo?._id &&
                                    <OtherNews
                                        newsId={news?._id}
                                        establishmentId={establishmentInfo?._id}
                                    />
                                }
                            </Box>
                        </Box>
                    </>
            }
        </CustomShow>
    );
};
export default DetailsNews

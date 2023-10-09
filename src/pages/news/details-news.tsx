import {useNavigate, useParams} from "react-router-dom";
import {useGetIdentity, useShow, useTranslate} from "@refinedev/core";
import {ErrorComponent} from "@refinedev/mui";
import {
    Box, Button,
    Card,
    CardContent,
    IconButton,
    ImageListItem,
    Stack,
    Typography
} from "@mui/material";
import {ImageField} from "@refinedev/antd";
import {
    Edit, LocationCity,
    Place, WineBarOutlined
} from "@mui/icons-material";
import MDEditor from "@uiw/react-md-editor";
import {useJsApiLoader} from "@react-google-maps/api";
import dayjs from "dayjs";
import React, {useContext} from "react";

import {IGetIdentity, INews, ProfileProps, PropertyProps} from "../../interfaces/common";
import {useMobile} from "../../hook";
import {ColorModeContext} from "../../contexts";
import OtherNews from "../../components/news/utills/otherNews";
import {CustomShow} from "../../components";

const DetailsNews = () => {

    const {id} = useParams();
    const navigate = useNavigate();
    const {data: identity} = useGetIdentity<IGetIdentity>();
    const user: ProfileProps = identity?.user as ProfileProps;
    const {device, width} = useMobile();
    const {mode} = useContext(ColorModeContext);
    const translate = useTranslate();

    const rowHeight = device && width < 600 ? 120 : 200;

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

    const {isLoaded} = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: import.meta.env.VITE_APP_GOOGLE_MAPS_KEY!
    });

    const news: INews = data?.data ?? {} as INews;
    const establishmentInfo = news?.institutionId as PropertyProps;

    if (isError) return <ErrorComponent/>
    return (
        <CustomShow
            isLoading={isLoading}
            bgColor={'transparent'}
            isShowButtons={user?._id === news?.createdBy || user?.status === 'admin'}
        >
            <Box sx={{
                display: 'flex',
                width: '100%',
                justifyContent: 'space-between',
                alignItems: 'center',
            }}>
                <Button
                    startIcon={<WineBarOutlined sx={{
                        fontSize: {xs: '18px', sm: '24px'},
                    }}/>}
                    sx={{
                        bgcolor: 'blue',
                        transition: '300ms linear',
                        borderRadius: '25px',
                        minWidth: '100px',
                        "&:hover": {
                            bgcolor: 'info.main',
                        }
                    }}
                    onClick={() => navigate(`/capl/create?establishment=${JSON.stringify(establishmentInfo)}`)}
                >
                    Capl
                </Button>
            </Box>
            <Box sx={{
                display: 'flex',
                flexDirection: {xs: 'column', sm: 'row', md: 'column', lg: 'row'},
                width: '100%',
                gap: {xs: 2, md: 3}
            }}>
                <Box sx={{
                    display: 'flex',
                    width: {xs: '100%', sm: '70%', md: '100%', lg: '70%'},
                    flexDirection: {xs: "column"},
                    justifyContent: {xs: 'center'},
                    '@media (min-width: 1260px)': {
                        flexDirection: 'row',
                        justifyContent: 'start'
                    },
                    gap: 2,
                    alignItems: 'start',
                    mt: '10px'
                }}>
                    <Box borderRadius="15px" padding="10px"
                         bgcolor={mode === "dark" ? "#2e424d" : "#fcfcfc"}
                         sx={{
                             width: '100%',
                             flex: {xs: 1, lg: 7}
                         }}
                    >
                        <Box sx={{}}>
                            <Card sx={{
                                display: 'flex',
                                flexDirection: {xs: 'column', xl: 'row'},
                                width: '100%',
                                bgcolor: 'transparent',
                                mb: 2,
                                gap: 2
                            }} elevation={0}>
                                <Box sx={{
                                    width: '100%',
                                    display: 'contents',
                                }}>
                                    <Box sx={{
                                        width: '100%',
                                        display: "block",
                                        alignItems: 'center',
                                        position: 'relative',
                                        height: {xs: '200px', sm: '320px', md: '400px'}
                                    }}>
                                        <ImageListItem sx={{
                                            width: '100%',
                                            display: "block",
                                            alignItems: 'center',
                                            height: {xs: '200px', sm: '320px', md: '400px'},
                                            "> div": {
                                                width: '100%',
                                                objectFit: 'cover'
                                            }
                                        }}>
                                            {
                                                news?.pictures?.length > 0 && (
                                                    <ImageField
                                                        preview={{
                                                            zIndex: 1000,
                                                            width: (device || width < 600) ? '90%' : 'auto'
                                                        }}
                                                        value={news?.pictures[0]?.url}
                                                        style={{
                                                            borderRadius: '5px',
                                                            height: width < 600 ? '200px'
                                                                : width < 900 ? "320px" : '400px',
                                                            width: '100%',
                                                            objectFit: 'cover',
                                                        }}/>
                                                )
                                            }
                                            <Box sx={{
                                                position: 'absolute',
                                                zIndex: 1,
                                                bottom: 0,
                                                p: "10px",
                                                display: 'flex',
                                                flexDirection: 'row',
                                                alignItems: 'center',
                                                justifyContent: 'start',
                                                width: '100%',
                                                left: 0,
                                                bgcolor: "rgba(25, 25, 25, 0.5)",
                                            }}>
                                                <Box>
                                                    <Typography
                                                        sx={{
                                                            textTransform: 'capitalize',
                                                            fontSize: {xs: '18px', sm: '22px'},
                                                            fontWeight: 700,
                                                            color: "#fcfcfc",

                                                        }}>
                                                        {news.title}
                                                    </Typography>
                                                    <Typography color="default" sx={{
                                                        display: 'flex',
                                                        justifyContent: 'start',
                                                        alignItems: 'center',
                                                        fontSize: {xs: 14, sm: 16},
                                                        color: '#ccc8c8'
                                                    }}>
                                                        {
                                                            translate(`news.sortByCategory.${news.category}`)
                                                        }
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </ImageListItem>
                                    </Box>
                                </Box>
                                <CardContent sx={{
                                    p: 0,
                                    width: {xs: '100%', xl: '40%'}
                                }}>
                                    <Box sx={{
                                        display: 'flex',
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                        alignItems: 'center'
                                    }}>
                                        <Box sx={{
                                            display: 'flex',
                                            flexDirection: 'row',
                                            gap: 1,
                                            alignItems: 'center'
                                        }}>
                                            <Place sx={{
                                                fontSize: '30px'
                                            }}/>
                                            <Box sx={{
                                                display: 'flex',
                                                flexDirection: 'column'
                                            }}>
                                                <Typography sx={{
                                                    fontSize: {xs: '14px', sm: "16px"}
                                                }}>
                                                    {news?.place?.place?.city}
                                                </Typography>
                                                <Typography sx={{
                                                    fontSize: {xs: '14px', sm: "16px"}
                                                }}>
                                                    {news?.place?.place?.address}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Box>
                                    <Box sx={{
                                        mt: 1,
                                    }}>
                                        <MDEditor.Markdown source={news.description}
                                                           style={{
                                                               whiteSpace: 'pre-wrap',
                                                               fontSize: "14px",
                                                               padding: "5px 0",
                                                               borderTop: "1px solid silver",
                                                               borderBottom: "1px solid silver",
                                                               background: 'transparent',
                                                               color: mode === "dark" ? "#fcfcfc" : '#000'
                                                           }}/>
                                        <Stack sx={{
                                            mt: 1
                                        }}>
                                            <Typography>
                                                {translate("home.create.workSchedule.title")}
                                            </Typography>
                                            <>
                                                {
                                                    news?.dateEvent?.map((workDay, index) => (
                                                        <Box key={index} sx={{
                                                            display: 'flex',
                                                            flexDirection: 'row',
                                                            justifyContent: "start",
                                                            alignItems: 'center',
                                                            gap: 2,
                                                            ml: 1
                                                        }}>
                                                <span>
                                                    {/*{dayjs(workDay?.schedule?.from).format('DD/MM/YYYY')} - {dayjs(workDay?.schedule?.to).format('DD/MM/YYYY')}*/}
                                                </span>
                                                            {
                                                                `${workDay?.schedule?.from ? dayjs(workDay?.schedule?.from).format("DD/MM/YYYY") : ''}${workDay?.schedule?.to ? `-` + dayjs(workDay?.schedule?.to).format("DD/MM/YYYY") : ''}`
                                                                + '   ' +
                                                                `${workDay?.time?.from ? dayjs(workDay?.time?.from).format("HH:mm") : ''}${workDay?.time?.to ? `-` + dayjs(workDay?.time?.to).format("HH:mm") : ''}`
                                                            }
                                                            <span>
                                                    {/*{dayjs(workDay?.time?.from).format("HH:mm")} - {dayjs(workDay?.time?.to).format("HH:mm")}*/}
                                                </span>
                                                        </Box>
                                                    ))
                                                }
                                            </>
                                        </Stack>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Box>
                        <Box sx={{
                            display: 'flex',
                            flexDirection: {xs: 'column', sm: 'row', md: 'column', lg: 'row'},
                            gap: {xs: 4, md: 6}
                        }}>
                            {/*{*/}
                            {/*    isLoaded ?*/}
                            {/*        <Box sx={{*/}
                            {/*            width: {xs: '100%', sm: '350px', md: '100%', lg: '450px'},*/}
                            {/*            height: '350px',*/}
                            {/*            display: 'flex',*/}
                            {/*            justifyContent: 'center',*/}
                            {/*            alignItems: 'center'*/}
                            {/*        }}>*/}
                            {/*            <GoogleMap*/}
                            {/*                mapContainerStyle={containerStyle}*/}
                            {/*                center={new google.maps.LatLng(location.lat, location.lng)}*/}
                            {/*                zoom={10}*/}
                            {/*            >*/}
                            {/*                {*/}
                            {/*                    location ?*/}
                            {/*                        <MarkerF position={new google.maps.LatLng(location.lat, location.lng)}/>*/}
                            {/*                        : null*/}
                            {/*                }*/}
                            {/*            </GoogleMap>*/}
                            {/*        </Box> : <Box sx={{*/}
                            {/*            width: {xs: '100%', sm: '350px', md: '100%', lg: '450px'},*/}
                            {/*            height: "350px",*/}
                            {/*            display: 'flex',*/}
                            {/*            justifyContent: 'center',*/}
                            {/*            alignItems: 'center'*/}
                            {/*        }}>*/}
                            {/*            <CircularProgress/>*/}
                            {/*        </Box>*/}
                            {/*}*/}

                        </Box>
                    </Box>
                </Box>
                <Box sx={{
                    width: {xs: '100%', sm: '28%', md: '100%', lg: '28%'},
                    p: '10px',
                    borderRadius: '15px'
                }}>
                    <Typography>
                        {translate('news.show.otherPlaceNews')}
                    </Typography>
                    <Box>
                        {
                            establishmentInfo?._id &&
                            <OtherNews
                                newsId={news?._id}
                                institutionId={establishmentInfo?._id}
                            />
                        }
                    </Box>
                </Box>
            </Box>
        </CustomShow>
    );
};
export default DetailsNews

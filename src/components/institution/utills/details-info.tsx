import {
    Box,
    Card,
    CardContent,
    Chip,
    CircularProgress,
    ImageListItem,
    Rating,
    Stack,
    Typography
} from "@mui/material";
import {
    MessageOutlined,
    NewspaperOutlined,
    Place,
    RestaurantMenuOutlined,
    ReviewsOutlined
} from "@mui/icons-material";
import MDEditor from "@uiw/react-md-editor";
import {ImageField} from "@refinedev/antd";
import {GoogleMap, MarkerF, useJsApiLoader} from "@react-google-maps/api";
import React, {useContext, useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {useGetIdentity, useTranslate} from "@refinedev/core";

import {BookMark} from "../../index";
import {containerStyle} from "./mapsOptrions";
import {ProfileProps, PropertyProps} from "../../../interfaces/common";
import {ColorModeContext} from "../../../contexts";
import dayjs from "dayjs";
import {useMobile, srcset} from "../../../utils";
import {ImageList1, ImageList2, ImageList3} from "../../imageList";


interface IProps {
    institution: PropertyProps,
    rowHeight: number,
    otherProps?: any
}

const DetailsInfo = ({institution, rowHeight, otherProps}: IProps) => {

    const {data: user,} = useGetIdentity<ProfileProps>();
    const translate = useTranslate();
    const {mode} = useContext(ColorModeContext);
    const {device, width} = useMobile();
    const navigate = useNavigate();

    const {setDataForDrawer, setOpenDrawer} = otherProps;

    const [postRating, setPostRating] = useState(0);
    const [postRatings, setPostRatings] = useState([]);
    const [favoritePlaces, setFavoritePlaces] = useState([]);

    useEffect(() => {
        setPostRating(institution?.rating)
    }, [institution?.rating])

    useEffect(() => {
        setFavoritePlaces(user?.favoritePlaces)
    }, [user?.favoritePlaces])

    useEffect(() => {
        setPostRatings(institution?.ratings);
    }, [institution?.ratings])


    const {isLoaded} = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_KEY!
    });

    const location: PropertyProps["location"] | any = typeof institution.location.lat !== undefined && institution.location;
    return (
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
                                <ImageField preview={{zIndex: 10000, width: (device || width < 600) ? '90%' : 'auto'}}
                                            value={institution.mainPhoto}
                                            style={{
                                                borderRadius: '5px',
                                                height: width < 600 ? '200px'
                                                    : width < 900 ? "320px" : '400px',
                                                width: '100%',
                                                objectFit: 'cover',
                                            }}/>
                                <Box sx={{
                                    position: 'absolute',
                                    zIndex: 1,
                                    bottom: 0,
                                    p: "10px",
                                    display: 'flex',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
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
                                            {institution.title}
                                        </Typography>
                                        <Typography color="default" sx={{
                                            display: 'flex',
                                            justifyContent: 'start',
                                            alignItems: 'center',
                                            fontSize: {xs: 14, sm: 16},
                                            color: '#ccc8c8'
                                        }}>
                                            {
                                                translate(`home.create.type.${institution.type}`)
                                            }
                                        </Typography>
                                        <Box sx={{
                                            display: 'flex',
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            gap: 2
                                        }}>
                                            <Rating precision={0.5} name="read-only" value={postRating} readOnly/>
                                        </Box>
                                    </Box>
                                    <Box sx={{
                                        height: "100%",
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        gap: 1
                                    }}>
                                        <RestaurantMenuOutlined
                                            sx={{
                                                color: 'white',
                                                fontSize: '30px',
                                                cursor: 'pointer',
                                                transition: '300ms linear',
                                                "&:hover": {
                                                    color: "#ccbebe"
                                                }
                                            }}
                                            onClick={() => navigate(`/all_institutions/menu/show/${institution?._id}`)}/>
                                        {
                                            institution.createdBy !== user?._id &&
                                            <BookMark type={'favoritePlaces'} id={institution._id}
                                                      otherProps={setFavoritePlaces}/>
                                        }
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
                                        {institution.place.city}
                                    </Typography>
                                    <Typography sx={{
                                        fontSize: {xs: '14px', sm: "16px"}
                                    }}>
                                        {institution.place.address}
                                    </Typography>
                                </Box>
                            </Box>
                            {
                                device && width < 900
                                    ? <Box sx={{
                                        display: 'grid',
                                        gridTemplateColumns: '1fr 1fr 1fr',
                                        alignItems: 'center',
                                        gap: 1.5
                                    }}>
                                        <ReviewsOutlined onClick={() => {
                                            setOpenDrawer(true)
                                            setDataForDrawer("reviews")
                                        }}/>
                                        <NewspaperOutlined onClick={() => {
                                            setOpenDrawer(true)
                                            setDataForDrawer("news")
                                        }}/>
                                        <MessageOutlined onClick={() => {
                                            setOpenDrawer(true)
                                            setDataForDrawer("comments")
                                        }}/>
                                    </Box> : ''
                            }
                        </Box>
                        <Box sx={{
                            mt: 1,
                        }}>
                            <MDEditor.Markdown source={institution.description}
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
                                    {/*{*/}
                                    {/*    institution?.workSchedule?.workDays?.map((workDay, index) => (*/}
                                    {/*        <Box key={index} sx={{*/}
                                    {/*            display: 'flex',*/}
                                    {/*            flexDirection: 'row',*/}
                                    {/*            justifyContent: "start",*/}
                                    {/*            alignItems: 'center',*/}
                                    {/*            gap: 2,*/}
                                    {/*            ml: 1*/}
                                    {/*        }}>*/}
                                    {/*            <span>*/}
                                    {/*                {translate(`home.create.workSchedule.dayName.${workDay.days.from}`)} - {translate(`home.create.workSchedule.dayName.${workDay.days.to}`)}*/}
                                    {/*            </span>*/}
                                    {/*            <span>*/}
                                    {/*                {dayjs(workDay.time.from).format("HH:mm")} - {dayjs(workDay.time.to).format("HH:mm")}*/}
                                    {/*            </span>*/}
                                    {/*        </Box>*/}
                                    {/*    ))*/}
                                    {/*}*/}
                                </>
                                <Typography sx={{
                                    mt: 1
                                }}>
                                    {translate("home.create.workSchedule.weekend.title")}
                                </Typography>
                                <Box sx={{
                                    ml: 1
                                }}>
                                    {institution.workSchedule.weekend}
                                </Box>
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
                {
                    isLoaded ?
                        <Box sx={{
                            width: {xs: '100%', sm: '350px', md: '100%', lg: '450px'},
                            height: '350px',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                            <GoogleMap
                                mapContainerStyle={containerStyle}
                                center={new google.maps.LatLng(location.lat, location.lng)}
                                zoom={10}
                            >
                                {
                                    location ?
                                        <MarkerF position={new google.maps.LatLng(location.lat, location.lng)}/>
                                        : null
                                }
                            </GoogleMap>
                        </Box> : <Box sx={{
                            width: {xs: '100%', sm: '350px', md: '100%', lg: '450px'},
                            height: "350px",
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                            <CircularProgress/>
                        </Box>
                }
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 3,
                    width: {xs: '100%', sm: 'calc( 100% - 350px )', md: '100%', lg: 'calc( 100% - 450px )'}
                }}>
                    <Box sx={{
                        width: '100%',
                        borderBottom: '1px solid silver'
                    }}>
                        <Typography>
                            {translate("home.create.contacts")}
                        </Typography>
                        <Box sx={{
                            ml: 1,
                            mt: 1
                        }}>
                            {
                                institution.contacts.map((contact: any, index: number) => (
                                    <Box key={index}>
                                        {contact.value}
                                    </Box>
                                ))
                            }
                        </Box>
                    </Box>
                    <>
                        <Typography>
                            {translate("home.create.tags")}
                        </Typography>
                        <Box sx={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            ml: 1,
                            mt: 1,
                            gap: 0.5,

                        }}>
                            {
                                institution.tags.map((tag: any, index: number) => (
                                    <Chip
                                        onClick={() => navigate(`/all_institutions?pageSize=10&current=1&sorters[0][field]=createdAt_desc&sorters[0][order]=desc&filters[0][field]=tag&filters[0][value]=${tag.value}&filters[0][operator]=contains&filters[1][field]=title&filters[1][value]=&filters[1][operator]=contains`,
                                            {state: {value: tag.value, isTag: true}})} key={index} label={tag.value}
                                        sx={{
                                            color: mode === "dark" ? 'white' : 'black',
                                            cursor: 'pointer'
                                        }}/>
                                ))
                            }
                        </Box>
                    </>
                </Box>
            </Box>
            <Box sx={{}}>
                {
                    institution?.variantForDisplay === '1' ?
                        <ImageList1
                            maxWidth={"800px"}
                            addImage={() => {
                            }}
                            rowHeight={rowHeight}
                            items={institution?.otherPhoto}
                            deleteImage={() => {}}
                            maxLength={12}
                            type={'show'}
                        />
                        : institution?.variantForDisplay === '2'
                            ? <ImageList2
                                type={'show'}
                                maxWidth={"800px"}
                                addImage={() => {}}
                                rowHeight={rowHeight}
                                items={institution?.otherPhoto}
                                deleteImage={() => {}}
                                maxLength={12}
                            />
                            : <ImageList3
                                type={'show'}
                                maxWidth={"800px"}
                                addImage={() => {
                                }}
                                rowHeight={rowHeight}
                                items={institution?.otherPhoto}
                                deleteImage={() => {}}
                                maxLength={12}/>
                }
            </Box>
        </Box>
    );
};
export default DetailsInfo

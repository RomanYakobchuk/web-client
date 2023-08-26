import {
    Box,
    Chip,
    CircularProgress,
    ListItem,
    Rating,
    Stack,
    List,
    Typography, Button
} from "@mui/material";
import {
    Place,
} from "@mui/icons-material";
import MDEditor from "@uiw/react-md-editor";
import {GoogleMap, MarkerF, useJsApiLoader} from "@react-google-maps/api";
import React, {useContext, useEffect, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {useGetIdentity, useTranslate} from "@refinedev/core";

import {BookMark, ImageGallery} from "../index";
import {containerStyle} from "./utills/mapsOptrions";
import {IGetIdentity, ProfileProps, PropertyProps} from "../../interfaces/common";
import {ColorModeContext} from "../../contexts";
import dayjs from "dayjs";
import {buttonStyle} from "../../styles";


interface IProps {
    establishment: PropertyProps,
    rowHeight: number,
    otherProps?: any
}

const MainEstablishmentInfo = ({establishment, rowHeight, otherProps}: IProps) => {

    const {data: identity} = useGetIdentity<IGetIdentity>();
    const user: ProfileProps = identity?.user as ProfileProps;
    const translate = useTranslate();
    const {mode} = useContext(ColorModeContext);
    const navigate = useNavigate();

    const [postRating, setPostRating] = useState(0);
    const [postRatings, setPostRatings] = useState([]);

    useEffect(() => {
        setPostRating(establishment?.rating)
    }, [establishment?.rating])

    useEffect(() => {
        setPostRatings(establishment?.ratings);
    }, [establishment?.ratings])


    const {isLoaded} = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_KEY!
    });
    const location: PropertyProps["location"] | any = typeof establishment?.location?.lat !== undefined && establishment?.location;
    return (
        <Box
            sx={{
                width: '100%',
                flex: {xs: 1, lg: 7},
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                p: 0
            }}
        >
            <Box>
                <Box sx={{
                    display: 'flex',
                    flexDirection: {xs: 'column',},
                    justifyContent: {xs: 'start', sm: 'space-between'}
                }}>
                    <Box>
                        <Box sx={{
                            display: 'flex',
                            width: '100%',
                            alignItems: 'center',
                            justifyContent: 'space-between'
                        }}>
                            <Box sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                gap: {xs: 3, sm: 6},
                                alignItems: 'center',
                                "& a": {
                                    fontSize: {xs: 14, sm: 16},
                                }
                            }}>
                                <Typography
                                    sx={{
                                        color: 'common.white',
                                        textTransform: 'capitalize',
                                        fontSize: {xs: '24px', sm: '30px'},
                                        fontWeight: 700,
                                    }}>
                                    {establishment.title}
                                </Typography>
                                <Link
                                    to={`/all_institutions?pageSize=10&current=1&sorters[0][field]=createdAt_asc&sorters[0][order]=desc&filters[0][field]=propertyType&filters[0][operator]=eq&filters[0][value]=${establishment.type}`}
                                    style={{
                                        textDecoration: 'none',
                                        display: 'flex',
                                        justifyContent: 'start',
                                        alignItems: 'center',
                                        color: '#fff',
                                        padding: '5px',
                                        backgroundColor: '#5e49c3',
                                        borderRadius: '5px',
                                    }}>
                                    {
                                        translate(`home.create.type.${establishment.type}`)
                                    }
                                </Link>
                            </Box>
                            {
                                establishment?.createdBy !== user?._id &&
                                <BookMark showText={false} color={'common.white'}
                                          bgColor={'transparent'}
                                          style={{
                                              p: '5px',
                                              borderRadius: '5px',
                                              minWidth: '20px',
                                              bgcolor: mode === 'dark' ? '#86a8cf' : '#e6f2ff',
                                              "& svg": {
                                                  fontSize: {xs: '26px', sm: '30px'}
                                              }
                                          }}
                                          type={'favoritePlaces'} id={establishment?._id}/>
                            }
                        </Box>
                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            gap: 1,
                            alignItems: 'center'
                        }}>
                            <Place color={'secondary'} sx={{
                                fontSize: '24px'
                            }}/>
                            <Box sx={{
                                display: 'flex',
                                flexDirection: 'column'
                            }}>
                                <Link
                                    to={`/all_institutions?pageSize=10&current=1&sorters[0][field]=&sorters[0][order]=asc&filters[0][field]=averageCheck&filters[0][operator]=lte&filters[0][value]=100000&filters[1][field]=averageCheck&filters[1][operator]=gte&filters[1][value]=20&filters[2][field]=tag&filters[2][value]=&filters[2][operator]=contains&filters[3][field]=title&filters[3][value]=&filters[3][operator]=contains&filters[4][field]=propertyType&filters[4][operator]=eq&filters[4][value]=&filters[5][field]=city&filters[5][operator]=contains&filters[5][value]=${establishment?.place?.city}`}
                                    style={{
                                        fontSize: '14px',
                                        width: 'fit-content',
                                        color: mode === 'dark' ? 'silver' : 'blueviolet',
                                        borderBottom: `1px solid ${mode === 'dark' ? 'silver' : 'blueviolet'}`
                                    }}>
                                    {establishment?.place?.city}
                                </Link>
                                <Typography sx={{
                                    fontSize: '13px',
                                    color: 'common.white',
                                }}>
                                    {establishment?.place?.address}
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        gap: 1,
                        alignItems: 'center',
                        mb: 0.5
                    }}>
                        {
                            establishment?._id && postRating !== undefined && <>
                                <Rating precision={0.5} name="read-only" value={postRating} readOnly/>
                                <Box sx={{
                                    color: 'common.white'
                                }}>
                                    {postRating > 0 ? postRating?.toFixed(2) : postRating}
                                </Box>
                            </>
                        }
                    </Box>
                </Box>
                <Box sx={{
                    display: 'flex',
                    flexDirection: {xs: 'column', xl: 'row'},
                    width: '100%',
                    gap: 2
                }}>
                    {
                        establishment?.pictures?.length > 0 &&
                        <ImageGallery photos={establishment?.pictures}/>
                    }
                    <Box sx={{
                        p: 0,
                        width: {xs: '100%', xl: '40%'}
                    }}>
                        {/*<Box sx={{*/}
                        {/*    display: 'flex',*/}
                        {/*    flexDirection: 'row',*/}
                        {/*    justifyContent: 'space-between',*/}
                        {/*    alignItems: 'center'*/}
                        {/*}}>*/}

                        {/*    {*/}
                        {/*        device && width < 900*/}
                        {/*            ? <Box sx={{*/}
                        {/*                display: 'grid',*/}
                        {/*                gridTemplateColumns: '1fr 1fr 1fr',*/}
                        {/*                alignItems: 'center',*/}
                        {/*                gap: 1.5*/}
                        {/*            }}>*/}
                        {/*                <ReviewsOutlined onClick={() => {*/}
                        {/*                    setOpenDrawer(true)*/}
                        {/*                    setDataForDrawer("reviews")*/}
                        {/*                }}/>*/}
                        {/*                <NewspaperOutlined onClick={() => {*/}
                        {/*                    setOpenDrawer(true)*/}
                        {/*                    setDataForDrawer("news")*/}
                        {/*                }}/>*/}
                        {/*                <MessageOutlined onClick={() => {*/}
                        {/*                    setOpenDrawer(true)*/}
                        {/*                    setDataForDrawer("comments")*/}
                        {/*                }}/>*/}
                        {/*            </Box> : ''*/}
                        {/*    }*/}
                        {/*</Box>*/}
                        <Box sx={{
                            borderRadius: '15px',
                            p: '15px',
                            bgcolor: mode === 'dark' ? '#3b93a7' : '#f39c7d',
                        }}>
                            <MDEditor.Markdown source={establishment?.description}
                                               style={{
                                                   whiteSpace: 'pre-wrap',
                                                   fontSize: "14px",
                                                   padding: "5px 0",
                                                   background: 'transparent',
                                                   color: '#fff'
                                               }}/>
                        </Box>
                        <Box sx={{
                            mt: 1,
                            display: 'flex',
                            width: '100%',
                            flexDirection: {xs: 'column', sm: 'row', lg: 'column'},
                            justifyContent: {xs: 'start', sm: 'space-between', lg: 'start'},
                            alignItems: {sx: 'start', sm: 'center', lg: 'start'},
                            gap: {xs: 2, sm: 0, lg: 2},
                            borderRadius: '15px',
                            p: '15px',
                            bgcolor: mode === 'dark' ? '#3c6687' : '#f36429',
                            color: '#fff'
                        }}>
                            <Stack>
                                <Typography>
                                    {translate("home.create.workSchedule.title")}
                                </Typography>
                                <>
                                    {
                                        establishment?.workSchedule?.workDays?.map((workDay, index) => (
                                            <Box key={index} sx={{
                                                display: 'flex',
                                                flexDirection: 'row',
                                                justifyContent: "start",
                                                alignItems: 'center',
                                                gap: 2,
                                                ml: 1
                                            }}>
                                                <span>
                                                    {translate(`home.create.workSchedule.dayName.${workDay?.days?.from}`)} - {translate(`home.create.workSchedule.dayName.${workDay?.days?.to}`)}
                                                </span>
                                                <span>
                                                    {dayjs(workDay?.time?.from).format("HH:mm")} - {dayjs(workDay?.time?.to).format("HH:mm")}
                                                </span>
                                            </Box>
                                        ))
                                    }
                                </>
                                <Typography sx={{
                                    mt: 1
                                }}>
                                    {translate("home.create.workSchedule.weekend.title")}
                                </Typography>
                                <Box sx={{
                                    ml: 1
                                }}>
                                    {establishment?.workSchedule?.weekend}
                                </Box>
                            </Stack>
                            <Box sx={{
                                display: 'flex',
                                flexDirection: 'column',
                            }}>
                                {
                                    establishment?.createdBy !== user?._id &&
                                    <Button
                                        variant={'contained'}
                                        color={'info'}
                                        sx={{
                                            ...buttonStyle,
                                            textTransform: 'inherit',
                                        }}
                                        onClick={() => navigate(`/capl/create?institution=${establishment?._id}`)}
                                    >
                                        {translate('capl.title')}
                                    </Button>
                                }
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </Box>
            <Box sx={{
                display: 'flex',
                flexDirection: {xs: 'column', sm: 'row', md: 'column', lg: 'row'},
                gap: 2,
                width: '100%'
            }}>
                {
                    isLoaded && establishment?._id ?
                        <Box sx={{
                            width: {xs: '100%', sm: '350px', md: '100%', lg: '50%'},
                            height: '350px',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            "& > div": {
                                borderRadius: '15px !important'
                            }
                        }}>
                            <GoogleMap
                                mapContainerStyle={containerStyle}
                                center={new google.maps.LatLng(location?.lat, location?.lng)}
                                zoom={10}
                            >
                                {
                                    location ?
                                        <MarkerF position={new google.maps.LatLng(location?.lat, location?.lng)}/>
                                        : null
                                }
                            </GoogleMap>
                        </Box> : <Box sx={{
                            width: {xs: '100%', sm: '350px', md: '100%', lg: '50%'},
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
                    p: '15px',
                    color: '#fff',
                    borderRadius: '15px',
                    bgcolor: mode === 'dark' ? '#404567' : '#e18c5e',
                    width: {xs: '100%', sm: 'calc( 100% - 350px )', md: '100%', lg: '50%'}
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
                                establishment?.contacts?.map((contact: any, index: number) => (
                                    <Box key={index}>
                                        {contact?.value}
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
                                establishment?.tags?.map((tag: any, index: number) => (
                                    <Chip
                                        onClick={() => navigate(`/all_institutions?pageSize=10&current=1&sorters[0][field]=createdAt_desc&sorters[0][order]=desc&filters[0][field]=title&filters[0][value]=${'#' + tag.value}&filters[0][operator]=contains`,
                                            {state: {value: tag.value, isTag: true}})} key={index} label={tag.value}
                                        sx={{
                                            color: '#fff',
                                            cursor: 'pointer'
                                        }}/>
                                ))
                            }
                        </Box>
                    </>
                </Box>
            </Box>
            <Box sx={{
                p: '15px',
                borderRadius: '15px',
                color: '#fff',
                bgcolor: mode === 'dark' ? '#2a578b' : '#d6773b'
            }}>
                <Typography>
                    {translate('home.create.features')}
                </Typography>
                <List>
                    {
                        establishment?.features?.map((feature, index) => (
                            <ListItem key={index}>
                                {feature?.value}
                            </ListItem>
                        ))
                    }
                </List>
            </Box>
        </Box>
    );
};
export default MainEstablishmentInfo

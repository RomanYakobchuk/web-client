import {
    Box,
    ListItem,
    List,
    Typography, Divider
} from "@mui/material";
import {useTranslate} from "@refinedev/core";

import {MainDescription} from "@/components/establishment/utills/main/mainDescription";
import {MainSchedule} from "@/components/establishment/utills/main/mainSchedule";
import {MainContacts} from "@/components/establishment/utills/main/mainContacts";
import {MainHeader} from "@/components/establishment/utills/main/mainHeader";
import {StarRating} from "@/components/establishment/utills/main/starRating";
import {MainTags} from "@/components/establishment/utills/main/mainTags";
import {GoogleMapRouteBtn} from "@/components/google/googleMapRouteBtn";
import {LeafletMap} from "@/components/google/LeafletMap/LeafletMap";
import {IEstablishment} from "@/interfaces/common";
import {AnimatePresence} from "framer-motion";
import {ImageGalleryV1} from "../gallery"


interface IProps {
    establishment: IEstablishment,
}

const MainEstablishmentInfo = ({establishment}: IProps) => {

    const translate = useTranslate();

    const location: IEstablishment["location"] | google.maps.LatLngLiteral = typeof establishment?.location?.lat !== undefined ? establishment?.location : {} as IEstablishment['location'];

    const postRating = establishment?.rating;

    return (
        <AnimatePresence
            mode={"popLayout"}
        >
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
                <Box sx={{
                    display: 'flex',
                    flexDirection: {xs: 'column',},
                    justifyContent: {xs: 'start', sm: 'space-between'}
                }}>
                    <MainHeader establishment={establishment}/>
                    <Box sx={{
                        display: 'flex',
                        flexDirection: {xs: 'column', sm: 'row'},
                        justifyContent: 'space-between',
                        gap: {xs: 2, sm: 0},
                        alignItems: {xs: 'start', sm: 'center'},
                        width: '100%',
                        mb: 2
                    }}>
                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            gap: 1,
                            alignItems: 'center',
                        }}>
                            {
                                establishment?._id && postRating !== undefined && <>
                                    <StarRating value={postRating} readOnly/>
                                    {/*<Rating precision={0.5} name="read-only" value={postRating} readOnly/>*/}
                                    <Box sx={{
                                        color: 'common.white'
                                    }}>
                                        {postRating > 0 ? postRating?.toFixed(2) : postRating}
                                    </Box>
                                    <Box
                                        component={'span'}
                                        sx={{
                                            margin: '0 5px',
                                            fontSize: {xs: '12px', sm: '14px'},
                                            color: 'silver'
                                        }}
                                    >
                                        ({establishment?.reviewsLength})
                                    </Box>
                                </>
                            }
                        </Box>
                        <Box sx={{
                            display: 'flex',
                            gap: 1,
                            bgcolor: 'common.white',
                            color: 'common.black',
                            p: '0px 15px',
                            borderRadius: '20px',
                            alignItems: 'center',
                            "& span:nth-of-type(2)": {
                                fontSize: {xs: '18px', sm: '20px', md: '22px', lg: '24px'},
                                fontWeight: {xs: 600, md: 800}
                            }
                        }}>
                            <Box
                                component={'span'}
                            >
                                {translate('home.create.averageCheck')}
                            </Box>
                            ~
                            <Box
                                component={'span'}
                            >
                                {establishment?.averageCheck} ₴
                            </Box>
                        </Box>
                    </Box>
                </Box>
                <Box sx={{
                    display: 'grid',
                    gridTemplateColumns: {xs: '1fr', sm: 'repeat(3, 1fr)', md: 'repeat(6, 1fr)', lg: 'repeat(8, 1fr)'},
                    gridAutoRows: 'auto',
                    width: '100%',
                    gap: {xs: 2, md: 3},
                    "& > div:nth-of-type(1)": {
                        order: 1,
                        gridColumn: {sm: 'span 3', md: 'span 6', lg: 'span 5'}
                    },
                    "& > div:nth-of-type(2)": {
                        order: {xs: 3, lg: 4},
                        gridColumn: {sm: 'span 2', md: 'span 4', lg: 'span 8'}
                    },
                    "& > div:nth-of-type(3)": {
                        order: {xs: 2, lg: 3},
                        gridColumn: {sm: 'span 1', md: 'span 2', lg: 'span 5'}
                    },
                    "& > div:nth-of-type(4)": {
                        order: {xs: 4, lg: 2},
                        height: {xs: '300px', sm: '350px', md: '400px', lg: '100%'},
                        gridRow: {lg: 'span 2'},
                        gridColumn: {sm: 'span 3', md: 'span 6', lg: 'span 3'}
                    },
                    "& > div:nth-of-type(5)": {
                        order: {xs: 5, lg: 7},
                        gridColumn: {sm: 'span 3', lg: 'span 3'}
                    },
                    "& > div:nth-of-type(6)": {
                        order: {xs: 6, lg: 6},
                        gridColumn: {sm: 'span 3', lg: 'span 5'}
                    },
                    overflow: "hidden",
                }}>
                    <ImageGalleryV1 photos={establishment?.pictures?.length > 0 ? establishment?.pictures : []}/>
                    <MainDescription description={establishment?.description || ''}/>
                    <MainSchedule workSchedule={establishment?.workSchedule}/>
                    {
                        establishment?._id && location?.lng &&
                        <Box sx={{
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            minHeight: '300px',
                            justifyContent: 'center',
                            alignItems: 'center',
                            "& > div": {
                                borderRadius: '15px !important'
                            }
                        }}>
                            <LeafletMap
                                coordinates={[
                                    {
                                        lng: location?.lng,
                                        lat: location?.lat,
                                    }
                                ]}
                                items={[establishment]}
                                zoom={10}
                            >
                                <Box sx={{
                                    height: '30px',
                                    position: 'absolute',
                                    bottom: '20px',
                                    left: '10px',
                                    zIndex: 405,
                                    transition: '300ms linear',
                                    "& button:hover span": {
                                        color: '#445fb7'
                                    }
                                }}>
                                    <GoogleMapRouteBtn location={location}/>
                                </Box>
                            </LeafletMap>
                            {/*<ShowMap*/}
                            {/*    location={location}*/}
                            {/*    showRoute={true}*/}
                            {/*/>*/}
                        </Box>
                    }
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 3,
                        p: '15px',
                        color: 'common.white',
                        borderRadius: '15px',
                        bgcolor: 'modern.modern_1.main',
                        width: '100%'
                    }}>
                        <MainContacts contacts={establishment?.contacts}/>
                        <Divider sx={{
                            bgcolor: 'silver'
                        }}/>
                        <MainTags tags={establishment?.tags}/>
                    </Box>
                    <Box sx={{
                        p: '15px',
                        borderRadius: '15px',
                        color: 'common.white',
                        bgcolor: 'modern.modern_1.main',
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
                {/*<Box*/}
                {/*    sx={{*/}
                {/*        width: {xs: '100%', sm: '350px'},*/}
                {/*        maxWidth: '350px'*/}
                {/*    }}*/}
                {/*>*/}
                {/*    <Calendar*/}
                {/*        styles={{*/}
                {/*            boxShadow: '0px 0px 5px 3px #f1f1f1'*/}
                {/*        }}*/}
                {/*        isTimeExist={true}*/}
                {/*        minDate={new Date(dayjs()?.add(55, 'minutes')?.toString())}*/}
                {/*        workSchedule={establishment?.workSchedule}*/}
                {/*        isShowTodayBtn={true}*/}
                {/*    />*/}
                {/*</Box>*/}
            </Box>
        </AnimatePresence>
    );
};
export default MainEstablishmentInfo;

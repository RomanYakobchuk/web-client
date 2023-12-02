import {
    Box,
    Chip,
    ListItem,
    Rating,
    Stack,
    List,
    Typography
} from "@mui/material";
import {
    Place,
} from "@mui/icons-material";
import React, {useContext, useEffect, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {useTranslate} from "@refinedev/core";

import {ShowMap} from "../index";
import {ImageGalleryV1} from "../gallery"
import {PropertyProps} from "@/interfaces/common";
import {ColorModeContext} from "@/contexts";
import {useMobile} from "@/hook";
import {useStore} from "@/store";
import MDEditor from "@uiw/react-md-editor";


interface IProps {
    establishment: PropertyProps,
}

const MainEstablishmentInfo = ({establishment}: IProps) => {

    const translate = useTranslate();
    const {mode} = useContext(ColorModeContext);
    const navigate = useNavigate();
    const {width} = useMobile();


    const {addEstablishment} = useStore(state => {
        return {
            establishmentInfo: state.establishmentInfo, addEstablishment: state.addEstablishment
        }
    });

    const [postRating, setPostRating] = useState(0);

    useEffect(() => {
        setPostRating(establishment?.rating)
    }, [establishment?.rating])

    useEffect(() => {
        if (establishment?._id) {
            addEstablishment({...establishment})
        }
    }, [establishment?._id]);

    const location: PropertyProps["location"] | google.maps.LatLngLiteral = typeof establishment?.location?.lat !== undefined ? establishment?.location : {} as PropertyProps['location'];


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
                        "@media screen and (max-width: 800px && min-width: 600px)":{
                            alignItems: 'start'
                        },
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        gap: 1
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
                    </Box>
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        gap: 1,
                        alignItems: 'center',
                        m: '10px 0'
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
                                <Rating precision={0.5} name="read-only" value={postRating} readOnly/>
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

            }}>
                {
                    establishment?.pictures?.length > 0 &&
                    <ImageGalleryV1 photos={establishment?.pictures}/>
                }
                <Box sx={{
                    bgcolor: 'modern.modern_1.second',
                    p: '10px',
                    borderRadius: '15px',
                }}>
                    {/*<ObserverComponent*/}
                    {/*    defaultHeight={width < 600 ? '100%' : '295px'}*/}
                    {/*    style={{*/}
                    {/*        bgcolor: 'modern.modern_2.main'*/}
                    {/*    }}*/}
                    {/*    maxWindowWidth={600}*/}
                    {/*    isShowFull={true}*/}
                    {/*>*/}
                    <Typography variant={'h5'} sx={{
                        color: 'common.white'
                    }}>
                        {translate('home.create.description')}
                    </Typography>
                    <Box sx={{
                        width: '100%',
                    }}>
                        <MDEditor.Markdown source={establishment?.description}
                                           style={{
                                               whiteSpace: 'break-spaces',
                                               fontSize: "14px",
                                               padding: "5px 0",
                                               background: 'transparent',
                                               color: mode === 'dark' ? '#fff' : '#000'
                                           }}/>
                    </Box>
                    {/*</ObserverComponent>*/}
                </Box>
                {/*<ObserverComponent*/}
                {/*    defaultHeight={width < 600 ? '100%' : '295px'}*/}
                {/*    style={{*/}
                {/*        bgcolor: 'modern.modern_1.main'*/}
                {/*    }}*/}
                {/*    maxWindowWidth={600}*/}
                {/*    isShowFull={true}*/}
                {/*>*/}
                <Box sx={{
                    display: 'flex',
                    width: '100%',
                    flexDirection: 'column',
                    p: '10px',
                    borderRadius: '15px',
                    justifyContent: 'start',
                    bgcolor: 'modern.modern_1.second',
                    alignItems: 'start',
                    color: 'common.white'
                }}>
                    <Typography sx={{
                        fontWeight: 600,
                        fontSize: '1.1rem'
                    }}>
                        {translate("home.create.workSchedule.title")}
                    </Typography>
                    <Stack sx={{
                        gap: 1
                    }}>
                        {
                            establishment?.workSchedule?.workDays?.map((workDay, index) => (
                                <Box key={index} sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: "start",
                                    alignItems: 'start',
                                    ml: 1
                                }}>
                                                <span>
                                                    {translate(`home.create.workSchedule.dayName.${workDay?.days?.from}`)} - {translate(`home.create.workSchedule.dayName.${workDay?.days?.to}`)}
                                                </span>
                                    <span>
                                                    {workDay?.time?.from} - {workDay?.time?.to}
                                                </span>
                                </Box>
                            ))
                        }
                    </Stack>
                    <Typography sx={{
                        mt: 1,
                        fontWeight: 600
                    }}>
                        {translate("home.create.workSchedule.weekend.title")}
                    </Typography>
                    <Box sx={{
                        ml: 1
                    }}>
                        {establishment?.workSchedule?.weekend}
                    </Box>
                </Box>
                {/*</ObserverComponent>*/}
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
                        <ShowMap
                            location={location}
                            showRoute={true}
                        />
                    </Box>
                }
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 3,
                    p: '15px',
                    color: 'common.white',
                    borderRadius: '15px',
                    bgcolor: 'modern.modern_1.second',
                    width: '100%'
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
                    <Box sx={{
                        diaply: 'flex',
                        flexDirection: 'column'
                    }}>
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
                                            {state: {value: tag.value, isTag: true}})}
                                        key={index}
                                        label={'#' + tag.value}
                                        sx={{
                                            cursor: 'pointer',
                                            bgcolor: 'common.white',
                                            color: 'common.black'
                                        }}/>
                                ))
                            }
                        </Box>
                    </Box>
                </Box>
                <Box sx={{
                    p: '15px',
                    borderRadius: '15px',
                    color: 'common.white',
                    bgcolor: 'modern.modern_1.second',
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
        </Box>
    );
};
export default MainEstablishmentInfo;

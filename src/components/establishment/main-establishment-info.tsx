import {
    Box,
    Chip,
    ListItem,
    Rating,
    Stack,
    List,
    Typography, Divider
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
import {useStore} from "@/store";
import MDEditor from "@uiw/react-md-editor";
import {ESTABLISHMENT} from "@/config/names";
import {MainDescription} from "@/components/establishment/utills/main/mainDescription";
import {MainSchedule} from "@/components/establishment/utills/main/mainSchedule";
import {MainContacts} from "@/components/establishment/utills/main/mainContacts";
import {MainTags} from "@/components/establishment/utills/main/mainTags";


interface IProps {
    establishment: PropertyProps,
}

const MainEstablishmentInfo = ({establishment}: IProps) => {

    const translate = useTranslate();
    const {mode} = useContext(ColorModeContext);
    const navigate = useNavigate();


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
                        "@media screen and (max-width: 800px && min-width: 600px)": {
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
                                to={`/${ESTABLISHMENT}?pageSize=10&current=1&sorters[0][field]=createdAt_asc&sorters[0][order]=desc&filters[0][field]=propertyType&filters[0][operator]=eq&filters[0][value]=${establishment.type}`}
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
                                to={`/${ESTABLISHMENT}?pageSize=10&current=1&sorters[0][field]=&sorters[0][order]=asc&filters[0][field]=averageCheck&filters[0][operator]=lte&filters[0][value]=100000&filters[1][field]=averageCheck&filters[1][operator]=gte&filters[1][value]=20&filters[2][field]=tag&filters[2][value]=&filters[2][operator]=contains&filters[3][field]=title&filters[3][value]=&filters[3][operator]=contains&filters[4][field]=propertyType&filters[4][operator]=eq&filters[4][value]=&filters[5][field]=city&filters[5][operator]=contains&filters[5][value]=${establishment?.place?.city}`}
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

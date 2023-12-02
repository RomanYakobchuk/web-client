import {Box, CardMedia, Typography} from "@mui/material";
import React, {useContext} from "react";
import {Link} from "react-router-dom";
import {useTranslate} from "@refinedev/core";
import {Place, Star} from "@mui/icons-material";

import {BookMarkButton} from "../../index";
import {PropertyProps} from "@/interfaces/common";
import {ColorModeContext} from "@/contexts";
import SharedComponent from "../../common/shared/sharedComponent";
import {useMobile, useNavigateWithTransition} from "@/hook";

interface IProps {
    establishment: PropertyProps
}

const CLIENT_URL = import.meta.env.VITE_APP_CLIENT_API;

const Variant2EstablishmentCard = ({establishment}: IProps) => {

    const {_id, type, place, pictures, rating, title, averageCheck, createdBy} = establishment;
    const navigateWithTransition = useNavigateWithTransition();
    const {mode} = useContext(ColorModeContext);
    const {width} = useMobile();
    const translate = useTranslate();

    const tL = (width >= 800 && width <= 900) ? 30 : ((width < 800) || (width < 1100 && width > 900)) ? 15 : 30;
    const currentTitle = title?.length > (tL) ? title?.slice(0, tL) : title;

    const isSplicedTitle = title?.length > tL;

    const linkTo = `/all_institutions/show/${establishment?._id}`;

    return (
        <Box sx={{
            width: '100%',
        }}>
            <Link
                unstable_viewTransition
                style={{
                    textDecoration: 'none',
                    width: '100%',
                    viewTransitionName: `establishment${establishment?._id}`,
                    contain: 'paint',
                    cursor: 'pointer',
                }}
                to={linkTo}
                onClick={(event) => {
                    event.preventDefault();
                    navigateWithTransition(linkTo)
                }}
            >
                <Box sx={{
                    padding: {xs: 0, sm: 2},
                    display: 'flex',
                    flexDirection: {xs: 'column', sm: 'row'},
                    boxShadow: {xs: 'unset', sm: '0px 0px 3px 0px silver'},
                    bgcolor: 'common.black',
                    borderRadius: {xs: '0', sm: '20px'},
                    width: '100%',
                    gap: 2,
                    color: 'common.white'
                }}>
                    {
                        pictures?.length > 0 && (
                            <CardMedia
                                component="img"
                                image={pictures[0]?.url}
                                alt="card image"
                                sx={{
                                    borderRadius: {xs: 0, sm: "10px"},
                                    height: {xs: '200px', sm: '150px', lg: '200px'},
                                    "@media screen and (max-width: 700px && min-width: 600px)":{
                                        width: '200px'
                                    },
                                    width: {xs: '100%', sm: '250px', lg: '300px'},
                                }}
                            />
                        )
                    }
                    <Box sx={{
                        display: 'flex',
                        width: {xs: '100%', sm: 'calc(100% - 250px)', lg: 'calc(100% - 300px)'},
                        "@media screen and (max-width: 700px && min-width: 600px)":{
                            width: 'calc(100% - 200px)'
                        },
                        flexDirection: 'column',
                        p: {xs: '0 16px 16px 16px', sm: '0 0 10px 0'},
                        justifyContent: 'space-between'
                    }}>
                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            gap: 1,
                            alignItems: 'center',
                            justifyContent: 'space-between'
                        }}>
                            <Box sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center',
                                gap: {xs: 2.5, md: 5}
                            }}>
                                <Typography sx={{
                                    fontSize: {xs: '1rem', sm: '1.2rem', md: '1.5rem'},
                                    "@media screen and (max-width: 950px && min-width: 900px)":{
                                        fontSize: '1.3rem'
                                    },
                                    fontWeight: 700
                                }}>
                                    {currentTitle}
                                    {isSplicedTitle && '...'}
                                </Typography>
                                <Typography sx={{
                                    color: 'common.black',
                                    bgcolor: 'common.white',
                                    p: '5px 10px',
                                    borderRadius: '7px',
                                    fontWeight: 500,
                                    fontSize: {sm: '0.875rem', md: '1rem'},
                                    "@media screen and ((max-width: 1000px && min-width: 900px) || max-width: 600px)":{
                                        fontSize: '0.875rem'
                                    },
                                }}>
                                    {translate(`home.create.type.${type}`)}
                                </Typography>
                            </Box>
                            <Box sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1
                            }}>
                                <BookMarkButton
                                    id={_id}
                                    bgColor={'transparent'}
                                    color={'common.white'}
                                    type={'institution'}
                                    showText={false}
                                    style={{
                                        // p: '5px',
                                        // borderRadius: '5px',
                                        minWidth: '20px',
                                        // bgcolor: mode === 'dark' ? '#86a8cf' : '#e6f2ff',
                                        // "& svg": {
                                        //     fontSize: {xs: '26px', sm: '30px'}
                                        // }
                                    }}
                                />
                                <Box sx={{
                                    // backdropFilter: 'blur(20px)',
                                    // bgcolor: mode === 'dark' ? 'rgba(255,255,255,0.7)' : 'rgba(0, 0, 0, 0.5)',
                                    // borderRadius: '5px'
                                }}>
                                    <SharedComponent
                                        type={'institution'}
                                        color={'commn.black'}
                                        url={`${CLIENT_URL}/all_institutions/show/${_id}`}
                                        title={translate('buttons.share')}
                                        isOnlyShared={true}
                                        name={establishment?.title}
                                    />
                                </Box>
                            </Box>
                        </Box>
                        <Box>
                            <Box sx={{
                                display: 'flex',
                                gap: 1,
                                alignItems: 'center',
                                fontSize: {xs: '1.5rem', md: '2rem'}
                            }}>
                                <Star sx={{color: 'yellow'}}/>
                                {rating > 0 ? rating?.toFixed(2) : rating}
                                <Box
                                    component={'span'}
                                    sx={{
                                        margin: '0 5px',
                                        fontSize: '14px',
                                        color: 'silver'
                                    }}
                                >
                                    ({establishment?.reviewsLength})
                                </Box>
                            </Box>
                        </Box>
                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between'
                        }}>
                            <Box sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                gap: 1,
                                justifyContent: 'start',
                                alignItems: 'center',
                                colro: mode === "dark" ? '#f1e6e6' : "#1d1a39"
                            }}>
                                <Place
                                    sx={{
                                        fontSize: 24,
                                        color: "secondary.main",
                                    }}
                                />
                                <Box sx={{
                                    fontSize: '16px',
                                    display: 'flex',
                                    height: '50px',
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }}>
                                    {
                                        place?.city
                                    }
                                </Box>
                            </Box>
                            <Box sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center',
                                gap: 1
                            }}>
                                <Box component={"span"}>
                                    {translate("home.create.averageCheck")}
                                </Box>
                                <Box>
                                    ~ ₴ {averageCheck}
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </Link>
        </Box>
    );
};
export default Variant2EstablishmentCard;

import {Box, CardMedia, Paper, Typography} from "@mui/material";
import React, {useContext, useEffect, useRef, useState} from "react";
import {Link} from "react-router-dom";
import {useTranslate} from "@refinedev/core";
import {Place, StarRounded} from "@mui/icons-material";

import {BookMarkButton} from "../index";
import {IEstablishment} from "@/interfaces/common";
import {ColorModeContext} from "@/contexts";
import SharedComponent from "../common/shared/sharedComponent";
import {useMobile, useNavigateWithTransition} from "@/hook";
import {ESTABLISHMENT, SHOW} from "@/config/names";
import {TruncateSingleText} from "@/utils";
import {CardSchedules} from "@/components/cards/utils/cardSchedules";

interface IProps {
    establishment: IEstablishment,
    elevation?: number
}

const CLIENT_URL = import.meta.env.VITE_APP_CLIENT_API;

const EstablishmentCard = ({establishment, elevation = 4}: IProps) => {

    const navigateWithTransition = useNavigateWithTransition();
    const {width} = useMobile();
    const {mode, collapsed} = useContext(ColorModeContext);
    const translate = useTranslate();

    const {_id, type, place, pictures, rating, title, workSchedule, averageCheck} = establishment;

    const linkTo = `/${ESTABLISHMENT}/show/${establishment?._id}`;

    const parentTitleRef = useRef<null | HTMLDivElement>(null);

    const [parentTitleWidth, setParentTitleWidth] = useState<number>(200);

    useEffect(() => {
        function handleResize() {
            if (parentTitleRef.current) {
                setParentTitleWidth(Math.min(parentTitleRef.current?.offsetWidth))
            }
        }

        window.addEventListener("resize", handleResize);
        handleResize();
        return () => window.removeEventListener("resize", handleResize);
    }, [parentTitleRef?.current?.offsetWidth, title, workSchedule, width, collapsed]);

    return (
        <Paper
            sx={{
                width: '100%',
                borderRadius: {xs: '16px', sm: '20px'},
                bgcolor: 'unset',
                overflow: 'hidden'
            }}
            elevation={elevation}
        >
            <Link
                unstable_viewTransition
                style={{
                    textDecoration: 'none',
                    width: '100%',
                    viewTransitionName: `establishment${establishment?._id}`,
                    // contain: 'paint',
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
                    // boxShadow: {xs: 'unset', sm: '0px 4px 8px 0px rgba(125, 125, 125, 0.2)'},
                    // bgcolor: 'common.black',
                    borderRadius: {xs: '16px', sm: '20px'},
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
                                    height: {xs: '200px', sm: '185px', lg: '200px'},
                                    "@media screen and (600px <= width < 700px)": {
                                        width: '200px'
                                    },
                                    "@media screen and (max-width: 600px)": {
                                        borderTopLeftRadius: '16px',
                                        borderTopRightRadius: '16px',
                                    },
                                    width: {xs: '100%', sm: '200px', xl: '300px'},
                                }}
                            />
                        )
                    }
                    <Box
                        ref={parentTitleRef}
                        sx={{
                            display: 'flex',
                            width: {xs: '100%', sm: 'calc(100% - 200px)', xl: 'calc(100% - 300px)'},
                            "@media screen and (600px <= width < 700px)": {
                                width: 'calc(100% - 200px)'
                            },
                            flexDirection: 'column',
                            p: {xs: '0 16px 16px 16px', sm: '0'},
                            justifyContent: 'space-between',
                            overflow: 'hidden'
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
                                // gap: {xs: 2.5, md: 5},
                                width: `calc(100% - 200px)`,
                                minWidth: '130px'
                            }}>
                                <Box sx={{
                                    fontSize: {xs: '1.2rem', sm: '1.2rem', md: '1.5rem'},
                                    "@media screen and (max-width: 950px && min-width: 900px)": {
                                        fontSize: '1.3rem'
                                    },
                                    width: `100%`,
                                    minWidth: '130px',
                                    fontWeight: 700,
                                }}>
                                    <TruncateSingleText
                                        styles={{
                                            // width: {
                                            //     // xs: `calc(${parentTitleWidth}px - 205px)`,
                                            //     // sm: `calc(${parentTitleWidth}px - 200px)`
                                            //     sm: `calc(100% - 200px)`
                                            // },
                                            width: `100%`,
                                            minWidth: '130px'
                                        }}
                                        str={title}/>
                                </Box>
                            </Box>
                            <Box sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1
                            }}>
                                <Typography sx={{
                                    color: 'common.black',
                                    bgcolor: 'common.white',
                                    p: '5px 10px',
                                    borderRadius: '7px',
                                    fontWeight: 500,
                                    fontSize: {xs: '0.775rem', sm: '0.875rem', md: '1rem'},
                                    "@media screen and ((max-width: 1000px && min-width: 900px) || max-width: 600px)": {
                                        fontSize: '0.875rem'
                                    },
                                }}>
                                    {translate(`home.create.type.${type}`)}
                                </Typography>
                                <BookMarkButton
                                    id={_id}
                                    title={establishment?.title}
                                    bgColor={'transparent'}
                                    color={'common.white'}
                                    type={'establishment'}
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
                                        type={'establishment'}
                                        color={'commn.black'}
                                        url={`${CLIENT_URL}/${ESTABLISHMENT}/${SHOW}/${_id}`}
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
                                <StarRounded sx={{color: 'info.main'}}/>
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
                        <Box>
                            {
                                establishment?.workSchedule && (
                                    <CardSchedules
                                        parentWidth={parentTitleWidth}
                                        workSchedule={workSchedule}/>
                                )
                            }
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
                                    height: '30px',
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
        </Paper>
    );
};
export default EstablishmentCard;

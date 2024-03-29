import {Place, Star} from "@mui/icons-material";
import {
    Typography,
    Box,
    Card,
    CardMedia,
    CardContent,
    Stack, Paper,
} from "@mui/material";
import dayjs from "dayjs";
import {Link} from "react-router-dom";
import {useTranslation} from "react-i18next";
import relativeTime from "dayjs/plugin/relativeTime"
import {useTranslate} from "@refinedev/core";
import React, {useContext, useEffect} from "react";

import {IEstablishment} from "@/interfaces/common";
import {ColorModeContext} from "@/contexts";
import BookMarkButton from "@/components/buttons/BookMarkButton";
import 'dayjs/locale/uk';
import 'dayjs/locale/en';
import {tagStyle} from "@/styles";
import SharedComponent from "../common/shared/sharedComponent";
import {useMobile, useNavigateWithTransition} from "@/hook";
import {ESTABLISHMENT, SHOW} from "@/config/names";
import {TruncateSingleText} from "@/utils"

dayjs.extend(relativeTime);

interface IProps {
    establishment: IEstablishment,
}

const CLIENT_URL = import.meta.env.VITE_APP_CLIENT_API;
const Variant1EstablishmentCard = ({
                                       establishment,
                                   }: IProps) => {
    const {_id, type, place, pictures, rating, title, averageCheck} = establishment;

    const navigateWithTransition = useNavigateWithTransition();
    const translate = useTranslate();
    const {i18n} = useTranslation();
    const {width} = useMobile();
    const {mode} = useContext(ColorModeContext);
    const color = mode === "dark" ? '#f1e6e6' : "#1d1a39";

    useEffect(() => {
        i18n.language === "ua" ? dayjs.locale('uk') : dayjs.locale('en')
    }, [i18n.language])


    const lL = width < 450 ? 15 : (width > 600 && width < 700) ? 30 : 20;
    const currentTitle = title?.length > lL ? title?.slice(0, lL) : title;

    const isSplicedTitle = title?.length > lL;

    const linkTo = `/${ESTABLISHMENT}/${SHOW}/${establishment?._id}`;

    return (
        <Paper
            sx={{
                width: '100%',
                // borderRadius: {xs: '16px', sm: '20px'},
                borderRadius: '10px',
            }}
            elevation={4}
        >
            <Link
                unstable_viewTransition
                to={linkTo}
                onClick={(event) => {
                    event.preventDefault();
                    navigateWithTransition(linkTo)
                }}
                style={{
                    textDecoration: 'none',
                    cursor: 'pointer',
                    // contain: 'paint',
                    viewTransitionName: `establishment${establishment?._id}`,
                }}
            >
                <Card
                    color={"default"}
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        width: '100%',
                        p: '7px',
                        height: '100%',
                        gap: 2,
                        borderRadius: '10px',
                        transition: '0.3s linear',
                        "&:hover": {
                            boxShadow: "0 22px 45px 2px rgba(176, 176, 176, 0.1)",
                        },
                        bgcolor: mode === "dark" ? "#000" : "#fff",
                        boxShadow: `0px 0px 10px 1px ${mode === 'dark' ? '#453636' : '#ebe3e3'}`
                    }}
                    elevation={0}
                >
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 1,
                        position: 'relative'
                    }}>
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: {xs: 'column', sm: 'row'},
                                gap: 0.5,
                                justifyContent: 'center',
                                alignItems: 'center',
                                position: 'absolute',
                                right: '-5px',
                                top: '-5px',
                                zIndex: 6,
                                borderRadius: '10px',
                            }}
                        >
                            <BookMarkButton
                                style={{
                                    minWidth: '30px',
                                    bgcolor: '#f5841a',
                                    // width: '40px',
                                    borderRadius: '5px',
                                    p: '5px'
                                }}
                                showText={false} bgColor={'#f5841a'}
                                color={'common.white'} id={_id} type={'establishment'}/>
                            <Box sx={{
                                backdropFilter: 'blur(10px)',
                                bgcolor: mode === 'dark' ? 'rgba(255,255,255,0.7)' : 'rgba(0, 0, 0, 0.4)',
                                borderRadius: '5px'
                            }}>
                                <SharedComponent
                                    type={'establishment'}
                                    isOnlyShared={true}
                                    color={mode === 'dark' ? '#000' : '#fff'}
                                    url={`${CLIENT_URL}/${ESTABLISHMENT}/${SHOW}/${_id}`}
                                    title={translate('buttons.share')}
                                    name={establishment?.title}
                                />
                            </Box>
                            {/*<Button*/}
                            {/*    onClick={handleShare}*/}
                            {/*>*/}
                            {/*    SHARE*/}
                            {/*</Button>*/}
                        </Box>
                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            position: 'relative',
                            zIndex: 5,
                        }}>
                            {
                                pictures?.length > 0 && (
                                    <CardMedia
                                        component="img"
                                        image={pictures[0].url}
                                        alt="card image"
                                        sx={{
                                            borderRadius: "10px",
                                            height: {xs: 150, sm: 200},
                                            width: '100%',
                                        }}
                                    />
                                )
                            }
                            <Box color={"default"} sx={{
                                display: 'flex',
                                textDecoration: 'none',
                                flexDirection: 'row',
                                gap: 1,
                            }}>
                                <CardContent
                                    sx={{
                                        display: "flex",
                                        flexDirection: "column",
                                        justifyContent: "space-between",
                                        gap: 1,
                                        mt: '5px',
                                        width: '100%',
                                        p: 0,
                                        ":last-child": {
                                            p: 0
                                        }
                                    }}
                                >
                                    <Box sx={{
                                        display: 'flex',
                                        width: '100%',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        gap: 1,
                                        flexWrap: 'wrap'
                                    }}>
                                        <Box sx={{
                                            display: 'flex',
                                            gap: 0.3,
                                            alignItems: 'center'
                                        }}>
                                            <Star sx={{
                                                color: 'yellow',
                                                width: '0.8em',
                                                height: '0.8em'
                                            }}/>
                                            {rating > 0 ? rating?.toFixed(2) : rating}
                                            <Box
                                                component={'span'}
                                                sx={{
                                                    margin: '0 5px',
                                                    fontSize: '12px',
                                                    color: 'silver'
                                                }}
                                            >
                                                ({establishment?.reviewsLength})
                                            </Box>
                                        </Box>
                                        <Typography sx={{
                                            display: 'flex',
                                            justifyContent: 'start',
                                            alignItems: 'center',
                                            fontSize: {xs: '12px', sm: '14px'},
                                            ...tagStyle,
                                            p: '3px 7px',
                                            color: 'info.contrastText',
                                            bgcolor: 'info.main',
                                            position: 'absolute',
                                            transformOrigin: 'top',
                                            top: 0,
                                            left: 0,
                                            transform: 'rotate(-45deg) translate(-35%, -30%)'
                                        }}>
                                            {
                                                translate(`home.create.type.${type}`)
                                            }
                                        </Typography>
                                    </Box>
                                </CardContent>
                            </Box>
                        </Box>
                        <Box
                            sx={{
                                fontSize: {xs: '16px', sm: '18px'},
                                fontWeight: 700,
                                m: 0,
                                display: 'flex',
                                justifyContent: 'start',
                                alignItems: 'center',
                                textTransform: 'capitalize',
                                color: 'common.white',
                                backdropFilter: 'blur(10px)',
                            }}>
                            {TruncateSingleText({width: '145px', str: title})}
                        </Box>
                        <Box color={"default"} sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            textDecoration: 'none',
                            gap: 0.5
                        }}>
                            <Stack direction="row" gap={0.5} justifyContent={"start"} color={color} alignItems="center">
                                <Place
                                    sx={{
                                        fontSize: 20,
                                        color: "secondary.main",
                                    }}
                                />
                                <Box sx={{
                                    fontSize: '12px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                }}>
                                    <div>
                                        {
                                            place?.city
                                        }
                                    </div>
                                </Box>
                            </Stack>
                            <Stack sx={{
                                bgcolor: 'cornflowerblue',
                                p: '3px 5px',
                                display: 'flex',
                                alignItems: 'center',
                                flexDirection: 'row',
                                // width: 'fit-content',
                                justifyContent: 'center',
                                gap: 1,
                                m: '5px 0',
                                width: '100%',
                                fontSize: {xs: '12px', sm: '14px'},
                                color: 'common.white',
                                flexWrap: 'wrap',
                                borderRadius: '7px'
                            }}>
                                <Box component={"span"}>
                                    {translate("home.create.averageCheck")}
                                </Box>
                                <Box>
                                    ~ ₴ {averageCheck}
                                </Box>
                            </Stack>
                        </Box>
                    </Box>
                </Card>
            </Link>
        </Paper>
    );
};

export default Variant1EstablishmentCard;
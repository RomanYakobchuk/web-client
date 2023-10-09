import {Place, Star} from "@mui/icons-material";
import {
    Typography,
    Box,
    Card,
    CardMedia,
    CardContent,
    Stack,
} from "@mui/material";
import dayjs from "dayjs";
import {Link} from "react-router-dom";
import {useTranslation} from "react-i18next";
import relativeTime from "dayjs/plugin/relativeTime"
import {useGetIdentity, useTranslate} from "@refinedev/core";
import React, {useContext, useEffect} from "react";

import {IGetIdentity, ProfileProps, PropertyProps} from "../../../interfaces/common";
import {ColorModeContext} from "../../../contexts";
import BookMarkButton from "../../common/buttons/BookMarkButton";
import 'dayjs/locale/uk';
import 'dayjs/locale/en';
import {tagStyle} from "../../../styles";

dayjs.extend(relativeTime);

interface IProps {
    institution: PropertyProps,
}

const Variant1EstablishmentCard = ({
                                       institution,
                                   }: IProps) => {
    const {_id, type, place, pictures, rating, title, averageCheck, createdBy} = institution;

    const translate = useTranslate();
    const {i18n} = useTranslation();
    const {mode} = useContext(ColorModeContext);
    const {data: identity} = useGetIdentity<IGetIdentity>();
    const user: ProfileProps = identity?.user as ProfileProps;
    const color = mode === "dark" ? '#f1e6e6' : "#1d1a39";

    useEffect(() => {
        i18n.language === "ua" ? dayjs.locale('uk') : dayjs.locale('en')
    }, [i18n.language])

    return (
        <Link
            to={`/all_institutions/show/${_id}`}
            style={{
                textDecoration: 'none'
            }}
        >
            <Card
                color={"default"}
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    width: '100%',
                    p: '10px',
                    height: '100%',
                    gap: 2,
                    borderRadius: '20px',
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
                    gap: 1
                }}>
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        position: 'relative',
                        zIndex: 5,
                    }}>
                        <Box sx={{
                            position: 'relative'
                        }}>
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
                            <Typography
                                sx={{
                                    fontSize: {xs: '16px', sm: '18px'},
                                    fontWeight: 700,
                                    m: 0,
                                    display: 'flex',
                                    position: 'absolute',
                                    bottom: 0,
                                    left: 0,
                                    justifyContent: 'start',
                                    alignItems: 'center',
                                    textTransform: 'capitalize',
                                    borderRadius: '0 0 7px 7px',
                                    p: '5px 10px',
                                    color: '#fff',
                                    bgcolor: 'rgba(0, 0, 0, 0.4)',
                                    backdropFilter: 'blur(10px)',
                                    width: '100%',
                                }}>
                                "{title}"
                            </Typography>
                        </Box>
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                position: 'absolute',
                                right: '-1px',
                                top: '-1px',
                                zIndex: 20,
                            }}
                        >
                            <BookMarkButton showText={false} bgColor={mode === "dark" ? '#000' : '#fff'}
                                            color={'common.white'} id={_id} type={'favoritePlaces'}/>
                        </Box>
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
                                        gap: 1,
                                        alignItems: 'center'
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
                                            ({institution?.reviewsLength})
                                        </Box>
                                    </Box>
                                    <Typography sx={{
                                        display: 'flex',
                                        justifyContent: 'start',
                                        alignItems: 'center',
                                        fontSize: {xs: '12px', sm: '14px'},
                                        ...tagStyle,
                                        p: '5px 10px',
                                        color: 'info.contrastText',
                                        bgcolor: 'info.main',
                                    }}>
                                        {
                                            translate(`home.create.type.${type}`)
                                        }
                                    </Typography>
                                </Box>
                            </CardContent>
                        </Box>
                    </Box>
                    <Box color={"default"} sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        textDecoration: 'none',
                    }}>
                        <Stack direction="row" gap={0.5} justifyContent={"start"} color={color} alignItems="center">
                            <Place
                                sx={{
                                    fontSize: 24,
                                    color: "secondary",
                                }}
                            />
                            <Box sx={{
                                fontSize: '16px',
                                display: 'flex',
                                height: '50px',
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
                            p: '5px 10px',
                            display: 'flex',
                            alignItems: 'center',
                            flexDirection: 'row',
                            width: 'fit-content',
                            justifyContent: 'center',
                            gap: 1,
                            m: '5px 0',
                            ...tagStyle,
                            fontSize: {xs: '12px', sm: '14px'},
                            color: 'common.white',
                            flexWrap: 'wrap'
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
    );
};

export default Variant1EstablishmentCard;
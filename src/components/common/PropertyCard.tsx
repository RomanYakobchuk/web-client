import {DateRangeOutlined, EastOutlined, Place} from "@mui/icons-material";
import {
    Typography,
    Box,
    Card,
    CardMedia,
    CardContent,
    Stack, Rating, Button, Link,
} from "@mui/material";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime"
import {ProfileProps, PropertyProps} from "../../interfaces/common";
import {useGetIdentity, useTranslate} from "@refinedev/core";
import React, {useContext, useEffect, useState} from "react";
import {ColorModeContext} from "../../contexts";
import MDEditor from "@uiw/react-md-editor";
import BookMark from "./BookMark";
import {useNavigate} from "react-router-dom";
import {useTranslation} from "react-i18next";
import 'dayjs/locale/uk';
import 'dayjs/locale/en';

dayjs.extend(relativeTime);
const PropertyCard = ({
                          mainPhoto,
                          createdBy,
                          description,
                          otherPhoto,
                          type,
                          place,
                          _id,
                          title,
                          rating,
                          tags,
                          verify,
                          location,
                          contacts,
                          features,
                          workSchedule,
                          averageCheck,
                          createdAt,
                          otherProps: setFavoritePlaces
                      }: PropertyProps) => {

    const translate = useTranslate();
    const {i18n} = useTranslation();
    const {mode} = useContext(ColorModeContext);
    const {data: user} = useGetIdentity<ProfileProps>();
    const navigate = useNavigate();
    const color = mode === "dark" ? '#fcfcfc' : "#000";

    const [openDesc, setOpenDesc] = useState(false)

    useEffect(() => {
        i18n.language === "ua" ? dayjs.locale('uk') : dayjs.locale('en')
    }, [i18n.language])

    return (
        <Card
            color={"default"}
            sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                width: '100%',
                padding: "10px",
                gap: 2,
                height: 'auto',
                transition: '0.3s linear',
                "&:hover": {
                    boxShadow: "0 22px 45px 2px rgba(176, 176, 176, 0.1)",
                },
                bgcolor: mode === "dark" ? "#605454" : "#ffffff",
            }}
            elevation={0}
        >
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2
            }}>
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    position: 'relative',
                    zIndex: 10,
                }}>
                    <Box color={"default"} sx={{
                        display: 'flex',
                        textDecoration: 'none',
                        flexDirection: 'row',
                        gap: 2,
                    }}>
                        <CardMedia
                            component="img"
                            image={mainPhoto}
                            alt="card image"
                            sx={{
                                borderRadius: "10px",
                                height: 100,
                                width: 120,
                            }}
                        />
                        <CardContent
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "space-between",
                                gap: "10px",
                                p: 0,
                                ":last-child": {
                                    p: 0
                                }
                            }}
                        >
                            <Rating precision={0.5} name="read-only" value={rating} readOnly/>
                            <Typography sx={{
                                display: 'flex',
                                justifyContent: 'start',
                                alignItems: 'center',
                                fontSize: 16,
                                color: color
                            }}>
                                {
                                    translate(`home.create.type.${type}`)
                                }
                            </Typography>
                            <Typography
                                sx={
                                    {
                                        fontSize: '18px',
                                        m: 0,
                                        display: 'flex',
                                        justifyContent: 'start',
                                        alignItems: 'center',
                                        textTransform: 'capitalize',
                                        color: mode === "dark" ? '#fcfcfc' : "#000"
                                    }
                                } fontWeight={700} color="default">
                                "{title}"
                            </Typography>
                        </CardContent>
                    </Box>
                    {
                        createdBy !== user?._id &&
                        <Box sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            position: 'absolute',
                            height: '100%',
                            right: 0,
                            zIndex: 20
                        }}>
                            <BookMark color={mode === "dark" ? '#fcfcfc' : '#000'} otherProps={setFavoritePlaces}
                                      id={_id} type={'favoritePlaces'}/>
                        </Box>
                    }
                </Box>
                <Box color={"default"} sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    textDecoration: 'none',
                }}>
                    <Stack direction="row" gap={0.5} justifyContent={"start"} color={color} alignItems="center">
                        <Place
                            sx={{
                                fontSize: 18,
                                color: "secondary",
                            }}
                        />
                        <Typography sx={{
                            fontSize: {xs: '14px', sm: '16px'},
                            display: 'flex',
                            justifyContent: 'start',
                            alignItems: 'center'
                        }} color="main">
                            {
                                place.address
                            }
                        </Typography>
                    </Stack>
                    <Stack sx={{
                        bgcolor: 'cornflowerblue',
                        p: '5px 10px',
                        borderRadius: '5px',
                        display: 'flex',
                        alignItems: 'center',
                        flexDirection: 'row',
                        width: 'fit-content',
                        justifyContent: 'center',
                        gap: 1,
                        m: '5px 0'
                    }}>
                        <Box component={"span"}>
                            {translate("home.create.averageCheck")}
                        </Box>
                        <Box>
                            ~ ₴ {averageCheck}
                        </Box>
                    </Stack>
                    {
                        openDesc ?
                            <>
                                <hr style={{width: '100%', color: color}}/>
                                <MDEditor.Markdown
                                    source={description?.split(' ').length > 20 ? description?.split(' ')?.slice(0, 50)?.join() + ' ...' : description}
                                    style={{
                                        whiteSpace: 'pre-wrap',
                                        fontSize: '14px',
                                        color: mode === "dark" ? '#fcfcfc' : '#000',
                                        background: 'transparent'
                                    }}/>
                                <hr style={{width: '100%', color: color}}/>
                                <Link
                                    sx={{
                                        m: '5px 0',
                                        cursor: 'pointer',
                                        color: mode === "dark" ? "#fcfcfc" : '#000',
                                        display: 'flex',
                                        justifyContent: 'start',
                                        fontSize: '14px'
                                    }}
                                    onClick={() => setOpenDesc(false)}>
                                    {translate("buttons.close")}
                                </Link>
                            </>
                            : <Link
                                sx={{
                                    m: '5px 0',
                                    cursor: 'pointer',
                                    color: mode === "dark" ? "#fcfcfc" : '#000',
                                    display: 'flex',
                                    justifyContent: 'start',
                                    fontSize: '14px'
                                }}
                                onClick={() => setOpenDesc(true)}>
                                {translate("home.create.description")}
                            </Link>
                    }
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
                    alignItems: 'center',
                    gap: 1,
                }}>
                    <DateRangeOutlined/>
                    <Typography>
                        {
                            dayjs(createdAt).fromNow()
                        }
                    </Typography>
                </Box>
                <Button
                    color={"secondary"}
                    variant={"outlined"}
                    onClick={() => navigate(`/all_institutions/show/${_id}`)}
                    endIcon={<EastOutlined/>}
                >
                    {translate("buttons.details")}
                </Button>
            </Box>
        </Card>
    );
};

export default PropertyCard;
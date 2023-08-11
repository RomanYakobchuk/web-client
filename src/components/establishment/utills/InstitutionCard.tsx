import {EastOutlined, Place} from "@mui/icons-material";
import {
    Typography,
    Box,
    Card,
    CardMedia,
    CardContent,
    Stack, Rating, Button,
} from "@mui/material";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime"
import {IGetIdentity, ProfileProps, PropertyProps} from "../../../interfaces/common";
import {useGetIdentity, useTranslate} from "@refinedev/core";
import React, {useContext, useEffect} from "react";
import {ColorModeContext} from "../../../contexts";
import BookMark from "../../common/BookMark";
import {useNavigate} from "react-router-dom";
import {useTranslation} from "react-i18next";
import 'dayjs/locale/uk';
import 'dayjs/locale/en';
import {tagStyle} from "../../../styles";

dayjs.extend(relativeTime);

interface IProps {
    institution: PropertyProps,
    otherProps: any
}

const InstitutionCard = ({
                             institution,
                             otherProps: setFavoritePlaces
                         }: IProps) => {
    const {_id, type, place, mainPhoto, rating, title, averageCheck, createdBy} = institution;

    const translate = useTranslate();
    const {i18n} = useTranslation();
    const {mode} = useContext(ColorModeContext);
    const {data: identity} = useGetIdentity<IGetIdentity>();
    const user: ProfileProps = identity?.user as ProfileProps;
    const navigate = useNavigate();
    const color = mode === "dark" ? '#fcfcfc' : "#000";

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
                p: '10px',
                gap: 2,
                borderRadius: '20px',
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
                gap: 1
            }}>
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative',
                    zIndex: 5,
                }}>
                    <CardMedia
                        component="img"
                        image={mainPhoto}
                        alt="card image"
                        sx={{
                            borderRadius: "10px",
                            height: 200,
                            width: '100%',
                        }}
                    />
                    {
                        createdBy !== user?._id &&
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                position: 'absolute',
                                right: 0,
                                top: 0,
                                zIndex: 20,
                            }}
                        >
                            <BookMark showText={false} color={mode === "dark" ? '#fcfcfc' : '#000'} otherProps={setFavoritePlaces}
                                      id={_id} type={'favoritePlaces'}/>
                        </Box>
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
                                justifyContent: 'space-between'
                            }}>
                                <Rating precision={0.5} name="read-only" value={rating} readOnly/>
                                <Typography sx={{
                                    display: 'flex',
                                    justifyContent: 'start',
                                    alignItems: 'center',
                                    fontSize: 14,
                                    ...tagStyle,
                                    p: '5px 10px',
                                    color: (theme) => theme.palette.info.contrastText,
                                    bgcolor: (theme) => theme.palette.info.main
                                }}>
                                    {
                                        translate(`home.create.type.${type}`)
                                    }
                                </Typography>
                            </Box>
                            <Typography
                                sx={{
                                    fontSize: '16px',
                                    fontWeight: 700,
                                    m: 0,
                                    display: 'flex',
                                    justifyContent: 'start',
                                    alignItems: 'center',
                                    textTransform: 'capitalize',
                                    ...tagStyle,
                                    width: 'fit-content',
                                    p: '5px 10px',
                                    color: (theme) => theme.palette.common.black,
                                    bgcolor: (theme) => theme.palette.common.white

                                    // color: mode === "dark" ? '#fcfcfc' : "#000"
                                }}>
                                "{title}"
                            </Typography>
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
                            fontSize: '12px',
                            display: 'flex',
                            height: '50px',
                            flexDirection: 'column',
                            justifyContent: 'center',
                        }} color="main">
                            <div>
                                {
                                    place?.city
                                }
                            </div>
                            <div>
                                {
                                    place?.address
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
                        color: (theme) => theme.palette.common.white
                    }}>
                        <Box component={"span"}>
                            {translate("home.create.averageCheck")}
                        </Box>
                        <Box>
                            ~ ₴ {averageCheck}
                        </Box>
                    </Stack>
                    {/*{*/}
                    {/*    openDesc ?*/}
                    {/*        <>*/}
                    {/*            <hr style={{width: '100%', color: color}}/>*/}
                    {/*            <MDEditor.Markdown*/}
                    {/*                source={description?.split(' ').length > 20 ? description?.split(' ')?.slice(0, 50)?.join() + ' ...' : description}*/}
                    {/*                style={{*/}
                    {/*                    whiteSpace: 'pre-wrap',*/}
                    {/*                    fontSize: '14px',*/}
                    {/*                    color: mode === "dark" ? '#fcfcfc' : '#000',*/}
                    {/*                    background: 'transparent'*/}
                    {/*                }}/>*/}
                    {/*            <hr style={{width: '100%', color: color}}/>*/}
                    {/*            <Link*/}
                    {/*                sx={{*/}
                    {/*                    m: '5px 0',*/}
                    {/*                    cursor: 'pointer',*/}
                    {/*                    color: mode === "dark" ? "#fcfcfc" : '#000',*/}
                    {/*                    display: 'flex',*/}
                    {/*                    justifyContent: 'start',*/}
                    {/*                    fontSize: '14px'*/}
                    {/*                }}*/}
                    {/*                onClick={() => setOpenDesc(false)}>*/}
                    {/*                {translate("buttons.close")}*/}
                    {/*            </Link>*/}
                    {/*        </>*/}
                    {/*        : <Link*/}
                    {/*            sx={{*/}
                    {/*                m: '5px 0',*/}
                    {/*                cursor: 'pointer',*/}
                    {/*                color: mode === "dark" ? "#fcfcfc" : '#000',*/}
                    {/*                display: 'flex',*/}
                    {/*                justifyContent: 'start',*/}
                    {/*                fontSize: '14px'*/}
                    {/*            }}*/}
                    {/*            onClick={() => setOpenDesc(true)}>*/}
                    {/*            {translate("home.create.description")}*/}
                    {/*        </Link>*/}
                    {/*}*/}
                </Box>
            </Box>
            <Box sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <Button
                    variant={"contained"}
                    sx={{
                        width: '100%',
                        borderRadius: '20px',
                        bgcolor: (theme) => theme.palette.common.black
                    }}
                    onClick={() => navigate(`/all_institutions/show/${_id}`)}
                    endIcon={<EastOutlined/>}
                >
                    {translate("buttons.details")}
                </Button>
            </Box>
        </Card>
    );
};

export default InstitutionCard;
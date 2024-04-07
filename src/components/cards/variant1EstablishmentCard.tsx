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
import relativeTime from "dayjs/plugin/relativeTime"
import {useTranslate} from "@refinedev/core";
import React, {useContext} from "react";

import {IEstablishment} from "@/interfaces/common";
import {ColorModeContext} from "@/contexts";
import BookMarkButton from "@/components/buttons/BookMarkButton";
import SharedComponent from "../common/shared/sharedComponent";
import {useNavigateWithTransition} from "@/hook";
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
    const {mode} = useContext(ColorModeContext);
    const color = mode === "dark" ? '#f1e6e6' : "#1d1a39";

    const linkTo = `/${ESTABLISHMENT}/${SHOW}/${establishment?._id}`;

    return (
        <Paper
            sx={{
                width: '100%',
                borderRadius: '10px',
                overflow: 'hidden',
                color: 'common.white'
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
                        bgcolor: 'common.black',
                        boxShadow: `0px 0px 10px 1px ${mode === 'dark' ? '#453636' : '#ebe3e3'}`
                    }}
                    elevation={0}
                >
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        width: '100%',
                        position: 'relative',
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
                                    p: {xs: '2px', sm: '4px'}
                                }}
                                showText={false} bgColor={'#f5841a'}
                                color={'common.white'} id={_id} type={'establishment'}/>
                            <Box sx={{
                                backdropFilter: 'blur(10px)',
                                bgcolor: mode === 'dark' ? 'rgba(255,255,255,0.7)' : 'rgba(0, 0, 0, 0.4)',
                                borderRadius: '5px'
                            }}>
                                <SharedComponent
                                    sharedStyle={{
                                        p: {xs: '2px', sm: '4px'}
                                    }}
                                    type={'establishment'}
                                    isOnlyShared={true}
                                    color={"common.black"}
                                    url={`${CLIENT_URL}/${ESTABLISHMENT}/${SHOW}/${_id}`}
                                    title={translate('buttons.share')}
                                    name={establishment?.title}
                                />
                            </Box>
                        </Box>
                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            position: 'relative',
                            zIndex: 5,
                            width: '100%',
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
                            <Typography sx={{
                                display: 'flex',
                                justifyContent: 'start',
                                alignItems: 'center',
                                fontSize: {xs: '12px', sm: '14px'},
                                p: '3px 7px',
                                color: 'info.contrastText',
                                bgcolor: 'info.main',
                                position: 'absolute',
                                top: '-3px',
                                left: '-3px',
                                borderRadius: '7px'
                                // transformOrigin: 'top',
                                // transform: 'rotate(-45deg) translate(-35%, -30%)'
                            }}>
                                {
                                    translate(`home.create.type.${type}`)
                                }
                            </Typography>
                        </Box>
                        <Box
                            sx={{
                                width: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 0.5,
                            }}
                        >
                            <Box sx={{
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
                                    </Box>
                                </CardContent>
                            </Box>
                            <TruncateSingleText
                                styles={{
                                    color: 'common.white',
                                    fontSize: {xs: '16px', sm: '18px'},
                                    fontWeight: 700,
                                    width: 'fit-content',
                                    maxWidth: '100%'
                                }}
                                str={title}
                            />
                            <Box sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                textDecoration: 'none',
                                gap: 0.5
                            }}>
                                <Stack direction="row" gap={0.5} justifyContent={"start"} color={color}
                                       alignItems="center">
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
                                    display: 'flex',
                                    alignItems: 'center',
                                    flexDirection: 'row',
                                    justifyContent: 'end',
                                    // width: 'fit-content',
                                    gap: 1,
                                    mt: '5px',
                                    width: '100%',
                                    // flexWrap: 'wrap',
                                }}>
                                    {/*<Box component={"span"}>*/}
                                    {/*    {translate("home.create.averageCheck")}*/}
                                    {/*</Box>*/}
                                    <Box
                                        sx={{
                                            bgcolor: 'cornflowerblue',
                                            p: '4px 12px',
                                            fontSize: {xs: '14px', sm: '16px'},
                                            fontWeight: 600,
                                            color: '#f9f9f9',
                                            borderRadius: '10px'
                                        }}
                                    >
                                        ~ ₴ {averageCheck}
                                    </Box>
                                </Stack>
                            </Box>
                        </Box>
                    </Box>
                </Card>
            </Link>
        </Paper>
    );
};

export default Variant1EstablishmentCard;